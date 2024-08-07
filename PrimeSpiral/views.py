from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'PrimeSpiral/index.html')

def preview(request):
    return render(request, 'PrimeSpiral/preview.html')