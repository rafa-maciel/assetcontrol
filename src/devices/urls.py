from django.conf.urls import url

from . import views

app_name = 'devices'
urlpatterns = [
    url(r'^devices/create/$', views.DeviceCreateView.as_view(), name='create'),
    url(r'^devices/(?P<pk>[0-9]+)/$', views.DeviceUpdateView.as_view(), name='update'),
    url(r'^devices/details/(?P<pk>[0-9]+)/$', views.DeviceDetailView.as_view(), name='details'),
    url(r'^devices/$', views.DeviceListView.as_view(), name='list'),
    url(r'^devices/item/create/$', views.HistoryItemAjaxCreateView.as_view(), name='item-create'),
    url(r'^devices/type/create', views.TypeAjaxCrateView.as_view(), name='type-create'),
]
