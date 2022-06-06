gunicorn --bind 0.0.0.0:8000 config.wsgi:application;
python3 log_to_kafka.py