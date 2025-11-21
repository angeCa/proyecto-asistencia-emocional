from rest_framework import generics
from .models import *
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
import cloudinary.uploader
from rest_framework.parsers import MultiPartParser, FormParser

cloudinary.config(
    cloud_name="dbldhwogm",
    api_key="593543857674241",
    api_secret="ENAnveNodGPZUfEeVaSJQRZk9nA",
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
            upload_result = cloudinary.uploader.upload_large(
                cv_file.file,
                folder="solicitudes_cv",
                resource_type="raw",
                public_id=f"cv_{uuid.uuid4()}.pdf",
                format="pdf"
                )
            print(upload_result)
            cv_url = upload_result.get("secure_url")

        serializer.save(cv=cv_url)

    """ def perform_create(self, serializer):
        print(self.request.data)  
        cv_file = self.request.FILES.get("cv")
        cv_url = ""  # siempre string
        if cv_file:
            upload_result = cloudinary.uploader.upload(cv_file, folder="solicitudes_cv")
            cv_url = upload_result.get("secure_url") or ""
        serializer.save(cv=cv_url) """

class AprobarSolicitudAPIView(APIView):
    def post(self, request, solicitud_id):
        try:
            solicitud = SolicitudPsicologo.objects.get(id=solicitud_id)
        except SolicitudPsicologo.DoesNotExist:
            return Response({"error": "Solicitud no encontrada"}, status=status.HTTP_404_NOT_FOUND)

        # Crear el usuario
        usuario = Usuario.objects.create_user(
            username=solicitud.correo,
            email=solicitud.correo,
            password="contraseña123",
            telefono=solicitud.telefono,
            direccion=solicitud.direccion,
            first_name=solicitud.nombre,
            last_name=solicitud.apellido,
        )

        # Crear el psicólogo profesional
        Psicologo.objects.create(
            usuario=usuario,
            especialidad=solicitud.especialidad,
            titulo=solicitud.titulo,
            cv=solicitud.cv,
            estado="aprobado"
        )

        # Marcar solicitud como aprobada
        solicitud.estado = "aprobado"
        solicitud.save()

        return Response({"message": "Solicitud aprobada con éxito"}, status=status.HTTP_200_OK)



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
    queryset = Consulta.objects.all()
    serializer_class = ConsultaSerializer


class ConsultaRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Consulta.objects.all()
    serializer_class = ConsultaSerializer

# 💌 Mensaje


class MensajeListCreateView(generics.ListCreateAPIView):
    serializer_class = MensajeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Mensaje.objects.filter(remitente=user) | Mensaje.objects.filter(consulta__psicologo=user)

    def perform_create(self, serializer):
        serializer.save(remitente=self.request.user)


class MensajeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MensajeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Mensaje.objects.filter(remitente=user) | Mensaje.objects.filter(consulta__psicologo=user)


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
