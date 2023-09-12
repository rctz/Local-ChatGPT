from django.http import HttpResponse
from .src import chat
from django.shortcuts import render

def chat_view(request):
    return render(request, 'chat_template.html')