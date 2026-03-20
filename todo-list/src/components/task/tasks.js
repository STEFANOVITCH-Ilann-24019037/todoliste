export const TASK_STATUSES = ['Abandonné', 'En attente', 'Nouveau', 'Réussi'];

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
