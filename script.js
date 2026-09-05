const taskInput =
    document.getElementById("taskInput");

const addTaskBtn =
    document.getElementById("addTaskBtn");

const taskList =
    document.getElementById("taskList");

const taskCount =
    document.getElementById("taskCount");

const emptyState =
    document.getElementById("emptyState");

const noResults =
    document.getElementById("noResults");

const dueDate =
    document.getElementById("dueDate");

const priority =
    document.getElementById("priority");

const searchInput =
    document.getElementById("searchInput");

const filterButtons =
    document.querySelectorAll(".filter-btn");


const totalTasks =
    document.getElementById("totalTasks");

const activeTasks =
    document.getElementById("activeTasks");

const completedTasks =
    document.getElementById("completedTasks");

const completionRate =
    document.getElementById("completionRate");


let currentFilter = "all";

let tasks = [];



/* =========================
   LOAD
========================= */

document.addEventListener(
    "DOMContentLoaded",
    loadTasks
);



function loadTasks() {

    const savedTasks =
        JSON.parse(
            localStorage.getItem("taskflowTasks")
        );


    tasks = savedTasks || [];


    renderTasks();

}



/* =========================
   SAVE
========================= */

function saveTasks() {

    localStorage.setItem(
        "taskflowTasks",
        JSON.stringify(tasks)
    );

}



/* =========================
   ADD TASK
========================= */

function addTask() {

    const text =
        taskInput.value.trim();


    if (text === "") {

        alert("Please enter a task!");

        return;

    }


    const newTask = {

        id:
            Date.now(),

        text:
            text,

        date:
            dueDate.value,

        priority:
            priority.value,

        completed:
            false

    };


    tasks.push(newTask);


    saveTasks();


    taskInput.value = "";

    dueDate.value = "";

    priority.value = "medium";


    renderTasks();

}



/* =========================
   RENDER TASKS
========================= */

function renderTasks() {

    taskList.innerHTML = "";


    const searchTerm =
        searchInput.value
        .trim()
        .toLowerCase();


    const filteredTasks =
        tasks.filter(function(task) {


            const matchesSearch =
                task.text
                .toLowerCase()
                .includes(searchTerm);


            let matchesFilter = true;


            if (
                currentFilter ===
                "active"
            ) {

                matchesFilter =
                    !task.completed;

            }


            if (
                currentFilter ===
                "completed"
            ) {

                matchesFilter =
                    task.completed;

            }


            if (
                currentFilter ===
                "high"
            ) {

                matchesFilter =
                    task.priority === "high";

            }


            return (
                matchesSearch &&
                matchesFilter
            );

        });


    filteredTasks.forEach(
        function(task) {

            createTaskElement(task);

        }
    );


    updateUI(
        filteredTasks.length
    );

}



/* =========================
   CREATE TASK ELEMENT
========================= */

function createTaskElement(task) {

    const taskItem =
        document.createElement("li");


    if (task.completed) {

        taskItem.classList.add(
            "completed"
        );

    }


    if (
        !task.completed &&
        task.date
    ) {

        updateDeadlineStatus(
            taskItem,
            task.date
        );

    }


    taskItem.innerHTML = `

        <div class="task-content">

            <div class="task-title">

                ${escapeHTML(task.text)}

            </div>


            <div class="task-meta">

                <span class="date">

                    ${
                        task.date
                        ? "📅 " +
                          formatDate(task.date)
                        : "📅 No deadline"
                    }

                </span>


                <span
                    class="
                        priority
                        priority-${task.priority}
                    "
                >

                    ${formatPriority(
                        task.priority
                    )}

                </span>

            </div>

        </div>


        <button
            class="delete-btn"
            data-id="${task.id}"
        >

            Delete

        </button>

    `;


    taskItem.addEventListener(
        "click",
        function(event) {


            if (
                event.target
                .classList
                .contains("delete-btn")
            ) {

                deleteTask(task.id);

                return;

            }


            toggleTask(task.id);

        }
    );


    taskList.appendChild(
        taskItem
    );

}



/* =========================
   TOGGLE TASK
========================= */

function toggleTask(id) {

    tasks =
        tasks.map(
            function(task) {

                if (task.id === id) {

                    return {

                        ...task,

                        completed:
                            !task.completed

                    };

                }


                return task;

            }
        );


    saveTasks();

    renderTasks();

}



/* =========================
   DELETE TASK
========================= */

function deleteTask(id) {

    tasks =
        tasks.filter(
            function(task) {

                return task.id !== id;

            }
        );


    saveTasks();

    renderTasks();

}



/* =========================
   DEADLINE
========================= */

function updateDeadlineStatus(
    taskItem,
    dateString
) {

    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    const deadline =
        new Date(dateString);


    deadline.setHours(
        0,
        0,
        0,
        0
    );


    const difference =
        deadline - today;


    const oneDay =
        1000 *
        60 *
        60 *
        24;


    if (difference < 0) {

        taskItem.classList.add(
            "overdue"
        );

    }


    else if (
        difference <= oneDay
    ) {

        taskItem.classList.add(
            "due-soon"
        );

    }

}



/* =========================
   UPDATE UI
========================= */

function updateUI(
    visibleTaskCount
) {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            function(task) {

                return task.completed;

            }
        ).length;


    const active =
        total - completed;


    const percentage =
        total === 0
        ? 0
        : Math.round(
            (completed / total) * 100
        );


    taskCount.textContent =
        visibleTaskCount;


    totalTasks.textContent =
        total;


    activeTasks.textContent =
        active;


    completedTasks.textContent =
        completed;


    completionRate.textContent =
        percentage + "%";


    if (total === 0) {

        emptyState.style.display =
            "block";

        noResults.style.display =
            "none";

    }

    else if (
        visibleTaskCount === 0
    ) {

        emptyState.style.display =
            "none";

        noResults.style.display =
            "block";

    }

    else {

        emptyState.style.display =
            "none";

        noResults.style.display =
            "none";

    }

}



/* =========================
   SEARCH
========================= */

searchInput.addEventListener(
    "input",
    function() {

        renderTasks();

    }
);



/* =========================
   FILTERS
========================= */

filterButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {


                filterButtons.forEach(
                    function(btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                currentFilter =
                    button.dataset.filter;


                renderTasks();

            }
        );

    }
);



/* =========================
   ADD BUTTON
========================= */

addTaskBtn.addEventListener(
    "click",
    addTask
);



/* =========================
   ENTER KEY
========================= */

taskInput.addEventListener(
    "keypress",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            addTask();

        }

    }
);



/* =========================
   DATE FORMAT
========================= */

function formatDate(
    dateString
) {

    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    return date.toLocaleDateString(
        undefined,
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}



/* =========================
   PRIORITY
========================= */

function formatPriority(
    level
) {

    if (level === "high") {

        return "High Priority";

    }


    if (level === "low") {

        return "Low Priority";

    }


    return "Medium Priority";

}



/* =========================
   HTML SAFETY
========================= */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}
