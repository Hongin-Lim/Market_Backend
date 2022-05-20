var _token = jwtToken;
/*
추후 로그인 / 로그아웃 까지 붙일경우 처리할로직

//세션 스토리지에서 토큰 가져온다
var _token = sessionStorage.getItem("jwtToken");

//토큰이 없을경우 서버에서 가져온 토큰을 활용
if(_token == null) {
    _token = sessionStorage.setItem('jwtToken', jwtToken);
}
*/

//모바일 일 경우 getCookie 함수 정의보다 호출이 먼저 실행됨
function getCookie( name )
{
  var nameOfCookie = name + "=";
  var x = 0;
  while ( x <= document.cookie.length )
  {
    var y = (x+nameOfCookie.length);
    if ( document.cookie.substring( x, y ) == nameOfCookie ) {
      if ( (endOfCookie=document.cookie.indexOf( ";", y )) == -1 )
        endOfCookie = document.cookie.length;
      return unescape( document.cookie.substring( y, endOfCookie ) );
    }
    x = document.cookie.indexOf( " ", x ) + 1;
    if ( x == 0 )
      break;
  }
  return "";
}

function useOwnJWT() {
  var is_cached = getCookie("is_cached"); // Y or N
  if(is_cached) {
    if(is_cached == "N") {
      sessionStorage.setItem('_JWT', jwtToken);
    } else {
      if(sessionStorage.getItem('_JWT')) {
        _token = sessionStorage.getItem('_JWT');
      }
    }
  }
}
function update_when_loggin() {

  var is_login = getCookie("is_login"); // Y or N
  if(is_login && is_login == "Y") {
    sessionStorage.setItem('_JWT', jwtToken);
  }
}
// useOwnJWT();
// update_when_loggin();

var kurlyApi = axios.create({
  baseURL: apiDomain
});

kurlyApi.interceptors.request.use(function (config) {
  // Do something before request is sent
  // console.log(config);
  if( !config._retry) {
    //console.log(config._retry);
    config.headers.authorization = 'Bearer '+_token;
  }
  config.headers.accept =  "application/json";

  // 301 error - hotfix
  if(config.url.indexOf('?') === -1){
    config.url += '?ver=1';
  }

  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});
var countkurlyApi = 0
//모든 응답에 권한없음이 올경우 갱신하도록 처리한다.
kurlyApi.interceptors.response.use(function (response){
  return response
}, function (error) {
  var originalRequest = error.config;
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true; // now it can be retried
    if (countkurlyApi > 3) {
      countkurlyApi = 0;
      return;
    }
    countkurlyApi++
    return kurlyApi.put('/v3/auth/refresh').then(function (response) {
      _token = response.data.data.access_token;
      sessionStorage.setItem('_JWT', _token);
      originalRequest.headers['authorization'] = 'Bearer ' + _token; // new header new token
      return kurlyApi(originalRequest); // retry the request that errored out
    })
    .catch(function(error) {
      Sentry.captureException(error);
      throw error;
    });
  }
  // Do something with response error
  return Promise.reject(error)

});
