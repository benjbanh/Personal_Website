from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def index(request):
    return render(request, "HOME/index.html", {
        
    })

# def test(request, test):
#     return render(request, "HOME/fuck.html", {
        
#     })

# views.py
from django import forms

class DraggableDivForm(forms.Form):
    ordered_divs = forms.CharField(widget=forms.HiddenInput())

def draggable_divs_view(request):
    # Default order of divs
    divs = [
        {"id": "1", "name": "Div 1"},
        {"id": "2", "name": "Div 2"},
        {"id": "3", "name": "Div 3"},
        {"id": "4", "name": "Div 4"},
        {"id": "5", "name": "Div 5"},
        {"id": "6", "name": "Div 6"},
        {"id": "7", "name": "Div 7"},
    ]
    ordered_divs = None

    if request.method == 'POST':
        form = DraggableDivForm(request.POST)
        if form.is_valid():
            ordered_divs = form.cleaned_data['ordered_divs']
            # Reorder the divs based on the submitted order
            div_order = ordered_divs.split(',')
            divs = sorted(divs, key=lambda x: div_order.index(x["id"]))
    else:
        form = DraggableDivForm()

    return render(request, 'HOME/fuck.html', {'form': form, 'divs': divs, 'ordered_divs': ordered_divs})
