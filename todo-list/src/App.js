import React from 'react';

import './App.css';
import data from './data/backup.json';

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
    const folders = groupTasksByFolder(data.tasks, data.folders, data.task_folder_relations);

    return (
        <div className="App">
            <main className="app-shell">
                <h1>Ma to-do list</h1>
                <p className="subtitle">version 1</p>

                {folders.map((folder) => (
                    <section key={folder.id} className="folder-card">
                        <h2>{folder.title}</h2>
                        <ul className="task-list">
                            {sortByDueDate(folder.tasks).map((task) => (
                                <li key={task.id} className="task-item">
                                    <div>
                                        <strong>{task.title}</strong>
                                        <div className="task-meta">Statut : {task.status}</div>
                                        <div className="task-meta">Échéance : {task.dueAt}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </main>
        </div>
    );
}

export default App;

