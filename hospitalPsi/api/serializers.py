from django.utils import timezone
from rest_framework import serializers
from .models import *
from .zoom_api import create_zoom_meeting
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import Group


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


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = user
        fields = ['id', 'username', 'email', 'password',
                  'first_name', 'last_name', 'telefono', 'direccion']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # ✅ Guardamos el password correctamente SOLO UNA VEZ
        password = validated_data.pop("password", None)
        instance = user(**validated_data)

        if password:
            instance.set_password(password)  # ✅ aquí se encripta bien
        else:
            instance.set_unusable_password()

        instance.save()
        return instance

    def update(self, instance, validated_data):
        # ✅ Si actualizan usuario y viene password, también se encripta bien
        password = validated_data.pop("password", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance


class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields = '__all__'


class PacienteRegistroSerializer(serializers.ModelSerializer):
    # Datos del usuario
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    username = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)
    telefono = serializers.CharField(write_only=True)
    direccion = serializers.CharField(write_only=True)

    class Meta:
        model = Paciente
        fields = [
            "id",
            "fecha_nacimiento",
            "diagnostico",

            # usuario
            "first_name",
            "last_name",
            "username",
            "password",
            "telefono",
            "direccion",
        ]

    def create(self, validated_data):
        user_data = {
            "first_name": validated_data.pop("first_name"),
            "last_name": validated_data.pop("last_name"),
            "username": validated_data.pop("username"),
            # ✅ email = username (correo)
            "email": validated_data.get("username"),
            "telefono": validated_data.pop("telefono"),
            "direccion": validated_data.pop("direccion"),
        }

        password = validated_data.pop("username")

        usuario = Usuario.objects.create(**user_data)
        usuario.set_password(password)
        usuario.save()
        grupo_paciente, _ = Group.objects.get_or_create(name="paciente")

        usuario.groups.add(grupo_paciente)

        paciente = Paciente.objects.create(usuario=usuario, **validated_data)
        return paciente


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
    psicologo = serializers.PrimaryKeyRelatedField(
        queryset=Psicologo.objects.all())

    class Meta:
        model = Consulta
        fields = "__all__"
        read_only_fields = ["paciente", "fecha_creacion", "enlace_zoom"]

    def create(self, validated_data):
        request = self.context.get("request")

        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("No autenticado.")

        try:
            paciente = Paciente.objects.get(usuario=request.user)
        except Paciente.DoesNotExist:
            raise serializers.ValidationError(
                "Solo un paciente puede crear consultas.")

        validated_data["paciente"] = paciente

        psicologo = validated_data.get("psicologo")
        if psicologo and hasattr(psicologo, "estado") and psicologo.estado != "aprobado":
            raise serializers.ValidationError(
                {"psicologo": "Este psicólogo no está aprobado."})

        return super().create(validated_data)

    def update(self, instance, validated_data):
        estado_anterior = instance.estado
        nuevo_estado = validated_data.get("estado", instance.estado)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if (
            estado_anterior != "confirmada"
            and nuevo_estado == "confirmada"
            and not instance.enlace_zoom
        ):
            if not instance.fecha_programada:
                raise serializers.ValidationError(
                    {"fecha_programada": "La consulta debe tener fecha_programada para generar Zoom."}
                )

            start_time = instance.fecha_programada.astimezone(
                timezone.get_current_timezone()
            ).isoformat()

            try:
                join_url = create_zoom_meeting(
                    topic="Consulta psicológica",
                    start_time=start_time,
                    duration_minutes=instance.duracion or 60,
                )
            except Exception as e:
                raise serializers.ValidationError({"error": str(e)})

            if not join_url:
                raise serializers.ValidationError(
                    {"enlace_zoom": "No se pudo generar el enlace de Zoom. Revisa credenciales/configuración de Zoom."}
                )

            instance.enlace_zoom = join_url
            instance.save(update_fields=["enlace_zoom"])

        return instance


class MensajeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mensaje
        fields = ['id', 'remitente', 'destinatario',
                  'contenido', 'fecha_envio']
        read_only_fields = ['remitente', 'fecha_envio']

    def create(self, validated_data):
        validated_data['remitente'] = self.context['request'].user

        return super().create(validated_data)


class DiarioEmocionalSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiarioEmocional
        fields = '__all__'
        read_only_fields = ['paciente', 'fecha']

    def create(self, validated_data):
        request = self.context.get('request')
        paciente = Paciente.objects.get(usuario=request.user)
        validated_data['paciente'] = paciente
        return super().create(validated_data)


class EstadisticaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estadistica
        fields = '__all__'


class RecursoSerializer(serializers.ModelSerializer):
    psicologo_id = serializers.IntegerField(
        source="psicologo.id", read_only=True)
    psicologo_nombre = serializers.CharField(
        source="psicologo.usuario.first_name",
        read_only=True
    )

    class Meta:
        model = Recurso
        fields = [
            "id",
            "titulo",
            "descripcion",
            "url",
            "fecha_publicacion",
            "activo",
            "psicologo",
            "psicologo_id",
            "psicologo_nombre",
        ]
        read_only_fields = ["psicologo", "fecha_publicacion"]


def calcular_rol(user):
    if Group.objects.filter(name__iexact="admin", user=user).exists():
        return "admin"
    if Psicologo.objects.filter(usuario=user, estado="aprobado").exists():
        return "psicologo"
    if Paciente.objects.filter(usuario=user).exists():
        return "paciente"
    return "usuario"


class ForoPostSerializer(serializers.ModelSerializer):
    autor_nombre = serializers.CharField(
        source="autor.first_name", read_only=True)
    autor_apellido = serializers.CharField(
        source="autor.last_name", read_only=True)
    autor_username = serializers.CharField(
        source="autor.username", read_only=True)
    autor_rol = serializers.SerializerMethodField()

    class Meta:
        model = ForoPost
        fields = ["id", "titulo", "contenido", "creado_en", "actualizado_en", "activo",
                  "autor", "autor_username", "autor_nombre", "autor_apellido", "autor_rol"]
        read_only_fields = ["autor", "creado_en", "actualizado_en",
                            "autor_username", "autor_nombre", "autor_apellido", "autor_rol"]

    def get_autor_rol(self, obj):
        return calcular_rol(obj.autor)

    def create(self, validated_data):
        request = self.context.get("request")
        validated_data["autor"] = request.user
        return super().create(validated_data)


class ForoComentarioSerializer(serializers.ModelSerializer):
    autor_username = serializers.CharField(
        source="autor.username", read_only=True)
    autor_nombre = serializers.CharField(
        source="autor.first_name", read_only=True)
    autor_apellido = serializers.CharField(
        source="autor.last_name", read_only=True)
    autor_rol = serializers.SerializerMethodField()

    likes_count = serializers.SerializerMethodField()
    liked_by_me = serializers.SerializerMethodField()

    class Meta:
        model = ForoComentario
        fields = [
            "id", "post", "contenido", "creado_en", "actualizado_en", "activo",
            "autor", "autor_username", "autor_nombre", "autor_apellido", "autor_rol",
            "likes_count", "liked_by_me",
        ]
        read_only_fields = [
            "autor", "creado_en", "actualizado_en",
            "autor_username", "autor_nombre", "autor_apellido", "autor_rol",
            "likes_count", "liked_by_me",
        ]

    def get_autor_rol(self, obj):
        return calcular_rol(obj.autor)

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_liked_by_me(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        return ForoLike.objects.filter(comentario=obj, usuario=request.user).exists()

    def create(self, validated_data):
        request = self.context.get("request")
        validated_data["autor"] = request.user
        return super().create(validated_data)


class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = '__all__'


class CustomeTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        user = self.user
        data["id_usuario"] = user.id

        grupos = list(user.groups.values_list("name", flat=True))

        if "admin" in grupos:
            data["rol"] = "admin"
        elif "psicologo" in grupos:
            data["rol"] = "psicologo"
        elif "paciente" in grupos:
            data["rol"] = "paciente"
        else:
            data["rol"] = "usuario"

        return data


User = get_user_model()


class EmailOrUsernameTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        login_value = attrs.get("username")

        if login_value and "@" in login_value:
            try:
                u = User.objects.get(email__iexact=login_value)
                attrs["username"] = u.get_username()
            except User.DoesNotExist:
                raise serializers.ValidationError(
                    {"detail": "Credenciales incorrectas"})

        return super().validate(attrs)
