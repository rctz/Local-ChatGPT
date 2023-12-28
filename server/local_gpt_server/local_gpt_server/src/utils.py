from django.core.cache import cache

def get_chat_history(session_id):
    chat_history = cache.get(session_id)

    return chat_history