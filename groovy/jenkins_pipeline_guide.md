# Руководство по Groovy DSL для Jenkins Scripted Pipeline

## Содержание
1. [Теоретические основы](#1-теоретические-основы)
2. [Практические примеры](#2-практические-примеры)
3. [Лучшие практики](#3-лучшие-практики)
4. [Отладка и мониторинг](#4-отладка-и-мониторинг)
5. [Продвинутые техники](#5-продвинутые-техники)
6. [Полезные ресурсы](#6-полезные-ресурсы)

## 1. Теоретические основы

### 1.1 Groovy как язык для Jenkins Pipeline

Groovy - это объектно-ориентированный язык программирования для JVM, который является идеальным выбором для Jenkins Pipeline по следующим причинам:

- Полная совместимость с Java
- Динамическая типизация
- Поддержка замыканий
- Упрощенный синтаксис
- Встроенная поддержка коллекций и строк

### 1.2 Архитектура Jenkins Pipeline

Jenkins Pipeline состоит из следующих ключевых компонентов:

```groovy
// Базовая структура
node {                    // Выделяет исполнителя
    stage('Stage 1') {    // Определяет этап
        steps {           // Содержит шаги
            // Действия
        }
    }
}
```

## 2. Практические примеры

### 2.1 Базовые конструкции

#### 2.1.1 Переменные и типы данных
```groovy
// Выбор ноды по метке
node('linux') {
    // Определение переменных
    def stringVar = "Hello"
    def numberVar = 42
    def listVar = [1, 2, 3]
    def mapVar = [key: "value"]
    
    // Использование переменных
    echo "String: ${stringVar}"
    echo "Number: ${numberVar}"
    echo "List: ${listVar}"
    echo "Map: ${mapVar}"
}
```

#### 2.1.2 Работа со строками
```groovy
// Выбор ноды по имени
node('jenkins-master') {
    def name = "Jenkins"
    // Интерполяция строк
    echo "Hello ${name}"
    // Многострочные строки
    sh '''
        echo "Line 1"
        echo "Line 2"
    '''
}
```

#### 2.1.3 Условные конструкции
```groovy
// Выбор ноды с поддержкой условных конструкций
node('conditional-slave') {
    // Простое условие if-else
    if (env.BRANCH_NAME == 'main') {
        echo "Это main ветка"
    } else {
        echo "Это не main ветка"
    }
    
    // Условие с else if
    def environment = 'dev'
    if (environment == 'prod') {
        echo "Продакшн окружение"
    } else if (environment == 'staging') {
        echo "Стейджинг окружение"
    } else {
        echo "Разработка"
    }
    
    // Тернарный оператор
    def status = currentBuild.result == 'SUCCESS' ? 'Успешно' : 'Ошибка'
    
    // Условие when в stage
    stage('Deploy') {
        when {
            expression { return env.BRANCH_NAME == 'main' }
        }
        steps {
            echo "Деплой в продакшн"
        }
    }
}
```

#### 2.1.4 Циклы
```groovy
// Выбор ноды с поддержкой циклов
node('loop-slave') {
    // Цикл for
    for (int i = 0; i < 5; i++) {
        echo "Итерация ${i}"
    }
    
    // Цикл while
    def counter = 0
    while (counter < 3) {
        echo "Счетчик: ${counter}"
        counter++
    }
    
    // Цикл по списку
    def languages = ['Java', 'Python', 'JavaScript']
    for (lang in languages) {
        echo "Язык программирования: ${lang}"
    }
    
    // Цикл по словарю
    def config = [
        'app_name': 'myapp',
        'version': '1.0.0',
        'environment': 'dev'
    ]
    config.each { key, value ->
        echo "${key}: ${value}"
    }
    
    // Цикл с break
    for (int i = 0; i < 10; i++) {
        if (i == 5) {
            break
        }
        echo "До break: ${i}"
    }
    
    // Цикл с continue
    for (int i = 0; i < 5; i++) {
        if (i == 2) {
            continue
        }
        echo "После continue: ${i}"
    }
}
```

#### 2.1.5 Работа со списками
```groovy
// Выбор ноды с поддержкой списков
node('list-slave') {
    // Создание списков
    def numbers = [1, 2, 3, 4, 5]
    def mixed = [1, 'string', true, null]
    
    // Добавление элементов
    numbers.add(6)
    numbers << 7
    numbers += 8
    
    // Удаление элементов
    numbers.remove(0)
    numbers -= 5
    
    // Получение элементов
    def first = numbers[0]
    def last = numbers[-1]
    def range = numbers[1..3]
    
    // Методы списков
    echo "Размер списка: ${numbers.size()}"
    echo "Содержит 3: ${numbers.contains(3)}"
    echo "Индекс 3: ${numbers.indexOf(3)}"
    
    // Сортировка
    def sorted = numbers.sort()
    def reversed = numbers.reverse()
    
    // Фильтрация
    def even = numbers.findAll { it % 2 == 0 }
    def anyEven = numbers.any { it % 2 == 0 }
    def everyEven = numbers.every { it % 2 == 0 }
    
    // Преобразование
    def doubled = numbers.collect { it * 2 }
    def sum = numbers.sum()
    def max = numbers.max()
    def min = numbers.min()
}
```

#### 2.1.6 Работа со словарями
```groovy
// Выбор ноды с поддержкой словарей
node('dict-slave') {
    // Создание словарей
    def config = [
        'app_name': 'myapp',
        'version': '1.0.0',
        'environment': 'dev'
    ]
    
    // Добавление элементов
    config['port'] = 8080
    config.put('host', 'localhost')
    
    // Удаление элементов
    config.remove('environment')
    
    // Получение элементов
    def appName = config['app_name']
    def version = config.version
    
    // Проверка наличия ключа
    echo "Содержит version: ${config.containsKey('version')}"
    
    // Методы словарей
    echo "Ключи: ${config.keySet()}"
    echo "Значения: ${config.values()}"
    echo "Размер: ${config.size()}"
    
    // Итерация по словарю
    config.each { key, value ->
        echo "${key}: ${value}"
    }
    
    // Фильтрация
    def filtered = config.findAll { key, value ->
        value instanceof String
    }
    
    // Преобразование
    def upperConfig = config.collectEntries { key, value ->
        [key.toUpperCase(), value.toString().toUpperCase()]
    }
}
```

#### 2.1.7 Регулярные выражения
```groovy
// Выбор ноды с поддержкой регулярных выражений
node('regex-slave') {
    // Создание регулярного выражения
    def emailPattern = ~/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    def versionPattern = ~/^\d+\.\d+\.\d+$/
    
    // Проверка соответствия
    def email = 'user@example.com'
    echo "Валидный email: ${email ==~ emailPattern}"
    
    // Поиск совпадений
    def text = "Версия 1.2.3 и 2.0.0"
    def versions = text.findAll(/\d+\.\d+\.\d+/)
    echo "Найденные версии: ${versions}"
    
    // Замена
    def replaced = text.replaceAll(/\d+\.\d+\.\d+/, 'X.Y.Z')
    echo "После замены: ${replaced}"
    
    // Группы
    def url = "https://example.com/path/to/resource"
    def urlPattern = ~/^https?:\/\/([^\/]+)(\/.*)$/
    def matcher = url =~ urlPattern
    if (matcher) {
        echo "Домен: ${matcher[0][1]}"
        echo "Путь: ${matcher[0][2]}"
    }
    
    // Валидация параметров
    def validateVersion(String version) {
        if (!(version ==~ versionPattern)) {
            error "Неверный формат версии: ${version}"
        }
    }
    
    // Извлечение данных
    def logLine = "ERROR [2024-03-15 10:30:45] User authentication failed"
    def logPattern = ~/^(\w+)\s+\[(.*?)\]\s+(.*)$/
    def logMatcher = logLine =~ logPattern
    if (logMatcher) {
        echo "Уровень: ${logMatcher[0][1]}"
        echo "Время: ${logMatcher[0][2]}"
        echo "Сообщение: ${logMatcher[0][3]}"
    }
}

### 2.2 Продвинутые конструкции

#### 2.2.1 Параллельное выполнение
```groovy
// Выбор ноды с поддержкой Docker
node('docker-slave') {
    parallel(
        'Unit Tests': {
            stage('Unit Tests') {
                sh 'mvn test'
            }
        },
        'Integration Tests': {
            stage('Integration Tests') {
                sh 'mvn verify'
            }
        }
    )
}
```

#### 2.2.2 Обработка ошибок
```groovy
// Выбор ноды с поддержкой Java
node('java-slave') {
    stage('Error Handling') {
        try {
            sh 'risky-command.sh'
        } catch (Exception e) {
            echo "Error: ${e.message}"
            currentBuild.result = 'FAILURE'
        } finally {
            // Очистка
            cleanWs()
        }
    }
}
```

### 2.3 Примеры CI/CD Pipeline

#### 2.3.1 Maven проект
```groovy
// Выбор ноды с поддержкой Maven
node('maven-slave') {
    stage('Checkout') {
        checkout scm
    }
    
    stage('Build') {
        sh 'mvn clean package'
    }
    
    stage('Test') {
        sh 'mvn test'
    }
    
    stage('Deploy') {
        sh 'mvn deploy'
    }
}
```

#### 2.3.2 Docker проект
```groovy
// Выбор ноды с поддержкой Docker и AWS
node('docker-aws-slave') {
    stage('Checkout') {
        checkout scm
    }
    
    stage('Build') {
        sh '''
            docker build -t myapp:${BUILD_NUMBER} .
            docker tag myapp:${BUILD_NUMBER} myapp:latest
        '''
    }
    
    stage('Test') {
        sh 'docker run myapp:${BUILD_NUMBER} ./test.sh'
    }
    
    stage('Deploy') {
        withCredentials([usernamePassword(credentialsId: 'docker-hub', 
                                       usernameVariable: 'DOCKER_USER', 
                                       passwordVariable: 'DOCKER_PASSWORD')]) {
            sh '''
                docker login -u $DOCKER_USER -p $DOCKER_PASSWORD
                docker push myapp:${BUILD_NUMBER}
                docker push myapp:latest
            '''
        }
    }
}
```

#### 2.3.3 Node.js проект
```groovy
// Выбор ноды с поддержкой Node.js
node('nodejs-slave') {
    stage('Checkout') {
        checkout scm
    }
    
    stage('Setup') {
        sh 'npm install'
    }
    
    stage('Test') {
        sh 'npm test'
    }
    
    stage('Build') {
        sh 'npm run build'
    }
    
    stage('Deploy') {
        sh 'npm run deploy'
    }
}
```

### 2.4 Работа с параметрами

```groovy
// Выбор ноды с поддержкой всех необходимых инструментов
node('full-stack-slave') {
    properties([
        parameters([
            string(name: 'VERSION', defaultValue: '1.0.0'),
            choice(name: 'ENVIRONMENT', choices: ['dev', 'staging', 'prod']),
            booleanParam(name: 'RUN_TESTS', defaultValue: true)
        ])
    ])

    stage('Build') {
        sh "mvn clean package -Dversion=${params.VERSION}"
    }
    
    stage('Test') {
        if (params.RUN_TESTS) {
            sh 'mvn test'
        }
    }
    
    stage('Deploy') {
        sh "./deploy.sh ${params.ENVIRONMENT}"
    }
}
```

### 2.5 Динамические параметры

#### 2.5.1 Динамический выбор веток
```groovy
// Выбор ноды с поддержкой Git
node('git-slave') {
    def getBranches() {
        def branches = []
        sh(script: 'git branch -r', returnStdout: true).trim().split('\n').each { branch ->
            branches.add(branch.replace('origin/', '').trim())
        }
        return branches
    }

    properties([
        parameters([
            choice(name: 'BRANCH', choices: getBranches()),
            string(name: 'VERSION', defaultValue: '1.0.0')
        ])
    ])

    stage('Checkout') {
        checkout([$class: 'GitSCM',
                 branches: [[name: "*/${params.BRANCH}"]],
                 userRemoteConfigs: [[url: 'https://github.com/org/repo.git']]])
    }
}
```

#### 2.5.2 Динамический выбор окружений
```groovy
// Выбор ноды с поддержкой HTTP запросов
node('http-slave') {
    def getEnvironments() {
        def envs = []
        def response = httpRequest 'https://api.example.com/environments'
        if (response.status == 200) {
            def json = readJSON text: response.content
            json.each { env ->
                envs.add(env.name)
            }
        }
        return envs
    }

    properties([
        parameters([
            choice(name: 'ENVIRONMENT', choices: getEnvironments()),
            string(name: 'VERSION', defaultValue: '1.0.0')
        ])
    ])

    stage('Deploy') {
        sh "./deploy.sh ${params.ENVIRONMENT} ${params.VERSION}"
    }
}
```

#### 2.5.3 Динамические параметры на основе условий
```groovy
// Выбор ноды с поддержкой Groovy
node('groovy-slave') {
    def getDynamicParams() {
        def params = []
        
        if (env.BRANCH_NAME == 'main') {
            params.add(choice(name: 'DEPLOY_TYPE', choices: ['full', 'incremental']))
        }
        
        def hour = new Date().hours
        if (hour >= 9 && hour <= 18) {
            params.add(booleanParam(name: 'RUN_PERFORMANCE_TESTS', defaultValue: true))
        }
        
        return params
    }

    properties([
        parameters(getDynamicParams())
    ])

    stage('Build') {
        if (params.DEPLOY_TYPE) {
            echo "Deploy type: ${params.DEPLOY_TYPE}"
        }
        if (params.RUN_PERFORMANCE_TESTS) {
            sh 'mvn verify -Pperformance'
        }
    }
}
```

#### 2.5.4 Динамические параметры с зависимостями
```groovy
// Выбор ноды с поддержкой всех языков программирования
node('multi-lang-slave') {
    def getDependentParams() {
        def params = []
        
        params.add(choice(name: 'PROJECT_TYPE', choices: ['java', 'python', 'nodejs']))
        
        def projectType = params.find { it.name == 'PROJECT_TYPE' }
        if (projectType) {
            switch(projectType.defaultValue) {
                case 'java':
                    params.add(choice(name: 'JAVA_VERSION', choices: ['8', '11', '17']))
                    break
                case 'python':
                    params.add(choice(name: 'PYTHON_VERSION', choices: ['3.8', '3.9', '3.10']))
                    break
                case 'nodejs':
                    params.add(choice(name: 'NODE_VERSION', choices: ['14', '16', '18']))
                    break
            }
        }
        
        return params
    }

    properties([
        parameters(getDependentParams())
    ])

    stage('Setup') {
        switch(params.PROJECT_TYPE) {
            case 'java':
                sh "java -version ${params.JAVA_VERSION}"
                break
            case 'python':
                sh "python --version ${params.PYTHON_VERSION}"
                break
            case 'nodejs':
                sh "node --version ${params.NODE_VERSION}"
                break
        }
    }
}
```

## 3. Лучшие практики

### 3.1 Структура Pipeline

```groovy
node {
    // 1. Инициализация
    stage('Setup') {
        checkout scm
        sh 'mvn clean'
    }
    
    // 2. Сборка
    stage('Build') {
        sh 'mvn package'
    }
    
    // 3. Тестирование
    stage('Test') {
        parallel(
            'Unit Tests': { sh 'mvn test' },
            'Integration Tests': { sh 'mvn verify' }
        )
    }
    
    // 4. Деплой
    stage('Deploy') {
        when {
            branch 'main'
        }
        steps {
            sh './deploy.sh'
        }
    }
}
```

### 3.2 Работа с артефактами

```groovy
node {
    stage('Build and Archive') {
        // Сборка
        sh 'mvn clean package'
        
        // Архивация
        archiveArtifacts artifacts: 'target/*.jar', fingerprint: true
        
        // Работа с Docker
        sh '''
            docker build -t myapp:${BUILD_NUMBER} .
            docker push myapp:${BUILD_NUMBER}
        '''
    }
}
```

### 3.3 Лучшие практики написания Jenkinsfile

#### 3.3.1 Структура и организация
```groovy
// 1. Импорты и библиотеки
@Library('shared-library') _

// 2. Глобальные переменные
def GLOBAL_TIMEOUT = 30
def DOCKER_REGISTRY = 'registry.example.com'

// 3. Функции и утилиты
def buildDockerImage(String version) {
    sh "docker build -t myapp:${version} ."
}

// 4. Основной pipeline
node {
    try {
        stage('Checkout') {
            checkout scm
        }
        
        stage('Build') {
            buildDockerImage(env.BUILD_NUMBER)
        }
        
        stage('Deploy') {
            deployToEnvironment()
        }
    } catch (Exception e) {
        currentBuild.result = 'FAILURE'
        error "Pipeline failed: ${e.message}"
    } finally {
        cleanWs()
    }
}
```

#### 3.3.2 Обработка ошибок и таймауты
```groovy
node {
    timeout(time: 1, unit: 'HOURS') {
        try {
            stage('Build') {
                timeout(time: 30, unit: 'MINUTES') {
                    sh 'mvn clean package'
                }
            }
        } catch (Exception e) {
            currentBuild.result = 'FAILURE'
            error "Build failed: ${e.message}"
        } finally {
            // Очистка ресурсов
            cleanWs()
        }
    }
}
```

#### 3.3.3 Переиспользуемые компоненты
```groovy
// vars/buildUtils.groovy
def buildJavaApp(String version) {
    sh "mvn clean package -Dversion=${version}"
}

def runTests() {
    sh 'mvn test'
}

// Jenkinsfile
@Library('shared-library') _

node {
    stage('Build') {
        buildJavaApp(env.BUILD_NUMBER)
    }
    
    stage('Test') {
        runTests()
    }
}
```

#### 3.3.4 Безопасность и конфиденциальность
```groovy
node {
    stage('Secure Operation') {
        // Использование credentials
        withCredentials([
            usernamePassword(credentialsId: 'docker-hub',
                           usernameVariable: 'DOCKER_USER',
                           passwordVariable: 'DOCKER_PASSWORD')
        ]) {
            sh '''
                docker login -u $DOCKER_USER -p $DOCKER_PASSWORD
                docker push myapp:${BUILD_NUMBER}
            '''
        }
        
        // Безопасное хранение секретов
        withVault([
            path: 'secret/myapp',
            secret: 'myapp-secret'
        ]) {
            sh 'echo $SECRET | ./deploy.sh'
        }
    }
}
```

#### 3.3.5 Оптимизация производительности
```groovy
node {
    // Кэширование зависимостей
    stage('Cache Dependencies') {
        cache('node_modules') {
            sh 'npm install'
        }
    }
    
    // Параллельное выполнение
    stage('Parallel Tests') {
        parallel(
            'Unit Tests': {
                sh 'mvn test -Dtest=*UnitTest'
            },
            'Integration Tests': {
                sh 'mvn test -Dtest=*IntegrationTest'
            }
        )
    }
    
    // Оптимизация Docker слоев
    stage('Docker Build') {
        sh '''
            docker build --cache-from myapp:latest \
                        --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
                        -t myapp:${BUILD_NUMBER} .
        '''
    }
}
```

#### 3.3.6 Документация и комментарии
```groovy
/**
 * Jenkinsfile для сборки и деплоя приложения
 * 
 * @param VERSION - версия приложения
 * @param ENVIRONMENT - окружение для деплоя
 * @param RUN_TESTS - флаг запуска тестов
 */

properties([
    parameters([
        string(name: 'VERSION', defaultValue: '1.0.0'),
        choice(name: 'ENVIRONMENT', choices: ['dev', 'staging', 'prod']),
        booleanParam(name: 'RUN_TESTS', defaultValue: true)
    ])
])

node {
    // Проверка входных параметров
    validateParameters()
    
    // Основные этапы
    stage('Build') {
        buildApplication()
    }
    
    stage('Test') {
        if (params.RUN_TESTS) {
            runTestSuite()
        }
    }
    
    stage('Deploy') {
        deployToEnvironment()
    }
}

// Вспомогательные функции
def validateParameters() {
    if (!params.VERSION.matches(/^\d+\.\d+\.\d+$/)) {
        error "Invalid version format: ${params.VERSION}"
    }
}

def buildApplication() {
    sh "mvn clean package -Dversion=${params.VERSION}"
}

def runTestSuite() {
    sh 'mvn test'
}

def deployToEnvironment() {
    sh "./deploy.sh ${params.ENVIRONMENT}"
}
```

#### 3.3.7 Мониторинг и отчетность
```groovy
node {
    stage('Build and Report') {
        // Сбор метрик
        def buildMetrics = [
            startTime: System.currentTimeMillis(),
            memoryUsage: sh(script: 'free -m', returnStdout: true).trim()
        ]
        
        // Выполнение сборки
        sh 'mvn clean package'
        
        // Сбор результатов
        def testResults = junit 'target/surefire-reports/*.xml'
        
        // Отправка отчетов
        emailext (
            subject: "Build ${currentBuild.number} ${currentBuild.result}",
            body: """
                Build: ${currentBuild.number}
                Status: ${currentBuild.result}
                Duration: ${(System.currentTimeMillis() - buildMetrics.startTime) / 1000}s
                Memory Usage: ${buildMetrics.memoryUsage}
                Test Results: ${testResults.totalCount} tests, ${testResults.failCount} failures
            """,
            recipientProviders: [[$class: 'DevelopersRecipientProvider']]
        )
    }
}
```

#### 3.3.8 Работа с матрицей сборок
```groovy
node {
    def matrix = [
        'java': ['8', '11', '17'],
        'python': ['3.8', '3.9', '3.10'],
        'nodejs': ['14', '16', '18']
    ]
    
    matrix.each { lang, versions ->
        versions.each { version ->
            stage("Build ${lang} ${version}") {
                try {
                    switch(lang) {
                        case 'java':
                            sh "java -version ${version}"
                            break
                        case 'python':
                            sh "python --version ${version}"
                            break
                        case 'nodejs':
                            sh "node --version ${version}"
                            break
                    }
                } catch (Exception e) {
                    echo "Failed to build ${lang} ${version}: ${e.message}"
                }
            }
        }
    }
}
```

#### 3.3.9 Работа с Git
```groovy
node {
    stage('Git Operations') {
        // Получение информации о коммите
        def commit = checkout scm
        echo "Commit hash: ${commit.GIT_COMMIT}"
        echo "Branch: ${commit.GIT_BRANCH}"
        
        // Создание тега
        sh """
            git config user.email "jenkins@example.com"
            git config user.name "Jenkins"
            git tag -a v${BUILD_NUMBER} -m "Build ${BUILD_NUMBER}"
            git push origin v${BUILD_NUMBER}
        """
        
        // Работа с ветками
        sh """
            git checkout -b feature/${BUILD_NUMBER}
            git add .
            git commit -m "Changes for build ${BUILD_NUMBER}"
            git push origin feature/${BUILD_NUMBER}
        """
    }
}
```

#### 3.3.10 Работа с артефактами и зависимостями
```groovy
node {
    stage('Artifacts and Dependencies') {
        // Работа с Maven
        withMaven(maven: 'Maven 3.8.4') {
            sh 'mvn clean package'
            // Архивация артефактов
            archiveArtifacts artifacts: 'target/*.jar', fingerprint: true
            // Архивация зависимостей
            archiveArtifacts artifacts: 'target/dependency/*.jar', fingerprint: true
        }
        
        // Работа с npm
        withNodejs(nodejsInstallationName: 'NodeJS 16') {
            sh 'npm install'
            // Архивация node_modules
            archiveArtifacts artifacts: 'node_modules/**', fingerprint: true
        }
        
        // Работа с Docker
        docker.withRegistry('https://registry.example.com', 'registry-credentials') {
            // Сборка образа
            def image = docker.build("myapp:${BUILD_NUMBER}")
            // Архивация слоев
            image.inside {
                sh 'tar czf /tmp/layers.tar.gz /var/lib/docker'
                archiveArtifacts artifacts: '/tmp/layers.tar.gz', fingerprint: true
            }
        }
    }
}
```

#### 3.3.11 Работа с уведомлениями
```groovy
node {
    stage('Notifications') {
        // Slack уведомления
        slackSend(
            channel: '#jenkins-builds',
            color: currentBuild.result == 'SUCCESS' ? 'good' : 'danger',
            message: """
                Build: ${currentBuild.fullDisplayName}
                Status: ${currentBuild.result}
                Duration: ${currentBuild.durationString}
                Changes: ${currentBuild.changeSets}
            """
        )
        
        // Email уведомления
        emailext (
            subject: "Build ${currentBuild.number} ${currentBuild.result}",
            body: """
                <h2>Build Information</h2>
                <p>Build: ${currentBuild.fullDisplayName}</p>
                <p>Status: ${currentBuild.result}</p>
                <p>Duration: ${currentBuild.durationString}</p>
                <h3>Changes</h3>
                ${currentBuild.changeSets}
            """,
            recipientProviders: [[$class: 'DevelopersRecipientProvider']],
            mimeType: 'text/html'
        )
        
        // Telegram уведомления
        def telegramMessage = """
            Build: ${currentBuild.fullDisplayName}
            Status: ${currentBuild.result}
            Duration: ${currentBuild.durationString}
        """
        sh """
            curl -X POST \
                -H 'Content-Type: application/json' \
                -d '{"chat_id": "YOUR_CHAT_ID", "text": "${telegramMessage}"}' \
                https://api.telegram.org/botYOUR_BOT_TOKEN/sendMessage
        """
    }
}
```

#### 3.3.12 Работа с метриками и мониторингом
```groovy
node {
    stage('Metrics and Monitoring') {
        // Сбор системных метрик
        def metrics = [
            cpu: sh(script: 'top -bn1 | grep "Cpu(s)" | awk \'{print $2}\'', returnStdout: true).trim(),
            memory: sh(script: 'free -m | grep Mem | awk \'{print $3/$2 * 100.0}\'', returnStdout: true).trim(),
            disk: sh(script: 'df -h / | tail -1 | awk \'{print $5}\'', returnStdout: true).trim()
        ]
        
        // Сбор метрик сборки
        def buildMetrics = [
            startTime: System.currentTimeMillis(),
            duration: currentBuild.duration,
            result: currentBuild.result
        ]
        
        // Отправка метрик в Prometheus
        sh """
            curl -X POST \
                -H 'Content-Type: text/plain' \
                --data-binary @- http://prometheus:9090/metrics/job/jenkins << EOF
            jenkins_build_duration_seconds{job="${JOB_NAME}",build="${BUILD_NUMBER}"} ${buildMetrics.duration/1000}
            jenkins_build_status{job="${JOB_NAME}",build="${BUILD_NUMBER}"} ${buildMetrics.result == 'SUCCESS' ? 1 : 0}
            jenkins_system_cpu_usage{job="${JOB_NAME}",build="${BUILD_NUMBER}"} ${metrics.cpu}
            jenkins_system_memory_usage{job="${JOB_NAME}",build="${BUILD_NUMBER}"} ${metrics.memory}
            jenkins_system_disk_usage{job="${JOB_NAME}",build="${BUILD_NUMBER}"} ${metrics.disk}
            EOF
        """
    }
}
```

## 4. Отладка и мониторинг

### 4.1 Логирование

```groovy
node {
    stage('Logging') {
        // Базовое логирование
        echo "Simple message"
        
        // Логирование с форматированием
        echo "Build number: ${BUILD_NUMBER}"
        
        // Логирование ошибок
        currentBuild.result = 'FAILURE'
        error "Build failed"
    }
}
```

### 4.2 Мониторинг состояния

```groovy
node {
    stage('Monitoring') {
        // Проверка статуса
        if (currentBuild.result == 'SUCCESS') {
            echo "Build successful"
        } else {
            echo "Build failed"
        }
        
        // Работа с параметрами
        properties([
            parameters([
                string(name: 'VERSION', defaultValue: '1.0.0')
            ])
        ])
    }
}
```

## 5. Продвинутые техники

### 5.1 Работа с shared libraries

```groovy
// vars/customStep.groovy
def call(Map config) {
    echo "Executing custom step with config: ${config}"
    // Реализация шага
}

// Jenkinsfile
@Library('my-shared-library') _

node {
    stage('Custom Step') {
        customStep(
            param1: 'value1',
            param2: 'value2'
        )
    }
}
```

### 5.2 Работа с credentials

```groovy
// Выбор ноды с поддержкой безопасных операций
node('secure-slave') {
    stage('Secure Operation') {
        withCredentials([
            usernamePassword(credentialsId: 'my-credentials',
                           usernameVariable: 'USER',
                           passwordVariable: 'PASSWORD')
        ]) {
            sh '''
                echo "Using secure credentials"
                curl -u $USER:$PASSWORD https://api.example.com
            '''
        }
    }
}
```

### 5.3 Работа с Docker

```groovy
// Выбор ноды с поддержкой Docker и registry
node('docker-registry-slave') {
    stage('Docker Operations') {
        docker.withRegistry('https://registry.example.com', 'registry-credentials') {
            docker.image('myapp:latest').inside {
                sh 'mvn clean package'
            }
        }
    }
}
```

### 5.4 Работа с HashiCorp Vault

#### 5.4.1 Базовая интеграция с Vault
```groovy
// Выбор ноды с поддержкой Vault
node('vault-slave') {
    stage('Vault Integration') {
        // Настройка подключения к Vault
        def vault = vault(
            url: 'https://vault.example.com',
            credentialsId: 'vault-token'
        )
        
        // Получение секретов
        def secrets = vault.read('secret/myapp')
        
        // Использование секретов
        withEnv([
            "DB_PASSWORD=${secrets.data.password}",
            "API_KEY=${secrets.data.api_key}"
        ]) {
            sh '''
                echo "Using secrets from Vault"
                curl -H "Authorization: Bearer $API_KEY" https://api.example.com
            '''
        }
    }
}
```

#### 5.4.2 Динамические секреты
```groovy
// Выбор ноды с поддержкой динамических секретов
node('vault-dynamic-slave') {
    stage('Dynamic Secrets') {
        def vault = vault(
            url: 'https://vault.example.com',
            credentialsId: 'vault-token'
        )
        
        // Получение динамических учетных данных для базы данных
        def dbCreds = vault.database('database/creds/my-role')
        
        // Использование динамических учетных данных
        withEnv([
            "DB_USER=${dbCreds.username}",
            "DB_PASSWORD=${dbCreds.password}"
        ]) {
            sh '''
                echo "Using dynamic database credentials"
                mysql -u $DB_USER -p$DB_PASSWORD -e "SELECT 1"
            '''
        }
    }
}
```

#### 5.4.3 Работа с разными движками секретов
```groovy
// Выбор ноды с поддержкой различных движков Vault
node('vault-engines-slave') {
    stage('Vault Engines') {
        def vault = vault(
            url: 'https://vault.example.com',
            credentialsId: 'vault-token'
        )
        
        // KV (Key-Value) секреты
        def kvSecrets = vault.read('secret/data/myapp')
        
        // AWS секреты
        def awsCreds = vault.aws('aws/creds/my-role')
        
        // SSH секреты
        def sshKey = vault.ssh('ssh/sign/my-role', [
            public_key: readFile('id_rsa.pub'),
            valid_principals: 'ubuntu'
        ])
        
        // Использование различных секретов
        withEnv([
            "APP_SECRET=${kvSecrets.data.secret}",
            "AWS_ACCESS_KEY=${awsCreds.access_key}",
            "AWS_SECRET_KEY=${awsCreds.secret_key}"
        ]) {
            sh '''
                echo "Using multiple secret types"
                aws s3 ls s3://my-bucket
            '''
        }
    }
}
```

#### 5.4.4 Безопасное хранение и ротация секретов
```groovy
// Выбор ноды с поддержкой ротации секретов
node('vault-rotation-slave') {
    stage('Secret Rotation') {
        def vault = vault(
            url: 'https://vault.example.com',
            credentialsId: 'vault-token'
        )
        
        // Получение текущих секретов
        def currentSecrets = vault.read('secret/myapp')
        
        // Ротация секретов
        def newSecrets = vault.rotate('secret/myapp')
        
        // Обновление приложения с новыми секретами
        withEnv([
            "NEW_SECRET=${newSecrets.data.secret}",
            "NEW_KEY=${newSecrets.data.key}"
        ]) {
            sh '''
                echo "Rotating secrets"
                ./update-secrets.sh
            '''
        }
        
        // Валидация новых секретов
        try {
            sh './validate-secrets.sh'
        } catch (Exception e) {
            // Откат к предыдущим секретам при ошибке
            withEnv([
                "OLD_SECRET=${currentSecrets.data.secret}",
                "OLD_KEY=${currentSecrets.data.key}"
            ]) {
                sh './rollback-secrets.sh'
            }
            error "Secret rotation failed: ${e.message}"
        }
    }
}
```

#### 5.4.5 Интеграция с политиками доступа
```groovy
// Выбор ноды с поддержкой политик доступа
node('vault-policy-slave') {
    stage('Access Policies') {
        def vault = vault(
            url: 'https://vault.example.com',
            credentialsId: 'vault-token'
        )
        
        // Проверка прав доступа
        def hasAccess = vault.checkAccess('secret/myapp')
        
        if (hasAccess) {
            // Получение секретов с учетом политик
            def secrets = vault.read('secret/myapp')
            
            // Использование секретов в соответствии с политиками
            withEnv([
                "APP_SECRET=${secrets.data.secret}",
                "API_KEY=${secrets.data.api_key}"
            ]) {
                sh '''
                    echo "Using secrets with policy-based access"
                    ./deploy.sh
                '''
            }
        } else {
            error "Insufficient permissions to access secrets"
        }
    }
}
```

### 5.5 Работа с Git

#### 5.5.1 Базовая работа с Git
```groovy
// Выбор ноды с поддержкой Git
node('git-slave') {
    stage('Git Operations') {
        // Получение кода
        checkout scm
        
        // Получение информации о коммите
        def commit = checkout scm
        echo "Commit hash: ${commit.GIT_COMMIT}"
        echo "Branch: ${commit.GIT_BRANCH}"
        echo "Author: ${commit.GIT_AUTHOR_NAME}"
        echo "Message: ${commit.GIT_COMMIT_MESSAGE}"
        
        // Создание тега
        sh """
            git config user.email "jenkins@example.com"
            git config user.name "Jenkins"
            git tag -a v${BUILD_NUMBER} -m "Build ${BUILD_NUMBER}"
            git push origin v${BUILD_NUMBER}
        """
    }
}
```

#### 5.5.2 Работа с ветками
```groovy
// Выбор ноды с поддержкой Git и веток
node('git-branch-slave') {
    stage('Branch Operations') {
        checkout scm
        
        // Создание новой ветки
        def branchName = "feature/${BUILD_NUMBER}"
        sh """
            git checkout -b ${branchName}
            git add .
            git commit -m "Changes for build ${BUILD_NUMBER}"
            git push origin ${branchName}
        """
        
        // Создание Pull Request
        def pr = createPullRequest(
            title: "Feature for build ${BUILD_NUMBER}",
            description: "Changes made during build ${BUILD_NUMBER}",
            sourceBranch: branchName,
            targetBranch: 'main'
        )
        
        // Комментирование PR
        pr.comment("Build ${BUILD_NUMBER} completed successfully")
    }
}
```

#### 5.5.3 Работа с Git LFS
```groovy
// Выбор ноды с поддержкой Git LFS
node('git-lfs-slave') {
    stage('Git LFS Operations') {
        checkout scm
        
        // Инициализация Git LFS
        sh 'git lfs install'
        
        // Отслеживание больших файлов
        sh '''
            git lfs track "*.psd"
            git lfs track "*.zip"
            git add .gitattributes
            git commit -m "Configure Git LFS tracking"
        '''
        
        // Загрузка LFS файлов
        sh 'git lfs pull'
        
        // Проверка статуса LFS
        sh 'git lfs status'
    }
}
```

#### 5.5.4 Работа с Git Submodules
```groovy
// Выбор ноды с поддержкой Git Submodules
node('git-submodule-slave') {
    stage('Git Submodule Operations') {
        // Получение кода с подмодулями
        checkout scm
        
        // Инициализация подмодулей
        sh 'git submodule init'
        
        // Обновление подмодулей
        sh 'git submodule update'
        
        // Обновление конкретного подмодуля
        sh 'git submodule update --remote submodule-name'
        
        // Проверка статуса подмодулей
        sh 'git submodule status'
    }
}
```

#### 5.5.5 Работа с Git Hooks
```groovy
// Выбор ноды с поддержкой Git Hooks
node('git-hooks-slave') {
    stage('Git Hooks Operations') {
        checkout scm
        
        // Установка pre-commit хука
        sh '''
            cat > .git/hooks/pre-commit << 'EOF'
            #!/bin/sh
            echo "Running pre-commit checks..."
            npm run lint
            npm run test
            EOF
            chmod +x .git/hooks/pre-commit
        '''
        
        // Установка post-commit хука
        sh '''
            cat > .git/hooks/post-commit << 'EOF'
            #!/bin/sh
            echo "Running post-commit actions..."
            git push origin HEAD
            EOF
            chmod +x .git/hooks/post-commit
        '''
    }
}
```

#### 5.5.6 Работа с Git Flow
```groovy
// Выбор ноды с поддержкой Git Flow
node('git-flow-slave') {
    stage('Git Flow Operations') {
        checkout scm
        
        // Инициализация Git Flow
        sh 'git flow init -d'
        
        // Создание feature ветки
        sh "git flow feature start feature-${BUILD_NUMBER}"
        
        // Завершение feature ветки
        sh "git flow feature finish feature-${BUILD_NUMBER}"
        
        // Создание release ветки
        sh "git flow release start ${VERSION}"
        
        // Завершение release ветки
        sh "git flow release finish ${VERSION}"
        
        // Создание hotfix ветки
        sh "git flow hotfix start hotfix-${BUILD_NUMBER}"
        
        // Завершение hotfix ветки
        sh "git flow hotfix finish hotfix-${BUILD_NUMBER}"
    }
}
```

#### 5.5.7 Работа с Git Tags и Releases
```groovy
// Выбор ноды с поддержкой Git Tags
node('git-tags-slave') {
    stage('Git Tags Operations') {
        checkout scm
        
        // Создание аннотированного тега
        sh """
            git tag -a v${VERSION} -m "Release version ${VERSION}"
            git push origin v${VERSION}
        """
        
        // Создание GitHub Release
        def release = createGitHubRelease(
            tag: "v${VERSION}",
            title: "Release ${VERSION}",
            description: "Release notes for version ${VERSION}",
            draft: false,
            prerelease: false
        )
        
        // Прикрепление артефактов к релизу
        release.uploadAsset('target/*.jar')
        release.uploadAsset('target/*.zip')
    }
}
```

#### 5.5.8 Работа с Git Blame и History
```groovy
// Выбор ноды с поддержкой Git History
node('git-history-slave') {
    stage('Git History Operations') {
        checkout scm
        
        // Получение blame информации
        def blame = sh(script: 'git blame file.txt', returnStdout: true).trim()
        echo "Blame information: ${blame}"
        
        // Получение истории изменений
        def history = sh(script: 'git log --oneline', returnStdout: true).trim()
        echo "Commit history: ${history}"
        
        // Получение статистики изменений
        def stats = sh(script: 'git diff --stat HEAD~1', returnStdout: true).trim()
        echo "Change statistics: ${stats}"
        
        // Поиск изменений по паттерну
        def changes = sh(script: 'git log -S "pattern"', returnStdout: true).trim()
        echo "Changes containing pattern: ${changes}"
    }
}
```

### 5.6 Работа с переменными окружения

#### 5.6.1 Базовые переменные окружения
```groovy
// Выбор ноды с поддержкой переменных окружения
node('env-slave') {
    stage('Environment Variables') {
        // Получение системных переменных
        echo "JENKINS_HOME: ${env.JENKINS_HOME}"
        echo "JOB_NAME: ${env.JOB_NAME}"
        echo "BUILD_NUMBER: ${env.BUILD_NUMBER}"
        
        // Установка переменных окружения
        env.MY_CUSTOM_VAR = "custom_value"
        
        // Использование переменных в shell-скриптах
        sh """
            echo "Custom variable: $MY_CUSTOM_VAR"
            echo "Build number: $BUILD_NUMBER"
        """
    }
}
```

#### 5.6.2 Работа с секретными переменными
```groovy
// Выбор ноды с поддержкой секретных переменных
node('secret-env-slave') {
    stage('Secret Environment Variables') {
        // Использование credentials в переменных окружения
        withCredentials([
            usernamePassword(credentialsId: 'db-credentials',
                           usernameVariable: 'DB_USER',
                           passwordVariable: 'DB_PASSWORD')
        ]) {
            // Передача секретов в переменные окружения
            env.DB_CONNECTION = "mysql://${DB_USER}:${DB_PASSWORD}@localhost:3306/db"
            
            // Использование секретных переменных
            sh """
                echo "Connecting to database..."
                mysql -u $DB_USER -p$DB_PASSWORD -e "SELECT 1"
            """
        }
    }
}
```

#### 5.6.3 Динамические переменные окружения
```groovy
// Выбор ноды с поддержкой динамических переменных
node('dynamic-env-slave') {
    stage('Dynamic Environment Variables') {
        // Создание динамических переменных
        def timestamp = new Date().format('yyyy-MM-dd_HH-mm-ss')
        env.BUILD_TIMESTAMP = timestamp
        env.BUILD_TAG = "build_${BUILD_NUMBER}_${timestamp}"
        
        // Генерация переменных на основе условий
        if (env.BRANCH_NAME == 'main') {
            env.ENVIRONMENT = 'production'
            env.DEPLOY_URL = 'https://prod.example.com'
        } else {
            env.ENVIRONMENT = 'development'
            env.DEPLOY_URL = 'https://dev.example.com'
        }
        
        // Использование динамических переменных
        sh """
            echo "Build tag: $BUILD_TAG"
            echo "Environment: $ENVIRONMENT"
            echo "Deploy URL: $DEPLOY_URL"
        """
    }
}
```

#### 5.6.4 Работа с переменными в разных этапах
```groovy
// Выбор ноды с поддержкой этапов
node('stage-env-slave') {
    // Глобальные переменные окружения
    env.GLOBAL_VAR = "global_value"
    
    stage('Stage 1') {
        // Локальные переменные для этапа
        env.STAGE1_VAR = "stage1_value"
        echo "Stage 1 variable: ${env.STAGE1_VAR}"
    }
    
    stage('Stage 2') {
        // Переменные доступны между этапами
        echo "Global variable: ${env.GLOBAL_VAR}"
        echo "Stage 1 variable: ${env.STAGE1_VAR}"
        
        // Локальные переменные для этапа
        env.STAGE2_VAR = "stage2_value"
    }
    
    stage('Stage 3') {
        // Все переменные доступны
        echo "All variables:"
        echo "Global: ${env.GLOBAL_VAR}"
        echo "Stage 1: ${env.STAGE1_VAR}"
        echo "Stage 2: ${env.STAGE2_VAR}"
    }
}
```

#### 5.6.5 Работа с переменными в параллельных этапах
```groovy
// Выбор ноды с поддержкой параллельного выполнения
node('parallel-env-slave') {
    // Общие переменные окружения
    env.SHARED_VAR = "shared_value"
    
    parallel(
        'Task 1': {
            stage('Task 1') {
                // Локальные переменные для задачи
                env.TASK1_VAR = "task1_value"
                echo "Task 1 variables:"
                echo "Shared: ${env.SHARED_VAR}"
                echo "Local: ${env.TASK1_VAR}"
            }
        },
        'Task 2': {
            stage('Task 2') {
                // Локальные переменные для задачи
                env.TASK2_VAR = "task2_value"
                echo "Task 2 variables:"
                echo "Shared: ${env.SHARED_VAR}"
                echo "Local: ${env.TASK2_VAR}"
            }
        }
    )
    
    stage('Final') {
        // Проверка доступности переменных после параллельного выполнения
        echo "Final variables:"
        echo "Shared: ${env.SHARED_VAR}"
        echo "Task 1: ${env.TASK1_VAR}"
        echo "Task 2: ${env.TASK2_VAR}"
    }
}
```

#### 5.6.6 Работа с переменными в shared libraries
```groovy
// vars/envUtils.groovy
def setEnvironmentVariables(Map config) {
    // Установка переменных окружения
    env.APP_VERSION = config.version
    env.APP_ENV = config.environment
    env.BUILD_TYPE = config.buildType
    
    // Дополнительные переменные на основе конфигурации
    if (config.environment == 'production') {
        env.DEPLOY_URL = 'https://prod.example.com'
        env.API_KEY = config.prodApiKey
    } else {
        env.DEPLOY_URL = 'https://dev.example.com'
        env.API_KEY = config.devApiKey
    }
}

// Jenkinsfile
@Library('shared-library') _

node('library-env-slave') {
    stage('Environment Setup') {
        // Использование shared library
        envUtils.setEnvironmentVariables([
            version: '1.0.0',
            environment: 'production',
            buildType: 'release',
            prodApiKey: 'prod-key'
        ])
        
        // Проверка установленных переменных
        sh """
            echo "App Version: $APP_VERSION"
            echo "Environment: $APP_ENV"
            echo "Build Type: $BUILD_TYPE"
            echo "Deploy URL: $DEPLOY_URL"
        """
    }
}
```

#### 5.6.7 Работа с переменными в Docker
```groovy
// Выбор ноды с поддержкой Docker
node('docker-env-slave') {
    stage('Docker Environment Variables') {
        // Установка переменных окружения
        env.DOCKER_IMAGE = "myapp:${BUILD_NUMBER}"
        env.DOCKER_REGISTRY = "registry.example.com"
        
        // Передача переменных в Docker
        docker.build(env.DOCKER_IMAGE) {
            // Передача переменных окружения в контейнер
            sh """
                docker run --rm \
                    -e APP_VERSION=${env.BUILD_NUMBER} \
                    -e APP_ENV=${env.ENVIRONMENT} \
                    ${env.DOCKER_IMAGE} \
                    ./start.sh
            """
        }
        
        // Использование переменных для публикации
        docker.withRegistry(env.DOCKER_REGISTRY, 'registry-credentials') {
            sh "docker push ${env.DOCKER_IMAGE}"
        }
    }
}
```

#### 5.6.8 Работа с переменными в разных операционных системах
```groovy
// Выбор ноды с поддержкой разных ОС
node('multi-os-slave') {
    stage('Multi-OS Environment Variables') {
        // Определение ОС
        def os = sh(script: 'uname -s', returnStdout: true).trim()
        
        // Установка переменных в зависимости от ОС
        switch(os) {
            case 'Linux':
                env.PATH_SEPARATOR = ':'
                env.HOME_DIR = '/home'
                break
            case 'Darwin':
                env.PATH_SEPARATOR = ':'
                env.HOME_DIR = '/Users'
                break
            case 'Windows_NT':
                env.PATH_SEPARATOR = ';'
                env.HOME_DIR = 'C:\\Users'
                break
            default:
                error "Unsupported operating system: ${os}"
        }
        
        // Использование переменных с учетом ОС
        sh """
            echo "OS: ${os}"
            echo "Path separator: $PATH_SEPARATOR"
            echo "Home directory: $HOME_DIR"
        """
    }
}
```

### 5.7 Интеграция с Ansible

#### 5.7.1 Базовая интеграция с Ansible
```groovy
// Выбор ноды с поддержкой Ansible
node('ansible-slave') {
    stage('Ansible Integration') {
        // Проверка наличия Ansible
        sh 'ansible --version'
        
        // Запуск простого playbook
        sh """
            ansible-playbook \
                -i inventory/hosts \
                playbooks/deploy.yml \
                -e "version=${BUILD_NUMBER}"
        """
    }
}
```

#### 5.7.2 Работа с Ansible Vault
```groovy
// Выбор ноды с поддержкой Ansible Vault
node('ansible-vault-slave') {
    stage('Ansible Vault Integration') {
        // Использование vault-encrypted файлов
        withCredentials([
            string(credentialsId: 'ansible-vault-password',
                   variable: 'VAULT_PASSWORD')
        ]) {
            sh """
                echo "${VAULT_PASSWORD}" > .vault_pass
                chmod 600 .vault_pass
                
                # Запуск playbook с vault-encrypted переменными
                ansible-playbook \
                    -i inventory/hosts \
                    --vault-password-file .vault_pass \
                    playbooks/deploy.yml
            """
        }
    }
}
```

#### 5.7.3 Работа с динамическим инвентарем
```groovy
// Выбор ноды с поддержкой динамического инвентаря
node('ansible-dynamic-slave') {
    stage('Dynamic Inventory') {
        // Генерация динамического инвентаря
        def inventory = sh(script: '''
            #!/bin/bash
            echo "{
                \"all\": {
                    \"hosts\": {
                        \"web1\": {
                            \"ansible_host\": \"10.0.0.1\",
                            \"ansible_user\": \"ubuntu\"
                        },
                        \"web2\": {
                            \"ansible_host\": \"10.0.0.2\",
                            \"ansible_user\": \"ubuntu\"
                        }
                    }
                }
            }"
        ''', returnStdout: true).trim()
        
        // Сохранение динамического инвентаря
        writeFile file: 'inventory/dynamic.json', text: inventory
        
        // Запуск playbook с динамическим инвентарем
        sh """
            ansible-playbook \
                -i inventory/dynamic.json \
                playbooks/deploy.yml
        """
    }
}
```

#### 5.7.4 Работа с Ansible Tags
```groovy
// Выбор ноды с поддержкой Ansible Tags
node('ansible-tags-slave') {
    stage('Ansible Tags') {
        // Запуск playbook с определенными тегами
        sh """
            ansible-playbook \
                -i inventory/hosts \
                playbooks/deploy.yml \
                --tags "deploy,config"
        """
        
        // Пропуск определенных тегов
        sh """
            ansible-playbook \
                -i inventory/hosts \
                playbooks/deploy.yml \
                --skip-tags "backup"
        """
    }
}
```

#### 5.7.5 Работа с Ansible Facts
```groovy
// Выбор ноды с поддержкой Ansible Facts
node('ansible-facts-slave') {
    stage('Ansible Facts') {
        // Сбор facts с серверов
        def facts = sh(script: '''
            ansible all \
                -i inventory/hosts \
                -m setup \
                --tree /tmp/ansible_facts
        ''', returnStdout: true).trim()
        
        // Анализ facts
        sh """
            cat /tmp/ansible_facts/* | grep -E "ansible_os_family|ansible_distribution_version"
        """
        
        // Использование facts в playbook
        sh """
            ansible-playbook \
                -i inventory/hosts \
                playbooks/deploy.yml \
                -e "os_family=${facts.ansible_os_family}"
        """
    }
}
```

#### 5.7.6 Работа с Ansible Roles
```groovy
// Выбор ноды с поддержкой Ansible Roles
node('ansible-roles-slave') {
    stage('Ansible Roles') {
        // Установка зависимостей roles
        sh 'ansible-galaxy install -r requirements.yml'
        
        // Запуск playbook с roles
        sh """
            ansible-playbook \
                -i inventory/hosts \
                playbooks/deploy.yml \
                --roles-path roles/
        """
        
        // Обновление roles
        sh 'ansible-galaxy install -r requirements.yml --force'
    }
}
```

#### 5.7.7 Работа с Ansible Templates
```groovy
// Выбор ноды с поддержкой Ansible Templates
node('ansible-templates-slave') {
    stage('Ansible Templates') {
        // Генерация конфигурации
        def config = [
            app_name: 'myapp',
            version: BUILD_NUMBER,
            environment: ENVIRONMENT
        ]
        
        // Создание временного файла с переменными
        writeFile file: 'vars/config.yml', text: """
            app_name: ${config.app_name}
            version: ${config.version}
            environment: ${config.environment}
        """
        
        // Применение шаблонов
        sh """
            ansible-playbook \
                -i inventory/hosts \
                -e @vars/config.yml \
                playbooks/templates.yml
        """
    }
}
```

#### 5.7.8 Работа с Ansible Handlers
```groovy
// Выбор ноды с поддержкой Ansible Handlers
node('ansible-handlers-slave') {
    stage('Ansible Handlers') {
        // Запуск playbook с обработкой handlers
        sh """
            ansible-playbook \
                -i inventory/hosts \
                playbooks/deploy.yml \
                --force-handlers
        """
        
        // Проверка статуса сервисов
        sh """
            ansible all \
                -i inventory/hosts \
                -m service \
                -a "name=myapp state=started"
        """
    }
}
```

#### 5.7.9 Работа с Ansible Collections
```groovy
// Выбор ноды с поддержкой Ansible Collections
node('ansible-collections-slave') {
    stage('Ansible Collections') {
        // Установка collections
        sh 'ansible-galaxy collection install -r collections/requirements.yml'
        
        // Использование collections в playbook
        sh """
            ansible-playbook \
                -i inventory/hosts \
                playbooks/collections.yml \
                --collections-path collections/
        """
        
        // Обновление collections
        sh 'ansible-galaxy collection install -r collections/requirements.yml --force'
    }
}
```

#### 5.7.10 Работа с Ansible Callback Plugins
```groovy
// Выбор ноды с поддержкой Ansible Callback Plugins
node('ansible-callback-slave') {
    stage('Ansible Callback Plugins') {
        // Настройка callback плагинов
        sh '''
            mkdir -p callback_plugins
            cat > callback_plugins/jenkins.py << 'EOF'
            from ansible.plugins.callback import CallbackBase
            class CallbackModule(CallbackBase):
                def v2_runner_on_ok(self, result):
                    host = result._host
                    print("Task completed on %s" % host.get_name())
            EOF
        '''
        
        // Запуск playbook с callback плагинами
        sh """
            ANSIBLE_CALLBACK_PLUGINS=callback_plugins \
            ansible-playbook \
                -i inventory/hosts \
                playbooks/deploy.yml
        """
    }
}
```

### 5.8 Интеграция с Kubernetes

#### 5.8.1 Базовая интеграция с Kubernetes
```groovy
// Выбор ноды с поддержкой Kubernetes
node('k8s-slave') {
    stage('Kubernetes Integration') {
        // Проверка подключения к кластеру
        sh 'kubectl cluster-info'
        
        // Получение списка подов
        sh 'kubectl get pods'
        
        // Получение списка сервисов
        sh 'kubectl get services'
        
        // Получение списка деплойментов
        sh 'kubectl get deployments'
    }
}
```

#### 5.8.2 Работа с Kubernetes Namespaces
```groovy
// Выбор ноды с поддержкой Kubernetes Namespaces
node('k8s-namespace-slave') {
    stage('Kubernetes Namespaces') {
        // Создание namespace
        sh """
            kubectl create namespace ${BUILD_NUMBER} \
                --dry-run=client -o yaml | kubectl apply -f -
        """
        
        // Переключение в namespace
        sh "kubectl config set-context --current --namespace=${BUILD_NUMBER}"
        
        // Проверка ресурсов в namespace
        sh """
            kubectl get all -n ${BUILD_NUMBER}
            kubectl get configmaps -n ${BUILD_NUMBER}
            kubectl get secrets -n ${BUILD_NUMBER}
        """
        
        // Удаление namespace после завершения
        sh "kubectl delete namespace ${BUILD_NUMBER}"
    }
}
```

#### 5.8.3 Работа с Kubernetes Secrets
```groovy
// Выбор ноды с поддержкой Kubernetes Secrets
node('k8s-secrets-slave') {
    stage('Kubernetes Secrets') {
        // Создание секрета из файла
        withCredentials([
            usernamePassword(credentialsId: 'db-credentials',
                           usernameVariable: 'DB_USER',
                           passwordVariable: 'DB_PASSWORD')
        ]) {
            sh """
                kubectl create secret generic db-credentials \
                    --from-literal=username=${DB_USER} \
                    --from-literal=password=${DB_PASSWORD} \
                    --dry-run=client -o yaml | kubectl apply -f -
            """
        }
        
        // Создание секрета из файла
        sh """
            kubectl create secret generic tls-cert \
                --from-file=tls.crt=./cert.crt \
                --from-file=tls.key=./cert.key \
                --dry-run=client -o yaml | kubectl apply -f -
        """
        
        // Обновление секрета
        sh """
            kubectl create secret generic db-credentials \
                --from-literal=username=newuser \
                --from-literal=password=newpass \
                --dry-run=client -o yaml | kubectl apply -f -
        """
    }
}
```

#### 5.8.4 Работа с Kubernetes ConfigMaps
```groovy
// Выбор ноды с поддержкой Kubernetes ConfigMaps
node('k8s-configmap-slave') {
    stage('Kubernetes ConfigMaps') {
        // Создание ConfigMap из файла
        sh """
            kubectl create configmap app-config \
                --from-file=config.yaml=./config.yaml \
                --dry-run=client -o yaml | kubectl apply -f -
        """
        
        // Создание ConfigMap из переменных
        sh """
            kubectl create configmap env-config \
                --from-literal=APP_ENV=${ENVIRONMENT} \
                --from-literal=APP_VERSION=${BUILD_NUMBER} \
                --dry-run=client -o yaml | kubectl apply -f -
        """
        
        // Обновление ConfigMap
        sh """
            kubectl create configmap app-config \
                --from-file=config.yaml=./new-config.yaml \
                --dry-run=client -o yaml | kubectl apply -f -
        """
    }
}
```

#### 5.8.5 Работа с Kubernetes Deployments
```groovy
// Выбор ноды с поддержкой Kubernetes Deployments
node('k8s-deployment-slave') {
    stage('Kubernetes Deployments') {
        // Создание deployment
        sh """
            kubectl create deployment myapp \
                --image=myapp:${BUILD_NUMBER} \
                --replicas=3 \
                --dry-run=client -o yaml | kubectl apply -f -
        """
        
        // Обновление deployment
        sh """
            kubectl set image deployment/myapp \
                myapp=myapp:${BUILD_NUMBER}
        """
        
        // Масштабирование deployment
        sh "kubectl scale deployment myapp --replicas=5"
        
        // Проверка статуса deployment
        sh """
            kubectl rollout status deployment/myapp
            kubectl get deployment myapp
        """
        
        // Откат deployment
        sh "kubectl rollout undo deployment/myapp"
    }
}
```

#### 5.8.6 Работа с Kubernetes Services
```groovy
// Выбор ноды с поддержкой Kubernetes Services
node('k8s-service-slave') {
    stage('Kubernetes Services') {
        // Создание service
        sh """
            kubectl create service clusterip myapp \
                --tcp=80:8080 \
                --dry-run=client -o yaml | kubectl apply -f -
        """
        
        // Создание LoadBalancer service
        sh """
            kubectl create service loadbalancer myapp-lb \
                --tcp=80:8080 \
                --dry-run=client -o yaml | kubectl apply -f -
        """
        
        // Получение внешнего IP
        sh """
            kubectl get service myapp-lb -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
        """
        
        // Обновление service
        sh """
            kubectl patch service myapp \
                -p '{"spec":{"ports":[{"port":8080,"targetPort":8080}]}}'
        """
    }
}
```

#### 5.8.7 Работа с Kubernetes Ingress
```groovy
// Выбор ноды с поддержкой Kubernetes Ingress
node('k8s-ingress-slave') {
    stage('Kubernetes Ingress') {
        // Создание Ingress
        sh """
            cat <<EOF | kubectl apply -f -
            apiVersion: networking.k8s.io/v1
            kind: Ingress
            metadata:
              name: myapp-ingress
              annotations:
                nginx.ingress.kubernetes.io/rewrite-target: /
            spec:
              rules:
              - host: myapp.example.com
                http:
                  paths:
                  - path: /
                    pathType: Prefix
                    backend:
                      service:
                        name: myapp
                        port:
                          number: 80
            EOF
        """
        
        // Обновление Ingress
        sh """
            kubectl patch ingress myapp-ingress \
                -p '{"spec":{"rules":[{"host":"new.myapp.example.com"}]}}'
        """
        
        // Проверка статуса Ingress
        sh "kubectl get ingress myapp-ingress"
    }
}
```

#### 5.8.8 Работа с Kubernetes Jobs
```groovy
// Выбор ноды с поддержкой Kubernetes Jobs
node('k8s-job-slave') {
    stage('Kubernetes Jobs') {
        // Создание Job
        sh """
            cat <<EOF | kubectl apply -f -
            apiVersion: batch/v1
            kind: Job
            metadata:
              name: backup-job
            spec:
              template:
                spec:
                  containers:
                  - name: backup
                    image: backup-tool:latest
                    command: ["/bin/sh", "-c"]
                    args: ["backup.sh"]
                  restartPolicy: Never
            EOF
        """
        
        // Мониторинг выполнения Job
        sh """
            kubectl wait --for=condition=complete job/backup-job
            kubectl logs job/backup-job
        """
        
        // Удаление Job
        sh "kubectl delete job backup-job"
    }
}
```

#### 5.8.9 Работа с Kubernetes StatefulSets
```groovy
// Выбор ноды с поддержкой Kubernetes StatefulSets
node('k8s-statefulset-slave') {
    stage('Kubernetes StatefulSets') {
        // Создание StatefulSet
        sh """
            cat <<EOF | kubectl apply -f -
            apiVersion: apps/v1
            kind: StatefulSet
            metadata:
              name: mysql
            spec:
              serviceName: mysql
              replicas: 3
              selector:
                matchLabels:
                  app: mysql
              template:
                metadata:
                  labels:
                    app: mysql
                spec:
                  containers:
                  - name: mysql
                    image: mysql:5.7
                    ports:
                    - containerPort: 3306
                    volumeMounts:
                    - name: data
                      mountPath: /var/lib/mysql
              volumeClaimTemplates:
              - metadata:
                  name: data
                spec:
                  accessModes: [ "ReadWriteOnce" ]
                  resources:
                    requests:
                      storage: 10Gi
            EOF
        """
        
        // Проверка статуса StatefulSet
        sh """
            kubectl get statefulset mysql
            kubectl get pods -l app=mysql
        """
        
        // Масштабирование StatefulSet
        sh "kubectl scale statefulset mysql --replicas=5"
    }
}
```

#### 5.8.10 Работа с Kubernetes Custom Resources
```groovy
// Выбор ноды с поддержкой Kubernetes Custom Resources
node('k8s-custom-resource-slave') {
    stage('Kubernetes Custom Resources') {
        // Создание Custom Resource Definition
        sh """
            cat <<EOF | kubectl apply -f -
            apiVersion: apiextensions.k8s.io/v1
            kind: CustomResourceDefinition
            metadata:
              name: applications.example.com
            spec:
              group: example.com
              names:
                kind: Application
                listKind: ApplicationList
                plural: applications
                singular: application
              scope: Namespaced
              versions:
              - name: v1
                served: true
                storage: true
                schema:
                  openAPIV3Schema:
                    type: object
                    properties:
                      spec:
                        type: object
                        properties:
                          name:
                            type: string
                          version:
                            type: string
            EOF
        """
        
        // Создание Custom Resource
        sh """
            cat <<EOF | kubectl apply -f -
            apiVersion: example.com/v1
            kind: Application
            metadata:
              name: myapp
            spec:
              name: My Application
              version: ${BUILD_NUMBER}
            EOF
        """
        
        // Проверка Custom Resource
        sh "kubectl get applications"
    }
}
```

### 5.9 Интеграция с Jira и Confluence

#### 5.9.1 Базовая интеграция с Jira
```groovy
// Выбор ноды с поддержкой Jira
node('jira-slave') {
    stage('Jira Integration') {
        // Создание задачи
        def issue = jiraCreateIssue(
            issueType: 'Task',
            summary: "Build ${BUILD_NUMBER}",
            description: "Build started at ${new Date()}",
            projectKey: 'PROJ'
        )
        
        // Обновление статуса задачи
        jiraTransitionIssue(
            idOrKey: issue.key,
            transition: 'In Progress'
        )
        
        // Добавление комментария
        jiraAddComment(
            idOrKey: issue.key,
            comment: "Build completed with status: ${currentBuild.result}"
        )
        
        // Привязка коммитов к задаче
        def commit = checkout scm
        jiraAddComment(
            idOrKey: issue.key,
            comment: "Commit: ${commit.GIT_COMMIT}"
        )
    }
}
```

#### 5.9.2 Работа с Jira Custom Fields
```groovy
// Выбор ноды с поддержкой Jira Custom Fields
node('jira-custom-slave') {
    stage('Jira Custom Fields') {
        // Создание задачи с кастомными полями
        def issue = jiraCreateIssue(
            issueType: 'Bug',
            summary: "Build ${BUILD_NUMBER} Failed",
            description: "Build failed at ${new Date()}",
            projectKey: 'PROJ',
            customFields: [
                [id: 'customfield_10000', value: BUILD_NUMBER],  // Build Number
                [id: 'customfield_10001', value: currentBuild.result],  // Build Status
                [id: 'customfield_10002', value: new Date().format('yyyy-MM-dd')]  // Date
            ]
        )
        
        // Обновление кастомных полей
        jiraUpdateIssue(
            idOrKey: issue.key,
            customFields: [
                [id: 'customfield_10003', value: 'High'],  // Priority
                [id: 'customfield_10004', value: 'Production']  // Environment
            ]
        )
    }
}
```

#### 5.9.3 Работа с Jira Workflow
```groovy
// Выбор ноды с поддержкой Jira Workflow
node('jira-workflow-slave') {
    stage('Jira Workflow') {
        // Получение списка доступных переходов
        def transitions = jiraGetTransitions(issueKey: 'PROJ-123')
        
        // Выполнение перехода с комментарием
        jiraTransitionIssue(
            idOrKey: 'PROJ-123',
            transition: 'Start Progress',
            comment: "Build ${BUILD_NUMBER} started"
        )
        
        // Проверка статуса задачи
        def issue = jiraGetIssue(issueKey: 'PROJ-123')
        echo "Current status: ${issue.fields.status.name}"
        
        // Добавление лейблов
        jiraAddLabels(
            idOrKey: 'PROJ-123',
            labels: ['build-${BUILD_NUMBER}', currentBuild.result.toLowerCase()]
        )
    }
}
```

#### 5.9.4 Работа с Jira Links
```groovy
// Выбор ноды с поддержкой Jira Links
node('jira-links-slave') {
    stage('Jira Links') {
        // Создание связи между задачами
        jiraCreateIssueLink(
            inwardIssue: 'PROJ-123',
            outwardIssue: 'PROJ-456',
            linkType: 'relates_to'
        )
        
        // Создание подзадачи
        def subtask = jiraCreateIssue(
            issueType: 'Sub-task',
            summary: "Build ${BUILD_NUMBER}",
            description: "Build details",
            projectKey: 'PROJ',
            parentKey: 'PROJ-123'
        )
        
        // Получение связанных задач
        def links = jiraGetIssueLinks(issueKey: 'PROJ-123')
        links.each { link ->
            echo "Linked issue: ${link.key}"
        }
    }
}
```

#### 5.9.5 Базовая интеграция с Confluence
```groovy
// Выбор ноды с поддержкой Confluence
node('confluence-slave') {
    stage('Confluence Integration') {
        // Создание страницы
        def page = confluenceCreatePage(
            spaceKey: 'PROJ',
            title: "Build ${BUILD_NUMBER} Report",
            content: """
                <h1>Build Information</h1>
                <p>Build Number: ${BUILD_NUMBER}</p>
                <p>Status: ${currentBuild.result}</p>
                <p>Duration: ${currentBuild.durationString}</p>
            """
        )
        
        // Обновление страницы
        confluenceUpdatePage(
            pageId: page.id,
            content: """
                <h1>Build Information</h1>
                <p>Build Number: ${BUILD_NUMBER}</p>
                <p>Status: ${currentBuild.result}</p>
                <p>Duration: ${currentBuild.durationString}</p>
                <h2>Test Results</h2>
                <p>Total Tests: ${testResults.totalCount}</p>
                <p>Failed Tests: ${testResults.failCount}</p>
            """
        )
    }
}
```

#### 5.9.6 Работа с Confluence Attachments
```groovy
// Выбор ноды с поддержкой Confluence Attachments
node('confluence-attachments-slave') {
    stage('Confluence Attachments') {
        // Создание страницы с вложениями
        def page = confluenceCreatePage(
            spaceKey: 'PROJ',
            title: "Build ${BUILD_NUMBER} Artifacts",
            content: "<h1>Build Artifacts</h1>"
        )
        
        // Загрузка артефактов
        archiveArtifacts artifacts: 'target/*.jar', fingerprint: true
        archiveArtifacts artifacts: 'target/surefire-reports/*.xml', fingerprint: true
        
        // Прикрепление файлов к странице
        confluenceUploadAttachment(
            pageId: page.id,
            file: 'target/*.jar',
            comment: "Build artifacts for version ${BUILD_NUMBER}"
        )
        
        // Прикрепление тестовых отчетов
        confluenceUploadAttachment(
            pageId: page.id,
            file: 'target/surefire-reports/*.xml',
            comment: "Test reports for build ${BUILD_NUMBER}"
        )
    }
}
```

#### 5.9.7 Работа с Confluence Templates
```groovy
// Выбор ноды с поддержкой Confluence Templates
node('confluence-templates-slave') {
    stage('Confluence Templates') {
        // Создание страницы из шаблона
        def page = confluenceCreatePageFromTemplate(
            spaceKey: 'PROJ',
            title: "Build ${BUILD_NUMBER} Report",
            templateId: 'build-report-template',
            variables: [
                'buildNumber': BUILD_NUMBER,
                'status': currentBuild.result,
                'duration': currentBuild.durationString,
                'changes': currentBuild.changeSets
            ]
        )
        
        // Обновление страницы с использованием макросов
        confluenceUpdatePage(
            pageId: page.id,
            content: """
                <h1>Build Report</h1>
                <ac:structured-macro ac:name="info">
                    <ac:rich-text-body>
                        <p>Build completed at ${new Date()}</p>
                    </ac:rich-text-body>
                </ac:structured-macro>
                <h2>Changes</h2>
                <ac:structured-macro ac:name="code">
                    <ac:parameter ac:name="language">groovy</ac:parameter>
                    <ac:plain-text-body>
                        ${currentBuild.changeSets}
                    </ac:plain-text-body>
                </ac:structured-macro>
            """
        )
    }
}
```

#### 5.9.8 Интеграция Jira и Confluence
```groovy
// Выбор ноды с поддержкой Jira и Confluence
node('jira-confluence-slave') {
    stage('Jira and Confluence Integration') {
        // Создание задачи в Jira
        def issue = jiraCreateIssue(
            issueType: 'Task',
            summary: "Build ${BUILD_NUMBER}",
            description: "Build started at ${new Date()}",
            projectKey: 'PROJ'
        )
        
        // Создание страницы в Confluence
        def page = confluenceCreatePage(
            spaceKey: 'PROJ',
            title: "Build ${BUILD_NUMBER} Report",
            content: """
                <h1>Build Information</h1>
                <p>Build Number: ${BUILD_NUMBER}</p>
                <p>Status: ${currentBuild.result}</p>
                <p>Duration: ${currentBuild.durationString}</p>
                <h2>Related Jira Issues</h2>
                <ac:structured-macro ac:name="jira">
                    <ac:parameter ac:name="server">Jira Server</ac:parameter>
                    <ac:parameter ac:name="columns">key,summary,type,created,updated,due,assignee,reporter,priority,status,resolution</ac:parameter>
                    <ac:parameter ac:name="serverId">${issue.key}</ac:parameter>
                    <ac:parameter ac:name="maximumIssues">20</ac:parameter>
                </ac:structured-macro>
            """
        )
        
        // Обновление задачи в Jira со ссылкой на Confluence
        jiraAddComment(
            idOrKey: issue.key,
            comment: "Build report: ${page.url}"
        )
        
        // Прикрепление артефактов к странице Confluence
        confluenceUploadAttachment(
            pageId: page.id,
            file: 'target/*.jar',
            comment: "Build artifacts for version ${BUILD_NUMBER}"
        )
    }
}
```

### 5.10 Цветной вывод в Jenkins Pipeline

#### 5.10.1 Базовый цветной вывод
```groovy
// Выбор ноды с поддержкой цветного вывода
node('color-output-slave') {
    stage('Color Output') {
        // Определение цветов
        def colors = [
            red: '\u001B[31m',
            green: '\u001B[32m',
            yellow: '\u001B[33m',
            blue: '\u001B[34m',
            magenta: '\u001B[35m',
            cyan: '\u001B[36m',
            reset: '\u001B[0m'
        ]
        
        // Вывод цветного текста
        echo "${colors.green}Build started successfully${colors.reset}"
        echo "${colors.yellow}Running tests...${colors.reset}"
        echo "${colors.blue}Deploying to staging${colors.reset}"
    }
}
```

#### 5.10.2 Цветной вывод статусов
```groovy
// Выбор ноды с поддержкой цветного вывода статусов
node('status-color-slave') {
    stage('Status Colors') {
        def colors = [
            success: '\u001B[32m',  // Зеленый
            warning: '\u001B[33m',  // Желтый
            error: '\u001B[31m',    // Красный
            info: '\u001B[36m',     // Голубой
            reset: '\u001B[0m'
        ]
        
        // Функция для цветного вывода статуса
        def printStatus = { status, message ->
            def color = colors[status] ?: colors.info
            echo "${color}${message}${colors.reset}"
        }
        
        // Примеры использования
        printStatus('success', '✓ Build completed successfully')
        printStatus('warning', '⚠ Some tests are slow')
        printStatus('error', '✗ Build failed')
        printStatus('info', 'ℹ Running in development mode')
    }
}
```

#### 5.10.3 Цветной вывод прогресса
```groovy
// Выбор ноды с поддержкой цветного вывода прогресса
node('progress-color-slave') {
    stage('Progress Colors') {
        def colors = [
            header: '\u001B[1;36m',  // Жирный голубой
            progress: '\u001B[32m',  // Зеленый
            bar: '\u001B[33m',      // Желтый
            reset: '\u001B[0m'
        ]
        
        // Функция для отображения прогресс-бара
        def showProgress = { current, total ->
            def percentage = (current / total * 100).toInteger()
            def bar = '█' * (percentage / 2) + '░' * (50 - percentage / 2)
            echo "${colors.header}Progress: ${colors.progress}${percentage}%${colors.reset}"
            echo "${colors.bar}${bar}${colors.reset}"
        }
        
        // Пример использования
        showProgress(25, 100)
        showProgress(50, 100)
        showProgress(75, 100)
        showProgress(100, 100)
    }
}
```

#### 5.10.4 Цветной вывод логов
```groovy
// Выбор ноды с поддержкой цветного вывода логов
node('log-color-slave') {
    stage('Log Colors') {
        def colors = [
            debug: '\u001B[37m',    // Белый
            info: '\u001B[36m',     // Голубой
            warn: '\u001B[33m',     // Желтый
            error: '\u001B[31m',    // Красный
            reset: '\u001B[0m'
        ]
        
        // Функция для цветного логирования
        def log = { level, message ->
            def color = colors[level] ?: colors.info
            def timestamp = new Date().format('yyyy-MM-dd HH:mm:ss')
            echo "${color}[${timestamp}] ${level.toUpperCase()}: ${message}${colors.reset}"
        }
        
        // Примеры использования
        log('debug', 'Detailed debug information')
        log('info', 'Application started successfully')
        log('warn', 'Resource usage is high')
        log('error', 'Failed to connect to database')
    }
}
```

#### 5.10.5 Цветной вывод результатов тестов
```groovy
// Выбор ноды с поддержкой цветного вывода результатов тестов
node('test-color-slave') {
    stage('Test Results Colors') {
        def colors = [
            passed: '\u001B[32m',   // Зеленый
            failed: '\u001B[31m',   // Красный
            skipped: '\u001B[33m',  // Желтый
            header: '\u001B[1;36m', // Жирный голубой
            reset: '\u001B[0m'
        ]
        
        // Функция для цветного вывода результатов тестов
        def printTestResults = { results ->
            echo "${colors.header}Test Results Summary:${colors.reset}"
            echo "${colors.passed}✓ Passed: ${results.passed}${colors.reset}"
            echo "${colors.failed}✗ Failed: ${results.failed}${colors.reset}"
            echo "${colors.skipped}⚠ Skipped: ${results.skipped}${colors.reset}"
        }
        
        // Пример использования
        def testResults = [
            passed: 45,
            failed: 3,
            skipped: 2
        ]
        printTestResults(testResults)
    }
}
```

#### 5.10.6 Цветной вывод метрик
```groovy
// Выбор ноды с поддержкой цветного вывода метрик
node('metrics-color-slave') {
    stage('Metrics Colors') {
        def colors = [
            good: '\u001B[32m',     // Зеленый
            warning: '\u001B[33m',  // Желтый
            critical: '\u001B[31m', // Красный
            label: '\u001B[36m',    // Голубой
            reset: '\u001B[0m'
        ]
        
        // Функция для цветного вывода метрик
        def printMetric = { name, value, threshold ->
            def color = value <= threshold ? colors.good : 
                       value <= threshold * 1.5 ? colors.warning : 
                       colors.critical
            echo "${colors.label}${name}:${colors.reset} ${color}${value}${colors.reset}"
        }
        
        // Пример использования
        printMetric('CPU Usage', 45, 80)
        printMetric('Memory Usage', 85, 80)
        printMetric('Disk Usage', 95, 80)
    }
}
```

#### 5.10.7 Цветной вывод в HTML отчетах
```groovy
// Выбор ноды с поддержкой HTML отчетов
node('html-color-slave') {
    stage('HTML Reports') {
        // Создание HTML отчета с цветным форматированием
        def htmlReport = """
            <html>
                <head>
                    <style>
                        .success { color: #28a745; }
                        .warning { color: #ffc107; }
                        .error { color: #dc3545; }
                        .info { color: #17a2b8; }
                    </style>
                </head>
                <body>
                    <h1>Build Report</h1>
                    <p class="success">✓ Build completed successfully</p>
                    <p class="warning">⚠ Some tests are slow</p>
                    <p class="error">✗ Build failed</p>
                    <p class="info">ℹ Running in development mode</p>
                </body>
            </html>
        """
        
        // Сохранение отчета
        writeFile file: 'build-report.html', text: htmlReport
        
        // Публикация отчета
        publishHTML(
            target: [
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: '.',
                reportFiles: 'build-report.html',
                reportName: 'Colorful Build Report'
            ]
        )
    }
}
```

#### 5.10.8 Цветной вывод в консоли с форматированием
```groovy
// Выбор ноды с поддержкой форматированного вывода
node('format-color-slave') {
    stage('Formatted Output') {
        def colors = [
            bold: '\u001B[1m',
            italic: '\u001B[3m',
            underline: '\u001B[4m',
            red: '\u001B[31m',
            green: '\u001B[32m',
            yellow: '\u001B[33m',
            blue: '\u001B[34m',
            reset: '\u001B[0m'
        ]
        
        // Функция для форматированного вывода
        def printFormatted = { text, style ->
            def format = style.collect { colors[it] }.join('')
            echo "${format}${text}${colors.reset}"
        }
        
        // Примеры использования
        printFormatted('Bold Text', ['bold'])
        printFormatted('Italic Text', ['italic'])
        printFormatted('Underlined Text', ['underline'])
        printFormatted('Bold Red Text', ['bold', 'red'])
        printFormatted('Italic Blue Text', ['italic', 'blue'])
        printFormatted('Bold Yellow Underlined Text', ['bold', 'yellow', 'underline'])
    }
}
```

### 5.11 Генерация Stage

#### 5.11.1 Динамическая генерация stage на основе параметров
```groovy
// Выбор ноды с поддержкой динамических stage
node('dynamic-stage-slave') {
    // Определение параметров для stage
    def stages = [
        [name: 'Build', enabled: true],
        [name: 'Test', enabled: true],
        [name: 'Deploy', enabled: false],
        [name: 'Notify', enabled: true]
    ]
    
    // Генерация stage на основе параметров
    stages.each { stageConfig ->
        if (stageConfig.enabled) {
            stage(stageConfig.name) {
                echo "Executing ${stageConfig.name} stage"
                // Выполнение действий для stage
                switch(stageConfig.name) {
                    case 'Build':
                        sh 'mvn clean package'
                        break
                    case 'Test':
                        sh 'mvn test'
                        break
                    case 'Deploy':
                        sh './deploy.sh'
                        break
                    case 'Notify':
                        emailext subject: "Build ${BUILD_NUMBER} ${currentBuild.result}"
                        break
                }
            }
        }
    }
}
```

#### 5.11.2 Генерация stage на основе матрицы сборок
```groovy
// Выбор ноды с поддержкой матричных stage
node('matrix-stage-slave') {
    // Определение матрицы сборок
    def matrix = [
        'java': ['8', '11', '17'],
        'python': ['3.8', '3.9', '3.10'],
        'nodejs': ['14', '16', '18']
    ]
    
    // Генерация stage для каждой комбинации
    matrix.each { lang, versions ->
        versions.each { version ->
            stage("Build ${lang} ${version}") {
                try {
                    switch(lang) {
                        case 'java':
                            sh "java -version ${version}"
                            break
                        case 'python':
                            sh "python --version ${version}"
                            break
                        case 'nodejs':
                            sh "node --version ${version}"
                            break
                    }
                } catch (Exception e) {
                    echo "Failed to build ${lang} ${version}: ${e.message}"
                }
            }
        }
    }
}
```

#### 5.11.3 Генерация stage на основе зависимостей
```groovy
// Выбор ноды с поддержкой зависимых stage
node('dependency-stage-slave') {
    // Определение зависимостей между stage
    def stageDependencies = [
        'Build': [],
        'Test': ['Build'],
        'Deploy': ['Test'],
        'Notify': ['Build', 'Test', 'Deploy']
    ]
    
    // Генерация stage с учетом зависимостей
    def executedStages = []
    
    stageDependencies.each { stageName, dependencies ->
        stage(stageName) {
            // Проверка зависимостей
            def canExecute = dependencies.every { dep ->
                executedStages.contains(dep)
            }
            
            if (canExecute) {
                echo "Executing ${stageName} stage"
                // Выполнение действий для stage
                switch(stageName) {
                    case 'Build':
                        sh 'mvn clean package'
                        break
                    case 'Test':
                        sh 'mvn test'
                        break
                    case 'Deploy':
                        sh './deploy.sh'
                        break
                    case 'Notify':
                        emailext subject: "Build ${BUILD_NUMBER} ${currentBuild.result}"
                        break
                }
                executedStages.add(stageName)
            } else {
                echo "Skipping ${stageName} stage - dependencies not met"
            }
        }
    }
}
```

#### 5.11.4 Генерация stage на основе условий
```groovy
// Выбор ноды с поддержкой условных stage
node('conditional-stage-slave') {
    // Определение условий для stage
    def stageConditions = [
        [name: 'Build', condition: { true }],
        [name: 'Test', condition: { env.BRANCH_NAME == 'main' }],
        [name: 'Deploy', condition: { currentBuild.result == 'SUCCESS' }],
        [name: 'Notify', condition: { env.BUILD_NUMBER.toInteger() % 10 == 0 }]
    ]
    
    // Генерация stage на основе условий
    stageConditions.each { stageConfig ->
        if (stageConfig.condition()) {
            stage(stageConfig.name) {
                echo "Executing ${stageConfig.name} stage"
                // Выполнение действий для stage
                switch(stageConfig.name) {
                    case 'Build':
                        sh 'mvn clean package'
                        break
                    case 'Test':
                        sh 'mvn test'
                        break
                    case 'Deploy':
                        sh './deploy.sh'
                        break
                    case 'Notify':
                        emailext subject: "Build ${BUILD_NUMBER} ${currentBuild.result}"
                        break
                }
            }
        } else {
            echo "Skipping ${stageConfig.name} stage - condition not met"
        }
    }
}
```

#### 5.11.5 Генерация stage на основе шаблонов
```groovy
// Выбор ноды с поддержкой шаблонных stage
node('template-stage-slave') {
    // Определение шаблонов stage
    def stageTemplates = [
        'build': { name, config ->
            stage(name) {
                echo "Building ${config.project}"
                sh "mvn clean package -Dversion=${config.version}"
            }
        },
        'test': { name, config ->
            stage(name) {
                echo "Testing ${config.project}"
                sh "mvn test ${config.testArgs}"
            }
        },
        'deploy': { name, config ->
            stage(name) {
                echo "Deploying ${config.project} to ${config.environment}"
                sh "./deploy.sh ${config.environment}"
            }
        }
    ]
    
    // Конфигурация для stage
    def stageConfigs = [
        [template: 'build', name: 'Build App', config: [project: 'myapp', version: '1.0.0']],
        [template: 'test', name: 'Test App', config: [project: 'myapp', testArgs: '-Dtest=*Test']],
        [template: 'deploy', name: 'Deploy App', config: [project: 'myapp', environment: 'staging']]
    ]
    
    // Генерация stage на основе шаблонов
    stageConfigs.each { stageConfig ->
        def template = stageTemplates[stageConfig.template]
        if (template) {
            template(stageConfig.name, stageConfig.config)
        }
    }
}
```

#### 5.11.6 Генерация stage на основе параллельных задач
```groovy
// Выбор ноды с поддержкой параллельных stage
node('parallel-stage-slave') {
    // Определение параллельных задач
    def parallelTasks = [
        'Unit Tests': {
            stage('Unit Tests') {
                sh 'mvn test -Dtest=*UnitTest'
            }
        },
        'Integration Tests': {
            stage('Integration Tests') {
                sh 'mvn test -Dtest=*IntegrationTest'
            }
        },
        'Performance Tests': {
            stage('Performance Tests') {
                sh 'mvn test -Dtest=*PerformanceTest'
            }
        }
    ]
    
    // Генерация параллельных stage
    parallel(parallelTasks)
    
    // Последовательные stage после параллельных
    stage('Deploy') {
        sh './deploy.sh'
    }
}
```

#### 5.11.7 Генерация stage на основе ошибок
```groovy
// Выбор ноды с поддержкой обработки ошибок в stage
node('error-stage-slave') {
    // Определение stage с обработкой ошибок
    def errorStages = [
        [name: 'Build', retry: 3],
        [name: 'Test', retry: 2],
        [name: 'Deploy', retry: 1]
    ]
    
    // Генерация stage с обработкой ошибок
    errorStages.each { stageConfig ->
        stage(stageConfig.name) {
            def retryCount = 0
            while (retryCount < stageConfig.retry) {
                try {
                    echo "Executing ${stageConfig.name} stage (attempt ${retryCount + 1})"
                    switch(stageConfig.name) {
                        case 'Build':
                            sh 'mvn clean package'
                            break
                        case 'Test':
                            sh 'mvn test'
                            break
                        case 'Deploy':
                            sh './deploy.sh'
                            break
                    }
                    break // Выход из цикла при успехе
                } catch (Exception e) {
                    retryCount++
                    if (retryCount >= stageConfig.retry) {
                        error "Failed ${stageConfig.name} after ${stageConfig.retry} attempts: ${e.message}"
                    } else {
                        echo "Retrying ${stageConfig.name} stage..."
                        sleep(5) // Пауза перед повторной попыткой
                    }
                }
            }
        }
    }
}
```

#### 5.11.8 Генерация stage на основе времени
```groovy
// Выбор ноды с поддержкой временных stage
node('time-stage-slave') {
    // Определение stage с временными ограничениями
    def timeStages = [
        [name: 'Build', timeout: 30],
        [name: 'Test', timeout: 15],
        [name: 'Deploy', timeout: 10]
    ]
    
    // Генерация stage с таймаутами
    timeStages.each { stageConfig ->
        stage(stageConfig.name) {
            timeout(time: stageConfig.timeout, unit: 'MINUTES') {
                echo "Executing ${stageConfig.name} stage with ${stageConfig.timeout} minutes timeout"
                switch(stageConfig.name) {
                    case 'Build':
                        sh 'mvn clean package'
                        break
                    case 'Test':
                        sh 'mvn test'
                        break
                    case 'Deploy':
                        sh './deploy.sh'
                        break
                }
            }
        }
    }
}
```

## 6. Полезные ресурсы

1. Официальная документация:
   - [Jenkins Pipeline Documentation](https://www.jenkins.io/doc/book/pipeline/)
   - [Groovy Documentation](http://groovy-lang.org/documentation.html)
   - [Jenkins Blue Ocean](https://www.jenkins.io/doc/book/blueocean/)

2. Примеры и шаблоны:
   - [Jenkins Pipeline Examples](https://github.com/jenkinsci/pipeline-examples)
   - [Jenkins Shared Libraries](https://github.com/jenkinsci/pipeline-shared-libraries)

3. Сообщество:
   - [Jenkins JIRA](https://issues.jenkins-ci.org/)
   - [Jenkins IRC](https://www.jenkins.io/chat/)
   - [Stack Overflow](https://stackoverflow.com/questions/tagged/jenkins-pipeline)