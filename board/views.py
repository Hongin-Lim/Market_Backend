from django.http import HttpResponseNotAllowed
from django.shortcuts import render, get_object_or_404, redirect
from django.utils import timezone

from shop.models import Product
from .models import Question, Answer, Notice, N_comment
from .forms import QuestionForm, AnswerForm, N_commentForm, NoticeForm
from django.core.paginator import Paginator
from django.contrib.auth.decorators import login_required
from django.contrib import messages

def home(request):
    products = Product.objects.filter(available_display=True)
    return render(request, 'home/mainpage.html', {'products':products})

# 게시판 목록 출력
def index(request):
    question_list = Question.objects.order_by('-create_date')
    context = {'question_list': question_list}
    return render(request, 'board/question_list.html', context)

# 게시판 내용 출력
def detail(request, question_id):
    question = Question.objects.get(id=question_id)
    context = {'question': question}
    return render(request, 'board/question_detail.html', context)

# 답변 등록
@login_required(login_url='user:login')
def answer_create(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    if request.method == "POST":
        form = AnswerForm(request.POST)
        if form.is_valid():
            answer = form.save(commit=False)
            answer.author = request.user  # author 속성에 로그인 계정 저장
            answer.create_date = timezone.now()
            answer.question = question
            answer.save()
            return redirect('board:detail', question_id=question.id)
    else:
        return HttpResponseNotAllowed('Only POST is possible.')
    context = {'question': question, 'form': form}
    return render(request, 'board/question_detail.html', context)

# 질문 등록
@login_required(login_url='user:login')
def question_create(request):
    if request.method == 'POST':
        form = QuestionForm(request.POST) # request.POST에는 화면에서 사용자가 입력한 내용들이 담겨있다.
        if form.is_valid(): # 폼이 유효하다면
            question = form.save(commit=False) # 임시 저장하여 question 객체를 리턴받는다.
            question.author = request.user  # author 속성에 로그인 계정 저장
            question.create_date = timezone.now() # 실제 저장을 위해 작성일시를 설정한다.
            question.save()  # 데이터를 실제로 저장한다.
            return redirect('board:index')
    else:
        form = QuestionForm()
    context = {'form': form}
    return render(request, 'board/question_form.html', context)

# 페이징
def index(request):
    #입력인자
    page = request.GET.get('page', '1')  # 페이지
    #조회
    question_list = Question.objects.order_by('-create_date')
    #페이징처리
    paginator = Paginator(question_list, 10)  # 페이지당 10개씩 보여주기
    page_obj = paginator.get_page(page)
    context = {'question_list': page_obj} # question_list는 페이징 객체(page_obj)
    return render(request, 'board/question_list.html', context)

# 질문 수정
@login_required(login_url='common:login')
def question_modify(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    if request.user != question.author:
        messages.error(request, '수정권한이 없습니다')
        return redirect('board:detail', question_id=question.id)
    if request.method == "POST":
        form = QuestionForm(request.POST, instance=question)
        if form.is_valid():
            question = form.save(commit=False)
            question.modify_date = timezone.now()  # 수정일시 저장
            question.save()
            return redirect('board:detail', question_id=question.id)
    else:
        form = QuestionForm(instance=question)
    context = {'form': form}
    return render(request, 'board/question_form.html', context)

# 질문 삭제
@login_required(login_url='common:login')
def question_delete(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    if request.user != question.author:
        messages.error(request, '삭제권한이 없습니다')
        return redirect('board:detail', question_id=question.id)
    question.delete()
    return redirect('board:index')

# 답변 수정
@login_required(login_url='common:login')
def answer_modify(request, answer_id):
    answer = get_object_or_404(Answer, pk=answer_id)
    if request.user != answer.author:
        messages.error(request, '수정권한이 없습니다')
        return redirect('board:detail', question_id=answer.question.id)
    if request.method == "POST":
        form = AnswerForm(request.POST, instance=answer)
        if form.is_valid():
            answer = form.save(commit=False)
            answer.modify_date = timezone.now()
            answer.save()
            return redirect('board:detail', question_id=answer.question.id)
    else:
        form = AnswerForm(instance=answer)
    context = {'answer': answer, 'form': form}
    return render(request, 'board/answer_form.html', context)

# 답변 삭제
@login_required(login_url='common:login')
def answer_delete(request, answer_id):
    answer = get_object_or_404(Answer, pk=answer_id)
    if request.user != answer.author:
        messages.error(request, '삭제권한이 없습니다')
    else:
        answer.delete()
    return redirect('board:detail', question_id=answer.question.id)

#--------------------------------------------------------------------------
# 게시판 목록 출력
def n_index(request):
    notice_list = Notice.objects.order_by('-create_date')
    context = {'notice_list': notice_list}
    return render(request, 'board/notice_list.html', context)

# 게시판 내용 출력
def n_detail(request, notice_id):
    notice = Notice.objects.get(id=notice_id)
    context = {'notice': notice}
    return render(request, 'board/notice_detail.html', context)

# 답변 등록
@login_required(login_url='user:login')
def n_answer_create(request, notice_id):
    notice = get_object_or_404(Notice, pk=notice_id)
    if request.method == "POST":
        form = N_commentForm(request.POST)
        if form.is_valid():
            answer = form.save(commit=False)
            answer.author = request.user  # author 속성에 로그인 계정 저장
            answer.create_date = timezone.now()
            answer.question = notice
            answer.save()
            return redirect('board:n_detail', notice_id=notice.id)
    else:
        return HttpResponseNotAllowed('Only POST is possible.')
    context = {'notice': notice, 'form': form}
    print(notice)
    return render(request, 'board/notice_detail.html', context)

# 공지 등록
@login_required(login_url='user:login')
def n_question_create(request):
    if request.method == 'POST':
        form = NoticeForm(request.POST) # request.POST에는 화면에서 사용자가 입력한 내용들이 담겨있다.
        if form.is_valid(): # 폼이 유효하다면
            notice = form.save(commit=False) # 임시 저장하여 question 객체를 리턴받는다.
            notice.author = request.user  # author 속성에 로그인 계정 저장
            notice.create_date = timezone.now() # 실제 저장을 위해 작성일시를 설정한다.
            notice.save()  # 데이터를 실제로 저장한다.
            return redirect('board:n_index')
    else:
        form = NoticeForm()
    context = {'form': form}
    return render(request, 'board/notice_form.html', context)

# 페이징
def n_index(request):
    #입력인자
    page = request.GET.get('page', '1')  # 페이지
    #조회
    notice_list = Notice.objects.order_by('-create_date')
    #페이징처리
    paginator = Paginator(notice_list, 10)  # 페이지당 10개씩 보여주기
    page_obj = paginator.get_page(page)
    context = {'notice_list': page_obj} # notice_list는 페이징 객체(page_obj)
    return render(request, 'board/notice_list.html', context)

# 공지 수정
@login_required(login_url='common:login')
def n_question_modify(request, notice_id):
    notice = get_object_or_404(Notice, pk=notice_id)
    if request.user != notice.author:
        messages.error(request, '수정권한이 없습니다')
        return redirect('board:n_detail', notice_id=notice_id)
    if request.method == "POST":
        form = NoticeForm(request.POST, instance=notice)
        if form.is_valid():
            notice = form.save(commit=False)
            notice.modify_date = timezone.now()  # 수정일시 저장
            notice.save()
            return redirect('board:n_detail', notice_id=notice_id)
    else:
        form = NoticeForm(instance=notice)
    context = {'form': form}
    return render(request, 'board/notice_form.html', context)

# 공지 삭제
@login_required(login_url='common:login')
def n_question_delete(request, notice_id):
    notice = get_object_or_404(Notice, pk=notice_id)
    if request.user != notice.author:
        messages.error(request, '삭제권한이 없습니다')
        return redirect('board:detail', notice_id=notice.id)
    notice.delete()
    return redirect('board:n_index')

# 답변 수정
@login_required(login_url='common:login')
def n_answer_modify(request, n_comment_id):
    answer = get_object_or_404(N_comment, pk=n_comment_id)
    if request.user != answer.author:
        messages.error(request, '수정권한이 없습니다')
        return redirect('board:n_detail', n_answer_id=answer.notice.id)
    if request.method == "POST":
        form = N_commentForm(request.POST, instance=answer)
        if form.is_valid():
            n_comment = form.save(commit=False)
            n_comment.modify_date = timezone.now()
            n_comment.save()
            return redirect('board:n_detail', notice_id=n_comment.question.id)
    else:
        form = N_commentForm(instance=answer)
    context = {'answer': answer, 'form': form}
    return render(request, 'board/n_comment_form.html', context)

# 답변 삭제
@login_required(login_url='common:login')
def n_answer_delete(request, n_comment_id):
    n_answer = get_object_or_404(N_comment, pk=n_comment_id)
    if request.user != n_answer.author:
        messages.error(request, '삭제권한이 없습니다')
    else:
        n_answer.delete()
    return redirect('board:n_detail', notice_id=n_answer.question.id)


