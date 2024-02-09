var shortDis = null; //최단경로 길이
var shortTime = null; //최단경로를 가는데 걸리는 예상 시간

let timer; //현재 위치 추적 시 사용할 타이머
var userPos = null; //사용자의 현재위치
var prevUser = null; //사용자의 직전위치

//최단경로를 그리기 위한 폴리라인
var polyline = new kakao.maps.Polyline({
  strokeWeight: 5, // 선의 두께 입니다
  strokeColor: "#DC143C", // 선의 색깔입니다
  strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
  strokeStyle: "solid", // 선의 스타일입니다
});

//도착지 마커
var finishMarker = new kakao.maps.Marker({
  position: null,
});

//경로의 길이와 예상 소요 시간을 출력할 인포윈도우
var infowindow = new kakao.maps.InfoWindow({
  position: null,
  content: null,
});

//인포윈도우를 커스텀할 떄 요소들을 초기화할 때 사용할 변수
var initInfoWindow = null;

//정점의 ID, 위도, 경도 데이터
var vertexData = [];

//다익스트라 알고리즘 구현을 위한 클래스들
//1. 노드
class Node {
  constructor(val, priority) {
    this.val = val;
    this.priority = priority;
  }
}
//2. 우선순위 큐
class PriorityQueue {
  constructor() {
    this.values = [];
  }

  enqueue(val, priority) {
    let newNode = new Node(val, priority);
    this.values.push(newNode);
    this.bubbleUp();
  }

  bubbleUp() {
    let idx = this.values.length - 1;
    const element = this.values[idx];

    while (idx > 0) {
      let parentIdx = Math.floor((idx - 1) / 2);
      let parent = this.values[parentIdx];

      if (element.priority >= parent.priority) break;

      this.values[parentIdx] = element;
      this.values[idx] = parent;
      idx = parentIdx;
    }
  }

  dequeue() {
    const min = this.values[0];
    const end = this.values.pop();
    if (this.values.length > 0) {
      this.values[0] = end;
      this.sinkDown();
    }
    return min;
  }

  sinkDown() {
    let idx = 0;
    const length = this.values.length;
    const element = this.values[0];

    while (true) {
      let leftChildIdx = 2 * idx + 1;
      let rightChildIdx = 2 * idx + 2;
      let leftChild, rightChild;
      let swapIdx = null;

      if (leftChildIdx < length) {
        leftChild = this.values[leftChildIdx];
        if (leftChild.priority < element.priority) {
          swapIdx = leftChildIdx;
        }
      }

      if (rightChildIdx < length) {
        rightChild = this.values[rightChildIdx];

        if (
          (swapIdx === null && rightChild.priority < element.priority) ||
          (swapIdx !== null && rightChild.priority < leftChild.priority)
        ) {
          swapIdx = rightChildIdx;
        }
      }

      if (swapIdx === null) break;

      this.values[idx] = this.values[swapIdx];
      this.values[swapIdx] = element;
      idx = swapIdx;
    }
  }
}
//3. 가중치 그래프
class WeightedGraph {
  constructor() {
    this.adjacencyList = {}; //인접리스트
    this.setData();
  }

  addVertex(vertex) {
    //점 추가
    if (!this.adjacencyList[vertex]) this.adjacencyList[vertex] = []; //인접리스트 행 추가
  }

  addEdge(vertex1, vertex2, weight) {
    //간선 추가
    this.adjacencyList[vertex1].push({ node: vertex2, weight });
    this.adjacencyList[vertex2].push({ node: vertex1, weight });
  }

  setData(){
    //그래프 데이터 초기화
    //db에서 vertex의 모든 데이터 가져와서 데이터 삽입
    let vertexList = db.collection('vertex').find({}, {_id:0, name:1, lar:0, long:0}).toArray();
    vertexList.forEach(v => graph.addVertex(v));
    //edge의 모든 데이터 가져와서 간선 데이터 삽입
    let edgeList = db.collection('edge').find({}, {_id:0, v1:1, v2:1, distance:1}).toArray();
    edgeList.forEach((v1,v2,w) => graph.addEdge(v1,v2,e));
  }

  Dijkstra(start, finish) {
    //최단경로 알고리즘 : 다익스트라
    const nodes = new PriorityQueue();
    const distances = {};
    const previous = {};
    let path = []; //최단경로를 이루는 정점들을 저장할 배열
    let smallest;

    //2개의 점 사이의 거리 초기화
    for (let vertex in this.adjacencyList) {
      if (vertex === start) {
        //시점과 동일한 경우
        distances[vertex] = 0; //거리를 0으로 업데이트
        nodes.enqueue(vertex, 0); //우선순위 큐에 추가
      } else {
        //시점과 동일하지 않은 경우
        distances[vertex] = Infinity; //거리를 무한으로 업데이트
        nodes.enqueue(vertex, Infinity);
      }

      previous[vertex] = null;
    }

    // as long as there is something to visit
    while (nodes.values.length) {
      //우선순위 큐가 비어있지 않은 경우(=방문할 정점이 남아있는 경우)

      smallest = nodes.dequeue().val; //가장 작은 거리을 가지는 우선순위 큐에서 뺴냄

      if (smallest === finish) {
        shortDis = Math.round(distances[finish]);
        shortTime = Math.round(shortDis / 1.2 / 60);

        console.log(shortDis + "m");
        console.log("도보로 약 " + shortTime + "분이 소요됩니다.");

        //WE ARE DONE
        //BUILD UP PATH TO RETURN AT END
        while (previous[smallest]) {
          path.push(smallest);
          smallest = previous[smallest];
        }

        break;
      }

      if (smallest || distances[smallest] !== Infinity) {
        for (let neighbor in this.adjacencyList[smallest]) {
          //find neighboring node
          let nextNode = this.adjacencyList[smallest][neighbor];
          //calculate new distance to neighboring node
          let candidate = distances[smallest] + nextNode.weight;
          let nextNeighbor = nextNode.node;
          if (candidate < distances[nextNeighbor]) {
            //updating new smallest distance to neighbor
            distances[nextNeighbor] = candidate;
            //updating previous - How we got to neighbor
            previous[nextNeighbor] = smallest;
            //enqueue in priority queue with new priority
            nodes.enqueue(nextNeighbor, candidate);
          }
        }
      }
    }

    return path.concat(smallest).reverse();
  }
}

