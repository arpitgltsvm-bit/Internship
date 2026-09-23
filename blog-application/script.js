const API_URL = 'http://localhost:5000/api';

// DOM Elements
const registerForm = document.getElementById('registerForm');
const blogForm = document.getElementById('blogForm');
const blogsContainer = document.getElementById('blogsContainer');
const refreshBtn = document.getElementById('refreshBtn');
const authMessage = document.getElementById('authMessage');
const blogMessage = document.getElementById('blogMessage');

// Modal Elements
const blogModal = document.getElementById('blogModal');
const modalTitle = document.getElementById('modalTitle');
const modalMeta = document.getElementById('modalMeta');
const modalContent = document.getElementById('modalContent');
const closeBtn = document.querySelector('.close-btn');

// Fetch and Render Blogs from MongoDB
async function fetchBlogs() {
  try {
    const res = await fetch(`${API_URL}/blogs`);
    const data = await res.json();
    
    blogsContainer.innerHTML = '';
    
    if (!data || data.length === 0) {
      blogsContainer.innerHTML = `<p class="empty-state">No records found in MongoDB. Create one on the left!</p>`;
      return;
    }

    data.forEach(blog => {
      const blogCard = document.createElement('div');
      blogCard.className = 'blog-item';
      blogCard.innerHTML = `
        <h3>${escapeHtml(blog.title)}</h3>
        <p class="meta">By ${escapeHtml(blog.author)} on ${new Date(blog.createdAt).toLocaleDateString()}</p>
        <button class="view-btn" onclick="viewBlogDetails('${blog._id}')">Read Details →</button>
      `;
      blogsContainer.appendChild(blogCard);
    });
  } catch (err) {
    blogsContainer.innerHTML = `<p class="error-text">❌ Error connecting to backend api server.</p>`;
  }
}

// Open Dynamic Individual Blog Modal
async function viewBlogDetails(id) {
  try {
    const res = await fetch(`${API_URL}/blogs/${id}`);
    if (!res.ok) throw new Error();
    const blog = await res.json();

    modalTitle.textContent = blog.title;
    modalMeta.textContent = `Published by ${blog.author} on ${new Date(blog.createdAt).toLocaleString()}`;
    modalContent.textContent = blog.content;
    
    blogModal.style.display = 'block';
  } catch (err) {
    alert('Failed to retrieve deep data structure for this post ID.');
  }
}

// Handle Secure Password User Registration
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    if (res.ok) {
      showMsg(authMessage, '✅ User encrypted & stored successfully!', 'success');
      registerForm.reset();
    } else {
      showMsg(authMessage, `❌ ${data.error || 'Registration failed'}`, 'error');
    }
  } catch (err) {
    showMsg(authMessage, '❌ Network communication failure.', 'error');
  }
});

// Handle New Blog Document Creation
blogForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('blogTitle').value;
  const author = document.getElementById('blogAuthor').value;
  const content = document.getElementById('blogContent').value;

  try {
    const res = await fetch(`${API_URL}/blogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, author, content })
    });

    if (res.ok) {
      showMsg(blogMessage, '✅ Post saved live to MongoDB cluster!', 'success');
      blogForm.reset();
      fetchBlogs();
    } else {
      showMsg(blogMessage, '❌ Failed to record blog document.', 'error');
    }
  } catch (err) {
    showMsg(blogMessage, '❌ Network communication failure.', 'error');
  }
});

// Helper Utilities
function showMsg(element, text, type) {
  element.textContent = text;
  element.className = `message ${type}`;
  setTimeout(() => { element.textContent = ''; element.className = 'message'; }, 4000);
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Modal closing event assignments
closeBtn.onclick = () => blogModal.style.display = 'none';
window.onclick = (e) => { if (e.target === blogModal) blogModal.style.display = 'none'; };
refreshBtn.onclick = fetchBlogs;

// Initial invocation on site startup
fetchBlogs();
