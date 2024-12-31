import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import JsonViewer from './JsonViewer';
import History from './History';

interface EditorProps {
    theme: 'light' | 'dark';
    jsonContent?: string;
    onContentChange?: (content: string) => void;
}

export interface EditorRef {
    handleFormat: () => Promise<void>;
    handleMinify: () => Promise<void>;
    handleStringify: () => Promise<void>;
    handleCopy: () => Promise<void>;
    handleClear: () => void;
    setShowHistory: React.Dispatch<React.SetStateAction<boolean>>;
}

interface HistoryItem {
    content: string;
    timestamp: number;
}

const MAX_HISTORY_ITEMS = 50;

const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const Editor = forwardRef<EditorRef, EditorProps>(({ theme, jsonContent, onContentChange }, ref) => {
    const [jsonInput, setJsonInput] = useState(jsonContent || '');
    const [parsedJson, setParsedJson] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState('Ready');
    const [jsonStats, setJsonStats] = useState({ size: 0, lines: 0 });
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        loadHistory();
    }, []);

    useEffect(() => {
        if (jsonContent) {
            setJsonInput(jsonContent);
            parseAndUpdateJson(jsonContent);
        }
    }, [jsonContent]);

    useEffect(() => {
        setJsonStats({
            size: new Blob([jsonInput]).size,
            lines: jsonInput.split('\n').length
        });
    }, [jsonInput]);

    useImperativeHandle(ref, () => ({
        handleFormat,
        handleMinify,
        handleStringify,
        handleCopy,
        handleClear,
        setShowHistory
    }));

    const loadHistory = async () => {
        try {
            const result = await chrome.storage.local.get(['jsonHistory']);
            setHistory(result.jsonHistory || []);
        } catch (error) {
            console.error('Failed to load history:', error);
        }
    };

    const saveToHistory = async (content: string) => {
        if (!content.trim()) return;

        const newItem = {
            content,
            timestamp: Date.now()
        };

        const filteredHistory = history.filter(item => item.content !== content);

        const updatedHistory = [newItem, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
        setHistory(updatedHistory);

        try {
            await chrome.storage.local.set({ jsonHistory: updatedHistory });
        } catch (error) {
            console.error('Failed to save to history:', error);
        }
    };

    const clearHistory = async () => {
        try {
            await chrome.storage.local.set({ jsonHistory: [] });
            setHistory([]);
            updateStatus('History cleared');
        } catch (error) {
            updateStatus('Failed to clear history', true);
        }
    };

    const parseAndUpdateJson = useCallback((value: string) => {
        if (!value.trim()) {
            setParsedJson(null);
            setError(null);
            return;
        }

        try {
            const parsed = JSON.parse(value);
            setParsedJson(parsed);
            setError(null);
        } catch (e) {
            setParsedJson(null);
            if (e instanceof SyntaxError) {
                // Extract position from error message
                const match = e.message.match(/at position (\d+)/);
                if (match) {
                    const position = parseInt(match[1], 10);
                    // Find line and column number
                    const lines = value.slice(0, position).split('\n');
                    const line = lines.length;
                    const column = lines[lines.length - 1].length + 1;
                    
                    // Get the problematic line
                    const allLines = value.split('\n');
                    const errorLine = allLines[line - 1];
                    
                    // Create pointer to the error position
                    const pointer = ' '.repeat(column - 1) + '^';
                    
                    setError(`JSON Syntax Error at line ${line}, column ${column}:\n\n${errorLine}\n${pointer}\n\n${e.message}`);
                } else {
                    setError(`JSON Syntax Error: ${e.message}`);
                }
            } else {
                setError('Invalid JSON');
            }
        }
    }, []);

    const updateStatus = useCallback((message: string, isError = false) => {
        setStatus(message);
        if (isError) {
            setError(message);
        }
        setTimeout(() => {
            setStatus('Ready');
            if (isError) setError(null);
        }, 3000);
    }, []);

    const handleFormat = async () => {
        try {
            const parsed = JSON.parse(jsonInput);
            const formatted = JSON.stringify(parsed, null, 2);
            setJsonInput(formatted);
            setParsedJson(parsed);
            updateStatus('JSON formatted successfully');
            await saveToHistory(formatted);
        } catch (e) {
            updateStatus('Invalid JSON: Unable to format', true);
        }
    };

    const handleMinify = async () => {
        try {
            const parsed = JSON.parse(jsonInput);
            const compressed = JSON.stringify(parsed);
            setJsonInput(compressed);
            setParsedJson(parsed);
            updateStatus('JSON compressed successfully');
            await saveToHistory(compressed);
        } catch (e) {
            updateStatus('Invalid JSON: Unable to compress', true);
        }
    };

    const handleStringify = async () => {
        try {
            let parsed;
            const input = jsonInput;
            
            // First try to parse if it's a JSON object
            try {
                parsed = JSON.parse(input);
                // Convert the parsed JSON to a JSON string representation
                const stringified = JSON.stringify(JSON.stringify(parsed));
                setParsedJson(stringified);
                updateStatus('Converted to JSON string successfully');
                // Only save to history if this is a new conversion
                if (input !== history[0]?.content) {
                    await saveToHistory(stringified);
                }
            } catch {
                // If not a valid JSON, wrap the input as a string
                const stringified = JSON.stringify(input);
                setParsedJson(stringified);
                updateStatus('Converted to string successfully');
                // Only save to history if this is a new conversion
                if (input !== history[0]?.content) {
                    await saveToHistory(stringified);
                }
            }
        } catch (e) {
            updateStatus('Unable to convert to string', true);
        }
    };

    const handleCopy = async () => {
        try {
            // If we have valid parsed JSON, copy the formatted version
            if (parsedJson) {
                const formattedJson = JSON.stringify(parsedJson, null, 2);
                await navigator.clipboard.writeText(formattedJson);
                updateStatus('Formatted JSON copied to clipboard');
            } else {
                // If no valid JSON, copy the raw input
                await navigator.clipboard.writeText(jsonInput);
                updateStatus('Content copied to clipboard');
            }
        } catch (e) {
            updateStatus('Failed to copy to clipboard', true);
        }
    };

    const handleClear = () => {
        setJsonInput('');
        setParsedJson(null);
        setError(null);
        updateStatus('Content cleared');
        onContentChange?.('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setJsonInput(value);
        parseAndUpdateJson(value);
        onContentChange?.(value);
    };

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.currentTarget.selectionStart;
            const end = e.currentTarget.selectionEnd;
            const spaces = '    ';
            
            setJsonInput(prev => 
                prev.substring(0, start) + 
                spaces + 
                prev.substring(end)
            );

            setTimeout(() => {
                e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + spaces.length;
            }, 0);
        }

        if (e.metaKey || e.ctrlKey) {
            switch(e.key) {
                case 'b':
                    e.preventDefault();
                    handleFormat();
                    break;
                case 'm':
                    e.preventDefault();
                    handleMinify();
                    break;
                case 'l':
                    e.preventDefault();
                    handleClear();
                    break;
                case 'h':
                    e.preventDefault();
                    setShowHistory(prev => !prev);
                    break;
            }
        }
    }, [handleFormat, handleMinify, handleClear]);

    const handleHistorySelect = (content: string) => {
        setJsonInput(content);
        parseAndUpdateJson(content);
        setShowHistory(false);
    };

    return (
        <div className="editor-container">
            <div className="editor-content">
                <textarea
                    value={jsonInput}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Paste your JSON here..."
                    spellCheck={false}
                    className={error ? 'has-error' : ''}
                />
                {error && (
                    <div className="error-message">
                        <div className="error-title">Error</div>
                        <div className="error-details">{error}</div>
                    </div>
                )}

                {parsedJson && !error && (
                    <div className="json-preview">
                        <JsonViewer data={parsedJson} theme={theme} />
                    </div>
                )}
            </div>

            <div className="editor-footer">
                <div className="status-info">
                    <span>Size: {formatSize(jsonStats.size)}</span>
                    <span>Lines: {jsonStats.lines}</span>
                    <span className={error ? 'status-error' : ''}>{status}</span>
                </div>
            </div>

            {showHistory && (
                <div className="history-overlay">
                    <History
                        items={history}
                        onSelect={handleHistorySelect}
                        onClose={() => setShowHistory(false)}
                        onClear={clearHistory}
                    />
                </div>
            )}
        </div>
    );
});

export default Editor; 