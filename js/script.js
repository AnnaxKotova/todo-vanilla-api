import { fetchTasks, addTask, updateTask, deleteTask } from './taskService.js';
import { displayTasks, addEndInput, clearUI, removeDeletedTask } from './uiService.js';

console.log("Application is ready");







const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');
const dateSearchInput = document.getElementById('dateSearchInput');
const searchButton = document.getElementById('searchButton');
const clearSearch = document.getElementById('clearSearch');

const addTaskBtn = document.getElementById('addTaskBtn');
// const taskInput = document.getElementById('taskInput');
// const taskDescription = document.getElementById('taskDescription');
// const taskStart = document.getElementById('taskStart');
const updateTaskBtns = document.querySelectorAll('.updateTaskBtn');
const taskEndDateSubmitButtons = document.querySelectorAll('.taskEndDateSubmitButton');

const deleteTaskBtns = document.querySelectorAll('.deleteTaskBtn');


async function loadTasks() {
    try {
        const tasks = await fetchTasks();
        displayTasks(tasks);
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}


// Fetch and display tasks when the page loads
window.addEventListener('load', async () => {
    await loadTasks();
});

// Search button click event
searchButton.addEventListener('click', async () => {

    try {
        const tasks = await fetchTasks();
        // const filteredTasks = tasks.filter(task => {
        const textSearchValue = document.getElementById('searchInput').value.trim().toLowerCase();
        const dateSearchValue = new Date(document.getElementById('dateSearchInput').value.trim());


        console.log(dateSearchValue);

        let filteredTasks;
        // Check if both search fields are empty or "undefined"
        if (!textSearchValue && !dateSearchInput.value) {
            // Display a message or handle the case when both fields are empty
            console.log("EMPTY ENTRY DATA");
        } else {
            // Perform the search based on the available criteria
            if (textSearchValue && dateSearchInput.value) {
                // Perform a combined search by text and date
                filteredTasks = tasks.filter(task => {
                    const labelMatch = task.label.toLowerCase().includes(textSearchValue);
                    const descriptionMatch = task.description.toLowerCase().includes(textSearchValue);

                    // Check if the entered date falls within the start_date and end_date of the task

                    const taskStartDate = new Date(task.start_date);

                    const taskEndDate = task.end_date ? new Date(task.end_date) : null;
                    // If dateSearchValue is empty or "undefined," consider it a match
                    const dateMatch = !dateSearchValue ||
                        (dateSearchValue <= taskStartDate &&
                            (!taskEndDate || dateSearchValue <= taskEndDate));

                    // Return true if both text and date criteria match
                    return ((labelMatch || descriptionMatch) && dateMatch);
                });
            } else if (textSearchValue) {
                // Perform a text-only search
                const searchTerm = searchInput.value.toLowerCase();
                console.log(searchTerm);
                // Filter tasks that match the search term
                filteredTasks = tasks.filter(task => {
                    const labelMatch = task.label.toLowerCase().includes(searchTerm);
                    const descriptionMatch = task.description.toLowerCase().includes(searchTerm);
                    return labelMatch || descriptionMatch;
                }

                );

            } else {
                // Perform a date-only search
                // Filter tasks based on the entered date
                filteredTasks = tasks.filter(task => {
                    //     
                    // Convert task start and end dates to JavaScript Date objects
                    const taskStartDate = new Date(task.start_date);

                    const taskEndDate = task.end_date ? new Date(task.end_date) : null;

                    // Check if the entered date falls within the start_date and end_date of the task
                    return (
                        dateSearchValue <= taskStartDate &&
                        (!taskEndDate || dateSearchValue <= taskEndDate)
                    );
                });
            }
            taskList.innerHTML = '';

        }

        displayTasks(filteredTasks);
    } catch (error) {
        console.error('Error searching tasks:', error);
    }
});

// Clear search button click event
clearSearch.addEventListener('click', async () => {
    document.getElementById('searchInput').value = '';
    document.getElementById('dateSearchInput').value = '';
    loadTasks(); // Reload all tasks
});

// Add task button click event
addTaskBtn.addEventListener('click', async () => {
    const label = document.getElementById('taskInput').value;
    const description = document.getElementById('taskDescription').value;
    const start_date = `${document.getElementById('taskStart').value}T12:00:00Z`;
    console.log(label);
    try {
        const newTask = await addTask({ label, description, start_date, });
     if(newTask){
        loadTasks(); // Reload all tasks
        clearUI();}
    } catch (error) {
        console.error('Error adding task:', error);
    }
});




