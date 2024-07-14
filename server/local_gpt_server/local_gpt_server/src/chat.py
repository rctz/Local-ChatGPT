import gpt4all
from django.http import StreamingHttpResponse, JsonResponse, HttpResponse
import json
from django.views.decorators.csrf import csrf_exempt
import copy
from django.core.cache import cache
from ..config import model_config
from ..config import server_config
from ..src import utils
from .module import azure_test


def initial_chat(request):
    try:
        session_id = request.session.session_key
        chat_history = utils.get_chat_history(session_id)
        if chat_history is None:
            return JsonResponse({"chat_history": []})

        return JsonResponse(
            {"chat_history": chat_history["input_data"]["input_string"]}
        )
    except Exception as e:
        print(e)
        return JsonResponse({"error": "Something went wrong"}, status=400)


@csrf_exempt
def chat_stream_response(request):
    try:
        session_id = request.session.session_key
        chat_history = None
        if session_id is None:
            request.session.create()
            session_id = request.session.session_key
        else:
            chat_history = cache.get(session_id)

        message = json.loads(request.body)["message"]
        result, normalize_json = azure_test.invoke_azure_endpoint_sync(
            {
                "role": "user",
                "content": message,
            },
            chat_history,
        )

        ## Save chat history to cache
        cache.set(session_id, normalize_json, timeout=server_config.SESSION_KEEP_TIME)
        response = HttpResponse(result["output"])

    except Exception as e:
        print(e)
        response = JsonResponse({"error": "Something went wrong"}, status=400)

    return response
