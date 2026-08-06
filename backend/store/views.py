"""
BookVerse - Django REST API Views
Handles user authentication, catalog retrieval, cart submission, and order history.
"""

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import Book, Category, Order, OrderItem


# --------------------------------------------------------------------------
# 1. AUTHENTICATION VIEWS
# --------------------------------------------------------------------------

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """Registers a new customer user."""
    data = request.data
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already registered.'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    token, _ = Token.objects.get_or_create(user=user)

    return Response({
        'token': token.key,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """Authenticates user and returns access token."""
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff
        }
    }, status=status.HTTP_200_OK)


# --------------------------------------------------------------------------
# 2. CATALOG VIEWS
# --------------------------------------------------------------------------

@api_view(['GET'])
@permission_classes([AllowAny])
def list_books(request):
    """Retrieves all books with optional category filtering."""
    category = request.query_params.get('category')
    search = request.query_params.get('search')

    books = Book.objects.all()

    if category and category != 'All':
        books = books.filter(category__name__iexact=category)

    if search:
        books = books.filter(title__icontains=search) | books.filter(author__icontains=search)

    data = [{
        'id': book.id,
        'title': book.title,
        'author': book.author,
        'category': book.category.name,
        'price': str(book.price),
        'image': book.image_url,
        'featured': book.is_featured,
        'bestseller': book.is_bestseller
    } for book in books]

    return Response(data)


@api_view(['GET'])
@permission_classes([AllowAny])
def book_detail(request, pk):
    """Retrieves single book details."""
    try:
        book = Book.objects.get(pk=pk)
        return Response({
            'id': book.id,
            'title': book.title,
            'author': book.author,
            'category': book.category.name,
            'price': str(book.price),
            'stock': book.stock,
            'description': book.description,
            'image': book.image_url
        })
    except Book.DoesNotExist:
        return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)


# --------------------------------------------------------------------------
# 3. ORDER PROCESSING VIEWS
# --------------------------------------------------------------------------

@api_view(['POST'])
@permission_classes([AllowAny])
def create_order(request):
    """Processes checkout and records order into DB."""
    data = request.data
    items = data.get('items', [])

    if not items:
        return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

    user = request.user if request.user.is_authenticated else None

    order = Order.objects.create(
        user=user,
        full_name=data.get('fullName'),
        email=data.get('email'),
        phone=data.get('phone'),
        shipping_address=data.get('address'),
        city=data.get('city'),
        zip_code=data.get('zipCode'),
        total_amount=data.get('totalAmount'),
        payment_method='Cash on Delivery'
    )

    for item in items:
        try:
            book = Book.objects.get(id=item['id'])
            OrderItem.objects.create(
                order=order,
                book=book,
                price=item['price'],
                quantity=item['quantity']
            )
        except Book.DoesNotExist:
            continue

    return Response({'message': 'Order placed successfully', 'order_id': order.id}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_orders(request):
    """Retrieves order history for authenticated user."""
    orders = Order.objects.filter(user=request.user)
    data = [{
        'id': order.id,
        'total': str(order.total_amount),
        'status': order.status,
        'date': order.created_at.strftime("%Y-%m-%d %H:%M")
    } for order in orders]

    return Response(data)