const graph = new WeightedGraph(); //그래프

//최단경로를 구하는 함수
function getShortCut() {
  var start = document.getElementById("start").value; //출발 건물
  var finish = document.getElementById("finish").value; //도착 건물
  var finishPos = null; //도착 건물의 좌표
  var linePath = []; //최단경로를 이루는 정점들의 좌표를 저장할 배열

  path = graph.Dijkstra(start, finish); //다익스트라 알고리즘을 통해 최단경로를 구성하는 정점들을 배열에 저장
  path.forEach(v => {
    console.log(v);

    var vertexData = db.collection('vertex').findOne({name: v}, {_id:0, _name:0});
    linePath.push(
      new kakao.maps.LatLng(vertexData.lat, vertexData.long)
    );
    if (v===finish) {
      finishPos = linepath[linePath.length-1];
    }
  });

  //최단경로
  polyline.setMap(null); //이전에 그려져있던 경로 삭제
  polyline.setPath(linePath);
  polyline.setMap(map); //지도에 경로 표시

  //도착지 마커
  finishMarker.setMap(null); //이전에 표시되어 있던 마커 삭제
  finishMarker.setPosition(finishPos);
  finishMarker.setMap(map); //지도에 마커 표시

  // 인포윈도우
  infowindow.close(); //이전 검색기록의 인포윈도우 삭제
  infowindow.setPosition(finishPos);
  infowindow.setContent(
    "<div class='path_info'>" +
      shortDis +
      "m<br>" +
      "도보 약 " +
      shortTime +
      "분</div>"
  );
  infowindow.open(map, finishMarker); //도착지 마커 위에 표시

  //인포윈도위 기본 디자인 초기화
  initInfoWindow = document.querySelectorAll(".path_info");
  initInfoWindow.forEach(function (e) {
    var w = e.offsetWidth + 10;
    var ml = w / 2;
    e.parentElement.style.top = "5px";
    e.parentElement.style.left = "50%";
    e.parentElement.style.marginLeft = -ml + "px";
    e.parentElement.style.width = w + "px";
    e.parentElement.previousSibling.style.display = "none";
    e.parentElement.parentElement.style.border = "0px";
    e.parentElement.parentElement.style.background = "unset";
  });
}

//사용자의 기기가 모바일인지 아닌지
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

//사용자가 현재위치 추적 서비스를 원하는지 아닌지
function isChecked() {
  // 1. checkbox element를 찾습니다.
  const checkbox = document.getElementById("wantNav");

  // 2. checked 속성을 체크한 후 값 반환
  return checkbox.checked;
}

//주기적인 함수의 실행을 위한 함수
function startClock() {
  //사용자의 현재위치를 추적하는 함수
  function getLocation() {
    let lat, long;

    if (prevUser != null) {
      //이전에 표시했던 사용자 위치가 있다면
      prevUser.setMap(null); //지도에서 지워줌
    }

    if (isMobile() && isChecked()) {
      // 모바일 기기이며 사용자가 위치 추적 서비스를 원하는 경우

      navigator.geolocation.getCurrentPosition(
        function (position) {
          lat = position.coords.latitude;
          long = position.coords.longitude;

          console.log(lat, long); //주기적으로 좌표가 측장되는지 확인

          userPos = new kakao.maps.LatLng(lat, long);

          if (prevUser != null) {
            //이전에 표시했던 사용자 위치가 있다면
            prevUser.setMap(null); //지도에서 지워줌
          }

          // 지도에 사용자 마커 생성
          var user = new kakao.maps.Circle({
            center: userPos, // 원의 중심좌표
            radius: 5, // 미터 단위의 원의 반지름
            strokeWeight: 4, // 선의 두께
            strokeColor: "#ffffff", // 선의 색깔
            strokeOpacity: 1, // 선의 불투명도
            strokeStyle: "solid", // 선의 스타일
            fillColor: "#DC143C", // 채우기 색깔
            fillOpacity: 0.7, // 채우기 불투명도
          });
          user.setMap(map); //지도에 사용자 마커로 사용할 원 표시
          prevUser = user; //이후에 지울 수 있도록 사용자 마커의 정보를 prevUser로 저장

          map.panTo(userPos); //지도 중심을 사용자 위치로 이동
        },
        function (error) {
          console.error(error);
        },
        {
          enableHighAccuracy: false,
          maximumAge: 0,
          timeout: Infinity,
        }
      );
    }
  }

  timer = setInterval(getLocation, 2000); //주기적으로 실행할 함수를 지정
}

function stopClock() {
  clearInterval(timer); //타이머 삭제
}

function mainFunc() {
  //html의 검색 버튼과 이어줄 함수
  getShortCut(); //최단경로를 구하고
  startClock(); //타이머 시작
}
