from cryptography.fernet import Fernet
from django.db import models

from core.services import get_master_key, encrypt, decrypt


class Secret(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content = models.BinaryField()
    additional_info = models.TextField(blank=True)
    encryption_key = models.BinaryField(blank=True, max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # if not isinstance(self.content, bytes):
        #     # Encode the content as binary using UTF-8 encoding
        #     self.content = self.content.encode('utf-8')
        # If we are creating or editing a new Secret, generate a new encryption key,
        # encrypt the content and save it and save the encrypted key.
        if self.pk is None or Secret.objects.get(pk=self.pk).content != self.content:
            key = Fernet.generate_key()
            self.content = encrypt(self.content, key)
            self.encryption_key = encrypt(key, get_master_key())

        super().save(*args, **kwargs)

    def get_decrypted_key(self):
        return decrypt(self.encryption_key, get_master_key())

    def get_decrypted_content(self):
        return decrypt(self.content, self.get_decrypted_key())

    def __str__(self):
        return f"{self.pk} - {self.title}"
