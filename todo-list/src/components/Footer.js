import React from 'react';

// Affiche le footer avec bouton pour ajouter une tâche



function Footer() {
    return (
        <footer>
            <button onClick={newTask()}>Ajouter</button>
        </footer>
    );
}
function newTask() {
    console.log("Ajouter une nouvelle tâche");
}
export default Footer;
