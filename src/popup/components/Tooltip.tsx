import React from 'react';

interface TooltipProps {
    text: string;
    position?: 'top' | 'right' | 'bottom' | 'left';
    children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, position = 'top', children }) => {
    return (
        <div className="tooltip-container">
            {children}
            <div className={`tooltip tooltip-${position}`}>
                {text}
            </div>
        </div>
    );
};

export default Tooltip; 