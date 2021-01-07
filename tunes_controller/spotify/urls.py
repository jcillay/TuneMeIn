from django.urls import path 

from .views import AUTHURL, spotify_callback

urlpatterns = [
    path('get-auth-url', AUTHURL.as_view()),
    path('redirect', spotify_callback)
]