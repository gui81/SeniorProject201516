var mapOfFeeds = {};
VideoFeedHelper = {
	addFeed: function(feedName, hostName){
		mapOfFeeds[feedName] = hostName;
	},
	getFeed: function(feedName){
		return mapOfFeeds[feedName];
	},
	createtButton: function(feedName, hostName){
		VideoFeedHelper.addFeed(feedName,hostName);
		var button = document.createElement('button');
		var buttonText = document.createTextNode(feedName);
     	button.appendChild(buttonText);
     	button.id = "feedButton";
     	button.class = "btn btn-default"; 
     	return button;

	}
}

Template.videoFeedSelector.events({
	'click #newFeed': function () {
     	Modal.show('videoFeedModal')
    },
    'click #feedButton': function (event) {
		var feedName = event.currentTarget.innerText;
		var hostName = VideoFeedHelper.getFeed(feedName);

		var player = document.getElementById("mpegdashplayer");
		var video = document.getElementById("videoPlayer");

		video.pause();
		
		var newVideo = video;

		//remove new video
		video.remove();

		// console.log(newVideo);
		//reset buttons
		ButtonHelper.resetButton();

		//create new video
		VideoPlayBackHelper.createVideo(newVideo, hostName);
		var playerButtons = document.getElementById("playerButtons");
	    player.appendChild(newVideo);
	    player.appendChild(playerButtons);
	    
    }
});


Template.videoFeedModal.events({
	'click #addingFeed': function () {
		var feedName;
		var hostName;
		//create default buttons
		if(VideoFeedHelper.getFeed("Default") != "http://dashas.castlabs.com/videos/files/bbb/Manifest.mpd"){
			feedName = "Default";
			hostName = "http://dashas.castlabs.com/videos/files/bbb/Manifest.mpd";
			var button = VideoFeedHelper.createtButton(feedName,hostName);
     		document.getElementById("videoFeed").appendChild(button);
     	}
     	// create button new feed button
     	feedName = document.getElementById("feedName").value;
		hostName = document.getElementById("hostName").value;
     	var button = VideoFeedHelper.createtButton(feedName,hostName);
     	document.getElementById("videoFeed").appendChild(button); 

    }
});