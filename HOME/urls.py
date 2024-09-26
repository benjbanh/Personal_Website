from django.urls import path
from . import views

app_name = "Home"

urlpatterns = [
    path("", views.index, name="index"),
    path("experience/", views.experience, name="experience"),
    
    path("test/", views.test, name="test"),
    path("test2/", views.test2, name="test2"),
]