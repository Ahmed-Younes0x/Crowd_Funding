from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path

urlpatterns = [
    path('api/gettoken', TokenObtainPairView.as_view()),
    path('api/reftoken', TokenRefreshView.as_view()),
]
