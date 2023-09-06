// uiService.js
import { fetchTasks, addTask, updateTask, deleteTask } from './taskService.js';


// Display tasks in the UI
function displayTasks(tasks) {
    const taskList = document.getElementById('taskList');
    const currentDate = new Date();
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' };


    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = createTaskListItem(task);
        taskList.appendChild(li);
    });

    // Create and return a list item (li) for the given task
    function createTaskListItem(taskItem) {
        const li = document.createElement('li');
        li.classList.add("task");
        li.setAttribute("data-label", encodeURIComponent(taskItem.label));

        const taskPresentation = document.createElement('div');
        taskPresentation.classList.add('taskPresentation');

        const taskHeader = document.createElement('h3');
        taskHeader.classList.add("taskName");
        taskHeader.textContent = taskItem.label;

        const taskDescription = document.createElement('p');
        taskDescription.classList.add("taskDescription");
        taskDescription.textContent = taskItem.description;

        const taskStartDate = document.createElement('p');
        taskStartDate.classList.add("taskStartDate");
        const taskStartDateToPublish = new Date(taskItem.start_date);
        taskStartDate.textContent = taskStartDateToPublish.toLocaleDateString(undefined, options);

        const taskDelete = document.createElement('div');
        taskDelete.classList.add("button");
        taskDelete.classList.add("deleteTaskBtn");
        taskDelete.textContent = "Delete";

        const taskEndDateElement = document.createElement('div');
        taskEndDateElement.classList.add("taskEndDate");

        const taskEndDatePreventor = document.createElement('div');
        taskEndDatePreventor.classList.add("taskEndDatePreventor");

        if (taskItem.end_date) {
            const taskEndDateToPublish = new Date(taskItem.end_date);
            taskEndDateElement.textContent = taskEndDateToPublish.toLocaleDateString(undefined, options);

            if (new Date(taskItem.end_date) < currentDate) {
                taskEndDatePreventor.textContent = "The end date is over. Make sure that the task is done";
            }
        }

        const taskEndDateUpdateContainer = document.createElement('div');
        taskEndDateUpdateContainer.classList.add("update__ui-container");

        const taskEndDateUpdateButton = document.createElement('div');
        taskEndDateUpdateButton.classList.add("button");
        taskEndDateUpdateButton.classList.add("updateTaskBtn");
        taskEndDateUpdateButton.textContent = "Add / Update end date";

        taskEndDateUpdateContainer.appendChild(taskEndDateUpdateButton);

        li.appendChild(taskPresentation);
        taskPresentation.appendChild(taskHeader);
        taskPresentation.appendChild(taskDescription);
        taskPresentation.appendChild(taskStartDate);
        taskPresentation.appendChild(taskDelete);
        li.appendChild(taskEndDateUpdateContainer);
        li.appendChild(taskEndDateElement);
        li.appendChild(taskEndDatePreventor);

        li.addEventListener("click", (event) => {
            const targetClassList = event.target.classList;

            if (targetClassList.contains("deleteTaskBtn")) {

                // Handle delete button click
                console.log("Delete button clicked");
                deleteTask(taskItem.label);
                const successMessage = document.createElement('div');
                successMessage.textContent = `Task successfully deleted`;
                taskPresentation.appendChild(successMessage);
                setTimeout(() => {
                    li.remove();
                }, 2000);
            } else if (targetClassList.contains("updateTaskBtn")) {

                // Handle update button click
                addEndInput(taskItem.label);
            }
        });
        return li;
    }
}


function addEndInput(label) {
    const taskEndDateSubmitter = document.createElement('div');
    taskEndDateSubmitter.classList.add("deadline_add");
    const updateInput = document.createElement('input');
    updateInput.type = "date";

    const taskEndDateSubmitButton = document.createElement('div');
    taskEndDateSubmitButton.classList.add('taskEndDateSubmitButton');
    taskEndDateSubmitButton.classList.add('button');
    taskEndDateSubmitButton.textContent = 'Submit';

    const taskEndDateWarning = document.createElement('div');
    taskEndDateWarning.classList.add("warning");

    taskEndDateSubmitter.appendChild(updateInput);
    taskEndDateSubmitter.appendChild(taskEndDateSubmitButton);
    taskEndDateSubmitter.appendChild(taskEndDateWarning);

    const taskLi = document.querySelector(`[data-label="${encodeURIComponent(label)}"]`);
    const container = taskLi.querySelector(".update__ui-container");

    container.appendChild(taskEndDateSubmitter);

    taskEndDateSubmitButton.addEventListener('click', () => {
        const updatedEndDate = updateInput.value;
        submitEndDate(label, updatedEndDate);
    });
}


function submitEndDate(item, endDate) {
    const taskLi = document.querySelector(`[data-label="${encodeURIComponent(item)}"]`);
    const startDate = taskLi.querySelector(".taskStartDate").textContent;
    const dateParts = startDate.split('/');
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const year = parseInt(dateParts[2], 10);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC', };

    // Create a new Date object with the parsed components
    const startDateObj = new Date(year, month, day);
    const updatedTask = {
        end_date: `${endDate}T12:00:00Z`,
    };

    // Check if the end date is in the past
    const taskEndDate = new Date(updatedTask.end_date);

    if (taskEndDate < startDateObj) {
        const warning = taskLi.querySelector(".warning");
        warning.textContent = "Task end date cannot be less than start date. Please choose a future date.";
    } else {
        updateTask(item, updatedTask);
        taskLi.querySelector(".taskEndDate").textContent = taskEndDate.toLocaleDateString(undefined, options);
        const container = taskLi.querySelector(".update__ui-container");
        const input = taskLi.querySelector(".deadline_add");
        container.removeChild(input);
    }
}


function removeDeletedTask(label) {
    const taskLi = document.querySelector(`[data-label="${encodeURIComponent(label)}"]`);
    const deleteBtn = taskLi.querySelector(".deleteTaskBtn");
    deleteBtn.addEventListener('click', () => {
        setTimeout(() => {
            taskLi.remove();
        }, 3000);
    });

}

function clearUI() {
    const taskList = document.getElementById('taskList');
    const searchInput = document.getElementById('searchInput');
    const dateSearchInput = document.getElementById('dateSearchInput');
    const taskInput = document.getElementById('taskInput');
    const taskDescription = document.getElementById('taskDescription');
    const taskStart = document.getElementById('taskStart');

    taskList.innerHTML = '';

    searchInput.value = '';
    dateSearchInput.value = '';
    taskInput.value = '';
    taskDescription.value = '';
    taskStart.value = '';
}

export { displayTasks, addEndInput, clearUI, removeDeletedTask };