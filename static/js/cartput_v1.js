/**
 * cartType = view,view2, layer
 * view => 상품상세 하단 장바구니
 * layer => 상품 목록 장바구니
 * view2 => pc용 상품 상세 상단 장바구니
 */
Vue.component('cart-put',{
  props:['memberBenefitsPoint','user', 'cartType', 'productsType', 'data', 'items', 'type', 'totalPrice', 'totalPoint', 'count', 'layerShow', 'isPicked'],
  template:'\
            <div class="cart_option cartList" :class="{cart_type1 : cartType === \'view\', cart_type2 : cartType === \'view2\', cart_type3 : cartType === \'layer\', off : !layerShow}">\
            <div class="inner_option">\
                <button type="button" class="btn_close1" :class="{on : data.is_detail_sold_out}" @click="$emit(\'layer-close\')" v-if="cartType === \'layer\'">레이어닫기</button>\
                <strong class="tit_cart" v-if="data.is_package">{{ data.name }}</strong>\
                <div class="in_option" :class="{option_pass : data.is_kurly_pass_product}">\
                    <!-- 옵션,패키지상품 -->\
                    <div class="list_goods">\
                        <div class="bar_open" v-if="(layer && cartType !== \'layer\') || (type === \'pc\' && cartType === \'view\')"><button type="button" class="btn_close" @click="layerAction()"><span class="ico" :class="{open : layer}">상품 선택</span></button></div>\
                        <div class="box_select" v-if="type === \'mobile\' && (layer && cartType !== \'layer\' && data.is_package)">\
                            <select class="select_item" @change="$emit(\'select-box-show\', \'show\', $event.target.value);selectDefault();">\
                                <option :selected="selectDefault">상품 선택</option>\
                                <option v-for="(item, idx) in items" :value="idx" :disabled="item.is_detail_sold_out || !item.is_purchase_status">\
                                  <span v-if="!item.is_purchase_status">(구매불가)</span>\
                                  <span v-else-if="item.is_detail_sold_out">(품절)</span>\
                                  {{ item.name }}\
                                </option>\
                            </select>\
                            <span class="select_arrow"></span>\
                        </div>\
                        <div class="box_select" :class="{off : cartType === \'view\' && !layer}" v-if="type === \'pc\' && cartType !== \'layer\' && data.is_package ">\
                            <strong class="name">상품 선택</strong>\
                            <div class="inner_select">\
                                <a href="#none" class="txt_select" :class="{open : selectBoxType}" @click="selectBoxOpen()">상품 선택</a>\
                                <ul class="select_item" v-if="selectBoxType">\
                                    <li v-for="(item, idx) in items" :class="{fst : idx === 0}">\
                                        <a href="#none" :class="{sold_out : item.is_detail_sold_out || !item.is_purchase_status}" @click="$emit(\'select-box-show\', \'show\', idx, item.is_detail_sold_out, item.is_purchase_status);selectBoxOpen();">\
                                            <sapn class="item_name">\
                                              <span v-if="!item.is_purchase_status">(구매불가)</span>\
                                              <span v-else-if="item.is_detail_sold_out">(품절)</span>\
                                              {{ item.name }}\
                                              <span class="txt_expected" v-if="!item.is_expected_point && user">적립제외상품</span>\
                                            </sapn>\
                                            <span class="price">\
                                                <span :class="{original_price : user && (item.original_price !== item.discounted_price), dc_price : !user || (item.original_price === item.discounted_price)}">{{ item.original_price | commaFilter }}원</span>\
                                                <span class="dc_price" v-if="user && (item.original_price !== item.discounted_price)">{{ item.discounted_price | commaFilter }}원</span>\
                                            </span>\
                                        </a>\
                                    </li>\
                                </ul>\
                            </div>\
                        </div>\
                        <ul class="list" :class="{list_nopackage : !data.is_package}" v-if="layer || cartType === \'layer\' || cartType === \'view2\'">\
                            <li v-for="(item, idx) in items" :class="{on : item.checked, off : !item.checked, sold_out : item.is_detail_sold_out || !item.is_purchase_status}">\
                                <span class="btn_position" :class="{on : data.is_package && cartType !== \'layer\'}">\
                                    <button type="button" class="btn_del" @click="$emit(\'select-box-show\', \'hide\', idx)"><span class="txt">삭제하기</span></button>\
                                </span>\
                                <span class="name">\
                                  <span v-if="!item.is_purchase_status">(구매불가)</span>\
                                  <span v-else-if="item.is_detail_sold_out">(품절)</span>\
                                  {{ item.name }}\
                                  <span class="txt_expected" v-if="!item.is_expected_point && user">적립제외상품</span>\
                                </span>\
                                <span class="tit_item" v-if="cartType === \'view2\' && !data.is_package">구매수량</span>\
                                <div class="option">\
                                    <!-- <button type="button" class="restock off"><span class="ico"></span>재입고 알림</button> -->\
                                    <span class="count" v-if="!item.is_detail_sold_out && item.is_purchase_status">\
                                        <button type="button" class="btn down on" @click="$emit(\'update-ea\', \'m\', item)">수량내리기</button>\
                                        <input type="number" class="inp" :value="item.ea" readonly="readonly" onfocus="this.blur()">\
                                        <button type="button" class="btn up on" @click="$emit(\'update-ea\', \'p\', item)">수량올리기</button>\
                                    </span>\
                                    <span class="price">\
                                        <span class="dc_price" v-if="user && (item.original_price !== item.discounted_price)">{{ item.discounted_price | commaFilter }}원</span>\
                                        <span :class="{original_price : user && (item.original_price !== item.discounted_price), dc_price : !user || (item.original_price === item.discounted_price)}">{{ item.original_price | commaFilter }}원</span>\
                                    </span>\
                                </div>\
                            </li>\
                        </ul>\
                    </div>\
                    <div id="holidayDeliveryInfo" class="holiday_delivery" v-if="cartType === \'view2\' && type === \'pc\'"></div>\
                    <div class="info_adult" v-if="cartType === \'view2\' && data.is_only_adult">\
                      <p class="txt_adult">미성년자는 구매할 수 없으며, 구매를 위해 만 19세 이상 성인인증이 필요합니다.</p>\
                    </div>\
                    <!-- 합계 -->\
                    <div class="total" :class="{no_border : data.is_detail_sold_out || data.is_only_adult}" v-if="(layer && count > 0 ) || cartType === \'layer\' || cartType === \'view2\'">\
                        <div class="price">\
                            <strong class="tit" v-if="type === \'mobile\' || cartType === \'layer\'">합계</strong>\
                            <strong class="tit" v-if="type === \'pc\' && cartType !== \'layer\'">총 상품금액 :</strong>\
                            <span class="sum">\
                                <span class="num">{{ totalPrice | commaFilter }}</span>\
                                <span class="won">원</span>\
                            </span>\
                        </div>\
                        <p class="txt_point" v-if="!data.is_kurly_pass_product">\
                            <span class="ico">적립</span>\
                            <span class="no_login" v-if="!user">\
                                <span v-if="data.dcResult">로그인 후, 회원할인가와 적립혜택 제공</span>\
                                <span v-if="!data.dcResult">로그인 후, 적립혜택 제공</span>\
                            </span>\
                            <span class="point" v-if="user&&memberBenefitsPoint">\
                                구매 시 <strong class="emph">{{ totalPoint | commaFilter }}원 적립</strong>\
                            </span>\
                        </p>\
                    </div>\
                </div>\
                <div\
                  class="cart_footer"\
                  :class="{off: !layer}"\
                  v-if="cartType !== \'layer\'"\
                >\
                  <div class="functions">\
                    <button\
                      class="pick_icon_button" \
                      :class="isPicked ? \'on\' : \'\'" \
                      @click="pickAction()"\
                      type="button"\
                    >\
                      찜하기 버튼\
                    </button>\
                    <button\
                      class="alarm_button"\
                      :disabled="!data.use_stocked_notify"\
                      @click="notifyAction()" \
                      type="button"\
                    >\
                      재입고 알림\
                    </button>\
                  </div>\
                  <div class="button_wrap" v-if="!isGift && !data.is_detail_sold_out">\
                    <button\
                      class="base_button full"\
                      v-if="!data.is_buy_now"\
                      @click="layerAction(\'cart\', count)"\
                      type="button"\
                    >\
                      장바구니 담기\
                    </button>\
                    <button\
                      class="base_button full"\
                      v-if="data.is_buy_now"\
                      @click="layerAction(\'buy\', count)"\
                      type="button"\
                    >\
                      바로구매\
                    </button>\
                  </div>\
                  <div class="button_wrap" v-if="isGift && !data.is_detail_sold_out && !data.is_buy_now">\
                    <button\
                      class="base_button full"\
                      @click="layerAction(\'gift\', count)"\
                      disabled="type !== \'pc\'"\
                      type="button"\
                    >\
                      {{ type !== \'pc\' ? \'선물하기\' : \'모바일 전용 상품입니다\' }}\
                    </button>\
                  </div>\
                  <div class="button_wrap" v-if="data.is_detail_sold_out">\
                    <button\
                      class="base_button full"\
                      disabled\
                      type="button"\
                    >\
                      상품 준비 중입니다\
                    </button>\
                  </div>\
                </div>\
                <div class="cart_modal_footer" v-if="cartType === \'layer\'">\
                  <button\
                    class="base_button cancel half"\
                    @click="$emit(\'layer-close\')"\
                    type="button"\
                  >\
                    취소\
                  </button>\
                  <button \
                    class="base_button half"\
                    v-if="!data.is_buy_now"\
                    @click="layerAction(\'cart\', 1)"\
                    type="button"\
                  >\
                    장바구니 담기\
                  </button>\
                  <button \
                    class="base_button half"\
                    v-if="data.is_buy_now"\
                    @click="layerAction(\'buy\', 1)"\
                    type="button"\
                  >\
                    바로구매\
                  </button>\
                </div>\
                <span class="app_only" v-if="isGift && cartType === \'view2\'"\>마켓컬리 앱에서 이용할 수 있습니다.</span>\
            </div>\
            </div>\
            '
  , data : function(){
    return {
      layer : false,
      alarmCheck : false,
      selectCheck : false,
      selectBoxType : false,
    }
  },
  computed: {
    isGift: function() {
      /**
       * TODO: PC와 모바일 웹에서는 선물하기 기능을 노출하지 않도록 하기 위해서
       * 선물하기 버튼을 노출하지 않도록 합니다.
       */
      // return this.data.is_giftable;
      return false;
    }
  },
  methods:{
    layerAction : function(type, count){ // 레이어열기닫기
      if(this.data.buyable_kind === 2 && !this.user){
        // this.data.buyable_kind =>  0: 구매 불가 , 1: 구매가능 2: 회원전용 3: 특정회원 그룹 소속
        // 0 => goodsBuyable === false
        this.$emit('login-check-action', '회원 전용 구매 상품입니다. 로그인 화면으로 이동합니다.');
        return;
      }
      if(this.layer || this.cartType === 'layer' || this.cartType === 'view2'){
        if(type === 'cart'){
          if(count === 0){
            this.layer = false;
            return;
          }
          this.$emit('cart-put-action');
        }else if(type === 'buy'){
          // kurly-jhlim - sessionStorage에 저장된 정보 사용
          var isDisable = sessionStorage.getItem('deliveryType') === 'disable';
          if (isDisable) {
            alert('배송불가 지역입니다.');
          } else {
            if(count === 0){
              this.layer = false;
              return;
            }
            this.$emit('buy-now', this.type);
          }
        } else if (type === 'gift') {
          this.$emit('purchase-gift');
          return;
        } else {
          this.layer = false;
        }
      }else{
        this.layer = true;
      }

      if(this.cartType === 'view' && this.type === 'pc'){
        this.$emit('top-btn-action', this.layer);
      }

      // KM-1483 Amplitude
      if(this.cartType === 'view' && this.layer && !this.data.is_buy_now){
        var _action_data = this.data;
        _action_data.referrer_event = 'select_product';
        KurlyTracker.setAction('select_purchase', _action_data).sendData();
        KurlyTracker.setScreenName('product_selection').setAction('view_product_selection', _action_data).sendData();
      }
      // END : KM-1483 Amplitude
    }
    ,selectBoxOpen : function(){
      this.selectBoxType = this.selectBoxType ? false : true;
    }
    ,notifyAction:function(type, no){ // 재입고 알림
      if(!this.user){
        this.$emit('login-check-action');
        return;
      }
      this.$emit('notify-option-layer');
    }
    ,pickAction: function() {
      if(!this.user){
        this.$emit('login-check-action', '회원 전용 서비스입니다. 로그인/회원가입 페이지로 이동하시겠습니까?');
        return;
      }

      this.$emit('toggle-pick', this.data.no, this.data);
    }
    ,selectDefault : function(){ // 셀렉트박스일때 항상 가장위에값 노출되도록 사용
      this.selectCheck = true;
    }
  }
});


