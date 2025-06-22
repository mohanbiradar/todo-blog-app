// Todo Manager Functions
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

function addTodo() {
    const input = document.getElementById('todo-input');
    const dateInput = document.getElementById('todo-date');
    const text = input.value.trim();

    if (!text) {
        alert('Please enter a task!');
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        date: dateInput.value || null,
        createdAt: new Date().toISOString()
    };

    todos.push(todo);
    saveTodos();
    renderTodos();

    input.value = '';
    dateInput.value = '';
    input.focus();
}

function toggleTodo(id) {
    todos = todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos();
    renderTodos();
}

function deleteTodo(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos();
    }
}

function filterTodos(filter) {
    currentFilter = filter;

    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    renderTodos();
}

function renderTodos() {
    const todoList = document.getElementById('todo-list');
    const emptyState = document.getElementById('todo-empty');

    let filteredTodos = todos;

    if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    } else if (currentFilter === 'pending') {
        filteredTodos = todos.filter(todo => !todo.completed);
    }

    if (filteredTodos.length === 0) {
        todoList.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    todoList.style.display = 'block';
    emptyState.style.display = 'none';

    todoList.innerHTML = filteredTodos.map(todo => `
        <li class="todo-item ${todo.completed ? 'completed' : ''}">
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} 
                   onchange="toggleTodo(${todo.id})">
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            ${todo.date ? `<span class="todo-date">📅 ${formatDate(todo.date)}</span>` : ''}
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
        </li>
    `).join('');
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}