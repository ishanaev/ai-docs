# Jenkins Pipeline Guide Documentation

Документация по Jenkins Pipeline с примерами использования.

## Структура проекта

```
.
├── index.html              # Главная страница
├── jenkins_pipeline_guide.md  # Markdown файл с документацией
├── css/                    # Стили
│   └── style.css
├── js/                     # JavaScript файлы
│   └── main.js
├── nginx.conf             # Конфигурация Nginx
└── Dockerfile             # Dockerfile для сборки образа
```

## Зависимости

- Node.js (для локальной разработки)
- Docker (для развертывания)
- Nginx (внутри Docker)

## Локальная разработка

1. Установите зависимости:
```bash
npm install -g marked
```

2. Запустите локальный сервер:
```bash
python -m http.server 8000
```

3. Откройте http://localhost:8000 в браузере

## Развертывание через Docker

1. Соберите Docker образ:
```bash
docker build -t jenkins-pipeline-guide .
```

2. Запустите контейнер:
```bash
docker run -d -p 80:80 jenkins-pipeline-guide
```

3. Откройте http://localhost в браузере

## Особенности

- Автоматическое оглавление
- Подсветка синтаксиса кода
- Адаптивный дизайн
- Плавная прокрутка
- Кэширование статических файлов
- Сжатие контента

## Лицензия

MIT 