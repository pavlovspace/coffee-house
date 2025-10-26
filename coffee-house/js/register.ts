document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm') as HTMLFormElement | null;
  const loginInput = document.getElementById('login') as HTMLInputElement;
  const passwordInput = document.getElementById('password') as HTMLInputElement;
  const confirmInput = document.getElementById('confirm') as HTMLInputElement;
  const cityInput = document.getElementById('city') as HTMLInputElement;
  const streetInput = document.getElementById('street') as HTMLInputElement;
  const houseInput = document.getElementById('house') as HTMLInputElement;
  const paymentRadios = document.querySelectorAll('input[name="payment"]') as NodeListOf<HTMLInputElement>;
  const registerBtn = document.getElementById('registerBtn') as HTMLButtonElement;
  const errorMessage = document.getElementById('errorMessage') as HTMLElement | null;

  const VALIDATION_RULES = {
    login: /^[A-Za-z][A-Za-z0-9]{2,}$/, // логин с буквы, ≥3 символов, только латиница
    password: /^.{6,}$/, // пароль ≥6 символов
  };

  // ====== Утилиты ======
  const showError = (input: HTMLElement, message: string) => {
    input.classList.add('invalid');
    let msg = input.nextElementSibling;
    if (!msg || !msg.classList.contains('error-message')) {
      msg = document.createElement('p');
      msg.className = 'error-message';
      input.insertAdjacentElement('afterend', msg);
    }
    msg.textContent = message;
  };

  const clearError = (input: HTMLElement) => {
    input.classList.remove('invalid');
    const msg = input.nextElementSibling;
    if (msg && msg.classList.contains('error-message')) msg.remove();
  };

  // ====== Валидация ======
  const validate = (): boolean => {
    let valid = true;

    [loginInput, passwordInput, confirmInput, cityInput, streetInput, houseInput].forEach(clearError);

    if (!VALIDATION_RULES.login.test(loginInput.value)) {
      showError(loginInput, 'Login must start with a letter and contain ≥3 English letters.');
      valid = false;
    }

    if (!VALIDATION_RULES.password.test(passwordInput.value)) {
      showError(passwordInput, 'Password must be ≥6 characters.');
      valid = false;
    }

    if (confirmInput.value !== passwordInput.value || confirmInput.value === '') {
      showError(confirmInput, 'Passwords must match.');
      valid = false;
    }

    if (!cityInput.value.trim()) {
      showError(cityInput, 'City is required.');
      valid = false;
    }

    if (!streetInput.value.trim()) {
      showError(streetInput, 'Street is required.');
      valid = false;
    }

    if (!houseInput.value.trim()) {
      showError(houseInput, 'House number is required.');
      valid = false;
    }

    if (registerBtn) {
      registerBtn.disabled = !valid;
    }

    return valid;
  };

  // ====== События ======
  [loginInput, passwordInput, confirmInput, cityInput, streetInput, houseInput].forEach((el) => {
    el.addEventListener('input', validate);
    el.addEventListener('focus', () => clearError(el));
  });

  paymentRadios.forEach((r) => r.addEventListener('change', validate));

  // ====== Сабмит формы ======
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'cash';

    if (registerBtn) {
      registerBtn.disabled = true;
      registerBtn.textContent = 'Processing...';
    }

    const registrationData = {
      login: loginInput.value,
      password: passwordInput.value,
      confirmPassword: confirmInput.value,
      city: cityInput.value,
      street: streetInput.value,
      houseNumber: Number(houseInput.value),
      paymentMethod,
    };

    try {
      const response = await fetch(
        'https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/auth/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registrationData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const message = data.error || 'Registration failed';
        if (errorMessage) {
          errorMessage.textContent = message;
          errorMessage.classList.remove('hidden');
        }
        throw new Error(message);
      }

      // ✅ успешная регистрация
      localStorage.setItem('isAuthenticated', 'true');
      if (errorMessage) errorMessage.classList.add('hidden');
      showNotification('🎉 Registration successful! Redirecting...', 'success');
      setTimeout(() => (window.location.href = 'menu.html'), 1500);
    } catch (err) {
      console.error('❌ Registration error:', err);
      showNotification('Something went wrong. Please try again.', 'error');
      if (registerBtn) {
        registerBtn.disabled = false;
        registerBtn.textContent = 'Registration';
      }
    }
  });

  // ====== Уведомления ======
  function showNotification(text: string, type: 'success' | 'error') {
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

  // Кнопка с нужными классами
  registerBtn.className = 'button-icon-dark button-icon-dark--cart';
});
