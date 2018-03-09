# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, redirect
from django.core.urlresolvers import reverse, reverse_lazy
from django.views.generic.edit import CreateView, UpdateView
from django.views.generic.list import ListView
from django.views import View
from django.views.generic.detail import DetailView
from django.http import JsonResponse
from django.core import serializers

from .models import Device, HistoryItem, Type
from .forms import DeviceForm, HistoryItemForm


class DeviceCreateView(CreateView):
    form_class = DeviceForm
    template_name = 'devices/form.html'

    def get_success_url(self):
        return reverse('devices:list')


class DeviceUpdateView(UpdateView):
    model = Device
    form_class = DeviceForm
    template_name = 'devices/form.html'

    def get_success_url(self):
        return reverse('devices:list')


class DeviceListView(ListView):
    model = Device
    template_name = 'devices/list.html'
    context_object_name = 'devices'


class DeviceDetailView(DetailView):
    model = Device
    template_name = 'devices/detail.html'
    context_object_name = 'device'


class HistoryItemAjaxCreateView(View):
    def post(self, request):
        if request.POST and request.is_ajax():
            form = HistoryItemForm(request.POST)
            item = form.save()
            json_data_response = {
                'title': item.title,
                'date': item.date.strftime("%d/%m/%Y"),
                'description': item.description,
                'keywords': item.keywords
            }

            return JsonResponse(json_data_response)


class TypeAjaxCrateView(View):

    def post(self, request):
        if request.POST and request.is_ajax():
            name = request.POST.get('name', None);
            if name:
                type = Type.objects.create(name=name)
                json_data_response = {
                    'pk': type.pk,
                    'name': type.name
                }

                return JsonResponse(json_data_response)
