from django import forms
from .models import Board

class BoardForm(forms.ModelForm) :
    class Meta :
        model = Board
        fields = ('title', 'contents','writer')


from django import forms

from board.models import Question, Answer, Comment, Notice, Answer2


class QuestionForm(forms.ModelForm):
    class Meta:
        model = Question
        fields = ['subject', 'content']
        labels = {
            'subject': '제목',
            'content': '내용',
        }
        # widgets = {
        #     'subject' : forms.TextInput(attrs={'class':'form-control'}),
        #     'content' : forms.Textarea(attrs={'class':'form-control', 'rows':10}),
        # }

class NoticeForm(forms.ModelForm):
    class Meta:
        model = Notice
        fields = ['subject', 'content']
        labels = {
            'subject': '제목',
            'content': '내용',
        }
        # widgets = {
        #     'subject' : forms.TextInput(attrs={'class':'form-control'}),
        #     'content' : forms.Textarea(attrs={'class':'form-control', 'rows':10}),
        # }

class AnswerForm(forms.ModelForm):
    class Meta:
        model = Answer
        fields = ['content']
        labels = {
            'content': '답변내용',
        }

class AnswerForm2(forms.ModelForm):
    class Meta:
        model = Answer2
        fields = ['content']
        labels = {
            'content': '답변내용',
        }


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['content']
        labels = {
            'content': '댓글내용',
        }