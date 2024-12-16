import React from 'react';
import { FiSun, FiMoon, FiCopy, FiTrash2, FiCode, FiMinimize2, FiRefreshCw, FiClock } from 'react-icons/fi';
import Tooltip from './Tooltip';

interface SidebarProps {
    theme: 'light' | 'dark';
    onThemeChange: (isDark: boolean) => void;
    onFormat: () => void;
    onMinify: () => void;
    onStringify: () => void;
    onCopy: () => void;
    onClear: () => void;
    onHistoryClick: () => void;
    showHistory: boolean;
    hasContent: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
    theme,
    onThemeChange,
    onFormat,
    onMinify,
    onStringify,
    onCopy,
    onClear,
    onHistoryClick,
    showHistory,
    hasContent
}) => {
    return (
        <div className="sidebar">
            <div className="sidebar-group">
                <Tooltip text={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} position="right">
                    <button
                        className="sidebar-button"
                        onClick={() => onThemeChange(theme === 'light')}
                        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
                    >
                        {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
                    </button>
                </Tooltip>
          
                <Tooltip text="Format JSON" position="right">
                    <button
                        className="sidebar-button"
                        onClick={onFormat}
                        disabled={!hasContent}
                    >
                        <FiCode size={20} />
                    </button>
                </Tooltip>

                <Tooltip text="Minify JSON" position="right">
                    <button
                        className="sidebar-button"
                        onClick={onMinify}
                        disabled={!hasContent}
                    >
                        <FiMinimize2 size={20} />
                    </button>
                </Tooltip>

                <Tooltip text="Convert to String" position="right">
                    <button
                        className="sidebar-button"
                        onClick={onStringify}
                        disabled={!hasContent}
                    >
                        <FiRefreshCw size={20} />
                    </button>
                </Tooltip>
        
                <Tooltip text="Copy to Clipboard" position="right">
                    <button
                        className="sidebar-button"
                        onClick={onCopy}
                        disabled={!hasContent}
                    >
                        <FiCopy size={20} />
                    </button>
                </Tooltip>

                <Tooltip text="Clear Content" position="right">
                    <button
                        className="sidebar-button"
                        onClick={onClear}
                        disabled={!hasContent}
                    >
                        <FiTrash2 size={20} />
                    </button>
                </Tooltip>

                <Tooltip text="History" position="right">
                    <button
                        className={`sidebar-button ${showHistory ? 'active' : ''}`}
                        onClick={onHistoryClick}
                    >
                        <FiClock size={20} />
                    </button>
                </Tooltip>
            </div>
        </div>
    );
};

export default Sidebar; 