from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'owner', 'title', 'details', 'total_target', 'start_date', 'end_date']
        read_only_fields = ['id', 'owner']
