from django.urls import path
from . import views

app_name = "Home"

urlpatterns = [
    path("", views.index, name="index"),
    path("test/", views.draggable_divs_view, name="temp"),
]