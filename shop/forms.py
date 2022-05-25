from django import forms
from shop.models import comment

class ComForm(forms.ModelForm):
    class Meta:
        model=comment
        fields=('contents','star')