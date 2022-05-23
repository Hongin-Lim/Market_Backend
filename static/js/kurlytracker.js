/**
 * 기능명세
 * var KurlyTracker = kurlyTracker.getTracker()
 * : 해당 위치에서 최초 선언 (logo 이벤트가 공통적용되어, 해당 위치 적용( & 앱 분기 처리 적용필요)
 * 스크린네임전달
 * : KurlyTracker.setScreenName('category')
 * 탭네임 업데이트
 * : KurlyTracker.setTabName('category');
 * 이벤트 발생
 * : KurlyTracker.setAction(_event_name, _action_data).sendData();
 * 이벤트 발생 되지만, 전달할 데이터가 없는 경우
 *
 * : KurlyTracker.setAction(_event_name).sendData();
 * 이벤트정보 값이 필요한 경우(이벤트 발생시 특정 이벤트시 발생)
 * : KurlyTracker.setEventInfo(data);
 *
 * : KurlyTracker.setUserProperties(data);
 *  userProperties 값을 전달 1회만 전달 하면 됨
 *
 * : KurlyTracker.sendUserProperties(data);
 * 유저정보값 전달
 */
// KM-1483 Amplitude 연동
var kurlyTracker = (function() {
  var SSID = 'amplitudeBucket';
  var SSBID = 'amplitudeBrowseBucket';
  var appDevice = (typeof window.webStatus !== 'undefined' && window.webStatus.appCheck) ? window.webStatus.appDevice : null;

  // utils
  function createUid(){
    function s4() {
      return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  /**
   * @param { category : string | name : string | data : object }
   * category가 screen_name 일때는 data 없음
   * category가 event 일때는 data 있음
   * : app에서는 data가 있어도 사용 안하는 경우 있으며, 그런경우 data 값이 있어도 상관은 없음
   *
   front 서버에서 처리 해야 하는 사항
   // 상품 후기 상세
   screen_name : product_review_detail,
   event_name :  view_review_detail
   * @param sendAppData : https://kurly0521.atlassian.net/wiki/spaces/MKA/pages/890011902
   * {category: String , data: Object } or {category: String , name : String data: Object }
   */
  function sendApp(sendAppData){
    if(appDevice === 'I'){
      window.webkit.messageHandlers.behaviorEvent.postMessage(JSON.stringify(sendAppData));
    }else{
      window.Android.handleBehaviorEvent(JSON.stringify(sendAppData));
    }
  }

  // 세션저장하기(SSID, SSBID)
  function saveSessionStorage(data, key) {
    var storageKey = key ? key : SSID;
    window.sessionStorage.setItem(storageKey, JSON.stringify(data));
  }
  // 저장된 세션 가져오기(SSID, SSBID)
  function getSessionStorage(key, defaultData){
    var storedData = defaultData ? defaultData : {};
    try {
      var _storedData = window.sessionStorage.getItem(key)
      if (_storedData) {
        storedData = JSON.parse(_storedData)
      }
    } catch(e) {
      console.log(e)
    }
    return storedData;
  }


  // constants
  /**
   * 해당 NAME이 있는 경우에만 해당 값을 세션(SSID, SSBID)에 저장
   */
  var BROWSE_TARGET = { // browse_screen_name
    TAB_NAME: [
      'home', 'category', 'search', 'my_kurly'
    ],
    SCREEN_NAME: [
      'category',
      'search',
      'my_kurly',
      'recommendation',
      'new_product',
      'popular_product',
      'bargain',
      'event_list',
      'category_product_list',
      'search_product_list',
      // 'product_list', // KM-5133 browser_screen_name에서 product_list 제외
      'order_history',
      'my_reviewable_list',
      'my_review_history',
      'recipe_detail',
      'kurly_pass_guide',
      'pick_list'
    ],
    EVENT_NAME: [ // browse_event_name
      'select_home_tab',
      'select_category_tab',
      'select_search_tab',
      'select_my_kurly_tab',
      'select_recommendation_subtab',
      'select_new_product_subtab',
      'select_popular_product_subtab',
      'select_bargain_subtab',
      'select_event_list_subtab',
      'select_category',
      'select_search',
      'select_event_list_banner',
      'select_frequently_purchase_product_list',
      'select_main_logo',
      'select_category_banner',
      'select_gift_list',
      'select_my_kurly_gift_list',
      'select_recommendation_',
      'select_my_kurly_pick_list',
      'select_kurly_recipe', // 확인
      'select_my_kurly_banner',
      // 아래는 이벤트 페이지
      'select_event_page_product_list',
      'select_event_page_banner',
      'select_event_page_link_page',
    ],
    EVENT_INFO: [ // browse_event_info
      'select_event_list_banner',
      'select_search',
      'select_category',
      'select_category_banner',
      'select_recommendation_',
      'select_kurly_recipe',
      'select_gift_list',
      'select_my_kurly_banner',
      // 아래는 이벤트페이지
      'select_event_page_product_list',
      'select_event_page_banner',
      'select_event_page_link_page'
    ],
    // 이벤트 전송 이후, event_name이 비교 조건에 포함된 경우 brows_event_info 초기화
    EVENT_INFO_RESET: [
      'select_bargain_subtab',
      'select_category_tab',
      'select_event_list_subtab',
      'select_frequently_purchase_product_list',
      'select_home_tab',
      'select_my_kurly_tab',
      'select_new_product_subtab',
      'select_popular_product_subtab',
      'select_recommendation_subtab',
      'select_search_tab',
      'select_starred_tab',
      'select_my_kurly_pick_list',
      'select_my_kurly_gift_list',
      // 아래는 이벤트페이지
      // 'select_event_page_product_list',
    ],
    // 2021-12 추가
    SUB_EVENT_NAME: [
      'select_category',
      'select_event_list_banner',
      'select_recommendation_',
      'select_category_subtab',
      'select_category_banner',
      'select_gift_list',
      // 아래는 이벤트 페이지
      'select_event_page_product_list',
      'select_event_page_banner',
      'select_event_page_link_page',
    ],
    // 2021-12 추가
    SUB_EVENT_INFO: [
      'select_category',
      'select_event_list_banner',
      'select_recommendation_',
      'select_category_subtab',
      'select_category_banner',
      'select_gift_list',
      // 아래는 이벤트 페이지
      'select_event_page_product_list',
      'select_event_page_banner',
      'select_event_page_link_page',
    ],
    // 2021-12 추가
    SECTION_ID: [
      'select_recommendation_', // select_recommendation_{event_code}
    ],
    SIGN_UP: 'sign_up',
    LOGIN: 'login'
  }

  var storedBucket = getSessionStorage(SSID, {});

  /**
   * {
      tab_name: {String} browse_tab_name,
      event_name: {String} browse_event_name,
      event_info: {String} browse_event_info,
      sub_event_name: {String} browse_sub_event_name,
      sub_event_info: {String} browse_sub_event_info,
      section_id: {String} browse_section_id,
     * }
   */
  var browseData = getSessionStorage(SSBID, {});

  /**
   * 헤더에 설정된 webStatus 에서 production or development 설정 가져오기
   */
  function isProduction() {
    return window.webStatus ? window.webStatus.is_release_build : false
  }

  var bucketData = {
    browse_id: storedBucket.browse_id || createUid(), // 탐색구분자(browse_id) `임의의 값 생성` 후 업데이트
    screen_name: storedBucket.screen_name || null,
    previous_screen_name: storedBucket.previous_screen_name || null,
    sign_up_source_screen_name: storedBucket.sign_up_source_screen_name || null,
    is_release_build: storedBucket.is_release_build || isProduction(),
    browse_screen_name: storedBucket.browse_screen_name || null,
    browse_tab_name: storedBucket.browse_tab_name || null,
    browse_event_name: storedBucket.browse_event_name || null,
    browse_event_info: storedBucket.browse_event_info || null,
    browse_sub_event_name: storedBucket.browse_sub_event_name || null,
    browse_sub_event_info: storedBucket.browse_sub_event_info || null,
    browse_section_id: storedBucket.browse_section_id || null,
  };

  var actionData = {};

  function objectAssign(obj){
    var object = {};
    for(var key in obj){
      object[key] = obj[key];
    }
    return object
  }

  var _kurlyTracker = {
    /**
     * kurly tracker instance 생성학기
     */
    getTracker: function() {
      return this
    },

    /**
     * 유져 세션 정보 저장
     */
    setUserProperties: function(userProperties) {
      if (typeof amplitude === 'undefined') {
        console.error('amplitude is not defined!!!');
        return false;
      }

      var sessionData = getSessionStorage('amplitudeUserProperties', {'cust_no': -1});

      if (typeof userProperties.cust_no !== 'undefined' && sessionData.cust_no !== userProperties.cust_no) {
        if (userProperties.cust_no > 0) {
          amplitude.getInstance().setUserProperties(userProperties);
        } else {
          amplitude.getInstance().clearUserProperties();
        }
        saveSessionStorage(userProperties, 'amplitudeUserProperties');
      } else if (typeof userProperties.center_code !== 'undefined' && userProperties.center_code !== '') {
        // KM-5133 CC코드 추가
        amplitude.getInstance().setUserProperties(userProperties);
      }
    },

    /**
     * get actoin
     */
    getAction: function() {
      return objectAssign(actionData) // Object.assign({}, actionData)
    },

    /**
     * get bucket
     */
    getBucket: function() {
      return objectAssign(bucketData) //Object.assign({}, bucketData);
    },

    /**
     * set action
     * @param {String} name action name
     * @param {Object} _action action data
     */
    setAction: function(_event_name, _action){
      if(!appDevice){
        this.setEventName(_event_name);
        if(typeof _action === 'undefined'){
          actionData = {};
          return this;
        }
      }
      switch(_event_name){
        case isImpressionRecommendationEntireEvents(_event_name):  // 홈추천 구좌 노출 이벤트
          actionData = _action;
          break;
        case isImpressionRecommendationEvents(_event_name): // 홈추천 상품 노출 이벤트
          actionData = _action;
          break;
        case isSelectRecommendationEvents(_event_name): // 홈추천 상품 노출 이벤트
          this.setEventInfo(this.selectRecommendationEventInfoHighOrder(_action));
          this.setSubEventInfo(this.selectRecommendationEventInfoHighOrder(_action));
          this.setSectionId(_action.section_id);
          actionData = _action;
          break;
        case 'select_section_category_subtab': // md초이스 서브탭
          actionData = _action;
          break;
        case 'select_recommendation_instragram': // 홈추천 인스타그램
          actionData = _action;
          break;
        case 'purchase_success' : // 결제하기 성공 전송(결제완료)
          // User Properties Update
          if(!appDevice) {
            this.sendUserProperties(_action.userPropertiesData);
          }

          // event
          actionData = {
            transaction_id : _action.ordno,
            is_first_purchase : _action.is_first,
            purchase_tag : 'purchase',
            payment_method : _action.payment_method,
            total_price : _action.total_price,
            delivery_type : _action.delivery_type,
            sku_count : _action.payment_products.length,
            total_origin_price : _action.total_origin_price,
            delivery_charge : _action.delivery_charge,
            coupon_discount_amount : _action.coupon_use_price,
            point_discount_amount : _action.point_discount_amount,
            is_direct_purchase : _action.is_direct_purchase,
            coupon_id : null,
            coupon_name : null,
            product_discount_amount : _action.product_discount_amount,
            is_gift_purchase: _action.is_gift_purchase,
          };
          if(appDevice){
            actionData.purchase_products = _action.payment_products;
          }
          if(_action.is_first === true){
            actionData.purchase_tag = 'first_purchase';
          }
          if(_action.coupon_id !== ''){
            actionData.coupon_id = _action.coupon_id
          }
          if(_action.coupon_name !== ''){
            actionData.coupon_name = _action.coupon_name
          }
          break;
        case 'purchase_product' : // 결제에 성공한 상품에 대한 정보
          // User Properties Update
          if(!appDevice) {
            this.sendUserProperties(_action.userPropertiesData);
          }
          actionData = _action.item;
          break;
        case 'select_product' : // 상품 목록에서 상품을 선택한 경우(*상품 상세 페이지로 랜딩되는 클릭 버튼)
        case 'select_product_shortcut' : // 상품 목록에서 상품 선택 화면으로 이동하는 카트 버튼 클릭
          actionData = _action.item;

          actionData = {
            server_sort_type:  _action.server_sort_type,
            selection_sort_type: _action.selection_sort_type || '',
            is_soldout : _action.sold_out,
            position : _action.position + 1,
            origin_price : _action.original_price,
            price : _action.price,
            package_id : _action.no,
            package_name : _action.name,
            is_gift_purchase: _action.is_giftable,
          };
          /**
           * _action.sticker
           */
          if (_action.sticker) {
            var stickerData = _action.sticker.content[0].text + (_action.sticker.content[1] ? _action.sticker.content[1].text : '')
            actionData.sticker = stickerData;
          }

          // KM-4988 검색 화면을 통해 상품을 선택했을 때
          if (typeof _action.search.keyword !== 'undefined'
              && _action.search.keyword !== '') {
            actionData.package_count = _action.search.packageCount;
            actionData.keyword = _action.search.keyword;
          }

          break;
        case 'view_product_detail' : // 상품 상세 화면 조회
          actionData = {
            package_id : _action.no,
            package_name : _action.name,
            is_soldout: _action.is_sold_out,
            origin_price: _action.original_price,
            price: _action.discounted_price,
          }
          break;
        case 'select_purchase' : // 상품 상세 화면에서 '장바구니' 버튼 클릭
          actionData = {
            package_id: _action.no,
            package_name: _action.name,
            is_soldout: _action.is_sold_out,
            origin_price: _action.original_price,
            price: _action.discounted_price,
          }
          break;
        case 'view_product_selection' : // 상품상세에서 장바구니담기 레이어
          actionData = {
            package_id: _action.no,
            package_name: _action.name,
            referrer_event: _action.referrer_event
          }
          break;
        case 'view_review_detail' : // 상품 후기 상세
          /**
           * 패키지를 여러개 주문하는 경우 상품 후기작성시 후기는 각각 써짐.
           */
          actionData = {
            position : _action.position,
            has_image : _action.thumbnail_image_url ? true : false,
            is_best : _action.is_best ? true : false,
            package_id : _action.product_no,
            package_name : _action.product_name,
            product_id : _action.product_no,
            product_name : _action.product_name,
            user_grade : _action.user_grade,
            origin_price : _action.original_price,
            price : _action.price
          };
          if(typeof _action.parent_product_no !== 'undefined'){
            actionData.package_id = _action.parent_product_no;
            actionData.package_name = _action.parent_product_name;
            actionData.product_id = _action.product_no;
            actionData.product_name = _action.product_name;
          }
          if(typeof _action.type !== 'undefined' && _action.type === 1){
            actionData.is_best = true;
          }
          break;
        case 'add_to_cart_success' :  // 장바구니 담기 성공 전송
          var i, lenAction = _action.length, original_price = 0, discounted_price = 0;
          for(i = 0; i < lenAction; i++){
            if(i === 0){
              actionData = {
                package_id: _action[i].parent_id,
                package_name: _action[i].parent_name,
                is_direct_purchase: _action[i].is_buy_now,
                is_gift_purchase: _action[i].is_gift_purchase,
                sku_count: lenAction,
                total_origin_price: 0,
                total_price: 0,
              }
            }
            original_price += Number(_action[i].original_price) * Number(_action[i].ea);
            discounted_price += Number(_action[i].discounted_price) * Number(_action[i].ea);
          }
          actionData.total_origin_price = original_price;
          actionData.total_price = discounted_price;
          break;
        case 'add_to_cart_product' :  // 장바구니 담기 성공 API 성공 후 전송 바로구매는 버튼 클릭 시 전송
          actionData = {
            is_direct_purchase: _action.is_buy_now,
            package_id: _action.parent_id,
            package_name: _action.parent_name,
            product_id: _action.no,
            product_name: _action.parent_name,
            origin_price: _action.original_price,
            price: _action.discounted_price,
            quantity: _action.ea,
            total_origin_price: _action.original_price * _action.ea,
            total_price: _action.discounted_price * _action.ea,
            is_gift_purchase: _action.is_gift_purchase,
          }
          if(_action.is_package){
            actionData.product_id = _action.product_no;
            actionData.product_name = _action.name;
          }
          break;
        case 'add_to_cart_fail' : // 장바구니 담기 실패 전송
          actionData = {
            message : _action
          }
          break;
        case 'invite_friends' :
          actionData.is_eventCheck = true;
          break;
        case 'sign_up_success' :
        case 'view_sign_up' :
          /**
           * todo back-end개발 완료시 : '회원 가입' 화면 유입에 기여한 화면 이름추가 필요
           * @type {string}
           */
          actionData = _action || {};
          actionData.sign_up_source_screen_name = '';
          break;
        case 'select_product_shortcut_from_pick_list': { // 찜한상품 페이지에서 상품 담기
          this.setEventName('select_product_shortcut');
          actionData = _action;

          break;
        }
        case 'select_product_from_pick_list': { // 찜한상품 페이지에서 썸네일 클릭
          this.setEventName('select_product');

          actionData = _action;
          break;
        }
        case 'view_product_selection_from_pick_list': {
          this.setEventName('view_product_selection');

          actionData = _action;
          break;
        }
        /**
         * 여기서 부터 setEventInfo, setSubEventInfo 를 같이 처리 하는 방식으로 진행
         * 위 값의 전달 데이터 우선순위는 아래 문서를 참고!
         * https://docs.google.com/spreadsheets/d/1gs8wcD9uDHbvgTbUXFtrK3l-5gwbJD6wdjOfuS50f50/edit#gid=990540302
         */
        case 'select_category':
        case 'select_gift_list':
          this.setEventInfo(this.eventInfoHighOrder(_action));
          this.setSubEventInfo(this.eventInfoHighOrder(_action));
          actionData = _action;
          break;
        case 'select_category_banner':
          this.setEventInfo(this.eventInfoHighOrder(_action));
          this.setSubEventInfo(this.eventInfoHighOrder(_action));
          actionData = _action;
          break;
        case 'select_category_subtab':
          this.setSubEventInfo(this.eventInfoHighOrder(_action));
          actionData = _action;
          break;
        case 'select_event_list_banner':
          this.setEventInfo(this.eventInfoHighOrder(_action));
          this.setSubEventInfo(this.eventInfoHighOrder(_action));
          actionData = _action;
          break;
        case 'select_search':
          this.setEventInfo(this.eventInfoHighOrder(_action));
          actionData = _action;
          break;
        case 'select_kurly_recipe':
          this.setEventInfo(this.eventInfoHighOrder(_action));
          actionData = _action;
          break;
        case 'select_my_kurly_banner':
          this.setEventInfo(this.eventInfoHighOrder(_action))
          actionData = _action;
          break;
        case 'select_event_page_product_list':
          this.setEventInfo(_action.url);
          this.setSubEventInfo(_action.url);
          actionData = _action;
          break;
        case 'select_event_page_banner':
        case 'select_event_page_link_page':
          this.setEventInfo(this.eventInfoHighOrder(_action));
          this.setSubEventInfo(this.eventInfoHighOrder(_action));
          actionData = _action;
          break;
        default :
          actionData = _action;
          break;
      }

      /**
       * KMF-788: 검색페이지인경우에 fusion_query_id가 생성됨. 해당 속성을 actionData에 추가 해야함
       */
      if(typeof _action !== 'undefined' && typeof _action.fusion_query_id !== 'undefined') {
        actionData.fusion_query_id = _action.fusion_query_id;
      }
      /**
       * sessionStorage.fusionId 해당 값은 상품목록에서 상품클릭('select_product')한 경우 값이 추가됨
       */
      if(_event_name === 'select_search' && sessionStorage.getItem('fusionId') !== null) {
        sessionStorage.removeItem('fusionId');
      }
      if(sessionStorage.getItem('fusionId') !== null && bucketData.browse_tab_name === 'search') {
        actionData.fusion_query_id = sessionStorage.getItem('fusionId');
      }

      /**
       * action_data를 먼저 업데이트후에 앱에 전달 필요
       */
      if(appDevice){
        sendApp({category:'event', name: _event_name, data: actionData});
      }

      return this;
    },

    /**
     * set bucket
     * @param {Object} _bucket bucket data
     */
    setBucket: function(_bucket) {
      if (_bucket === null) {
        throw new Error('버킷은 null이되면 안됩니다.');
      }

      var _transaction_id = _bucket.transaction_id;

      var _screen_name = _bucket.screen_name;

      /**
       * 아래 데이터는 browseData 에 저장 하고 send 후 bucket 에 업데이트한다.
       */
      var _tab_name = _bucket.tab_name;
      var _event_name = _bucket.event_name;
      var _event_info = _bucket.event_info;
      var _sub_event_name = _bucket.sub_event_name;
      var _sub_event_info = _bucket.sub_event_info;
      var _section_id = _bucket.section_id;

      browseData = {
        tab_name: _tab_name,
        event_name: _event_name,
        event_info: _event_info,
        sub_event_name: _sub_event_name,
        sub_event_info: _sub_event_info,
        section_id: _section_id,
      };

      bucketData.previous_screen_name = bucketData.screen_name;
      bucketData.screen_name = _screen_name;


      if (_transaction_id) {
        bucketData.transaction_id = _transaction_id;
      }

      if(_screen_name !== BROWSE_TARGET.SIGN_UP && _screen_name !== BROWSE_TARGET.LOGIN) {
        bucketData.sign_up_source_screen_name = _screen_name;
      }

      saveSessionStorage(bucketData);
      return this;
    },

    setScreenName: function(_screen_name) {
      if(bucketData.screen_name !== null && bucketData.screen_name !==_screen_name){
        bucketData.previous_screen_name = bucketData.screen_name;
      }

      bucketData.screen_name = _screen_name;

      if(_screen_name !== BROWSE_TARGET.SIGN_UP && _screen_name !== BROWSE_TARGET.LOGIN) {
        bucketData.sign_up_source_screen_name = _screen_name;
      }

      if(appDevice){
        sendApp({category:'screen_name', name:_screen_name});
      }

      if(BROWSE_TARGET.SCREEN_NAME.indexOf(bucketData.screen_name) > -1){
        bucketData.browse_screen_name = bucketData.screen_name;
      }

      saveSessionStorage(bucketData);
      return this;
    },

    setEventName: function(_event_name) {
      bucketData.event_name = _event_name;
      browseData.event_name = _event_name;

      saveSessionStorage(bucketData);
      saveSessionStorage(browseData, SSBID);
      return this;
    },

    setTabName: function(_tab_name) {
      bucketData.browse_tab_name = _tab_name;
      browseData.tab_name = _tab_name;

      saveSessionStorage(bucketData);
      saveSessionStorage(browseData, SSBID);
      return this;
    },
    setEventInfo: function(data) {
      if (!data) {
        return false;
      }
      browseData.event_info = data;

      saveSessionStorage(browseData, SSBID);
      return this;
    },
    setSubEventInfo: function(data) {
      if (!data) {
        return false;
      }
      browseData.sub_event_info = data;

      saveSessionStorage(browseData, SSBID);
      return this;
    },
    setSectionId: function(data) {
      browseData.section_id = data;

      saveSessionStorage(browseData, SSBID);
      return this;
    },
    eventInfoHighOrder: function(data) { // EventInfo, SubEventInfo 의 우선순위
      if (typeof data.secondary_category_id !== 'undefined' && data.secondary_category_id !== null) {
        return data.secondary_category_id;
      }
      if (typeof data.primary_category_id !== 'undefined' && data.primary_category_id !== null) {
        return data.primary_category_id;
      }
      if (typeof data.url !== 'undefined' && data.url !== null) {
        return data.url;
      }
      if (typeof data.selection_type !== 'undefined' && data.selection_type !== null) {
        return data.selection_type;
      }
      if (typeof data.banner_category_id !== 'undefined' && data.banner_category_id !== null) {
        return data.banner_category_id;
      }
      if (typeof data.category_banner_id !== 'undefined' && data.category_banner_id !== null) {
        return data.category_banner_id;
      }
      return false;
    },
    selectRecommendationEventInfoHighOrder: function(data) { //
      if (typeof data.url !== 'undefined' && data.url !== null) {
        return data.url;
      }
      if (typeof data.selection_type !== 'undefined' && data.selection_type !== null) {
        return data.selection_type;
      }
      return false;
    },
    /**
     * amplitude 보내기?
     */
    sendData: function() {
      if(appDevice){
        return false;
      }
      // amplitude 보내기
      sendAmplitude()
      function sendAmplitude() {
        /**
         * payload에 actionData랑 bucketData랑 합쳐서 amplitude에 보낸다.
         */
        var payload = actionData;

        for(var key in bucketData){
          // bucket property 중에 null인 경우는 제외함
          if(bucketData[key] !== null){
            payload[key] = bucketData[key];
          }
          if(bucketData.screen_name !== BROWSE_TARGET.SIGN_UP && bucketData.screen_name !== BROWSE_TARGET.LOGIN && typeof payload.sign_up_source_screen_name !== 'undefined') {
            delete payload.sign_up_source_screen_name;
          }
        }

        if(typeof amplitude !== 'undefined') {
          amplitude.getInstance().logEvent(bucketData.event_name, payload);
        }
      }

      /**
       * 보낸 후에 bucket의 browse property 업데이트 하기
       */
      this._setBrowseData()
    },
    /**
     * User Properties Update
     * @param data : Object
     */
    sendUserProperties: function(data){
      amplitude.getInstance().setUserProperties(data);
    },
    /**
     * setBrowseData
     */
    _setBrowseData: function() {
      // browse_id [업데이트]
      // script로 uuid 생성
      // 1) add_to_cart_success 이벤트 발생
      // 2) 웹 오픈 시
      // 3) todo 로그인/로그아웃 시 (php에서 하는게 좋을거 같은데...)
      if (browseData.event_name === 'add_to_cart_success') {
        bucketData.browse_id = createUid()
      }

      if(BROWSE_TARGET.SCREEN_NAME.indexOf(bucketData.screen_name) > -1){
        bucketData.browse_screen_name = bucketData.screen_name;
      }

      if (BROWSE_TARGET.TAB_NAME.indexOf(browseData.tab_name) > -1) {
        if(bucketData.browse_tab_name !== browseData.tab_name){
          bucketData.browse_screen_name = null;
          if(BROWSE_TARGET.SCREEN_NAME.indexOf(bucketData.screen_name) > -1){
            bucketData.browse_screen_name = bucketData.screen_name;
          }
        }
        bucketData.browse_tab_name = browseData.tab_name;
      }

      if (browseData.event_name) {
        if (BROWSE_TARGET.EVENT_NAME.indexOf(browseData.event_name) > -1 || isSectionName(browseData.event_name)) {
          bucketData.browse_event_name = browseData.event_name;
        }
        // 2021-12 추가 event_info 초기화 이벤트 추가
        if (BROWSE_TARGET.EVENT_INFO_RESET.indexOf(browseData.event_name) > -1 || isSectionName(browseData.event_name)) {
          bucketData.browse_event_info = null;
        }
        if ((BROWSE_TARGET.EVENT_INFO.indexOf(browseData.event_name) > -1 || isSectionName(browseData.event_name)) && browseData.event_info) {
          bucketData.browse_event_info = browseData.event_info;
        }
        // 2021-12 추가
        // sub_event_info
        if ((BROWSE_TARGET.SUB_EVENT_INFO.indexOf(browseData.event_name) > -1 || isSectionName(browseData.event_name)) && browseData.sub_event_info) {
          bucketData.browse_sub_event_info = browseData.sub_event_info;
        }
        // sub_event_name
        if ((BROWSE_TARGET.SUB_EVENT_NAME.indexOf(browseData.event_name) > -1 || isSectionName(browseData.event_name))) {
          bucketData.browse_sub_event_name = browseData.event_name;
        }
        // section_id
        if ((BROWSE_TARGET.SECTION_ID.indexOf(browseData.event_name) > -1 || isSectionName(browseData.event_name) ) && browseData.section_id) {
          bucketData.browse_section_id = browseData.section_id;
        } else {
          if (bucketData.browse_screen_name !== 'recipe_detail' && bucketData.browse_screen_name !== 'recommendation' ) {
            bucketData.browse_section_id = null;
          }
        }
      }

      function isSectionName(target) {
        var doNotInclude = 'select_recommendation_subtab';
        var sectionPrefix = 'select_recommendation_';
        var isInclude = doNotInclude === target;
        var result = target.slice(0, 22) === sectionPrefix;

        return isInclude ? false : result
      }

      saveSessionStorage(bucketData);
    },
    /**
     * direct App Send data
     * @param data : https://kurly0521.atlassian.net/wiki/spaces/MKA/pages/890011902
     * {category: String , data: Object } or {category: String , name : String data: Object }
     */
    directAppAction: function(data){
      sendApp(data);
    }
  }
  return _kurlyTracker
})();

var KurlyTracker = kurlyTracker.getTracker();


// 주문서 전용
var KurlyTrackerOrder = function(section, type, property){
  var eventName = '', actionData = {};
  switch(section) {
    case 'folding':
      // type => true/false => open/close
      eventName = 'select_expand_button';
      actionData = {
        section: property
      }
      break;
    case 'receiver':
      if(type === 'success'){
        eventName = 'submit_shipping_address_success';
      }else if(type === 'fail'){
        eventName = 'submit_shipping_address_fail';
      }else if(type === 'sameClick'){
        eventName = 'select_same_customer_information_button';
      }else if(type === 'sameCheck'){
        eventName = 'impression_same_customer_information_button';
      }
      if (typeof property !== 'undefined') {
        actionData = {
          message: property
        }
      }
      break;
    case 'reception':
      eventName = type === 'success' ? 'submit_pick_up_location_success' : 'submit_pick_up_location_fail';
      if (typeof property !== 'undefined') {
        actionData = {
          message: property
        }
      }
      break;
    case 'destination':
      eventName = 'select_shipping_address_setting';
      actionData = {
        selection_type: type === 'pass' ? '이번만배송' : '기본배송지'
      }
      break;
    case 'reusable':
      if(type === 'selectPackingType') {
        eventName = 'select_packing_type';
        actionData = property;
      }
      break;
    default:
      break;
  }
  KurlyTracker.setAction(eventName, actionData).sendData();
}

// 링크 처리
var KurlyTrackerLink = function(link, eventName, actionData, option) {
  if (typeof actionData === 'undefined') {
    actionData = {};
  }

  KurlyTracker.setAction(eventName, actionData).sendData();

  if (typeof option !== 'undefined' && option.openWindow) {
    window.open(link, '_blank');
  } else {
    window.location.href = link;
  }
}


const ImpressionRecommendationEventTypes = [
  'impression_recommendation_main_banner',
  'impression_recommendation_today_recommendation',
  'impression_recommendation_today_recommendation_with_name',
  'impression_recommendation_random_line_banner',
  'impression_recommendation_line_banner',
  'impression_recommendation_special_deal',
  'impression_recommendation_random_collection',
  'impression_recommendation_random_collection_kurlyonly',
  'impression_recommendation_random_collection_review',
  'impression_recommendation_group_collection_square_time',
  'impression_recommendation_group_collection',
  'impression_recommendation_group_collection_circle',
  'impression_recommendation_group_collection_rectangle',
  'impression_recommendation_closing_sale',
  'impression_recommendation_md_choice',
  'impression_recommendation_kurly_recipe',
];

const ImpressionRecommendationEntireEventTypes = [
  'impression_recommendation_entire_main_banner',
  'impression_recommendation_entire_today_recommendation',
  'impression_recommendation_entire_today_recommendation_with_name',
  'impression_recommendation_entire_random_line_banner',
  'impression_recommendation_entire_line_banner',
  // 'impression_recommendation_entire_special_deal',
  'impression_recommendation_entire_random_collection',
  'impression_recommendation_entire_random_collection_kurlyonly',
  'impression_recommendation_entire_random_collection_review',
  'impression_recommendation_entire_group_collection_square_time',
  'impression_recommendation_entire_group_collection',
  'impression_recommendation_entire_group_collection_circle',
  'impression_recommendation_entire_group_collection_rectangle',
  'impression_recommendation_entire_closing_sale',
  'impression_recommendation_entire_md_choice',
  'impression_recommendation_entire_kurly_recipe',
];

const SelectRecommendationEventTypes = [
  'select_recommendation_main_banner',
  'select_recommendation_today_recommendation',
  'select_recommendation_today_recommendation_with_name',
  'select_recommendation_random_line_banner',
  'select_recommendation_line_banner',
  'select_recommendation_special_deal',
  'select_recommendation_random_collection',
  'select_recommendation_random_collection_kurlyonly',
  'select_recommendation_random_collection_review',
  'select_recommendation_group_collection_square_time',
  'select_recommendation_group_collection',
  'select_recommendation_group_collection_circle',
  'select_recommendation_group_collection_rectangle',
  'select_recommendation_closing_sale',
  'select_recommendation_md_choice',
  'select_recommendation_kurly_recipe',
];

if (!String.prototype.startsWith) { // polyfill from mdn
  String.prototype.startsWith = function(search, pos) {
    return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
  };
}

function isImpressionRecommendationEvents(eventName) {
  if(
    !(ImpressionRecommendationEventTypes.indexOf(eventName) > -1)
    && !eventName.startsWith('impression_recommendation_special_deal_')
  ) {
    return null;
  }

  return eventName;
}

function isImpressionRecommendationEntireEvents(eventName) {
  if(
    !(ImpressionRecommendationEntireEventTypes.indexOf(eventName) > -1)
    && !eventName.startsWith('impression_recommendation_entire_special_deal_')
  ) {
    return null;
  }

  return eventName;
}

function isSelectRecommendationEvents(eventName) {
  if(
    !(SelectRecommendationEventTypes.indexOf(eventName) > -1)
    && !eventName.startsWith('select_recommendation_special_deal_')
  ) {
    return null;
  }

  return eventName;
}
