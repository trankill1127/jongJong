var shortDis=null;
var shortTime = null;

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

            smallest = nodes.dequeue().val; //가장 작은 거리을 가지는 우선순위 큐에서 뺴냄

            if (smallest === finish) {

                shortDis=Math.round(distances[finish]);
                shortTime = Math.round((shortDis/1.35/60));

                console.log(shortDis+"m");
                console.log("도보로 약"+shortTime+"분이 소요됩니다.");

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
  ["후문", 37.552929, 127.072469],
  ["2", 37.552120 ,127.072817],
  ["3", 37.552757 ,127.073613],
  ["4", 37.552642 ,127.073788],
  ["5", 37.552436 ,127.073552],
  ["6", 37.551919 ,127.073466],
  ["7", 37.552182 ,127.073493],
  ["8", 37.552223 ,127.073844],
  ["9", 37.552070 ,127.073654],
  ["10", 37.551944, 127.073823],
  ["11", 37.551887 ,127.073128],
  ["12", 37.552106 ,127.073995],
  ["13", 37.551784 ,127.073648],
  ["14", 37.551629 ,127.073450],
  ["15", 37.551576 ,127.073910],
  ["16", 37.551439 ,127.073688],
  ["17", 37.551439 ,127.074092],
  ["18", 37.551271 ,127.073904],
  ["19", 37.551205 ,127.073987],
  ["20", 37.551114 ,127.074102],
  ["21", 37.551280 ,127.074302],
  ["22", 37.551400 ,127.074457],
  ["23", 37.551605 ,127.074698],
  ["24", 37.552022, 127.074646],
  ["25", 37.551152 ,127.075312],
  ["26", 37.550896 ,127.074987],
  ["27", 37.550605 ,127.074601],
  ["28", 37.550845 ,127.073532],
  ["29", 37.551068 ,127.073349],
  ["30", 37.551370 ,127.073768],
  ["31", 37.550305 ,127.072844],
  ["32", 37.549780 ,127.073428],
  ["33", 37.549319 ,127.073471],
  ["34", 37.550303 ,127.073309],
  ["35", 37.550464 ,127.073514],
  ["36", 37.550680 ,127.073725],
  ["37", 37.550271 ,127.074207],
  ["38", 37.550080 ,127.073585],
  ["39", 37.550219 ,127.073791],
  ["40", 37.550042 ,127.074007],
  ["41", 37.549965 ,127.073702],
  ["42", 37.550017 ,127.073814],
  ["43", 37.549796 ,127.074073],
  ["44", 37.549881 ,127.074177],
  ["45", 37.549630 ,127.074110],
  ["46", 37.549619 ,127.073987],
  ["47", 37.549707 ,127.074334],
  ["48", 37.549770 ,127.074299],
  ["49", 37.550154 ,127.074114],
  ["50", 37.54985263704142, 127.0744738147587],
  ["51", 37.549298 ,127.074113],
  ["쪽문1", 37.549302 ,127.073370],
  ["53", 37.548783 ,127.073330],
  ["54", 37.548481 ,127.073341],
  ["55", 37.548764 ,127.073716],
  ["56", 37.548455 ,127.073703],
  ["57", 37.548457 ,127.074039],
  ["58", 37.548416 ,127.074027],
  ["59", 37.548760 ,127.074068],
  ["쪽문2", 37.548348 ,127.073351],
  ["61", 37.548936 ,127.074083],
  ["62", 37.549315 ,127.074406],
  ["63", 37.549853 ,127.074876],
  ["64", 37.54977576945796, 127.07492073907261],
  ["65", 37.549695 ,127.074672],
  ["66", 37.549661 ,127.074639],
  ["67", 37.54981623350918, 127.07504808999593],
  ["68", 37.549571 ,127.075005],
  ["69", 37.549535 ,127.074966],
  ["70", 37.549193 ,127.074773],
  ["71", 37.548886 ,127.074644],
  ["정문", 37.549117918851856, 127.07511245901617],
  ["73", 37.55028894791896, 127.07553376118724],
  ["쪽문3", 37.55020093930908, 127.07578546538973],
  ["75", 37.55038784363281, 127.07586769975154],
  ["76", 37.55050283158843, 127.07569523837321],
  ["77", 37.551071 ,127.076302],
  ["78", 37.551202 ,127.075918],
  ["79", 37.55100289974998, 127.07567311077963],
  ["80", 37.5507916963534, 127.07483971041053],
  ["81", 37.55073534364052, 127.07490331005661],
  ["82",37.55103694754837, 127.07526574521138],
  ["83", 37.551027 ,127.075285],
  ["84",  37.55048734443272, 127.07525670510664],
 // ["85", 37.550834 ,127.075442],
  ["86", 37.548890 ,127.075007],
  ["87", 37.552038 ,127.073313],
  ["88", 37.550889 ,127.073574],
  ["89", 37.552378 ,127.074155],
  ["90", 37.54920815341758, 127.07490036725218],
  ["91", 37.5500237390933, 127.07461261228808],
  ["92", 37.55138398553519, 127.0750241993248],
  ["93", 37.548769849748304, 127.07341466117833],
  ["94", 37.55234279882951, 127.07262032683926],

  ["대양AI센터",37.55067866466778, 127.07547898598591],
  ["대양AI센터1",37.550566128501785, 127.07534024421014],
  ["대양AI센터2", 37.55049833294774, 127.07568533181187],
  ["대양AI센터3", 37.55077093184624, 127.07561204938861],
  ["대양AI센터4", 37.550845479255656, 127.07527545473171],
  
  ["모차르트홀", 37.54837299187981, 127.07408476058303],

  ["대양홀", 37.54888404833184, 127.07449831283674],
  
  ["집현관", 37.54908958952705, 127.07359886582155],
  ["집현관1", 37.5492742958514, 127.07359621833467],
  ["집현관2", 37.549010520629885, 127.07396939887298],
  ["집현관3", 37.54881482570873, 127.07353352676115],
  
  ["학생회관", 37.549602156553725, 127.07518933097482],
  ["학생회관1", 37.549566222813525, 127.07502237732841],
  ["학생회관2", 37.54930269713431, 127.07499665129299],
  
  ["세종관", 37.549969698891054, 127.07458143803036],
  ["세종관1", 37.54991567832413, 127.07451914347061],
  ["세종관2", 37.550023737305565, 127.07461544141462],
  
  ["군자관", 37.54959176160512, 127.07381437210093],
  ["군자관2", 37.54959614262905, 127.07401241427353],
  ["군자관1", 37.54981256968448, 127.07371274151824],
  
  ["광개토관",  37.55019129501604, 127.07322084505508],
  ["광개토관1", 37.55058758638846, 127.07345888129747],
  ["광개토관2", 37.55025430516801, 127.07331709735423],
  
  ["이당관", 37.55035822104793, 127.07283058689191],
  
  ["진관홀", 37.55095022208627, 127.0734846996733],
  
  ["용덕관", 37.55134223694715, 127.07335494235691],
  ["용덕관1", 37.55119799993971, 127.07347928459517],

  
  ["애지헌", 37.550760781356026, 127.07385513314536],
  
  ["영실관", 37.55232431714493, 127.07336722174925],
  ["충무관", 37.552276587373726, 127.07405184462753],
  ["충무관1", 37.55219780330275, 127.07396689036213],
  ["충무관2", 37.55235987281623, 127.07414246196399],
  
  ["다산관", 37.55255580952808, 127.07419075287422],
  ["다산관1", 37.552271765478096, 127.07455543982492],
  ["다산관2", 37.55247248682488, 127.07415954884834],
  ["다산관3", 37.55275878921066, 127.07378354471737],
  
  ["율곡관", 37.551943267989934, 127.0739722972141],
  
  ["우정당", 37.55186847615874, 127.0747021563938],
  ["우정당1",37.55195189353698, 127.07458341320121],
  ["우정당2", 37.55178280795931, 127.07481806787685],

  ["학술정보원",37.551526405765, 127.07421236595302],
  
  ["박물관",37.551469484927225, 127.0751742317245]
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

var infowindow = new kakao.maps.InfoWindow({
  position : null,
  content : null
});

function getShortCut(){

    //그래프 생성
    var graph = new WeightedGraph();
    var start = document.getElementById("start").value;
    var finish = document.getElementById("finish").value;
    var finishPos = null;
   

    graph.addVertex("후문"); graph.addVertex("2"); graph.addVertex("3");graph.addVertex("4");graph.addVertex("5");
  graph.addVertex("6"); graph.addVertex("7"); graph.addVertex("8");graph.addVertex("9");graph.addVertex("10");
  graph.addVertex("11");graph.addVertex("12");graph.addVertex("13");graph.addVertex("14");graph.addVertex("15");
  graph.addVertex("16");graph.addVertex("17");graph.addVertex("18");graph.addVertex("19");graph.addVertex("20");
  graph.addVertex("21");graph.addVertex("22");graph.addVertex("23");graph.addVertex("24");graph.addVertex("25");
  graph.addVertex("26");graph.addVertex("27");graph.addVertex("28");graph.addVertex("29");graph.addVertex("30");
  graph.addVertex("31");graph.addVertex("32");graph.addVertex("33");graph.addVertex("34");graph.addVertex("35");
  graph.addVertex("36");graph.addVertex("37");graph.addVertex("38");graph.addVertex("39");graph.addVertex("40");
  graph.addVertex("41");graph.addVertex("42");graph.addVertex("43");graph.addVertex("44");graph.addVertex("45");
  graph.addVertex("46");graph.addVertex("47");graph.addVertex("48");graph.addVertex("49");graph.addVertex("50");
  graph.addVertex("51");graph.addVertex("쪽문1");graph.addVertex("53");graph.addVertex("54");graph.addVertex("55");
  graph.addVertex("56");graph.addVertex("57");graph.addVertex("58");graph.addVertex("59");graph.addVertex("쪽문2");
  graph.addVertex("61");graph.addVertex("62");graph.addVertex("63");graph.addVertex("64");graph.addVertex("65");
  graph.addVertex("66");graph.addVertex("67");graph.addVertex("68");graph.addVertex("69");graph.addVertex("70");
  graph.addVertex("71");graph.addVertex("정문");graph.addVertex("73");graph.addVertex("쪽문3");graph.addVertex("75");
  graph.addVertex("76");graph.addVertex("77");graph.addVertex("78");graph.addVertex("79");graph.addVertex("80");
  graph.addVertex("81");graph.addVertex("82");graph.addVertex("83");graph.addVertex("84");//rgaph.addVertex("85");
  graph.addVertex("86");graph.addVertex("87");graph.addVertex("88");graph.addVertex("89");graph.addVertex("90");
  graph.addVertex("91");graph.addVertex("92");graph.addVertex("93");graph.addVertex("94");
  graph.addVertex("대양AI센터");  graph.addVertex("대양AI센터1");  graph.addVertex("대양AI센터2");  graph.addVertex("대양AI센터3"); graph.addVertex("대양AI센터4");
  graph.addVertex("모차르트홀");  graph.addVertex("집현관");  graph.addVertex("집현관1");  graph.addVertex("집현관2");
  graph.addVertex("집현관3");  graph.addVertex("학생회관1");  graph.addVertex("학생회관2");  graph.addVertex("학생회관");
  graph.addVertex("세종관");  graph.addVertex("세종관1");  graph.addVertex("세종관2");  graph.addVertex("군자관");
  graph.addVertex("군자관1");  graph.addVertex("군자관2");  graph.addVertex("광개토관");  graph.addVertex("광개토관1");
  graph.addVertex("광개토관2");  graph.addVertex("이당관");  graph.addVertex("진관홀");  graph.addVertex("용덕관");
  graph.addVertex("용덕관1");graph.addVertex("애지헌");graph.addVertex("영실관");
  graph.addVertex("충무관");graph.addVertex("충무관1");graph.addVertex("충무관2");graph.addVertex("다산관");graph.addVertex("다산관1");graph.addVertex("다산관2");
  graph.addVertex("다산관3");graph.addVertex("율곡관");graph.addVertex("우정당");graph.addVertex("우정당1");graph.addVertex("우정당2");graph.addVertex("학술정보원");
  graph.addVertex("박물관"); graph.addVertex("대양홀"); 

  graph.addEdge("대양AI센터", "대양AI센터1", 24);
  graph.addEdge("대양AI센터", "대양AI센터2", 27);
  graph.addEdge("대양AI센터", "대양AI센터3", 32);
  graph.addEdge("대양AI센터", "대양AI센터4", 38);
  graph.addEdge("집현관", "집현관1", 22);
  graph.addEdge("집현관", "집현관2", 30);
  graph.addEdge("집현관", "집현관3", 26);
  graph.addEdge("학생회관", "학생회관1", 10);
  graph.addEdge("68", "학생회관1", 12);
  graph.addEdge("학생회관", "학생회관2", 23);
  graph.addEdge("세종관", "세종관1", 7);
  graph.addEdge("세종관", "세종관2", 8);
  graph.addEdge("군자관", "군자관1", 25);
  graph.addEdge("군자관", "군자관2", 15);
  graph.addEdge("광개토관", "광개토관1", 37);
  graph.addEdge("광개토관", "광개토관2", 7);
  graph.addEdge("용덕관", "용덕관1", 16);

  graph.addEdge("충무관", "충무관1", 15);
  graph.addEdge("충무관", "충무관2", 9);
  graph.addEdge("다산관", "다산관1", 44);
  graph.addEdge("다산관", "다산관2", 10);
  graph.addEdge("다산관", "다산관3", 37);
  graph.addEdge("우정당", "우정당1", 20);
  graph.addEdge("우정당", "우정당2", 13);

  //graph.addEdge("후문", "2", 98.51);
  graph.addEdge("94", "2", 41);
  graph.addEdge("후문", "94", 61);
  graph.addEdge("2", "3", 99.87);
  graph.addEdge("2", "11",38.72 );
  graph.addEdge("3", "4", 20.14);
  graph.addEdge("4", "5", 29.15);
  graph.addEdge("4", "24",131.94 );
  graph.addEdge("5", "7", 28.27 );
  graph.addEdge("5", "8", 36.12);
  graph.addEdge("87", "6",19.23 );
  graph.addEdge("7", "87",24.53 );
  graph.addEdge("6", "9",24.53 );
  graph.addEdge("6", "13", 19.92);
  graph.addEdge("87", "11",22.76 );
  graph.addEdge("7", "9", 19.27);
  graph.addEdge("9", "10", 19.92);
  graph.addEdge("11", "14", 40.03);
  graph.addEdge("9", "8", 24.77);
  graph.addEdge("8", "12", 16.72);
  graph.addEdge("12", "10",23.34 );
  graph.addEdge("10", "13", 24.53);
  graph.addEdge("13", "15",32.19 );
  graph.addEdge("13", "14", 24.05);
  graph.addEdge("14", "16", 29.11);
  graph.addEdge("16", "15",23.49 );
  graph.addEdge("16", "30",10.91 );
  graph.addEdge("15", "17",22.96 );
  graph.addEdge("30", "29", 48.86);
  graph.addEdge("30", "18",15.43 );
  graph.addEdge("17", "18",24.64 );
  graph.addEdge("17", "21", 26.26);
  graph.addEdge("29", "28", 31.18);
  graph.addEdge("19", "88", 47.65);
  graph.addEdge("88", "28",7.53 );
  graph.addEdge("29", "88", 28.43);
  graph.addEdge("18", "19", 11.20);
  graph.addEdge("19", "20", 14.32);
  graph.addEdge("20", "21",25.36 );
  graph.addEdge("20", "27",71.32 );
  graph.addEdge("21", "22", 18.94);
  graph.addEdge("22", "23",43.39 );
  graph.addEdge("22", "26", 70.87);
  //graph.addEdge("23", "24",31.23 );
  //graph.addEdge("23", "25", 72.27);
  graph.addEdge("25", "26", 39.09);
  graph.addEdge("26", "80", 17.77);
  graph.addEdge("80", "27", 28.90);
  graph.addEdge("80", "81",4.26 );
  graph.addEdge("27", "37",48.64 );
  graph.addEdge("28", "31",85.70 );
  graph.addEdge("28", "36",25.02 );
  graph.addEdge("31", "32", 76.48);
  graph.addEdge("32", "33", 52.58);
  graph.addEdge("32", "41",31.37 );
  graph.addEdge("36", "35",30.38 );
  graph.addEdge("36", "37",40.00 );
  graph.addEdge("35", "39", 36.57);
  graph.addEdge("35", "34", 25.96);
  graph.addEdge("34", "38", 36.10);
  graph.addEdge("38", "39", 24.28);
  graph.addEdge("38", "41", 17.09);
  graph.addEdge("41", "42", 10.39);
  graph.addEdge("39", "40",27.06 );
  graph.addEdge("40", "49",16.52 );
  graph.addEdge("40", "44",22.83 );
  graph.addEdge("42", "43", 33.00);
  graph.addEdge("49", "37", 14.59);
  graph.addEdge("49", "50",43.66 );
  graph.addEdge("44", "48", 18.04);
  graph.addEdge("44", "43",12.50 );
  //graph.addEdge("37", "63", 72.95);
  graph.addEdge("43", "45", 19.30);
  graph.addEdge("45", "46", 11.12);
  graph.addEdge("45", "51", 35.74);
  graph.addEdge("45", "47",20.56 );
  graph.addEdge("47", "48", 5.76);
  graph.addEdge("47", "65",30.35 );
  graph.addEdge("47", "62",44.38 );
  graph.addEdge("48", "50",15.90 );
  graph.addEdge("50", "65",28.22 );
  graph.addEdge("65", "66", 4.63);
  graph.addEdge("65", "64",21.62 );
  graph.addEdge("65", "68", 31.90);
  graph.addEdge("66", "69",31.63 );
  graph.addEdge("69", "70",40.94 );
  graph.addEdge("62", "51", 26.60);
  graph.addEdge("62", "70",  34.34);
  graph.addEdge("64", "63", 7.64);
  graph.addEdge("64", "67", 8.11);
 //graph.addEdge("67", "63", ); 없는거 같음
  graph.addEdge("80", "81", 4.26);
  graph.addEdge("67", "73",65 );
  graph.addEdge("73", "84", 26.50);
  graph.addEdge("73", "쪽문3", 24.41);
  //graph.addEdge("84", "85",5.41 );
  graph.addEdge("84", "대양AI센터1",5.41 )
  graph.addEdge("84", "81",27.96 );
  graph.addEdge("82", "83", 4.00);
  graph.addEdge("81", "82", 11.11);
  graph.addEdge("51", "61", 40.55);
  graph.addEdge("51", "33",57.08 );
  graph.addEdge("33", "쪽문1", 9.38);
  graph.addEdge("쪽문1", "53",57.38 );
  graph.addEdge("53", "93",8);
  graph.addEdge("54", "93",31);
  graph.addEdge("55", "93",19);
  graph.addEdge("55", "56", 32.00);
  graph.addEdge("55", "59",31.99 );
  graph.addEdge("54", "56",29.94 );
  graph.addEdge("56", "57", 28.69);
  graph.addEdge("54", "쪽문2", 15.74);
  graph.addEdge("59", "57",34.97 );
  graph.addEdge("57", "58", 5.27);
  graph.addEdge("59", "61", 19.85);
  graph.addEdge("61", "71", 49.03);
  graph.addEdge("71", "70", 35.26);
  //graph.addEdge("70", "72", 42.89);
  graph.addEdge("71", "86",31.87 );
  //graph.addEdge("72", "86",24.92 );
  graph.addEdge("77", "78", 36.49);
  graph.addEdge("정문", "쪽문3", 137);
  graph.addEdge("79", "78", 7.49);
  graph.addEdge("78", "77",25.79 );
  graph.addEdge("76", "75",  25.84);
  graph.addEdge("75", "쪽문3", 15.00);
  graph.addEdge("75", "77", 82.00);
  graph.addEdge("90", "70", 11);
  graph.addEdge("충무관1", "5", 27);
  graph.addEdge("충무관1", "12",29);
  graph.addEdge("90", "정문", 23);
 // graph.addEdge("8", "충무관1", 10.99);
  graph.addEdge("89", "충무관2", 2.79);
  graph.addEdge("7", "영실관", 17.53);
  graph.addEdge("10", "율곡관", 12.22);
  graph.addEdge("17", "학술정보원", 13.88);
  graph.addEdge("우정당1", "24", 9.76);
  graph.addEdge("우정당2", "23", 22.87);
  graph.addEdge("29", "용덕관1", 17.52);
  graph.addEdge("30", "용덕관1", 31.62);
  graph.addEdge("14", "16", 29);

  graph.addEdge("88", "진관홀", 10.21);
  graph.addEdge("29", "진관홀", 18.07);
  graph.addEdge("31", "이당관", 6.12);
  graph.addEdge("광개토관1", "35", 11);
  graph.addEdge("광개토관2", "34", 3);
  graph.addEdge("애지헌", "36", 12);
  graph.addEdge("군자관2", "46",1);
  graph.addEdge("군자관1", "32", 19);
  graph.addEdge("군자관1", "41", 18);
  graph.addEdge("집현관1", "33", 6);
  graph.addEdge("집현관2", "61", 9);
  graph.addEdge("집현관3", "93", 9);
  graph.addEdge("집현관3", "55", 25);
  graph.addEdge("대양홀", "71", 1);
  graph.addEdge("모차르트홀", "58", 0);
  graph.addEdge("세종관1", "50", 1);
  graph.addEdge("세종관2", "91", 1);
  graph.addEdge("37", "91", 43);
  graph.addEdge("63", "91", 29.5);
  graph.addEdge("박물관", "92", 9);
  graph.addEdge("23", "92", 40);
  graph.addEdge("25", "92", 30);
  graph.addEdge("89", "24", 66);
  //graph.addEdge("대양AI센터1", "85", 0);
  graph.addEdge("대양AI센터2", "76", 1);
  graph.addEdge("대양AI센터3", "79", 1);
  graph.addEdge("대양AI센터4", "83", 1);
  graph.addEdge("다산관2", "89", 10);
  graph.addEdge("다산관1", "24", 10);
  graph.addEdge("다산관3", "4", 20);
  path = graph.Dijkstra(start, finish);
  var linePath=[];

  for (i = 0; i<path.length; i++ ){
        console.log(path[i]); 

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
  
   

  // 인포윈도우를 생성합니다
  infowindow.close();
  infowindow.setPosition(finishPos);
  infowindow.setContent(shortDis+"m<br>"+"도보 약"+shortTime+"분");
  // 마커 위에 인포윈도우를 표시합니다. 두번째 파라미터인 marker를 넣어주지 않으면 지도 위에 표시됩니다
  infowindow.open(map, finishMarker); 

}

  
let timer;
var userPos = null;
var prevUser = null;

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function startClock(){

  function getLocation() {
    let lat, long;
    var m_w_flag = isMobile();

    if (m_w_flag) { // 모바일 기기인 경우

        navigator.geolocation.getCurrentPosition(function(position) {

            lat = position.coords.latitude;
            long = position.coords.longitude;
      
            console.log(lat, long); //주기적으로 좌표가 측장되는지 확인

            userPos = new kakao.maps.LatLng(lat, long); 
           
            // 지도에 표시할 원을 생성합니다
            if (prevUser!=null) {
              prevUser.setMap(null); 
            }
            
              var user = new kakao.maps.Circle({
              center : userPos,  // 원의 중심좌표 입니다 
              radius: 5, // 미터 단위의 원의 반지름입니다 
              strokeWeight: 2, // 선의 두께입니다 
              strokeColor: '#ffffff', // 선의 색깔입니다
              strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
              strokeStyle: 'solid', // 선의 스타일 입니다
              fillColor: '#DC143C', // 채우기 색깔입니다
              fillOpacity: 1  // 채우기 불투명도 입니다   
            }); 
            user.setMap(map); //지도에 원 표시
            prevUser =user;

            map.panTo(userPos);

        }, function(error) {
            console.error(error);
        }, {
            enableHighAccuracy: false,
            maximumAge: 0,
            timeout: Infinity
        });
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