from django.conf.urls import url

from . import views

app_name = 'devices'
urlpatterns = [
    url(r'^devices/create/$', views.DeviceCreateView.as_view(), name='create'),
    url(r'^devices/delete/$', views.DeviceDeleteAjaxView.as_view(), name='delete'),
    url(r'^devices/(?P<pk>[0-9]+)/$', views.DeviceUpdateView.as_view(), name='update'),
    url(r'^devices/details/(?P<pk>[0-9]+)/$', views.DeviceDetailView.as_view(), name='details'),
    url(r'(?P<pk>[0-9]+)/find-history-items$', views.FindHistoryItemsAjaxView.as_view(), name='find-history-items'),
    url(r'^devices/$', views.DeviceListView.as_view(), name='list'),
    url(r'^devices/item/create/$', views.HistoryItemAjaxCreateView.as_view(), name='item-create'),
    url(r'^devices/item/update/$', views.HistoryItemAjaxUpdateView.as_view(), name='item-update'),
    url(r'^devices/item/delete/$', views.HistoryItemDeleteAjaxView.as_view(), name='item-delete'),
    url(r'^devices/item/details/(?P<pk>[0-9]+)$', views.HistoryItemDetailAjaxView.as_view(), name='item-details'),
    url(r'^devices/type/create', views.TypeAjaxCrateView.as_view(), name='type-create'),
]
