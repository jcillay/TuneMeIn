from django.urls import path 

from .views import AUTHURL

urlpatterns = [
    path('get-auth-url', AUTHURL.as_view()),
]