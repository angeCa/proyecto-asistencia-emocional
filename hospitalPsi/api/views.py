
from .models import *
from .serializers import *
from django.db.models import Q
from django.conf import settings
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import Group
from django.contrib.auth.hashers import make_password
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework import generics, permissions, viewsets
from rest_framework_simplejwt.views import TokenObtainPairView
import cloudinary.uploader
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.parsers import MultiPartParser, FormParser
import uuid
from rest_framework.permissions import BasePermission
from django.core.exceptions import PermissionDenied

from datetime import datetime, time
from .permissions import IsPsicologo


from django.core.exceptions import PermissionDenied


cloudinary.config(
    cloud_name="dl9nspeal",
    api_key="882573151299831",
    api_secret="Dwf9s79bs2riAxquwoXyw0THGAE",
    secure=True
)


class SolicitudPsicologoListCreateView(generics.ListCreateAPIView):
    queryset = SolicitudPsicologo.objects.all()
    serializer_class = SolicitudPsicologoSerializer
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request, *args, **kwargs):
        print("DATA:", request.data)
        print("FILES:", request.FILES)

        serializer = self.get_serializer(data=request.data)
        print("VALIDACION:", serializer.is_valid(), serializer.errors)

        serializer.is_valid(raise_exception=True)
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        cv_file = self.request.FILES.get("cv")
        cv_url = None

        if cv_file:
            print(cv_file.content_type)
            upload_result = cloudinary.uploader.upload_large(
                cv_file.file,
                folder="solicitudes_cv",
                resource_type="raw",
                public_id=f"cv_{uuid.uuid4()}",
                format="pdf"
            )
            print(upload_result)
            cv_url = upload_result.get("secure_url")

        serializer.save(cv=cv_url)


