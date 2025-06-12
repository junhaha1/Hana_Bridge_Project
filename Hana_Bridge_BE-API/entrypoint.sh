#!/bin/bash

# Zabbix Agent 포그라운드 실행
zabbix_agentd -f &
ZABBIX_PID=$!

# Spring Boot 애플리케이션 실행
exec java -jar /app/app.jar