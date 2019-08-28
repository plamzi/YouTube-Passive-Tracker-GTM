/* YouTube Passive Tracker for Google Tag Manager v1.0.0 */

/* https://www.github.com/plamzi/youtube-passive-tracker-gtm */

  (function($) {

    var config = {
		event_name: 'YouTube',
		event_category: 'Video',
		tracking_interval: 4 /* fire % progress (4 - 1) times per video, so at 25%, 50%, 75% (100% handled by 'Video Complete') */
    };
    
    var mem = {};

    var onPlayerStateChange = function(e) {
        
     	onPlayerPercent(e.target);
    }

    var onPlayerPercent = function(e) {
      
      	var video_data = e.getVideoData();
      	var title = video_data.title;
        var state = e.getPlayerState();
        var duration = e.getDuration();
      	var current = e.getCurrentTime();
      
        if (state == YT.PlayerState.ENDED)
          return dataLayer.push({
            	event: config.event_name,
            	eventCategory: config.event_category,
                eventAction: "Video Complete: " + video_data.title,
                eventLabel: video_data.title,
          });
                
        if (state == YT.PlayerState.PLAYING) {
          
          var t = duration - current <= 1.5 ? 1 : (Math.floor(current / duration * config.tracking_interval) / config.tracking_interval).toFixed(2);    
     
          if (!mem[title] || t > mem[title]) {
                
                mem[title] = t;
                var percent = t * 100;

            	if (percent == 0)
                  dataLayer.push({
                      event: config.event_name,
                      eventCategory: config.event_category,
                      eventAction: "Video Start: " + video_data.title,
                      eventLabel: video_data.title,
                  });

      		if (percent > 0 && percent < 100)
                  dataLayer.push({
                      event: config.event_name,
                      eventCategory: config.event_category,
                      eventAction: "Video Progress: " + percent + "%",
                      eventLabel: video_data.title
                  });
            }
        }
    }

  	var prep = function(evt) {
  
      	if (!evt.origin || evt.origin.indexOf("youtube.com") == -1)
          return;
      
      	if (!evt.data)
          return;
      
      	var data = JSON.parse(evt.data);
      	
      	if (!data.info)
          return;
      
      	data = data.info;
      
        if (typeof data.playerState != 'undefined') {
          	
          	mem.playerState = data.playerState;
          
          	if (data.playerState == YT.PlayerState.CUED)
          		delete mem[data.videoData.title]; /* forget playback progress on cue events */
        }
      
      	if (data.duration)
          	mem.duration = data.duration;
        
      	if (data.videoData)
          	mem.videoData = data.videoData;
      
      	var e = {
         	data: mem.playerState,
          	target: {
             	getVideoData: function() {
                  	return mem.videoData;
                },
              	getPlayerState: function() {
                  	return mem.playerState;
                },
              	getDuration: function() {
                  	return mem.duration;
                },
              	getCurrentTime: function() {
                  	return data.currentTime;
                }
            }
        }
      	onPlayerStateChange(e);
    };
  
  	var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
	var eventer = window[eventMethod];
	var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
		
	eventer(messageEvent, prep, false);
  
  })();