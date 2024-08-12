
from django.shortcuts import render
from django.http import HttpResponse

from SkillTree.skillTree import optimizeSkills

def index(request):
    # result = optimizeSkills(10)               #Commented out until Front End finished 

    if request.method == "POST":
        level = request.POST.get('level')
        if level.isdigit():
            form_data = optimizeSkills(int(level))
            
        
            return render(request, 'SkillTree/index.html', {
                'form_data': form_data,
                })

    return render(request, 'SkillTree/index.html', {

    })
    
    # return render(request, 'SkillTree/index.html', {
    #     "score": result[0],
    #     "skills": result[1],
    # })
