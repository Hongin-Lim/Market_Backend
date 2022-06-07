from kafka import KafkaProducer
from json import dumps


producer = KafkaProducer(
    acks=0,
    compression_type='gzip',
    bootstrap_servers=['172.30.1.222:31256'],
    value_serializer=lambda x: dumps(x).encode('utf-8')
)

inout_f = open('/apps/logs/log', 'r', encoding="UTF-8")
inout_lines = inout_f.readlines()
origin = inout_lines[-1]

while True:
    inout_f = open('/apps/logs/log', 'r', encoding="UTF-8")
    inout_lines = inout_f.readlines()
    last = inout_lines[-1]
    if last != origin:
        data = last.strip().split(' ')
        print(data)
        time = data[1]
        order_num = data[4].split(':')[1]
        user_num = data[5].split(':')[1]
        item = data[6].split(':')[1]
        item_ea = data[7].split(':')[1]
        print(time, order_num, user_num, item, item_ea)
        data = {
            'time' : time,
            'order_num': order_num,
            'user_num': user_num,
            'item': item,
            'item_ea': item_ea,
        }
        producer.send('final_logdata', value=data)
        producer.flush()
        origin = last