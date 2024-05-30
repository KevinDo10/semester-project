document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    let bio;
    if (document.getElementById('bio')) {
        bio = document.getElementById('bio').value;
    } else {
        bio = "";
    }

    let avatarUrl;
    if (document.getElementById('avatar-url')) {
        avatarUrl = document.getElementById('avatar-url').value;
    } else {
        avatarUrl = "";
    }

    let avatarAlt;
    if (document.getElementById('avatar-alt')) {
        avatarAlt = document.getElementById('avatar-alt').value;
    } else {
        avatarAlt = "";
    }

    let bannerUrl;
    if (document.getElementById('banner-url')) {
        bannerUrl = document.getElementById('banner-url').value;
    } else {
        bannerUrl = "";
    }

    let bannerAlt;
    if (document.getElementById('banner-alt')) {
        bannerAlt = document.getElementById('banner-alt').value;
    } else {
        bannerAlt = "";
    }

    let venueManager;
    if (document.getElementById('venue-manager')) {
        venueManager = document.getElementById('venue-manager').checked;
    } else {
        venueManager = false;
    }

    const requestBody = {
        name: name,
        email: email,
        password: password,
        bio: bio,
        avatar: {
            url: avatarUrl,
            alt: avatarAlt
        },
        banner: {
            url: bannerUrl,
            alt: bannerAlt
        },
        venueManager: venueManager
    };

    if (!bio) delete requestBody.bio;
    if (!avatarUrl) delete requestBody.avatar;
    if (!bannerUrl) delete requestBody.banner;

    console.log("Attempting to register with:", requestBody);

    fetch('https://v2.api.noroff.dev/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => {
        console.log("Response status:", response.status);
        return response.json().then(data => ({ status: response.status, body: data }));
    })
    .then(({ status, body }) => {
        console.log("Registration response:", body);
        if (status === 201) {
            localStorage.setItem('username', email);
            alert('Registration successful!');
            window.location.href = '/account/login.html';
        } else {
            let errorMessage;
            if (body.errors) {
                errorMessage = body.errors.map(err => err.message).join(', ');
            } else {
                errorMessage ="Please try again.";
            }
            alert(`Registration failed: ${errorMessage}`);
        }
    })
    .catch(error => {
        console.error('There was a problem with the registration request:', error);
        alert(`Registration failed: ${error.message || "Please check your details and try again."}`);
    });
});
