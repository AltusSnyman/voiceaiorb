// scripts.js

// Function to copy text to clipboard
async function copyToClipboard(text, btnElement) {
    try {
        await navigator.clipboard.writeText(text);
        showToast();

        // Button feedback
        const originalText = btnElement.innerHTML;
        btnElement.innerHTML = '✓ Copied!';
        setTimeout(() => {
            btnElement.innerHTML = originalText;
        }, 2000);
    } catch (err) {
        console.error('Failed to copy: ', err);
        alert('Failed to copy to clipboard.');
    }
}

// Function to trigger a file download
function downloadSnippet(content, filename) {
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}

const toast = document.getElementById('toast');
let toastTimeout;

function showToast() {
    if (!toast) return;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Fetch and prepare snippet
async function processSnippet(snippetPath) {
    try {
        const response = await fetch(snippetPath);
        if (!response.ok) throw new Error('Network response was not ok');
        let text = await response.text();

        // Replace the placeholders with the actual IDs
        const LOCATION_ID = 'uLevhyRG62ucd3gTWHAs';
        const WIDGET_ID = '697ac304a2eb732f7cbf529d';
        const AGENT_ID = '6986aa6dc5613d095b531aea';

        text = text.replace(/YOUR_LOCATION_ID_HERE/g, LOCATION_ID);
        text = text.replace(/YOUR_WIDGET_ID_HERE/g, WIDGET_ID);
        text = text.replace(/YOUR_AGENT_ID_HERE/g, AGENT_ID);

        return text;
    } catch (error) {
        console.error('Error fetching snippet:', error);
        return null;
    }
}

// Setup buttons for a specific snippet
function setupSnippetButtons(snippetPath, copyBtnId, downloadBtnId, downloadFileName) {
    const copyBtn = document.getElementById(copyBtnId);
    const downloadBtn = document.getElementById(downloadBtnId);

    if (copyBtn) {
        copyBtn.addEventListener('click', async function () {
            const content = await processSnippet(snippetPath);
            if (content) {
                copyToClipboard(content, this);
            }
        });
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', async function () {
            const content = await processSnippet(snippetPath);
            if (content) {
                downloadSnippet(content, downloadFileName);
            }
        });
    }
}

// Function to load and execute snippet on the page
async function renderLiveSnippet(snippetPath, containerId) {
    const text = await processSnippet(snippetPath);
    const container = document.getElementById(containerId);
    if (!container || !text) return;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;

    Array.from(tempDiv.childNodes).forEach(node => {
        if (node.tagName !== 'SCRIPT') {
            container.appendChild(node.cloneNode(true));
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
        container.appendChild(newScript);
    }
}

// Function to load snippet securely into an iframe (prevents ID conflicts)
async function renderLiveOrbIframe(snippetPath, iframeId) {
    const text = await processSnippet(snippetPath);
    const iframe = document.getElementById(iframeId);
    if (!iframe || !text) return;

    // Inject basic centering styles so the orb looks good inside the iframe
    const styleInject = '<style>body { display: flex; align-items: center; justify-content: center; height: 100%; margin: 0; overflow: hidden; background-color: transparent; color: white;} * { box-sizing: border-box; }</style>';

    // Set the source document
    iframe.srcdoc = styleInject + text;
}
