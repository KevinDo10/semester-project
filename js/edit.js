document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    if (!username || !token) {
        alert('You need to login first.');
        window.location.href = '/account/login.html';
        return;
    }

    const postList = document.getElementById('post-list');
    const editPostSection = document.getElementById('edit-post');
    const editForm = document.getElementById('edit-form');
    let currentPostId = null;

    fetch(`https://v2.api.noroff.dev/blog/posts/${username}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(posts => {
        console.log('Fetched posts:', posts);
        if (Array.isArray(posts.data)) {
            displayPosts(posts.data);
        } else {
            console.error('Expected an array but got:', posts.data);
        }
    })
    .catch(error => {
        console.error('Error fetching posts:', error);
    });

    function displayPosts(posts) {
        postList.innerHTML = `
            <button onclick="createNewPost()">Create New Post</button>
        `;
        posts.forEach(post => {
            const postItem = document.createElement('div');
            postItem.className = 'post-item';
            postItem.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.body.slice(0, 100)}...</p>
                <button onclick="editPost('${post.id}')">Edit</button>
                <button onclick="deletePost('${post.id}')">Delete</button>
            `;
            postList.appendChild(postItem);
        });
    }

    window.editPost = function(postId) {
        currentPostId = postId;
        fetch(`https://v2.api.noroff.dev/blog/posts/${username}/${postId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(responseData => {
            const post = responseData.data; 
            console.log('Fetched Post for Editing:', post); 
            document.getElementById('title').value = post.title;
            document.getElementById('content').value = post.body;
            if (post.media && post.media.url) {
                document.getElementById('image').value = post.media.url;
            } else {
                document.getElementById('image').value = '';
            }            
            editPostSection.style.display = 'block';
            postList.style.display = 'none';
        })
        .catch(error => {
            console.error('Error fetching post:', error);
        });
    };
    
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const updatedPost = {
            title: document.getElementById('title').value,
            body: document.getElementById('content').value,
            media: {
                url: document.getElementById('image').value,
                alt: ''
            }
        };

        fetch(`https://v2.api.noroff.dev/blog/posts/${username}/${currentPostId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedPost)
        })
        .then(response => response.json())
        .then(data => {
            alert('Post updated successfully!');
            window.location.href = '/post/edit.html';
        })
        .catch(error => {
            console.error('Error updating post:', error);
        });
    });

    window.deletePost = function(postId) {
        if (confirm('Are you sure you want to delete this post?')) {
            fetch(`https://v2.api.noroff.dev/blog/posts/${username}/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(() => {
                alert('Post deleted successfully!');
                window.location.href = '/post/edit.html';
            })
            .catch(error => {
                console.error('Error deleting post:', error);
            });
        }
    };

    window.deleteCurrentPost = function() {
        deletePost(currentPostId);
    };

    window.cancelEdit = function() {
        editPostSection.style.display = 'none';
        postList.style.display = 'block';
    };

    window.createNewPost = function() {
        window.location.href = '/post/post.html';
    };
});
