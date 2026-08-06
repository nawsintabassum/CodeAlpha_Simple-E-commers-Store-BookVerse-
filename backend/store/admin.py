"""
BookVerse - Django Admin Configuration
Provides full admin panel management for Books, Categories, Orders, and Users.
"""

from django.contrib import admin
from .models import Category, Book, Order, OrderItem


# Inline configuration to view items directly inside an order
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('book', 'price', 'quantity')


# Admin setup for Categories
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)


# Admin setup for Books
@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'price', 'stock', 'is_featured', 'is_bestseller')
    list_filter = ('category', 'is_featured', 'is_bestseller', 'created_at')
    search_fields = ('title', 'author', 'isbn')
    list_editable = ('price', 'stock', 'is_featured', 'is_bestseller')
    ordering = ('-created_at',)


# Admin setup for Orders
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'full_name', 'email', 'total_amount', 'payment_method', 'status', 'created_at')
    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = ('full_name', 'email', 'phone', 'id')
    list_editable = ('status',)
    inlines = [OrderItemInline]
    readonly_fields = ('created_at',)


# Admin setup for Order Items
@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'book', 'price', 'quantity')
    list_filter = ('order__status',)