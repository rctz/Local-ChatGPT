from gpt4all import GPT4All
from django.http import HttpResponse, JsonResponse, StreamingHttpResponse
import json
from django.views.decorators.csrf import csrf_exempt
import copy


#model = GPT4All("wizardlm-13b-v1.1-superhot-8k.ggmlv3.q4_0.bin")
model = GPT4All(model_name='orca-mini-3b.ggmlv3.q4_0.bin')
#model = GPT4All(model_name='orca-mini-13b.ggmlv3.q4_0.bin')



@csrf_exempt
def chat_stream_response(request):
    if "chat_history" in request.session:
        chat_history = request.session['chat_history']
        print(chat_history)
    else:
        chat_history = []
        request.session['chat_history'] = chat_history
        
        
    def generate_response(prompt, chat_history, max_tokens=600, temp=0.5, stream=False):
        with model.chat_session() as sesstion:
            sesstion.current_chat_session = copy.deepcopy(chat_history)
            response = sesstion.generate(prompt=prompt, max_tokens=max_tokens, temp=temp, streaming=stream)
            for chunk in response:
                # Yield the response chunk to stream to the client
                yield chunk

            request.session['chat_history'] = copy.deepcopy(sesstion.current_chat_session)
            print(request.session['chat_history'])


    message = json.loads(request.body)['message']
    response = StreamingHttpResponse(generate_response(message, chat_history, max_tokens=200, temp=0.5, stream=True), content_type="application/octet-stream")
    
    return response