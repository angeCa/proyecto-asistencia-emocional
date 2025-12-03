from rest_framework import generics
from .models import *
from .serializers import *
from django.db.models import Q
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import Group
from django.contrib.auth.hashers import make_password
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
import cloudinary.uploader
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.parsers import MultiPartParser, FormParser
import uuid

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
            return Response({"error": "Solicitud no encontrada"}, status=404)

        # Crear usuario
        usuario, created = Usuario.objects.get_or_create(
            username=solicitud.correo,
            defaults={
                "email": solicitud.correo,
                "first_name": solicitud.nombre,
                "last_name": solicitud.apellido,
                "password": make_password("ContraTemporal123"),
            }
        )

        # 🔹 Agregar usuario al grupo correcto
        try:
            grupo = Group.objects.get(name__iexact="psicologo")

            usuario.groups.add(grupo)
        except Group.DoesNotExist:
            print("⚠ ERROR: El grupo 'Psicologo' NO existe en la base de datos")

        # 🔹 Crear el registro de psicólogo
        Psicologo.objects.create(
            usuario=usuario,
            especialidad=solicitud.especialidad,
            titulo=solicitud.titulo,
            cv=solicitud.cv,
            estado="aprobado"
        )

        solicitud.estado = "aprobado"
        solicitud.save()

        return Response({"message": "Solicitud aprobada con éxito"}, status=200)


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

    def perform_create(self, serializer):
        usuario = serializer.save()
        Paciente.objects.create(usuario=usuario)


class UsuarioRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UserSerializer

# 💖 Paciente


class PacienteListCreateView(generics.ListCreateAPIView):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer

    def perform_create(self, serializer):
        serializer.save(paciente=self.request.user)


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


class ConsultaListCreateView(generics.ListCreateAPIView):
    serializer_class = ConsultaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Consulta.objects.filter(paciente=user)

    def perform_create(self, serializer):
        serializer.save(paciente=self.request.user)


class ConsultaRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Consulta.objects.all()
    serializer_class = ConsultaSerializer
    permission_classes = [IsAuthenticated]

# 💌 Mensaje


class MensajeListCreateView(generics.ListCreateAPIView):
    queryset = Mensaje.objects.all()
    serializer_class = MensajeSerializer
    permission_classes = [permissions.IsAuthenticated]


class MensajeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MensajeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Mensaje.objects.filter(remitente=user)


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



# 📔 Diario Emocional
class DiarioEmocionalListCreateView(generics.ListCreateAPIView):
    serializer_class = DiarioEmocionalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filtrar por el paciente autenticado
        return DiarioEmocional.objects.filter(paciente__usuario=self.request.user)

    def perform_create(self, serializer):
        # Obtener el paciente vinculado al usuario
        paciente = Paciente.objects.get(usuario=self.request.user)

        # Guardar la entrada automáticamente con ese paciente
        serializer.save(paciente=paciente)


class DiarioEmocionalRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DiarioEmocionalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        paciente = Paciente.objects.get(usuario=user)
        return DiarioEmocional.objects.filter(paciente=paciente)

# 📊 Estadística


class EstadisticaListCreateView(generics.ListCreateAPIView):
    queryset = Estadistica.objects.all()
    serializer_class = EstadisticaSerializer


class EstadisticaRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Estadistica.objects.all()
    serializer_class = EstadisticaSerializer

# 📰 Recurso


class RecursoListCreateView(generics.ListCreateAPIView):
    queryset = Recurso.objects.all()
    serializer_class = RecursoSerializer


class RecursoRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Recurso.objects.all()
    serializer_class = RecursoSerializer

# ❤️ Trastorno


class TrastornoListCreateView(generics.ListCreateAPIView):
    queryset = Trastorno.objects.all()
    serializer_class = TrastornoSerializer


class TrastornoRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Trastorno.objects.all()
    serializer_class = TrastornoSerializer

# 🔔 Notificación


class NotificacionListCreateView(generics.ListCreateAPIView):
    queryset = Notificacion.objects.all()
    serializer_class = NotificacionSerializer


class NotificacionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Notificacion.objects.all()
    serializer_class = NotificacionSerializer


class CustomeTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
