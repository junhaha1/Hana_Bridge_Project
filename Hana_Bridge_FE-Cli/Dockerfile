# frontend/Dockerfile
FROM nginx:stable-alpine

# zabbix-agent 설치를 위한 패키지 추가
RUN apk update && \
    apk add --no-cache zabbix-agent bash curl

# Zabbix 설정파일 복사
COPY zabbix_agentd.conf /etc/zabbix/zabbix_agentd.conf

# React 빌드 파일 복사
COPY dist/ /usr/share/nginx/html

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 엔트리포인트 스크립트 복사
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

CMD ["/entrypoint.sh"]