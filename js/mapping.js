class Node { //helper class for PriorityQueue

    constructor(val, priority) {
      this.val = val;
      this.priority = priority;
    }

  }
  
class PriorityQueue { //우선순위 큐

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
            let swap = null;
    
            if (leftChildIdx < length) {
                leftChild = this.values[leftChildIdx];
                if (leftChild.priority < element.priority) {
                    swap = leftChildIdx;
                }
            }
            
            if (rightChildIdx < length) {
                rightChild = this.values[rightChildIdx];
                
                if ( (swap === null && rightChild.priority < element.priority) || (swap !== null && rightChild.priority < leftChild.priority) ) {
                    swap = rightChildIdx;
                }
            }
            
            if (swap === null) break;
            
            this.values[idx] = this.values[swap];
            this.values[swap] = element;
            idx = swap;

      }
    }
}

class WeightedGraph {

    constructor() {
      this.adjacencyList = {}; //인접리스트
    }

    addVertex(vertex) { //점 추가
      if (!this.adjacencyList[vertex]) this.adjacencyList[vertex] = []; //인접리스트 행 추가
    }

    addEdge(vertex1, vertex2, weight) { //간선 추가
      this.adjacencyList[vertex1].push({ node: vertex2, weight });
      this.adjacencyList[vertex2].push({ node: vertex1, weight });
    }

    Dijkstra(start, finish) { //최단경로 알고리즘 : 다익스트라
        const nodes = new PriorityQueue();
        const distances = {};
        const previous = {};
        let path = []; //최단경로를 이루는 정점들을 저장할 배열
        let smallest;

        //2개의 점 사이의 거리 초기화
        for (let vertex in this.adjacencyList) {
            
            if (vertex === start) { //시점과 동일한 경우
            distances[vertex] = 0; //거리를 0으로 업데이트
            nodes.enqueue(vertex, 0); //우선순위 큐에 추가
            } else { //시점과 동일하지 않은 경우
            distances[vertex] = Infinity; //거리를 무한으로 업데이트
            nodes.enqueue(vertex, Infinity);
            }

            previous[vertex] = null;
        }

        // as long as there is something to visit
        while (nodes.values.length) { //우선순위 큐가 비어있지 않은 경우(=방문할 정점이 남아있는 경우)

            smallest = nodes.dequeue().val; //가장 작은 ?을 가지는 우선순위 큐에서 뺴냄

            if (smallest === finish) {
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
  
//정점, 위도, 경도 데이터
var vertexData = [
  ["집", 37.362830, 127.119538],
  ["도서관", 37.358070, 127.116616],
  ["마트", 37.365073, 127.114607],
  ["초등학교", 37.364864, 127.113617],
  ["놀이터", 37.366316, 127.111745],
  ["역", 37.367670, 127.108387]
]

var polyline = new kakao.maps.Polyline({
  strokeWeight: 5, // 선의 두께 입니다
  strokeColor: '#DC143C', // 선의 색깔입니다
  strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
  strokeStyle: 'solid' // 선의 스타일입니다
});
  
var finishMarker = new kakao.maps.Marker({
  position: null
});


function getShortCut(){

    //그래프 생성
    var graph = new WeightedGraph();
    var start = document.getElementById("start").value;
    var finish = document.getElementById("finish").value;
    var finishPos = null;
   

    graph.addVertex("집"); //A
    graph.addVertex("도서관"); //B
    graph.addVertex("마트"); //C
    graph.addVertex("초등학교"); //D
    graph.addVertex("놀이터"); //E
    graph.addVertex("역"); //F
    
    graph.addEdge("집", "도서관", 4);
    graph.addEdge("집", "마트", 2);
    graph.addEdge("도서관", "놀이터", 3);
    graph.addEdge("마트", "초등학교", 2);
    graph.addEdge("마트", "역", 4);
    graph.addEdge("초등학교", "놀이터", 3);
    graph.addEdge("초등학교", "역", 1);
    graph.addEdge("놀이터", "역", 1);

    path = graph.Dijkstra(start, finish);
    var linePath=[];

    for (i = 0; i<path.length; i++ ){
        console.log(path[i]); 
        //A C D F E
        //집 마트 초등학교 역 놀이터

        for (j=0; j<vertexData.length; j++){
            if (vertexData[j][0]==path[i]){//최단 경로를 이루는 정점의 좌표
              linePath.push(new kakao.maps.LatLng(vertexData[j][1], vertexData[j][2]));
            }
            if (vertexData[j][0]==finish){ //종점 좌표
              finishPos = new kakao.maps.LatLng(vertexData[j][1], vertexData[j][2]);
            }
        }
    }

    
  
  // 지도에 표시할 선을 생성합니다
  polyline.setMap(null);
  polyline.setPath(linePath);
  polyline.setMap(map);  //지도에 경로 표시

  finishMarker.setMap(null);
  finishMarker.setPosition(finishPos);
  finishMarker.setMap(map);
  

}

  
let timer;
var user=null;
var userPos = null;

function startClock(){

  function getLocation() {
    let lat, long;
    if (navigator.geolocation) { // GPS를 지원하면

        navigator.geolocation.getCurrentPosition(function(position) {

            lat = position.coords.latitude;
            long = position.coords.longitude;
      
            console.log(lat, long); //주기적으로 좌표가 측장되는지 확인

            userPos = new kakao.maps.LatLng(lat, long); 
           
            // 지도에 표시할 원을 생성합니다
            user = new kakao.maps.Circle({
              center : userPos,  // 원의 중심좌표 입니다 
              radius: 5, // 미터 단위의 원의 반지름입니다 
              strokeWeight: 2, // 선의 두께입니다 
              strokeColor: '#ffffff', // 선의 색깔입니다
              strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
              strokeStyle: 'solid', // 선의 스타일 입니다
              fillColor: '#DC143C', // 채우기 색깔입니다
              fillOpacity: 1  // 채우기 불투명도 입니다   
            }); 
            user.setMap(null); 
            user.setMap(map); //지도에 원 표시

            map.panTo(userPos);

        }, function(error) {
            console.error(error);
        }, {
            enableHighAccuracy: false,
            maximumAge: 0,
            timeout: Infinity
        });
    } else {
        alert('이 기기는 GPS를 지원하지 않기 떄문에 사용자의 현재위치 추적이 불가능합니다.');
        return;
    }
  }

  timer=setInterval(getLocation, 1000);
}

function stopClock(){
  clearInterval(timer);
}



function mainFunc(){
  
  getShortCut();
  startClock();

}