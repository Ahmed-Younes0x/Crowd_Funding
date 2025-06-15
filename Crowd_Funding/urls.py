"""
URL configuration for Crowd_Funding project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib import admin
from django.urls import path,include

from FundingProject.views import get_projects, list_user_projects, create_project, get_project, update_project, delete_project, search_projects_by_date
from Login.views import getuser


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('Login.urls')),
    path('admin/', admin.site.urls),
    path('api/user/<int:code>', getuser, name='getuser'),
    path('api/projects/', get_projects, name='get_projects'),
    path('api/projects/user/', list_user_projects, name='list_user_projects'),
    path('api/projects/create/', create_project, name='create_project'),
    path('api/projects/<int:code>/', get_project, name='get_project'),
    path('api/projects/update/<int:code>/', update_project, name='edit_project'),
    path('api/projects/delete/<int:code>/', delete_project, name='delete_project'),
    path('api/projects/search/', search_projects_by_date, name='search_projects_by_date'),
]
