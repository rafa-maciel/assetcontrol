# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, redirect
from django.core.urlresolvers import reverse
from django.views.generic.edit import CreateView
from django.views.generic.list import ListView

from .models import Device
from .forms import DeviceForm


class DeviceCreateView(CreateView):
    form_class = DeviceForm
    template_name = 'devices/create.html'

    def get_success_url(self):
        return reverse('devices:list')


class DeviceListView(ListView):
    model = Device
    template_name = 'devices/list.html'
    context_object_name = 'devices'

