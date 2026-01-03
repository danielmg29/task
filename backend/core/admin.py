# WHAT: Registers models with Django admin interface
# WHY: Lets us manage data through a web interface

from django.contrib import admin
from .models import Task

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    """
    Configuration for how Tasks appear in admin interface
    """
    # WHAT: Columns to display in the list view
    list_display = ['title', 'completed', 'created_at']
    
    # WHAT: Filters in the sidebar
    list_filter = ['completed', 'created_at']
    
    # WHAT: Enable search
    search_fields = ['title', 'description']