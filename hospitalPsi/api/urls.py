from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    UsuarioListCreateView,
    UsuarioRetrieveUpdateDestroyView,
    SolicitudPsicologoListCreateView,
    AprobarSolicitudAPIView,
    RechazarSolicitudAPIView,
    UserGroupListCreateView,
    UserGroupRetrieveUpdateDestroyView,
    PacienteListCreateView,
    PacienteRetrieveUpdateDestroyView,
    PsicologoListCreateView,
    PsicologoRetrieveUpdateDestroyView,
    ConsultaViewSet,
    DiasOcupadosPsicologo,
    HorariosDisponiblesPsicologo,
    MensajeListCreateView,
    MensajeRetrieveUpdateDestroyView,
    obtener_conversacion,
    mis_chats,
    DiarioEmocionalListCreateView,
    DiarioEmocionalRetrieveUpdateDestroyView,
    DiarioPorPacienteView,
    EstadisticaListCreateView,
    EstadisticaRetrieveUpdateDestroyView,
    RecursoListCreateView,
    RecursoRetrieveUpdateDestroyView,
    ForoPostViewSet,
    ForoComentarioViewSet,
    NotificacionListCreateView,
    NotificacionRetrieveUpdateDestroyView,
    AdminRegisterView,
    EmailOrUsernameTokenView,
    CustomeTokenObtainPairView
)

urlpatterns = [

    # ---- USER / AUTH ----
    path('usuarios/', UsuarioListCreateView.as_view()),
    path('usuarios/<int:pk>/', UsuarioRetrieveUpdateDestroyView.as_view()),

    path('solicitudes/', SolicitudPsicologoListCreateView.as_view()),
    path("solicitud/<int:solicitud_id>/aprobar/",
         AprobarSolicitudAPIView.as_view()),
    path("solicitud/<int:solicitud_id>/rechazar/",
         RechazarSolicitudAPIView.as_view()),

    path('user_group/', UserGroupListCreateView.as_view()),
    path('user_group/<int:pk>/', UserGroupRetrieveUpdateDestroyView.as_view()),

    path('pacientes/', PacienteListCreateView.as_view()),
    path('pacientes/<int:pk>/', PacienteRetrieveUpdateDestroyView.as_view()),

    path('psicologos/', PsicologoListCreateView.as_view()),
    path('psicologos/<int:pk>/', PsicologoRetrieveUpdateDestroyView.as_view()),

    # ---- CONSULTAS ----
    path('consultas/',
         ConsultaViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('consultas/<int:pk>/', ConsultaViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy',
    })),

    path('psicologos/<int:psicologo_id>/dias-ocupados/',
         DiasOcupadosPsicologo.as_view()),
    path('psicologos/<int:psicologo_id>/horarios-disponibles/',
         HorariosDisponiblesPsicologo.as_view()),

    # ---- MENSAJES ----
    path('mensajes/', MensajeListCreateView.as_view()),
    path('mensajes/<int:pk>/', MensajeRetrieveUpdateDestroyView.as_view()),
    path('mensajes/conversacion/<int:otro_usuario_id>/', obtener_conversacion),
    path('mensajes/mis-chats/', mis_chats),

    # ---- DIARIO ----
    path('diario/', DiarioEmocionalListCreateView.as_view()),
    path('diario/<int:pk>/', DiarioEmocionalRetrieveUpdateDestroyView.as_view()),
    path('diario/paciente/<int:paciente_id>/', DiarioPorPacienteView.as_view()),

    # ---- ESTADÍSTICAS ----
    path('estadisticas/', EstadisticaListCreateView.as_view()),
    path('estadisticas/<int:pk>/', EstadisticaRetrieveUpdateDestroyView.as_view()),

    # ---- RECURSOS ----
    path('recursos/', RecursoListCreateView.as_view()),
    path('recursos/<int:pk>/', RecursoRetrieveUpdateDestroyView.as_view()),

    # ---- FORO ----
    path('foro/posts/',
         ForoPostViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('foro/posts/<int:pk>/', ForoPostViewSet.as_view({
        'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'
    })),

    path('foro/comentarios/',
         ForoComentarioViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('foro/comentarios/<int:pk>/', ForoComentarioViewSet.as_view({
        'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'
    })),
    path('foro/comentarios/<int:pk>/toggle_like/',
         ForoComentarioViewSet.as_view({'post': 'toggle_like'})),

    # ---- NOTIFICACIONES ----
    path('notificaciones/', NotificacionListCreateView.as_view()),
    path('notificaciones/<int:pk>/',
         NotificacionRetrieveUpdateDestroyView.as_view()),

    # ---- ADMIN ----
    path("registro-admin/", AdminRegisterView.as_view()),

    # ---- AUTH JWT (🔥 CORREGIDO) ----

    path("token/", CustomeTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    path("token/", EmailOrUsernameTokenView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),
]
