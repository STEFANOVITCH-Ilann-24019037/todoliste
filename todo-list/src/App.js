import React, { useMemo, useState } from 'react';

import './App.css';
import data from './data/backup.json';

const TASK_STATUSES = ['Abandonné', 'En attente', 'Nouveau', 'Réussi'];

function createTask(task) {
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

function createFolder(folder) {
    return {
        id: folder.id,
        title: folder.title,
        description: folder.description,
        color: folder.color,
        icon: folder.icon,
        tasks: [],
    };
}

function groupTasksByFolder(tasks, folders, relations) {
    const folderMap = new Map(folders.map((folder) => [folder.id, { ...createFolder(folder), tasks: [] }]));
    const taskMap = new Map(tasks.map((task) => [task.id, createTask(task)]));

    relations.forEach(({ task_id, folder_id }) => {
        const folder = folderMap.get(folder_id);
        const task = taskMap.get(task_id);

        if (folder && task) {
            folder.tasks.push(task);
        }
    });

    return Array.from(folderMap.values()).filter((folder) => folder.tasks.length > 0);
}

function sortByDueDate(tasks) {
    return [...tasks].sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt));
}

function App() {
    const [tasks, setTasks] = useState(data.tasks.map(createTask));
    const [folders, setFolders] = useState(data.folders);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editingFolderId, setEditingFolderId] = useState(null);
    const [draftTitle, setDraftTitle] = useState('');

    const groupedFolders = useMemo(
        () => groupTasksByFolder(tasks, folders, data.task_folder_relations),
        [tasks, folders]
    );

    const deleteTask = (taskId) => {
        setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
        if (editingTaskId === taskId) {
            setEditingTaskId(null);
            setDraftTitle('');
        }
    };

    const startEditingTask = (task) => {
        setEditingTaskId(task.id);
        setEditingFolderId(null);
        setDraftTitle(task.title);
    };

    const startEditingFolder = (folder) => {
        setEditingFolderId(folder.id);
        setEditingTaskId(null);
        setDraftTitle(folder.title);
    };

    const saveTaskTitle = (taskId) => {
        setTasks((currentTasks) =>
            currentTasks.map((task) =>
                task.id === taskId ? { ...task, title: draftTitle.trim() || task.title } : task
            )
        );
        setEditingTaskId(null);
        setDraftTitle('');
    };

    const saveTaskStatus = (taskId, nextStatus) => {
        if (!TASK_STATUSES.includes(nextStatus)) {
            return;
        }

        setTasks((currentTasks) =>
            currentTasks.map((task) => (task.id === taskId ? { ...task, status: nextStatus } : task))
        );
    };

    const saveFolderTitle = (folderId) => {
        setFolders((currentFolders) =>
            currentFolders.map((folder) =>
                folder.id === folderId ? { ...folder, title: draftTitle.trim() || folder.title } : folder
            )
        );
        setEditingFolderId(null);
        setDraftTitle('');
    };

    return (
        <div className="App">
            <main className="app-shell">
                <h1>Ma to-do list</h1>
                <p className="subtitle">version 1</p>

                {groupedFolders.map((folder) => {
                    const isEditingFolder = editingFolderId === folder.id;

                    return (
                        <section key={folder.id} className="folder-card">
                            <h2>
                                {isEditingFolder ? (
                                    <input
                                        type="text"
                                        value={draftTitle}
                                        onChange={(event) => setDraftTitle(event.target.value)}
                                    />
                                ) : (
                                    folder.title
                                )}
                            </h2>

                            {isEditingFolder ? (
                                <button type="button" onClick={() => saveFolderTitle(folder.id)}>
                                    Enregistrer le dossier
                                </button>
                            ) : (
                                <button type="button" onClick={() => startEditingFolder(folder)}>
                                    Modifier le dossier
                                </button>
                            )}

                            <ul className="task-list">
                                {sortByDueDate(folder.tasks).map((task) => {
                                    const isEditingTask = editingTaskId === task.id;

                                    return (
                                        <li key={task.id} className="task-item">
                                            <div>
                                                <strong>
                                                    {isEditingTask ? (
                                                        <input
                                                            type="text"
                                                            value={draftTitle}
                                                            onChange={(event) => setDraftTitle(event.target.value)}
                                                        />
                                                    ) : (
                                                        task.title
                                                    )}
                                                </strong>
                                                <div className="task-meta">Statut :
                                                    <select
                                                    value={task.status}
                                                    onChange={(event) => saveTaskStatus(task.id, event.target.value)}
                                                >
                                                    {TASK_STATUSES.map((status) => (
                                                        <option key={status} value={status}>
                                                            {status}
                                                        </option>
                                                    ))}
                                                </select></div>
                                                <div className="task-meta">Échéance : {task.dueAt}</div>

                                                <button type="button" onClick={() => deleteTask(task.id)}>
                                                    Supprimer
                                                </button>
                                                {isEditingTask ? (
                                                    <button type="button" onClick={() => saveTaskTitle(task.id)}>
                                                        Enregistrer
                                                    </button>
                                                ) : (
                                                    <button type="button" onClick={() => startEditingTask(task)}>
                                                        Modifier
                                                    </button>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </section>
                    );
                })}
            </main>
        </div>
    );
}

export default App;

