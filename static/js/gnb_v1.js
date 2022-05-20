function isGiftCategory(code) {
  if (typeof window === 'undefined') {
    return false;
  }

  var host = window.location.host;

  if(host === 'kurly.com' || host === 'www.kurly.com') {
    return code === '772';
  }

  if (host === 'www.stg.kurly.com') {
    return code === '784'
  }

  return code === '944';
}

// KM-1483 Amplitude
function trackingCode(type, _event_name, _action_data){
    KurlyTracker.setAction(_event_name, _action_data).sendData();
    if(type === 'pc'){
        KurlyTracker.setTabName('category');
    }
}

Vue.component('gnb-important', {
  props: ['name', 'icon', 'no', 'deco'],
  template: '\
    <li>\
      <a\
         class="menu link_often"\
         href="#none"\
         @click="clickEvent(\'/m2/goods/list.php?category=\' + no)"\
      >\
        <span\
          class="ico"\
          :style="{\
            \'background-image\': \'url(\' + icon + \')\',\
            \'margin-right\': \'10px\',\
          }"></span>\
          <span class="txt">{{name}}</span>\
        <span class="ico_new" v-if="deco" :style="{ \'background-image\': \'url(\' + deco+ \')\'}">new</span>\
      </a>\
    </li>\
  ',
  methods: {
    clickEvent: function(url) {
      // KM-1483 Amplitude
      var _action_data = {}
      _action_data.primary_category_id = this.no;
      _action_data.primary_category_name = this.name;
      _action_data.secondary_category_id = null;
      _action_data.secondary_category_name = null;
      KurlyTracker.setAction('select_gift_list', _action_data).sendData();
      // END : KM-1483 Amplitude

      location.href = url;
    }
  }
});

// GNB_Mobile
Vue.component('gnb-menu',{
    props:['mainMenu', 'subMenu', 'subOpen', 'idx'],
    template:'\
    <li>\
        <a class="menu" @click="menuShow(subOpen, idx)" :class="{on : subOpen}">\
            <span class="ico" :style="{ \'background-image\': \'url(\' + mainMenu.icon_url + \')\'}" v-show="!subOpen"></span>\
            <span class="ico" :style="{ \'background-image\': \'url(\' + mainMenu.icon_active_url + \')\'}" v-show="subOpen"></span>\
            <span class="txt">{{ mainMenu.name }}</span>\
            <span class="ico_new" v-if="mainMenu.post_deco_icon_url" :style="{ \'background-image\': \'url(\' + mainMenu.post_deco_icon_url + \')\'}">new</span>\
        </a>\
        <div v-show="subOpen" v-if="subMenu">\
            <ul class="sub_menu">\
                <li><a class="sub" @click="clickEvent(mainMenu, \'main\')" v-if="mainMenu.show_all_flag">전체보기</a></li>\
                <li v-for="(sub, idx) in subMenu"><a class="sub" @click="clickEvent(mainMenu, \'sub\', sub)">{{ sub.name }}</a></li>\
            </ul>\
        </div>\
    </li>\
    '
    ,methods:{
        menuShow:function(obj,num){
          // KMF-637 amplitude event
          if(obj === false) {
            KurlyTracker.setAction('select_primary_category').sendData();
          }

          obj ? obj = false : obj = true;
          this.$emit('open-action',obj, num);
        }
        ,clickEvent:function(data, type, sub){
            var gaAction = '', gaLabel = '', no = '';
            if(type === 'sub'){ // 하위메뉴
                gaAction = 'category_select';
                gaLabel = data.name + ' || ' + sub.name;
                no = sub.no;
            }else if(type === 'main'){ // 대메뉴
                gaAction = 'category_expand';
                gaLabel = data.name +' || 전체보기';
                no = data.no;
            }

            ga('send', 'event', 'category', gaAction, gaLabel);
            sessionStorage.setItem('gListCategoryNo', no);
            sessionStorage.setItem('gListScrolltop', 0);
            sessionStorage.setItem('gListCheckPageNo', 1);
            sessionStorage.setItem('goodsListReferrer', false);

            // KM-1483 Amplitude
            var _action_data = {}
            _action_data.primary_category_id = data.no;
            _action_data.primary_category_name = data.name;
            _action_data.secondary_category_id = data.no;
            _action_data.secondary_category_name = '전체보기';
            if(type === 'sub'){
                _action_data.secondary_category_id = sub.no;
                _action_data.secondary_category_name = sub.name;
            }
            trackingCode('mobile', 'select_category', _action_data);
            // END : KM-1483 Amplitude

            location.href = '/m2/goods/list.php?category='+no;
        }
    }
});

