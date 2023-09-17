from gpt4all import GPT4All
from django.http import HttpResponse, JsonResponse, StreamingHttpResponse
import json
#model = GPT4All("wizardlm-13b-v1.1-superhot-8k.ggmlv3.q4_0.bin")
model = GPT4All(model_name='orca-mini-3b.ggmlv3.q4_0.bin')
#model = GPT4All(model_name='orca-mini-13b.ggmlv3.q4_0.bin')


def chat_generate(prompt, max_tokens=600, temp=0.5, stream=False):
    response1 =  model.generate(prompt=prompt, max_tokens=max_tokens, temp=temp, streaming=stream)
    return response1

def chat_response(request):
    message = json.loads(request.body)['message']
    response = chat_generate(message, max_tokens=100, temp=0.7)
    responseJson = {
        "message": response,
    }
    responseJson = json.dumps(responseJson)
    return JsonResponse(responseJson, safe=False)

def chat_stream_response(request):
    message = json.loads(request.body)['message']
    response = chat_generate(message, max_tokens=100, temp=0.5, stream=True)
    return StreamingHttpResponse(response)