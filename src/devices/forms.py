from django.forms import ModelForm

from .models import Device, HistoryItem


class DeviceForm(ModelForm):
    class Meta:
        model = Device
        exclude = ['created']


class HistoryItemForm(ModelForm):
    class Meta:
        model = HistoryItem
        exclude = ['date']
