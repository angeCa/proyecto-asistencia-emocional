from django.db import models
from django.contrib.auth.models import AbstractUser


class Usuario(AbstractUser):
    telefono = models.CharField(max_length=20, blank=False, null=False)
    direccion = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return f"{self.username} | {self.direccion} | {self.telefono}"


# 💖 3. Paciente
class Paciente(models.Model):
    usuario = models.OneToOneField(
        Usuario, on_delete=models.CASCADE, related_name="paciente")
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
    paciente = models.ForeignKey(
        Paciente, on_delete=models.CASCADE, related_name="consultas")
    psicologo = models.ForeignKey(
        Psicologo, on_delete=models.CASCADE, related_name="consultas_atendidas")
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
    notas_psicologo = models.TextField(blank=True, null=True)
    duracion = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f"Consulta de {self.paciente} con {self.psicologo} ({self.estado})"


# 💌 6. Mensaje
class Mensaje(models.Model):
    remitente = models.ForeignKey(
        Usuario, on_delete=models.CASCADE, related_name="mensajes_enviados"
    )
    destinatario = models.ForeignKey(
        # permite que sea vacío
    Usuario, on_delete=models.CASCADE, related_name="mensajes_recibidos", null=True, blank=True )
    contenido = models.TextField()
    fecha_envio = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Mensaje de {self.remitente} para {self.destinatario}"


# 📔 7. Diario Emocional
class DiarioEmocional(models.Model):
    paciente = models.ForeignKey(
        Paciente, on_delete=models.CASCADE, related_name="entradas_diario")
    fecha = models.DateField(auto_now_add=True)
    titulo = models.CharField(max_length=100, blank=False, null=False)
    descripcion = models.TextField(blank=False, null=False)
    emocion_principal = models.CharField(
        max_length=50, blank=False, null=False)
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
        Psicologo, on_delete=models.CASCADE, related_name="recursos_publicados")
    titulo = models.CharField(max_length=200, blank=False, null=False)
    descripcion = models.TextField(blank=False, null=False)
    contenido = models.TextField(blank=True, null=True)
    imagen = models.ImageField(upload_to='recursos/', blank=True, null=True)
    tipo = models.CharField(max_length=50, blank=False, null=False)
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return f"Recurso: {self.titulo} ({self.tipo})"


# ❤️ 10. Trastorno
class Trastorno(models.Model):
    psicologo = models.ForeignKey(
        Psicologo, on_delete=models.CASCADE, related_name="trastornos_creados")
    nombre = models.CharField(max_length=100, blank=False, null=False)
    descripcion = models.TextField(blank=False, null=False)
    causas = models.TextField(blank=True, null=True)
    sintomas = models.TextField(blank=True, null=True)
    tratamiento = models.TextField(blank=True, null=True)
    enlace_externo = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"Trastorno: {self.nombre}"


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
