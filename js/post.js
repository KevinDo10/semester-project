document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    console.log('Post ID:', postId);
    console.log('Username:', username);
    console.log('Token:', token);

    if (!username || !token) {
        alert('You need to login first.');
        window.location.href = '../account/login.html';
        return;
    }

    if (!postId) {
        alert('No post ID found in the URL.');
        window.location.href = '../index.html';
        return;
    }

    fetch(`https://v2.api.noroff.dev/blog/posts/${username}/${postId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(responseData => {
        const post = responseData.data;
        console.log('Fetched Post:', post); 
        displayPost(post);
    })
    .catch(error => {
        console.error('Error fetching post:', error);
        alert('Error fetching post. Please try again later.');
        window.location.href = '../index.html';
    });

    function displayPost(post) {
        const postContent = document.getElementById('post-content');
        postContent.innerHTML = `
            <h2>${post.title}</h2>
            <p><strong>By:</strong> ${post.author.name}</p>
            <p><strong>Published on:</strong> ${new Date(post.created).toLocaleDateString()}</p>
            <img src="${post.media?.url || ''}" alt="${post.media?.alt || post.title}" style="width:15.625rem; height:15.625rem;">
            <p>${post.body}</p>
        `;
    }
});
