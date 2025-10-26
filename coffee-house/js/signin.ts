document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const loginInput = document.getElementById('login');
  const passwordInput = document.getElementById('password');
  const signInBtn = document.getElementById('signInBtn');
  const errorContainer = document.getElementById('loginError');

const VALIDATION_RULES = {
  // логин: начинается с буквы, минимум 3 символа, можно цифры, только латиница
  login: /^[A-Za-z][A-Za-z0-9]{2,}$/,
  // пароль: минимум 6 символов, любые символы
  password: /^.{6,}$/,
};



  // --- показать ошибку под полем ---
  const showError = (input, message) => {
    input.classList.add('invalid');
    let msg = input.nextElementSibling;
    if (!msg || !msg.classList.contains('error-message')) {
      msg = document.createElement('p');
      msg.className = 'error-message';
      input.insertAdjacentElement('afterend', msg);
    }
    msg.textContent = message;
  };

  // --- очистить ---
  const clearError = (input) => {
    input.classList.remove('invalid');
    const msg = input.nextElementSibling;
    if (msg && msg.classList.contains('error-message')) msg.remove();
  };

  // --- валидация одного поля ---
  const validateField = (input) => {
    if (input === loginInput && !VALIDATION_RULES.login.test(input.value)) {
      showError(input, 'Login must start with a letter and be ≥3 English letters.');
      return false;
    }
    if (input === passwordInput && !VALIDATION_RULES.password.test(input.value)) {
      showError(input, 'Password must be ≥6 chars and include one special symbol.');
      return false;
    }
    return true;
  };

  // --- общая проверка и разблокировка кнопки ---
  const validateForm = () => {
    const validLogin = VALIDATION_RULES.login.test(loginInput.value);
    const validPassword = VALIDATION_RULES.password.test(passwordInput.value);
    signInBtn.disabled = !(validLogin && validPassword);
    return validLogin && validPassword;
  };

  // --- события ---
  [loginInput, passwordInput].forEach((input) => {
    input.addEventListener('input', validateForm);
    input.addEventListener('focus', () => clearError(input));
    input.addEventListener('blur', () => validateField(input));
  });

  // --- отправка формы ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    errorContainer.textContent = '';
    signInBtn.disabled = true;
    signInBtn.textContent = 'Signing in...';

    try {
      // имитация запроса
      await new Promise((r) => setTimeout(r, 1500));

      const correctLogin = 'admin';
      const correctPassword = 'Admin!123';

      if (loginInput.value !== correctLogin || passwordInput.value !== correctPassword) {
        throw new Error('Incorrect login or password');
      }

      localStorage.setItem('isAuthenticated', 'true');
      showNotification('Welcome back!', 'success');
      setTimeout(() => (window.location.href = 'menu.html'), 1500);
    } catch (err) {
      console.error(err);
      errorContainer.textContent = 'Incorrect login or password';
      signInBtn.disabled = false;
      signInBtn.textContent = 'Sign In';
    }
  });

  // --- уведомление ---
  function showNotification(text, type) {
    const note = document.createElement('div');
    note.className = `notification ${type}`;
    note.textContent = text;
    document.body.appendChild(note);
    setTimeout(() => note.classList.add('visible'), 10);
    setTimeout(() => {
      note.classList.remove('visible');
      setTimeout(() => note.remove(), 300);
    }, 3000);
  }
});