// GNB_PC
Vue.component('gnb-menu-pc',{
    props:['mainMenu', 'subMenu', 'getCategoryNum', 'idx', 'subOpen'],
    template:'\
    <li>\
        <a class="menu" :class="{on : indexCheck(mainMenu.no, getCategoryNum)}" @click="clickEvent( \'main\', mainMenu)">\
            <span class="ico">\
                <img :src="mainMenu.pc_icon_url" alt="카테고리 아이콘" class="ico_off">\
                <img :src="mainMenu.pc_icon_active_url" alt="카테고리 아이콘" class="ico_on">\
            </span>\
            <span class="tit">\
                <span class="txt">{{ mainMenu.name }}</span>\
                <span class="ico_new" v-if="mainMenu.post_deco_icon_url" :style="{ \'background-image\': \'url(\' + mainMenu.post_deco_icon_url + \')\'}">new</span>\
            </span>\
        </a>\
        <ul class="sub_menu" :class="{recommend : subOpen == \'recommend\'}">\
            <li v-for="(sub, idx) in subMenu">\
                <a v-if="subOpen != \'recommend\'" class="sub" :class="{on : indexCheck(sub.no, getCategoryNum) }" @click="clickEvent(\'sub\', mainMenu, sub)">\
                    <span class="name">{{ sub.name }}</span>\
                </a>\
                <a v-if="subOpen == \'recommend\'" class="sub" :class="{on : indexCheck(sub.no, getCategoryNum) }" @click="clickEvent(\'recommend\', mainMenu, sub)">\
                    <span class="thumb" :style="{ \'background-image\' : \'url(\' + sub.thumbnail_url + \')\'}">\
                        <img src="https://res.kurly.com/pc/img/1810/bg_blink_236x179.png" alt="">\
                    </span>\
                    <span class="name">{{ sub.name }}</span>\
                </a>\
            </li>\
        </ul>\
    </li>\
    '
    ,methods:{
        clickEvent: function(type, data, sub){
            var _action_data = {}, gaAction, gaLabel, no;

            if(type === 'main'){ // 대메뉴, 전체보기 flag없을시 return;
                if(!data.show_all_flag){
                    return false;
                }
                no = data.no;
                gaAction = 'category_expand';
                gaLabel = data.name + ' || 전체보기'
            }else if(type === 'sub'){ // 하위메뉴
                gaAction = 'category_select';
                gaLabel = data.name + ' || ' + sub.name;

                no = sub.no;
            }else if(type === 'recommend'){
                gaAction = 'recommendation_category_select';
                gaLabel = data.name + ' || ' + sub.name

                no = sub.no;
            }
            ga('send', 'event', 'category', gaAction, gaLabel);


            if(!data.subOpen){ // 컬리추천
                // KM-1483 Amplitude
                _action_data = {
                    primary_category_id : data.no,
                    primary_category_name : data.name,
                    secondary_category_id : data.no,
                    secondary_category_name : '전체보기',
                }
                if(type === 'sub'){
                    _action_data.secondary_category_id = sub.no;
                    _action_data.secondary_category_name = sub.name;
                }
            }else{
                // KM-1483 Amplitude
                _action_data = {
                    primary_category_id : sub.no,
                    primary_category_name : sub.name,
                    secondary_category_id : null,
                    secondary_category_name : null,
                }

            }
            trackingCode(
              'pc',
              (
                isGiftCategory(data.no)
                  ? 'select_gift_list'
                  : 'select_category'
              ),
              _action_data
            );
            // END : KM-1483 Amplitude

            sessionStorage.setItem('gListCategoryNo', no);
            sessionStorage.setItem('gListScrolltop', 0);
            sessionStorage.setItem('gListCheckPageNo', 1);
            sessionStorage.setItem('goodsListReferrer', false);
            location.href = '/shop/goods/goods_list.php?category='+ no;
        }
        ,indexCheck:function(num, comparison){
            if(!comparison) return false;
            var result = ( comparison.indexOf(num) >= 0 ? true : false )
            return result;
        }
    }
});

