import React from 'react';
import { useAppData } from './hooks/useAppData';
import { filterActiveTasks, sortTasksByDueDate } from './utils/taskUtils';
import Header from './components/Header';
import Footer from './components/Footer';
import TaskList from './components/TaskList';
import './App.css';

function App() {
    // Récupère les tâches et la fonction pour les modifier
    const { tasks, updateTask } = useAppData();

    // Filtre les tâches actives et les trie par date d'échéance
    const displayedTasks = sortTasksByDueDate(filterActiveTasks(tasks));

    return (
        <div className="App">
            <Header />
            <main>
                <TaskList tasks={displayedTasks} onUpdateTask={updateTask} />
            </main>
            <Footer />
        </div>
    );
}

export default App;
