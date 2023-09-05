from cryptography.fernet import Fernet
from django.db import models

from core.utils import get_master_key


class Secret(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content = models.TextField()
    additional_info = models.TextField()
    encryption_key = models.CharField(blank=True, max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        encryption_key = Fernet.generate_key()
        self.content = Fernet(encryption_key).encrypt(data=self.content.encode('utf-8'))
        encrypted_key = Fernet(get_master_key()).encrypt(encryption_key)
        self.encryption_key = encrypted_key

        super().save(*args, **kwargs)

    def get_decrypted_encryption_key(self):
        return Fernet(get_master_key()).decrypt(self.encryption_key)

    def get_decrypted_content(self):
        return Fernet(self.get_decrypted_encryption_key()).decrypt(self.content)

    def __str__(self):
        return self.title
