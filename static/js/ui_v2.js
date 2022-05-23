var kurly_common = (function(){
  function initModule(){
    _gnb($('#gnb'));
    if($('#qnb').length != 0){
      _qnb($('#qnb').find('.list_goods'));
    }
  }

  // scroll_event
  function _scrollfixed(target,objPos,className){
    $(window).on('load scroll', function(){
      if($(window).height() > $(document).height() - $('#header').height()) return false;
      if ($(window).scrollTop() >= objPos){

        if(className === 'qnb_stop'){
          if(target.height() + $('#gnb').height() + 30  > $(window).height() ){
            target.css({
              top : $(window).scrollTop() + $('#gnb').height() - $('#header').height()
            });
          }else{
            target.css({
              top : $(window).scrollTop() + $(window).height()/2 - target.height()/2 - $('#header').height()
            });
          }
        }else{
          target.addClass(className);
        }
      } else {
        if(!$('body').hasClass('noBody')){
          if(className === 'qnb_stop'){
            target.css({
              top : objPos
            });
          }else{
            target.removeClass(className);
          }
        }
      }
    }).scroll();
  }

  function _gnb(target){
    if(target.length != 0){
      // 스크롤시 gnb고정
      var gnbPosition = target.offset().top;
      setTimeout(function() {
        _scrollfixed(target, gnbPosition, 'gnb_stop')
      }, 500);
    }
  }

  // 스크롤시 qnb고정
  function _qnb(target){
    var qnbPos = 0;
    setTimeout(function(){
      qnbPos = parseInt( $("#qnb").css('top'), 10);
      _scrollfixed($("#qnb"),qnbPos,'qnb_stop');
    }, 500)


    var targetTop = parseInt(target.find("li").eq(0).height()+5);
    var targetPos = 0;
    var targetCount = 0;
    var targetCheck = false;
    var targetChid = 2;
    var maxHeightSize = target.data('height');
    var $upBtn = target.parent().find('.btn_up');
    var $downBtn = target.parent().find('.btn_down');

    if(target.find('li').length <= 2){
      target.height( item_height_check(target.find("li"), target.find('li').length) );
    }else if(target.find('li').length > 2 ){
      target.height(maxHeightSize);
    }

    target.parent().find('.btn').on('click',function(){
      if(targetCheck === true) return false; // 상태에 따른 이벤트 추가 발생 막기
      targetCheck = true; // 일단 이벤트가 발생하면 중복 안되도록 변수선언

      if($(this).hasClass('btn_down')){
        targetCount--;
        if(Math.abs(targetCount) > target.find('li').length - targetChid){
          targetCount++;
          targetCheck = false;
          // alert('최근 본 마지막 상품입니다.');
          return false;
        }

        if(targetCount < 0){
          $upBtn.removeClass('off');
        }

        if(Math.abs(targetCount) +1 > target.find('li').length - targetChid){
          $downBtn.addClass('off');
        }
      }else{
        targetCount++;
        if(targetCount > 0){
          targetCount = 0;
          targetCheck = false;
          // alert('최근 본 첫번째 상품입니다.');
          return false;
        }

        if(Math.abs(targetCount) - 1 <= target.find('li').length - targetChid){
          $downBtn.removeClass('off');
        }
        if(targetCount === 0){
          $upBtn.addClass('off');
        }
      }
      targetPos = item_height_check(target.find("li"), targetCount);

      if( Math.abs(targetPos) > item_height_check(target.find("li")) - maxHeightSize){
        targetPos = -(item_height_check(target.find("li")) - maxHeightSize);
      }

      target.find('.list').animate({
        top : targetPos
      },300,function(){targetCheck = false})
    });

    if(Math.abs(targetCount) +1 > target.find('li').length - targetChid){
      $downBtn.addClass('off');
    }
  }

  function item_height_check(target, max){
    var checkHeight = 0;
    target.each(function(idx){
      if(idx < max || max === undefined){
        checkHeight += parseInt($(this).height());
      }else if(max < 0){
        if(idx < Math.abs(max)){
          checkHeight -= parseInt($(this).height());
        }
      }
    });
    return checkHeight;
  }

  return {
    init: initModule
  };
}());

jQuery(document).ready(function(){
  kurly_common.init();// 170220_앞으로 마켓컬리 공통 js는 모두 이곳으로
  fe_cart_prevention();//중복 장바구니 방지
  fe_tooltip(); //마이페이지 저번달 실결제금액 툴팁
  fe_goodsDetail(); //상품상세 페이지 상품이미지 탭으로 이미지 옮김

  //장바구니 필수품 리뷰막기
  if( jQuery("#goods-review").length ){
    if( jQuery(".goods-list-position a").last().text() == "KURLY PASS" ){	// Template_ 처리(2016.09.23, 김기완)
      if( jQuery(".goods-view-wrapper .goods-view-name").text() != "샛별박스(+컬리패스)" ){
        jQuery(".goods-view-infomation-tab-group").each(function(){
          $(this).find("a:contains('상품후기')").parents(".goods-view-infomation-tab").remove();
        })
        jQuery("#goods-review").prev(".goods-view-infomation-tab-group").hide();
        jQuery("#goods-review").hide();
      }
    }
  }

  //컬리러브스 스페인
  if(String(location.href.indexOf("id=love&no=16")) > -1){
    jQuery(".week_tab li").click(function(){
      var idx=$(this).index();
      jQuery(this).addClass("on").siblings().removeClass("on");
      jQuery("#spain_story p").siblings().hide().eq(idx).show();
      return false;
    });
  }


  //main popup
  jQuery(".layer_pop_close").click(function(){
    jQuery(".layer_pop_event").hide();
    return false;
  });

});

