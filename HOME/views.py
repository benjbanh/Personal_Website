from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def index(request):
    return render(request, "HOME/index.html")

def projects(request):
    return render(request, "HOME/projects.html")

def experience(request):
    return render(request, "HOME/experience.html")


def test(request):
    return render(request, "HOME/test.html")