![alt text](image-1.png)

# 😀 개요

- 세종대학교 내에서 목적지까지의 최단 경로를 안내해주는 웹 서비스입니다.

- 세종대 학생들에게 제공되지 않은 서비스였고 실질적인 도움을 줄 수 있는 서비스를 개발하고자 위와 같은 서비스를 기획했습니다.

- [ 22-1 세종대학교 소프트웨어학과 학술제 ]에 참여후 코드 refactoring과 UI 변경을 했습니다.

# 🔨 주요 기능

### 👩🏻‍🔧 서비스

- 세종대학교에 있는 건물과 입구들을 선택해서 검색을 누르면 학교 내 도보 이동의 최단 루트를 제공해줍니다.

![alt text](image-2.png)

### ⚙️ Functions

- 다익스트라 알고리즘을 통해 입력한 출발지부터 도착지까지의 지름길(최단 경로)를 안내했습니다.
<details>    <summary>다익스트라 알고리즘 구현</summary>

### 1. node 생성

```js
//1. 노드
class Node {
  constructor(val, priority) {
    this.val = val;
    this.priority = priority;
  }
}
```

### 2. 우선순위 큐

```js
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
      let swap = null;

      if (leftChildIdx < length) {
        leftChild = this.values[leftChildIdx];
        if (leftChild.priority < element.priority) {
          swap = leftChildIdx;
        }
      }

      if (rightChildIdx < length) {
        rightChild = this.values[rightChildIdx];

        if (
          (swap === null && rightChild.priority < element.priority) ||
          (swap !== null && rightChild.priority < leftChild.priority)
        ) {
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
```

### 3. 가중치 그래프

```js
//3. 가중치 그래프
class WeightedGraph {
  constructor() {
    this.adjacencyList = {}; //인접리스트
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
```

### 4. 함수 이용

```js

//최단경로를 구하는 함수
function getShortCut() {
  var graph = new WeightedGraph(); //그래프
  var start = document.getElementById("start").value; //출발 건물
  var finish = document.getElementById("finish").value; //도착 건물
  var finishPos = null; //도착 건물의 좌표
  var linePath = []; //최단경로를 이루는 정점들의 좌표를 저장할 배열

  //그래프 생성
```

</details>

### 👩🏼‍💻 language

<img src="https://img.shields.io/badge/Java Script-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/> <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white"/> <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&amp;logoColor=white">
<img src="https://img.shields.io/badge/Visual Studio Code-007ACC?style=for-the-badge&logo=Visual Studio Code&logoColor=white"/>

### 🖇️ API

<img src="https://img.shields.io/badge/Kakao-FFCD00?style=for-the-badge&logo=Kakao&logoColor=#FFCD00">

<br/>

# 🚀 실행 방법

```
$ git clone https://github.com/seunghyun0522/jongJong.git
```

<br/>

# 📁 디렉토리 구조

```
├── 📑 client
│   ├── 📜 map.js
│   └── 📜 mapping.js
├── 📑 css
│   └── 📜 style.css
├── 📑 image
│   ├── icon
│   ├── logo
│   └── background_video
├── 📜 index.html
```

<br/>

# 🧑🏻 프로젝트 멤버

<table>
 <tr>
 <td align="center"><a href="https://github.com/trankill1127"><img src="https://avatars.githubusercontent.com/trankill1127" width="130px;""></a></td>
    <td align="center"><a href="https://github.com/seunghyun0522"><img src="https://avatars.githubusercontent.com/seunghyun0522" width="130px;""></a></td>
     
  </tr>
  <tr>
  <td align="center"><a href="https://github.com/trankill1127"><b>trankill1127</b></a></td>
    <td align="center"><a href="https://github.com/seunghyun0522"><b>seunghyun0522</b></a></td>
    
  </tr>
</table>
