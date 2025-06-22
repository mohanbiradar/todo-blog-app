// Blog Functions
let blogPosts = JSON.parse(localStorage.getItem('blogPosts')) || [];
let editingPostId = null;

function saveBlogPost() {
    const titleInput = document.getElementById('blog-title');
    const contentInput = document.getElementById('blog-content');
    const tagsInput = document.getElementById('blog-tags');

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const tags = tagsInput.value.trim();

    if (!title || !content) {
        alert('Please enter both title and content!');
        return;
    }

    if (editingPostId) {
        blogPosts = blogPosts.map(post =>
            post.id === editingPostId
                ? { ...post, title, content, tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag), updatedAt: new Date().toISOString() }
                : post
        );
        editingPostId = null;
        document.getElementById('cancel-edit').style.display = 'none';
    } else {
        const post = {
            id: Date.now(),
            title,
            content,
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            createdAt: new Date().toISOString()
        };
        blogPosts.unshift(post);
    }

    saveBlogPosts();
    renderBlogPosts();

    titleInput.value = '';
    contentInput.value = '';
    tagsInput.value = '';
}

function editBlogPost(id) {
    const post = blogPosts.find(p => p.id === id);
    if (!post) return;

    document.getElementById('blog-title').value = post.title;
    document.getElementById('blog-content').value = post.content;
    document.getElementById('blog-tags').value = post.tags.join(', ');

    editingPostId = id;
    document.getElementById('cancel-edit').style.display = 'inline-block';

    document.getElementById('blog-title').scrollIntoView({ behavior: 'smooth' });
}

function cancelEdit() {
    editingPostId = null;
    document.getElementById('cancel-edit').style.display = 'none';
    document.getElementById('blog-title').value = '';
    document.getElementById('blog-content').value = '';
    document.getElementById('blog-tags').value = '';
}

function deleteBlogPost(id) {
    if (confirm('Are you sure you want to delete this blog post?')) {
        blogPosts = blogPosts.filter(post => post.id !== id);
        saveBlogPosts();
        renderBlogPosts();
    }
}

function viewBlogPost(id) {
    const post = blogPosts.find(p => p.id === id);
    if (!post) return;

    document.getElementById('modal-title').textContent = post.title;
    document.getElementById('modal-meta').innerHTML = `
        <strong>Published:</strong> ${formatDateTime(post.createdAt)}
        ${post.updatedAt ? `<br><strong>Updated:</strong> ${formatDateTime(post.updatedAt)}` : ''}
    `;
    document.getElementById('modal-content').innerHTML = escapeHtml(post.content).replace(/\n/g, '<br>');

    if (post.tags.length > 0) {
        document.getElementById('modal-tags').innerHTML = `
            <strong>Tags:</strong> ${post.tags.map(tag => `<span style="background: #e1e5e9; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; margin-right: 5px;">${escapeHtml(tag)}</span>`).join('')}
        `;
    } else {
        document.getElementById('modal-tags').innerHTML = '';
    }

    document.getElementById('blog-modal').classList.add('active');
}

function closeModal() {
    document.getElementById('blog-modal').classList.remove('active');
}

function renderBlogPosts() {
    const blogContainer = document.getElementById('blog-posts');
    const emptyState = document.getElementById('blog-empty');

    if (blogPosts.length === 0) {
        blogContainer.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    blogContainer.style.display = 'grid';
    emptyState.style.display = 'none';

    blogContainer.innerHTML = blogPosts.map(post => `
        <article class="blog-post" onclick="viewBlogPost(${post.id})">
            <h3 class="blog-post-title">${escapeHtml(post.title)}</h3>
            <div class="blog-post-meta">
                📅 ${formatDateTime(post.createdAt)}
                ${post.updatedAt ? ` • ✏️ Updated ${formatDateTime(post.updatedAt)}` : ''}
            </div>
            <div class="blog-post-content">
                ${escapeHtml(post.content.substring(0, 200))}${post.content.length > 200 ? '...' : ''}
            </div>
            ${post.tags.length > 0 ? `
                <div style="margin-bottom: 15px;">
                    ${post.tags.map(tag => `<span style="background: #e1e5e9; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; margin-right: 5px;">${escapeHtml(tag)}</span>`).join('')}
                </div>
            ` : ''}
            <div class="blog-post-actions" onclick="event.stopPropagation()">
                <button class="edit-btn" onclick="editBlogPost(${post.id})">Edit</button>
                <button class="delete-btn" onclick="deleteBlogPost(${post.id})">Delete</button>
            </div>
        </article>
    `).join('');
}

function saveBlogPosts() {
    localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}

// Close modal when clicking outside
document.getElementById('blog-modal').addEventListener('click', function (e) {
    if (e.target === this) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});