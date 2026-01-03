# WHAT: URL routing for core app
# WHY: Maps URLs to views (like a phone directory)

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet

# WHAT: Router automatically creates URL patterns for ViewSets
# WHY: Instead of manually defining 5 URLs, router does it automatically
router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

# This creates:
# GET    /api/tasks/       → list()
# POST   /api/tasks/       → create()
# GET    /api/tasks/{id}/  → retrieve()
# PUT    /api/tasks/{id}/  → update()
# DELETE /api/tasks/{id}/  → destroy()

urlpatterns = [
    path('', include(router.urls)),
]