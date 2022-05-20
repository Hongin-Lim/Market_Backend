// mWeb용
Vue.component('user-menu-mw', {
  props:['loginCheck', 'notificationItem'],
  template:'\
    <span>\
        <span class="ico"  v-if="notificationItem.couponBadge || notificationItem.emoneyBadge || notificationItem.specialBadge || notificationItem.myBnrBadge || notificationItem.friendsBadge || notificationItem.memberBadge"></span>\
    </span>\
    '
});

// PC용
Vue.component('user-menu-pc', {
  props:['loginCheck', 'notificationItem', 'userInfo', 'returnUrl'],
  template:'\
    <ul class="list_menu">\
        <li class="menu none_sub menu_join" v-if="!loginCheck">\
            <a href="/shop/member/join.php" class="link_menu">회원가입</a>\
        </li>\
        <li class="menu none_sub menu_login" v-if="!loginCheck">\
            <a href="/shop/member/login.php" class="link_menu" v-if="!returnUrl">로그인</a>\
            <a :href="\'/shop/member/login.php?return_url=\' + returnUrl" class="link_menu" v-if="returnUrl">로그인</a>\
        </li>\
        <li class="menu menu_user" v-if="loginCheck">\
            <a onclick="KurlyTrackerLink(\'/shop/mypage/mypage_orderlist.php\', \'select_my_kurly_tab\')" class="link_menu grade_comm">\
                <span class="ico_grade" :class="classAdd(userInfo.userGrade)" v-html="userInfo.userGradeName"></span>\
                <span class="txt"><span class="name" v-html="userInfo.memberName"></span><span class="sir">님</span></span>\
                <span v-if="notificationItem.couponBadge || notificationItem.emoneyBadge || notificationItem.specialBadge || notificationItem.myBnrBadge || notificationItem.memberBadge">\
                    <img src="https://res.kurly.com/kurly/ico/2021/new_badge_28_28.png" alt="New" class="ico_new">\
                </span>\
            </a>\
            <ul class="sub">\
                <li>\
                    <a href="/shop/mypage/mypage_orderlist.php">주문 내역</a>\
                </li>\
                <li v-if="calculateOpenService()"\>\
                    <a href="#none" onclick="KurlyTrackerLink(\'/shop/mypage/mypage_gift.php\', \'select_my_kurly_gift_list\')">선물 내역</a>\
                </li>\
                <li>\
                    <a href="#none" onclick="KurlyTrackerLink(\'/shop/mypage/mypage_pick.php\', \'select_my_kurly_pick_list\', {selection_type: \'dropdown\'})">찜한 상품</a>\
                </li>\
                <li>\
                    <a href="#none" onclick="KurlyTrackerLink(\'/shop/mypage/destination/list.php\', \'select_shipping_address_list\')">배송지 관리</a>\
                </li>\
                <li>\
                    <a href="/shop/mypage/mypage_review.php">상품 후기</a>\
                </li>\
                <li>\
                    <a @click="handleInquiryPage">상품 문의</a>\
                </li>\
                <li>\
                    <a href="#none" onclick="KurlyTrackerLink(\'/shop/mypage/mypage_emoney.php\', \'select_my_kurly_point_history\', {selection_type: \'dropdown\'})">적립금</a>\
                    <img v-if="notificationItem.emoneyBadge" src="https://res.kurly.com/kurly/ico/2021/new_badge_28_28.png" alt="New" class="ico_new">\
                </li>\
                <li>\
                    <a href="#none" onclick="KurlyTrackerLink(\'/shop/mypage/mypage_coupon.php\', \'select_my_kurly_coupon_list\', {selection_type: \'dropdown\'})">쿠폰</a>\
                    <img v-if="notificationItem.couponBadge" src="https://res.kurly.com/kurly/ico/2021/new_badge_28_28.png" alt="New" class="ico_new">\
                </li>\
                <li>\
                    <a href="/shop/member/myinfo.php">개인 정보 수정</a>\
                </li>\
                <li>\
                    <a href="/shop/member/logout.php" @click="logoutEvent()">로그아웃</a>\
                </li>\
            </ul>\
        </li>\
        <li class="menu lst">\
            <a href="/shop/board/list.php?id=notice" class="link_menu" @mouseenter="KurlyTracker.setAction(\'select_my_kurly_service_center\').sendData();">고객센터</a>\
            <ul class="sub">\
                <li>\
                    <a href="#none" onclick="KurlyTrackerLink(\'/shop/board/list.php?id=notice\', \'select_my_kurly_notice_list\')">공지사항</a>\
                </li>\
                <li>\
                    <a href="#none" onclick="KurlyTrackerLink(\'/shop/service/faq.php\', \'select_my_kurly_frequently_qna\')">자주하는 질문</a>\
                </li>\
                <li>\
                    <a href="#none" onclick="KurlyTrackerLink(\'/mypage/inquiry/list\', \'select_my_kurly_personal_inquiry_history\')">1:1 문의</a>\
                </li>\
                <li>\
                    <a href="#none" onclick="KurlyTrackerLink(\'/shop/main/html.php?htmid=mypage/bulk_order.htm\', \'select_my_kurly_bulk_order\')">대량주문 문의</a>\
                </li>\
                <li>\
                    <a href="#none" onclick="KurlyTrackerLink(\'/shop/mypage/offer.php\', \'select_my_kurly_product_offer\')">상품 제안</a>\
                </li>\
                <li>\
                    <a href="#none" onclick="KurlyTrackerLink(\'/shop/mypage/echo_packing.php\', \'select_my_kurly_eco_packing_feedback\')">에코포장 피드백</a>\
                </li>\
            </ul>\
        </li>\
    </ul>\
    '
  ,
  methods :{
    classAdd : function(gradeNum){
      return 'grade' + gradeNum;
    },
    logoutEvent : function(){ // KM-1238 장차석 : Branch Web SDK
      if (sessionStorage.getItem('VerificationReturnData') !== null) {
        sessionStorage.removeItem('VerificationReturnData');
      }
      branch.logout();
    },
    handleInquiryPage: function(){
      location.assign('/shop/mypage/product_inquiry.php');
    },
    calculateOpenService: function(){
      // 2021-09-01 11:00:00 open
      var isProduction = window.location.host === 'www.kurly.com'
        || window.location.host ==='kurly.com';
      if (isProduction) {
        var releaseTime = new Date('2021-09-01T11:00:00+09:00').getTime();
        return releaseTime <= window.webStatus.timestamp;
      } else {
        return true;
      }
    }
  },
});

