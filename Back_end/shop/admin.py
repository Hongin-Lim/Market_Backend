from django.contrib import admin

from .models import *
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name','slug']
    prepopulated_fields = {'slug':('name',)}

admin.site.register(Category, CategoryAdmin)


class ProductAdmin(admin.ModelAdmin):
    list_display = ['category','name','slug','price','stock','available_display','available_order','created','updated']
    list_filter = ['available_display', 'created', 'updated', 'category']
    prepopulated_fields = {'slug':('name',)}
    list_editable = ['available_display','available_order','price','stock']

admin.site.register(Product,ProductAdmin)