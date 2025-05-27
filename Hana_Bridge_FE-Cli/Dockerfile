# frontend/Dockerfile
FROM nginx:stable-alpine

# GitHub Actions에서 빌드된 dist/만 복사
COPY dist/ /usr/share/nginx/html

# nginx 설정 (필요시)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
