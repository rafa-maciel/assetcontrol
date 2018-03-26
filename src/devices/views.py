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
from .utils import serialize_history_item


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

    def get_context_data(self, **kwargs):
        context = super(DeviceDetailView, self).get_context_data(**kwargs)
        max_items = self.request.GET.get("maxitems", None)
        if max_items is None:
            max_items = 3

        context['items_filtered'] = HistoryItem.objects.filter(device=self.object).order_by('-date')[:max_items]

        return context


class HistoryItemAjaxCreateView(View):
    def post(self, request):
        if request.POST and request.is_ajax():
            form = HistoryItemForm(request.POST)
            item = form.save(commit=False)
            item.save()

            json_data_response = serialize_history_item(item)
            json_data_response['success_message'] = 'Item has been created with success'

            return JsonResponse(json_data_response)


class HistoryItemAjaxUpdateView(View):
    def post(self, request):
        if request.POST and request.is_ajax():
            form = HistoryItemForm(request.POST)
            if form.data["pk"]:
                item = form.save(commit=False)
                item.pk = form.data["pk"]
                item.save(update_fields=['title', 'description', 'keywords'])

                json_data_response = serialize_history_item(item)
                json_data_response['success_message'] = 'Item has been updated with success'
            else:
                json_data_response = {
                    'error_message': 'Item not found!'
                }

            return JsonResponse(json_data_response)


class TypeAjaxCrateView(View):

    def post(self, request):
        if request.POST and request.is_ajax():
            name = request.POST.get('name', None)
            if name:
                type = Type.objects.create(name=name)
                json_data_response = {
                    'pk': type.pk,
                    'name': type.name
                }

                return JsonResponse(json_data_response)


class FindHistoryItemsAjaxView(View):
    def get(self, request, **kwargs):
        min = request.GET.get('min', None)
        max = request.GET.get("max", None)
        device_pk = kwargs.get('pk')

        json_data_response = []

        if min and max and device_pk:
            items = HistoryItem.objects.filter(device=device_pk).order_by("-date")[min:max]
            for item in items:
                json_data_response.append(serialize_history_item(item))

        return JsonResponse(json_data_response, safe=False)


class HistoryItemDetailAjaxView(View):
    def get(self, request, **kwargs):
        pk = kwargs.get('pk')
        item = HistoryItem.objects.get(pk=pk)
        json_data_response = serialize_history_item(item)

        return JsonResponse(json_data_response)


class HistoryItemDeleteAjaxView(View):
    def post(self, request):
        if request.POST and request.is_ajax():
            pk = request.POST.get("pk", None)
            if pk:
                HistoryItem.objects.get(pk=pk).delete()

                return JsonResponse({'response': 'ok'})