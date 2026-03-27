import React from 'react';
import { FolderHeader } from './FolderHeader';
import { TaskItem } from '../task/TaskItem';
import { getTaskFolderId } from './folders';

export function FolderSection({
    folder,
    editingTaskId,
    editingFolderId,
    draftTitle,
    draftDueAt,
    onDraftChange,
    onDraftDueAtChange,
    onStartEditTask,
    onStartEditFolder,
    onSaveEditTask,
    onSaveEditFolder,
    onDeleteTask,
    onStatusChange,
    onAddTeammate,
    onRemoveTeammate,
    folders = [],
    relations = [],
    onChangeFolderTask = null,
    onCreateTaskInFolder = null,
    onDeleteFolder = null,
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
                onCreateTask={onCreateTaskInFolder}
                onDeleteFolder={onDeleteFolder}
            />

            <ul className="task-list">
                {folder.tasks.map((task) => {
                    const isEditingTask = editingTaskId === task.id;
                    const currentFolderId = getTaskFolderId(relations, task.id);

                    return (
                        <TaskItem
                            key={task.id}
                            task={task}
                            isEditing={isEditingTask}
                            draftTitle={draftTitle}
                            draftDueAt={draftDueAt}
                            onDraftChange={onDraftChange}
                            onDraftDueAtChange={onDraftDueAtChange}
                            onStartEdit={onStartEditTask}
                            onSaveEdit={onSaveEditTask}
                            onDelete={onDeleteTask}
                            onStatusChange={onStatusChange}
                            onAddTeammate={onAddTeammate}
                            onRemoveTeammate={onRemoveTeammate}
                            folders={folders}
                            currentFolderId={currentFolderId}
                            onChangeFolderTask={onChangeFolderTask}
                        />
                    );
                })}
            </ul>
        </section>
    );
}
