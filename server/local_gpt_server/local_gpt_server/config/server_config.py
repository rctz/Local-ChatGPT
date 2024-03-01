class ServerConfig:

    # Redis config section
    REDIS_IP = "localhost"
    REDIS_PORT = 6379

    # Session settings
    SESSION_TIME = 60  # Minutes

    @staticmethod
    def build_redis_url():
        return f"redis://{ServerConfig.REDIS_IP}:{ServerConfig.REDIS_PORT}"

    @staticmethod
    def build_session_time():
        return ServerConfig.SESSION_TIME * 60
