from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from config import settings

class Coupon(models.Model):
    code = models.CharField(max_length=50, unique=True)
    use_from = models.DateTimeField()
    use_to = models.DateTimeField()
    amount = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100000)])
    active = models.BooleanField()
    name = models.CharField(max_length=50, null=True)
    owner = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True )
    def __str__(self):
        return self.code