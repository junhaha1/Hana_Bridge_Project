#!/bin/bash

# Zabbix Agent 시작 (백그라운드)
service zabbix-agent start

# Spring Boot 애플리케이션 실행
exec java -jar /app/app.jar