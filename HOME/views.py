from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def index(request):
    return render(request, "HOME/index.html", {
        
    })

def name(request, name):
    return render(request, "HOME/fuck.html",{
        "name": name.capitalize(),
    })