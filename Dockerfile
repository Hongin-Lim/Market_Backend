FROM lhi90/verymarket-main:0.1
WORKDIR /apps
RUN apt-get update
RUN apt-get install python3-dev default-libmysqlclient-dev gcc  -y
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]
RUN apt-get install nginx
RUN /etc/init.d/nginx start
COPY default.conf /etc/nginx/conf.d
RUN /etc/init.d/nginx restart

