document.addEventListener('DOMContentLoaded', function() {
    // Загрузка Markdown файла
    fetch('jenkins_pipeline_guide.md')
        .then(response => response.text())
        .then(markdown => {
            // Конвертация Markdown в HTML
            const html = marked.parse(markdown);
            document.getElementById('content').innerHTML = html;
            
            // Создание оглавления
            createTableOfContents();
            
            // Подсветка синтаксиса
            Prism.highlightAll();
        })
        .catch(error => console.error('Error loading markdown:', error));
});

function createTableOfContents() {
    const toc = document.getElementById('toc');
    const headings = document.querySelectorAll('h1, h2, h3');
    
    headings.forEach((heading, index) => {
        // Добавляем id к заголовкам
        heading.id = `heading-${index}`;
        
        // Создаем элемент оглавления
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${heading.id}`;
        a.textContent = heading.textContent;
        
        // Добавляем отступы в зависимости от уровня заголовка
        const level = parseInt(heading.tagName[1]);
        a.style.paddingLeft = `${(level - 1) * 1}rem`;
        
        li.appendChild(a);
        toc.appendChild(li);
    });
    
    // Плавная прокрутка к якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
} 