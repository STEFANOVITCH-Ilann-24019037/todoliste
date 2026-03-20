import React, { useMemo, useState } from 'react';

import './App.css';
import data from './data/backup.json';
import {
    TASK_STATUSES,
    createTask,
    deleteTaskById,
    sortTasksByDueDate,
    updateTaskStatus,
    updateTaskTitle,
} from './components/task/tasks';
import { createFolder, groupTasksByFolder, updateFolderTitle } from './components/folders/folders';

function App() {
    const [tasks, setTasks] = useState(data.tasks.map(createTask));
    const [folders, setFolders] = useState(data.folders);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editingFolderId, setEditingFolderId] = useState(null);
    const [draftTitle, setDraftTitle] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const groupedFolders = useMemo(
        () => {
            const grouped = groupTasksByFolder(tasks, folders, data.task_folder_relations, createTask, createFolder);

            if (!searchQuery.trim()) {
                return grouped;
            }

            const lowerQuery = searchQuery.toLowerCase();
            return grouped
                .map((folder) => ({
                    ...folder,
                    tasks: folder.tasks.filter((task) =>
                        task.title.toLowerCase().includes(lowerQuery)
                    ),
                }))
                .filter((folder) => folder.tasks.length > 0);
        },
        [tasks, folders, searchQuery]
    );

    const deleteTask = (taskId) => {
        setTasks((currentTasks) => deleteTaskById(currentTasks, taskId));
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
        setTasks((currentTasks) => updateTaskTitle(currentTasks, taskId, draftTitle));
        setEditingTaskId(null);
        setDraftTitle('');
    };

    const saveTaskStatus = (taskId, nextStatus) => {
        setTasks((currentTasks) => updateTaskStatus(currentTasks, taskId, nextStatus));
    };

    const saveFolderTitle = (folderId) => {
        setFolders((currentFolders) => updateFolderTitle(currentFolders, folderId, draftTitle));
        setEditingFolderId(null);
        setDraftTitle('');
    };

    return (
        <div className="App">
            <main className="app-shell">
                <h1>Ma to-do list</h1>
                <p className="subtitle">version 1</p>

                <input
                    type="text"
                    placeholder="Rechercher une tâche..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="search-input"
                />

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
                                {sortTasksByDueDate(folder.tasks).map((task) => {
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
                                                <div className="task-meta">Statut : <select
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
