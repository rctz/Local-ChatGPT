import gpt4all
from model_config import ModelConfig
import sys
import os
from pathlib import Path

# Add the root directory of the project to the sys.path
sys.path.append(os.path.abspath(Path(__file__).resolve().parent.parent))

from message_channel.message_service import MessageService


class GPTService:
    def __init__(self):
        self.model = gpt4all.GPT4All(
            model_name=ModelConfig.MODEL_NAME,
            model_path=ModelConfig.MODEL_PATH,
            verbose=True,
            device=ModelConfig.DEVICE_MODE,
            n_threads=ModelConfig.N_THREADS,
        )


def callback(data):
    GPTModel = a.model.generate(data)
    print("Generated data", g)


if __name__ == "__main__":
    GPTModel = GPTService()
    MesService = MessageService()
    MesService.subscribe("gpt", callback)