// 컬리가추천합니다. GNB_Mobile
Vue.component('gnb-recommend',{
    props:['recommendMenu', 'type'],
    template:'\
    <li>\
        <a class="link sub" @click="clickEvent(recommendMenu, type)">\
            <span class="thumb" :style="{ \'background-image\': \'url(\' + recommendMenu.thumbnail_url + \')\'}">\
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOwAAACzCAQAAAAgAji9AAAAAXNSR0IArs4c6QAAAGlJREFUeNrtwYEAAAAAw6D5U1/hAFUBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3AZKygABVXsNlgAAAABJRU5ErkJggg==" alt="" v-if="type === \'pc\'">\
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKMAAAB4CAQAAAA0nIrnAAAAPUlEQVR42u3BgQAAAADDoPlTX+AIVQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfAOZSAABSigZ6wAAAABJRU5ErkJggg==" alt="" v-if="type === \'mobile\'">\
            </span>\
            <span class="name">{{ recommendMenu.name }}</span>\
            <span class="border"></span>\
        </a>\
    </li>\
    '
    ,methods:{
        clickEvent:function(item, type){
            ga('send', 'event', 'category', 'recommendation_category_select', item.name);

            // KM-1483 Amplitude
            var _action_data = {}
            _action_data.primary_category_id = item.no;
            _action_data.primary_category_name = item.name;
            _action_data.secondary_category_id = null;
            _action_data.secondary_category_name = null;
            trackingCode(type, 'select_category',  _action_data);
            // END : KM-1483 Amplitude

            if(type === 'mobile'){
                location.href = '/m2/goods/list.php?category=' + item.no;
            }else{
                sessionStorage.setItem('gListCategoryNo', item.no);
                sessionStorage.setItem('gListScrolltop', 0);
                sessionStorage.setItem('gListCheckPageNo', 1);
                sessionStorage.setItem('goodsListReferrer', false);
                location.href = '/shop/goods/goods_list.php?category=' + item.no;
            }
        }
    }
});

