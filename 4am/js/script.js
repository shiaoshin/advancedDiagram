/* Curves */
var ctxArc = document.getElementById('relationship').getContext('2d');
var base = 0.825 * $(window).innerHeight();
	
function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}
function drawArrowhead(locx, locy, angle, sizex, sizey) {
    var hx = sizex / 2;
    var hy = sizey / 2;
	ctxArc.translate((locx ), (locy));
	ctxArc.rotate(angle);
	ctxArc.translate(-hx,-hy);

    ctxArc.beginPath();
	ctxArc.fillStyle="#FFF";
	ctxArc.moveTo(0,0);
	ctxArc.lineTo(0,1*sizey);
	ctxArc.lineTo(1*sizex,1*hy);
	ctxArc.closePath();
	ctxArc.fill();
}
function findAngle(sx, sy, ex, ey) {
    // make sx and sy at the zero point
    return Math.atan((ey - sy) / (ex - sx));
}

/* JQuery */
$(function(){
	/* Variable */
	var $content = $("#content");
	var $landing = $("#landing");
	var $display = $("#horizontalPos");
	var $body = $("body");
	var $tileContent = $(".tileContent");
	var $darkbox = $("#darkbox");
	var $article = $("#article");
	var $close = $("#article .close");
	var btn_group = $("#group");
	var btn_type = $("#type");
	var btn_visual = $("#visual");
	
	/* Variables_darkbox */
	var $a_time = $("#aTime");
	var $a_media = $("#aMedia");
	var $a_type = $("#aType");
	var $a_title = $("#aContent h1");
	var $a_hr = $("#aContent hr");
	var $a_content = $("#aContent p");
	var $a_link = $("#aContent a");
	var $a_group = $("#aGroup");
	var $a_person = $("#aPerson");
	var $a_person_ul = $("#aPerson ul");
	var $a_relation = $("#aRelation");
	
	/* Variables_Group*/
	var $groups = $("#groups");
	var $g_Student = $("#g_Student");
	var $g_Government = $("#g_Government");
	var $g_Police = $("#g_Police");
	var $g_KMT = $("#g_KMT");
	var $g_DPP = $("#g_DPP");
	var $g_Media = $("#g_Media");
	var $g_Civilian = $("#g_Civilian");
	var $g_Others = $("#g_Others");
	var validGroup = ["Student","Government","Police","KMT","DPP","Media","Civilian"];
	var $tags = $("#groupTags");
	
	/* Variables_Function Buttons*/
	var groupToggle = false;
	var clickManage = {"target":"nothing"};
	
	var duration = 0.25;
	var contentW;
	var tl = new TimelineLite();
	var relations = [];
	
	/* Init */
	//TweenLite.set($darkbox,{autoAlpha:0});
	$darkbox.hide();
	$article.hide();
	/*TweenLite.set($article,{
		scaleX: 0.9,
		scaleY: 0.9	
	});*/
	//TweenLite.set($groups,{autoAlpha:0});
	$groups.hide();
	$tags.hide();
	
	/* Dark Box */
	function toggleDark(toggle){
		if(toggle){
			/*TweenLite.to($darkbox,duration,{
				autoAlpha: 1
			});*/
			/*TweenLite.to($article,duration,{
				delay: duration*3/2,
				scaleX: 1, 
				scaleY: 1,
				alpha: 1,
				ease: 'easeOutBack'
			});*/
			$darkbox.fadeIn(duration*1000,function(){
				$article.delay(duration*250).fadeIn(duration*1000);
			});
		}else{
			/*TweenLite.to($article,duration,{
				scaleX: 0.9,
				scaleY: 0.9,
				alpha: 0.3,
				ease: 'easeInBack'
			});*/
			/*TweenLite.to($darkbox,duration,{
				delay: duration,
				autoAlpha: 0
			});*/
			$article.fadeOut(duration*1000,function(){
				$darkbox.delay(duration*250).fadeOut(duration*1000);
			});
		}
	}
	$close.on('click',function(){
		toggleDark(false);
		clickManage.target = "nothing";	
	});
	
	/* httpCall */
	var feed = "cells";
	var key = "1ooyXXOQiChr2rIGFI6G7eEd0UVtPtIgNPLZZpIyKpsI";
	var worksheet = "oawllss"; //od6, oawllss, oma0no8
	//Dataset Operation;
	var categorize = new Object;
	var categoryList = new Array();
	
	/* Start getJSON */
	$.getJSON("https://spreadsheets.google.com/feeds/"+feed+"/"+key+"/"+worksheet+"/public/values?alt=json", function(data){
	//$.getJSON("js/4am.json", function(data){//--allow-file-access-from-files
		var raw = data.feed.entry;//retrieve data from spreadsheet
		var update = data.feed.updated.$t;//retrieve updated time
		
		/* Define Each Column */
		for(var i=0;i<raw.length;i++){
			var col = raw[i].title.$t.match(/\d+/);//Get Col Number
			if(col == 1){//Get Only First entry in each Col = Headers
				var row = raw[i].content.$t;
				categorize[row] = new Array(0);//Container for Data
				categoryList.push(row);//Lookup Table
			}else{break}
		}
		
		/* Populate Data */
		$.each(raw,function(key,value){
			var cellCol = value.gs$cell.col-1;
			var cellRow = value.gs$cell.row;
			var cell = value.gs$cell.$t;
			if(cellRow != 1){
				categorize[categoryList[cellCol]][cellRow-2] = cell;
			}
		})
		
		/* expand groups' width */
		var ids = (parseInt(_.last(categorize.ID))+1)*16;
		$(".group").css("width",(ids)+"vh");
		var canH = 0.835 * $(window).height();
		var canW = (ids-16)/100 * $(window).height();
		$("#relationship").attr({"width":canW,"height":canH});
		
		/* Generate Timeline Tiles */
		$content.packery({
			itemSelector: '.tile',
			isHorizontal: true,
			transitionDuration: '0.3s'			
		});
		var pckry = $content.data('packery');
		var days = 0;
		var dayCount = _.toArray(_.countBy(categorize.Day, function(el) {return el}));//Get distribution of Events in Each Day		
		var lastDay = dayCount.length;
		var tiles = 0;
		
		/* After Creating Tiles, Attach Interaction Functions */
		pckry.on('layoutComplete', function() {
			contentW = $("#content").width();
			/*TweenLite.set($(".tileContent"),{
				y: 54
			});*/
			//$(".tileContent").animate({marginBottom:"-54px"},duration*1000);
			$(".tileContent").css({"marginBottom":"-54px"});
			/*$(".innerTile").on('mouseenter',function(e){
				$(".innerTile").addClass("fade");
				$(e.currentTarget).removeClass("fade");
				TweenLite.to(e.currentTarget.childNodes[1], duration ,{
					y: 0,
					ease: 'easeOutSine'
				});
				//$(e.currentTarget.childNodes[1]).animate({marginBottom:"0"},duration*1000);
			});*/
			/*$(".innerTile").on('mouseleave',function(e){
				$(".innerTile").removeClass("fade");
				TweenLite.to(e.currentTarget.childNodes[1], duration ,{
					y: 54,
					ease: 'easeInSine'
				});
				//$(e.currentTarget.childNodes[1]).animate({marginBottom:"-54px"},duration*1000);
			});*/
			$(".innerTile").off('click');
			$(".innerTile").on('click',function(e){click(e,".innerTile")});
		});
		
		/* Click Function */
		function click(e,view){
			//Get Tile id
			var id = $(e.target).data().id -1;
			//Switch click states
			if(id != clickManage.target){
				/*First Click*/
				clickManage.target = id;
				$(view).addClass("fade");
				if(view == ".innerTile"){
					$(e.currentTarget).removeClass("fade");
					$(view+" .tileContent").animate({marginBottom:"-54px"},duration*1000);
					$(e.currentTarget.childNodes[0]).animate({marginBottom:"0"},duration*1000);
				}else if(view == ".thumb"){
					$(".group").removeClass("reveal");
					$(".tag p").addClass("fade");
					var relate = categorize.Entities[id].split(',');
					$.each(relate,function(key,value){
						switch(value){
							case "Student":
								$("#g_Student").addClass("reveal");
								$("#t_Student p").removeClass("fade");
								break;
							case "Government":
								$("#g_Government").addClass("reveal");
								$("#t_Government p").removeClass("fade");
								break;
							case "Police":
								$("#g_Police").addClass("reveal");
								$("#t_Police p").removeClass("fade");
								break;
							case "KMT":
								$("#g_KMT").addClass("reveal");
								$("#t_KMT p").removeClass("fade");
								break;
							case "DPP":
								$("#g_DPP").addClass("reveal");
								$("#t_DPP p").removeClass("fade");
								break;
							case "Media":
								$("#g_Media").addClass("reveal");
								$("#t_Media p").removeClass("fade");
								break;
							case "Civilian":
								$("#g_Civilian").addClass("reveal");
								$("#t_Civilian p").removeClass("fade");
								break;
							default:
								$("#g_Others").addClass("reveal");
								$("#t_Others p").removeClass("fade");
								break;							
						}
					});
					$("[data-id="+(id+1)+"]").removeClass("fade");
				}
			}else{
				/* Second Click: Build Article */
				buildArticle(id);
			}
		};
		
		/* Group Bar Click*/
		/*$(".group").on("click",function(e){
			//$(".group").removeClass("reveal");
			//$(".thumb").addClass("fade");
			
			$(e.currentTarget).toggleClass("reveal");
			for(var k=1;k<e.currentTarget.childNodes.length;k++){
				$(e.currentTarget.childNodes[k]).removeClass("fade");
			}
		});*/
		
		/* Procedural Appends Tiles */
		function nextLayout(){
			if(days != lastDay){
				var elems = [];
				for ( var i = 0; i < dayCount[days]; i++ ) {
					var elem = document.createElement('div');
					
					// Switch Brief Based on the existence of title
					if(typeof categorize.Title[tiles] != "undefined"){
						var brief = "<p class='tileTitle'>"+categorize.Title[tiles]+"</p><hr><p class='tileText'>"+categorize.Story[tiles]+"</p>";
					}else{
						var brief = "<p class='tileText'>"+categorize.Story[tiles]+"</p>";
					}
					
					// Switch DateTime Based on integrity of data
					if(typeof categorize.EndDate[tiles] != "undefined"){
						var dateTime = categorize.Year[tiles]+"/"+categorize.StartDate[tiles]+" - "+categorize.EndDate[tiles];
					}else{
						if(typeof categorize.StartTime[tiles] != "undefined"){
							var dateTime = categorize.Year[tiles]+"/"+categorize.StartDate[tiles]+" "+categorize.StartTime[tiles];
						}else{
							var dateTime = categorize.Year[tiles]+"/"+categorize.StartDate[tiles];
						}
					}
					
					// Construct Group Thumbnail
					var groupPos = parseInt(categorize.ID[tiles]) * 16;
					var thumb = $("<div class='thumb fade' style='background-image: url(img/"+categorize.Media[tiles]+");left:"+groupPos+"vh;' data-id='"+categorize.ID[tiles]+"'></div>")
					var group = categorize.Entities[tiles].split(',');
					
					$.each(group,function(key,value){
						if(_.contains(validGroup,value)){
							$("#g_"+value).append(thumb.clone());
						}else{
							$("#g_Others").append(thumb.clone());
						}
					});
					
					// Attach Click Event to Thunmbs
					$(".thumb").off('click');
					$(".thumb").on('click',function(e){click(e,".thumb")});
					
					//Construct Nodes
					var node = $("<div class='node' style='left:"+(categorize.ID[tiles]*16+6.5)+"vh'></div>");
					$groups.append(node);
					
					//Get relationShips
					var relation = categorize.Relation[tiles].split(';');
					if(!isBlank(relation[0])){//check if target exist
						relation[0] = relation[0].split(',');
						//draw an arc to connect the dots
						$.each(relation[0],function(key,value){
							ctxArc.beginPath();
							ctxArc.strokeStyle = "rgba(255,255,255,0.5)";
							var incre = 156.6;//122.9||136.55
							var adjust = 80;//62||67
							ctxArc.moveTo((categorize.ID[tiles]-1)*incre+adjust,base);
							var middle = ((value-1)*incre+adjust+(categorize.ID[tiles]-1)*incre+adjust)/2;
							var distance = ((value-1)*incre+adjust)-((categorize.ID[tiles]-1)*incre+adjust);
							var control = (7125300-1000*distance)/13937.4
							ctxArc.quadraticCurveTo(middle, control, (value-1)*incre+adjust, base);
							ctxArc.stroke();
							var ang = findAngle(middle, control, (value-1)*incre+adjust, base);
							//drawArrowhead((value-1)*incre+adjust, base, ang, 12, 12);
						});
					}else if(!isBlank(relation[1])){//check if target exist
						relation[1] = relation[1].split(',');
					}
					//relations[tiles] = relation;
					
					// Construct Tiles
					elem.innerHTML = 
						"<div class='innerTile' style='background: url(img/"+categorize.Media[tiles]+") center center no-repeat;background-size:cover;' data-id='"+categorize.ID[tiles]+"'>"+
							"<div class='tileContent'>"+
								brief+
							"</div>"+
							//"<div class='tileDate'>"+
							//	dateTime+
							//"</div>"+
						"</div>";
					var w = Math.floor((Math.random()*3)+1);//Generate Col-Size Randomly
					var h = Math.floor((Math.random()*3)+1);//Generate Row-Size Randomly
					var wh = w.toString().concat(w);
					elem.className = 'tile sortable size'+ wh;
					elems.push(elem);
					tiles++;			
				}
				$content.append(elems);
				$content.packery('appended', elems );
				/* Build Time Tag & nodes*/
				if(days == 0){
					var yearC = $("<div class='dateC sortable' style='left:60vh'>2013</div>");
					$content.append(yearC);
					var yearG = $("<div class='dateG' style='left:13vh'>2013</div>");
					$groups.append(yearG);
				}else if(days == 1){
					var year = $("<div class='dateC sortable' style='left:"+(contentW-50)+"px'>2014</div>");
					var date = $("<div class='dateC sortable' style='left:"+(contentW+50)+"px'>"+categorize.StartDate[tiles-1]+"</div>");
					$content.append(year);
					$content.append(date);
					var yearG = $("<div class='dateG' style='left:61vh'>2014</div>");
					var dateG = $("<div class='dateG' style='left:110vh'>"+categorize.StartDate[tiles-1]+"</div>");
					$groups.append(yearG);
					$groups.append(dateG);
				}else{
					var date = $("<div class='dateC sortable' style='left:"+contentW+"px'>"+categorize.StartDate[tiles-1]+"</div>");
					$content.append(date);
					var dateG = $("<div class='dateG' style='left:"+((tiles-dayCount[days]+1)*16-2)+"vh'>"+categorize.StartDate[tiles-1]+"</div>");
					$groups.append(dateG);
				}
				
				days++;
			}
		}
		nextLayout();
		
		/* Gesture Bindings */
		$("body").bind("mousewheel DOMMouseScroll", function(e){detectMove(e)});
		$("body").on("swipeend", function(e){detectMove(e)});
		$("body").on("keydown", function(e){detectMove(e)});
		function detectMove(event){
			// Trigger New Layout
			nextLayout();
			
			// Hide Tiles if in Group View
			if(groupToggle){
				$(".sortable").hide();
			}
			
			// Switch Event Type
			switch(event.type){
				case "mousewheel":
					var delta = event.originalEvent.deltaY*5;
					/*TweenLite.to($body,duration,{
						delay: 0.075,
						scrollLeft: $body.scrollLeft()+delta,
						ease: 'easeOutQuint'
					});*/
					$body.scrollLeft($body.scrollLeft()+delta);
					//$body.animate({scrollLeft:$body.scrollLeft()+delta},duration*1000,'easeOutCirc');
					break;
				case "swipeend":
					var delta = event.length*2;
					if(event.angle < 60 || event.angle > 300){//swipe right
						TweenLite.to($body,duration,{
							delay: 0.075,
							scrollLeft: $body.scrollLeft()-delta,
							ease: 'easeOutQuint'
						});
						//$body.scrollLeft($body.scrollLeft()-delta);
						//$body.animate({scrollLeft:$body.scrollLeft()-delta},duration*1000,'easeOutCirc');
					}else if(event.angle > 120 && event.angle < 240){//swipe left
						TweenLite.to($body,duration,{
							delay: 0.075,
							scrollLeft: $body.scrollLeft()+delta,
							ease: 'easeOutQuint'
						});
						//$body.scrollLeft($body.scrollLeft()+delta);
						//$body.animate({scrollLeft:$body.scrollLeft()+delta},duration*1000,'easeOutCirc');
					}
					break;
				case "keydown":
					if(event.keyCode == 32){//space bar
					
					}else if(event.keyCode == 36){//home
						/*TweenLite.to($body,duration,{
							delay: 0.075,
							scrollLeft: $body.scrollLeft(0),
							ease: 'easeOutQuint'
						});*/
						$body.scrollLeft(0);
					}else if(event.keyCode == 33){//pageup
						/*TweenLite.to($body,duration,{
							delay: 0.075,
							scrollLeft: $body.scrollLeft()-1800,
							ease: 'easeOutQuint'
						});*/
						$body.scrollLeft($body.scrollLeft()-1800);
					}else if(event.keyCode == 34){//pagedown
						/*TweenLite.to($body,duration,{
							delay: 0.075,
							scrollLeft: $body.scrollLeft()+1800,
							ease: 'easeOutQuint'
						});*/
						$body.scrollLeft($body.scrollLeft()+1800);
					}else if(event.keyCode == 35){//end
						/*TweenLite.to($body,duration,{
							delay: 0.075,
							scrollLeft: $body.scrollLeft(99999999),
							ease: 'easeOutQuint'
						});*/
						
						$body.scrollLeft(99999999);
					}
					break;
			};
		};		
		console.log(categorize);
		//console.log("finish");
    });
	
	/* Generate Article */
	function buildArticle(id){
		//Build Time
		if(typeof categorize.EndDate[id] != "undefined"){
			var dateTime = categorize.Year[id]+"/"+categorize.StartDate[id]+" - "+categorize.EndDate[id];
		}else{
			if(typeof categorize.StartTime[id] != "undefined"){
				var dateTime = categorize.Year[id]+"/"+categorize.StartDate[id]+" "+categorize.StartTime[id];
			}else{
				var dateTime = categorize.Year[id]+"/"+categorize.StartDate[id];
			}
		}
		$a_time.text(dateTime);
		//Build Media
		$a_media.attr("src",""); 
		$a_media.attr("src","img/"+categorize.Media[id]);
		//Build Title
		$a_title.show();
		if(typeof categorize.Title[id] != "undefined"){
			$a_hr.show();
			$a_title.text(categorize.Title[id]);
		}else{
			$a_title.hide();
			$a_hr.hide();
		}
		//Build Content
		$a_content.html(categorize.Story[id]+" ( <a href='"+categorize.Link[id]+"' target='_blank'>source</a> )");
		//Build Entities
		$a_group.text("");
		var entities = categorize.Entities[id].split(',');
		$.each(entities,function(key,value){
			switch (value){
				case "Student":
					var color = "tBlack";
					break;
				case "Police":
					var color = "tOrange";
					break;
				case "KMT":
					var color = "tBlue";
					break;
				case "DPP":
					var color = "tGreen";
					break;
				case "Government":
					var color = "tRed";
					break;
				case "Media":
					var color = "tPink";
					break;
				case "Civilian":
					var color = "tWhite";
					break;
				default:
					var color = "tGray";
			}
			$a_group.append(" <Strong class='"+color+"'>"+value+"</Strong> ");
		});
		//Form Data_Keyperson
		$a_person_ul.text("");
		$a_person.hide();
		if(typeof categorize.Keyperson[id] != "undefined"){
			$a_person.show();
			var keyPeople = categorize.Keyperson[id].split(',');
			$.each(keyPeople,function(key,value){
				$a_person_ul.append("<li>"+value+"</li>");
			});
		}
		//Build Relation
		$a_relation.text("");
		var respond = categorize.Relation[id].split(";")[1].split(",");
		var result = categorize.Relation[id].split(";")[0].split(",");
		if(respond != ""){
			var relate = "<p style='font-weight:bold;'>Respond to:</p><ul>";
			$.each(respond,function(key,value){
				if(typeof categorize.Title[value-1] != "undefined"){
					relate += "<li style='width:90%' data-id='"+value+"'><img src='img/ui_bullet.png'/>"+categorize.Title[parseInt(value)-1]+"</li>"
				}else{
					relate += "<li style='width:90%' data-id='"+value+"'><img src='img/ui_bullet.png'/>"+categorize.Story[parseInt(value)-1]+"</li>"
				}
			});
			relate += "</ul>"
			$a_relation.append(relate);
		}
		if(result != ""){
			var reply = "<p style='font-weight:bold;'>Result in:</p><ul>";
			$.each(result,function(key,value){
				if(typeof categorize.Title[value-1] != "undefined"){
					reply += "<li style='width:85%' data-id='"+value+"'>"+categorize.Title[parseInt(value)-1]+"</li><img src='img/ui_bullet.png'/>"
				}else{
					reply += "<li style='width:85%' data-id='"+value+"'>"+categorize.Story[parseInt(value)-1]+"</li><img src='img/ui_bullet.png'/>"
				}
			});
			reply += "</ul>"
			$a_relation.append(reply);
		}
		$("#aRelation li").on("click",function(e){
			var id = $(e.target).data().id-1;
			clickManage.target = id;
			buildArticle(clickManage.target);
		});
		
		//Finally, Bring up the Darkbox
		toggleDark(true);
	}
	
	/* Functional Buttons */
	// group view
	btn_group.on("click",function(e){
		var sortable = $(".sortable");
		// Toggle group view
		if(!groupToggle){
			$(e.target).css("background-image","url('img/button_group_over.png')");
			$("#wrapper h1:nth-of-type(2)").text("Group View");
			
			sortable.fadeOut(300,function(){
				$groups.fadeIn(300)
				//scroll to beginning
				TweenLite.to($body,duration,{
					delay: duration*2,
					scrollLeft: 0,
					ease: "easeOutQuint"
				});
			});
			
			//hide $content
			/*TweenLite.to(sortable,duration*2,{
				autoAlpha: 0,
				x: +100,
				ease: "easeOutSine"
			});				
			//scroll to beginning
			TweenLite.to($body,duration,{
				delay: duration*2,
				scrollLeft: 0,
				ease: "easeOutQuint"
			});
			//reveal group view
			TweenLite.to($groups,duration,{
				delay: duration*2.5,
				autoAlpha:1
			});
			//stagger groups
			tl.staggerFrom($(".group"),duration,{
				delay: duration*3,
				y: +100,
				ease: "easeOutQuint"
			},0.067);
			//stagger events
			tl.staggerTo(thumbs,duration,{
				delay: duration*4,
				x: 0,
				alpha: 1,
				ease: "easeOutQuint"
			},0.025);*/
			
			groupToggle = true;
		}else{
			$(e.target).css("background-image","url('img/button_group.png')");
			$("#wrapper h1:nth-of-type(2)").text("Time Line");
			
			$groups.fadeOut(300,function(){sortable.fadeIn(300)});
			// show $content
			/*TweenLite.to(sortable,duration*2,{
				autoAlpha: 1,
				x: 0,
				ease: "easeOutSine"
			});*/
			groupToggle = false;
		}
	})
	
	/* Mouse Idle Detect*/
	TweenLite.set($("#prompt"),{autoAlpha: 0});
	var idle;
	var makeSure;
	function setIdle(){
		clearTimeout(idle);
		TweenLite.to($("#container"),0.2,{
			alpha: 1,
			ease: "easeInSine"			
		});
		TweenLite.to($("#prompt"),0.1,{
			alpha: 0,
			ease: "easeInSine"			
		});
		idle = setTimeout(function(){
			// Set Time going back
			makeSure = setTimeout(function(){				
				window.location.href = "../index.html";
			},5000)
			// Prompt to user
			TweenLite.to($("#container"),5,{
				alpha: 0,
				ease: "easeOutSine"
			});
			TweenLite.to($("#prompt"),4,{
				autoAlpha: 1,
				ease: "easeOutSine"
			});
		}, 30000);
	}
	setIdle();
	
	$(window).on("mousemove",function(){
		clearTimeout(makeSure);
		setIdle();
		
		// Show Groups if Scroll Over 60vh
		if($body.scrollLeft()>500 && groupToggle){
			$tags.fadeIn(duration*1000);
		}else{
			$tags.fadeOut(duration*1000);
		}
	})
	
	/* Article Next/Prev */
	$("#goNext").on("click",function(){
		if(clickManage.target < parseInt(_.last(categorize.ID))-1){
			clickManage.target++;
			buildArticle(clickManage.target);
		}
	});
	$("#goPrev").on("click",function(){
		if(clickManage.target > 0){
			clickManage.target--;
			buildArticle(clickManage.target);
		}
	});
	
	/* Reload, Just in case */
	$("#reload").on("click",function(){
		window.location.href = "../index.html";
	});
})