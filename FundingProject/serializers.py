from rest_framework import serializers
from .models import Donation, Project, ProjectImage,Comment

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'owner', 'title', 'details', 'current_amount','total_target', 'start_date', 'end_date']
        read_only_fields = ['id', 'owner']

class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ['id', 'image', 'display_order']
        
class ProjectCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'user', 'content']
        
class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = ['id','amount','project','donor']
        read_only_fields = ['id', 'donor']
        
