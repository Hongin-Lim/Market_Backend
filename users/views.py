import json
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm, SetPasswordForm
from django.shortcuts import render, redirect, get_object_or_404
from users.forms import signupForm
from users.forms import PasswordChangeForm
from django.contrib.auth.hashers import check_password
from coupon.models import Coupon
from users.models import User

# 마이페이지 (장바구니)
def mypage(request):
    return render(request, 'cart/detail.html')
# 쿠폰페이지
def coupon(request):
    user_id = request.user.id
    # owner = User.objects.filter(id=user_id)
    owner = get_object_or_404(User,id=user_id)
    my_coupon = owner.coupon_set.all()
    # print(type(my_coupon))
    coupon_count = len(my_coupon)
    coupon_name = my_coupon.values('name')
    # print(coupon_name.values().__dic__)

    return render(request, 'mypage/coupon.html', {'coupon_count' : coupon_count, 'coupon_name':coupon_name,'my_coupon':my_coupon})

def info_change(request):
    return render(request, 'mypage/info_change.html')

# 회원가입
def signup(request):
    if request.method == "GET":
        userForm = signupForm()
        print("get 방식 이동")
        return render(request, 'login/sign_up.html', {'userForm': userForm})
    elif request.method == "POST":
        userForm = signupForm(request.POST)
        print("pass")
        if userForm.is_valid():
            print("data 통과")
            if request.POST["password1"] == request.POST["password2"]:
                userForm.save()
                print("DB저장")
            # 민수야 위에서 password1이랑 password2가 같은지 확인했으니까, 만약 다를경우도 생각해줘야할듯.
            else:
              print("비밀번호 불일치")
              return render(request, 'login/fail.html')
            return render(request, 'login/success.html')
        else:
            print("양식 오류")
            return render(request, 'login/fail.html')


def userlogin(request):
    if request.method == "GET":
        print('get 방식 이동')
        loginForm = AuthenticationForm()
        return render(request, 'login/login_page.html',
                      {'loginForm': loginForm})
    elif request.method == "POST":
        print('POST 성공')
        loginForm = AuthenticationForm(request, request.POST)
        if loginForm.is_valid():
            print('로그인 성공')
            auth_login(request, loginForm.get_user())
            return redirect('/')
        else:
            print('로그인 실패')
            return render(request,'login/error.html')

@login_required
def userlogout(request):
    print("로그아웃 완료")
    auth_logout(request)
    return redirect('/')


@login_required
def kakao_logout(request):
    """
    카카오톡과 함께 로그아웃 처리
    """
    kakao_rest_api_key = '9f3d88106a97581bcd1a61ba5942473b'
    logout_redirect_uri = "http://172.30.1.222:31000/logout/"
    state = "none"
    kakao_service_logout_url = "https://kauth.kakao.com/oauth/logout"
    print("카카오 로그아웃 완료")
    return redirect(f"{kakao_service_logout_url}?client_id={kakao_rest_api_key}&logout_redirect_uri={logout_redirect_uri}&state={state}")


#회원정보 변경
@login_required(login_url='/login')
def update(request):
    if request.method == 'GET':
        password_change_form = PasswordChangeForm(request.user)
        print("GET 가져오기")
        return render(request, 'mypage/info_change.html', {'password_change_form': password_change_form},)
    # if request.method == 'POST':
    #     # 패스워드 변경
    #     print("post 통신")
    #     password_change_form = PasswordChangeForm(request.user,request.POST)
    #     if password_change_form.is_valid():
    #         user = password_change_form.save()
    #         update_session_auth_hash(request, user)
    #         print("패스워드 변경됨")
    #         return redirect('/')
    if request.method == "POST":
        current_password = request.POST.get("origin_password")
        user = request.user
        if check_password(current_password, user.password):
            new_password = request.POST.get("password1")
            password_confirm = request.POST.get("password2")
            if new_password == password_confirm:
                user.set_password(new_password)
                user.save()
                print('비밀번호 변경이 완료되었습니다.')
                return redirect('/')
            else:
                print('비밀번호 변경 안됨')


def deletepage(request):
    return render(request, 'mypage/deletepage.html')


# 회원탈퇴
@login_required(login_url='/login')
def delete(request):
    if request.method == 'GET':
        request.user.delete()
        print("탈퇴 완료")
        return redirect('/')
    return render(request, 'mypage/info_change.html')

