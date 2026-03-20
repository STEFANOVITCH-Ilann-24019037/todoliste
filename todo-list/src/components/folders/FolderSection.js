import React from 'react';
import { FolderHeader } from './FolderHeader';
import { TaskItem } from '../task/TaskItem';
import { sortTasksByDueDate } from '../task/tasks';

export function FolderSection({
    folder,
    editingTaskId,
    editingFolderId,
    draftTitle,
    onDraftChange,
    onStartEditTask,
    onStartEditFolder,
    onSaveEditTask,
    onSaveEditFolder,
    onDeleteTask,
    onStatusChange,
}) {
    const isEditingFolder = editingFolderId === folder.id;

    return (
        <section key={folder.id} className="folder-card">
            <FolderHeader
                folder={folder}
                isEditing={isEditingFolder}
                draftTitle={draftTitle}
                onDraftChange={onDraftChange}
                onStartEdit={() => onStartEditFolder(folder)}
                onSaveEdit={onSaveEditFolder}
            />

            <ul className="task-list">
                {sortTasksByDueDate(folder.tasks).map((task) => {
                    const isEditingTask = editingTaskId === task.id;

                    return (
                        <TaskItem
                            key={task.id}
                            task={task}
                            isEditing={isEditingTask}
                            draftTitle={draftTitle}
                            onDraftChange={onDraftChange}
                            onStartEdit={onStartEditTask}
                            onSaveEdit={onSaveEditTask}
                            onDelete={onDeleteTask}
                            onStatusChange={onStatusChange}
                        />
                    );
                })}
            </ul>
        </section>
    );
}
