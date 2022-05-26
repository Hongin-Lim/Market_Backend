from django import forms
from shop.models import review

class ComForm(forms.ModelForm):
    class Meta:
        model=review
        fields=('contents','star')