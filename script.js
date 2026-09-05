const taskInput = document.getElementById("taskInput");

const addTaskBtn = document.getElementById("addTaskBtn");

const taskList = document.getElementById("taskList");

const taskCount = document.getElementById("taskCount");

const emptyState = document.getElementById("emptyState");

const dueDate = document.getElementById("dueDate");

const priority = document.getElementById("priority");



document.addEventListener(
    "DOMContentLoaded",
    loadTasks
);



/* ADD TASK */

function addTask() {

    const taskText = taskInput.value.trim();

    const taskDueDate = dueDate.value;

    const taskPriority = priority.value;


    if (taskText === "") {

        alert("Please enter a task!");

        return;

    }


    createTask(
        taskText,
        taskDueDate,
        taskPriority,
        false
    );


    taskInput.value = "";

    dueDate.value = "";

    priority.value = "medium";


    saveTasks();

    updateTaskUI();

}



/* CREATE TASK */

function createTask(
    taskText,
    taskDueDate,
    taskPriority,
    completed
) {

    const taskItem = document.createElement("li");


    taskItem.innerHTML = `

        <div class="task-content">

            <div class="task-title">
                ${escapeHTML(taskText)}
            </div>

            <div class="task-meta">

                ${
                    taskDueDate
                    ? `<span class="date">
                        📅 ${formatDate(taskDueDate)}
                       </span>`
                    : `<span class="date">
                        📅 No deadline
                       </span>`
                }

                <span class="priority priority-${taskPriority}">
                    ${formatPriority(taskPriority)}
                </span>

            </div>

        </div>


        <button class="delete-btn">
            Delete
        </button>

    `;


    if (completed) {

        taskItem.classList.add("completed");

    }


    updateDeadlineStatus(
        taskItem,
        taskDueDate,
        completed
    );


    taskItem.addEventListener(
        "click",
        function (event) {

            if (
                event.target.classList
                .contains("delete-btn")
            ) {

                taskItem.remove();

            }

            else {

                taskItem.classList
                    .toggle("completed");

            }


            saveTasks();

            updateTaskUI();

        }
    );


    taskList.appendChild(taskItem);

}



/* DEADLINE STATUS */

function updateDeadlineStatus(
    taskItem,
    taskDueDate,
    completed
) {

    if (!taskDueDate || completed) {

        return;

    }


    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    const deadline =
        new Date(taskDueDate);

    deadline.setHours(
        0,
        0,
        0,
        0
    );


    const difference =
        deadline - today;


    const oneDay =
        1000 * 60 * 60 * 24;


    if (difference < 0) {

        taskItem.classList.add(
            "overdue"
        );

    }

    else if (difference <= oneDay) {

        taskItem.classList.add(
            "due-soon"
        );

    }

}



/* SAVE TASKS */

function saveTasks() {

    const tasks = [];


    document
        .querySelectorAll("#taskList li")
        .forEach(function (taskItem) {


            const title =
                taskItem
                .querySelector(".task-title")
                .textContent;


            const dateElement =
                taskItem
                .querySelector(".date");


            const priorityElement =
                taskItem
                .querySelector(".priority");


            const dateText =
                dateElement
                ? dateElement.textContent
                : "";


            const priorityText =
                priorityElement
                ? priorityElement.textContent
                : "Medium";


            tasks.push({

                text: title,

                date: extractDate(dateText),

                priority:
                    priorityText
                    .toLowerCase()
                    .replace(
                        " priority",
                        ""
                    ),

                completed:
                    taskItem.classList
                    .contains("completed")

            });

        });


    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}



/* LOAD TASKS */

function loadTasks() {

    const savedTasks =
        JSON.parse(
            localStorage.getItem("tasks")
        );


    if (savedTasks) {

        savedTasks.forEach(
            function (task) {

                createTask(
                    task.text,
                    task.date,
                    task.priority || "medium",
                    task.completed
                );

            }
        );

    }


    updateTaskUI();

}



/* UPDATE UI */

function updateTaskUI() {

    const tasks =
        document.querySelectorAll(
            "#taskList li"
        );


    taskCount.textContent =
        tasks.length;


    if (tasks.length === 0) {

        emptyState.style.display =
            "block";

    }

    else {

        emptyState.style.display =
            "none";

    }

}



/* FORMAT DATE */

function formatDate(dateString) {

    const date =
        new Date(dateString);


    return date.toLocaleDateString(
        undefined,
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}



/* FORMAT PRIORITY */

function formatPriority(level) {

    if (level === "high") {

        return "High Priority";

    }


    if (level === "low") {

        return "Low Priority";

    }


    return "Medium Priority";

}



/* EXTRACT SAVED DATE */

function extractDate(text) {

    const match =
        text.match(
            /📅\s(.+)/
        );


    if (!match) {

        return "";

    }


    const parsed =
        new Date(match[1]);


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return "";

    }


    return parsed
        .toISOString()
        .split("T")[0];

}



/* BASIC HTML SAFETY */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}



/* BUTTON */

addTaskBtn.addEventListener(
    "click",
    addTask
);



/* ENTER KEY */

taskInput.addEventListener(
    "keypress",
    function (event) {

        if (event.key === "Enter") {

            addTask();

        }

    }
);