// 주소지가 없는경우
Vue.component('cart-put-address', {
  props:['type', 'data'],
  template:'\
    <div class="cart_option cart_result cart_type3" :class="{on : data.setAddress}">\
      <div class="inner_option">\
        <button type="button" class="btn_close1" @click="$emit(\'layer-close\', \'success\')" v-if="type === \'pc\'">{{type}}레이어닫기</button>\
        <p class="success">상품 구매를 위한 <span class="bar"></span>배송지를 설정해주세요</p>\
        <div class="group_btn layer_btn2">\
          <span class="btn_type2"><button type="button" class="txt_type" @click="$emit(\'layer-close\', \'success\')">취소</button></span>\
          <span class="btn_type1"><button type="button" class="txt_type" @click="linkAction(type)"><span class="ico_search"></span>주소 검색</button></span>\
        </div>\
      </div>\
    </div>\
    '
  , methods:{
    linkAction : function(type){
      this.$emit('layer-close', 'success'); // KQA-819 iOS에서 뒤로가기 했을때 보이는 이슈가 있어서 강제 가림

      // KM-4172 : amplitude 11월
      KurlyTracker.setAction('select_direct_purchase_shipping_address').sendData();

      if(type === 'mobile'){
        location.href = '/m2/myp/destination/chkAddress.php?guest=1';
      }else{
        window.destinationPopOpen.set('search', {
          device: 'popup',
          from: 'pc',
        });
      }
    }
  }
});


