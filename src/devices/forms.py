from django.forms import ModelForm
from django import forms

from .models import Device, HistoryItem


class DeviceForm(ModelForm):
    class Meta:
        model = Device
        exclude = ['created']


class HistoryItemForm(ModelForm):
    # pk = forms.IntegerField()
    class Meta:
        model = HistoryItem
        exclude = ['date']
