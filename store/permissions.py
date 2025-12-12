from rest_framework import permissions

class IsTenantUser(permissions.BasePermission):
    # to check is user belongs to the tenant
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if hasattr(request, 'tenant') and request.tenant:
            return request.user.tenant == request.tenant
        return True


class IsStoreOwner(permissions.BasePermission):
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'store_owner'


class IsStoreOwnerOrStaff(permissions.BasePermission):
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['store_owner', 'staff']


class IsStaffOrReadOnly(permissions.BasePermission):
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role in ['store_owner', 'staff']


class CanManageOrder(permissions.BasePermission):
    
    def has_object_permission(self, request, view, obj):
        user = request.user
        
        # owner can manage all orders
        if user.role == 'store_owner':
            return True
        
        # staff can manage assigned orders only
        if user.role == 'staff':
            return obj.assigned_staff == user or request.method in permissions.SAFE_METHODS
        
        # customers to check about their orders only
        if user.role == 'customer':
            return obj.customer == user and request.method in permissions.SAFE_METHODS
        
        return False