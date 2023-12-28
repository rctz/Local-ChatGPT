import gpt4all
from config import model_config

class GPTModel():
    def __init__(self) -> None:
        self.model = gpt4all.GPT4All(model_name=model_config.MODEL_NAME)

    