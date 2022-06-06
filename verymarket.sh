python3 /apps/log_to_kafka.py &
gunicorn --bind 0.0.0.0:8000 config.wsgi:application 

