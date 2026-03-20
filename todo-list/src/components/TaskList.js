import React from 'react';
import TaskItem from './TaskItem';

// Affiche la liste de tâches
function TaskList({ tasks, onUpdateTask }) {
    return (
        <div>
            {/* Affiche chaque tâche */}
            {tasks.map(task => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onUpdateTask={onUpdateTask}
                />
            ))}
        </div>
    );
}

export default TaskList;
