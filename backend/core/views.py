# WHAT: API endpoints that handle HTTP requests
# WHY: Frontend needs URLs to fetch/create/update/delete data
# IMPROVEMENT: Added detailed error logging

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .models import Task
from .serializers import TaskSerializer
import logging

# Set up logging to see errors clearly
logger = logging.getLogger(__name__)

class TaskViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Task model with improved error handling
    """
    
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    
    def list(self, request):
        """GET /api/tasks/ - Returns all tasks"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'count': queryset.count(),
            'results': serializer.data
        })
    
    def create(self, request):
        """POST /api/tasks/ - Creates a new task"""
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        # Log the error for debugging
        logger.error(f"Task creation failed: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, pk=None):
        """PUT /api/tasks/{id}/ - Updates a task"""
        try:
            task = self.get_object()
        except Task.DoesNotExist:
            return Response(
                {'error': 'Task not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # IMPORTANT: partial=True allows partial updates
        serializer = self.get_serializer(task, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            logger.info(f"Task {pk} updated successfully")
            return Response(serializer.data)
        
        # Log detailed error information
        logger.error(f"Task update failed for id {pk}")
        logger.error(f"Received data: {request.data}")
        logger.error(f"Validation errors: {serializer.errors}")
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def partial_update(self, request, pk=None):
        """PATCH /api/tasks/{id}/ - Partially updates a task"""
        return self.update(request, pk)

    def destroy(self, request, pk=None):
        """DELETE /api/tasks/{id}/ - Deletes a task"""
        try:
            task = self.get_object()
            task_id = task.id
            task.delete()
            
            logger.info(f"Task {task_id} deleted successfully")
            
            # Return JSON instead of empty response
            return Response(
                {'success': True, 'message': 'Task deleted successfully'},
                status=status.HTTP_200_OK  # Use 200 instead of 204
            )
        except Task.DoesNotExist:
            return Response(
                {'error': 'Task not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )