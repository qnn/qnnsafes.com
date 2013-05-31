---
layout: nil
---
var relative = null;
if (location.protocol==='file:') {
	relative = Array($('link[rel="canonical"]').attr('href').match(/\//g).length-2).join('../');
	if (relative == '') relative = './';
}
function to_relative(link, index) {
	if (!relative) return link;
	var hash = link ? link.match(/(#.*)$/) : null;
	if (hash) {
		link = link.replace(/#.*$/, '');
		if (link == '') link = './';
	}
	return link?(link.replace(/^\//, relative)+(index?(link.substr(-1)=='/'?'index.html':''):'')+(hash?hash[1]:'')):null;
}
$(function(){
	if (relative) {
		$('a').attr('href', function(a,b){return to_relative(b, true);});
		$('img').attr('src', function(a,b){return to_relative(b, false);});
	}
	if ($("img.lazy").length > 0) {
		$("img.lazy").lazyload({ threshold : 400 });
	}
	$().UItoTop({ scrollSpeed:100 });
    if ($("#etalage").length == 1) {
		$("#etalage").etalage({
			thumb_image_width: 250,
			thumb_image_height: 250,
			source_image_width: 600,
			source_image_height: 600,
			zoom_area_width: 300,
			zoom_area_height: 300,
			zoom_area_distance: 5,
			small_thumbs: 4,
			smallthumb_inactive_opacity: 0.3,
			smallthumbs_position: "bottom",
			speed: 200,
			show_icon: false,
			autoplay: false,
			keyboard: false,
			zoom_easing: false
		});
		$('#etalage').bind('contextmenu', function(){return false;});
	}
	$(".tabbtn").bind("click", function () {
		var a = $(this).parent().index();
		$(".tabbtn").removeClass("sel");
		$(this).addClass("sel");
		$(".maincontent div.mc").hide();
		$(".maincontent div").eq(a).show()
	});
	if ($('#leftprolist').length == 1) {
		var menuOffset = $('#leftprolist')[0].offsetTop;
		$(document).bind('ready scroll',function() {
			var docScroll = $(document).scrollTop();
			if(docScroll >= menuOffset) {
				$('#leftprolist').addClass('fixed').css({left:$('#header').position().left-document.body.scrollLeft});
			} else {
				$('#leftprolist').removeClass('fixed');
			}
		});
	}
	$(window).bind('resize',function(){
		if ($('#leftprolist').hasClass('fixed')) $('#leftprolist').css({left:$('#header').position().left-document.body.scrollLeft});
	});
	if ($("#main_case").length == 1) {
		$.getJSON('/products/catelog.json', function(CAT){
			window.CAT = CAT;
			window.CASE = {};
			var reset=function(){
				$('#showcase').find('.subcaselist, .subcaselist2').addClass('hidden');
				$('#showcase .showcase_details').fadeOut(200, function(){$(this).addClass('hidden');});
				$('#showcase .bg').fadeTo(200, 1.0);
				$('#main_case a').removeClass('current');
				$('#main_case .indicator').removeClass('indicator_wht');
			};
			$('#main_case a').each(function(){
				window.CASE[$(this).data('category')]=$(this).text();
				$(this).click(function(){
					return false;
				});
				$(this).hover(function(){
					$('#main_case .indicator').removeClass('indicator_wht');
					$('.indicator', this).addClass('indicator_wht');
				});
				$(this).hoverIntent(function(){
					$('#showcase').css({'background-color':'#000'});
					$('#showcase .bg').fadeTo(200, 0.5);
					$('#main_case a').removeClass('current');
					window.clearTimeout(window.sto);
					window.clearTimeout(window.sto2);
					window.clearTimeout(window.sto3);
					var sublist=$('#showcase .subcaselist'), sublist2=$('#showcase .subcaselist2');
					var cat=$(this).data('category');
					sublist.empty();
					sublist2.empty();
					for (i=0; i<CAT[cat].length; i++) {
						if (i==27) {
							CAT[cat][i].name="More...";
						} else if (i>27) {
							break;
						}
						var alink=$('<a class="sd" data-image="'+CAT[cat][i].image+'" href="'+CAT[cat][i].link+'">'+CAT[cat][i].name+'</a>');
						alink.hover(function(){
							$('#main_case a[data-category="'+cat+'"]').addClass('current');
						});
						alink.hoverIntent(function(){
							window.clearTimeout(window.sto);
							window.clearTimeout(window.sto2);
							window.clearTimeout(window.sto3);
							$('#showcase .showcase_details').empty().append('<a href="'+$(this).attr('href')+'"><img src="{{ site.image_cdn }}/'+$(this).data('image')+'" /></a><h3>'+window.CASE[cat]+'<br />'+$(this).text()+'</h3>');
							if ($('#showcase .showcase_details').hasClass('hidden')) {
								$('#showcase .showcase_details').removeClass('hidden').hide().fadeIn(200);
							}
						}, function(){
							window.sto2=window.setTimeout(reset, 1000);
						});
						$('<li />').append(alink).appendTo(i<14 ? sublist : sublist2);
					}
					sublist.removeClass('hidden').css({left: $('#main_case').position().left+$('#main_case').width()-5});
					if (sublist2.children().length==0) {
						sublist2.addClass('hidden');
					} else {
						sublist2.removeClass('hidden').css({left: sublist.position().left+sublist.width()-5});
					}
					var top=$(this).position().top;
					if (top+sublist.height() > $('#showcase').height()) top = $('#showcase').height() - sublist.height() - 20;
					if (top < 20) top=20;
					sublist.css({top: top});
					if (!$('#showcase .showcase_details').hasClass('hidden')) {
						window.sto3=setTimeout(function(){
							$('#showcase .showcase_details').fadeOut(200, function(){$(this).addClass('hidden');});
						}, 1000);
					}
				}, function(){
					//$(this).removeClass('current');
					window.sto=window.setTimeout(function(){
						var mainlisthovers=$('#main_case').find('a:hover').length;
						var sublisthovers=$('#showcase').find('.subcaselist, .subcaselist2').find('a:hover').length;
						if (mainlisthovers == 0 && sublisthovers == 0) {
							reset();
						}
					}, 1000);
				});
				$(this).append('<div class="indicator"></div>');
			});
		});
	}
	if ($('.anchors').length>0) {
		$('.clicktotop').bind('click',function(){window.location.hash='';window.scrollTo(0, 0);});
		$(document).bind('ready scroll',function() {
			var anchors=$('.anchors'), i, top=f_scrollTop();
			$('#leftprolist a').removeClass('current');
			if (top < 120) return;
			if (f_clientHeight() + f_scrollTop() == _8HTML_.getDocHeight()) {
				$('#leftprolist a[data-category]:last').addClass('current');
				return;
			}
			for (i=0; i<anchors.length; i++) {
				var t1=anchors.eq(i).position()?anchors.eq(i).position().top:0;
				var t2=anchors.eq(i+1).position()?anchors.eq(i+1).position().top:_8HTML_.getDocHeight();
				t1-=150;
				t2-=150;
				if (top > t1 && top < t2) {
					$('#leftprolist a[data-category="'+anchors.eq(i).attr('name')+'"]').addClass('current');
				}
			}
		});
	}
	$('.clicktolist').click(function(){location.href='/products/';});
});
function f_scrollTop() {
	return f_filterResults (
		window.pageYOffset ? window.pageYOffset : 0,
		document.documentElement ? document.documentElement.scrollTop : 0,
		document.body ? document.body.scrollTop : 0
	);
}
function f_clientHeight() {
	return f_filterResults (
		window.innerHeight ? window.innerHeight : 0,
		document.documentElement ? document.documentElement.clientHeight : 0,
		document.body ? document.body.clientHeight : 0
	);
}
function f_filterResults(n_win, n_docel, n_body) {
	var n_result = n_win ? n_win : 0;
	if (n_docel && (!n_result || (n_result > n_docel)))
		n_result = n_docel;
	return n_body && (!n_result || (n_result > n_body)) ? n_body : n_result;
}
var _8HTML_=window._8HTML_||{};
/*fix footer*/
_8HTML_.getDocHeight=function(){var a=document;return Math.max(Math.max(a.body.scrollHeight,a.documentElement.scrollHeight),Math.max(a.body.offsetHeight,a.documentElement.offsetHeight),Math.max(a.body.clientHeight,a.documentElement.clientHeight))};
_8HTML_.fixfooter=function(){$("#wrapper").height()<_8HTML_.getDocHeight()&&$("#footer").css("margin-top",parseInt($("#footer").css("margin-top"))+_8HTML_.getDocHeight()-$("#wrapper").height())}
$(_8HTML_.fixfooter);
/* totop */
(function(a){a.fn.UItoTop=function(e){var b=a.extend({text:"To Top",min:200,inDelay:600,outDelay:400,containerID:"toTop",containerHoverID:"toTopHover",scrollSpeed:1200,easingType:"linear"},e),d="#"+b.containerID,c="#"+b.containerHoverID;a("body").append($('<a href="javascript:;" id="'+b.containerID+'">'+b.text+'</a>').click(function(){window.scrollTo(0, 0);}));a(d).hide().on("click.UItoTop",function(){a("html, body").animate({scrollTop:0},b.scrollSpeed,b.easingType);a("#"+b.containerHoverID,this).stop().animate({opacity:0},b.inDelay,b.easingType);return!1}).prepend('<span id="'+
b.containerHoverID+'"></span>').hover(function(){a(c,this).stop().animate({opacity:1},600,"linear")},function(){a(c,this).stop().animate({opacity:0},700,"linear")});a(window).scroll(function(){var c=a(window).scrollTop();"undefined"===typeof document.body.style.maxHeight&&a(d).css({position:"absolute",top:c+a(window).height()-50});c>b.min?a(d).fadeIn(b.inDelay):a(d).fadeOut(b.Outdelay)})}})(jQuery);
/* hoverIntent r7 */
(function(e){e.fn.hoverIntent=function(t,n,r){var i={interval:100,sensitivity:7,timeout:0};if(typeof t==="object"){i=e.extend(i,t)}else if(e.isFunction(n)){i=e.extend(i,{over:t,out:n,selector:r})}else{i=e.extend(i,{over:t,out:t,selector:n})}var s,o,u,a;var f=function(e){s=e.pageX;o=e.pageY};var l=function(t,n){n.hoverIntent_t=clearTimeout(n.hoverIntent_t);if(Math.abs(u-s)+Math.abs(a-o)<i.sensitivity){e(n).off("mousemove.hoverIntent",f);n.hoverIntent_s=1;return i.over.apply(n,[t])}else{u=s;a=o;n.hoverIntent_t=setTimeout(function(){l(t,n)},i.interval)}};var c=function(e,t){t.hoverIntent_t=clearTimeout(t.hoverIntent_t);t.hoverIntent_s=0;return i.out.apply(t,[e])};var h=function(t){var n=jQuery.extend({},t);var r=this;if(r.hoverIntent_t){r.hoverIntent_t=clearTimeout(r.hoverIntent_t)}if(t.type=="mouseenter"){u=n.pageX;a=n.pageY;e(r).on("mousemove.hoverIntent",f);if(r.hoverIntent_s!=1){r.hoverIntent_t=setTimeout(function(){l(n,r)},i.interval)}}else{e(r).off("mousemove.hoverIntent",f);if(r.hoverIntent_s==1){r.hoverIntent_t=setTimeout(function(){c(n,r)},i.timeout)}}};return this.on({"mouseenter.hoverIntent":h,"mouseleave.hoverIntent":h},i.selector)}})(jQuery)
