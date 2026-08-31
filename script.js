const taskInput = document.getElementById("taskInput");

const addTaskBtn = document.getElementById("addTaskBtn");

const taskList = document.getElementById("taskList");

const taskCount = document.getElementById("taskCount");

const emptyState = document.getElementById("emptyState");



document.addEventListener("DOMContentLoaded", loadTasks);



function addTask() {

    const taskText = taskInput.value.trim();


    if (taskText === "") {

        alert("Please enter a task!");

        return;

    }


    createTask(taskText, false);


    taskInput.value = "";


    saveTasks();

    updateTaskUI();

}



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

        }

        else {

            taskItem.classList.toggle("completed");

        }


        saveTasks();

        updateTaskUI();

    });


    taskList.appendChild(taskItem);

}



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



function loadTasks() {

    const savedTasks = JSON.parse(localStorage.getItem("tasks"));


    if (savedTasks) {


        savedTasks.forEach(function (task) {

            createTask(task.text, task.completed);

        });

    }


    updateTaskUI();

}



function updateTaskUI() {

    const tasks = document.querySelectorAll("#taskList li");


    taskCount.textContent = tasks.length;


    if (tasks.length === 0) {

        emptyState.style.display = "block";

    }

    else {

        emptyState.style.display = "none";

    }

}



addTaskBtn.addEventListener("click", addTask);



taskInput.addEventListener("keypress", function (event) {


    if (event.key === "Enter") {

        addTask();

    }

});
