from rest_framework.permissions import BasePermission
from .models import Psicologo

class IsPsicologo(BasePermission):
    """
    Permite acceso solo a usuarios que tengan registro de Psicologo.
    """

    def has_permission(self, request, view):
        user = request.user

        # Si no está autenticado → NO entra
        if not user or not user.is_authenticated:
            return False

        # Caso 1: tu modelo Psicologo tiene OneToOne con User
        if hasattr(user, "psicologo"):
            return True

        # Caso 2: tu modelo Psicologo tiene FK user=...
        return Psicologo.objects.filter(user=user).exists()
