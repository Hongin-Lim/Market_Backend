from .models import User
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm

class signupForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ['email','password2','password1','username','u_id','u_phonenum','u_address','u_sex','birth_year','birth_month','birth_day']

