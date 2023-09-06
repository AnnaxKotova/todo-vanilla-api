const taskList = document.getElementById('taskList');


const currentDate = new Date();
const options = { year: 'numeric', month: '2-digit', day: '2-digit',   timeZone: 'UTC',};


async function fetchAndDisplayTasks() {
    try {
        const response = await fetch('http://localhost:9000/v1/tasks');

        if (response.ok) {

            const responseBody = await response.text();
            if (responseBody.trim() === '') {
                console.log('No tasks found.');
                taskList.textContent = 'Please add tasks';
                taskList.classList.add("empty_list");
                return;
            } else {
                taskList.classList.remove("empty_list");
            }
            try {
                const tasks = JSON.parse(responseBody);



                // Clear the existing task list
                taskList.innerHTML = '';

                // Loop through tasks and add them to the list
                tasks.forEach(task => {
                    const li = createTaskListItem(task);
                    taskList.appendChild(li);
                });


                //search implementation

                const searchInput = document.getElementById('searchInput');

                // Get references to the date search input and the search button
                const dateSearchInput = document.getElementById('dateSearchInput');
                const searchButton = document.getElementById('searchButton');



                searchButton.addEventListener('click', () => {
                    const textSearchValue = searchInput.value.trim().toLowerCase();
                    const dateSearchValue = new Date(dateSearchInput.value.trim());
                    // const searchDate = `${new Date(dateSearchInput.value).toISOString()}:05Z`;
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
                            // });


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


                            // displayFilteredTasks(filteredTasks);
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
                        // Update the UI with the filtered tasks
                        filteredTasks.forEach(task => {
                            const filteredLi = createTaskListItem(task);
                            taskList.appendChild(filteredLi);
                        });
                    }
                });


                const clearSearch = document.getElementById('clearSearch');
                clearSearch.addEventListener('click', () => {
                    searchInput.value = '';
                    dateSearchInput.value = '';
                    // Clear the existing task list
                    taskList.innerHTML = '';

                    // Loop through filtered tasks and add them to the list
                    tasks.forEach(task => {
                        const li = createTaskListItem(task);
                        taskList.appendChild(li);
                    });

                });

            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
                // Handle parsing error gracefully, if necessary.
                return;
            }

        } else {
            // Handle error
            console.error('Failed to fetch tasks:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
        taskList.textContent = 'Connection error. Try again later';
    }




}



// Call the function to fetch and display tasks when the page loads
fetchAndDisplayTasks();


const addTask = document.getElementById('addTaskBtn');


const taskInput = document.getElementById('taskInput');
const taskDescription = document.getElementById('taskDescription');
const taskStart = document.getElementById('taskStart');


addTask.addEventListener('click', async (event) => {
    console.log("submitted");

    const newTask = {
        label: taskInput.value,
        description: taskDescription.value,
        start_date: `${taskStart.value}:05Z`,
        // end_date doesnt exist
    };





    try {
        const response = await fetch('http://localhost:9000/v1/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTask),
        });


        if (response.ok) {
            console.log(response);
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {

                const addedTask = await response.json();
                console.log('New task:', addedTask);
                taskInput.value = '';
            }

            else {
                // Handle cases where the response is not JSON
                console.error('Received non-JSON response:', contentType, 'Response code:', response.status);
                if (response.status === 201) {
                    console.log('New task:', newTask);
                    taskInput.value = '';
                    taskDescription.value = '';
                    taskStart.value = '';
                }
                // You can add additional handling here if needed
            }
        } else {
            // Handle error
            console.error('Failed to add task:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }


    fetchAndDisplayTasks();
});




function createTaskListItem(taskItem) {
    const li = document.createElement('li');
    li.classList.add("task");
    const taskPresentation = document.createElement('div');
    taskPresentation.classList.add('taskPresentation');
    const taskHeader = document.createElement('h3');
    taskHeader.textContent = taskItem.label;
    const taskDescription = document.createElement('p');
    taskDescription.textContent = taskItem.description;
    const taskStartDate = document.createElement('p');
    taskStartDate.classList.add("taskStartDate");
    const taskStartDateToPublish = new Date (taskItem.start_date);
    taskStartDate.textContent = taskStartDateToPublish.toLocaleDateString(undefined, options);
    const taskDelete = document.createElement('div');
    taskDelete.classList.add("deleteTask.button");
    taskDelete.textContent = "X";
    const taskEndDateElement = document.createElement('div');
    taskEndDateElement.classList.add("taskEndDate");
    const taskEndDatePreventor = document.createElement('div');
    taskEndDatePreventor.classList.add("taskEndDatePreventor");

    if (taskItem.end_date) {
        const taskEndDateToPublish = new Date (taskItem.start_date);
        taskEndDateElement.textContent = taskEndDateToPublish.toLocaleDateString(undefined, options);
        if (new Date(taskItem.end_date) < currentDate){
            taskEndDatePreventor.textContent = "The end date is over. Make sure that the task is done";

        }



    }
    const taskEndDateUpdateContainer = document.createElement('div');
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



    //the delete function

    taskDelete.addEventListener("click", async (event) => {
        const taskLabel = encodeURIComponent(taskItem.label);
        const response = await fetch(`http://localhost:9000/v1/tasks/${taskLabel}`, {
            method: 'DELETE',
        });
        const successMessage = document.createElement('div');
        if (response.ok) {
        // Display a success message

        successMessage.textContent = `Task ${taskItem.label} successfully deleted`;
        li.appendChild(successMessage);

        // Remove the task from the UI after 3 seconds
        setTimeout(() => {
            li.remove();
        }, 3000);

        } else {
            // Handle error
            console.error('Failed to delete task:', response.status);
            successMessage.textContent = `Failed to delete task ${taskItem.label}`;
        }
    }
    );




    //the Update function
    taskEndDateUpdateButton.addEventListener('click', (event) => {
        const taskEndDateSubmitter = document.createElement('div');
        taskEndDateSubmitter.classList.add("deadline_add");
        const updateInput = document.createElement('input');
        updateInput.type = "datetime-local";

        const taskEndDateSubmitButton = document.createElement('div');
        taskEndDateSubmitButton.classList.add('taskEndDateSubmitButton');
        taskEndDateSubmitButton.classList.add('button');
        taskEndDateSubmitButton.textContent = 'Submit';

        taskEndDateSubmitter.appendChild(updateInput);
        taskEndDateSubmitter.appendChild(taskEndDateSubmitButton);

        taskEndDateUpdateContainer.appendChild(taskEndDateSubmitter);

        const taskEndDateWarning = document.createElement('div');
        taskEndDateWarning.classList.add("warning");
        taskEndDateSubmitter.appendChild(taskEndDateWarning);

        taskEndDateSubmitButton.addEventListener('click', async (event) => {


            // Get updated end date value from the user input
            const updatedEndDate = updateInput.value;


            const updatedTask = {
                end_date: `${updatedEndDate}:05Z`, // Include the end_date property only
            };
            // Check if the end date is in the past

            const taskEndDate = new Date(updatedTask.end_date);

            if (taskEndDate < new Date(taskItem.start_date)) {
                taskEndDateWarning.textContent ='Task end date cannot be less than start date. Please choose a future date.';
                }
            else {
                try {
                    const taskLabel = encodeURIComponent(taskItem.label);
                    const response = await fetch(`http://localhost:9000/v1/tasks/${taskLabel}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedTask),
                    });

                    if (response.ok) {
                        const taskEndDateToPublish = new Date (updatedTask.end_date);
                        taskEndDateElement.textContent = taskEndDateToPublish.toLocaleDateString(undefined, options);
            
                        taskEndDateWarning.textContent = '';
                        taskEndDateSubmitter.remove();
                        const contentType = response.headers.get('content-type');
                        if (contentType && contentType.includes('application/json')) {
                            const updatedTaskResponse = await response.json();
                            console.log('Updated task:', updatedTaskResponse);
                        }
                        else {
                            // Handle cases where the response is not JSON
                            console.error('Received non-JSON response:', contentType);
                            // You can add additional handling here if needed
                        }

                    } else {
                        // Handle error
                        console.error('Failed to update task:', response.status);
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        });
    });

    return li;
}
