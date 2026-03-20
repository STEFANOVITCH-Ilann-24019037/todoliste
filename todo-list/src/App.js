import React, { useMemo, useState } from 'react';

import './App.css';
import data from './data/backup.json';
import { FolderSection } from './components/folders/FolderSection';
import { ImportButton } from './components/ImportButton';
import {
    createTask,
    deleteTaskById,
    updateTaskStatus,
    updateTaskTitle,
} from './components/task/tasks';
import { createFolder, groupTasksByFolder, updateFolderTitle } from './components/folders/folders';

function App() {
    // State
    const [tasks, setTasks] = useState(data.tasks.map(createTask));
    const [folders, setFolders] = useState(data.folders);
    const [relations, setRelations] = useState(data.task_folder_relations);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editingFolderId, setEditingFolderId] = useState(null);
    const [draftTitle, setDraftTitle] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Compute
    const groupedFolders = useMemo(
        () => {
            const grouped = groupTasksByFolder(tasks, folders, relations, createTask, createFolder);

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
        [tasks, folders, relations, searchQuery]
    );

    // Handlers - Task
    const resetEditing = () => {
        setEditingTaskId(null);
        setEditingFolderId(null);
        setDraftTitle('');
    };

    const handleDeleteTask = (taskId) => {
        setTasks((currentTasks) => deleteTaskById(currentTasks, taskId));
        if (editingTaskId === taskId) resetEditing();
    };

    const handleStartEditingTask = (task) => {
        setEditingTaskId(task.id);
        setEditingFolderId(null);
        setDraftTitle(task.title);
    };

    const handleSaveTaskTitle = (taskId) => {
        setTasks((currentTasks) => updateTaskTitle(currentTasks, taskId, draftTitle));
        resetEditing();
    };

    const handleStatusChange = (taskId, nextStatus) => {
        setTasks((currentTasks) => updateTaskStatus(currentTasks, taskId, nextStatus));
    };

    // Handlers - Folder
    const handleStartEditingFolder = (folder) => {
        setEditingFolderId(folder.id);
        setEditingTaskId(null);
        setDraftTitle(folder.title);
    };

    const handleSaveFolderTitle = (folderId) => {
        setFolders((currentFolders) => updateFolderTitle(currentFolders, folderId, draftTitle));
        resetEditing();
    };

    // Handlers - Import
    const handleImportJSON = (importedData) => {
        try {
            if (!importedData.tasks || !importedData.folders || !importedData.task_folder_relations) {
                alert('Format JSON invalide. Vérifiez que vous avez: tasks, folders, task_folder_relations');
                return;
            }

            setTasks(importedData.tasks.map(createTask));
            setFolders(importedData.folders);
            setRelations(importedData.task_folder_relations);
            resetEditing();
            alert('✅ Données importées avec succès !');
        } catch (error) {
            alert(`❌ Erreur lors de l'import : ${error.message}`);
        }
    };

    return (
        <div className="App">
            <main className="app-shell">
                <h1>Ma to-do list</h1>
                <p className="subtitle">version 1</p>

                <div className="controls-bar">
                    <input
                        type="text"
                        placeholder="Rechercher une tâche..."
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        className="search-input"
                    />
                    <ImportButton onImport={handleImportJSON} />
                </div>

                {groupedFolders.map((folder) => (
                    <FolderSection
                        key={folder.id}
                        folder={folder}
                        editingTaskId={editingTaskId}
                        editingFolderId={editingFolderId}
                        draftTitle={draftTitle}
                        onDraftChange={(event) => setDraftTitle(event.target.value)}
                        onStartEditTask={handleStartEditingTask}
                        onStartEditFolder={handleStartEditingFolder}
                        onSaveEditTask={() => handleSaveTaskTitle(editingTaskId)}
                        onSaveEditFolder={() => handleSaveFolderTitle(editingFolderId)}
                        onDeleteTask={handleDeleteTask}
                        onStatusChange={handleStatusChange}
                    />
                ))}
            </main>
        </div>
    );
}

export default App;
