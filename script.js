document.addEventListener('DOMContentLoaded', function() {
    // User authentication popups - UPDATED VERSION
    const userBtn = document.getElementById('user-btn');
    const loginPopup = document.getElementById('login-popup');
    const registerPopup = document.getElementById('register-popup');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const closeBtns = document.querySelectorAll('.close-btn');

    // Function to show popup with animation
    function showPopup(popup) {
        popup.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    // Function to hide popup with animation
    function hidePopup(popup) {
        popup.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
        // Wait for animation to complete before setting display
        setTimeout(() => {
            if (!popup.classList.contains('active')) {
                popup.style.display = 'none';
            }
        }, 300);
    }

    // Initialize popups
    if (loginPopup) loginPopup.style.display = 'flex';
    if (registerPopup) registerPopup.style.display = 'flex';

    // Show login popup when user icon is clicked
    if (userBtn && loginPopup) {
        userBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showPopup(loginPopup);
            if (registerPopup) hidePopup(registerPopup);
        });
    }

    // Toggle between login and register popups
    if (showRegister && registerPopup && loginPopup) {
        showRegister.addEventListener('click', function(e) {
            e.preventDefault();
            hidePopup(loginPopup);
            setTimeout(() => showPopup(registerPopup), 300);
        });
    }

    if (showLogin && registerPopup && loginPopup) {
        showLogin.addEventListener('click', function(e) {
            e.preventDefault();
            hidePopup(registerPopup);
            setTimeout(() => showPopup(loginPopup), 300);
        });
    }

    // Close popups when close button is clicked
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const popup = this.closest('.login-popup, .register-popup');
            if (popup) hidePopup(popup);
        });
    });

    // Close popups when clicking outside
    if (loginPopup) {
        loginPopup.addEventListener('click', function(e) {
            if (e.target === this) hidePopup(this);
        });
    }

    if (registerPopup) {
        registerPopup.addEventListener('click', function(e) {
            if (e.target === this) hidePopup(this);
        });
    }
});

// Community Post Functionality
document.getElementById('postBtn')?.addEventListener('click', function() {
    const postContent = document.getElementById('postContent').value;
    const imageInput = document.getElementById('postImage');

    if (postContent.trim() === '' && imageInput.files.length === 0) {
        alert('Please enter some content or select an image');
        return;
    } 

    const postsContainer = document.getElementById('postsContainer');
    const newPost = document.createElement('div');
    newPost.className = 'post';

    // Get current time
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    // Create post HTML
    newPost.innerHTML = `
        <div class="post-header">
            <div class="post-avatar">YO</div>
            <div>
                <span class="post-user">You</span>
                <span class="post-time">Just now</span>
            </div>
        </div>
        <div class="post-content">
            <p>${postContent}</p>
            ${imageInput.files.length > 0 ? 
                `<img src="${URL.createObjectURL(imageInput.files[0])}" class="post-image" alt="Post image">` : ''}
        </div>
        <div class="post-actions">
            <div class="action-btn like-btn" data-post="new">
                <i class="far fa-thumbs-up"></i>
                <span>Like</span>
                <span class="like-count">0</span>
            </div>
            <div class="action-btn comment-btn">
                <i class="far fa-comment"></i>
                <span>Comment</span>
            </div>
            <div class="action-btn share-btn">
                <i class="fas fa-share"></i>
                <span>Share</span>
            </div>
        </div>
    `;

    // Add new post at the top
    postsContainer.insertBefore(newPost, postsContainer.firstChild);

    // Clear form
    document.getElementById('postContent').value = '';
    imageInput.value = '';

    // Add event listener to the new like button
    newPost.querySelector('.like-btn').addEventListener('click', toggleLike);
});

// Like functionality
function toggleLike(e) {
    const likeBtn = e.currentTarget;
    const likeIcon = likeBtn.querySelector('i');
    const likeCount = likeBtn.querySelector('.like-count');

    if (likeBtn.classList.contains('liked')) {
        likeBtn.classList.remove('liked');
        likeIcon.className = 'far fa-thumbs-up';
        likeCount.textContent = parseInt(likeCount.textContent) - 1;
    } else {
        likeBtn.classList.add('liked');
        likeIcon.className = 'fas fa-thumbs-up';
        likeCount.textContent = parseInt(likeCount.textContent) + 1;
    }
}

