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
    updateTaskDueAt,
    sortTasks,
    SORT_OPTIONS,
    addTeammate,
    removeTeammate,
    createNewTask,
    addTaskToFolder,
} from './components/task/tasks';
import { createFolder, groupTasksByFolder, groupAllTasksByFolder, updateFolderTitle, getTaskFolderId, createNewFolder, deleteFolderById, deleteRelationsForFolder } from './components/folders/folders';

function App() {
    // State
    const [tasks, setTasks] = useState(data.tasks.map(createTask));
    const [folders, setFolders] = useState(data.folders);
    const [relations, setRelations] = useState(data.task_folder_relations);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editingFolderId, setEditingFolderId] = useState(null);
    const [draftTitle, setDraftTitle] = useState('');
    const [draftDueAt, setDraftDueAt] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('dueDate');
    const [currentView, setCurrentView] = useState('tasks'); // 'tasks' ou 'folders'
    const [selectedFolderId, setSelectedFolderId] = useState(null); // Dossier sélectionné dans la vue dossiers
    const [newFolderIdInEdit, setNewFolderIdInEdit] = useState(null); // Track the newly created folder to auto-edit
    const [newTaskIdInEdit, setNewTaskIdInEdit] = useState(null); // Track the newly created task to auto-edit

    // Compute
    const groupedFolders = useMemo(
        () => {
            const grouped = groupTasksByFolder(tasks, folders, relations, createTask, createFolder);

            // Appliquer le tri à chaque dossier
            const sortedGrouped = grouped.map((folder) => ({
                ...folder,
                tasks: sortTasks(folder.tasks, sortBy),
            }));

            if (!searchQuery.trim()) {
                return sortedGrouped;
            }

            const lowerQuery = searchQuery.toLowerCase();
            return sortedGrouped
                .map((folder) => ({
                    ...folder,
                    tasks: folder.tasks.filter((task) =>
                        task.title.toLowerCase().includes(lowerQuery)
                    ),
                }))
                .filter((folder) => folder.tasks.length > 0);
        },
        [tasks, folders, relations, searchQuery, sortBy]
    );

    // Compute all folders (including empty ones) for folders view
    const groupedAllFolders = useMemo(
        () => {
            const allGrouped = groupAllTasksByFolder(tasks, folders, relations, createTask, createFolder);

            if (!searchQuery.trim()) {
                return allGrouped;
            }

            const lowerQuery = searchQuery.toLowerCase();
            return allGrouped.filter((folder) =>
                folder.title.toLowerCase().includes(lowerQuery)
            );
        },
        [tasks, folders, relations, searchQuery]
    );

    // Handlers - Task
    const resetEditing = () => {
        setEditingTaskId(null);
        setEditingFolderId(null);
        setDraftTitle('');
        setDraftDueAt('');
        setNewFolderIdInEdit(null);
        setNewTaskIdInEdit(null);
    };

    const handleDeleteTask = (taskId) => {
        setTasks((currentTasks) => deleteTaskById(currentTasks, taskId));
        if (editingTaskId === taskId) resetEditing();
    };

    const handleStartEditingTask = (task) => {
        setEditingTaskId(task.id);
        setEditingFolderId(null);
        setDraftTitle(task.title);
        setDraftDueAt(task.dueAt || '');
    };

    const handleSaveTaskTitle = (taskId) => {
        setTasks((currentTasks) => updateTaskTitle(currentTasks, taskId, draftTitle));
        setTasks((currentTasks) => updateTaskDueAt(currentTasks, taskId, draftDueAt));
        setNewTaskIdInEdit(null);
        resetEditing();
    };

    const handleStatusChange = (taskId, nextStatus) => {
        setTasks((currentTasks) => updateTaskStatus(currentTasks, taskId, nextStatus));
    };

    // Handlers - Teammates
    const handleAddTeammate = (taskId, teammateName) => {
        setTasks((currentTasks) => addTeammate(currentTasks, taskId, teammateName));
    };

    const handleRemoveTeammate = (taskId, teammateName) => {
        setTasks((currentTasks) => removeTeammate(currentTasks, taskId, teammateName));
    };

    // Handlers - Create task in folder
    const handleCreateTaskInFolder = (folderId) => {
        const newTask = createNewTask('Nouvelle tâche', folderId);
        setTasks((currentTasks) => [...currentTasks, newTask]);
        setRelations((currentRelations) => addTaskToFolder(currentRelations, newTask.id, folderId));
        // Auto-edit the new task
        setEditingTaskId(newTask.id);
        setEditingFolderId(null);
        setDraftTitle(newTask.title);
        setDraftDueAt(newTask.dueAt || '');
        setNewTaskIdInEdit(newTask.id);
    };

    // Handlers - Change task folder
    const handleChangeTaskFolder = (taskId, folderId) => {
        setRelations((currentRelations) => addTaskToFolder(currentRelations, taskId, folderId));
    };

    // Handlers - Create folder
    const handleCreateFolder = () => {
        const newFolder = createNewFolder('Nouveau dossier');
        setFolders((currentFolders) => [...currentFolders, newFolder]);
        // Auto-edit the new folder
        setEditingFolderId(newFolder.id);
        setEditingTaskId(null);
        setDraftTitle(newFolder.title);
        setNewFolderIdInEdit(newFolder.id);
    };

    // Handlers - Delete folder
    const handleDeleteFolder = (folderId) => {
        if (window.confirm('Êtes-vous sûr ? Cela supprimera le dossier et tous ses liens avec les tâches.')) {
            setFolders((currentFolders) => deleteFolderById(currentFolders, folderId));
            setRelations((currentRelations) => deleteRelationsForFolder(currentRelations, folderId));
            if (editingFolderId === folderId) resetEditing();
            if (selectedFolderId === folderId) setSelectedFolderId(null);
        }
    };

    // Handlers - Folder
    const handleStartEditingFolder = (folder) => {
        setEditingFolderId(folder.id);
        setEditingTaskId(null);
        setDraftTitle(folder.title);
    };

    const handleSaveFolderTitle = (folderId) => {
        setFolders((currentFolders) => updateFolderTitle(currentFolders, folderId, draftTitle));
        setNewFolderIdInEdit(null);
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
            alert('Données importées avec succès !');
        } catch (error) {
            alert(`Erreur lors de l'import : ${error.message}`);
        }
    };

    const handleReset = () => {
        if (window.confirm('Êtes-vous sûr ? Cela supprimera toutes les tâches et dossiers.')) {
            setTasks([]);
            setFolders([]);
            setRelations([]);
            resetEditing();
            alert('Toutes les données ont été supprimées.');
        }
    };

    // Compute filtered folders for folders view
    const filteredFolders = useMemo(() => {
        if (!searchQuery.trim()) {
            return folders;
        }
        const lowerQuery = searchQuery.toLowerCase();
        return folders.filter((folder) => folder.title.toLowerCase().includes(lowerQuery));
    }, [folders, searchQuery]);

    return (
        <div className="App">
            <main className="app-shell">
                <h1>Ma to-do list</h1>z

                {/* Onglets de navigation */}
                <div className="nav-tabs">
                    <button
                        className={`tab-button ${currentView === 'tasks' ? 'active' : ''}`}
                        onClick={() => {
                            setCurrentView('tasks');
                            setSearchQuery('');
                            setSelectedFolderId(null);
                        }}
                    >
                        Tâches
                    </button>
                    <button
                        className={`tab-button ${currentView === 'folders' ? 'active' : ''}`}
                        onClick={() => {
                            setCurrentView('folders');
                            setSearchQuery('');
                            setSelectedFolderId(null);
                        }}
                    >
                        Dossiers
                    </button>
                </div>

                <div className="controls-bar">
                    <input
                        type="text"
                        placeholder={currentView === 'tasks' ? 'Rechercher une tâche...' : 'Rechercher un dossier...'}
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        className="search-input"
                    />
                    {currentView === 'tasks' && (
                        <select
                            value={sortBy}
                            onChange={(event) => setSortBy(event.target.value)}
                            className="sort-select"
                        >
                            {SORT_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    )}
                    <ImportButton onImport={handleImportJSON} />
                    {currentView === 'folders' && (
                        <button type="button" onClick={handleCreateFolder} className="btn-primary">
                            ➕ Créer un dossier
                        </button>
                    )}
                    <button type="button" onClick={handleReset} className="btn-danger">
                        Réinitialiser
                    </button>
                </div>

                {/* Vue des tâches */}
                {currentView === 'tasks' && (
                    <>
                        {groupedFolders.map((folder) => (
                            <FolderSection
                                key={folder.id}
                                folder={folder}
                                editingTaskId={editingTaskId}
                                editingFolderId={editingFolderId}
                                draftTitle={draftTitle}
                                draftDueAt={draftDueAt}
                                onDraftChange={(event) => setDraftTitle(event.target.value)}
                                onDraftDueAtChange={(event) => setDraftDueAt(event.target.value)}
                                onStartEditTask={handleStartEditingTask}
                                onStartEditFolder={handleStartEditingFolder}
                                onSaveEditTask={() => handleSaveTaskTitle(editingTaskId)}
                                onSaveEditFolder={() => handleSaveFolderTitle(editingFolderId)}
                                onDeleteTask={handleDeleteTask}
                                onStatusChange={handleStatusChange}
                                onAddTeammate={handleAddTeammate}
                                onRemoveTeammate={handleRemoveTeammate}
                                folders={folders}
                                relations={relations}
                                onChangeFolderTask={handleChangeTaskFolder}
                                onCreateTaskInFolder={handleCreateTaskInFolder}
                                onDeleteFolder={handleDeleteFolder}
                            />
                        ))}
                    </>
                )}

                {/* Vue des dossiers uniquement */}
                {currentView === 'folders' && (
                    <div className="folders-view">
                        {selectedFolderId ? (
                            // Afficher les tâches du dossier sélectionné
                            <div className="folder-details">
                                <button
                                    onClick={() => setSelectedFolderId(null)}
                                    className="btn-secondary"
                                >
                                    Retour aux dossiers
                                </button>
                                {(() => {
                                    const selectedFolder = groupedAllFolders.find((f) => f.id === selectedFolderId);
                                    return selectedFolder ? (
                                        <FolderSection
                                            folder={selectedFolder}
                                            editingTaskId={editingTaskId}
                                            editingFolderId={editingFolderId}
                                            draftTitle={draftTitle}
                                            draftDueAt={draftDueAt}
                                            onDraftChange={(event) => setDraftTitle(event.target.value)}
                                            onDraftDueAtChange={(event) => setDraftDueAt(event.target.value)}
                                            onStartEditTask={handleStartEditingTask}
                                            onStartEditFolder={handleStartEditingFolder}
                                            onSaveEditTask={() => handleSaveTaskTitle(editingTaskId)}
                                            onSaveEditFolder={() => handleSaveFolderTitle(editingFolderId)}
                                            onDeleteTask={handleDeleteTask}
                                            onStatusChange={handleStatusChange}
                                            onAddTeammate={handleAddTeammate}
                                            onRemoveTeammate={handleRemoveTeammate}
                                            folders={folders}
                                            relations={relations}
                                            onChangeFolderTask={handleChangeTaskFolder}
                                            onCreateTaskInFolder={handleCreateTaskInFolder}
                                            onDeleteFolder={handleDeleteFolder}
                                        />
                                    ) : (
                                        <p className="no-results">Dossier non trouvé</p>
                                    );
                                })()}
                            </div>
                        ) : (
                            // Afficher la liste des dossiers
                            groupedAllFolders.length > 0 ? (
                                <div className="folders-grid">
                                    {groupedAllFolders.map((folder) => (
                                        <div key={folder.id} className="folder-item">
                                            <div className="folder-card">
                                                {editingFolderId === folder.id ? (
                                                    <div className="folder-edit">
                                                        <input
                                                            type="text"
                                                            value={draftTitle}
                                                            onChange={(event) => setDraftTitle(event.target.value)}
                                                            autoFocus
                                                            className="folder-input"
                                                        />
                                                        <div className="folder-buttons">
                                                            <button onClick={() => handleSaveFolderTitle(folder.id)} className="save-btn">Valider</button>
                                                            <button onClick={resetEditing} className="cancel-btn">Annuler</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <h3 className="folder-title">{folder.title}</h3>
                                                        <p className="folder-task-count">
                                                            {folder.tasks.length} tâche{folder.tasks.length !== 1 ? 's' : ''}

                                                        </p>
                                                        <div className="folder-actions">
                                                            <button
                                                                onClick={() => setSelectedFolderId(folder.id)}
                                                                className="btn-primary"
                                                            >
                                                                Voir tâches
                                                            </button>
                                                            <button
                                                                onClick={() => handleStartEditingFolder(folder)}
                                                                className="btn-secondary"
                                                            >
                                                                Editer
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteFolder(folder.id)}
                                                                className="btn-danger"
                                                            >
                                                                Supprimer
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-results">Aucun dossier trouvé</p>
                            )
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
