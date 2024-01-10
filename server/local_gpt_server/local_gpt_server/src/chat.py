import gpt4all
from django.http import StreamingHttpResponse, JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
import copy
from django.core.cache import cache
from ..config import model_config
from ..config import server_config
from ..src import utils


# model = GPT4All("wizardlm-13b-v1.1-superhot-8k.ggmlv3.q4_0.bin")
model = gpt4all.GPT4All(
    model_name=model_config.MODEL_NAME, model_path=model_config.MODEL_PATH
)
# model = GPT4All(model_name='orca-mini-13b.ggmlv3.q4_0.bin')


def initial_chat(request):
    try:
        session_id = request.session.session_key
        chat_history = utils.get_chat_history(session_id)
        if chat_history is None:
            chat_history = [None]

        return JsonResponse({"chat_history": chat_history[1:]})
    except Exception as e:
        print(e)
        return JsonResponse({"error": "Something went wrong"}, status=400)


@csrf_exempt
def chat_stream_response(request):
    try:
        session_id = request.session.session_key
        chat_history = None
        system_prompt = model.config["systemPrompt"]
        if session_id is None:
            request.session.create()
            session_id = request.session.session_key
        else:
            chat_history = cache.get(session_id)

        if chat_history is None:
            if model_config.MODEL_SYSTEM_PROMPT != "":
                system_prompt = model_config.MODEL_SYSTEM_PROMPT
            chat_history = [{"role": "system", "content": system_prompt}]

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
                cache.set(
                    session_id,
                    copy.deepcopy(session.current_chat_session),
                    60 * server_config.SESSION_KEEP_TIME,
                )

        message = json.loads(request.body)["message"]
        response = StreamingHttpResponse(
            generate_response(message, chat_history, stream=True),
            content_type="application/octet-stream",
        )
    except Exception as e:
        print(e)
        response = JsonResponse({"error": "Something went wrong"}, status=400)

    return response