// Add event listeners to all like buttons
document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', toggleLike);
});

// User Profile Dropdown
document.addEventListener('DOMContentLoaded', function() {
    // User Profile Dropdown Toggle
    const userBtn = document.getElementById('user-btn');
    const profileDropdown = document.querySelector('.profile');

    if (userBtn && profileDropdown) {
        userBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            profileDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!profileDropdown.contains(e.target) && e.target !== userBtn) {
                profileDropdown.classList.remove('active');
            }
        });

        // Close dropdown on scroll
        window.addEventListener('scroll', function() {
            if (profileDropdown) {
                profileDropdown.classList.remove('active');
            }
        });
    }
});

// User data and authentication
let currentUser = null;
let cartItems = JSON.parse(localStorage.getItem('kiffishCart')) || [];

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load user data from localStorage if available
    const savedUser = localStorage.getItem('kiffishUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIAfterLogin();
    }
    
    // Initialize all buttons and forms
    initAuthSystem();
    initCartSystem();
});

function initAuthSystem() {
    // User icon click handler
    document.getElementById('user-btn').addEventListener('click', function(e) {
        e.preventDefault();
        if (currentUser) {
            // Show profile dropdown
            document.querySelector('.profile').style.display = 'block';
        } else {
            // Show login popup
            document.getElementById('login-popup').style.display = 'flex';
        }
    });

    // Login form submission
    document.querySelector('.login-form form').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Simple validation (in real app, you'd check against database)
        const users = JSON.parse(localStorage.getItem('kiffishUsers')) || [];
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            currentUser = user;
            localStorage.setItem('kiffishUser', JSON.stringify(user));
            updateUIAfterLogin();
            document.getElementById('login-popup').style.display = 'none';
        } else {
            alert('Invalid username or password');
        }
    });

    // Register form submission
    document.querySelector('.register-form form').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        // Save new user
        const newUser = { username, email, password };
        const users = JSON.parse(localStorage.getItem('kiffishUsers')) || [];
        users.push(newUser);
        localStorage.setItem('kiffishUsers', JSON.stringify(users));
        
        // Auto-login after registration
        currentUser = newUser;
        localStorage.setItem('kiffishUser', JSON.stringify(newUser));
        updateUIAfterLogin();
        document.getElementById('register-popup').style.display = 'none';
        alert('Registration successful! You are now logged in.');
    });

    // Logout button
    document.querySelector('.logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        currentUser = null;
        localStorage.removeItem('kiffishUser');
        updateUIAfterLogout();
        document.querySelector('.profile').style.display = 'none';
    });

    // Toggle between login and register forms
    document.getElementById('show-register').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('login-popup').style.display = 'none';
        document.getElementById('register-popup').style.display = 'flex';
    });

    document.getElementById('show-login').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('register-popup').style.display = 'none';
        document.getElementById('login-popup').style.display = 'flex';
    });

    // Close buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.login-popup, .register-popup').style.display = 'none';
        });
    });
}

function initCartSystem() {
    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (!currentUser) {
                alert('Please login to add items to cart');
                document.getElementById('login-popup').style.display = 'flex';
                return;
            }
            
            const productCard = this.closest('.product-card');
            const product = {
                name: productCard.querySelector('.product-name').textContent,
                price: productCard.querySelector('.product-price').textContent,
                seller: productCard.querySelector('.product-seller')?.textContent || 'Unknown Seller',
                image: productCard.querySelector('.product-media video')?.src || 
                       productCard.querySelector('.product-media img')?.src || ''
            };
            
            cartItems.push(product);
            localStorage.setItem('kiffishCart', JSON.stringify(cartItems));
            
            if (confirm(`${product.name} added to cart!\nGo to cart now?`)) {
                window.location.href = 'cart.html';
            }
        });
    });
}

function updateUIAfterLogin() {
    // Show cart buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.style.display = 'block';
    });
    
    // Update profile info
    if (currentUser) {
        document.querySelector('.profile-content .name').textContent = currentUser.username;
        document.querySelector('.profile-content .email').textContent = currentUser.email;
    }
}

function updateUIAfterLogout() {
    // Hide cart buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.style.display = 'none';
    });
}