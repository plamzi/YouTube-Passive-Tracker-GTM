<h2>YouTube Passive Tracker for GTM</h2>
<h4>Track YouTube video content on a site with Google Tag Manager in a way that doesn't conflict with the site's own usage of the YouTube API.</h4>

<h2>Description:</h2>

Use this compact custom script for Google Tag Manager in situations where the built-in GTM YouTube video tracking logic falls short.

The baked-in GTM YouTube triggers are currently not be able to handle videos constructed on user interaction (i. e. long after initial page load). In another set of cases, the site developers' desire to control videos via the YouTube API may conflict with (or blow away) the GTM tracking listeners. Such conflicts may cause total tracking eclipse, or worse, timing-based intermittent lack of tracking that is tedious to resolve.

This script circumvents any potential conflicts.

<h2>How It Works:</h2>

This script intercepts cross-frame postMessage events coming from YouTube video iframes, interprets them, and places rich-metadata tracking events into the GTM dataLayer. The only requirement is for the YouTube videos to have the enablejsapi=1 parameter. Beyond that, the website is in full control of when and how to load the YouTube API script and when and how to initialize the videos.

<h3>Caveats:</h3>

In the unlikely event of YouTube changing the structure of its cross-frame API messaging, this script will need to be adjusted.