var gnbMenu = new Vue({
    el: '#gnbMenu',
    data: {
        getData:null,
        importantList: [],
        dataGnb: [], // 데이터불러오기
        dataRecommend: [], // 데이터불러오기
        defaultNo : 0, // 만약 파라메터 값이 있는경우
        titleRecommend : null,
        getCategoryNum : false,
        errors: [],
        type: 'pc'
    },
    computed: {
      dataGnbFiltered: function() {
        var list = [];

        var found;
        for (var i = 0; i < this.dataGnb.length; i++) {
          found = false;

          for (var j = 0; j < this.importantList.length; j++) {
            if (this.importantList[j].name === this.dataGnb[i].name) {
              found = true
              break;
            }
          }

          if (!found) {
            list.push(this.dataGnb[i]);
          }
        }

        return list;
      },
    },
    methods: {
        update:function(){
            kurlyApi({
                method:'get',
                url:'/v2/categories'
            })
            .then(function(response) {
                if(response.status != 200) return;
                this.getData = response.data.data;

                this.titleRecommend = this.getData.recommend_categories_name;

                var categoryParentNoCheck = false;
                for(var i = 0 ; i < this.getData.categories.length ; i++ ){
                  if(isGiftCategory(this.getData.categories[i].no)) {
                    /**
                     * TODO: PC와 모바일 웹에서는 선물하기 기능을 노출하지 않도록 하기 위해서
                     * 선물하기 카테고리를 노출하지 않도록 합니다.
                     */
                    // this.importantList.push(this.getData.categories[i]);
                    continue;
                  }

                  if(this.type === 'pc' && this.getCategoryNum){  // 상품목록에서 사용되는 아이콘 이미지적용
                      var categoryParentNo = this.getCategoryNum;
                      if(categoryParentNo.substring(0, 3) === this.getData.categories[i].no){
                          this.goodsListIconView(this.getData.categories[i].pc_icon_active_url);
                          categoryParentNoCheck = true;
                      }
                  }
                  this.dataGnb.push(this.getData.categories[i]);
                  this.$set(
                    this.dataGnb[this.dataGnb.length - 1],
                    'subOpen',
                     false
                  );
                }

                // 예외처리(이벤트로 카테고리메뉴 노출시 사용) - 가장앞에 있는 메뉴를 가장 뒤로 붙여주기
                /*if(this.type === 'pc' && ( this.getData.categories[0].no === '335' ) ){
                    var firstLast = this.dataGnb[0];
                    this.dataGnb.shift();
                    this.dataGnb.push(firstLast);
                }*/

                if(this.type === 'pc' && !categoryParentNoCheck && this.getCategoryNum){  // 상품목록에서 사용되는 아이콘 이미지적용
                    this.goodsListIconView('false');
                }


                var recommendData = {
                    name : '컬리의 추천',
                    show_all_flag : false,
                    post_deco_icon_url : false,
                    pc_icon_active_url : "https://res.kurly.com/pc/service/common/1908/ico_recommend_on_v2.png",
                    pc_icon_url : "https://res.kurly.com/pc/service/common/1908/ico_recommend_v2.png",
                    subOpen : 'recommend',
                    categories : []
                };


                for(var i = 0 ; i < this.getData.recommend_categories.length ; i++ ){
                    this.dataRecommend.push(this.getData.recommend_categories[i]);
                    if(this.type === 'pc'){
                        recommendData.categories.push(this.getData.recommend_categories[i]);
                }
                }

                if(this.dataRecommend.length === 0){
                    this.dataRecommend = false;
                }

                if(this.type === 'pc'){
                    this.dataGnb.push(recommendData);
                }

                $('.bg_loading').hide();
            }.bind(this)).catch(function(e){
                $('.bg_loading').hide();
                    this.errors.push(e);
                    console.error(this.errors.reduce(function (str, err) {
                        var alertMsg = 'MESSAGE: ' + err.message;
                        return str + "\n" + alertMsg;
                    }, ''));

            // alert(this.erors.code + this.errors.message);
         }.bind(this));
        }
        ,openAction : function(result, idx){
            this.dataGnbFiltered[idx].subOpen = result;
            for(var i = 0 ; i < this.dataGnbFiltered.length ; i++ ){
                if(idx !== i){
                    this.dataGnbFiltered[i].subOpen = false;
                }
            }
        }
        ,goodsListIconView : function(icoSrc){ // 상품목록에서 사용되는 아이콘 이미지 보내기
            if(icoSrc === 'false'){
                return;
            }
            if($('#goodsListIconView').length > 0){
                $('#goodsListIconView').parent('.ico').css('display', 'block');
                $('#goodsListIconView').attr('src', icoSrc);
            }
        }
    },
    updated : function(){
        this.$nextTick(function (){
            if(this.type === 'mobile') return;

            var s = { // selector
                categoryOpen : $('#gnb .menu1 a'),
                gnbSub : $('#gnb .gnb_sub'),
                gnbSubMenu : $('#gnb .gnb_sub li'),
                gnbMenu : $('#gnb .gnb_menu'),
                subMenu : $('#gnb .gnb_sub .sub_menu li'),
                current : 'current',
                time : 200
            }

            s.categoryOpen.hover(function(){
                s.gnbSub.show();
                s.categoryOpen.addClass('on');
                sizeAction(false, 'reset');
            }, function(){
                s.gnbSub.hide();
                s.categoryOpen.removeClass('on');
                s.gnbSub.hover(function(){
                    s.gnbSub.show();
                    s.categoryOpen.addClass('on');
                }, function(){
                    s.gnbSub.hide();
                    s.categoryOpen.removeClass('on');
                });
            });

            s.gnbSubMenu.hover(function(){
                var $target = $(this);
                $(s.current).removeClass(s.current);
                $target.addClass(s.current);
                if($target.find('.sub_menu li').length === 0){
                    sizeAction(false);
                }else{
                    if($target.find('.sub_menu').hasClass('recommend')){
                        sizeAction(true, 'recommend');
                    }else{
                        sizeAction(true);
                    }
                }
            }, function(){
                var $target = $(this);
                $target.removeClass(s.current);
                sizeAction(false);
                s.subMenu.hover(function(){
                    var $targetSub = $(this);
                    $targetSub.parent().parent().addClass(s.current);
                    if($targetSub.parent().hasClass('recommend')){
                        sizeAction(true, 'recommend');
                    }else{
                        sizeAction(true);
                    }
                });
            });

            // 레이어 가로 사이즈
            function sizeAction(option, type){
                var snbSize = s.gnbMenu.data('min');
                if(option){
                    if(type === 'recommend'){
                        snbSize = s.gnbMenu.data('max');
                    }else{
                        snbSize = s.gnbMenu.data('min') + s.gnbMenu.data('default');
                    }
                }

                if(type === 'reset'){
                    s.gnbSub.css({width : snbSize});
                }else{
                    s.gnbSub.stop().animate({width : snbSize}, s.time);
                }
            }

            var gnbTimer = null;
            $(window).on('resize', function(){
                clearTimeout(gnbTimer);
                gnbTimer = setTimeout(resize_gnb, 300);
            });
            function resize_gnb(){
                var winHeight =  $(window).height();
                var defaultHeight = (s.gnbMenu.children('li').length*38) + 75; // GNB의 메뉴 갯수 * height 값 + 21(메뉴 첫번째 마지막,공백) + 54(기본 GNB의 height)
                if(winHeight < defaultHeight){
                    s.gnbMenu.addClass('size_over');
                    s.gnbMenu.height(winHeight/1.2);
                }else{
                    s.gnbMenu.removeClass('size_over');
                    s.gnbMenu.height('auto');
                }
            }
            resize_gnb();
        })
    }
});
