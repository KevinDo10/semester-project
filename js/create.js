document.getElementById('create-post-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    if (!username || !token) {
        alert('You need to login first.');
        window.location.href = '/account/login.html';
        return;
    }

    const title = document.getElementById('title').value;
    const body = document.getElementById('body').value;
    const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim());
    const mediaUrl = document.getElementById('media-url').value;
    const mediaAlt = document.getElementById('media-alt').value;

    const postBody = {
        title: title,
        body: body,
        tags: tags,
        media: {
            url: mediaUrl,
            alt: mediaAlt
        }
    };
    console.log(username);
    fetch(`https://v2.api.noroff.dev/blog/posts/${username}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postBody)
    })
    .then(response => {
        console.log("Response status:", response.status);
        return response.json().then(data => ({ status: response.status, body: data }));
    })
    .then(({ status, body }) => {
        console.log("Create post response:", body);
        if (status === 201) {
            alert('Blog post created successfully!');
            window.location.href = '/post/edit.html';
        } else {
            let errorMessage;
            if (body.errors) {
                errorMessage = body.errors.map(err => err.message).join(', ');
            } else {
                errorMessage = "Failed to create post. Please try again.";
            }
            alert(errorMessage);
        }
    })
    .catch(error => {
        console.error('There was a problem with the create post request:', error);
        alert('Failed to create post. Please try again.');
    });
});
