// Selectors
const toggleGreenWidget = document.getElementById('toggle-green-widget');
const toggleNovaWidget = document.getElementById('toggle-nova-widget');
const toggleGreenNovaWidget = document.getElementById('toggle-green-nova-widget');
const togglePinkBlueNovaWidget = document.getElementById('toggle-pink-blue-nova-widget');
const toggleDisableAll = document.getElementById('toggle-disable-all');
const injectionPoint = document.getElementById('widget-injection-point');

// State
let isGreenWidgetActive = false;
let isNovaWidgetActive = false;
let isGreenNovaWidgetActive = false;
let isPinkBlueNovaWidgetActive = false;

// Fade in animations on scroll/load
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('appear');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
});

// Generator Logic

/**
 * Injects the complete Green Widget snippet
 */
async function injectGreenWidget() {
    try {
        // Fetch the combined snippet we created earlier
        const response = await fetch('widget/voice-widget-snippet.html');
        if (!response.ok) throw new Error("Failed to load snippet");

        const html = await response.text();

        // We have to extract script tags and append them manually for them to execute when injected via innerHTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // Remove old injection if any
        injectionPoint.innerHTML = '';

        // Append all non-script elements
        Array.from(tempDiv.childNodes).forEach(node => {
            if (node.tagName !== 'SCRIPT') {
                injectionPoint.appendChild(node.cloneNode(true));
            }
        });

        // Find and re-create script tags so the browser executes them
        const scripts = tempDiv.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            const newScript = document.createElement('script');
            if (scripts[i].src) {
                newScript.src = scripts[i].src;
            } else {
                newScript.textContent = scripts[i].textContent;
            }
            injectionPoint.appendChild(newScript);
        }

    } catch (error) {
        console.error("Error injecting widget:", error);
        alert("Could not load the widget snippet. Make sure you are running a local server.");
        toggleGreenWidget.checked = false;
    }
}

/**
 * Injects the complete Nova Widget snippet
 */
async function injectNovaWidget() {
    try {
        const response = await fetch('widget/nova-widget-snippet.html');
        if (!response.ok) throw new Error("Failed to load snippet");

        const html = await response.text();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        injectionPoint.innerHTML = '';

        Array.from(tempDiv.childNodes).forEach(node => {
            if (node.tagName !== 'SCRIPT') {
                injectionPoint.appendChild(node.cloneNode(true));
            }
        });

        const scripts = tempDiv.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            const newScript = document.createElement('script');
            if (scripts[i].src) {
                newScript.src = scripts[i].src;
            } else {
                newScript.textContent = scripts[i].textContent;
            }
            injectionPoint.appendChild(newScript);
        }

    } catch (error) {
        console.error("Error injecting widget:", error);
        alert("Could not load the widget snippet. Make sure you are running a local server.");
        toggleNovaWidget.checked = false;
    }
}

/**
 * Injects the complete Green Nova Widget snippet
 */
async function injectGreenNovaWidget() {
    try {
        const response = await fetch('widget/green-nova-widget-snippet.html');
        if (!response.ok) throw new Error("Failed to load snippet");

        const html = await response.text();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        injectionPoint.innerHTML = '';

        Array.from(tempDiv.childNodes).forEach(node => {
            if (node.tagName !== 'SCRIPT') {
                injectionPoint.appendChild(node.cloneNode(true));
            }
        });

        const scripts = tempDiv.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            const newScript = document.createElement('script');
            if (scripts[i].src) {
                newScript.src = scripts[i].src;
            } else {
                newScript.textContent = scripts[i].textContent;
            }
            injectionPoint.appendChild(newScript);
        }

    } catch (error) {
        console.error("Error injecting widget:", error);
        alert("Could not load the widget snippet. Make sure you are running a local server.");
        toggleGreenNovaWidget.checked = false;
    }
}

/**
 * Injects the complete Pink Blue Nova Widget snippet
 */
async function injectPinkBlueNovaWidget() {
    try {
        const response = await fetch('widget/pink-blue-nova-widget-snippet.html');
        if (!response.ok) throw new Error("Failed to load snippet");

        const html = await response.text();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        injectionPoint.innerHTML = '';

        Array.from(tempDiv.childNodes).forEach(node => {
            if (node.tagName !== 'SCRIPT') {
                injectionPoint.appendChild(node.cloneNode(true));
            }
        });

        const scripts = tempDiv.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            const newScript = document.createElement('script');
            if (scripts[i].src) {
                newScript.src = scripts[i].src;
            } else {
                newScript.textContent = scripts[i].textContent;
            }
            injectionPoint.appendChild(newScript);
        }

    } catch (error) {
        console.error("Error injecting widget:", error);
        alert("Could not load the widget snippet. Make sure you are running a local server.");
        togglePinkBlueNovaWidget.checked = false;
    }
}

/**
 * Removes all widgets from the DOM and stops any active calls.
 */
