from django.db import models
from django.contrib.auth.models import AbstractUser



class User(AbstractUser):
    u_id = models.CharField(max_length=200, verbose_name='아이디')  # user 아이디
    u_phonenum = models.CharField(max_length=200, verbose_name='전화번호')  # user 전화번호
    u_address = models.CharField(max_length=200, verbose_name='주소')  # user 주소
    SEX = (('f','female'), ('m', 'male'),('n','none'))
    u_sex = models.CharField(max_length=1, choices=SEX, null=True)  # user 성별
    birth_year = models.IntegerField(null=True)
    birth_month = models.IntegerField(null=True)
    birth_day = models.IntegerField(null=True)
