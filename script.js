const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");


// Load saved tasks when the website opens
document.addEventListener("DOMContentLoaded", loadTasks);


// Add a new task
function addTask() {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    createTask(taskText, false);

    taskInput.value = "";

    saveTasks();
}


// Create a task
function createTask(taskText, completed) {

    const taskItem = document.createElement("li");

    taskItem.innerHTML = `
        <span>${taskText}</span>
        <button class="delete-btn">Delete</button>
    `;


    if (completed) {
        taskItem.classList.add("completed");
    }


    taskItem.addEventListener("click", function (event) {

        if (event.target.classList.contains("delete-btn")) {

            taskItem.remove();

        } else {

            taskItem.classList.toggle("completed");

        }

        saveTasks();

    });


    taskList.appendChild(taskItem);
}


// Save tasks to Local Storage
function saveTasks() {

    const tasks = [];

    document.querySelectorAll("#taskList li").forEach(function (taskItem) {

        tasks.push({

            text: taskItem.querySelector("span").textContent,

            completed: taskItem.classList.contains("completed")

        });

    });


    localStorage.setItem("tasks", JSON.stringify(tasks));

}


// Load saved tasks
function loadTasks() {

    const savedTasks = JSON.parse(localStorage.getItem("tasks"));

    if (savedTasks) {

        savedTasks.forEach(function (task) {

            createTask(task.text, task.completed);

        });

    }

}


// Add task when button is clicked
addTaskBtn.addEventListener("click", addTask);


// Add task when Enter is pressed
taskInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {

        addTask();

    }

});
