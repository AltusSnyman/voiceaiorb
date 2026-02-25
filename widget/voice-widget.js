// voice-widget.js
function initVoiceWidget(configOptions) {
    // Load LiveKit SDK if not already loaded
    if (typeof window.LivekitClient === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/livekit-client@1.15.4/dist/livekit-client.umd.min.js';
        script.defer = true;
        document.head.appendChild(script);

        script.onload = () => setupVoiceButton(configOptions);
        script.onerror = () => console.error('Voice AI Widget: Failed to load LiveKit SDK');
    } else {
        setupVoiceButton(configOptions);
    }
}

function setupVoiceButton(userConfig) {
    const container = document.getElementById('voiceai-widget-container');
    if (!container) {
        console.error('Voice AI Widget: HTML container missing on page.');
        return;
    }

    // Default configurations merged with user provided config
    const CONFIG = {
        locationId: '',
        widgetId: '',
        voiceAiConfigId: '', // Assume this is Agent ID?
        apiEndpoint: 'https://services.leadconnectorhq.com/chat-widget/public/start-voice-ai-call/',
        livekitUrl: 'wss://retell-ai-4ihahnq7.livekit.cloud',
        ...userConfig
    };

    let room = null;
    let isCallActive = false;

    const callButton = document.getElementById('voiceai-btn');
    const buttonText = callButton.querySelector('.voiceai-text');
    const statusDiv = document.getElementById('voiceai-status');
    const icon = callButton.querySelector('.voiceai-icon');

    // Helpers
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function generateMongoId() {
        const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
        const random = Array.from({ length: 16 }, () =>
            Math.floor(Math.random() * 16).toString(16)
        ).join('');
        return timestamp + random;
    }

    function generateContactId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 20; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = 'voiceai-status visible ' + (type || '');
        setTimeout(() => {
            statusDiv.classList.remove('visible');
        }, 4000);
    }

    async function startCall() {
        if (!CONFIG.locationId || !CONFIG.widgetId || !CONFIG.voiceAiConfigId) {
            showStatus('Configuration Error. Missing IDs.', 'error');
            return;
        }

        callButton.disabled = true;
        callButton.classList.add('loading');
        showStatus('Agent Connecting...', '');

        try {
            const sessionId = generateUUID();
            const payload = {
                contactId: generateContactId(),
                callId: generateMongoId(),
                widgetId: CONFIG.widgetId,
                locationId: CONFIG.locationId,
                sessionId: sessionId,
                sessionFingerprint: generateUUID(),
                eventData: {
                    source: 'direct',
                    referrer: document.referrer || '',
                    keyword: '',
                    adSource: '',
                    url_params: {},
                    page: {
                        url: window.location.href,
                        title: document.title
                    },
                    timestamp: Date.now(),
                    campaign: '',
                    contactSessionIds: {
                        ids: [sessionId]
                    },
                    type: 'page-visit',
                    pageVisitType: 'text-widget',
                    domain: window.location.hostname,
                    version: 'v3',
                    parentId: '',
                    parentName: '',
                    fingerprint: null,
                    documentURL: window.location.href
                }
            };

            const response = await fetch(CONFIG.apiEndpoint + CONFIG.voiceAiConfigId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Server connection failed (' + response.status + ')');
            }

            const data = await response.json();

            room = new window.LivekitClient.Room({
                adaptiveStream: true,
                dynacast: true,
                audioCaptureDefaults: {
                    autoGainControl: true,
                    echoCancellation: true,
                    noiseSuppression: true
                }
            });

            room.on(window.LivekitClient.RoomEvent.TrackSubscribed, (track, publication, participant) => {
                if (track.kind === window.LivekitClient.Track.Kind.Audio) {
                    const audioElement = track.attach();
                    audioElement.setAttribute('data-voiceai-audio', 'voiceai-widget');
                    document.body.appendChild(audioElement);
                }
            });

            room.on(window.LivekitClient.RoomEvent.Disconnected, () => {
                if (isCallActive) endCall();
            });

            await room.connect(CONFIG.livekitUrl, data.accessToken);
            await room.localParticipant.setMicrophoneEnabled(true);

            isCallActive = true;
            callButton.classList.remove('loading');
            callButton.classList.add('active'); // Applies the red "End Call" styling instantly
            if (buttonText) buttonText.textContent = 'End Call';
            callButton.disabled = false;
            showStatus('Connected successfully', 'success');

        } catch (error) {
            console.error('Widget Error starting call:', error);
            showStatus('Connection failed: ' + error.message, 'error');
            callButton.classList.remove('loading');
            callButton.disabled = false;
        }
    }

    async function endCall() {
        callButton.disabled = true;
        showStatus('Disconnecting...', '');

        try {
            if (room) {
                await room.disconnect();
                room = null;
            }

            // Clean up injected audio element tracking
            document.querySelectorAll('[data-voiceai-audio="voiceai-widget"]').forEach(el => el.remove());

            isCallActive = false;
            callButton.classList.remove('active');
            if (buttonText) buttonText.textContent = 'Connect Agent';
            callButton.disabled = false;
            showStatus('Call ended', '');

        } catch (error) {
            console.error('Widget Error ending call:', error);
            callButton.disabled = false;
        }
    }

    callButton.addEventListener('click', () => {
        if (isCallActive) {
            endCall();
        } else {
            startCall();
        }
    });

    window.addEventListener('beforeunload', () => {
        if (room && isCallActive) room.disconnect();
    });

    console.log("Voice AI Widget initialized.");
}
