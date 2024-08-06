from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
tasks = ["foo", "sh*t", "fool"]
def index(request):
    return render(request, "HOME/index.html", {
        'tasks' : tasks,
    })

def name(request, name):
    return render(request, "HOME/fuck.html",{
        "name": name.capitalize(),
    })