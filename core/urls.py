from django.urls import path
from . import views
from .views import SecretListCreateView, SecretDetailView

urlpatterns = [
    path("", views.home, name="home"),

    # Authentication URLs
    path("register", views.register_request, name="register"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),

    # API URLs
    path('secrets/', SecretListCreateView.as_view(), name='secret-list-create'),
    path('secrets/<int:pk>/', SecretDetailView.as_view(), name='secret-detail'),

    # Add Secret URL
    path('add/', views.add_secret, name='add'),
]