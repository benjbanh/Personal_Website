from django.urls import path
from . import views
from django.views.generic import TemplateView

app_name = "Home"

urlpatterns = [
    path("", views.index, name="index"),
    path("<str:name>", views.name, name="fuck"),
] 