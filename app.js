// Newsletter Blog Widget
// This widget displays the latest newsletter posts from your publication

// Configuration - API endpoint
const API_CONFIG = {
    POSTS_URL: '/api/posts' // Our local server proxy endpoint
};

document.addEventListener('DOMContentLoaded', function() {
    loadLatestPosts();
});

// Function to load and display latest newsletter posts
async function loadLatestPosts() {
    const postsContainer = document.getElementById('posts-container');
    const loadingEl = document.getElementById('loading');
    
    console.log('Loading posts from local API proxy...');
    
    try {
        showLoading(true);

        // Fetch posts from our local server proxy
        console.log('Attempting to fetch posts from:', API_CONFIG.POSTS_URL);
        
        const response = await fetch(API_CONFIG.POSTS_URL);
        
        console.log('API Response status:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('API Error response:', errorData);
            
            if (response.status === 400 && errorData.error?.includes('Missing BEEHIIV')) {
                showError('Please add your Beehiiv API credentials to the .env file');
                return;
            }
            
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('API Response data:', data);
        
        if (data.data && data.data.length > 0) {
            console.log('Sample post data:', data.data[0]);
            console.log('Available date fields:', Object.keys(data.data[0]).filter(key => key.toLowerCase().includes('date') || key.toLowerCase().includes('created') || key.toLowerCase().includes('publish')));
            displayPosts(data.data);
        } else {
            showError('No newsletter posts found. Check your Beehiiv publication.');
        }
        
    } catch (error) {
        console.error('Error loading posts:', error);
        showError('Failed to load newsletter posts. Please try again later.');
    } finally {
        showLoading(false);
    }
}

// Function to display posts in the UI
function displayPosts(posts) {
    const postsContainer = document.getElementById('posts-container');
    
    if (!posts || posts.length === 0) {
        postsContainer.innerHTML = '<div class="no-posts">No newsletter posts available at the moment.</div>';
        return;
    }
    
    // Sort posts by publish_date (most recent first)
    const sortedPosts = posts.sort((a, b) => {
        const dateA = a.publish_date || a.created || 0;
        const dateB = b.publish_date || b.created || 0;
        return dateB - dateA; // Descending order (newest first)
    });
    
    console.log('Sorted posts:', sortedPosts.map(p => ({ title: p.title, date: p.created || p.publish_date || p.date })));
    
    const postsHTML = sortedPosts.map(post => createPostHTML(post)).join('');
    postsContainer.innerHTML = postsHTML;
}

// Function to create HTML for a single post
function createPostHTML(post) {
    // Use publish_date as the primary date field (it's in Unix timestamp seconds)
    let dateValue = post.publish_date || post.created;
    
    // Convert Unix timestamp (seconds) to milliseconds for JavaScript Date
    if (typeof dateValue === 'number') {
        dateValue = dateValue * 1000;
    }
    
    const publishDate = new Date(dateValue).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    return `
        <article class="post-card" onclick="window.open('${post.web_url}', '_blank')" style="cursor: pointer;">
            <div class="post-image">
                <img src="${post.thumbnail_url || 'https://via.placeholder.com/300x200/CCCCCC/666666?text=Newsletter+Post'}" 
                     alt="${post.title}" 
                     onerror="this.src='https://via.placeholder.com/300x200/CCCCCC/666666?text=Newsletter+Post'">
            </div>
            <div class="post-content">
                <div class="post-date">${publishDate}</div>
                <h2 class="post-title">${post.title}</h2>
                ${post.subtitle ? `<p class="post-subtitle">${post.subtitle}</p>` : ''}
                <p class="post-preview">${post.preview_text || ''}</p>
                <div class="read-more-btn">
                    Read More →
                </div>
            </div>
        </article>
    `;
}

// Function to show/hide loading state
function showLoading(isLoading) {
    const loadingEl = document.getElementById('loading');
    const postsContainer = document.getElementById('posts-container');
    
    if (isLoading) {
        loadingEl.style.display = 'block';
        postsContainer.style.display = 'none';
    } else {
        loadingEl.style.display = 'none';
        postsContainer.style.display = 'block';
    }
}

// Function to show error messages
function showError(message) {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = `<div class="error-message">${message}</div>`;
}

// Optional: Refresh posts function
function refreshPosts() {
    loadLatestPosts();
}