from queue import Queue, Empty
import threading
import logging
import sys
import paho.mqtt.client as mqtt
from agt import AlexaGadget

logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)
logger = logging.getLogger(__name__)


class Listener(threading.Thread):
    def __init__(self, queue=Queue()):
        super(Listener, self).__init__()
        self.queue = queue
        self.daemon = True

    def on_connect(self, client, userdata, flags, rc):
        print("Connected!")
        client.subscribe("/alert")

    def on_message(self, client, userdata, msg):
        self.on_event(int(msg.payload))

    def on_event(self, cm):
        pass

    def run(self):
        client = mqtt.Client()
        client.on_connect = self.on_connect
        client.on_message = self.on_message

        client.connect('192.168.1.87', 1883, 60)
        client.loop_forever()


class Gadget(AlexaGadget):
    def __init__(self):
        super().__init__()
        Listener.on_event = self._emit_event

    def _emit_event(self, cm):
        logger.info("_emit_event {}".format(cm))
        payload = {'cm': cm}
        self.send_custom_event('Custom.gonzalo123', 'sensor', payload)


l = Listener()
l.start()


def main():
    gadget = Gadget()
    gadget.main()


if __name__ == '__main__':
    main()
