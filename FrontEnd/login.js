const form = document.querySelector('form');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const emailInput = document.querySelector('#email');
  const passwordInput = document.querySelector('#password');

  const loginData = {
    email: emailInput.value,
    password: passwordInput.value
  }

  attemptLogin(loginData)
});



function attemptLogin(credentials) {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }

  fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(credentials)
  })
  .then(response => {

    if(response.ok)
      return response.json()
    else 
      throw new Error('LoginError')
  })
  .then(data => {
    sessionStorage.setItem('token', data.token);
    window.location.href = './admin.html';
  })
  .catch(error => alert('Les informations d\'identification sont incorrectes. Veuillez réessayer.'));
}
