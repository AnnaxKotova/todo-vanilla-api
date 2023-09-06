// taskService.js
const API_URL = 'http://localhost:9000/v1/tasks';


async function fetchTasks() {
    try {
        const response = await fetch(API_URL);

        if (response.ok) {
            const responseBody = await response.text();

            if (responseBody.trim() === '') {
                console.log('No tasks found.');
                taskList.textContent = 'Please add tasks';
                taskList.classList.add("empty_list");
                return [];
            } else {
                taskList.classList.remove("empty_list");
            }

            try {
                const tasks = JSON.parse(responseBody);
                return tasks;
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
                return [];
            }
        } else {
            console.error('Failed to fetch tasks:', response.status);
            return [];
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
        taskList.textContent = 'Connection error. Try again later';
        return [];
    }
}


async function addTask(newTask) {
    console.log("submitted");

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTask),
        });
        if (response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const addedTask = await response.json();
                console.log('New task:', addedTask);
                return true;
            } else if (response.status === 201) {
                console.log('New task:', newTask);
                return true;
            } else {
                console.error('Received non-JSON response:', contentType, 'Response code:', response.status);
            }
        } else {
            console.error('Failed to add task:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}


// Update an existing task in the API
async function updateTask(taskLabel, end_date) {
    try {
        const taskLabelEncoded = encodeURIComponent(taskLabel);
        const response = await fetch(`${API_URL}/${taskLabelEncoded}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(end_date),
        });

        if (response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const updatedTaskResponse = await response.json();
                console.log('Updated task:', updatedTaskResponse);
            }
            return true;
        } else {
            console.error('Failed to update task:', response.status);
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

async function deleteTask(taskLabel) {
    try {
        const taskLabelEncoded = encodeURIComponent(taskLabel);
        const response = await fetch(`${API_URL}/${taskLabelEncoded}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log('success');
            return true;
        } else {
            console.error('Failed to delete task:', response.status);
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

export { fetchTasks, addTask, updateTask, deleteTask };
