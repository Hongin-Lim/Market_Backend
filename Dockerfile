FROM lhi90/verymarket-main:0.1
FROM jerry2458/ubuntu-nginx:1.0
WORKDIR /apps
RUN apt-get update
RUN apt-get install python3-dev default-libmysqlclient-dev gcc  -y
COPY requirements.txt ./
RUN apt-get install python3-pip
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]
CMD ["/etc/init.d/nginx", "start"]


