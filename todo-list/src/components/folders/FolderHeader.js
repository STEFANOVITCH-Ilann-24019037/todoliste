import React from 'react';

export function FolderHeader({
    folder,
    isEditing,
    draftTitle,
    onDraftChange,
    onStartEdit,
    onSaveEdit,
    onCreateTask = null,
    onDeleteFolder = null,
}) {
    return (
        <>
            <h2>
                {isEditing ? (
                    <input
                        type="text"
                        value={draftTitle}
                        onChange={onDraftChange}
                        autoFocus
                    />
                ) : (
                    folder.title
                )}
            </h2>

            <div className="folder-header-actions">
                {isEditing ? (
                    <button type="button" onClick={onSaveEdit} className="btn-primary">
                        Enregistrer le dossier
                    </button>
                ) : (
                    <>
                        <button type="button" onClick={onStartEdit} className="btn-secondary">
                            Modifier le dossier
                        </button>
                        {onCreateTask && (
                            <button
                                type="button"
                                onClick={() => onCreateTask(folder.id)}
                                className="btn-primary"
                            >
                                + Créer une tâche
                            </button>
                        )}
                        {onDeleteFolder && (
                            <button
                                type="button"
                                onClick={() => onDeleteFolder(folder.id)}
                                className="btn-danger"
                            >
                                Supprimer
                            </button>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
