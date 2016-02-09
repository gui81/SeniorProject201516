var videos = [];
var videoModalData = [{name: "Sample Video 1", url: "http://dashas.castlabs.com/videos/files/bbb/Manifest.mpd", status: "archived"}, 
{name: "Sample Video 2", url: "http://dashas.castlabs.com/videos/files/bbb/Manifest.mpd", status: "archived"}, {name: "Sample Video 3", url: "http://dashas.castlabs.com/videos/files/bbb/Manifest.mpd", status: "archived"}]

Dashplayers = new Mongo.Collection("dashplayers");
Template.listOfVideos.helpers({
  dashplayers: function() {
    return Dashplayers.find({});
  }
});
Template.body.events({
  'submit .new-feed': function (event) {
    event.preventDefault();

      // Get value from form element
      var text = event.target.text.value;
      console.log(text);
      // Insert a task into the collection
      Dashplayers.insert({
        host: text
      });

      // Clear form
      event.target.text.value = "";
    }
  });

TilingHelper = {
  getWidthForVideo: function(w,numVideos){
    return w/numVideos;
  },
  getHeightForVideo: function(h,numVideos){
    return h/numVideos;
  },
  toggleTiling: function(playerWidth, playerHeight){
    Dashplayers.find({}).forEach(
      function (u){
        console.log(u.parentData);
        var div_id = "#draggable"+u.parentData;
        var draggable_div = document.getElementById(div_id);
        console.log(playerWidth);
        $(div_id).width(playerWidth);
        $(div_id).height(playerHeight);
        // draggable_div.width = playerWidth;
        // draggable_div.height = playerHeight;
        // console.log(draggable_div.width);

      });
  },
  addingParentData: function(parentData,url){  
    var player = Dashplayers.findOne({_id: parentData});
    Dashplayers.update({_id: parentData},
    {
      host: url,
      parentData: parentData
    });
    console.log(player);
  }

}

Template.tiling.events({
  'click #tile': function(){
    // for(var i = 0; i < videos.length; i++){
    //   $(videos[i]).remove();
    // }

    for(var i = 0; i < videos.length; i++) {
      $(videos[i]).css({
        'top':'0',
        'left':'0'
      });
      // $(videos[i]).appendTo($("#display"));
    }


    // var numVideos = Dashplayers.find().count();
    // var w = window.innerWidth;
    // var h = window.innerHeight;
    // var playerWidth = TilingHelper.getWidthForVideo(w,numVideos);
    // var playerHeight = TilingHelper.getHeightForVideo(h,numVideos);
    // TilingHelper.toggleTiling(playerWidth,playerHeight);
  }
});
Template.tiling.helpers({

});

Template.videoModal.onRendered(function() {
  var table = document.getElementById("videoTable");
  for (var i = 0; i < videoModalData.length; i++) {
    var row = table.insertRow(-1);
    var name = row.insertCell(0);
    var status = row.insertCell(1);
    var playButton = row.insertCell(2);

    name.innerHTML = videoModalData[i].name;
    status.innerHTML = videoModalData[i].status;

    var play = $(document.createElement('button'));
    play.addClass("btn btn-default");
    play.html("Play");

    url = videoModalData[i].url;
    play.click(function() {
      Dashplayers.insert({
         host: url
      });
    })

    play.appendTo(playButton);



  }
});

