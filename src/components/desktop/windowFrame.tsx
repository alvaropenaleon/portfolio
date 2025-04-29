// src/components/Desktop/WindowFrame.tsx
// src/components/Desktop/WindowFrame.tsx
import React from 'react';

interface WindowFrameProps {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    onFocus: () => void;
    style?: React.CSSProperties;
}

export default function WindowFrame({ title, children, onClose, onFocus, style }: WindowFrameProps) {
    return (
        <div
            className="window-frame"
            style={style}
            onMouseDown={onFocus}
        >
            <div className="title-bar">
                <button className="close" onClick={onClose} />
                <div className="title">{title}</div>
            </div>
            <div className="window-content">{children}</div>
        </div>
    );
}