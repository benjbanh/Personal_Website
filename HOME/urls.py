from django.urls import path
from . import views

app_name = "Home"

urlpatterns = [
    path("", views.index, name="index"),
    path("projects/", views.projects, name="projects"),
    path("test/", views.test, name="test"),
    path("about/", views.about, name="about"),
]