export function createFolder(folder) {
    return {
        id: folder.id,
        title: folder.title,
        description: folder.description,
        color: folder.color,
        icon: folder.icon,
        tasks: [],
    };
}

export function groupTasksByFolder(tasks, folders, relations, createTask, createFolderFn) {
    const folderMap = new Map(folders.map((folder) => [folder.id, { ...createFolderFn(folder), tasks: [] }]));
    const taskMap = new Map(tasks.map((task) => [task.id, createTask(task)]));

    relations.forEach(({ task_id, folder_id }) => {
        const folder = folderMap.get(folder_id);
        const task = taskMap.get(task_id);

        if (folder && task) {
            folder.tasks.push(task);
        }
    });

    return Array.from(folderMap.values()).filter((folder) => folder.tasks.length > 0);
}

export function updateFolderTitle(folders, folderId, nextTitle) {
    return folders.map((folder) =>
        folder.id === folderId ? { ...folder, title: nextTitle.trim() || folder.title } : folder
    );
}
