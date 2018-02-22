from django.conf.urls import url

from . import views

app_name = 'devices'
urlpatterns = [
    url(r'^devices/create/$', views.DeviceCreateView.as_view(), name='create'),
    url(r'^devices/$', views.DeviceListView.as_view(), name='list'),
]
