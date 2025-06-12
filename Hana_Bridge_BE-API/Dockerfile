# backend/Dockerfile
FROM openjdk:21-slim

# zabbix-agent 설치
RUN apt-get update && \
    apt-get install -y zabbix-agent && \
    apt-get clean

RUN mkdir -p /var/log/zabbix && \
    touch /var/log/zabbix/zabbix_agentd.log && \
    chown -R zabbix:zabbix /var/log/zabbix && \
    chmod 644 /var/log/zabbix/zabbix_agentd.log
# Zabbix 설정파일 덮어쓰기 (필요 시)
COPY zabbix_agentd.conf /etc/zabbix/zabbix_agentd.conf

# Entrypoint 스크립트 복사
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

WORKDIR /app
# GitHub Actions에서 만든 .jar만 복사
COPY build/libs/Hana_Bridge_BE-API-0.0.1.jar app.jar

ENTRYPOINT ["/entrypoint.sh"]