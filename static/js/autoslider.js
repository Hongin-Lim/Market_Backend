  jQuery(function ($) {
    
    function AutoSlider ( $trigger, time ) {
      this.$trigger = $trigger;
      this.interval = null;
      this.time = time || 5000;
    }
    AutoSlider.prototype.start = function () {
      this.interval = setTimeout(function () {
        this.$trigger.trigger('click');
      }.bind(this), this.time);
      return this;
    }
    AutoSlider.prototype.stop = function () {
      clearTimeout(this.interval);
      return this;
    }
    
    $(".__slide-wrapper[data-slide-auto]").each(function () {
      var $wrapper = $(this);
      var time = +$wrapper.data("slide-auto");
      $wrapper.data("slide-auto-timer", new AutoSlider( $wrapper.find(".__slide-go-right"), time));
      $wrapper.data("slide-auto-timer").start();
      $wrapper.on('mouseover mouseout', function (e) {
         $(this).data("slide-auto-timer")[e.type === 'mouseover' ? 'stop' : 'start']();
      });
    });

	$(".main-slider.__slide-wrapper").on({
		mouseenter:function(){
			var $wrapper = $(this);
	        var time = +$wrapper.data("slide-auto");
			$(this).data("slide-auto-timer").stop();
		},
		mouseleave:function(){
			var $wrapper = $(this);
			var time = +$wrapper.data("slide-auto");
			$(this).data("slide-auto-timer").start();
		}
	})
    
    $(document).on("click", ".__slide-go-left, .__slide-go-right, [data-slide-go]", function ($e) {
      $e.preventDefault();
	   function AutoSlider ( $trigger, time ) {
		  this.$trigger = $trigger;
		  this.interval = null;
		  this.time = time || 5000;
	  }
	  AutoSlider.prototype.stop = function () {
		  clearTimeout(this.interval);
		  return this;
	  }

      var $trigger = $(this);
      var $wrapper = $trigger.closest(".__slide-wrapper");
      var $mover = $wrapper.find(".__slide-mover").eq(0);
      if ($mover.is(":animated")) {
        return;
      }
      var $items = $mover.find("> .__slide-item");
      var $target, moveTo = 0;      
      var itemSize = $wrapper.data("slide-item") || 1;
      var slideWidth = $items.eq(1).outerWidth(true) * itemSize;

	 
      //console.log($items.length, itemSize);
      if ($items.length > itemSize) {
        if ( $trigger.hasClass('__slide-go-left') ) {
          $target = $items.slice(-itemSize);
          $target.clone().prependTo($mover);
          $mover.css('left', -slideWidth + 'px');
        } else if ( $trigger.hasClass('__slide-go-right') ) {
          $target = $items.slice(0, itemSize);
          $target.clone().appendTo($mover);
          moveTo = -slideWidth;
        } else {
          if ($trigger.hasClass("__active")) {
            return;
          }
          moveTo = -slideWidth * +$trigger.data("slide-go");
          $trigger.siblings('.__active').removeClass('__active');
          $trigger.addClass('__active');
          //console.log(moveTo);
        }
        // auto slider option
        var $timer = null;
        if ($wrapper.data("slide-auto-timer") instanceof AutoSlider) {
          $timer = $wrapper.data("slide-auto-timer");
        } else if ($trigger.data("slide-auto-keep") === "parent") {
          //console.log($wrapper);
          $timer = $wrapper.closest("[data-slide-auto]").data("slide-auto-timer");
          //console.log($timer);
        }
        $timer && $timer.stop();
        //autoSlider.stop();
        $mover.animate({'left': moveTo + 'px'}, 300, function () {
          $target && $target.remove();
          $target && $mover.css('left', 0);
          $timer && $timer.start();
        });
      }
    });
  });