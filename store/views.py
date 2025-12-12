
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db.models import Q
from .models import Tenant, User, Product, Order
from .serializers import (
    TenantSerializer, UserRegistrationSerializer, UserSerializer,
    ProductSerializer, OrderSerializer, OrderListSerializer
)
from .permissions import (
    IsTenantUser, IsStoreOwner, IsStoreOwnerOrStaff, 
    IsStaffOrReadOnly, CanManageOrder
)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom JWT serializer to include tenant_id and role"""
    
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add custom claims
        data['tenant_id'] = self.user.tenant.id
        data['tenant_name'] = self.user.tenant.store_name
        data['role'] = self.user.role
        data['user_id'] = self.user.id
        data['username'] = self.user.username
        
        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims to token
        token['tenant_id'] = user.tenant.id
        token['role'] = user.role
        token['username'] = user.username
        
        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

#  user 
class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer

# tenant
class TenantViewSet(viewsets.ModelViewSet):
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not self.request.user.is_superuser:
            return Tenant.objects.filter(id=self.request.user.tenant.id)
        return Tenant.objects.all()

# product
class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsTenantUser, IsStaffOrReadOnly]

    # different query or filters
    def get_queryset(self):

        tenant = self.request.user.tenant
        queryset = Product.objects.filter(tenant=tenant)
        
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )
        
        return queryset

    @action(detail=False, methods=['get'])
    def categories(self, request):
        """Get all product categories"""
        tenant = request.user.tenant
        categories = Product.objects.filter(tenant=tenant).values_list('category', flat=True).distinct()
        return Response({'categories': list(categories)})

# orders
class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsTenantUser, CanManageOrder]

    def get_serializer_class(self):
        if self.action == 'list':
            return OrderListSerializer
        return OrderSerializer

    # query and filters
    def get_queryset(self):
        user = self.request.user
        tenant = user.tenant
        
        queryset = Order.objects.filter(tenant=tenant).select_related(
            'customer', 'assigned_staff'
        ).prefetch_related('items__product')
        
        if user.role == 'customer':
            queryset = queryset.filter(customer=user)
        elif user.role == 'staff':
            queryset = queryset.filter(
                Q(assigned_staff=user) | Q(status='pending')
            )

        status_param = self.request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        return queryset

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=True, methods=['post'])
    def assign_staff(self, request, pk=None):
        """Assign staff to an order (store owner only)"""
        if request.user.role != 'store_owner':
            return Response(
                {'error': 'Only store owners can assign staff'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        order = self.get_object()
        staff_id = request.data.get('staff_id')
        
        try:
            staff = User.objects.get(
                id=staff_id, 
                tenant=request.user.tenant, 
                role='staff'
            )
            order.assigned_staff = staff
            order.save()
            
            serializer = self.get_serializer(order)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response(
                {'error': 'Staff member not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update order status"""
        order = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(Order.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = new_status
        order.save()
        
        serializer = self.get_serializer(order)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_orders(self, request):
        """Get current user's orders"""
        queryset = Order.objects.filter(
            tenant=request.user.tenant,
            customer=request.user
        ).order_by('-created_at')
        
        serializer = OrderListSerializer(queryset, many=True)
        return Response(serializer.data)