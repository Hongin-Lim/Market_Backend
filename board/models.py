# from django.contrib.auth.models import User
# from django.db import models
#
# class Board(models.Model):
#     title       = models.CharField(max_length=200, verbose_name="제목")
#     contents    = models.TextField(verbose_name="내용")
#     writer      = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="작성자")
#     created_at  = models.DateTimeField(auto_now_add=True, verbose_name="작성일")
#     updated_at  = models.DateTimeField(auto_now=True, verbose_name="최종수정일")
#
#     def __str__(self):
#         return self.title
#
#     class Meta:
#         db_table            = 'boards'
#         verbose_name        = '게시판'
#         verbose_name_plural = '게시판'

# 'member.BoardMember',


from django.db import models

# Create your models here.
from config import settings
from users.models import User


class Question(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='author_question',null=True,default='')
    subject = models.CharField(max_length=200)
    content = models.TextField()
    create_date = models.DateTimeField(auto_now_add=True)
    modify_date = models.DateTimeField(null=True, blank=True)
    voter = models.ManyToManyField(User, related_name='voter_question')

    def __str__(self):
        return self.subject

class Notice(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='author_notice', null=True,default='')
    subject = models.CharField(max_length=200)
    content = models.TextField()
    create_date = models.DateTimeField(auto_now_add=True)
    modify_date = models.DateTimeField(null=True, blank=True)
    voter = models.ManyToManyField(User, related_name='voter_notice')

    def __str__(self):
        return self.subject

class Answer(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=True,default='')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    content = models.TextField()
    create_date = models.DateTimeField()
    modify_date = models.DateTimeField(null=True, blank=True)
    voter = models.ManyToManyField(User, related_name='voter_answer')

class Answer2(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=True,default='')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    content = models.TextField()
    create_date = models.DateTimeField()
    modify_date = models.DateTimeField(null=True, blank=True)
    voter = models.ManyToManyField(User, related_name='voter_answer2')


class Comment(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=True,default='')
    content = models.TextField()
    create_date = models.DateTimeField()
    modify_date = models.DateTimeField(null=True, blank=True)
    question = models.ForeignKey(Question, null=True, blank=True, on_delete=models.CASCADE)
    answer = models.ForeignKey(Answer, null=True, blank=True, on_delete=models.CASCADE)



class Board(models.Model):
    writer = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    contents = models.TextField()
    create_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'[{self.pk}]{self.title}'