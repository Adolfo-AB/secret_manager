from rest_framework import serializers
from .models import Secret


class SecretSerializer(serializers.ModelSerializer):
    decrypted_content = serializers.SerializerMethodField()

    class Meta:
        model = Secret
        fields = '__all__'

    def get_decrypted_content(self, obj):
        return obj.get_decrypted_content()
