import React, { useState } from 'react';
import { TASK_STATUSES } from './tasks';

function formatDate(dateString) {
    if (!dateString || dateString === '') return 'Non défini';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'N/A';
        }
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch {
        return dateString;
    }
}

export function TaskItem({
    task,
    isEditing,
    draftTitle,
    draftDueAt,
    onDraftChange,
    onDraftDueAtChange,
    onStartEdit,
    onSaveEdit,
    onDelete,
    onStatusChange,
    onAddTeammate,
    onRemoveTeammate,
    folders = [],
    currentFolderId = null,
    onChangeFolderTask = null,
}) {
    const [newTeammateName, setNewTeammateName] = useState('');
    const [showTeammateForm, setShowTeammateForm] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const handleAddTeammate = () => {
        if (newTeammateName.trim()) {
            onAddTeammate(task.id, newTeammateName);
            setNewTeammateName('');
            setShowTeammateForm(false);
        }
    };

    return (
        <li className="task-item">
            <div className="task-header">
                <button
                    type="button"
                    className="task-toggle-btn"
                    onClick={() => setShowDetails(!showDetails)}
                    aria-expanded={showDetails}
                    title={showDetails ? "Masquer les détails" : "Afficher les détails"}
                >
                    <span className={`task-chevron ${showDetails ? 'expanded' : ''}`}>▶</span>
                </button>
                <strong>
                    {isEditing ? (
                        <input
                            type="text"
                            value={draftTitle}
                            onChange={onDraftChange}
                            autoFocus
                        />
                    ) : (
                        task.title
                    )}
                </strong>
            </div>

            {showDetails && (
            <div>
                <div className="task-meta">
                    Statut :
                    <select
                        value={task.status}
                        onChange={(event) => onStatusChange(task.id, event.target.value)}
                    >
                        {TASK_STATUSES.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="task-meta">
                    Échéance :
                    {isEditing ? (
                        <input
                            type="date"
                            value={draftDueAt}
                            onChange={onDraftDueAtChange}
                            className="task-date-input"
                        />
                    ) : (
                        formatDate(task.dueAt)
                    )}
                </div>

                {folders && folders.length > 0 && onChangeFolderTask && (
                    <div className="task-meta">
                        Dossier :
                        <select
                            value={currentFolderId || ''}
                            onChange={(event) => {
                                const folderId = parseInt(event.target.value);
                                if (folderId) {
                                    onChangeFolderTask(task.id, folderId);
                                }
                            }}
                            className="task-folder-select"
                        >
                            <option value="">Sélectionner un dossier</option>
                            {folders.map((folder) => (
                                <option key={folder.id} value={folder.id}>
                                    {folder.title}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Section des personnes */}
                <div className="task-teammates">
                    <div className="teammates-header">
                        <strong>Personnes :</strong>
                    </div>
                    {task.teammates && task.teammates.length > 0 ? (
                        <div className="teammates-list">
                            {task.teammates.map((teammate, index) => (
                                <div key={index} className="teammate-badge">
                                    <span className="teammate-name">{teammate.name}</span>
                                    <button
                                        type="button"
                                        className="teammate-remove-btn"
                                        onClick={() => onRemoveTeammate(task.id, teammate.name)}
                                        title="Supprimer cette personne"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-teammates">Aucune personne assignée</div>
                    )}

                    {showTeammateForm ? (
                        <div className="teammate-form">
                            <input
                                type="text"
                                placeholder="Nom de la personne"
                                value={newTeammateName}
                                onChange={(e) => setNewTeammateName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleAddTeammate();
                                    } else if (e.key === 'Escape') {
                                        setShowTeammateForm(false);
                                        setNewTeammateName('');
                                    }
                                }}
                                autoFocus
                            />
                            <button
                                type="button"
                                className="btn-primary teammate-save"
                                onClick={handleAddTeammate}
                            >
                                Ajouter
                            </button>
                            <button
                                type="button"
                                className="btn-secondary teammate-cancel"
                                onClick={() => {
                                    setShowTeammateForm(false);
                                    setNewTeammateName('');
                                }}
                            >
                                Annuler
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            className="btn-secondary teammate-add-btn"
                            onClick={() => setShowTeammateForm(true)}
                        >
                            + Ajouter une personne
                        </button>
                    )}
                </div>

                <div className="task-actions">
                    <button type="button" onClick={() => onDelete(task.id)} className="btn-danger">
                        Supprimer
                    </button>

                    {isEditing ? (
                        <button type="button" onClick={onSaveEdit} className="btn-primary">
                            Enregistrer
                        </button>
                    ) : (
                        <button type="button" onClick={() => onStartEdit(task)} className="btn-secondary">
                            Modifier
                        </button>
                    )}
                </div>
            </div>
            )}
        </li>
    );
}