// realign product image(old)
function fe_goodsDetail(){
  var $imgPrd = $("#goods-description").find("img#img_product");

  if($imgPrd.length > 0){
    $imgPrd.prependTo("#goods-image");
  }
}

// prevent show cart
function fe_cart_prevention(){
  var cart_switch = 'on';
  $(".goods-list-item-cart-button").click(function(){
    //중복 장바구니 방지(S)
    if( cart_switch == 'off' ){
      alert('동작 처리중입니다. 잠시만 기다려주세요.');
      return false;
    }
    cart_switch = 'off';
    setTimeout(function(){
      cart_switch = 'on';
      $('.ask-alert-type-message').parent('.ask-layer-wrapper').remove()
    }, 1500);
    //중복 장바구니 방지(E)
  })
}

// my page tooltip
function fe_tooltip(){
  $(".btn_tooltip").mouseenter(function(){
    $(this).parents(".etc").find(".tooltip_area").show();
  });
  $(".tooltip_area").mouseleave(function(){
    $(this).hide();
  })
}

// 2018-10-30 장차석 : PD-822 PC) 장바구니 담기 기능 > 레이어 팝업 아이템 갯수 오류
var cartCountCheck = 0;
function cart_count_down(cntItems, skipMessage) {
  if(cntItems !== '' && !isNaN(cntItems)) {
    updateCartCount(cntItems, skipMessage);
  } else {
    kurlyApi({
      method:'get',
      url:'/cart/v1/cart-items/available-for-purchase-count?_t=' + new Date().valueOf()
    }).then(function(response){
      var count = response.data.data.count;
      updateCartCount(count, skipMessage);
    }.bind(this)).catch(function(e){
      console.log(this)
    }.bind(this));
  }

  function updateCartCount(count, skipMessage) {
    var $target = $('#cart_item_count');
    //var oldCount = Number( $('#cart_item_count').text() );
    if(count > 0){
      if(count > 99){
        $target.addClass('max');
        $target.show().html('99+');
      }else if(count > 9 && count < 100){
        $target.addClass('ten')
        $target.show().html(count);
      }else{
        $target.show().html(count);
      }

      if($('#addMsgCart').length > 0 && cartCountCheck > 0 && skipMessage !== true){
        //if( oldCount < count ){
        $('#addMsgCart').css({
          display:'block',
          opacity:0
        }).animate({
          opacity:1
        },500,function(){
          setTimeout(function(){
            $('#addMsgCart').stop().hide(500);
            $('#msgReaddedItem').removeClass('add');
          },1000);
        });
        //}
      }
    }else{
      $target.hide();
    }
    cartCountCheck++;
  }
}



// vuejs - 뒤로가기이동시 hash없이 작동되게 처리
$(document).ready(function(){
  if(checkIsApp === true){
    // 장바군니 페이지에선 API에서 카운터 업데이트
    if (location.pathname !== '/shop/goods/goods_cart.php') {
      // 2018-10-30 장차석 : PD-822 PC) 장바구니 담기 기능 > 레이어 팝업 아이템 갯수 오류
      cart_count_down();
    }
    // end
  }

  if (location.pathname.indexOf('/shop/goods/goods_list.php') !== -1 || location.pathname.indexOf('/shop/goods/goods_search.php') !== -1 || location.pathname.indexOf('/shop/member/login.php') !== -1) {
    if (!sessionStorage.getItem('goodsListReferrer')) { // 해당값이 true 또는  goodsView 가 아닐때 false처리
      sessionStorage.setItem('goodsListReferrer', false);
    }

  } else if(location.pathname.indexOf('/m2/goods/view.php') != -1 || location.pathname.indexOf('/shop/goods/goods_view.php') != -1) {
    sessionStorage.setItem('goodsListReferrer', 'goodsView');
  } else {
    if (location.pathname.indexOf('/login.php') === -1) {
      sessionStorage.setItem('goodsListReferrer', false);
    }

  }
});


// Event Netlify 주소 설정
var campaginUrl;
if (/^(?:www\.)?kurly\.com$/.test(location.host)) {
  // 실서버
  campaginUrl = 'https://campaign.kurly.com/';
} else if (location.host.indexOf('local') === -1) {
  // dev stg perf
  campaginUrl = 'https://campaign.dev.kurly.com/';
} else {
  campaginUrl = '/campaign/';
}
