/**
 * 회원등급 (등급표: 기타 => 7, 웰컴투컬리 => 6, 일반 => 0, 프렌즈 => 5, 화이트 => 1, 라벤더 => 2, 퍼플 => 3, 더퍼플 => 4)
 * eventAppleUserGrade 에 header에서 php session 유저등급값을 넣어줌
 */
var eventAppleUserGrade = '';
/**
 * @param {*} pageType | 상품상세 'view', 상품목록 'list', 장바구니담기 'cart'
  * @param {*} no | pageType 따라 상품번호 or 카테고리 번호
 */
function eventApple(pageType, ProductNumber) {
  var eventAppleMsg = '프렌즈등급 이상 구매 가능한 전용 상품입니다.' + (window.webStatus.isSession ? '' : '로그인 후,') + '등급을 확인해주세요.';

  function productShowInform () {

    if (verificationShowInformData() && verificationShowInformGrade()) {
      window.webStatus.device === 'pc' ? _oldAlert(eventAppleMsg) : alert(eventAppleMsg);

      if (pageType === 'cart' || pageType === 'pick') {
        return true;
      }

      document.getElementsByTagName('body')[0].style.display = 'none';
      if (document.referrer === '') { // app 체크필요. url로 바로 접근한 케이스는 메인으로 이동
        location.href = window.webStatus.appCheck ? 'kurly://home' : '/';
      } else {
        history.back();
      }
    }
    return false;
  }

  // 정보노출 유무 - 현재 목록 또는 상품이 검증 항목인지 확인
  function verificationShowInformData () {
    var isSuccessData = false;

    /**
     * @param {*} goods | []: 상품번호
     * @param {*} category | []: 카테고리 or 컬렉션 번호
     * @param {*} msg | string: 얼럿 메세지
     */
    var ajaxUrl = window.webStatus.is_release_build ? 'https://res.kurly.com/json/event/2021/apple_1227.json' : 'https://res.kurly.com/json/event/2021/apple_1227_dev.json';
    $.ajax({
      url: ajaxUrl + '?ver=' + window.webStatus.timestamp, // 캐시적용 안되도록 처리
      type: 'GET',
      dataType: 'json',
      async: false,
    }).success(function(res) {
      var category = res.category;
      var item = res.goods;

      eventAppleMsg = res.msg ? (window.webStatus.isSession ? res.msgMember : res.msg) : eventAppleMsg;
      if (typeof ProductNumber === 'number') {
        ProductNumber = String(ProductNumber);
      }

      if (pageType === 'list' && category.length > 0) {
        for (var i = 0; i < category.length; i++) {
          if (ProductNumber === category[i]) {
            isSuccessData = true;
          }
        }
      }

      if ((pageType === 'view' || pageType === 'cart' || pageType === 'pick') && item.length > 0) {
        for (var i = 0; i < item.length; i++) {
          if (ProductNumber === item[i]) {
            isSuccessData = true;
          }
        }
      }
    }).fail(function() {
      console.log("에러발생 : 이벤트 상품 호출시 오류발생");
    });

    return isSuccessData;
  }

  // 정보노출 유무 - 사용자 등급확인
  function verificationShowInformGrade() {
    if (eventAppleUserGrade >= 1 && eventAppleUserGrade <= 5) {
      return false;
    }
    return true;
  }

  return productShowInform();
};

// 상품목록에서 다른 메뉴로 접근한는 경우 이벤트 호출필요
function eventAppleGoodsList(no) {
  if (typeof no !== 'undefined') {
    eventApple('list', no);
  }
}
