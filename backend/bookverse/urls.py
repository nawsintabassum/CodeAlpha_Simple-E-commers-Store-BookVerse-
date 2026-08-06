"""
BookVerse Root URL Configuration
Includes Django Admin and Store App API routes.
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('store.urls')),
]