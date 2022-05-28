from django.contrib import admin

# Register your models here.
from .models import Question
from .models import Notice
from .models import N_comment
from. models import Answer
admin.site.register(Question)
admin.site.register(Notice)
admin.site.register(N_comment)
admin.site.register(Answer)