function removeAllWidgets() {
    // If the LiveKit room disconnect was bound to window or we have access to it, 
    // we would trigger it here. Since the widget encapsulates it, destroying the DOM
    // might leave lingering audio. A hard reload is safest for a quick "disable all" sandbox reset,
    // or we can just empty the container and hope the garbage collector catches it.

    // Empty the injection point
    injectionPoint.innerHTML = '';

    // Clean up any stray audio elements from LiveKit
    document.querySelectorAll('[data-voiceai-audio]').forEach(el => el.remove());

    // Uncheck other toggles
    toggleGreenWidget.checked = false;
    toggleNovaWidget.checked = false;
    toggleGreenNovaWidget.checked = false;
    togglePinkBlueNovaWidget.checked = false;
    isGreenWidgetActive = false;
    isNovaWidgetActive = false;
    isGreenNovaWidgetActive = false;
    isPinkBlueNovaWidgetActive = false;
}

// Event Listeners
toggleGreenWidget.addEventListener('change', (e) => {
    if (e.target.checked) {
        // Uncheck others
        toggleDisableAll.checked = false;
        if (toggleNovaWidget.checked) toggleNovaWidget.click(); // Turn off Nova safely
        if (toggleGreenNovaWidget.checked) toggleGreenNovaWidget.click(); // Turn off Green Nova safely
        if (togglePinkBlueNovaWidget.checked) togglePinkBlueNovaWidget.click(); // Turn off Pink Blue Nova safely

        // Inject
        isGreenWidgetActive = true;
        injectGreenWidget();
    } else {
        // Remove
        isGreenWidgetActive = false;
        removeAllWidgets();
    }
});

toggleNovaWidget.addEventListener('change', (e) => {
    if (e.target.checked) {
        // Uncheck others
        toggleDisableAll.checked = false;
        if (toggleGreenWidget.checked) toggleGreenWidget.click(); // Turn off Green safely
        if (toggleGreenNovaWidget.checked) toggleGreenNovaWidget.click(); // Turn off Green Nova safely
        if (togglePinkBlueNovaWidget.checked) togglePinkBlueNovaWidget.click(); // Turn off Pink Blue Nova safely

        // Inject
        isNovaWidgetActive = true;
        injectNovaWidget();
    } else {
        // Remove
        isNovaWidgetActive = false;
        removeAllWidgets();
    }
});

toggleGreenNovaWidget.addEventListener('change', (e) => {
    if (e.target.checked) {
        // Uncheck others
        toggleDisableAll.checked = false;
        if (toggleGreenWidget.checked) toggleGreenWidget.click(); // Turn off Green safely
        if (toggleNovaWidget.checked) toggleNovaWidget.click(); // Turn off Nova safely
        if (togglePinkBlueNovaWidget.checked) togglePinkBlueNovaWidget.click(); // Turn off Pink Blue Nova safely

        // Inject
        isGreenNovaWidgetActive = true;
        injectGreenNovaWidget();
    } else {
        // Remove
        isGreenNovaWidgetActive = false;
        removeAllWidgets();
    }
});

togglePinkBlueNovaWidget.addEventListener('change', (e) => {
    if (e.target.checked) {
        // Uncheck others
        toggleDisableAll.checked = false;
        if (toggleGreenWidget.checked) toggleGreenWidget.click(); // Turn off Green safely
        if (toggleNovaWidget.checked) toggleNovaWidget.click(); // Turn off Nova safely
        if (toggleGreenNovaWidget.checked) toggleGreenNovaWidget.click(); // Turn off Green Nova safely

        // Inject
        isPinkBlueNovaWidgetActive = true;
        injectPinkBlueNovaWidget();
    } else {
        // Remove
        isPinkBlueNovaWidgetActive = false;
        removeAllWidgets();
    }
});

toggleDisableAll.addEventListener('change', (e) => {
    if (e.target.checked) {
        removeAllWidgets();

        // Auto-uncheck itself after a moment since it's an action, not a state
        setTimeout(() => {
            e.target.checked = false;
        }, 800);
    }
});

// --- Snippet Copier & Toast Logic ---
const toast = document.getElementById('toast-notification');
let toastTimeout;

async function copySnippetToClipboard(snippetUrl) {
    try {
        const response = await fetch(snippetUrl);
        if (!response.ok) throw new Error("Network response was not ok");
        const text = await response.text();

        await navigator.clipboard.writeText(text);
        showToast();
    } catch (error) {
        console.error("Failed to copy snippet:", error);
        alert("Failed to copy snippet. Please ensure you are running a local server.");
    }
}

function showToast() {
    toast.classList.remove('hidden');
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.classList.add('hidden'), 300); // Wait for transition
    }, 3000);
}

// Button Listeners
document.getElementById('copy-green-btn').addEventListener('click', () => {
    copySnippetToClipboard('widget/voice-widget-snippet.html');
});

document.getElementById('copy-nova-btn').addEventListener('click', () => {
    copySnippetToClipboard('widget/nova-widget-snippet.html');
});

document.getElementById('copy-green-nova-btn').addEventListener('click', () => {
    copySnippetToClipboard('widget/green-nova-widget-snippet.html');
});

document.getElementById('copy-pink-blue-nova-btn').addEventListener('click', () => {
    copySnippetToClipboard('widget/pink-blue-nova-widget-snippet.html');
});
