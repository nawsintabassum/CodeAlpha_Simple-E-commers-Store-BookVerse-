"""
BookVerse Store App API Route Definitions
Maps endpoint paths to corresponding views for Auth, Catalog, and Orders.
"""

from django.urls import path
from . import views

urlpatterns = [
   
    path('auth/register/', views.register_user, name='register_user'),
    path('auth/login/', views.login_user, name='login_user'),

    path('books/', views.list_books, name='list_books'),
    path('books/<int:pk>/', views.book_detail, name='book_detail'),


    path('orders/create/', views.create_order, name='create_order'),
    path('orders/history/', views.user_orders, name='user_orders'),
]