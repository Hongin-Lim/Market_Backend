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
from django.urls import path

import board.views
from board import views

app_name = 'board'

urlpatterns = [
    path('', views.q_index, name='q_index'),
    path('<int:question_id>/', views.detail, name='detail'),
    path('answer/create/<int:question_id>/',views.answer_create, name='answer_create'),
    path('question/create/', views.question_create, name='question_create'),
    path('n/', views.n_index, name='n_index'),
    path('n/<int:notice_id>/', views.n_detail, name='n_detail'),
    path('answer2/create/<int:notice_id>/', views.n_answer_create, name='n_answer_create'),
    path('notice/create/', views.notice_create, name='notice_create'),

]
