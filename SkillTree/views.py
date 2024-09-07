
##################################################################

from django.shortcuts import render
from django import forms

from SkillTree.skillTree import optimizeSkills

class DraggableDivForm(forms.Form):
    ordered_divs = forms.CharField(widget=forms.HiddenInput())

def index(request):
    # result = optimizeSkills(10)               #Commented out until Front End finished 
    # Default order of divs
    divs = [
        {"id": "1", "name": "Dominance"},
        {"id": "2", "name": "Damage"},
        {"id": "3", "name": "Stamina"},
        {"id": "4", "name": "Defense"},
        {"id": "5", "name": "Stamina recovery"},
        {"id": "6", "name": "Defense recovery"},
        {"id": "7", "name": "Wealth"},
        {"id": "8", "name": "Speed"},
        {"id": "9", "name": "Health"},
        {"id": "10", "name": "Glory"},
    ]

    ordered_divs = None
    form_data = None
    if request.method == 'POST':
        form = DraggableDivForm(request.POST)
        level = request.POST.get('level')
        if form.is_valid() and level.isdigit():
            form_data = optimizeSkills(int(level))

            ordered_divs = form.cleaned_data['ordered_divs']
            # Reorder the divs based on the submitted order
            div_order = ordered_divs.split(',')
            divs = sorted(divs, key=lambda x: div_order.index(x["id"]))
    else:
        form = DraggableDivForm()

    return render(request, 'SkillTree/index.html', {
        'form': form, 
        'form_data': form_data, 
        'divs': divs, 
        'ordered_divs': ordered_divs})