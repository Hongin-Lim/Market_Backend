from kafka import KafkaProducer
from json import dumps

# 카프카로 보내는 코드
producer = KafkaProducer(
    acks=0,
    compression_type='gzip',
    bootstrap_servers=['172.30.1.222:31256'],
    value_serializer=lambda x: dumps(x).encode('utf-8')
)
# django pod안에 log 파일을 불러오고 마지막줄 한줄을 origin 이라는 변수에 담는다.
inout_f = open('/apps/logs/log', 'r', encoding="UTF-8")
inout_lines = inout_f.readlines()
origin = inout_lines[-1]

while True:
    # django pod안에 log 파일을 마지막줄 한줄을 last 라는 변수에 담는다.
    inout_f = open('/apps/logs/log', 'r', encoding="UTF-8")
    inout_lines = inout_f.readlines()
    last = inout_lines[-1]
    # origin과 last log 파일이 다르면 추가 된 제일 마지막줄을 전처리 하고 카프카로 보낸다.
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
        producer.send('logdata_test2', value=data)
        producer.flush()
        origin = last # 오리진을 라스트와 똑같이 만들어 준다.
                      # 이유는 origin이 변화없이 그대로 있으면 데이터가 들어오지 않아도 계속 다르기떄문에 무한 반복 if절이 계속 돌아가기 때문.