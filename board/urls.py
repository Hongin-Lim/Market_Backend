from django.urls import path

from . import views

app_name = 'board'

urlpatterns = [
    path('', views.index, name='index'),
    path('<int:question_id>/', views.detail, name='detail'),
    path('answer/create/<int:question_id>/', views.answer_create, name='answer_create'),
    path('question/create/', views.question_create, name='question_create'),
    path('question/modify/<int:question_id>/', views.question_modify, name='question_modify'),
    path('question/delete/<int:question_id>/', views.question_delete, name='question_delete'),
    path('answer/modify/<int:answer_id>/', views.answer_modify, name='answer_modify'),
    path('answer/delete/<int:answer_id>/', views.answer_delete, name='answer_delete'),

    path('n/', views.n_index, name='n_index'),
    path('n/<int:notice_id>/', views.n_detail, name='n_detail'),
    path('n_answer/create/<int:notice_id>/', views.n_answer_create, name='n_answer_create'),
    path('notice/create/', views.n_question_create, name='notice'),
    path('notice/modify/<int:notice_id>/', views.n_question_modify, name='notice_modify'),
    path('notice/delete/<int:notice_id>/', views.n_question_delete, name='notice_delete'),
    path('n_answer/modify/<int:n_comment_id>/', views.n_answer_modify, name='n_answer_modify'),
    path('n_answer/delete/<int:n_comment_id>/', views.n_answer_delete, name='n_answer_delete'),
]