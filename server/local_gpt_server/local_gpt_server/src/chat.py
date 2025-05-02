import gpt4all
from django.http import StreamingHttpResponse, JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
import copy
from django.core.cache import cache
from ..config.model_config import ModelConfig
from ..config.server_config import ServerConfig
from ..src import utils
from message_channel.message_service import MessageService


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


# @csrf_exempt
# def chat_stream_response(request):
#     try:
#         session_id = request.session.session_key
#         chat_history = None
#         system_prompt = model.config["systemPrompt"]
#         if session_id is None:
#             request.session.create()
#             session_id = request.session.session_key
#         else:
#             chat_history = cache.get(session_id)

#         if chat_history is None:
#             if ModelConfig.MODEL_SYSTEM_PROMPT != "":
#                 system_prompt = ModelConfig.MODEL_SYSTEM_PROMPT
#             chat_history = [{"role": "system", "content": system_prompt}]

#         def generate_response(prompt, chat_history, stream=False):
#             with model.chat_session() as session:
#                 session.current_chat_session = copy.deepcopy(chat_history)
#                 response = session.generate(
#                     prompt=prompt,
#                     max_tokens=ModelConfig.MAX_TOKEN,
#                     temp=ModelConfig.TEMP,
#                     streaming=stream,
#                 )
#                 # print("Hello", model.current_chat_session)
#                 for chunk in response:
#                     # Yield the response chunk to stream to the client
#                     yield chunk

#                 # Expire in 15minutes
#                 cache.set(
#                     session_id,
#                     copy.deepcopy(session.current_chat_session),
#                     ServerConfig.build_session_time(),
#                 )

#         message = json.loads(request.body)["message"]
#         # print(type(generate_response(message, chat_history, stream=True)))
#         response = StreamingHttpResponse(
#             generate_response(message, chat_history, stream=True),
#             content_type="application/octet-stream",
#         )
#     except Exception as e:
#         print(e)
#         response = JsonResponse({"error": "Something went wrong"}, status=400)
#     pass
#     return response


@csrf_exempt
def chat_stream_response(request):
    MesService = MessageService()
    message = json.loads(request.body)["message"]
    MesService.publish(message, "gpt")
    return JsonResponse({"message": message}, status=200)