var userMenu = new Vue({
  el: '#userMenu',
  data: {
    loginCheck : false,
    notification : null, // 데이터받는부분
    notificationItem : [], // 데이터객체화
    userInfo : [],
    postArr : [], // 뱃지제거용
    afterCheck : false, // 예외처리(뺏지 제거는 하지만 현재 페이지엔 노출되는경우)
    errors: [],
    count : 0,
    returnUrl : false,
    type: 'pc'
  },
  mounted: function () {
  },
  methods: {
    update : function(postText){
      if(postText === undefined || postText === false){
        sessionStorage.setItem('badgeCheck', false);
        postText = false;
      }else{
        if(sessionStorage.getItem('badgeCheck') !== postText){
          sessionStorage.setItem('badgeCheck', postText);
        }else{
          this.afterCheck = true;
        }
      }
      var date = new Date().getTime(); // 뒤로가기시 캐시제거용

      kurlyApi({
        method:'get',
        url:'/v1/mypage/notification?'+date
      })
      .then(function(response) {
        if(response.status != 200) return;
        this.notification = response.data.data;
        this.itemSet(postText);

        $('.bg_loading').hide();
        return response.data.data
      }.bind(this)).catch(function(e){
        // 데이터 없을시에 로그인페이지로 넘기기
        $('.bg_loading').hide();
        console.log('usermenu_v1.js: notification 호출시 오류 발생됨');
      });
    },
    itemSet : function(postText){
      if(this.notification.mykurly_banner === null){
        this.notification.mykurly_banner = {
          image_url : null,
          landing_url : null,
          badge : null
        }
      }
      if(this.notification.kurlylovers_benefit === null){
        this.notification.kurlylovers_benefit = {
          tag : null,
          badge : null
        }
      }
      this.notificationItem ={
        couponBadge : this.notification.coupon_badge, // 쿠폰뱃지
        emoneyBadge : this.notification.emoney_badge, // 적립금뱃지
        friendsBadge : this.notification.friends_invite_badge, // 친구추천뱃지
        specialTag : this.notification.kurlylovers_benefit.tag, // 특별한혜택명
        specialBadge : this.notification.kurlylovers_benefit.badge, // 특별한혜택뱃지
        memberBadge : this.notification.member_benefit_policy_badge, // 회원혜택뱃지
        myBnrUrl : this.notification.mykurly_banner.image_url, // 마이페이지 배너URL
        myBnrLink : this.notification.mykurly_banner.landing_url, // 마이페이지 배너Link
        myBnrBadge : this.notification.mykurly_banner.badge // 마이페이지 배너뱃지
      }

      if(postText != false){
        if(this.notificationItem.couponBadge && postText === 'coupon_badge'){
          this.postArr.push('coupon_badge');
        }else if(this.notificationItem.emoneyBadge && postText === 'emoney_badge'){
          this.postArr.push('emoney_badge');
        }else if(this.notificationItem.friendsBadge && postText === 'friends_invite_badge'){
          this.postArr.push('friends_invite_badge');
        }else if(this.notificationItem.memberBadge && postText === 'member_benefit_policy_badge'){
          this.postArr.push('member_benefit_policy_badge');
        }
      }
      this.mypageCall();
    },
    mypageCall : function(){
      var $self = this;

      if($('#myPageTop').length > 0){
        if($self.notificationItem.myBnrBadge){
          $self.postArr.push('mykurly_banner');
        }else{
          if($self.notificationItem.specialBadge){
            $self.postArr.push('kurlylovers_benefit');
            $self.afterCheck = true;
          }
        }
      }

      if($self.postArr.length > 0){
        kurlyApi({
          method:'post',
          url:'/v1/mypage/notification/read',
          data:{
            'badge_type':$self.postArr
          }
        }).then(function(response){
          if(response.status != 200) return;
          $self.postArr = [];
          if($self.afterCheck != true){
            $self.notification = response.data.data;
            $self.itemSet(false);
          }else{
            $('.bg_loading').hide();
          }
        }.bind(this)).catch(function(e){
          console.log(this);
          // this.errors.push(e);
          // console.error(this.errors.reduce(function (str, err) {
          //     var alertMsg = 'MESSAGE: ' + err.message;
          //     return str + "\n" + alertMsg;
          // }, ''));

          // alert(this.erors.code + this.errors.message);
        }.bind(this));
      }

      if($('#myPageTop').length > 0){
        myPageTop.type= $self.type;
        myPageTop.update();
      }
    }
  }
});
