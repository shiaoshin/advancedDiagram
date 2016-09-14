$(function(){
	var meng = $("#meng");
	var paulina = $("#paulina");
	var minji = $("#minji");
	var luke = $("#luke");
	var project = $(".project");
	var darkbox = $("#darkBox");
	var callout = $(".callout");
	var tip = $(".tip");
	
	var vid = $("video");
	var playing = false;
	
	var links = {"meng":"Meng_Liu_Annotated_Interaction","paulina":"EOYS_What_39_s_UP_pcarlos","minji":"Child Care in Chicago MKim","luke":"4am/index.html"};
	var list = ["meng","paulina","minji","luke"];
	
	/* Init */
	TweenLite.set(darkbox,{autoAlpha:0})
	TweenLite.set(tip,{autoAlpha:0})
	
	/* Adjust Video Size */
	var pageHeight = $(window).innerHeight();
	vid.attr({"height":pageHeight,"width":Math.round(pageHeight*1.78)});
	
	/* Click Function */
	project.on("click",function(e){
		var target = e.currentTarget;
		showVid(target);
	})
	
	/* Show Video*/
	function showVid(target){
		if(target.id != "luke"){
			playing = true;
			TweenLite.to(target,0.5,{
				scaleX: 1.1,
				scaleY: 1.1,
				alpha: 0,
				ease: "easeOutQuint"
			});
			// Open darkBox
			TweenLite.to(darkbox,0.6,{
				autoAlpha: 1,
				ease: "easeOutBack",
				onComplete: function(){
					// Reset project
					TweenLite.set(target,{
						scaleX: 1,
						scaleY: 1,
						alpha: 1
					});
					// Play video
					$("#source").attr("src","video/"+links[target.id]+".mp4");
					vid[0].autoplay = true;
					vid[0].load();
					vid[0].play();
					// Back to main page when ended
					vid.bind('ended', function () {
						vid.unbind('ended');
						TweenLite.to(darkbox,0.6,{
							delay: 0.5,
							autoAlpha: 0,
							ease: "easeOutBack",
							onComplete: function(){
								playing = false;
								setIdle();
							}
						});
						TweenLite.from(target,0.6,{
							delay: 0.7,
							scaleX: 1.1,
							scaleY: 1.1,
							alpha: 0.5,
							ease: "easeOutBack"
						});
					});
				}
			});
		}else{
			TweenLite.to(target,0.5,{
				scaleX: 1.1,
				scaleY: 1.1,
				alpha: 0.1,
				ease: "easeOutQuint",
				onComplete: function(){
					window.location.href = links[target.id];
				}
			});
		}
	}
	
	/* Mouse Idle Detect*/
	var idle;
	function setIdle(){
		clearTimeout(idle);
		idle = setTimeout(function(){
			if(playing == false){
				var pick = Math.floor(Math.random() * 4);
				var target = document.getElementById(list[pick]);
				showVid(target);
			}
		}, 30000);
	}
	setIdle();
	
	$(window).on("mousemove",function(){
		setIdle();
	})
	
	/* Set Callout */
	var tipped = false;
	callout.on("click",function(){
		if(tipped){
			TweenLite.to(tip,0.5,{
				scaleX: 0.8,
				scaleY: 0.8,		
				autoAlpha: 0,
				ease: "easeInQuint"
			});
			tipped = false;
		}else{
			TweenLite.set(tip,{
				scaleX: 0.8,
				scaleY: 0.8,				
				autoAlpha: 0
			});
			TweenLite.to(tip,0.7,{
				scaleX: 1,
				scaleY: 1,				
				autoAlpha: 1,
				ease: "easeOutBounce"
			});
			tipped = true;
		}
	});
	
	/* Reload, Just in case */
	$("#reload").on("click",function(){
		window.location.href = "index.html";
	});
})