#!/bin/bash

# Zabbix Agent 시작 (백그라운드)
zabbix_agentd

# Spring Boot 애플리케이션 실행
nginx -g "daemon off;"