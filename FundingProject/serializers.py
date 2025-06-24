from rest_framework import serializers
from .models import Donation, Project, ProjectImage,Comment, Category


# member 3
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'owner', 'title', 'details', 'current_amount','total_target', 'start_date', 'end_date', 'is_featured' , 'category']

#member 2
class ProjectImageSerializer(serializers.ModelSerializer):
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())
    class Meta:
        model = ProjectImage
        fields = [ 'image', 'display_order','project']
        
        
#member 4
class ProjectCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'user', 'content']
        
class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = ['id','amount','project','donor','created_at']
        read_only_fields = ['id', 'donor']
        

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id','name']

from rest_framework import serializers
from .models import Comment, Rating, Report

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = '__all__'

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'
