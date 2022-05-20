var conversionsTracker = (function() {
  var time = window.webStatus.timestamp;
  var uuid = window.amplitudeUid; // amplitude에서 사용 중
  var appCheck = window.webStatus.appCheck;

  var i, len, arr = {};

  var _conversionsTracker = {
    setAction: function(eventName, eventData){
      if(appCheck) {
        return false;
      }

      this.setData(eventName, eventData ? eventData : '');
    },
    setData: function(eventName, eventData){
      var valueSum = 0, eaSum = 0;

      switch(eventName){
        case 'AddToCart' : // 장바구니담기
          var paramData = {
            content_ids: [],
            content_type: 'product',
            contents: [],
            currency: 'KRW'
          }

          len = eventData.length;
          var dataId = '', dataQuantity = 0;
          for(i = 0; i < len; i++){
            dataId = String(eventData[i].parent_id ? eventData[i].parent_id : eventData[i].no);
            dataQuantity += parseInt(eventData[i].ea, 10);
            paramData.content_ids.push( dataId );
            valueSum += ( (eventData[i].discounted_price || eventData[i].discount_price) * eventData[i].ea);
          }
          paramData.contents.push( {id: paramData.content_ids[0], quantity: dataQuantity} );
          paramData.value = valueSum.toFixed(2)
          break;
        case 'ViewContent' : // 상품상세페이지보기
          arr = {
            id: String(eventData),
            quantity: 1
          }
          var paramData = {
            content_ids: [],
            content_type: 'product',
            contents: [],
          }
          paramData.content_ids.push(eventData);
          paramData.contents.push(arr);
          break;
        case 'Purchase' : // 구매하기
          var paramData = {
            content_ids: [],
            content_type: 'product',
            contents: [],
            currency: 'KRW'
          }

          var products = eventData.products;

          len = products.length;
          for(i = 0; i < len; i++){
            arr = {
              id: '',
              quantity: 0,
            }
            arr.id = String(products[i].goodsno);
            if(products[i].is_package === '0') { // 단품
              arr.quantity = parseInt(products[i].ea, 10);
            }
            if(products[i].is_package === '1') { // 패키지 상품
              var dataQuantity = 0, jLen = products[i].package_items.length;
              for(var j = 0;j < jLen; j++) {
                dataQuantity += parseInt(products[i].package_items[j].item_ea, 10);
              }
              arr.quantity = dataQuantity;
            }
            paramData.content_ids.push(arr.id);;
            paramData.contents.push(arr);
          }

          paramData.value = eventData.payment_amount.toFixed(2)
          break;
        case 'CompleteRegistration' : // 회원가입완료
            // var paramData = {
            //   currency: 'KRW',
            // }
            break;
      }
      this.sendEvent(eventName, paramData);
    },
    sendEvent: function(eventName, paramData){
      var that = this;
      var data = {
        event_name: eventName,
        event_time: Math.floor(time/1000),
        user_data: {
          client_ip_address: "1.2.3.4",
          client_user_agent: navigator.userAgent,
          external_id: uuid,
          fbc: that.urlCheckAction('fbclid') || '',
        },
        action_source: 'website',
      };

      if(eventName !== 'CompleteRegistration') {
        data.custom_data = paramData;
      }

      var sendData = {data: []}, CONVERSION_URL = '';
      sendData.data.push(data);
      // sendData.test_event_code = 'TEST24692'; // test event check  필요할시 이부분 주석해제 : 하루에 한번씩 바뀜

      $.ajax({
        url: campaginUrl + 'json/tracker/facebookConversions.json',
      }).success(function(result){
        if(typeof result !== 'undefined') {
          CONVERSION_URL = 'https://graph.facebook.com/v11.0/526625657540055/events?access_token=';
          that.sendDataAction(CONVERSION_URL += result.data.token, sendData);
        }else{
          console.log('campagin: facebookConversions.json 확인필요');
          return false;
        }
      }).error(function(xhr, status, errorThrown){
        console.log("오류명: " + errorThrown)
        console.log("상태: " + status);
        return false;
      });
    },
    sendDataAction: function(url, data) {
      $.ajax({
        type:"post",
        url: url,
        data: data,
        error : function(error) {
          console.log('error', error);
        }, success : function(data) {
          // console.log('data',data);
        }
      });
    },
    urlCheckAction: function(name) {
      var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
      if(results && results[1]) {
        return saveData = 'fb.1.' + time + '.' + encodeURIComponent(results[1]);
      }
      return '';
    }
  }

  return _conversionsTracker
})();
