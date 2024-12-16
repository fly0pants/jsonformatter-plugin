import React from 'react';
import JsonView, { JsonViewProps } from 'react18-json-view';
import 'react18-json-view/src/style.css';

interface JsonViewerProps {
    data: any;
    theme: 'light' | 'dark';
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data, theme }) => {
    const handleEdit: JsonViewProps['onEdit'] = () => {};
    const handleAdd: JsonViewProps['onAdd'] = () => {};
    const handleDelete: JsonViewProps['onDelete'] = () => {};

    return (
        <div className="json-viewer-container">
            <JsonView
                src={data}
                theme={theme === 'dark' ? 'a11y' : 'default'}
                collapsed={2}
                style={{
                    background: 'transparent',
                    fontSize: '13px',
                    fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace",
                    lineHeight: '1.6',
                    padding: '12px',
                    width: '100%',
                    height: '100%',
                }}
                editable={false}
                onEdit={handleEdit}
                onAdd={handleAdd}
                onDelete={handleDelete}
                displaySize={true}
                enableClipboard={true}
            />
        </div>
    );
};

export default JsonViewer; 