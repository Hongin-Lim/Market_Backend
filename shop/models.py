from django.db import models
from django.shortcuts import resolve_url
from django.urls import reverse
from users.models import User
# from django.shortcuts import resolve_url
# Create your models here.
# Category - 중첩, 레벨이 있게
# from ckeditor_uploader.fields import RichTextUploadingField

class Category(models.Model):
    # parent_category = models.ForeignKey('self', on_delete=models.SET_NULL, blank=True, null=True, related_name='sub_categories')
    name = models.CharField(max_length=200)
    meta_description = models.TextField(blank=True)
    slug = models.SlugField(max_length=200, allow_unicode=True, unique=True)
    # image = models.ImageField(upload_to='category_images/%Y/%m/%d', blank=True)
    # description = RichTextUploadingField(blank=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']
        verbose_name = 'category'
        verbose_name_plural = 'categories'

    def get_absolute_url(self):
        return reverse('shop:product_detail', args=[self.id, self.slug])

class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, blank=True, null=True, related_name='products')
    name = models.CharField(max_length=200, db_index=True)
    slug = models.SlugField(max_length=200, db_index=True, allow_unicode=True, unique=True)
    image = models.ImageField(upload_to='product_images/%Y/%m/%d', blank=True)
    description = models.TextField(blank=True)
    meta_description = models.TextField(blank=True)
    price = models.FloatField(max_length=10)
    stock = models.PositiveIntegerField()
    available_display = models.BooleanField('Display', default=True)
    available_order = models.BooleanField('Order', default=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateField(auto_now=True)

    class Meta:
        ordering = ['-created']
        index_together = [['id','slug']]

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('shop:product_detail', args=[self.id, self.slug])


class comment(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    contents=models.TextField()
    star=models.IntegerField()
    create_date = models.DateTimeField(auto_now_add=True)
    product=models.ForeignKey(Product,on_delete=models.CASCADE)