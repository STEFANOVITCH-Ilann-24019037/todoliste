import { ETAT_TERMINE } from '../constants/enums';

// Filtre les tâches non terminées
export const filterActiveTasks = (tasks) => {
    return tasks.filter(task => !ETAT_TERMINE.includes(task.etat));
};

// Trie les tâches par date d'échéance (plus récent en premier)
export const sortTasksByDueDate = (tasks) => {
    return [...tasks].sort((a, b) =>
        new Date(b.date_echeance) - new Date(a.date_echeance)
    );
};

