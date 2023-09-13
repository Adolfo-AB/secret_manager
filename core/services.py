import os

from cryptography.fernet import Fernet

MASTER_KEY_PATH = "core/master_key"


# Function to create a Fernet key
def create_master_key():
    key = Fernet.generate_key()
    with open(MASTER_KEY_PATH, "wb") as key_file:
        key_file.write(key)


# Method to get the Fernet key from the file, creating one if it doesn't exist
def get_master_key():
    if not os.path.exists(MASTER_KEY_PATH):
        create_master_key()

    with open(MASTER_KEY_PATH, "rb") as key_file:
        key = key_file.read()
    return key


# Encrypt data using a Fernet key
def encrypt(data, key):
    fernet = Fernet(key)
    if not isinstance(data, bytes):
        data = data.encode('utf-8')
    encrypted_data = fernet.encrypt(data)
    return encrypted_data


# Decrypt data using a Fernet key
def decrypt(encrypted_data, key):
    fernet = Fernet(key)
    decrypted_data = fernet.decrypt(encrypted_data).decode()
    return decrypted_data
