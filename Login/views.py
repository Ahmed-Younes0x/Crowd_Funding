from django.shortcuts import render
from .models import Custom_User
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
# Create your views here.
@api_view(["POST"])
@csrf_exempt
def verf(request):
    email=request.POST['email']
    token=request.POST['token']
    user=Custom_User.objects.get(email=email)
    if user.is_active:
            return Response(data=request.POST['email'],status=403)
    if user.token==token:
        user.is_active=True
        user.save()
        return Response(data=request.POST['email'],status=200)
    
@api_view(['GET'])
@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def test():
    return Response(status=200,data='noice')

@api_view(["POST"])
def register(request):
    if Custom_User.objects.get(email=request.data['email']):
            return Response(data='email already exist',status=406)
    Custom_User.objects.create_user(email=request.data['email'],password=request.data['password'],username=request.data['username'])
    return Response(data=request.data['email'],status=201)