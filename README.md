# CS50W Capstone Project - Secret Manager

## Description
This is the capstone project for CS50’s Web Programming with Python and JavaScript course. 
It consists in a web application that allows the user to store secrets like passwords or card numbers in a secure way.
The backend of the application is written in Python, using the Django web framework, and Django REST Framework.
The frontend, on the other hand, is written in plain HTML, CSS and vanilla JavaScript.

## Distinctiveness and Complexity
This application has several features that make it distinct and more complex than the other applications
developed during the progress of the course:
- The most important feature is the ability to securely store secrets in the database. 
This is achieved by encrypting the Secret using an encryption key before saving it. 
This key is also stored in the database, but it is also encrypted 
(so that our secrets are not compromised if an attacker gains access to our database),
in this case using a master key.
For the purpose of this project, the master key is automatically generated when saving the first secret
and stored in a file inside the project directory, although in a production environment it should be saved
in a different place, like a secure device with restricted access.
As expected, a user can only see its own secrets.
The encryption algorithm used is the Fernet algorithm.
Implementing this feature has allowed me to learn about network security and cryptography.
- Creation of a CRUD REST API using Django REST Framework. During the course we did not implement any REST API
from scratch, and since I am interested in backend web development, I thought it would be a good idea to learn
about Django REST Framework. This API is used to fetch secrets and secret details,
as well as to create, delete and update secrets.
- Use of Django forms and class-based views. During the course we did not learn about class-based views
or Django forms, so I thought it would be a good idea to learn about these features
since they are central in the Django web framework.

## Project Structure
- **admin.py**: Contains the registration of the Secret model in the admin portal.
- **forms.py**: Contains the definition of the forms used to create users and secrets.
- **models.py**: Contains the Secret model that we use to manipulate the Secret object.
- **serializers.py**: Contains the serializer for the Secret objects (needed for our REST API).
- **services.py**: Contains the business logic to generate the master key, and to encrypt and decrypt
date using the Fernet algorithm.
- **urls.py**: Contains the URLs of the application.
- **views.py**: Contains the views of the application --user authentication views and Secret manipulation views.