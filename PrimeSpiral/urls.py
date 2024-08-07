from django.urls import path
from . import views

app_name = "PrimeSpiral"

urlpatterns = [
    path("", views.index, name="index"),
    path("preview/", views.preview, name="preview")
]