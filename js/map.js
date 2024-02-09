var mapContainer = document.getElementById("map"), // 지도를 표시할 div
  mapOption = {
    center: new kakao.maps.LatLng(37.551054, 127.073939), // 지도의 중심좌표(세종대)
    level: 4, // 지도의 확대 레벨
  };

// 지도를 표시할 div와  지도 옵션으로  지도를 생성
var map = new kakao.maps.Map(mapContainer, mapOption);
// 지도타입 컨트롤의 지도 또는 스카이뷰 버튼을 클릭하면 호출되어 지도타입을 바꾸는 함수입니다
// 지도타입 컨트롤의 지도 또는 스카이뷰 버튼을 클릭하면 호출되어 지도타입을 바꾸는 함수입니다
function setMapType(maptype) {
  var roadmapControl = document.getElementById("btnRoadmap");
  var skyviewControl = document.getElementById("btnSkyview");
  if (maptype === "roadmap") {
    map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);
    roadmapControl.className = "selected_btn";
    skyviewControl.className = "btn";
  } else {
    map.setMapTypeId(kakao.maps.MapTypeId.HYBRID);
    skyviewControl.className = "selected_btn";
    roadmapControl.className = "btn";
  }
}

// 지도 확대, 축소 컨트롤에서 확대 버튼을 누르면 호출되어 지도를 확대하는 함수입니다
function zoomIn() {
  map.setLevel(map.getLevel() - 1);
}

// 지도 확대, 축소 컨트롤에서 축소 버튼을 누르면 호출되어 지도를 확대하는 함수입니다
function zoomOut() {
  map.setLevel(map.getLevel() + 1);
}

function resetColorsAndInputs() {
  // 선택된 td의 색상 초기화

  firstSelectedTd.style.backgroundColor = "";

  secondSelectedTd.style.backgroundColor = "";

  // 출발지와 도착지 입력란의 값을 초기화
  document.getElementById("start").value = "";
  document.getElementById("finish").value = "";
}

// 변수 설정
let isStart = true; // 현재 클릭이 출발지를 나타내는지 도착지를 나타내는지 여부
let firstSelectedTd = null; // 첫 번째 클릭으로 선택된 td
let secondSelectedTd = null; // 두 번째 클릭으로 선택된 td

// 모든 td 요소 가져오기
let tds = document.querySelectorAll("td");

// 각 td 요소에 클릭 이벤트 추가
tds.forEach(function (td) {
  td.addEventListener("click", function () {
    // 클릭된 td 요소의 텍스트 가져오기
    var text = td.textContent.trim();

    // 선택된 td에 따라 출발지 또는 도착지로 설정 및 색상 변경
    if (isStart) {
      // 첫 번째 클릭
      document.getElementById("start").value = text;
      firstSelectedTd = td;
    } else {
      // 두 번째 클릭
      document.getElementById("finish").value = text;
      secondSelectedTd = td;
    }

    // isStart 변수를 토글하기
    isStart = !isStart;
  });
});
