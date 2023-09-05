from django.contrib import admin
from .models import Secret


# Register your models here.
class SecretAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "title", "content", "additional_info", "encryption_key", "created_at", "updated_at"]


admin.site.register(Secret)
