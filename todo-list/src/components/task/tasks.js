export const TASK_STATUSES = ['Abandonné', 'En attente', 'Nouveau', 'Réussi'];

export const SORT_OPTIONS = [
    { value: 'dueDate', label: 'Date d\'échéance' },
    { value: 'status', label: 'Statut' },
    { value: 'title', label: 'Titre' },
];

export function createTask(task) {
    return {
        id: task.id,
        title: task.title,
        description: task.description,
        createdAt: task.date_creation,
        dueAt: task.date_echeance,
        status: task.etat,
        teammates: task.equipiers ?? [],
    };
}

export function sortTasksByDueDate(tasks) {
    return [...tasks].sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt));
}

export function sortTasksByStatus(tasks) {
    const statusOrder = { 'Nouveau': 0, 'En attente': 1, 'Réussi': 2, 'Abandonné': 3 };
    return [...tasks].sort((a, b) => (statusOrder[a.status] ?? 999) - (statusOrder[b.status] ?? 999));
}

export function sortTasksByTitle(tasks) {
    return [...tasks].sort((a, b) => a.title.localeCompare(b.title, 'fr'));
}

export function sortTasks(tasks, sortBy) {
    switch (sortBy) {
        case 'dueDate':
            return sortTasksByDueDate(tasks);
        case 'status':
            return sortTasksByStatus(tasks);
        case 'title':
            return sortTasksByTitle(tasks);
        default:
            return sortTasksByDueDate(tasks);
    }
}

export function deleteTaskById(tasks, taskId) {
    return tasks.filter((task) => task.id !== taskId);
}

export function updateTaskTitle(tasks, taskId, nextTitle) {
    return tasks.map((task) =>
        task.id === taskId ? { ...task, title: nextTitle.trim() || task.title } : task
    );
}

export function updateTaskStatus(tasks, taskId, nextStatus) {
    if (!TASK_STATUSES.includes(nextStatus)) {
        return tasks;
    }

    return tasks.map((task) => (task.id === taskId ? { ...task, status: nextStatus } : task));
}

export function updateTaskDueAt(tasks, taskId, nextDueAt) {
    return tasks.map((task) =>
        task.id === taskId ? { ...task, dueAt: nextDueAt } : task
    );
}

export function addTeammate(tasks, taskId, teammateName) {
    if (!teammateName.trim()) {
        return tasks;
    }

    return tasks.map((task) => {
        if (task.id === taskId) {
            // Vérifier que la personne n'existe pas déjà
            const alreadyExists = task.teammates.some(
                (teammate) => teammate.name.toLowerCase() === teammateName.trim().toLowerCase()
            );
            if (alreadyExists) {
                return task;
            }
            return {
                ...task,
                teammates: [...task.teammates, { name: teammateName.trim() }],
            };
        }
        return task;
    });
}

export function removeTeammate(tasks, taskId, teammateName) {
    return tasks.map((task) => {
        if (task.id === taskId) {
            return {
                ...task,
                teammates: task.teammates.filter(
                    (teammate) => teammate.name.toLowerCase() !== teammateName.toLowerCase()
                ),
            };
        }
        return task;
    });
}

export function createNewTask(title, folderId = null) {
    const newId = Date.now() + Math.floor(Math.random() * 1000);
    return {
        id: newId,
        title: title.trim() || 'Nouvelle tâche',
        description: '',
        createdAt: new Date().toISOString().split('T')[0],
        dueAt: '',
        status: 'Nouveau',
        teammates: [],
    };
}

export function addTaskToFolder(relations, taskId, folderId) {
    // Vérifier que la relation n'existe pas déjà
    const alreadyExists = relations.some(
        (rel) => rel.task_id === taskId && rel.folder_id === folderId
    );
    if (alreadyExists) {
        return relations;
    }

    // Supprimer la tâche d'autres dossiers et l'ajouter au nouveau
    const filtered = relations.filter((rel) => rel.task_id !== taskId);
    return [...filtered, { task_id: taskId, folder_id: folderId }];
}

