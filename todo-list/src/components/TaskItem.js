import React from 'react';

// Affiche une tâche individuelle avec titre, date et sélecteur d'état
function TaskItem({ task, onUpdateTask }) {
    // Gère le changement d'état
    const handleStateChange = (newState) => {
        onUpdateTask(task.id, { etat: newState });
    };

    return (
        <div>
            {/* Informations de la tâche */}
            <div>
                <h4>{task.title}</h4>
                <p>{task.date_echeance}</p>
            </div>

            {/* Sélecteur d'état */}
            <select
                value={task.etat}
                onChange={(e) => handleStateChange(e.target.value)}
            >
                <option>Nouveau</option>
                <option>En cours</option>
                <option>En attente</option>
                <option>Réussi</option>
                <option>Abandonné</option>
            </select>
        </div>
    );
}

export default TaskItem;
