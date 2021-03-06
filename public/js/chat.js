$(function(){
	/* Scroller */
	var $msgBoxContainer = $("#messageBoxContainer");
	var $chatContainer = $("#chat");
	var scrollChatContainer = $(".nano");

	activateScroll();
	function activateScroll() {
		var toTop = $chatContainer.offset().top;
		var msgBox = $msgBoxContainer.height();
		var windowSize = $(window).height();
		var xtraPadding = 21; //#chat top padding
		var totalHeight = windowSize - msgBox - toTop - xtraPadding;
		scrollChatContainer.height(totalHeight);
		scrollChatContainer.nanoScroller({flash: true});
		scrollToBottom(null);
	}

	function scrollToBottom(scrollTime) {
		if(scrollTime != null) {
			$(".nano").nanoScroller({scroll : "bottom", animationTime: scrollTime});
			setTimeout(function() {
				$(".nano").nanoScroller({scroll : "bottom", animationTime: scrollTime});
			}, 80);
		} else {
			$(".nano").nanoScroller({scroll : "bottom"});
			setTimeout(function() {
				$(".nano").nanoScroller({scroll : "bottom"});
			}, 80);
		}

	}

	$( window ).resize(function() {
		activateScroll();
	});

	// MessageTest
	var msgTest = '<li><div class="chatPicture"><a href="#" class="shadow"><img src="/img/profile_pictures/ragne.png" width="60px" height="60px"></a></div><div class="chatPost"><span class="chatName">Ragne Henriksen</span><span class="chatTimestamp"> -  few seconds ago</span><p>Collaboratively administrate empowered markets via plug-and-play networks. Dynamically procrastinate B2C users after installed base benefits. Dramatically visualize customer directed convergence without revolutionary ROI.</p></div></li>';
	var msgTest2 = '<li><div class="chatPicture"><a href="#" class="shadow"><img src="/img/profile_pictures/andreas.png" width="60px" height="60px"></a></div><div class="chatPost"><span class="chatName">Andreas Ludvigsen</span><span class="chatTimestamp"> -  few seconds ago</span><p>' +
	'Efficiently unleash cross-media information without cross-media value. Quickly maximize timely deliverables for real-time schemas. Dramatically maintain clicks-and-mortar solutions without functional solutions.</p></div></li>';
	var count = 1;
	$("#userinfo").click(function() {
		if(count % 2 === 0 ) {
			$("ul.content").append(msgTest);
		} else {
			$("ul.content").append(msgTest2);
		}
		count += 1;
		scrollToBottom(500);
	});

	/* CHAT FUNCTIONS */
    var socket = io.connect();
    var $nickForm = $('#setNick');
    var $nickError = $('#nickError');
    var $nickBox = $('#nickname');
    var $users = $('#users');
    var $messageForm = $('#send-message');
    var $messageBox = $('#message');
    var $chat = $('#chat');

    $nickForm.submit(function(e){
        e.preventDefault();
        socket.emit('new user', $nickBox.val(), function(data){
            if(data){
                $('#nickWrap').hide();
                $('#contentWrap').show();
            } else{
                $nickError.html('That username is already taken!  Try again.');
            }
        });
        $nickBox.val('');
    });

    socket.on('usernames', function(data){
        var html = '<li><b>Brukere online:</b></li>';
        for(var i=0; i < data.length; i++){
            html += '<li>' + data[i] + '</li>';
        }
        $users.html(html);
    });

    $("textarea#message").keypress(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            if($messageBox.val() != '' ) {
                socket.emit('send message', $messageBox.val(), function(data){
                    $chat.append('<li class="error">' + data + "</li>");
                });
                $messageBox.val('');
            }
        }
    });

    socket.on('load old msgs', function(docs){
        for(var i=docs.length-1; i >= 0; i--){
            displayMsg(docs[i]);
        }
    });

    socket.on('new message', function(data){
        displayMsg(data);
    });

    function displayMsg(data){
        $chat.append('<li class="msg"><b>' + data.nick + ': </b>' + data.msg + "</li>");
    }
});