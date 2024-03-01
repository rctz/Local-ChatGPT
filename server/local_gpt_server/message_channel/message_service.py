import redis
from .config import RedisConfic


class MessageService:
    def __init__(self):
        self.con = redis.Redis(
            host=RedisConfic.REDIS_IP, port=RedisConfic.REDIS_PORT, db=0
        )

    def publish(self, message, channel):
        self.con.publish(channel, message)

    def subscribe(self, channel, callback):
        self.pubsub = self.con.pubsub()
        self.pubsub.subscribe(channel)

        print("AI Service started listening for messages...")
        for message in self.pubsub.listen():
            if message["type"] == "message":
                data = message["data"].decode("utf-8")
                if callback and callable(callback):
                    callback(data)
