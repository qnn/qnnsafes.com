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
	$().UItoTop({ easingType: 'easeOutQuart' });
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
	if ($("#main_case").length == 1) {
		$.getJSON('/products/catelog.json', function(CAT){
			window.CAT = CAT;
			$('#main_case a').each(function(){
				$(this).hover(function(){
					$('#main_case a').removeClass('current');
					$('#showcase .showcase_details').addClass('hidden');
					$('.indicator', this).addClass('indicator_wht');
					var cat=$(this).data('category');
					var sublist=$('#showcase .subcaselist'), sublist2=$('#showcase .subcaselist2'), i;
					sublist.attr('data-belongsto', cat).empty();
					sublist2.attr('data-belongsto', cat).empty();
					for (i=0; i<CAT[cat].length; i++) {
						if (i==27) {
							CAT[cat][i].name="More...";
						} else if (i>27) {
							break;
						}
						$('<li />').append($('<a class="sd" data-image="'+CAT[cat][i].image+'" href="'+CAT[cat][i].link+'">'+CAT[cat][i].name+'</a>').hover(function(){
							$('#showcase').find('.subcaselist, .subcaselist2').removeClass('hidden');
							$('#main_case a').removeClass('current');
							var fpar=$('#main_case a[data-category="'+$(this).parents('.showcase_list').attr('data-belongsto')+'"]');
							fpar.addClass('current');
							$('#showcase .showcase_details').empty().append('<a href="'+$(this).attr('href')+'"><img src="{{ site.image_cdn }}'+$(this).data('image')+'" /></a><h3>'+fpar.text()+'<br />'+$(this).text()+'</h3>').removeClass('hidden');
						}, function(){
							$('#main_case a').removeClass('current');
							$('#showcase').find('.subcaselist, .subcaselist2').addClass('hidden');
							$('#showcase .showcase_details').addClass('hidden');
						})).appendTo(
							i<14 ? sublist : sublist2
						);
					}
					sublist.removeClass('hidden').css({left: $('#main_case').position().left+$('#main_case').width()});
					if (sublist2.children().length==0) {
						sublist2.addClass('hidden');
					} else {
						sublist2.removeClass('hidden').css({left: sublist.position().left+sublist.width()});
					}
				}, function(){
					$('#showcase').find('.subcaselist, .subcaselist2').addClass('hidden');
					$('.indicator', this).removeClass('indicator_wht');
				});
				$(this).append('<div class="indicator"></div>');
			});
		});
	}
});
/* totop */
jQuery.extend(jQuery.easing,{easeOutQuart:function(e,a,b,c,d){return-c*((a=a/d-1)*a*a*a-1)+b}});
(function(a){a.fn.UItoTop=function(e){var b=a.extend({text:"To Top",min:200,inDelay:600,outDelay:400,containerID:"toTop",containerHoverID:"toTopHover",scrollSpeed:1200,easingType:"linear"},e),d="#"+b.containerID,c="#"+b.containerHoverID;a("body").append($('<a href="javascript:;" id="'+b.containerID+'">'+b.text+'</a>').click(function(){window.scrollTo(0, 0);}));a(d).hide().on("click.UItoTop",function(){a("html, body").animate({scrollTop:0},b.scrollSpeed,b.easingType);a("#"+b.containerHoverID,this).stop().animate({opacity:0},b.inDelay,b.easingType);return!1}).prepend('<span id="'+
b.containerHoverID+'"></span>').hover(function(){a(c,this).stop().animate({opacity:1},600,"linear")},function(){a(c,this).stop().animate({opacity:0},700,"linear")});a(window).scroll(function(){var c=a(window).scrollTop();"undefined"===typeof document.body.style.maxHeight&&a(d).css({position:"absolute",top:c+a(window).height()-50});c>b.min?a(d).fadeIn(b.inDelay):a(d).fadeOut(b.Outdelay)})}})(jQuery);
