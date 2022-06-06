FROM lhi90/verymarket-main:0.1
WORKDIR /apps
RUN apt-get update
RUN apt-get install python3-dev default-libmysqlclient-dev gcc  -y
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["/bin/bash", "/apps/verymarket.sh"]
