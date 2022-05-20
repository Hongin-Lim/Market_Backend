// Function.prototype.bind 폴리필
if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        if (typeof this !== 'function') {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs   = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP    = function() {},
            fBound  = function() {
                return fToBind.apply(this instanceof fNOP
                    ? this
                    : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        if (this.prototype) {
            // native functions don't have a prototype
            fNOP.prototype = this.prototype;
        }
        fBound.prototype = new fNOP();

        return fBound;
    };
}



(function ($) {
    if (!$) {
        return;
    }
    $(function () {
        var $topMessage = $('#top-message');
        $('#top-message-close').click(function (e) {
            e.preventDefault();
            $topMessage.animate({'margin-top': '-'+$topMessage.height()+'px'}, 400);
        });

        $(document).on('click', '.goods-list-item-cart-button', function ($e) {
            $e.preventDefault();
            var $this = $(this);
            // 2018-10-30 장차석 : PD-822 PC) 장바구니 담기 기능 > 레이어 팝업 아이템 갯수 오류
            if(goodsListItemCartButtonCheck) return;
            goodsListItemCartButtonCheck = true;
            // end
            
            // KM-610 장차석 :  PC) 상품목록에서 장바구니 기능 버그수정(1회클릭후 같은 상품 누적되는 현상)
            var cartGoodsNo = null;
            if($this.hasClass('btn_cart') && $('#goodsList').length > 0){
                cartGoodsNo = $this.find('span').text();
            }else{
                cartGoodsNo = $this.data('goodsno');
            }
            // // KM-610 장차석 
            $.get('../goods/goods_option.php', {'goodsno': cartGoodsNo}, function (content) {
                thefarmers.ask({
                    'type': 'option',
                    'title': '장바구니 담기',
                    'content': content
                }, {
                    "장바구니 담기": {
                        'className': '__active',
                        'callback': function (control) {
                            var $form = $('#option-form');
                            var $multi = $form.find('[name^="multi_addopt"]');
                            if ($multi.length && !$multi.filter(':checked').length && ($multi.find('[name=is_package]').val() === '1' && $multi.find('[name=package_type]') === '1')) {
                                alert('옵션을 선택해주세요!!');

                                return false;
                            }
                            // 2018-10-30 장차석 : PD-822 PC) 장바구니 담기 기능 > 레이어 팝업 아이템 갯수 오류
                            var goodsThumbName = '';
                            if($this.parents('.item') && $this.parents('.item').length > 0){
                                goodsThumbName = $this.parents('.item').find('.img img').attr('src');
                            }
                            if($this.parents('tr') && $this.parents('tr').length > 0){
                                goodsThumbName = $this.parents('tr').find('.thumb img').attr('src');
                            }

                            var goodsName = '';
                            var goodsNameItem = [];
                            if($form.find('[name=is_package]').val() === "1" && $form.find('[name=package_type]').val() === "1"){
                                $multi.each(function(){
                                    if($(this).is(':checked')){
                                        goodsNameItem.push($(this).val().split('^')[1]);
                                    }
                                });
                                if(goodsNameItem.length > 1){
                                    goodsName = '<span class="name">' + goodsNameItem[0] + '</span>외 ' + (goodsNameItem.length - 1) + '종';
                                }else{
                                    goodsName = goodsNameItem[0];
                                }
                            }else{
                                goodsName = $form.find('.goods-option-select-title').text();
                            }
                            // end 

                            ajaxCart($form.serialize());
                            control.close();
                        }
                    },
                    "취소": {
                        'callback': function (control) {
                            control.close();
                        }
                    }
                });
            });
        });
    });


    // onhashchange 구현
    if ( ! ('hashchange' in window)) {
        !function (l) {
            var hash = l.hash;
            setInterval(function () {
                if (l.hash !== hash) {
                    hash = l.hash;
                    jQuery( window ).trigger('hashchange');
                }
            }, 200);
        }(window.location);
    }
    function focusable( element, isTabIndexNotNaN ) {
        var map, mapName, img,
            nodeName = element.nodeName.toLowerCase();
        if ( "area" === nodeName ) {
            map = element.parentNode;
            mapName = map.name;
            if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
                return false;
            }
            img = $( "img[usemap='#" + mapName + "']" )[ 0 ];
            return !!img && visible( img );
        }
        return ( /^(input|select|textarea|button|object)$/.test( nodeName ) ?
            !element.disabled :
            "a" === nodeName ?
                element.href || isTabIndexNotNaN :
                isTabIndexNotNaN) &&
            // the element and all of its ancestors must be visible
            visible( element );
    }

    function visible( element ) {
        return $.expr.filters.visible( element ) &&
            !$( element ).parents().addBack().filter(function() {
                return $.css( this, "visibility" ) === "hidden";
            }).length;
    }

    $.extend( $.expr[ ":" ], {
        data: $.expr.createPseudo ?
            $.expr.createPseudo(function( dataName ) {
                return function( elem ) {
                    return !!$.data( elem, dataName );
                };
            }) :
            // support: jQuery <1.8
            function( elem, i, match ) {
                return !!$.data( elem, match[ 3 ] );
            },

        focusable: function( element ) {
            return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
        },

        tabbable: function( element ) {
            var tabIndex = $.attr( element, "tabindex" ),
                isTabIndexNaN = isNaN( tabIndex );
            return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
        }
    });
}(window.jQuery));

