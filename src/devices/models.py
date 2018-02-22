# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models


class Type(models.Model):
    name = models.CharField(max_length=40, null=False, blank=False)

    def __str__(self):
        return self.name


class Device(models.Model):
    serial_number = models.CharField(max_length=40, null=False, blank=False)
    tag = models.CharField(max_length=20, null=False, blank=True)
    model = models.CharField(max_length=30, null=False, blank=False)
    brand = models.CharField(max_length=30, null=False, blank=False)
    name = models.CharField(max_length=40, null=False, blank=False)
    type = models.ForeignKey(Type, related_name='devices', null=False)
    created = models.DateField(auto_created=True)

    def __str__(self):
        return '{} [model:{}]'.format(self.name, self.model)


class HistoryItem(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='history_itens')
    date = models.DateField(auto_created=True)
    title = models.CharField(max_length=140, null=False)
    description = models.TextField(blank=False)
    keywords = models.CharField(max_length=150, null=False, blank=True)

    def __str__(self):
        return self.title
