from rest_framework import serializers
from .models import Tenant, User, Product, Order, OrderItem
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
import uuid

class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = ['id', 'name', 'store_name', 'contact_email', 'contact_phone', 
                  'domain', 'subdomain', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    tenant_id = serializers.IntegerField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name', 
                  'last_name', 'phone', 'address', 'role', 'tenant_id']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        try:
            tenant = Tenant.objects.get(id=attrs['tenant_id'])
        except Tenant.DoesNotExist:
            raise serializers.ValidationError({"tenant_id": "Invalid tenant ID."})
        
        attrs['tenant'] = tenant
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        tenant = validated_data.pop('tenant')
        validated_data.pop('tenant_id')
        
        user = User.objects.create_user(tenant=tenant, **validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(source='tenant.store_name', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                  'phone', 'address', 'role', 'tenant', 'tenant_name']
        read_only_fields = ['id', 'tenant']


class ProductSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'stock', 'category', 
                  'image_url', 'is_active', 'created_by', 'created_by_username', 
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['tenant'] = request.user.tenant
        validated_data['created_by'] = request.user
        return super().create(validated_data)


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price', 'subtotal']
        read_only_fields = ['id', 'price', 'subtotal']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    customer_name = serializers.CharField(source='customer.get_full_name', read_only=True)
    assigned_staff_name = serializers.CharField(source='assigned_staff.get_full_name', read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'order_number', 'customer', 'customer_name', 'status', 
                  'total_amount', 'shipping_address', 'notes', 'assigned_staff', 
                  'assigned_staff_name', 'items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'order_number', 'customer', 'total_amount', 'created_at', 'updated_at']

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        request = self.context.get('request')
        
        # Set tenant and customer automatically
        validated_data['tenant'] = request.user.tenant
        validated_data['customer'] = request.user
        
        validated_data['order_number'] = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        
        # calculating total
        total = 0
        for item_data in items_data:
            product = item_data['product']
            quantity = item_data['quantity']
            
            # stock check
            if product.stock < quantity:
                raise serializers.ValidationError(
                    f"Insufficient stock for {product.name}. Available: {product.stock}"
                )
            
            item_data['price'] = product.price
            total += product.price * quantity
        
        validated_data['total_amount'] = total
        
        order = Order.objects.create(**validated_data)
        
        for item_data in items_data:
            product = item_data['product']
            quantity = item_data['quantity']
            
            OrderItem.objects.create(order=order, **item_data)
            
            product.stock -= quantity
            product.save()
        
        return order

    def update(self, instance, validated_data):
        validated_data.pop('items', None)
        validated_data.pop('customer', None)
        
        return super().update(instance, validated_data)

class OrderListSerializer(serializers.ModelSerializer):
    """Simplified serializer for order listing"""
    customer_name = serializers.CharField(source='customer.get_full_name', read_only=True)
    items_count = serializers.IntegerField(source='items.count', read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'order_number', 'customer_name', 'status', 'total_amount', 
                  'items_count', 'created_at']
