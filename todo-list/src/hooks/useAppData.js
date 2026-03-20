import { useState } from 'react';
import backupData from '../data/backup.json';

// Hook pour gérer l'état global des tâches
export const useAppData = () => {
    // État : liste de tâches
    const [tasks, setTasks] = useState(backupData.tasks);

    // Fonction : modifier une tâche par son ID
    const updateTask = (taskId, updates) => {
        setTasks(tasks.map(t =>
            t.id === taskId ? { ...t, ...updates } : t
        ));
    };

    return { tasks, updateTask };
};
