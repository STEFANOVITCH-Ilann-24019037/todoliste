import React from 'react';

export function FolderHeader({
    folder,
    isEditing,
    draftTitle,
    onDraftChange,
    onStartEdit,
    onSaveEdit,
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

            {isEditing ? (
                <button type="button" onClick={onSaveEdit} className="btn-primary">
                    Enregistrer le dossier
                </button>
            ) : (
                <button type="button" onClick={onStartEdit} className="btn-secondary">
                    Modifier le dossier
                </button>
            )}
        </>
    );
}
