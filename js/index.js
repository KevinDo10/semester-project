document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    const postsPerPage = 12;
    let currentPage = 1;
    let totalPages = 1;

    if (!username || !token) {
        alert('You need to login first.');
        window.location.href = '/account/login.html';
        return;
    }

    fetchPosts(currentPage);
    function fetchPosts(page) {
        fetch(`https://v2.api.noroff.dev/blog/posts/${username}?page=${page}&limit=${postsPerPage}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('API response:', data); 
            const posts = data.data || []; 
            totalPages = Math.ceil((data.meta && data.meta.total) / postsPerPage) || 1;
            displayCarousel(posts.slice(0, 3));
            displayPosts(posts);
            updatePagination();
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
        });
    }

    function displayCarousel(posts) {
        const carouselItems = document.getElementById('carousel-items');
        carouselItems.innerHTML = '';
        posts.forEach((post, index) => {
            const item = document.createElement('div');
            item.className = 'carousel-item';
            item.innerHTML = `
                <h3>${post.title}</h3>
                <img src="${post.media?.url || ''}" alt="${post.media?.alt || 'Image'}" style="width:100rem; height:15.625rem;">
                <p>${(post.body && post.body.slice(0, 100)) || ''}...</p>
                <button onclick="viewPost('${post.id}')">Read More</button>
            `;
            carouselItems.appendChild(item);
        });
        setCarouselItem(0); 
    }

    function setCarouselItem(index) {
        const carouselItems = document.querySelectorAll('.carousel-item');
        carouselItems.forEach((item, i) => {
            if (i === index) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    function changePage(direction) {
        if (direction === 'next' && currentPage < totalPages) {
            currentPage++;
        } else if (direction === 'prev' && currentPage > 1) {
            currentPage--;
        }
        fetchPosts(currentPage);
    }

    let carouselIndex = 0;
    document.getElementById('prev-btn').addEventListener('click', () => {
        if (carouselIndex === 0) {
            carouselIndex = 2;
        } else {
            carouselIndex = carouselIndex - 1;
        }
        setCarouselItem(carouselIndex);
    });
    document.getElementById('next-btn').addEventListener('click', () => {
        if (carouselIndex === 2) {
            carouselIndex = 0;
        } else {
            carouselIndex = carouselIndex + 1;
        }
        setCarouselItem(carouselIndex);
    });

    function displayPosts(posts) {
        const postGrid = document.getElementById('post-grid');
        postGrid.innerHTML = '';
        posts.forEach(post => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'post-thumbnail';
            thumbnail.innerHTML = `
                <h4>${post.title}</h4>
                <img src="${post.media?.url || ''}" alt="${post.media?.alt || 'Image'}" style="width:6.25rem; height:6.25rem;">
                <p>${(post.body && post.body.slice(0, 50)) || ''}...</p>
                <button onclick="viewPost('${post.id}')">Read More</button>
            `;
            postGrid.appendChild(thumbnail);
            console.log(post.id);
        });
    }

    function updatePagination() {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            if (i === currentPage) {
                pageButton.className = 'active';
            } else {
                pageButton.className = '';
            }            
            pageButton.addEventListener('click', () => fetchPosts(i));
            pagination.appendChild(pageButton);
        }
    }

    window.viewPost = function (id) {
        window.location.href = `/post/index.html?id=${id}`;
    };
});
