document.addEventListener('DOMContentLoaded', () => {

    const toggleInPageOrb = document.getElementById('toggle-in-page-orb');
    const toggleInPageOrbGreen = document.getElementById('toggle-in-page-orb-green');
    const toggleInPageOrbPB = document.getElementById('toggle-in-page-orb-pb');
    const toggleMeshPurple = document.getElementById('toggle-mesh-purple');
    const toggleMeshBlue = document.getElementById('toggle-mesh-blue');
    const toggleMeshGreen = document.getElementById('toggle-mesh-green');
    const injectionPoint = document.getElementById('in-page-injection-point');
    const copyBtn = document.getElementById('copy-in-page-btn');
    const copyGreenBtn = document.getElementById('copy-in-page-green-btn');
    const copyPBBtn = document.getElementById('copy-in-page-pb-btn');
    const copyMeshPurpleBtn = document.getElementById('copy-mesh-purple-btn');
    const copyMeshBlueBtn = document.getElementById('copy-mesh-blue-btn');
    const copyMeshGreenBtn = document.getElementById('copy-mesh-green-btn');
    const toast = document.getElementById('toast-notification');
    let toastTimeout;

    // Remove logic
    function removeWidget() {
        injectionPoint.innerHTML = '';
        document.querySelectorAll('[data-voiceai-audio="in-page-widget"]').forEach(el => el.remove());
        document.querySelectorAll('[data-voiceai-audio="in-page-widget-green"]').forEach(el => el.remove());
        document.querySelectorAll('[data-voiceai-audio="in-page-widget-pb"]').forEach(el => el.remove());
        document.querySelectorAll('[data-voiceai-audio="in-page-widget-mesh"]').forEach(el => el.remove());
    }

    // Inject logic
    async function executeScriptsInOrder(sourceRoot, mountNode) {
        const scripts = Array.from(sourceRoot.getElementsByTagName('script'));

        for (const originalScript of scripts) {
            const newScript = document.createElement('script');

            // Preserve common attributes in case snippets add them later.
            for (const attr of originalScript.attributes) {
                newScript.setAttribute(attr.name, attr.value);
            }

            if (originalScript.src) {
                await new Promise((resolve, reject) => {
                    newScript.onload = resolve;
                    newScript.onerror = () => reject(new Error(`Failed to load script: ${originalScript.src}`));
                    mountNode.appendChild(newScript);
                });
            } else {
                newScript.textContent = originalScript.textContent;
                mountNode.appendChild(newScript);
            }
        }
    }

    async function injectWidget(snippetPath, toggleElement) {
        removeWidget(); // Ensure clean slate before injecting

        try {
            const response = await fetch(snippetPath);
            if (!response.ok) throw new Error("Failed to load snippet");

            const html = await response.text();

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            // Inject DOM
            Array.from(tempDiv.childNodes).forEach(node => {
                if (node.tagName !== 'SCRIPT') {
                    injectionPoint.appendChild(node.cloneNode(true));
                }
            });

            // Re-eval scripts in order. This is critical for mesh snippets that depend on
            // external CDN scripts (Three.js / LiveKit) before the inline init script runs.
            await executeScriptsInOrder(tempDiv, injectionPoint);

        } catch (error) {
            console.error("Error injecting widget:", error);
            alert("Could not load the widget snippet. Make sure you are running a local server.");
            toggleElement.checked = false;
        }
    }

    // Extracted Toast logic
    function showToast() {
        toast.classList.remove('hidden');
        toast.classList.add('show');

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.classList.add('hidden'), 300);
        }, 3000);
    }

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

    // Helper function for 6-way mutual exclusivity
    function uncheckAllExcept(activeToggle) {
        const allToggles = [
            toggleInPageOrb, toggleInPageOrbGreen, toggleInPageOrbPB,
            toggleMeshPurple, toggleMeshBlue, toggleMeshGreen
        ];
        allToggles.forEach(t => {
            if (t && t !== activeToggle) t.checked = false;
        });
    }

    // Listeners for Standard Orb
    toggleInPageOrb.addEventListener('change', (e) => {
        if (e.target.checked) {
            uncheckAllExcept(toggleInPageOrb);
            injectWidget('widget/in-page-orb-snippet.html', toggleInPageOrb);
        } else {
            removeWidget();
        }
    });

    copyBtn.addEventListener('click', () => {
        copySnippetToClipboard('widget/in-page-orb-snippet.html');
    });

    // Listeners for Green Orb
    toggleInPageOrbGreen.addEventListener('change', (e) => {
        if (e.target.checked) {
            uncheckAllExcept(toggleInPageOrbGreen);
            injectWidget('widget/in-page-orb-green-snippet.html', toggleInPageOrbGreen);
        } else {
            removeWidget();
        }
    });

    copyGreenBtn.addEventListener('click', () => {
        copySnippetToClipboard('widget/in-page-orb-green-snippet.html');
    });

    // Listeners for Pink Blue Orb
    toggleInPageOrbPB.addEventListener('change', (e) => {
        if (e.target.checked) {
            uncheckAllExcept(toggleInPageOrbPB);
            injectWidget('widget/in-page-orb-pink-blue-snippet.html', toggleInPageOrbPB);
        } else {
            removeWidget();
        }
    });

    copyPBBtn.addEventListener('click', () => {
        copySnippetToClipboard('widget/in-page-orb-pink-blue-snippet.html');
    });

    // Listeners for Purple Mesh Orb
    toggleMeshPurple.addEventListener('change', (e) => {
        if (e.target.checked) {
            uncheckAllExcept(toggleMeshPurple);
            injectWidget('widget/in-page-orb-mesh-purple-snippet.html', toggleMeshPurple);
        } else {
            removeWidget();
        }
    });

    copyMeshPurpleBtn.addEventListener('click', () => {
        copySnippetToClipboard('widget/in-page-orb-mesh-purple-snippet.html');
    });

    // Listeners for Blue Mesh Orb
    toggleMeshBlue.addEventListener('change', (e) => {
        if (e.target.checked) {
            uncheckAllExcept(toggleMeshBlue);
            injectWidget('widget/in-page-orb-mesh-blue-snippet.html', toggleMeshBlue);
        } else {
            removeWidget();
        }
    });

    copyMeshBlueBtn.addEventListener('click', () => {
        copySnippetToClipboard('widget/in-page-orb-mesh-blue-snippet.html');
    });

    // Listeners for Green Mesh Orb
    toggleMeshGreen.addEventListener('change', (e) => {
        if (e.target.checked) {
            uncheckAllExcept(toggleMeshGreen);
            injectWidget('widget/in-page-orb-mesh-green-snippet.html', toggleMeshGreen);
        } else {
            removeWidget();
        }
    });

    copyMeshGreenBtn.addEventListener('click', () => {
        copySnippetToClipboard('widget/in-page-orb-mesh-green-snippet.html');
    });
});