class AprobarSolicitudAPIView(APIView):
    def post(self, request, solicitud_id):
        try:
            solicitud = SolicitudPsicologo.objects.get(id=solicitud_id)
        except SolicitudPsicologo.DoesNotExist:
            return Response({"error": "Solicitud no encontrada"}, status=status.HTTP_404_NOT_FOUND)

        temp_password = "ContraTemporal123"

        # ✅ Crear o reutilizar usuario (username = correo)
        usuario, created = Usuario.objects.get_or_create(
            username=solicitud.correo,
            defaults={
                "email": solicitud.correo,
                "first_name": solicitud.nombre,
                "last_name": solicitud.apellido,
                "is_active": True,
            }
        )

        # ✅ Asegurar datos + activar + password temporal SIEMPRE
        usuario.email = solicitud.correo
        usuario.first_name = solicitud.nombre
        usuario.last_name = solicitud.apellido
        usuario.is_active = True
        usuario.set_password(temp_password)
        usuario.save()

        # ✅ Agregar al grupo psicologo (debe existir)
        try:
            grupo = Group.objects.get(name__iexact="psicologo")
            usuario.groups.add(grupo)
        except Group.DoesNotExist:
            return Response(
                {"error": "El grupo 'psicologo' no existe. Créalo en la BD."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ Crear registro Psicologo (evita duplicados)
        Psicologo.objects.update_or_create(
            usuario=usuario,
            defaults={
                "especialidad": solicitud.especialidad,
                "titulo": solicitud.titulo,
                "cv": solicitud.cv,
                "estado": "aprobado",
            }
        )

        solicitud.estado = "aprobado"
        solicitud.save()

        return Response(
            {"message": "Solicitud aprobada con éxito", "temp_password": temp_password},
            status=status.HTTP_200_OK
        
)


class RechazarSolicitudAPIView(APIView):
    def post(self, request, solicitud_id):
        try:
            solicitud = SolicitudPsicologo.objects.get(id=solicitud_id)
        except SolicitudPsicologo.DoesNotExist:
            return Response({"error": "Solicitud no encontrada"}, status=status.HTTP_404_NOT_FOUND)

        solicitud.estado = "rechazado"
        solicitud.save()
        return Response({"message": "Solicitud rechazada"}, status=status.HTTP_200_OK)


# 🧩 Group
class UserGroupListCreateView(generics.ListCreateAPIView):
    queryset = UserGroup.objects.all()
    serializer_class = UserGroupSerializer


class UserGroupRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserGroup.objects.all()
    serializer_class = UserGroupSerializer

# 👤 Usuario


class UsuarioListCreateView(generics.ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UserSerializer

    """ def perform_create(self, serializer):
        usuario = serializer.save()
        Paciente.objects.create(usuario=usuario) """


class UsuarioRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UserSerializer

# 💖 Paciente


class PacienteListCreateView(generics.ListCreateAPIView):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer
    permission_classes = [AllowAny]


class PacienteRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer

# 🧠 Psicólogo


class PsicologoListCreateView(generics.ListCreateAPIView):
    queryset = Psicologo.objects.all()
    serializer_class = PsicologoSerializer


class PsicologoRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Psicologo.objects.all()
    serializer_class = PsicologoSerializer

# 💬 Consulta

class ConsultaViewSet(viewsets.ModelViewSet):
    queryset = Consulta.objects.all()
    serializer_class = ConsultaSerializer
    permission_classes = [IsAuthenticated]  # o lo que tengas

    # ✅ AQUÍ VA ESTO
    def get_queryset(self):
        user = self.request.user

        # Paciente
        if Paciente.objects.filter(usuario=user).exists():
            paciente = Paciente.objects.get(usuario=user)
            return Consulta.objects.filter(paciente=paciente).order_by("-fecha_creacion")

        # Psicólogo
        if Psicologo.objects.filter(usuario=user).exists():
            psicologo = Psicologo.objects.get(usuario=user)
            return Consulta.objects.filter(psicologo=psicologo).order_by("-fecha_creacion")

        # Admin / otros
        return Consulta.objects.all().order_by("-fecha_creacion")


class ConsultaRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Consulta.objects.all()
    serializer_class = ConsultaSerializer
    permission_classes = [IsAuthenticated]


class DiasOcupadosPsicologo(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, psicologo_id):
        consultas = Consulta.objects.filter(
            psicologo_id=psicologo_id,
            fecha_programada__isnull=False
        ).values_list("fecha_programada", flat=True)

        dias = list(set([c.date().isoformat() for c in consultas]))
        return Response({"dias_ocupados": dias})


class HorariosDisponiblesPsicologo(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, psicologo_id):
        fecha = request.query_params.get("fecha")  # 'YYYY-MM-DD'
        if not fecha:
            return Response({"detail": "Falta parámetro fecha (YYYY-MM-DD)."}, status=400)

        try:
            fecha_obj = datetime.strptime(fecha, "%Y-%m-%d").date()
        except ValueError:
            return Response({"detail": "Formato de fecha inválido. Use YYYY-MM-DD."}, status=400)

        consultas = Consulta.objects.filter(
            psicologo_id=psicologo_id,
            fecha_programada__date=fecha_obj
        )

        taken = set()
        for c in consultas:
            if c.fecha_programada:
                taken.add(c.fecha_programada.time().strftime("%H:%M"))

        slots = []
        for hour in range(8, 18):
            label = time(hour=hour, minute=0).strftime("%H:%M")
            slots.append({"time": label, "available": label not in taken})

        return Response({"slots": slots})


# 💌 Mensaje


class MensajeListCreateView(generics.ListCreateAPIView):
    serializer_class = MensajeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Mensaje.objects.filter(
            Q(remitente=user) | Q(Consulta__paciente__usuario=user) | Q(
                Consulta__psicologo__usuario=user)
        )

    def perform_create(self, serializer):
        serializer.save(remitente=self.request.user)


class MensajeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MensajeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Mensaje.objects.filter(remitente=user)


# para los mensajes
@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def obtener_conversacion(request, otro_usuario_id):
    usuario = request.user

    mensajes = Mensaje.objects.filter(
        (Q(remitente=usuario) & Q(destinatario_id=otro_usuario_id)) |
        (Q(remitente_id=otro_usuario_id) & Q(destinatario=usuario))
    ).order_by("fecha_envio")

    serializer = MensajeSerializer(mensajes, many=True)
    print(serializer.data)
    return Response(serializer.data)


# ESTO ES PARA LAS CONVERSACIONES ENTRE PAC Y PSI
@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def mis_chats(request):
    usuario = request.user

    print(usuario)

    # Filtrar solo mensajes donde participa
    mensajes = Mensaje.objects.filter(
        Q(remitente=usuario) | Q(destinatario=usuario)
    ).order_by("-fecha_envio")

    if not mensajes.exists():
        return Response([])

    chats = {}

    for m in mensajes:

        # Ignorar mensajes incompletos
        if m.remitente is None or m.destinatario is None:
            continue

        # Identificar al otro participante
        if m.remitente_id == usuario.id:
            otro = m.destinatario
        else:
            otro = m.remitente

        # Guardar siempre el mensaje más reciente
        if otro.id not in chats:
            chats[otro.id] = {
                "id": otro.id,
                "nombre": otro.first_name,
                "apellido": otro.last_name,
                "email": otro.email,
                "ultimo_mensaje": m.contenido,
                "fecha": m.fecha_envio
            }

    return Response(list(chats.values()))

# termina seccion de mensajes


# 📔 Diario Emocional

class DiarioEmocionalListCreateView(generics.ListCreateAPIView):
    queryset = DiarioEmocional.objects.all()
    serializer_class = DiarioEmocionalSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Paciente crea su diario: se setea automáticamente
        paciente = Paciente.objects.get(usuario=self.request.user)
        serializer.save(paciente=paciente)


class DiarioEmocionalRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DiarioEmocional.objects.all()
    serializer_class = DiarioEmocionalSerializer
    permission_classes = [IsAuthenticated]


class DiarioPorPacienteView(APIView):
    """
    Devuelve los diarios de un paciente, solo los visibles para psicólogo.
    URL: /api/diario/paciente/<paciente_id>/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, paciente_id):
        diarios = DiarioEmocional.objects.filter(
            paciente_id=paciente_id,
            visible_para_psicologo=True
        ).order_by("-fecha", "-id")

        serializer = DiarioEmocionalSerializer(diarios, many=True)
        return Response(serializer.data)


# 📊 Estadística


class EstadisticaListCreateView(generics.ListCreateAPIView):
    queryset = Estadistica.objects.all()
    serializer_class = EstadisticaSerializer


class EstadisticaRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Estadistica.objects.all()
    serializer_class = EstadisticaSerializer

# 📰 Recurso


class IsPsicologoOrAdmin(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False

        # ✅ es psicólogo aprobado
        if Psicologo.objects.filter(usuario=user, estado="aprobado").exists():
            return True

        # ✅ es admin (grupo "admin")
        if user.groups.filter(name__iexact="admin").exists():
            return True

        return False

# 📰 Recurso


class RecursoListCreateView(generics.ListCreateAPIView):
    serializer_class = RecursoSerializer

    def get_queryset(self):
        return Recurso.objects.filter(activo=True).order_by("-fecha_publicacion")

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsPsicologoOrAdmin()]

    def perform_create(self, serializer):
        psicologo = Psicologo.objects.get(usuario=self.request.user)
        serializer.save(psicologo=psicologo)


class RecursoRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RecursoSerializer
    queryset = Recurso.objects.all()

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsPsicologoOrAdmin()]

# ❤️ Foro


def es_admin(user):
    return user.groups.filter(name__iexact="admin").exists()


class SoloAutorOAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return es_admin(request.user) or getattr(obj, "autor_id", None) == request.user.id


class ForoPostViewSet(viewsets.ModelViewSet):
    serializer_class = ForoPostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ForoPost.objects.filter(activo=True).order_by("-creado_en")

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx["request"] = self.request
        return ctx

    permission_classes_by_action = {
        "update": [permissions.IsAuthenticated, SoloAutorOAdmin],
        "partial_update": [permissions.IsAuthenticated, SoloAutorOAdmin],
        "destroy": [permissions.IsAuthenticated, SoloAutorOAdmin],
    }

    def get_permissions(self):
        perms = self.permission_classes_by_action.get(
            self.action, self.permission_classes)
        return [p() for p in perms]


class ForoComentarioViewSet(viewsets.ModelViewSet):
    serializer_class = ForoComentarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        post_id = self.request.query_params.get("post")
        qs = ForoComentario.objects.filter(activo=True).order_by("creado_en")
        if post_id:
            qs = qs.filter(post_id=post_id)
        return qs

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx["request"] = self.request
        return ctx

    permission_classes_by_action = {
        "update": [permissions.IsAuthenticated, SoloAutorOAdmin],
        "partial_update": [permissions.IsAuthenticated, SoloAutorOAdmin],
        "destroy": [permissions.IsAuthenticated, SoloAutorOAdmin],
        "toggle_like": [permissions.IsAuthenticated],
    }

    def get_permissions(self):
        perms = self.permission_classes_by_action.get(
            self.action, self.permission_classes)
        return [p() for p in perms]

    @action(detail=True, methods=["post"])
    def toggle_like(self, request, pk=None):
        comentario = self.get_object()
        like = ForoLike.objects.filter(
            comentario=comentario, usuario=request.user).first()

        if like:
            like.delete()
            return Response({"liked": False, "likes_count": comentario.likes.count()}, status=status.HTTP_200_OK)

        ForoLike.objects.create(comentario=comentario, usuario=request.user)
        return Response({"liked": True, "likes_count": comentario.likes.count()}, status=status.HTTP_200_OK)

# 🔔 Notificación


class NotificacionListCreateView(generics.ListCreateAPIView):
    queryset = Notificacion.objects.all()
    serializer_class = NotificacionSerializer


class NotificacionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Notificacion.objects.all()
    serializer_class = NotificacionSerializer


class CustomeTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomeTokenObtainPairSerializer


class AdminRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        codigo = request.data.get("codigo_admin")
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")
        first_name = request.data.get("first_name", "")
        last_name = request.data.get("last_name", "")

        # 1) Validar código
        if codigo != getattr(settings, "ADMIN_INVITE_CODE", None):
            return Response(
                {"detail": "Código de administrador inválido."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2) Validar datos básicos
        if not username or not email or not password:
            return Response(
                {"detail": "Faltan datos obligatorios."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 3) Crear usuario
        if Usuario.objects.filter(username=username).exists():
            return Response(
                {"detail": "Ese usuario ya existe."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = Usuario.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )

        # 4) Agregar al grupo admin
        grupo_admin, _ = Group.objects.get_or_create(name="admin")
        user.groups.add(grupo_admin)

        return Response(
            {"detail": "Administrador creado con éxito."},
            status=status.HTTP_201_CREATED
        )


class EmailOrUsernameTokenView(TokenObtainPairView):
    serializer_class = EmailOrUsernameTokenObtainPairSerializer
