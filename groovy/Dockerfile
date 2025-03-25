FROM nginx:alpine

# Копируем файлы документации
COPY index.html /usr/share/nginx/html/
COPY jenkins_pipeline_guide.md /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/

# Копируем конфигурацию Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Устанавливаем необходимые пакеты
RUN apk add --no-cache curl

# Проверяем конфигурацию Nginx
RUN nginx -t

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 