var mapContainer = document.getElementById("map"), // 지도를 표시할 div
  mapOption = {
    center: new kakao.maps.LatLng(37.551054, 127.073939), // 지도의 중심좌표(세종대)
    level: 3, // 지도의 확대 레벨
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

document.addEventListener("DOMContentLoaded", function () {
  var isStart = true;

  var tds = document.querySelectorAll("td");

  tds.forEach(function (td) {
    td.addEventListener("click", function () {
      var text = td.textContent.trim();
      if (isStart) {
        document.getElementById("start").value = text;
      } else {
        document.getElementById("finish").value = text;
      }

      isStart = !isStart;
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // 첫 번째 td 요소를 start로 사용할 것임을 나타내는 변수
  var isStart = true;

  // 모든 td 요소 가져오기
  var tds = document.querySelectorAll("td");

  // 각 td 요소에 클릭 이벤트 추가
  tds.forEach(function (td) {
    td.addEventListener("click", function () {
      // 클릭된 td 요소의 텍스트 가져오기
      var text = td.textContent.trim();

      // isStart 변수에 따라서 start 또는 finish input 요소에 텍스트 설정하기
      if (isStart) {
        document.getElementById("start").value = text;
      } else {
        document.getElementById("finish").value = text;
      }

      // isStart 변수를 토글하기
      isStart = !isStart;
    });
  });

  // 검색 버튼 가져오기
  var searchButton = document.getElementById("search_button");

  // 검색 버튼에 클릭 이벤트 추가
  searchButton.addEventListener("click", function () {
    // 출발지와 도착지 입력란의 값을 초기화
    document.getElementById("start").value = "";
    document.getElementById("finish").value = "";
  });
});
