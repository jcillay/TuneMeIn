from django.shortcuts import redirect, render
from .credentials import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .util import update_or_create_user_tokens, is_spotify_authenticated

# Create your views here.

class AUTHURL(APIView):
    def get(self, request, format=None):
        # These scopes come from the spotify dev website
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'
        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID,
        }).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)
        
# # This function is what stores the tokens in a databse
# The function above is what gets those functions and authorizes them and then 
# it is stored here. We call the function imported from util.py because that is what 
# either creates or updates the token

def spotify_callback(request, format=None):
    # Authenticates user and checks if there is an error
    code = request.GET.get('code')
    error = request.GET.get('error')
    # This gets all the token and authenticates a user using the app
    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type' :'authorization_code',
        'code' : code,
        'redirect_uri' : REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret' : CLIENT_SECRET
    }).json()
    # If we get a response we should be able to get all of this information to use
    # and understand what users are using the app

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    if not request.session.exists(request.session.session_key):
            request.session.create()

    session_id = request.session.session_key
    update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token)
    # frontend: Will make redirect it 
    return redirect('frontend:')



class IsAuthenticated(APIView):
   
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(self.request.session.session_key)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)