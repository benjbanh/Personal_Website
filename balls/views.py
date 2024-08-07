from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'balls/index.html')

def preview(request):
    return render(request, 'balls/preview.html')