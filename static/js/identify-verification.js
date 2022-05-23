/**
 * @param {*} referrerUrl | 현재 페이지의 url을 담는다
 * @param {*} itemNumber | 클릭이벤트때 해당 이벤트가 상품상세로 진입하는 경우 그 상품의 번호를 넣는다
 * @param {*} eventType | 'cart' or undefined 체크하기 위한인데 필요가 없어보임'
 * @param {*} _data | 받아서 그대로 전달하는 용도로 쓰임 ex) 레시피 하단 상품 목록의 장바구니타입
 */
function verification(referrerUrl, itemNumber, eventType, _data) {
  var webCheck = window.webStatus;
  var isBeforeLogin = false;
  var NOT_ACCESS_URL = [
    'goods/view',
    'member/adult-verification',
    'goods/goods_view',
  ]

  var _verification = {
    returnUrl: function (sessionUrl) {
      // 성인인증발생지점의 url을 저장함
      var url = location.href;
      var referrUrl = document.referrer !== '' ? document.referrer : (webCheck.device === 'pc' ? '/shop/main/index.php' : '/m2/index.php') ;
      var sessionUrl = sessionUrl ? sessionUrl : referrUrl;

      // 뒤로가기값이 있는 경우 해당값을 넣어준다.(단, 상품상세 or 인증페이지가 아닌경우에만)
      var isNotUrl = false;
      for (var i = 0; i < NOT_ACCESS_URL.length; i++) {
        if (url.indexOf(NOT_ACCESS_URL[i]) > -1) {
          isNotUrl = true;
        }
      }

      if (!isNotUrl) {
        return url;
      }

      return sessionUrl;
    },
    dateElapsed: function (date) {
      return date !== null && new Date(date).getTime() < webCheck.timestamp;
    },
    returnSession: function() {
      var VerificationReturnData = null;
      if (sessionStorage.getItem('VerificationReturnData') !== null) {
        VerificationReturnData = JSON.parse(sessionStorage.getItem('VerificationReturnData'));
      }

      return VerificationReturnData;
    },
    verificationSessionUpdate: function(isAdult, endTime, url) {
      if (webCheck.appCheck) {
        return false;
      }

      var sessionData = this.returnSession();

      sessionData = {
        referrer_url: this.returnUrl(url),
        appcheck: webCheck.appCheck,
        goodsno: itemNumber,
        appdevice: webCheck.appCheck ? webCheck.appDevice : false,
        isAdult: isAdult ? isAdult : (sessionData !== null && sessionData.isAdult ? sessionData.isAdult : false),
        endTime: endTime ? endTime : (sessionData !== null && sessionData.endTime ? sessionData.endTime : null),
        isBeforeLogin: isBeforeLogin,
      }

      sessionStorage.setItem('VerificationReturnData', JSON.stringify(sessionData));

      if (!sessionData.isAdult) {
        this.redirectVerification(false);
      } else if (sessionData.isAdult && this.dateElapsed(sessionData.endTime)) {
        this.redirectVerification(true);
      }else{
        this.successRender();
      }
    },
    identifyVerification: function() { // 성인인증체크
      var that = this;

      // 로그인 하러가기
      if (!webCheck.isSession) {
        isBeforeLogin = true;
        this.verificationSessionUpdate();
        var redirectLogin = webCheck.type === 'mobile' ? '/m2/mem/login.php?authAdult=' +  referrerUrl + '&no=' + itemNumber: '/shop/member/login.php?authAdult=' + referrerUrl + '&no=' + itemNumber;
        location.href = redirectLogin;
        return false;
      }

      if (this.returnSession() !== null && !this.returnSession().isBeforeLogin) {
        this.verificationSessionUpdate();
        return false;
      }

      kurlyApi({
        method : 'get',
        url : '/member/proxy/member-core/v1/metadata',
      }).then(function(data){
        var isAdult = data.data.data.adult.is_adult;
        var endTime = data.data.data.adult.expired_at;

        // 성공 or 실패 관계없이 1회 호출시 해당 값을 사용한다. 성인인증 완료되면 삭제처리됨
        // 세션추가이유: 뒤로 닫기 버튼에 사용됨, 성인인증 api 호출 제한
        var sessionUrl = false;
        if (that.returnSession() !== null && typeof that.returnSession().referrer_url !== 'undefined') {
          sessionUrl = that.returnSession().referrer_url;
        }
        sessionStorage.removeItem('VerificationReturnData');
        that.verificationSessionUpdate(isAdult, endTime, sessionUrl);
      }.bind(this)).catch(function(error){
        console.log('member/proxy/member-core/v1/metadata 호출 실패');
        console.log(error);
      });
    },
    redirectVerification: function(isDateElapsed) {
      if (isDateElapsed) {
        webCheck.device === 'pc' ?
        _oldAlert('성인인증 정보가 만료되었습니다.  \n성인인증 후 다시 시도해주세요.')
        : alert('성인인증 정보가 만료되었습니다.  \n성인인증 후 다시 시도해주세요.');
      }

      if (window.location.href.indexOf('/shop/goods/goods_view.php') > -1
      || window.location.href.indexOf('/m2/goods/view.php') > -1) {
        location.replace('/member/adult-verification');
        return;
      }

      location.href = '/member/adult-verification';
    },
    successRender: function() {
      if (eventType === 'goodsView') { // 상품상세 바로 접근
        sectionView.productRender(_data);
        return;
      }

      if (eventType === 'cart') { // 장바구니 레이어호출
        cartPut.dataSet(_data);
        return;
      }

      // 상품상세가 아닌경우 itemNumber를 사용하여 상품상세 페이지로 이동시킨다
      if (eventType === 'list') {
        var redirectTo = webCheck.type === 'mobile' ? '/m2/goods/view.php?goodsno=' +  itemNumber : '/shop/goods/goods_view.php?&goodsno=' + itemNumber;
        location.href = redirectTo;
        return;
      }

    }
  }
  _verification.identifyVerification();
};
