from django.urls import path
from .views import CreateRoomView, RoomView, GetRoom, JoinRoom, UserInRoom, UserLeavesRoom, UpdateRoom


urlpatterns = [
    path('room', RoomView.as_view()),
    path('create-room', CreateRoomView.as_view()),
    path('get-room', GetRoom.as_view()),
    path('join-room', JoinRoom.as_view()),
    path('user-in-room', UserInRoom.as_view()),
    path('leave-room', UserLeavesRoom.as_view()),
    path('update-room', UpdateRoom.as_view()),
    
]