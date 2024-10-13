from django.shortcuts import render

# Create your views here.
def index(request):
    resume = "HOME/resume.pdf"
    return render(request, "HOME/index.html", {'pdf_file': resume})

def experience(request):
    return render(request, "HOME/experience.html")


def test(request):
    return render(request, "HOME/test.html")

def test2(request):
    return render(request, "HOME/test2.html")