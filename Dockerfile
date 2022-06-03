FROM lhi90/verymarket-main:0.1
FROM nginx:latest
WORKDIR /apps
RUN apt-get update
RUN apt-get install python3-dev default-libmysqlclient-dev gcc  -y
COPY requirements.txt ./
RUN apt-get install python3-pip -y
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]
COPY default.conf /etc/nginx/conf.d
EXPOSE 81
CMD ["nginx", "-g", "daemon off;"]

