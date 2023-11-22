import gpt4all
from django.http import StreamingHttpResponse
import json
from django.views.decorators.csrf import csrf_exempt
import copy
from django.core.cache import cache
from ..config import model_config


# model = GPT4All("wizardlm-13b-v1.1-superhot-8k.ggmlv3.q4_0.bin")
model = gpt4all.GPT4All(model_name=model_config.MODEL_NAME)
# model = GPT4All(model_name='orca-mini-13b.ggmlv3.q4_0.bin')


@csrf_exempt
def chat_stream_response(request):
    session_id = request.session.session_key
    chat_history = None
    if session_id is None:
        request.session.create()
        session_id = request.session.session_key
    else:
        chat_history = cache.get(session_id)

    if chat_history is None:
        chat_history = [{"role": "system", "content": model.config["systemPrompt"]}]

    def generate_response(prompt, chat_history, stream=False):
        with model.chat_session() as session:
            session.current_chat_session = copy.deepcopy(chat_history)
            response = session.generate(
                prompt=prompt,
                max_tokens=model_config.MAX_TOKEN,
                temp=model_config.TEMP,
                streaming=stream,
            )
            for chunk in response:
                # Yield the response chunk to stream to the client
                yield chunk

            # Expire in 15minutes
            cache.set(session_id, copy.deepcopy(session.current_chat_session), 60 * 15)

    message = json.loads(request.body)["message"]
    response = StreamingHttpResponse(
        generate_response(message, chat_history, max_tokens=200, temp=0.5, stream=True),
        content_type="application/octet-stream",
    )

    return response
