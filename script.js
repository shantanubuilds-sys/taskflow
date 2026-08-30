const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");


function addTask() {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }


    const taskItem = document.createElement("li");

    taskItem.innerHTML = `
        <span>${taskText}</span>
        <button class="delete-btn">Delete</button>
    `;


    taskItem.addEventListener("click", function (event) {

        if (event.target.classList.contains("delete-btn")) {
            taskItem.remove();
        } else {
            taskItem.classList.toggle("completed");
        }

    });


    taskList.appendChild(taskItem);


    taskInput.value = "";
}


addTaskBtn.addEventListener("click", addTask);


taskInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {
        addTask();
    }

});