// 재입고 알림 신청
// use_stocked_notify
Vue.component('stocked-notify', {
  props:['type', 'data', 'items'],
  template:'\
    <div class="cart_option cart_type3 notify_option" :class="{on : data.setNotify}" v-if="items.length > 0">\
      <div class="inner_option">\
        <!-- <button type="button" class="btn_close1" @click="$emit(\'layer-close\', \'success\')" v-if="type === \'pc\'">레이어닫기</button> -->\
        <strong class="tit">재입고 알림 신청</strong>\
        <p class="name_deal" :class="{package : data.is_package}">{{ data.name }}</p>\
        <!-- 패키지가 있는경우 아래 셀렉트 적용 -->\
        <div v-if="type !== \'pc\' && data.is_package">\
          <select class="select_item" @change="selectEvent(\'select\', $event.target.value);">\
            <option v-for="(item, idx) in items" :value="idx">{{item.name}}</option>\
          </select>\
          <span class="select_arrow"></span>\
        </div>\
        <div class="box_select" v-if="type === \'pc\' && data.is_package ">\
            <strong class="name">상품 선택</strong>\
            <div class="inner_select">\
                <a href="#none" class="txt_select" :class="{open : selectBoxType}" @click="selectBoxOpen()">{{ selectName !== null ? selectName : items[0].name }}</a>\
                <ul class="select_item" v-if="selectBoxType">\
                    <li v-for="(item, idx) in items" :class="{fst : idx === 0}">\
                        <a href="#none" @click="selectEvent(\'layer\', idx);selectBoxOpen();">\
                            <sapn class="item_name">{{ item.name }}</sapn>\
                        </a>\
                    </li>\
                </ul>\
            </div>\
        </div>\
        <p class="notice"><span class="ico">&#183;</span>상품이 입고되면 앱 푸시 또는 알림톡으로 알려 드립니다.</p>\
        <div class="group_btn layer_btn2">\
          <span class="btn_type2"><button type="button" class="txt_type" @click="defaultSet();$emit(\'notify-option-layer\', \'close\')">취소</button></span>\
          <span class="btn_type1"><button type="button" class="txt_type" @click="linkAction(type)">신청하기</button></span>\
        </div>\
      </div>\
    </div>\
    '
  , data : function(){
    return {
      selectName: null,
      selectBoxType: false,
      selectNo: 0,
    }
  }
  , methods:{
    defaultSet: function(){
      this.selectName = null;
      this.selectBoxType = false;
    },
    linkAction : function(type){
      // this.$emit('notify-option-layer'); // KQA-819 iOS에서 뒤로가기 했을때 보이는 이슈가 있어서 강제 가림
      var actionData = {
        isPackage: this.data.is_package,
        countTotalItem: this.items.length,
        item: this.items[0]
      }
      if(actionData.isPackage){ // 패키지 상품은 현재 선택한 상품만 신청가능
        actionData.item = this.items[this.selectNo];
      }
      this.$emit('notify-option-action', actionData);
    }
    ,selectBoxOpen : function(){
      this.selectBoxType = this.selectBoxType ? false : true;
    }
    ,selectEvent: function(type, no){
      // 패키지의 몇번째 값인지 설정
      // 만약 따로 선택하지 않았다면 0번
      this.selectNo = no;
      if(type === 'layer'){
        this.selectName = this.items[no].name;
      }
    }
  }
});


// mobile전용
Vue.component('cart-put-success', {
  props:['type', 'data'],
  template:'\
        <div class="cart_option cart_result cart_type3" :class="{on : data.success}">\
            <div class="inner_option">\
                <p class="success">\
                    <span v-if="!data.isReaddedItem">\
                      선택한 상품이\
                      <br>장바구니에 담겼습니다.\
                    </span>\
                    <span v-if="data.isReaddedItem">\
                      장바구니 상품의\
                      <br>수량이 변경되었습니다.\
                    </span>\
                </p>\
                <div class="group_btn layer_btn2">\
                    <span class="btn_type2"><button type="button" class="txt_type" @click="linkAction(type)">장바구니 확인</button></span>\
                    <span class="btn_type1"><button type="button" class="txt_type" @click="$emit(\'layer-close\', \'success\')">계속 쇼핑하기</button></span>\
                </div>\
            </div>\
        </div>\
    '
  , methods:{
    linkAction : function(type){
      this.$emit('layer-close', 'success'); // KQA-819 iOS에서 뒤로가기 했을때 보이는 이슈가 있어서 강제 가림
      location.href = '/m2/goods/cart.php';
    }
  }
});








