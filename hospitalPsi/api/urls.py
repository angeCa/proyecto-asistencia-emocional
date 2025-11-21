from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path



urlpatterns = [
    # ---- USER / AUTH ----
    path('usuarios/', UsuarioListCreateView.as_view(), name='usuario-list-create'),
    path('usuarios/<int:pk>/', UsuarioRetrieveUpdateDestroyView.as_view(), name='usuario-detail'),
    
    path('solicitudes/', SolicitudPsicologoListCreateView.as_view(), name='solicitud-list-create'),
    path("solicitud/<int:solicitud_id>/aprobar/", AprobarSolicitudAPIView.as_view()),
    path("solicitud/<int:solicitud_id>/rechazar/", RechazarSolicitudAPIView.as_view()), 


    path('user_group/', UserGroupListCreateView.as_view(), name='group-list-create'),
    path('user_group/<int:pk>/', UserGroupRetrieveUpdateDestroyView.as_view(), name='group-detail'),

    path('token/', CustomeTokenObtainPairView.as_view(), name='token-list-create'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),

    # ---- PACIENTES / PSICÓLOGOS ----
    path('pacientes/', PacienteListCreateView.as_view(), name='paciente-list-create'),
    path('pacientes/<int:pk>/', PacienteRetrieveUpdateDestroyView.as_view(), name='paciente-detail'),

    path('psicologos/', PsicologoListCreateView.as_view(), name='psicologo-list-create'),
    path('psicologos/<int:pk>/', PsicologoRetrieveUpdateDestroyView.as_view(), name='psicologo-detail'),

    # ---- CONSULTAS ----
    path('consultas/', ConsultaListCreateView.as_view(), name='consulta-list-create'),
    path('consultas/<int:pk>/', ConsultaRetrieveUpdateDestroyView.as_view(), name='consulta-detail'),

    # ---- MENSAJES ----
    path('mensajes/', MensajeListCreateView.as_view(), name='mensaje-list-create'),
    path('mensajes/<int:pk>/', MensajeRetrieveUpdateDestroyView.as_view(), name='mensaje-detail'),

    # ---- DIARIO EMOCIONAL ----
    path('diario/', DiarioEmocionalListCreateView.as_view(), name='diario-list-create'),
    path('diario/<int:pk>/', DiarioEmocionalRetrieveUpdateDestroyView.as_view(), name='diario-detail'),

    # ---- ESTADÍSTICAS ----
    path('estadisticas/', EstadisticaListCreateView.as_view(), name='estadistica-list-create'),
    path('estadisticas/<int:pk>/', EstadisticaRetrieveUpdateDestroyView.as_view(), name='estadistica-detail'),

    # ---- RECURSOS ----
    path('recursos/', RecursoListCreateView.as_view(), name='recurso-list-create'),
    path('recursos/<int:pk>/', RecursoRetrieveUpdateDestroyView.as_view(), name='recurso-detail'),

    # ---- TRASTORNOS ----
    path('trastornos/', TrastornoListCreateView.as_view(), name='trastorno-list-create'),
    path('trastornos/<int:pk>/', TrastornoRetrieveUpdateDestroyView.as_view(), name='trastorno-detail'),

    # ---- NOTIFICACIONES ----
    path('notificaciones/', NotificacionListCreateView.as_view(), name='notificacion-list-create'),
    path('notificaciones/<int:pk>/', NotificacionRetrieveUpdateDestroyView.as_view(), name='notificacion-detail'),
]
