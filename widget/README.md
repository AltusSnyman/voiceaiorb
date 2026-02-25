# Animated Voice AI Widget

This is a standalone, animated Voice AI Widget powered by LiveKit and LeadConnector, featuring a sleek liquid glass orb aesthetic that transforms smoothly as it connects.

It consists of just three files and operates completely independently of any specific framework—it requires only vanilla HTML, CSS, and JS.

## Files Included:
- `voice-widget.html`: The markup structure for the animated orb and the floating CTA.
- `voice-widget.css`: The styling and CSS animations for the floating liquid glass orb, the Siri-wave glow, and the bouncy CTA bubble.
- `voice-widget.js`: The Javascript logic that handles the LeadConnector API authentication, the LiveKit WebRTC connection, and the dynamic CSS state classes.  

## How to use it on ANY website:

**1. Copy the files:**
Move the `widget` folder somewhere inside your website's public file directory.

**2. Link the CSS in your `<head>`:**
```html
<link rel="stylesheet" href="path/to/widget/voice-widget.css">
```

**3. Add the HTML and JS at the bottom of the page, right before the closing `</body>` tag:**
You can just copy the contents of `voice-widget.html` and paste it there. Then add the script and initialization:

```html
<!-- Voice AI Widget HTML goes here -->
<div id="voiceai-widget-container" class="voiceai-widget-container">
   ...
</div>

<!-- Load the widget logic -->
<script src="path/to/widget/voice-widget.js"></script>

<!-- Initialize with your specific Agent keys -->
<script>
    initVoiceWidget({
        locationId: 'YOUR_LOCATION_ID_HERE',
        widgetId: 'YOUR_WIDGET_ID_HERE',
        voiceAiConfigId: 'YOUR_AGENT_ID_HERE'
    });
</script>
```

That's it! The widget will stick to the bottom right of the page, automatically load the required LiveKit dependencies silently, and handle the entire call lifecycle.