var cartPut = new Vue({
  el: '#cartPut',
  data: function () {
    return {
      viewData : false, // 상품상세에서 해당 기능 사용시 api 호출 안되도록 처리
      userData : false, // 회원정보
      goodsNo : null, // 상품번호
      cartType : 'layer', // layer, view, view2 장바구니 타입
      productsType : 0, // 단일, 패키지 상품 구분
      postData : {}, // 단일, 패키지상관없이 상품명
      totalPrice : 0,
      totalPoint : 0, // 적립가능한 적립금
      products : [], // 상품담기
      count : 0, // 상품상세 장바구니 담기 액션 , 레이어 장바구니 담기 액션 구분값
      layerShow : false,
      checkResult : false, // 셀렉트박스형일때 각 상품 노출 비노출처리 하기위해 사용
      fusionSignalCheckId : null,// fusionSignal 아이디 중복문제로 해당 아이디체크하기위해 추가
      type : 'pc', // device 체크
      errors : [],
      memberBenefitsPoint: null,
      isCartEvent: false,
      unitCount: 1,
      deliveryType: '',
      notifyData: [], // 재입고 알람 버튼 클릭시 해당 키에 재입고 상품을 추가하여 보여주는 값
      isNotifyLayerCheck: false, // true 상품목록에서 재입고 알림 클릭한 경우 재입고 알림 레이어 노출
      isNotifyOptionAction: false, // notifyOptionAction 이벤트 여러번 동작 안되도록 수정
      isPicked: false,
      pageType: '',
    }
  },
  created :function() {
    kurlyApi({
      method:'get',
      url: '/v3/members/member-benefits/point'
    }).then(function(response){
      if(typeof response === 'undefined' || response.status != 200) return;
      var data = response.data.data;
      this.memberBenefitsPoint = data
    }.bind(this)).catch(function(error){
      console.error(error)
    }.bind(this))
  },
  mounted : function() {
    var isDetailPage = window.location.href.indexOf('/goods/view') > -1;

    if (!isDetailPage) return false;

    var hasLogin = webStatus.isSession;
    var device = webStatus.device;
    var isNotPc = device !== 'pc';
    var hasNoDeliveryType = sessionStorage.getItem('isDeliveryCartPut') === null || sessionStorage.getItem('isDeliveryCartPut') === 'false' || sessionStorage.getItem('deliveryType') === null || sessionStorage.getItem('deliveryType') === '';

    if (isNotPc && hasNoDeliveryType) {
      var GUEST_URL = '/v3/auth/guest';
      var CART_URL = '/cart/v1/cart';
      var ADDR_URL = '/addressbook/v1/cart/check-base-address-notification';

      function ApiInterface (method, url) {
        this.method = method;
        this.url = url;
      }

      ApiInterface.prototype.dispatch = function () {
        return kurlyApi({
          method: this.method,
          url: this.url,
        })
          .then(function (res) {
            return res;
          })
          .catch(function (err) {
            return err;
          });
      };

      function postToken (url) {
        var instance = new ApiInterface('post', url);
        return instance.dispatch();
      }

      function getAddress (url) {
        var instance = new ApiInterface('get', url);
        return instance.dispatch();
      }

      if (!hasLogin) {
        postToken(GUEST_URL)
          .then(function() {
            getAddress(CART_URL)
              .then(function(res) {
                var addressInfo = res.data.data;
                var address = addressInfo.address;
                var deliveryType = addressInfo.delivery_type;
                if (address !== '') {
                  this.deliveryType = deliveryType;
                  sessionStorage.setItem('deliveryType', this.deliveryType);
                  sessionStorage.setItem('isDeliveryCartPut', 'true');
                }
              })
              .catch(function(err) {
                console.log(err.message);
              });
          })
          .catch(function(err) {
            console.log(err.message);
          });
      } else {
        getAddress(ADDR_URL)
          .then(function(res) {
            var addressInfo = res.data.data;
            var address = addressInfo.address;
            var deliveryType = addressInfo.delivery_type;
            if (address !== '') {
              this.deliveryType = deliveryType;
              sessionStorage.setItem('deliveryType', this.deliveryType);
              sessionStorage.setItem('isDeliveryCartPut', 'true');
            }
          })
          .catch(function(err) {
            console.log(err.message);
          });
      }
    }
  },
  methods: {
    update : function(){

      // KMF-1257 이벤트상품: 등급에 따른 노출처리
      if(this.pageType !== 'view' && window.eventApple('cart', this.goodsNo)) {
        this.layerClose();
        return;
      }

      var $self = this;

      if($self.cartType === 'layer'){
        $self.checkResult = true;
        $self.count = 1;
      }

      if($self.type === 'pc'){
        $self.count = 1;
      }

      if($self.viewData){
        $self.dataSet( $self.viewData );
        $self.getIsPickedProduct($self.viewData.no);
        return;
      }

      kurlyApi({
        method:'get',
        url:'/v3/home/products/' + $self.goodsNo
      }).then(function(response){
        if(typeof response === 'undefined' || response.status != 200) return;

        // 레이어타입일때 성인인증 상품인경우, common_js/identify-verification.js 에서 처리
        if($self.cartType === 'layer' && response.data.data.is_only_adult) {
          window.verification(location.href, response.data.data.no, 'cart', response.data.data);
          return false;
        }

        $self.dataSet(response.data.data);
        $self.getIsPickedProduct(response.data.data.no);
      }.bind(this)).catch(function(error){
        alert(error.response.data.message);
        $self.layerClose('success');
      });
    }, dataSet : function(response){
      var $self = this;
      var noPackage, dataSave, i, len, dcResult = false;
      var countPackageSoldout = 0, countPackageStockedNotify = 0;
      dataSave = response;

      if(dataSave.original_price != dataSave.discounted_price){
        dcResult = true; // 할인유무파악
      }
      $self.$set(dataSave, "dcResult", dcResult);
      if(!dataSave.is_detail_sold_out && dataSave.is_package_sold_out){ // 패키지상품 품절인경우 상품 품절처리
        dataSave.is_detail_sold_out = dataSave.is_package_sold_out;
      }
      if(dataSave.sales_status === 'before' || dataSave.sales_status === 'end'){ // 상품상태값에 따른 솔드아웃처리
        dataSave.is_detail_sold_out = true;
      }
      // if(dataSave.delivery_time_types.indexOf(2) > -1){ // 특정 상품 바로 구매 적용시
      //   dataSave.is_buy_now = true;
      // }
      // dataSave.use_discount_percent : 할인률이 아닌 할인가 일때 넘어오는값(false)
      // $self.$set(dataSave, "delitime_type", dataSave.delivery_time_types); // 장바구니 성공레이어 띄울때사용
      $self.$set(dataSave, "setAddress", false); //  배송지 설정 띄울때사용
      $self.$set(dataSave, "success", false); // 장바구니 성공레이어 띄울때사용
      $self.$set(dataSave, "setNotify", false); //  배송지 설정 띄울때사용
      $self.$set(dataSave, "wishCheck", false); // 늘사는것담기 체크값
      $self.postData = dataSave;
      $self.productsType = dataSave.package_type;
      $self.products = [];
      $self.unitCount = dataSave.sales_unit
      $self.notifyData = [];

      if($self.productsType === 0){ // 단품
        noPackage = {
          is_expected_point: dataSave.is_expected_point,
          expected_point: dataSave.expected_point,
          expected_point_ratio: dataSave.expected_point_ratio,
          discount_percent:dataSave.discount_percent,
          discounted_price: dataSave.discounted_price,
          is_buy_now: dataSave.is_buy_now,
          is_detail_sold_out: dataSave.is_detail_sold_out,
          max_ea: dataSave.max_ea,
          min_ea: dataSave.min_ea,
          name: dataSave.name,
          no: dataSave.no,
          original_price: dataSave.original_price,
          sold_out_text: dataSave.sold_out_text,
          under_specific_quantity: dataSave.under_specific_quantity,
          ea: dataSave.is_package ? 0 : dataSave.min_ea > 1 ? dataSave.min_ea : 1,
          checked: true,
          is_purchase_status: dataSave.is_purchase_status
        }
        $self.count = 1;
        $self.postData.is_detail_sold_out = dataSave.is_detail_sold_out;

        // 구매불가 상품 추가 : is_sold_out 이 아니지만 판매 불가 상품인경우 카운트 추가 하기
        if(!dataSave.is_purchase_status){
          $self.postData.is_detail_sold_out = true;
          noPackage.is_detail_sold_out = $self.postData.is_detail_sold_out
        }

        $self.products.push(noPackage);
        if( dataSave.use_stocked_notify ){
          countPackageStockedNotify++;

          // 재입고 알림 상품 담기
          $self.notifyData.push(noPackage);
        }
      }else{ // 패키지 or 옵션
        len = dataSave.package_products.length;
        for(i = 0; i < len; i++){
          $self.$set(dataSave.package_products[i], "checked", $self.checkResult);
          $self.$set(dataSave.package_products[i], "ea", 0);
          $self.$set(dataSave.package_products[i], "is_detail_sold_out", dataSave.package_products[i].is_sold_out);
          $self.products.push(dataSave.package_products[i]);

          // 구매불가 상품 추가 : is_sold_out 이 아니지만 판매 불가 상품인경우 카운트 추가 하기
          if(dataSave.package_products[i].is_sold_out || (!dataSave.package_products[i].is_sold_out && !dataSave.package_products[i].is_purchase_status) ){
            countPackageSoldout++
          }
          if(dataSave.package_products[i].use_stocked_notify){
            countPackageStockedNotify++;

            // 재입고 알림 상품 담기
            if(dataSave.package_products[i].is_sold_out){
              $self.notifyData.push(dataSave.package_products[i]);
            }
          }
        }
        if(len <= countPackageSoldout){
          $self.postData.is_detail_sold_out = true;
        }
        if(countPackageStockedNotify > 0){
          $self.postData.use_stocked_notify = true;
        }
      }

      if(countPackageStockedNotify > 0 && (countPackageSoldout > 0 || $self.postData.is_detail_sold_out) && $self.notifyData.length > 0){
        $self.postData.use_stocked_notify = true;
      }else{
        $self.postData.use_stocked_notify = false;
      }

      if($self.isNotifyLayerCheck){ // 재입고 알림 레이어 노출
        $self.notifyOptionLayer();
        $self.isNotifyLayerCheck = false; // 한번 사용후 값 해제
      }else{ // 장바구니 담기 레이어 노출
        $self.layerShow = true;
        $self.updatePrice();
        // 레이어 타입때 텍스트 최대치일 경우 화면 안깨지는 script 처리
        if($self.cartType === 'layer'){
          $self.layerCartPutHeight();
        }
      }
    }, selectBoxShow : function(type, idx, status, purchaseStatus){
      var $self = this, i;
      if($self.productsType === 0 || idx === '' || status || (typeof purchaseStatus !== 'undefined' && !purchaseStatus) ) return false;
      if(type === 'show'){
        // 옵션별 수정되는 상품은  (delivery_time_types 에 2 가 있는경우) 수량과 상관없이 1종만 구매가능처리
        if($self.postData.delivery_time_types.indexOf(2) > -1){
          var itemLen = $self.products.length;
          for(i = 0; i < itemLen; i++){
            if(i !== idx){
              $self.products[i].checked = false;
              if($self.products[i].ea > 0){
                $self.count--;
              }
              $self.products[i].ea = 0;
            }
          }
        }
        if($self.products[idx].checked){
          alert('이미 추가된 옵션입니다');
          return;
        }
        $self.products[idx].checked = true;
        // 패키지 상품 기본 값 수정 : https://kurly0521.atlassian.net/wiki/spaces/MKA/pages/2724823795/PC+Mobile+web
        $self.products[idx].ea = $self.postData.is_package ? $self.calculatePackageMinValue(idx) : $self.products[idx].min_ea;
        if ($self.products[idx].is_detail_sold_out) {
          $self.products[idx].ea = 0;
        }
        $self.count++;
      }else{
        $self.products[idx].checked = false;
        $self.products[idx].ea = 0;
        $self.count--;
      }
      $self.updatePrice();
    },
    calculatePackageMinValue: function (idx) {
      var productParent = this.postData;
      var product = this.products[idx];

      //부모의 최소 구매수량은 0, 옵션의 최소 구매수량은 2 이상일 수 있음
      //https://kurly0521.atlassian.net/browse/KQA-5049
      if (productParent.min_ea < 2 && product.min_ea < 2) {
        return 1;
      }

      //최소 구매 수량 2 이상일 때 옵션의 최소 구매 수량을 넣는다. 옵션의 최소구매수량이 없을 경우 0으로 노출.
      return product.min_ea || 0;
    },
    updateEa: function (type, item) { // update
      if(type === undefined || item === undefined) return;
      var $self = this, i, len = $self.products.length, result;
      if($self.postData.is_detail_sold_out){
        return;
      }
      for(i = 0; i < len; i++){
        var target = $self.products[i];
        if(target.no === item.no){
          result = target.ea;
          if(type === 'm'){
            if (target.sales_unit > 1) {
              result -= target.sales_unit;
            } else {
              result -= $self.unitCount;
            }
          }
          if(type === 'p'){
            if (target.sales_unit > 1) {
              result += target.sales_unit;
            } else {
              result += $self.unitCount;
            }
            if(result < target.min_ea){
              result =  target.min_ea;
            }
          }
          if(result < target.min_ea){
            result = 0;
          }
          if(result > target.max_ea){
            alert('수량은 ' + target.max_ea + '개까지 가능합니다.');
            result = target.max_ea;
          }
          target.ea = result;
        }
      }
      $self.updatePrice();
    }, updatePrice : function(){ // 최종 계산
      var $self = this, i, len = $self.products.length;
      $self.totalPrice = 0;
      $self.totalPoint = 0;
      for(i = 0; i < len; i++){
        var target = $self.products[i];
        if(!$self.userData){
          $self.totalPrice += target.original_price * target.ea;
        }else{
          $self.totalPrice += target.discounted_price * target.ea;
        }
        if(target.is_expected_point){
          $self.totalPoint += target.expected_point * target.ea;
        }
      }
    }, cartPutAction : function(){ // 장바구니 담기
      if(this.isCartEvent){
        return false;
      }
      this.isCartEvent = true;

      var $self = this, target, targetFirstName, urlPut = [], putData, putDataCount = 0,
        i, len = $self.products.length, trackingCode = [];

      for(i = 0; i < len; i++){
        target = $self.products[i];

        /* tracker code */
        target.parent_id = $self.postData.no
        target.parent_name = $self.postData.name;
        target.is_package = $self.postData.is_package;
        target.is_gift_purchase = false;

        if($self.productsType === 0){
          if(target.ea > 0){
            targetFirstName = target.name;
            putDataCount++;
            urlPut.push({'deal_product_no': Number(target.no),
              'content_product_no': Number(target.no),
              'quantity': Number(target.ea)});

            trackingCode.push(target); /* tracker code */
          }
        }else{
          if(target.ea > 0){
            if(putDataCount === 0){
              targetFirstName = target.name;
            }
            putDataCount++;
            putData = {'deal_product_no':Number(target.product_no),
              'content_product_no': Number(target.parent_id),
              'quantity':Number(target.ea)}
            urlPut.push(putData);

            trackingCode.push(target); /* tracker code */
          }
        }
      }

      if(putDataCount === 0){
        alert('수량은 반드시 1 이상이어야 합니다.');
        this.eventCheck();
        return;
      }

      kurlyApi({
        method:'post',
        url:'/cart/v1/cart-items/store',
        data: { cart_items: urlPut }
      }).then(function (res){
        var cntAddedItems = res.data.meta.count;

        if ($self.cartType !== 'layer') {
          bodyScroll.bodyFixed();
        } else {
          $self.layerShow = false;
        }
        $self.postData.success = true;
        // 이미 장바구니에 존재하는 상품인지 체킹
        $self.postData.isReaddedItem = res.data.meta.is_in_cart;

        if($self.type === 'pc'){
          $self.layerClose('success');
          if ($self.postData.isReaddedItem) {
            $('#msgReaddedItem').addClass('add');
          }
        }

        /* cart animation */
        if ($('#addMsgCart').length > 0) {
          var txtAddMsg = targetFirstName;
          $('#addMsgCart .thumb').attr('src', $self.postData.main_image_url);
          if(putDataCount > 1){
            txtAddMsg = txtAddMsg + '외 ' + (putDataCount-1) + '종';
          }
          $('#addMsgCart .tit').html(txtAddMsg);
        }
        cart_count_down(cntAddedItems);

        // 장바구니에 상품 추가시 배송지 변경 재입고 품절체킹 리셋
        sessionStorage.removeItem('cart.soldOutItem');

        $self.eventCheck();

        /**
         * tracker code
         */
        fusionSignalPut('put'); // KM-1048 fusionSignal
        branchAction(trackingCode); // KM-1238 branch 기능 추가
        // KM-1483 Amplitude 연동
        var trackLen = trackingCode.length;
        for(i = 0; i < trackLen; i++){
          KurlyTracker.setAction('add_to_cart_product', trackingCode[i]).sendData();
        }
        KurlyTracker.setAction('add_to_cart_success', trackingCode).sendData();
        // END : KM-1483 Amplitude 연동

        // KM-2251 Facebook Pixel Code
        fbpTracker.setAction('AddToCart', trackingCode);

         // KMF-466 Facebook Conversion API 적용
         conversionsTracker.setAction('AddToCart', trackingCode);
      }.bind(this)).catch(function(error){
        $self.eventCheck();

        var msg = 'error.response.data 의 값이 없음(undefined)'
        if(typeof error.response !== 'undefined') {
          msg = error.response.data.error.message;
        }
        KurlyTracker.setAction('add_to_cart_fail', msg).sendData();

        if(typeof error.response !== 'undefined' && error.response.status !== 204){
          if($self.type === 'pc'){
            _oldAlert(error.response.data.error.message);
          }else{
            alert(error.response.data.error.message);
          }
          if(String(error.response.data.error.code) === '4015'){
            location.reload();
          }
        }
      });
    }, buyNowAction : function(type){ // 바로구매
      if(this.isCartEvent){
        return false;
      }
      this.isCartEvent = true;

      // 배송지체크
      if(!this.deliveryCheck()){
        this.eventCheck();
        return false;
      }

      var $self = this, target, itemStorage = '', storageCheck = 0, i, len = $self.products.length, trackingCode = [], arrOrderItems = [];


      // TODO 배송불가, 배송지 변경에 따른 샛별 != 택배 등을 api 로 체크후 얼럿 및 return false 필요
      // 배송지 체크 후 배송불가지역일 때 알림 or 샛별전용인 경우 배송지가 택배일 경우 알림

      for(i = 0; i < len; i++){
        target = $self.products[i];
        /* tracker code */
        target.parent_id = $self.postData.no
        target.parent_name = $self.postData.name;
        target.is_package = $self.postData.is_package;
        target.is_gift_purchase = false;
        if($self.productsType === 0){ // 단품
          if(target.ea > 0){
            storageCheck++;
            itemStorage = '<input type="hidden" name="products[' + i + '][no]" value="' + target.no + '"><input type="hidden" name="ea" value="' + target.ea + '">';
            trackingCode.push(target);
            arrOrderItems.push({ deal_product_no: target.parent_id, content_product_no: target.parent_id, quantity: target.ea });
          }
        }else{ // 패키지 상품
          if(i === 0){
            itemStorage = '<input type="hidden" name="ea" value="1">';
          }
          if(target.ea > 0){
            storageCheck++;
            itemStorage += '<input type="hidden" name="_multi_ea[]" value="' + target.ea + '">'
            itemStorage += '<input type="hidden" name="multi_ea[' + i + ']" value="' + target.ea + '">'
            itemStorage += '<input type="hidden" name="multi_addopt[' + i + '][]" value="' + target.no + '^단품골라담기^' + target.name + '^' + target.discounted_price + '">'
            trackingCode.push(target);
            arrOrderItems.push({ deal_product_no: target.no, content_product_no: target.parent_id, quantity: target.ea });
          }
        }
      }
      if ($self.productsType === 0 && storageCheck === 0) {
        alert('수량은 반드시 1 이상이어야 합니다.');
        $self.eventCheck();
        return;
      } else if ($self.productsType !== 0 && storageCheck === 0) {
        alert('주문하실 상품을 선택해주세요.');
        $self.eventCheck();
        return;
      }

      var f = document.frmBuyNow;
      $("[name=frmBuyNow] [name=goodsno]").val($self.postData.no);
      $("[name=frmBuyNow]").append(itemStorage);


      /**
       * tracker code
       */
      // KM-1048 fusionSignal
      fusionSignalPut('buy');

      // KM-1483 Amplitude 연동
      var trackLen = trackingCode.length;
      for(i = 0; i < trackLen; i++){
        KurlyTracker.setAction('add_to_cart_product', trackingCode[i]).sendData();
      }
      KurlyTracker.setAction('add_to_cart_success', trackingCode).sendData();
      // END : KM-1483 Amplitude 연동

      // KM-2251 Facebook Pixel Code
      fbpTracker.setAction('AddToCart', trackingCode);

      // KMF-466 Facebook Conversion API 적용
      conversionsTracker.setAction('AddToCart', trackingCode);

      // KM-1950 주문서 개편 API 처리
      window.sessionStorage.setItem('isDirect', 1);

      kurlyApi({
        // kurly-jhlim - url 수정
        method:'post',
        url:'/cart/v1/cart-items/direct',
        data: {cart_items: arrOrderItems}
      }).then(function(response) {
        if(response.status === 204) {
          // kurly-jhlim - if문 콜백으로 이동 / 성공 상태 수정 200 -> 204
          if (type === 'mobile') {
            // 구매할 물품 추가 후 주문서로 이동
            window.location.href='/app/order/index.html';
            // 주문서에서 백버튼 눌렀을때 돌아갈 주소 저장
            sessionStorage.setItem('referrer_for_order', location.href);
            sessionStorage.setItem('history_count_for_order', history.length);
          } else {
            window.location.href = '/shop/order/order.php';
          }
        }
        else {
          console.log("API Response('" + response.status + "'): ", response);
        }
      }).catch(function(error) {
        $self.eventCheck();
        if(error.response.status !== 204){
          if($self.type === 'pc'){
            _oldAlert(error.response.data.error.message);
          }else{
            alert(error.response.data.error.message);
          }
          if(error.response.data.error.code === 4015){
            sessionStorage.setItem('4015', 'true');
            location.reload();
          }
        }
      });
    }, wishlistAction : function(){
      var $self = this, target, itemStorage = '', storageCheck = 0, i, len = $self.products.length, trackingCode = [];

      if(!$self.userData){
        $self.loginCheckAction();
        return;
      }

      itemStorage = '<input type="hidden" name="goodsno" value="' + $self.postData.no + '">'
      for(i = 0; i < len; i++){
        target = $self.products[i];
        if($self.productsType === 0 || $self.postData.is_detail_sold_out){
          if(target.ea > 0){
            storageCheck++;
            itemStorage += '<input type="hidden" name="products[' + i + '][no]" value="' + target.no + '"><input type="hidden" name="ea" value="' + target.ea + '">';
          }
        }else{
          if(i === 0){
            itemStorage += '<input type="hidden" name="ea" value="1"><input type="hidden" name="branchRetun" value="">';
          }
          if(target.ea > 0){
            storageCheck++;
          }
          itemStorage += '<input type="hidden" name="multi_ea[' + i + ']" value="' + target.ea + '">'
          itemStorage += '<input type="hidden" name="multi_addopt[' + i + '][]" value="' + target.no + '^옵션상품^' + target.name + '^^' + target.discounted_price + '">'
        }
      }

      if(storageCheck === 0 && !$self.postData.is_detail_sold_out){
        alert('하나 이상의 패키지 구성품을 선택하셔야됩니다!');
        return;
      }

      var frmWishlist = document.frmWishlist;
      $("[name=frmWishlist]").append(itemStorage);
      var queryString = $('form[name=frmWishlist]').serialize();

      $.ajax({
        type:"post",
        url:"/m2/goods/ajaxAction.php",
        dataType:"json",
        data: queryString + '&mode=addWishlist',
        error : function(error) {
          console.log(error);
        }, success : function(data) {
          alert(data.msg)
          if(data.success || data.msg === '이미 늘 사는 리스트에 존재하는 상품입니다'){
            $self.postData.wishCheck = true;
          }
        }
      });

    }, layerClose : function(type){ // 레이어닫기
      var $self = this;
      if( $self.cartType === 'layer'){
        $self.layerShow = false;

        // 레이어 타입때 텍스트 최대치일 경우 화면 안깨지는 script 처리 원위치
        $self.layerCartPutHeight('reset');
      }
      $self.postData.setAddress = false;
      $self.postData.success = false;
      if(type !== undefined && type !== 'success'){
        bodyScroll.bodyDefault(false);
      }else{
        bodyScroll.bodyDefault();
      }

      // KM-1483 Amplitude 연동
      KurlyTracker.setScreenName(KurlyTracker.getBucket().browse_screen_name);

    }, userInfoGet : function(checkData, type){
      var user, $self = this;
      $self.type = checkData.type;

      if(!checkData.login && type === 'notify'){
        $self.loginCheckAction();
        return;
      }

      if(checkData.login){
        $self.userData = [];
        kurlyApi({
          method:'get',
          url:'/v3/my-page/info'
        }).then(function(response){
          if(typeof response === 'undefined' || response.status != 200 || response.status === undefined) return;
          user = response.data.data;
          $self.userData = user;
        }.bind(this)).catch(function(e){
          console.log(e);
        });
      }
      $self.goodsNo = checkData.no;

      // 재입고알람 레이어 노출인 경우 해당값 true
      if(type === 'notify'){
        $self.isNotifyLayerCheck = true;
      }
      $self.update();
    }, layerCartPutHeight : function(type){ // 레이어 타입때 텍스트 최대치일 경우 화면 안깨지는 script 처리
      var $self = this, $target = $('.cartList'), resultHeight = 0;
      $target.css('opacity',0);
      if(type === 'reset'){
        $target.find('.list').removeAttr('style');
        return;
      }
      if($target.find('.inner_option').height() === 0){
        setTimeout(function(){
          $self.layerCartPutHeight();
        }, 100);
      }
      if($target.height() < $target.find('.inner_option').height() + $target.find('.layer_name').outerHeight() - 2 ){
        resultHeight = $target.find('.tit_cart').outerHeight() + $target.find('.total').outerHeight() + $target.find('.group_btn').outerHeight();
        if($self.type === 'pc'){
          resultHeight += $target.find('.layer_name').outerHeight();
        }
        $target.find('.list').height($target.height() - resultHeight);
      }
      $target.animate({
        'opacity': 1
      },500);
    }, topBtnAction : function(type){ // top버튼 애니메이션
      if(type){
        $('#pageTop').hide();
      }else{
        $('#pageTop').show();
      }
    }, notifyOptionLayer: function(type){ // 재입고알림 레이어 열기 / 닫기
      var that = this;

      // 닫기
      if(typeof type !== 'undefined' && type === 'close'){
        that.postData.setNotify = false;
        bodyScroll.bodyDefault();
        return;
      }

      // 열기
      if(that.cartType !== 'layer'){
        bodyScroll.bodyFixed();
      }
      that.postData.setNotify = true;
    }, notifyOptionAction: function(data){ // 재입고알림 api 전달
      var that = this;
      if(that.isNotifyOptionAction){
        return false;
      }
      that.isNotifyOptionAction = true;

      // 재입고 알림 API신청하기 처리
      kurlyApi({
        method: 'post',
        url: '/restocked-notification/v1/home/content-products/' + this.goodsNo + '/deal-products/' + data.item.no + '/notifications'
      }).then(function(response){
        if(typeof response === 'undefined' || response.status !== 204){
          alert('새로고침후 다시 시도해 주시기바랍니다.');
          return;
        }
        // 패키지상품이 아닌경우 신청후 창 자동 닫기
        if(!data.isPackage || data.countTotalItem === 1){
          alert('재입고 알림 신청이 완료되었습니다.');
          that.notifyOptionLayer('close');
        }else{
          if(!confirm('재입고 알림 신청이 완료되었습니다. 이어서 신청하시겠습니까?')){
            that.notifyOptionLayer('close');
          }
        }
        setTimeout(function(){
          that.isNotifyOptionAction = false;
        }, 1000);
      }.bind(this)).catch(function(err){
        var err = err.response;
        console.log(err)
        if(typeof err !== 'undefined'){
          alert(err.data.message);
        }else{
          alert('새로고침후 다시 시도해 주시기바랍니다.');
        }
        setTimeout(function(){
          that.isNotifyOptionAction = false;
          // that.notifyOptionLayer('close');
        }, 1000);
      });
    }, deliveryCheck: function(){
      var $self = this;
      try{
        /**
         * noNeedToPrint 는 PC는 popup.js, mWeb은 _heaer.htm 에 있음.
         */

        if(sessionStorage.getItem('isDeliveryCartPut') === null || sessionStorage.getItem('isDeliveryCartPut') === 'false'){
          if ($self.cartType !== 'layer') {
            bodyScroll.bodyFixed();
          } else {
            $self.layerShow = false; // 장바구니담기 레이어 타입 노출여부
          }
          $self.postData.setAddress = true; // 배송지 레이어 팝업노출 여부
          return false;
        }else{
          return true;
        }
      }catch(e){
        console.log(e);
      }
    }, eventCheck: function(){
      var that = this;
      setTimeout(function(){
        that.isCartEvent = false;
      }, 1000);
    }
    ,loginCheckAction: function(msg){
      var msg = (typeof msg !== 'undefined' && msg) ? msg : '회원 전용 구매 상품입니다. 로그인 화면으로 이동합니다.';
      if(confirm(msg)){
        if(this.type === 'pc'){
          location.href = '/shop/member/login.php?return_url=' + encodeURIComponent(location.href);
        }else{
          location.href = '/m2/mem/login.php?return_url=' + encodeURIComponent(location.href);
        }
        return false;
      }
    },
    purchaseGift: function() {
      if (!window._appData.isLogin) {
        if (!confirm('회원 전용 구매 상품입니다. 로그인 화면으로 이동합니다.')) {
          return;
        }

        var path = this.type === 'pc'
         ? '/shop/member/login.php?return_url='
         : '/m2/mem/login.php?return_url=';
         var url = path
           + encodeURIComponent(location.href)
           + '&required_login=true';
         location.assign(url);
        return;
      }

      var productNumber = this.postData.no;

      var gifts = this.products.map(function(product) {
        return {
          deal_product_no: productNumber,
          content_product_no: product.no,
          quantity: product.ea,
        };
      });


      // KMF-638 Amplitude 연동
      var target, i, len = this.products.length, trackingCode = [];
      for(i = 0; i < len; i++){
        target = this.products[i];
        /* tracker code */
        target.parent_id = this.postData.no
        target.parent_name = this.postData.name;
        target.is_package = this.postData.is_package;
        target.is_gift_purchase = true;
        trackingCode.push(target);
      }

      // END : KMF-638 Amplitude 연동


      kurlyApi({
        method: 'POST',
        url: '/checkout/v1/gift/ordering-products',
        data: { gifts: gifts },
      })
      .then(function() {
        var trackLen = trackingCode.length;
        for(i = 0; i < trackLen; i++){
          KurlyTracker.setAction('add_to_cart_product', trackingCode[i]).sendData();
        }
        KurlyTracker.setAction('add_to_cart_success', trackingCode).sendData();
        location.assign('/order/gift');
      })
      .catch(function(err) {
        var message = '일시적인 장애가 발생했어요. 잠시 후 다시 시도해주세요.';
        if(err.response && err.response.data && err.response.data.message) {
          message = err.response.data.message;
          KurlyTracker.setAction('add_to_cart_fail', message).sendData();

          if (Number(err.response.data.code) === 4015) {
            alert('현재 판매 중인 상품이 아닙니다.');
            location.assign('/m2/index.php');
            return;
          }
          alert(message);
          var GIFT_CATEGORY_LINK = {
            'localhost': '/m2/goods/list.php?category=944',
            'development': '/m2/goods/list.php?category=944',
            'stage': '/m2/goods/list.php?category=784',
            'production': '/m2/goods/list.php?category=772',
          };
          location.assign(GIFT_CATEGORY_LINK[window.environment]);
        }
      });
    },
    getIsPickedProduct: function(productNo) {
      if (this.userData) {
        kurlyApi({
          method:'get',
          url: '/member/proxy/pick/v1/picks/products/' + productNo + '/picked',
        })
        .then(function(response){
          this.isPicked = response.data.data.is_picked;
        }.bind(this))
        .catch(function(error){
          const errorCode = (
            error.response && error.response.data && error.response.data.code
          ) || 'no error code';

          alert('상품의 찜하기 정보를 가져오지 못했습니다. [' + errorCode + ']');
        }.bind(this));
      }
    },
    togglePick: function(productNo, productData) {
      kurlyApi({
        method:'put',
        url: '/member/proxy/pick/v1/picks/products/' + productNo,
        data: {
          is_pick: !this.isPicked,
        },
      })
      .then(function(response){
        this.isPicked = !this.isPicked;

        var pickActionName = this.isPicked ? 'select_pick_product' : 'remove_pick_product';
        var pickTrackingData = {
          is_sold_out: productData.is_sold_out,
          origin_price: productData.original_price,
          price: productData.discounted_price,
          package_id: productData.no,
          package_name: productData.name,
        };

        KurlyTracker.setAction(pickActionName, pickTrackingData).sendData();
      }.bind(this))
      .catch(function(error){
        const response = error.response;
        const errorCode = (response.data && response.data.code) || 'no error code';

        if (response.status === 422) {
          alert(response.data.message);
        } else {
          alert('작업을 처리하는 동안 문제가 생겼습니다. 다시 시도해주세요. [' + errorCode + ']');
        }
      }.bind(this));
    }
  }
});





