Template.dashplayer.helpers({

});
Template.dashplayer.onRendered(function () {
  var span_id = "span"+Template.parentData(0)._id;
  var video_id = "videoPlayer"+Template.parentData(0)._id;
    var url = document.getElementById(span_id).innerText;  //$( span_id + ' span').text();
    
    // $("#videoPlayer"+Template.parentData(0)._id).ready(function() {
      var video = document.getElementById(video_id);

        //play-pause
        var playButton = document.createElement("BUTTON");        // Create a <button> element
        var t = document.createTextNode("ll");       // Create a text node
        playButton.appendChild(t);                
        playButton.class = "btn btn-default";
        playButton.id = "play-pause"+ Template.parentData(0)._id;
        playButton.addEventListener("click", function() {
          if (video.paused == true) {
            // Play the video
            video.play();

            // Update the button text to 'Pause'
            playButton.innerHTML = "ll";
          } else {
            // Pause the video
            video.pause();

            // Update the button text to 'Play'
            playButton.innerHTML = "►";
          }
        });
        //rewind
        var rewindButton = document.createElement("BUTTON");        // Create a <button> element
        var t = document.createTextNode("<<");       // Create a text node
        rewindButton.appendChild(t);                
        rewindButton.class = "btn btn-default";
        rewindButton.id = "rewind"+ Template.parentData(0)._id;
        var rwinterval;
        rewindButton.addEventListener('mousedown',function(e) {
         rwinterval = setInterval(function() {
          if(video.currentTime == 0){
           clearInterval(rwinterval);
           video.pause();
         }
         else{
           video.currentTime += -1.2;
         }
       },360);
       });
        rewindButton.addEventListener('mouseup',function(e) {
         clearInterval(rwinterval);
       });
        rewindButton.addEventListener('mouseout',function(e) {
         clearInterval(rwinterval);
       });
        //skip backwards
        var skipBackButton = document.createElement("BUTTON");        // Create a <button> element
        var t = document.createTextNode("|<");       // Create a text node
        skipBackButton.appendChild(t);                
        skipBackButton.class = "btn btn-default";
        skipBackButton.id = "skipBack"+ Template.parentData(0)._id;
        skipBackButton.addEventListener("click", function() {
          video.currentTime -= 1;
        });
        //skip forward
        var skipForwardButton = document.createElement("BUTTON");        // Create a <button> element
        var t = document.createTextNode(">|");       // Create a text node
        skipForwardButton.appendChild(t);                
        skipForwardButton.class = "btn btn-default";
        skipForwardButton.id = "skipForward"+ Template.parentData(0)._id;
        skipForwardButton.addEventListener("click", function() {
          video.currentTime += 1;
        });
        //fast forward
        var fastForwardButton = document.createElement("BUTTON");        // Create a <button> element
        var t = document.createTextNode(">>");       // Create a text node
        fastForwardButton.appendChild(t);                
        fastForwardButton.class = "btn btn-default";
        fastForwardButton.id = "fastForward"+ Template.parentData(0)._id;
        var ffinterval;
        fastForwardButton.addEventListener('mousedown',function(e) {
         ffinterval = setInterval(function() {
          video.currentTime += 1.2;
        },360);
       });
        fastForwardButton.addEventListener('mouseup',function(e) {
         clearInterval(ffinterval);
       });
        fastForwardButton.addEventListener('mouseout',function(e) {
         clearInterval(ffinterval);
       });
        //full screen
        var fullScreenButton = document.createElement("BUTTON");        // Create a <button> element
        var t = document.createTextNode("Full Screen");       // Create a text node
        fullScreenButton.appendChild(t);                
        fullScreenButton.class = "btn btn-default";
        fullScreenButton.id = "fullScreen"+ Template.parentData(0)._id;
        fullScreenButton.addEventListener("click", function() {
          if (video.requestFullscreen) {
            video.requestFullscreen();
          } else if (video.mozRequestFullScreen) {
            video.mozRequestFullScreen(); // Firefox
          } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen(); // Chrome and Safari
          }
        });
        //seekbar
        var seekBar = document.createElement("INPUT");
        seekBar.style.width = "300px";
        seekBar.id = "seekbar"+Template.parentData(0)._id;
        seekBar.type = "range";
        seekBar.value =0;
        seekBar.style.display="inline-block";
        // $("#seekbar"+Template.parentData(0)._id).css({"max-width": "360px"});
        // Event listener for the seek bar
        seekBar.addEventListener("change", function() {
          // Calculate the new time
          var time = video.duration * (seekBar.value / 100);

          // Update the video time
          video.currentTime = time;
        });

        
        // Update the seek bar as the video plays
        video.addEventListener("timeupdate", function() {
          // Calculate the slider value
          var value = (100 / video.duration) * video.currentTime;

          // Update the slider value
          seekBar.value = value;
        });

        // Pause the video when the seek handle is being dragged
        seekBar.addEventListener("mousedown", function() {
          video.pause();
        });

        // Play the video when the seek handle is dropped
        seekBar.addEventListener("mouseup", function() {
          video.play();
        });
        //volume bar
        var volumeBar = document.createElement("INPUT");
        volumeBar.style.width = "60px";
        volumeBar.id = "volumeBar"+Template.parentData(0)._id;
        volumeBar.type = "range";
        volumeBar.min = 0;
        volumeBar.value = 1;
        volumeBar.max =1;
        volumeBar.step = 0.1;
        volumeBar.style.display = "inline-block";
        // $("#volumeBar"+Template.parentData(0)._id).css({"max-width": "60px"});
        // Event listener for the volume bar
        volumeBar.addEventListener("change", function() {
          // Update the video volume
          video.volume = volumeBar.value;
        });

        

        var buttonList = document.getElementById("playerButtons"+Template.parentData(0)._id);
        //Appending all buttons
        buttonList.appendChild(skipBackButton);
        buttonList.appendChild(rewindButton);
        buttonList.appendChild(playButton);
        buttonList.appendChild(fastForwardButton);
        buttonList.appendChild(skipForwardButton);
        buttonList.appendChild(seekBar);
        buttonList.appendChild(fullScreenButton);
        buttonList.appendChild(volumeBar);
        
		//adding something visible to the resizer
		var resizeId = "resizer"+Template.parentData(0)._id;
		var resizerBox = document.getElementById(resizeId);
		
		
    $("#playerButtons"+Template.parentData(0)._id).css({
      "position": "absolute",
      "z-index": 1,
      "bottom": 0,
      "left": 0,
      "right": 0,
      "padding": "5px",
      "opacity": 0,
      "-webkit-transition": "opacity .3s",
      "-moz-transition": "opacity .3s",
      "-o-transition": "opacity .3s",
      "-ms-transition": "opacity .3s",
      "transition": "opacity .3s",
      "background-image": "linear-gradient(bottom, rgb(3,113,168) 13%, rgb(0,136,204) 100%)",
      "background-image": "-o-linear-gradient(bottom, rgb(3,113,168) 13%, rgb(0,136,204) 100%)",
      "background-image": "-moz-linear-gradient(bottom, rgb(3,113,168) 13%, rgb(0,136,204) 100%)",
      "background-image": "-webkit-linear-gradient(bottom, rgb(3,113,168) 13%, rgb(0,136,204) 100%)",
      "background-image": "-ms-linear-gradient(bottom, rgb(3,113,168) 13%, rgb(0,136,204) 100%)",
      "background-image": "-webkit-gradient(linear,left bottom, left top,color-stop(0.13, rgb(3,113,168)),color-stop(1, rgb(0,136,204)))"
    });

    $("#videoHeader"+Template.parentData(0)._id).css({
      "position": "absolute",
      "z-index": 1,
      "top": 0,
      "left": 0,
      "right": 0,
      "opacity": 0,
      "-webkit-transition": "opacity .3s",
      "-moz-transition": "opacity .3s",
      "-o-transition": "opacity .3s",
      "-ms-transition": "opacity .3s",
      "transition": "opacity .3s",
      "background-image": "linear-gradient(bottom, rgb(3,113,168) 13%, rgb(0,136,204) 100%)",
      "background-image": "-o-linear-gradient(bottom, rgb(3,113,168) 13%, rgb(0,136,204) 100%)",
      "background-image": "-moz-linear-gradient(bottom, rgb(3,113,168) 13%, rgb(0,136,204) 100%)",
      "background-image": "-webkit-linear-gradient(bottom, rgb(3,113,168) 13%, rgb(0,136,204) 100%)",
      "background-image": "-ms-linear-gradient(bottom, rgb(3,113,168) 13%, rgb(0,136,204) 100%)",
      "background-image": "-webkit-gradient(linear,left bottom, left top,color-stop(0.13, rgb(3,113,168)),color-stop(1, rgb(0,136,204)))"
    });

    $("#resizer"+Template.parentData(0)._id).css({
      "position": "absolute",
      "z-index": 2,
      "bottom": 0,
      "right": 0,
      "padding": "5px",
      "opacity": 0,
      "-webkit-transition": "opacity .3s",
      "-moz-transition": "opacity .3s",
      "-o-transition": "opacity .3s",
      "-ms-transition": "opacity .3s",
      "transition": "opacity .3s",
      "background-image": "linear-gradient(bottom, rgb(3,113,168) 13%, rgb(0,136,204) 100%)",
      "background-image": "-o-linear-gradient(bottom, rgb(3,113,168) 13%, rgb(0,136,204) 100%)",
      "background-image": "-moz-linear-gradient(bottom, rgb(3,113,168) 13%, rgb(0,136,204) 100%)",
      "background-image": "-webkit-linear-gradient(bottom, rgb(3,113,168) 13%, rgb(0,136,204) 100%)",
      "background-image": "-ms-linear-gradient(bottom, rgb(3,113,168) 13%, rgb(0,136,204) 100%)",
      "background-image": "-webkit-gradient(linear,left bottom, left top,color-stop(0.13, rgb(3,113,168)),color-stop(1, rgb(0,136,204)))"
    });

        // $("#"+video_id+":hover "+"#playerButtons"+Template.parentData(0)._id).css({"opacity": .9});
        var jqueryVideo = $("#draggable"+Template.parentData(0)._id);
        var jqueryPlayerButtons = $("#playerButtons"+Template.parentData(0)._id);
        jqueryVideo.hover(
          function() {
            jqueryPlayerButtons.css({"opacity": .9});
          },function() {
            jqueryPlayerButtons.css({"opacity": 0});
          });

        var jqueryVideoHeader = $("#videoHeader"+Template.parentData(0)._id);
        jqueryVideo.hover(
          function() {
            jqueryVideoHeader.css({"opacity": .9});
          },function() {
            jqueryVideoHeader.css({"opacity": 0});
          });

        var jqueryresizer = $("#resizer"+Template.parentData(0)._id);
        jqueryresizer.hover(
          function() {
            jqueryresizer.css({"opacity": .9});
          },function() {
            jqueryresizer.css({"opacity": 0});
          });


        VideoPlayBackHelper.createVideo(video, url);
        VideoPlayBackHelper.videoStartup(video);
      // });
$("#draggable"+Template.parentData(0)._id).draggable({stack: "div", distance:0, containment:"parent"});
$("#resizable"+Template.parentData(0)._id).resizable({aspectRatio:true, minHeight:365, minWidth: 640, handles: {'se': resizerBox} });
$("#resizable"+Template.parentData(0)._id).css({"font-size":0});

    //adding id to the mongodb entry
    TilingHelper.addingParentData(Template.parentData(0)._id, url);
    videos.push("#draggable"+Template.parentData(0)._id);
  },
  );


Template.dashplayer.events({

  "click .toggle-checked": function () {
    Dashplayers.update(this._id, {
      $set: {checked: ! this.checked}
    });
  },
  "click .delete": function () {
    Dashplayers.remove(this._id);
    videos.splice(array.indexOf("#resizable"+Template.parentData(0)._id));
  },
  

});
