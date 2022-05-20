/**
 * 고객 주소지가 샛별지역 설정 경우에 노출
 * 택배 only 상품, 로그인X 미노출
 * 부산/울산, 대구처럼 일부 시간대만 샛별인 경우, 해당 시간대에만 노출? (웹은 session에 저장, 앱은 매번 호출해줘야함)
 * 로그인시 'direct'가 체크됨. 로그인시 정보를 session에 update 해줘야함
 *
 * 비로그인시 처리는? 샛별배송
 * 사용자 배송지 정보는 트래픽 부하를 방지하기 캐시가 적용된 api를 호출함(시간대별로 배송유형이 변경되는 곳이라면 최대 1시간은 택배일지라도 캐싱에 의해  보일 수 있는 점)
 *
 * @param {*} pageType | 'view': 상품상세, 'order_end': 주문완료, 'order': pc 주문서
 * @param {*} targetName | getElementById 없으면 return false 처리
 *
 */
function holidayDelivery(pageType, targetName) {
  var holidayDeliveryData = null, targetId = '';

  function getParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  function pageCheck() {
    targetId = document.getElementById(targetName);

    // 앱 & 상품상세 & 상품설명: 아닌경우 호출 안하도록 처리
    if (window.webStatus.appCheck && pageType === 'view' && getParameter('menu') !== 'productDesc') {
      return false;
    }

    if (!targetId) {
      return false;
    }

    if (verificationHolidayDate()) {
      if (pageType !== 'view') {
        renderHolidayDelivery();
        return true;
      }

      if (pageType === 'view') {
        deliveryMethod();
      }
    }
  }

  function verificationHolidayDate() {
    var isSuccessData = false;
    var jsonUrl = window.webStatus.is_release_build ? 'https://res.kurly.com/json/event/2022/holidayDelivery.json' : 'https://res.kurly.com/json/event/2022/holidayDelivery_dev.json'
    /**
      * @param {startDate} string | 시작
      * @param {endDate} string  | 종료
      * @param {title} string | 제목
      * @param {description} html | 주문서 내용
      * @param {src} string  | 이미지경로
      * @param {isUsePage} ["view", "order", "orderEnd"] | 사용유무(급하게 사용 종료처리할때)
      */
    $.ajax({
      url: jsonUrl + '?ver=' + window.webStatus.timestamp,
      type: 'GET',
      dataType: 'json',
      async: false,
    }).success(function(res) {
      var isPageCheck = false;

      for (var i = 0; i < res.isUsePage.length; i++) {
        if (res.isUsePage[i] === pageType){
          isPageCheck = true;
        }
      }

      if (!isPageCheck) {
        return false;
      }

      var currentTimestamp = window.webStatus.timestamp
      var startTimestamp = new Date(res.startDate).getTime();
      var endTimestamp = new Date(res.endDate).getTime();
      if (startTimestamp <= currentTimestamp && currentTimestamp < endTimestamp) {
        holidayDeliveryData = res;
        isSuccessData = true;
      }
    }).fail(function() {
      console.log("에러발생 : 명절날 체크 json 호출 오류");
      isSuccessData = false;
    });

    return isSuccessData;
  }

  function deliveryMethod() {
    /**
      * 배송방법 가져오기
      * 주문서와 주문완료페이지는 배송방법을 따로 가지고 있기 때문에 이부분 사용안함
      */
    // 해당 session('deliveryType')은 배송지 등록시에 자동으로 생성됨
    var directDelivery = sessionStorage.getItem('deliveryType');

    // 샛별배송 or 비로그인
    if (directDelivery === 'direct' || !window.webStatus.isSession) {
      renderHolidayDelivery();
      return true;
    }

    // directDelivery !== false 인경우있음. 택배배송or배송불가
    if (directDelivery) {
      return false;
    }

    kurlyApi({
      method:'get',
      url: '/cart/v1/cart'
    }).then(function(response){
      var type = response.data.data.delivery_type;
      if (type === 'direct') { // data.delivery_type: 'direct', 'indirect', 'none' (샛별, 택배, 불가)
        renderHolidayDelivery();
      }
    }.bind(this)).catch(function(e){
      console.log(e)
    });
  }

  function renderHolidayDelivery() {
    var massege = '';
    if (pageType === 'orderEnd') {
      massege = holidayDeliveryData.title;
    }
    if (pageType === 'order') {
      massege = holidayDeliveryData.description;
      if (massege !== '') {
        targetId.style.display = 'block';
      }
    }
    if (pageType === 'view') {
      massege = '<span class="tit_item">배송정보</span>' + holidayDeliveryData.description + '</div>';
      if (massege !== '') {
        targetId.classList.add('on');
      }
    }
    targetId.innerHTML = massege;
  }

  return pageCheck();
};
