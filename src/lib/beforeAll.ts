// For performance debugging
declare global {
    interface Window {
        __jsonFormatterStartTime?: number;
    }
}

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    window.__jsonFormatterStartTime = performance.now();
}

export function beforeAll() {
    // Prevent auto-formatting of JSON content
    document.documentElement.setAttribute('data-json-formatter', 'true');
    
    // Add meta viewport for mobile devices
    if (!document.querySelector('meta[name="viewport"]')) {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1';
        document.head.appendChild(meta);
    }
    
    // Set default theme based on system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
}

export {};
