from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser


class Usuario(AbstractUser):
    telefono = models.CharField(max_length=20, blank=False, null=False)
    direccion = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return f"{self.username} | {self.direccion} | {self.telefono}"

# 💖 3. Paciente
class Paciente(models.Model):
    usuario = models.OneToOneField(
        Usuario, on_delete=models.CASCADE, related_name="Paciente")
    fecha_nacimiento = models.DateField(blank=True, null=True)
    diagnostico = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Paciente: {self.usuario}"

# 🧠 4 Solicitud de psicolgo


class SolicitudPsicologo(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    correo = models.EmailField()
    telefono = models.CharField(max_length=50, null=True)
    usuario = models.OneToOneField(
        Usuario, on_delete=models.CASCADE, null=True)
    especialidad = models.CharField(max_length=100)
    titulo = models.CharField(max_length=200)
    cv = models.TextField(blank=True, null=True)  # Guardamos URL de Cloudinary
    estado = models.CharField(
        max_length=20,
        choices=[("pendiente", "Pendiente"), ("aprobado",
                                              "Aprobado"), ("rechazado", "Rechazado")],
        default="pendiente"
    )
    fecha_envio = models.DateTimeField(auto_now_add=True)


# 🧠 4.5 Psicólogo
class Psicologo(models.Model):
    usuario = models.OneToOneField(
        Usuario,
        on_delete=models.CASCADE,
        related_name='psicologo'
    )

    especialidad = models.CharField(max_length=100)
    titulo = models.CharField(max_length=200)
    cv = models.TextField(blank=True, null=True)

    estado = models.CharField(
        max_length=20,
        choices=[
            ('pendiente', 'Pendiente'),
            ('aprobado', 'Aprobado'),
            ('rechazado', 'Rechazado')
        ],
        default='pendiente'
    )

    def __str__(self):
        return f"{self.usuario.first_name} {self.usuario.email} - {self.usuario.telefono} - {self.estado}"


# 💬 5. Consulta
class Consulta(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name="consultas")
    psicologo = models.ForeignKey(Psicologo, on_delete=models.CASCADE, related_name="consultas_atendidas")
    motivo = models.TextField(blank=False, null=False)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_programada = models.DateTimeField(blank=True, null=True)
    enlace_zoom = models.URLField(blank=True, null=True)

    estado = models.CharField(
        max_length=20,
        choices=[
            ("pendiente", "Pendiente"),
            ("confirmada", "Confirmada"),
            ("completada", "Completada"),
            ("cancelada", "Cancelada"),
        ],
        default="pendiente",
    )

    # ya lo tienes:
    notas_psicologo = models.TextField(blank=True, null=True)
    duracion = models.IntegerField(blank=True, null=True)

    # ✅ NUEVO
    razon_cancelacion = models.TextField(blank=True, null=True)


# 💌 6. Mensaje
class Mensaje(models.Model):
    remitente = models.ForeignKey(
        Usuario, on_delete=models.CASCADE, related_name="mensajes_enviados"
    )
    destinatario = models.ForeignKey(
        Usuario, on_delete=models.CASCADE, related_name="mensajes_recibidos", null=True, blank=True)
    contenido = models.TextField()
    fecha_envio = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Mensaje de {self.remitente} para {self.destinatario}"


# 📔 7. Diario Emocional
class DiarioEmocional(models.Model):
    paciente = models.ForeignKey(
        Paciente, on_delete=models.CASCADE, related_name="entradas_diario"
    )
    fecha = models.DateField(auto_now_add=True)
    titulo = models.CharField(max_length=100, blank=False, null=False)
    descripcion = models.TextField(blank=False, null=False)
    emocion_principal = models.CharField(max_length=50, blank=False, null=False)
    nivel_intensidad = models.IntegerField(blank=False, null=False)
    visible_para_psicologo = models.BooleanField(default=False)

    def __str__(self):
        return f"Diario de {self.paciente} ({self.emocion_principal})"


# 📊 8. Estadística
class Estadistica(models.Model):
    paciente = models.ForeignKey(
        Paciente, on_delete=models.CASCADE, related_name="estadisticas")
    fecha = models.DateField(auto_now_add=True)
    emocion = models.CharField(max_length=50, blank=False, null=False)
    intensidad = models.IntegerField(blank=False, null=False)
    comentario = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Estadística de {self.paciente} - {self.emocion} ({self.intensidad})"


# 📰 9. Recurso Informativo
class Recurso(models.Model):
    psicologo = models.ForeignKey(
        Psicologo,
        on_delete=models.CASCADE,
        related_name="recursos_publicados"
    )
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    url = models.URLField(max_length=500, blank=True, null=True)
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.titulo}"


# ❤️ 10. Foro
class ForoPost(models.Model):
    autor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="foroposts")
    titulo = models.CharField(max_length=200)
    contenido = models.TextField()
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.titulo} - {self.autor.username}"


class ForoComentario(models.Model):
    post = models.ForeignKey(ForoPost, on_delete=models.CASCADE, related_name="comentarios")
    autor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="forocomentarios")
    contenido = models.TextField()
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return f"Comentario {self.id} - {self.autor.username}"


class ForoLike(models.Model):
    comentario = models.ForeignKey(ForoComentario, on_delete=models.CASCADE, related_name="likes")
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="forolikes")
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["comentario", "usuario"], name="unique_like_por_usuario")
        ]

    def __str__(self):
        return f"Like {self.usuario.username} -> comentario {self.comentario_id}"



# 🔔 11. Notificación
class Notificacion(models.Model):
    usuario = models.ForeignKey(
        Usuario, on_delete=models.CASCADE, related_name="notificaciones")
    mensaje = models.TextField(blank=False, null=False)
    tipo = models.CharField(max_length=50, blank=False, null=False)
    fecha_envio = models.DateTimeField(auto_now_add=True)
    leido = models.BooleanField(default=False)

    def __str__(self):
        return f"Notificación para {self.usuario} - {self.tipo}"
