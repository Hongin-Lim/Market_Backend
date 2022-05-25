from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404
from .models import *
from cart.forms import AddProductForm
from shop.forms import ComForm
from django.db.models import Q


def product_in_category(request, category_slug=None):
    current_category = None
    categories = Category.objects.all()
    products = Product.objects.filter(available_display=True)

    if category_slug:
        current_category = get_object_or_404(Category, slug=category_slug)
        products = products.filter(category=current_category)

    return render(request, 'shop/list.html', {'current_category':current_category, 'categories':categories, 'products':products})

def product_detail(request, id, product_slug=None):
    product = get_object_or_404(Product, id=id, slug=product_slug)
    products = Product.objects.filter(available_display=True)
    add_to_cart = AddProductForm(initial={'quantity':1})
    cmts = comment.objects.filter(Q(product_id=id))
    return render(request, 'shop/detail.html', {'product':product, 'add_to_cart':add_to_cart,'products':products, 'cmts':cmts})



@login_required(login_url='/login')
def add_comment(request, id,product_slug=None):
    product = get_object_or_404(Product, id=id, slug=product_slug)
    products = Product.objects.filter(available_display=True)
    cmts = comment.objects.filter(Q(product_id=id))
    add_to_cart = AddProductForm(initial={'quantity': 1})
    if request.method == 'GET':
        print("GET")
        return render(request, 'shop/detail.html',{'product': product, 'add_to_cart': add_to_cart, 'products': products, 'cmts':cmts})
    # 같은 화면 내에 댓글+평점 창도 있으니깐, 그때는 post
    # 기존에 생성되어있는 리뷰 목록 보여져야 됨 (상품id 외래키로 하는 리뷰 모두 출력)
    elif request.method == 'POST':
        print("POST")
        comform = ComForm(request.POST)
        if comform.is_valid():
            print("VALID")
            cmt = comform.save(commit=False)
            cmt.user_id = request.user.id
            cmt.product_id = id
            cmt.save()
        return render(request, 'shop/detail.html', {'product':product, 'add_to_cart':add_to_cart,'products':products, 'cmts':cmts})
