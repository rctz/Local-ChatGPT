from django.http import HttpResponse
from .src import chat
from django.shortcuts import render

def text_response(request):
    # Your text content here
    text = "This is plain text returned by a Django view."
    content = chat.chat_generate(text)
    
    # Create an HttpResponse with the text content
    response = HttpResponse(content, content_type="text/plain")
    
    return response

def chat_view(request):
    return render(request, 'chat_template.html')