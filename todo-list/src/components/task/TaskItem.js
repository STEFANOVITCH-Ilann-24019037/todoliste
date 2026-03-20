import React from 'react';
import { TASK_STATUSES } from './tasks';

export function TaskItem({
    task,
    isEditing,
    draftTitle,
    onDraftChange,
    onStartEdit,
    onSaveEdit,
    onDelete,
    onStatusChange,
}) {
    return (
        <li className="task-item">
            <div>
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

                <div className="task-meta">Échéance : {task.dueAt}</div>

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
        </li>
    );
}
