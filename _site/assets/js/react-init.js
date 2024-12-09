window.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');
    const container = document.getElementById('root');
    console.log('Root container:', container);
    
    if (container && window.React && window.ReactDOM) {
        console.log('Creating React root');
        const root = window.ReactDOM.createRoot(container);
        root.render(
            window.React.createElement(window.PacmanProjectShowcase)
        );
        console.log('React component rendered');
    } else {
        console.error('Required dependencies or container not found', {
            container: !!container,
            React: !!window.React,
            ReactDOM: !!window.ReactDOM
        });
    }
});