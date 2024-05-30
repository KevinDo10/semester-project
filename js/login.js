document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('https://v2.api.noroff.dev/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(response => {
        return response.json().then(data => ({ status: response.status, body: data }));
    })
    .then(({ status, body }) => {
        console.log("Login response:", body);
        if (status === 200 && body.data && body.data.accessToken) {
            localStorage.setItem('token', body.data.accessToken);
            localStorage.setItem('username', body.data.name);
            alert('Login successful!');
            window.location.href = '/post/edit.html';
        } else {
            let errorMessage;
            if (body.errors) {
                errorMessage = body.errors.map(err => err.message).join(', ');
            } else {
                errorMessage = "Login failed. Please check your credentials.";
            }
            alert(errorMessage);
        }
    })
    .catch(error => {
        console.error('There was a problem with the login request:', error);
        alert('Login failed. Please check your credentials and try again.');
    });
});