// KM-1048 fusionSignal
function fusionSignalPut(action){
  $.fusionSignalPutParam = function(name){ // 파라미터 사용시 아래 코드 필수
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results===null){
      return null;
    }
    else{
      return decodeURI(results[1]) || 'false';
    }
  }
  if(typeof sessionStorage.FusionSignal !== 'undefined'){
    var fusionSignalResult = JSON.parse(sessionStorage.getItem("FusionSignal"));
    var $result = fusionSignalResult[0];
    if(typeof $result.params.doc_id !== 'undefined' && $.fusionSignalPutParam('goodsno')){
      if($result.params.doc_id !== $.fusionSignalPutParam('goodsno')){
        $result.type = false;
      }
    }
    if($result.type === 'request' || $result.type === 'click_product' || $result.type === 'click_select'){
      if(typeof action !== 'undefined'){
        if($result.type === 'request' && this.fusionSignalCheckId === $result.params.fusion_query_id ){
          // 아이디중복일때 이벤트 두번발생되는 이슈가 발생되어 안되도록 수정
          return;
        }
        if($result.type === 'click_product' && action === 'buy'){ // 상품상세 + 바로구매
          $result.type = 'click_buy_direct_from_click_product';
        }
        if($result.type === 'click_product' && action === 'put'){ // 상품상세 + 장바구니
          $result.type = 'click_add_to_cart_from_click_product';
        }
        if($result.type === 'click_select'){ // 상품목록 + 장바구니
          $result.type = 'click_add_to_cart_from_click_select';
        }
      }
      kurlyApi({
        method : 'put',
        url : '/v1/fusion/signals',
        data : $result
      }).then(function(result){
        if($result.type === 'request'){ // 아이디중복일때 이벤트 두번발생되는 이슈가 발생되어 안되도록 수정
          this.fusionSignalCheckId = $result.params.fusion_query_id;
        }
        // 한번 만 전송하고 삭제하는경우 아래 처리
        if($result.type === 'click_add_to_cart_from_click_product' || $result.type === 'click_buy_direct_from_click_product'){
          sessionStorage.removeItem("FusionSignal");
        }
      }.bind(this)).catch(function(e){
        console.log(e);
      });
    }else{
      sessionStorage.removeItem("FusionSignal");
    }
  }else{
    return;
  }
}


// KM-1238 branch 기능 추가
function branchAction(item){
  var $self = cartPut, i, itemLen = item.length, skuNo, branchCartItems = [] ,branchCartItem = {}; // 전달값
  for(i = 0;i < itemLen;i++){
    // skuNo = item[i].no;
    // if($self.productsType !== 0){ // 단품일때
    //     skuNo = item[i].product_no;
    // }
    branchCartItem = {
      "$canonical_identifier" : "product/" + $self.postData.no,
      "$product_name" : item[i].name,
      "$sku" : $self.postData.no,
      "$price" : item[i].discounted_price,
      "$quantity" : item[i].ea,
      "$currency" : "KRW",
    }
    branchCartItems.push(branchCartItem);
  }
  branch.logEvent("ADD_TO_CART", {}, branchCartItems);
}
