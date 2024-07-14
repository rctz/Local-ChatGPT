import json
import os
import ssl
import aiohttp
import asyncio
import copy
from local_gpt_server.config import server_config
from dotenv import dotenv_values

# Load variables from the .env file into a dictionary
env_vars = dotenv_values(server_config.ENVIRONMENT_FILE_PATH)

# Access variables
API_KEY = env_vars.get("AZURE_API_KEY")


def allowSelfSignedHttps(allowed):
    # Bypass the server certificate verification on the client side
    if (
        allowed
        and not os.environ.get("PYTHONHTTPSVERIFY", "")
        and getattr(ssl, "_create_unverified_context", None)
    ):
        ssl._create_default_https_context = ssl._create_unverified_context


allowSelfSignedHttps(
    True
)  # This line is needed if you use a self-signed certificate in your scoring service.


def normalize_message_format(message, history):
    data_template = {
        "input_data": {
            "input_string": [],
            "parameters": {
                "temperature": 0.6,
                "top_p": 0.9,
                "do_sample": True,
                "max_new_tokens": 200,
                "return_full_text": False,
            },
        }
    }

    if history:
        tmp = copy.deepcopy(history)
        tmp["input_data"]["input_string"].append(message)
        return tmp
    else:
        data_template["input_data"]["input_string"].append(message)
        return data_template


async def invoke_azure_endpoint_async(message, history):
    normalize_format = normalize_message_format(message, history)

    body = json.dumps(normalize_format)
    url = "https://test-other-llms-22-oazdm.eastus.inference.ml.azure.com/score"
    api_key = API_KEY

    if not api_key:
        raise Exception("A key should be provided to invoke the endpoint")

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
        "azureml-model-deployment": "mistralai-mistral-7b-instruct-4",
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(url, headers=headers, data=body) as response:
            if response.status != 200:
                print("The request failed with status code: " + str(response.status))
                print(await response.json())
                return None
            else:
                result = await response.json()
                normalize_format = normalize_message_format(
                    {"role": "assistant", "content": result["output"]}, normalize_format
                )
                return result, normalize_format


def invoke_azure_endpoint_sync(message, history):
    loop = asyncio.new_event_loop()
    result, normalize = loop.run_until_complete(
        invoke_azure_endpoint_async(message, history)
    )
    loop.close()
    return result, normalize
