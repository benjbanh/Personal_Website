from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def projects(request):
    return render(request, "HOME/projects.html")

def index(request):
    return render(request, "HOME/index.html")

def about(request):
    return render(request, "HOME/about.html")

def test(request):
    return render(request, "HOME/test.html")