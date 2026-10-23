from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.views import APIView


class IsLearner(BasePermission):
    """
    Allows access only to authenticated users who have the LEARNER role.
    Rights are strictly enforced on the server.
    """

    message = 'Access restricted to learners only.'

    def has_permission(self, request: Request, view: APIView) -> bool:
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_active
            and request.user.is_learner
        )


class IsInstructor(BasePermission):
    """
    Allows access only to authenticated users who have the INSTRUCTOR role.
    """

    message = 'Access restricted to instructors only.'

    def has_permission(self, request: Request, view: APIView) -> bool:
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_active
            and (request.user.is_instructor or request.user.is_admin_role)
        )


class IsAdminUserRole(BasePermission):
    """
    Allows access only to users who have the ADMIN role or superuser status.
    """

    message = 'Access restricted to platform administrators.'

    def has_permission(self, request: Request, view: APIView) -> bool:
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_active
            and request.user.is_admin_role
        )


class IsOwnerOrAdmin(BasePermission):
    """
    Object-level permission to only allow owners of an object or admins to view or edit it.
    Assumes the model instance has a `user` attribute.
    """

    message = 'You do not have permission to access or modify this resource.'

    def has_object_permission(self, request: Request, view: APIView, obj) -> bool:
        if not (request.user and request.user.is_authenticated and request.user.is_active):
            return False

        if request.user.is_admin_role:
            return True

        # Check if the object belongs to the user
        owner = getattr(obj, 'user', None)
        if owner is not None:
            return owner == request.user

        # If the object itself is a User instance
        if hasattr(obj, 'pk') and obj.pk == request.user.pk:
            return True

        return False
