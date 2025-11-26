from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.hashers import make_password

user = get_user_model()
UserGroup = user.groups.through  


# 🔹 Serializador para asignar grupos a usuarios
class UserGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserGroup
        fields = '__all__'
    
    def validate(self, data):
        if UserGroup.objects.filter(usuario_id=data['usuario'], group_id=data['group']).exists():
            raise serializers.ValidationError("Ya tiene ese grupo asignado.")
        return data


# 🔹 Serializador de usuarios
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = user
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'telefono', 'direccion']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_password(self, value: str) -> str:
        return make_password(value)


class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields = '__all__'

class PsicologoSerializer(serializers.ModelSerializer):
    usuario = UserSerializer(read_only=True)

    class Meta:
        model = Psicologo
        fields = '__all__'



class SolicitudPsicologoSerializer(serializers.ModelSerializer):
    usuario = UserSerializer(read_only=True)
    cv = serializers.CharField(read_only=True)
   # cv = serializers.CharField(required=False)

    class Meta:
        model = SolicitudPsicologo
        fields = '__all__'


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'


class ConsultaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consulta
        fields = '__all__'

class MensajeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mensaje
        fields = ['id', 'remitente', 'destinatario', 'contenido', 'fecha_envio']
        read_only_fields = ['remitente', 'fecha_envio']

    def create(self, validated_data):
        validated_data['remitente'] = self.context['request'].user

        return super().create(validated_data)


class DiarioEmocionalSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiarioEmocional
        fields = [
            "id",
            "paciente",
            "fecha",
            "titulo",
            "descripcion",
            "emocion_principal",
            "nivel_intensidad",
            "visible_para_psicologo",
        ]
        read_only_fields = ["id", "fecha", "paciente"]

class EstadisticaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estadistica
        fields = '__all__'

class RecursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recurso
        fields = '__all__'

class TrastornoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trastorno
        fields = '__all__'

class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = '__all__'

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Guardar el rol dentro del token
        groups = user.groups.values_list('name', flat=True)
        token['role'] = groups[0] if groups else None

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # Incluir también en la respuesta del login
        groups = self.user.groups.values_list('name', flat=True)
        data['role'] = groups[0] if groups else None
        data['id'] = self.user.id

        return data

