# WHAT: Converts Task objects to/from JSON
# WHY: Frontend speaks JSON, Python speaks objects - we need translation
# ADAPTIVE CONVERGENCE: This is auto-generated in advanced versions, but we're learning fundamentals

from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    """
    Serializer for Task model.
    
    This automatically creates JSON representations based on the model fields.
    Notice: We don't define each field manually - it reads from the model!
    """
    
    class Meta:
        model = Task  # WHAT: Which model to serialize
        fields = '__all__'  # WHAT: Include all fields from the model
        # Alternative: fields = ['id', 'title', 'completed']  # Only specific fields
        
        # OPTIONAL: Make fields read-only (can't be changed via API)
        read_only_fields = ['id', 'created_at', 'updated_at']