import { fetchTasks, addTask, updateTask, deleteTask } from './taskService.js';
import { displayTasks, addEndInput, clearUI, removeDeletedTask } from './uiService.js';


const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');
const dateSearchInput = document.getElementById('dateSearchInput');
const searchButton = document.getElementById('searchButton');
const clearSearch = document.getElementById('clearSearch');
const addTaskBtn = document.getElementById('addTaskBtn');

// fetch and loading tasks
async function loadTasks() {
    try {
        const tasks = await fetchTasks();
        displayTasks(tasks);
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

window.addEventListener('load', async () => {
    await loadTasks();
});


// Search button click event
searchButton.addEventListener('click', async () => {
    try {
        const tasks = await fetchTasks();
        const textSearchValue = document.getElementById('searchInput').value.trim().toLowerCase();
        const dateSearchValue = new Date(document.getElementById('dateSearchInput').value.trim());
        let filteredTasks;

        // Check if both search fields are empty
        if (!textSearchValue && !dateSearchInput.value) {
            console.log("Empty search data");
        } else {
            if (textSearchValue && dateSearchInput.value) {
                // Perform search both by text and date
                filteredTasks = tasks.filter(task => {
                    const labelMatch = task.label.toLowerCase().includes(textSearchValue);
                    const descriptionMatch = task.description.toLowerCase().includes(textSearchValue);

                    // Check if the entered date falls within the start_date and end_date of the task
                    const taskStartDate = new Date(task.start_date);
                    const taskEndDate = task.end_date ? new Date(task.end_date) : null;

                    // If dateSearchValue is empty or "undefined", it's a match
                    const dateMatch = !dateSearchValue ||
                        (dateSearchValue <= taskStartDate &&
                            (!taskEndDate || dateSearchValue <= taskEndDate));

                    // Return true if both text and date criteria match
                    return ((labelMatch || descriptionMatch) && dateMatch);
                });
            } else if (textSearchValue) {
                // Perform a text-only search
                const searchTerm = searchInput.value.toLowerCase();

                // Filter tasks that match the search term
                filteredTasks = tasks.filter(task => {
                    const labelMatch = task.label.toLowerCase().includes(searchTerm);
                    const descriptionMatch = task.description.toLowerCase().includes(searchTerm);
                    return labelMatch || descriptionMatch;
                });
            } else {
                // Perform a date-only search
                filteredTasks = tasks.filter(task => {                    
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
    loadTasks();
});


// Add task button click event
addTaskBtn.addEventListener('click', async () => {
    const label = document.getElementById('taskInput').value;
    const description = document.getElementById('taskDescription').value;
    const start_date = `${document.getElementById('taskStart').value}T12:00:00Z`;
    try {
        const newTask = await addTask({ label, description, start_date, });
     if(newTask){
        loadTasks();
        clearUI();}
    } catch (error) {
        console.error('Error adding task:', error);
    }
});