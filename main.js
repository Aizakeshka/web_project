// Получаем элементы
    const g = document.getElementById('greeting');
    const btn = document.getElementById('askName');

    // Функция показывает приветствие
    function showGreeting(name) {
      g.textContent = name
        ? `Привет, ${name}!`
        : 'Добро пожаловать!';
    }

    // Функция спрашивает имя
    function askName() {
      const name = prompt('Как тебя зовут?');
      if (name) {
        localStorage.setItem('visitorName', name);
      } else {
        localStorage.removeItem('visitorName');
      }
      showGreeting(localStorage.getItem('visitorName'));
    }

    // Когда нажимаем кнопку — спрашиваем имя
    btn.addEventListener('click', askName);

    // Если имя уже сохранено — показываем сразу
    showGreeting(localStorage.getItem('visitorName'));

    // Функция спрашивает имя
function askName() {
  const name = prompt('Как тебя зовут?');
  if (name) {
   localStorage.setItem('visitorName', name);
  } else {
    localStorage.removeItem('visitorName');
 }
 showGreeting(localStorage.getItem('visitorName'));
 }
 // Когда нажимаем кнопку — спрашиваем имя
 btn.addEventListener('click', askName);
 // Если имя уже сохранено — показываем сразу
 showGreeting(localStorage.getItem('visitorName'));
