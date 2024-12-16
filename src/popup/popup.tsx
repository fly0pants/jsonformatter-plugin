import { createRoot } from 'react-dom/client';
import { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Editor, { EditorRef } from './components/Editor';
import './popup.css';

// Create React root
const root = document.getElementById('root') as HTMLDivElement;
const reactRoot = createRoot(root);

// Types
interface StorageData {
    isDarkTheme?: boolean;
}

// Main App Component
function App() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [hasContent, setHasContent] = useState(false);
    const editorRef = useRef<EditorRef>(null);

    useEffect(() => {
        // Initialize theme
        chrome.storage.local.get(['isDarkTheme'], (result: StorageData) => {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const isDark = result.isDarkTheme ?? prefersDark;
            setTheme(isDark ? 'dark' : 'light');
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        });
    }, []);

    const handleThemeChange = (isDark: boolean) => {
        setTheme(isDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        void chrome.storage.local.set({ isDarkTheme: isDark });
    };

    return (
        <div className="container">
            <Sidebar
                theme={theme}
                onThemeChange={handleThemeChange}
                onFormat={() => editorRef.current?.handleFormat()}
                onMinify={() => editorRef.current?.handleMinify()}
                onStringify={() => editorRef.current?.handleStringify()}
                onCopy={() => editorRef.current?.handleCopy()}
                onClear={() => {
                    editorRef.current?.handleClear();
                    setHasContent(false);
                }}
                onHistoryClick={() => editorRef.current?.setShowHistory(prev => !prev)}
                showHistory={false}
                hasContent={hasContent}
            />
            <div className="main-content">
                <Editor
                    ref={editorRef}
                    theme={theme}
                    jsonContent=""
                    onContentChange={(content) => setHasContent(!!content)}
                />
            </div>
        </div>
    );
}

// Render the app
reactRoot.render(<App />);
  