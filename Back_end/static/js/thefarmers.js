/*
 * 더파머스 스크립트
 */

// 2018-10-30 장차석 : PD-822 PC) 장바구니 담기 기능 > 레이어 팝업 아이템 갯수 오류
var goodsListItemCartButtonCheck = false;
// end
window.thefarmers = (function ($) {

    var thefarmers = {};
    var zIndex = 10000;

    thefarmers.callback = {};

    function closeAskLayer () {
        $(this).closest('.ask-layer-wrapper').remove();
    }

    $(document).on('click', '[data-ask-callback-key]', function ($e) {
        $e.preventDefault();
        var callbackKey = $(this).data('ask-callback-key');
        if (thefarmers.callback[callbackKey]) {
            thefarmers.callback[callbackKey].call(this, {
                close: closeAskLayer.bind(this)
            });

            // 2018-10-30 장차석 : PD-822 PC) 장바구니 담기 기능 > 레이어 팝업 아이템 갯수 오류
            goodsListItemCartButtonCheck = false;
            // end
        }
    }).on('click', '.ask-alert-close-button, .ask-layer-background', function ($e) {
        $e.preventDefault();
        closeAskLayer.call(this);

        // 2018-10-30 장차석 : PD-822 PC) 장바구니 담기 기능 > 레이어 팝업 아이템 갯수 오류
        goodsListItemCartButtonCheck = false;
        // end
    });

    thefarmers.ask = function (config, buttons, success) {
        // callbacks 조정
        $.each(buttons, function (key, value) {
            if (value.callback) {
                var rkey;
                do {
                    rkey = parseInt(+new Date * Math.random(), 10);
                } while ( value.callback[rkey] );
                var callback = value.callback;
                thefarmers.callback[ rkey ] = callback;
                //"onclick='thefarmers._callback[1237345875].call(this, window.event);'"
                value.callback = rkey;
            }
        });
        if (typeof config === "string") {
            config = {
                "type": "message",
                "message": config,
                "title": "알림메세지"
            };
        }
        $.post("/shop/proc/ask-message.php", {
            "type": config.type || "message",
            "content": config.message || config.content || "",
            "title": config.title,
            "buttons": buttons
        }, function (askWindow) {
            $('body').prepend(askWindow);
            var $layer = $('.ask-layer-wrapper').last().css('zIndex', zIndex++);
            $layer.find(':tabbable')[0].focus();
            var $window = $layer.find('.ask-alert-window');
            var $contents = $window.find('> *');
            var totalHeight = 0;
            $contents.map(function(){return $(this).outerHeight()}).each(function (i, value) {
                totalHeight += value;
            });
            $window.height( totalHeight );
            success && success($layer);
        });
    };

    thefarmers.alert = function (config, success) {
        this.ask(config, {
            "확인": {
                "className": "__active",
                "callback": function (control) {
                    control.close();
                    success && success();
                }
            }
        });
    };
    thefarmers.confirm = function (config, success) {
        this.ask(config, {
            "취소": {
                "callback": function (control) {
                    control.close();
                }
            },
            "확인": {
                "className": "__active",
                "callback": function (control) {
                    control.close();
                    success && success();
                }
            }
        });
    };

    /*
    thefarmers.alert({"title":"관심상품담기","message":"담으실 상품을 선택해주세요."}).then(function () {
      
    }, function () {
      
    });
    thefarmers.confirm();
    
    thefarmers.ask({"title":"관심상품 담기","message":"선택하신 상품을 관심상품에 담았습니다.<br>지금 관심상품을 확인하시겠습니까?"},{
      "쇼핑 계속하기": {
        "callback": function () {
          
        }
      },
      "관심상품 확인": {
        "className": "__active",
        "callback": function () {
          
        }
      }
    });
    
    */
    return thefarmers;

}(jQuery));