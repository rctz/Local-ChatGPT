import gpt4all
import model_config


class GPTService:
    def __init__(self):
        self.model = gpt4all.GPT4All(
            model_name=model_config.MODEL_NAME,
            model_path=model_config.MODEL_PATH,
            verbose=True,
            device=model_config.MODE,
            n_threads=model_config.N_THREADS,
        )
