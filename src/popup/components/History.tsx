import React from 'react';
import { FiX, FiTrash2, FiClock } from 'react-icons/fi';

interface HistoryProps {
    items: Array<{ content: string; timestamp: number }>;
    onSelect: (content: string) => void;
    onClose: () => void;
    onClear: () => void;
}

const History: React.FC<HistoryProps> = ({ items, onSelect, onClose, onClear }) => {
    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    const formatPreview = (content: string) => {
        if (content.length > 150) {
            return content.substring(0, 150) + '...';
        }
        return content;
    };

    return (
        <div className="history-panel fade-in">
            <div className="history-header">
                <div className="history-title">
                    <FiClock size={18} />
                    <span>History</span>
                </div>
                <div className="history-actions">
                    <button 
                        className="button button-secondary"
                        onClick={onClear}
                        disabled={items.length === 0}
                    >
                        <FiTrash2 size={16} />
                        <span>Clear All</span>
                    </button>
                    <button 
                        className="button button-icon"
                        onClick={onClose}
                        aria-label="Close history"
                    >
                        <FiX size={18} />
                    </button>
                </div>
            </div>

            <div className="history-content">
                {items.length === 0 ? (
                    <div className="history-empty">
                        <FiClock size={24} />
                        <p>No history items yet</p>
                    </div>
                ) : (
                    <div className="history-list">
                        {items.map(item => (
                            <div
                                key={item.timestamp}
                                className="history-item"
                                onClick={() => onSelect(item.content)}
                            >
                                <div className="history-item-header">
                                    <span className="history-item-date">
                                        {formatDate(item.timestamp)}
                                    </span>
                                </div>
                                <div className="history-item-preview">
                                    {formatPreview(item.content)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default History; 