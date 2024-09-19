from django.urls import path
from . import views

app_name = "Home"

urlpatterns = [
    path("", views.index, name="index"),
    path("projects/", views.projects, name="projects"),
    path("experience/", views.experience, name="experience"),
    
    path("test/", views.test, name="test"),
]