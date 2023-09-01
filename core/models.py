import secrets

from django.db import models

master_key = get_master_key()

class Secret(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content = models.TextField()
    additional_info = models.TextField()
    encryption_key = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.encryption_key:
            encryption_key = generate_encryption_key()
            encrypted_key = encrypt(encryption_key, master_key)  # Encrypt the key using the master key
            self.encryption_key = encrypted_key

        # Encrypt the content before saving it
        encrypted_content = encrypt(self.content, self.get_decrypted_encryption_key())
        self.content = encrypted_content

        super().save(*args, **kwargs)

    def get_decrypted_encryption_key(self):
        # Decrypt the stored encryption key using the master key
        return decrypt(self.encryption_key, master_key)

    def get_decrypted_content(self):
        # Decrypt the content when needed
        return decrypt(self.content, self.get_decrypted_encryption_key())

    def __str__(self):
        return self.title
