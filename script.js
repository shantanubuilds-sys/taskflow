// DOM Element Selectors
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const emptyState = document.getElementById("emptyState");
const noResults = document.getElementById("noResults");
const dueDate = document.getElementById("dueDate");
const priority = document.getElementById("priority");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");

const totalTasks = document.getElementById("totalTasks");
const activeTasks = document.getElementById("activeTasks");
const completedTasks = document.getElementById("completedTasks");
const completionRate = document.getElementById("completionRate");

// Application State
let currentFilter = "all";
let tasks = [];

/* =========================
   INITIALIZATION & EVENT LISTENERS
========================= */

document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    setupEventListeners();
});

function setupEventListeners() {
    addTaskBtn?.addEventListener("click", addTask);

    taskInput?.addEventListener("keypress", (event) => {
        if (event.key === "Enter") addTask();
    });

    searchInput?.addEventListener("input", renderTasks);

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            filterButtons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");
            currentFilter = button.dataset.filter;
            renderTasks();
        });
    });

    // Delegated event listener for task actions (toggle and delete)
    taskList?.addEventListener("click", (event) => {
        const deleteBtn = event.target.closest(".delete-btn");
        if (deleteBtn) {
            const taskId = Number(deleteBtn.dataset.id);
            deleteTask(taskId);
            return;
        }

        const taskItem = event.target.closest("li[data-id]");
        if (taskItem) {
            const taskId = Number(taskItem.dataset.id);
            toggleTask(taskId);
        }
    });
}

/* =========================
   STORAGE MANAGERS
========================= */

function loadTasks() {
    try {
        const savedTasks = JSON.parse(localStorage.getItem("taskflowTasks"));
        tasks = Array.isArray(savedTasks) ? savedTasks : [];
    } catch (e) {
        console.error("Failed to parse saved tasks from localStorage", e);
        tasks = [];
    }
    renderTasks();
}

function saveTasks() {
    localStorage.setItem("taskflowTasks", JSON.stringify(tasks));
}

/* =========================
   TASK CRUD OPERATIONS
========================= */

function addTask() {
    const text = taskInput.value.trim();

    if (!text) {
        alert("Please enter a task!");
        return;
    }

    const newTask = {
        id: Date.now(),
        text,
        date: dueDate.value,
        priority: priority.value,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();

    // Reset inputs
    taskInput.value = "";
    dueDate.value = "";
    priority.value = "medium";

    renderTasks();
}

function toggleTask(id) {
    tasks = tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    renderTasks();
}

/* =========================
   RENDERING & UI UPDATES
========================= */

function renderTasks() {
    taskList.innerHTML = "";
    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.text.toLowerCase().includes(searchTerm);

        let matchesFilter = true;
        if (currentFilter === "active") matchesFilter = !task.completed;
        if (currentFilter === "completed") matchesFilter = task.completed;
        if (currentFilter === "high") matchesFilter = task.priority === "high";

        return matchesSearch && matchesFilter;
    });

    filteredTasks.forEach((task) => {
        const taskItem = createTaskElement(task);
        taskList.appendChild(taskItem);
    });

    updateUI(filteredTasks.length);
}

function createTaskElement(task) {
    const taskItem = document.createElement("li");
    taskItem.dataset.id = task.id;

    if (task.completed) {
        taskItem.classList.add("completed");
    }

    if (!task.completed && task.date) {
        updateDeadlineStatus(taskItem, task.date);
    }

    taskItem.innerHTML = `
        <div class="task-content">
            <div class="task-title">
                ${escapeHTML(task.text)}
            </div>
            <div class="task-meta">
                <span class="date">
                    ${task.date ? "📅 " + formatDate(task.date) : "📅 No deadline"}
                </span>
                <span class="priority priority-${task.priority}">
                    ${formatPriority(task.priority)}
                </span>
            </div>
        </div>
        <button class="delete-btn" data-id="${task.id}" aria-label="Delete task">
            Delete
        </button>
    `;

    return taskItem;
}

function updateDeadlineStatus(taskItem, dateString) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadline = new Date(dateString + "T00:00:00");
    deadline.setHours(0, 0, 0, 0);

    const difference = deadline - today;
    const oneDay = 1000 * 60 * 60 * 24;

    if (difference < 0) {
        taskItem.classList.add("overdue");
    } else if (difference <= oneDay) {
        taskItem.classList.add("due-soon");
    }
}

function updateUI(visibleTaskCount) {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const active = total - completed;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    if (taskCount) taskCount.textContent = visibleTaskCount;
    if (totalTasks) totalTasks.textContent = total;
    if (activeTasks) activeTasks.textContent = active;
    if (completedTasks) completedTasks.textContent = completed;
    if (completionRate) completionRate.textContent = `${percentage}%`;

    if (total === 0) {
        emptyState.style.display = "block";
        noResults.style.display = "none";
    } else if (visibleTaskCount === 0) {
        emptyState.style.display = "none";
        noResults.style.display = "block";
    } else {
        emptyState.style.display = "none";
        noResults.style.display = "none";
    }
}

/* =========================
   UTILITIES & HELPERS
========================= */

function formatDate(dateString) {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

function formatPriority(level) {
    const priorities = {
        high: "High Priority",
        medium: "Medium Priority",
        low: "Low Priority"
    };
    return priorities[level] || "Medium Priority";
}

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}
