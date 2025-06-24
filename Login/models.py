from django.utils import timezone
from datetime import timedelta
from django.db import models
from django.contrib.auth.models import AbstractBaseUser , BaseUserManager , PermissionsMixin ,AbstractUser , User

from Login.email_verf import send_verification_email
# Create your models here.
class CustomerUserManager(BaseUserManager):
    def _create_user(self, email,phone, password,token, **extra_fields):
        if not email:
            raise ValueError('wrong email')
        self.normalize_email(email)
        user = self.model(email=email, phone=phone,token=token,**extra_fields)
        print('started',user.email,email)
        user.set_password(password)
        user.save(using=self._db)
        
    def create_user(self, email, password=None,phone=None , **extra_fields):
        extra_fields.setdefault('is_staff',False)
        extra_fields.setdefault('is_superuser',False)
        token=send_verification_email(email)
        return self._create_user(email, phone if phone else '101', password,token,  **extra_fields)
    def create_superuser(self, email, password=None,phone=None , **extra_fields):
        extra_fields.setdefault('is_staff',True)
        extra_fields.setdefault('is_superuser',True)
        extra_fields.setdefault('is_active',True)
        return self._create_user(email, phone=phone if phone else '100', password=password,token=None,  **extra_fields)
    
class Custom_User(AbstractUser,PermissionsMixin):
    username=models.CharField(max_length=100,null=True)
    first_name=models.CharField(max_length=100,default='',null=True)
    last_name=models.CharField(max_length=100,default='',null=True)
    email=models.EmailField(unique=True)
    id=models.AutoField(primary_key=True)
    phone=models.IntegerField(default=0)
    profile_image=models.ImageField(upload_to='users_images/')
    token=models.CharField(max_length=20,default='',null=True)
    token_expiry_date=models.DateTimeField(default=timezone.now() + timedelta(days=1))
    is_active=models.BooleanField(default=False)
    is_superuser=models.BooleanField(default=False)
    is_staff=models.BooleanField(default=False)
    
    date_joined=models.DateTimeField(auto_now_add=True)
    last_login=models.DateTimeField(auto_now=True)
    
    EMAIL_FIELD='email'
    USERNAME_FIELD='email'
    
    REQUIRED_FIELDS=[]
    objects = CustomerUserManager()
    
    def get_short_name(self):
        return super().get_short_name()
    
    def get_full_name(self):
        return super().get_full_name()
    
    def refresh_token(self,token):
        self.token=token
        self.token_expiry_date = timezone.now() + timedelta(days=1)
        self.save()
        return token
    
    def __str__(self):
        return self.email