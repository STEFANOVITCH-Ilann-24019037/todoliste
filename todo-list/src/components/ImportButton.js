import React from 'react';

export function ImportButton({ onImport }) {
    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result);
                onImport(json);
                // Reset input
                event.target.value = '';
            } catch (error) {
                alert(`Erreur : ${error.message}`);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="import-button-container">
            <label htmlFor="import-file" className="btn-secondary">
                📥 Importer JSON
            </label>
            <input
                id="import-file"
                type="file"
                accept=".json"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
        </div>
    );
}
