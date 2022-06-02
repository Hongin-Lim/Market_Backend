"""config URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
import board.views
import users.views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', board.views.home),
    path('popup/popup1.html', board.views.popup),
    path('popup/event1.html', board.views.popup1),
    path('popup/event2.html', board.views.popup2),
    path('popup/event3.html', board.views.popup3),

    path('board/', include('board.urls')),
    path('accounts/', include('allauth.urls')),
    path('login/', users.views.userlogin),
    path('logout/', users.views.userlogout),
    path('kakao_logout', users.views.kakao_logout),
    path('signup/', users.views.signup),

    path('mypage/', include('users.urls')),
    path('board/', include('board.urls')),
    path('cart/', include('cart.urls')),
    path('coupon/', include('coupon.urls')),
    path('order/', include('order.urls')),
    path('shop/', include('shop.urls')),



    # path('question/', board.views.q_index, name='q_index'),
    # path('question/<int:question_id>', board.views.detail, name='detail'),
    # path('answer/create/<int:question_id>', board.views.answer_create, name='answer_create'),


]
