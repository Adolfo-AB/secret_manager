from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render, redirect
from .forms import NewUserForm, SecretForm
from django.contrib.auth import login, authenticate, logout
from django.contrib import messages
from rest_framework import generics
from .models import Secret
from .serializers import SecretSerializer


def home(request):
    return render(request, "core/home.html")


def register_request(request):
    if request.user.is_authenticated:
        return redirect("home")

    if request.method == "POST":
        form = NewUserForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, "Registration successful.")
            return redirect("home")
        messages.error(request, "Unsuccessful registration. Invalid information.")
    form = NewUserForm()
    return render(request=request, template_name="core/register.html", context={"register_form": form})


def login_view(request):
    if request.user.is_authenticated:
        return redirect("home")

    if request.method == "POST":
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.info(request, f"You are now logged in as {username}.")
                return redirect("home")
            else:
                messages.error(request, "Invalid username or password.")
        else:
            messages.error(request, "Invalid username or password.")
    form = AuthenticationForm()
    return render(request=request, template_name="core/login.html", context={"login_form": form})


@login_required
def logout_view(request):
    logout(request)
    messages.info(request, "You have successfully logged out.")
    return redirect("home")


class SecretListCreateView(LoginRequiredMixin, generics.ListCreateAPIView):
    serializer_class = SecretSerializer

    def get_queryset(self):
        return Secret.objects.filter(user=self.request.user)


class SecretDetailView(LoginRequiredMixin, generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SecretSerializer

    def get_queryset(self):
        return Secret.objects.filter(user=self.request.user)


def add_secret(request):
    form = SecretForm()
    return render(request, 'core/add.html', {'form': form})