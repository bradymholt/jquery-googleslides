// googleslides v1.1 - jQuery Google Slides plugin
// (c) 2012 Brady Holt - www.geekytidbits.com
// License: http://www.opensource.org/licenses/mit-license.php

(function( $ ){
	var defaults = {
			  'userid'			 : '115528839112598673902',
			  'albumid'			 : '5710317752556741025',
			  'imgmax'           : 460,
			  'maxresults'		 : 100,
			  'random'			 : true,
			  'caption'			 : true,
			  'albumlink'		 : true,
			  'time'	 		 : 5000,
			  'fadespeed'		 : 1000
	};
			
	var methods = {
		init: function (options) {
		    var settings = $.extend({}, defaults, options);
			this.data('googleslidesOptions', settings);
			
			if ($('.googleslides[albumid=' + settings.albumid +']').length > 0) {
				var error = 'jQuery.googleslides ERROR: albumid:' + settings.albumid + ' is already on the page.  Only one album per page is supported.';
				this.text(error);
				console.log(error);
			}
			else {
				this.attr('albumid', settings.albumid);

				var albumJsonUrl = '<script src="https://picasaweb.google.com/data/feed/base/user/' + settings.userid + '/albumid/' + settings.albumid 
					+ '?alt=json&kind=photo&max-results=' + settings.maxresults + '&hl=en_US&imgmax=' + settings.imgmax 
					+ '&callback=jQuery.fn.googleslides.prepare_' + settings.albumid + '&fields=link,entry(link,media:group(media:content,media:description))">' 
					+ '</sc' + 'ript>';
				
				var prepareFunCallback = 'jQuery.fn.googleslides.prepare_' + settings.albumid 
					+ ' = function(data) { $(".googleslides[albumid=' + settings.albumid + ']").googleslides("prepare", data); };';
				eval(prepareFunCallback);
				
				this.addClass('googleslides');
				$('body').append(albumJsonUrl);
			}
		},
		prepare: function (data) {
			var settings = this.data('googleslidesOptions');
			var i = data.feed.entry.length;
			var item, url, link, caption, slide;
			var slides = [];
			while (i--) {
				item = data.feed.entry[i];
				url = item.media$group.media$content[0].url;
				link = item.link[1].href;
				caption = item.media$group.media$description.$t;
				slide = $('<div class="googleslide"></div>');
				var slideInner = slide;
				if (settings.albumlink == true) {
					slide.append($('<a target="_blank" href="' + link + '"></a>'));
					slideInner = slide.children().first();
				}
				
				slideInner.append($('<img src="' + url + '" alt="' + caption + '"/>'));
				
				$("img", slideInner).width(settings.imgmax);
				if (settings.caption == true && caption != '') {
					slideInner.append('<div class="captionWrapper"><div class="caption">' + caption + '</div></div>');
					$(".captionWrapper", slideInner).width(settings.imgmax);
				}
				
				slides.push(slide);
			}
			
			if (settings.random == true) {
				slides.sort(methods.randomSort);
			}
			
			for (var i = 0; i < slides.length; i++) {
				this.append(slides[i]);
			}
			
			this.googleslides('start');
		},
		randomSort: function (a, b) {
			return (0.5 - Math.random());
		},
		start: function () {
			var settings = this.data('googleslidesOptions');
			
			this.find('.googleslide').first().fadeIn(settings.fadespeed);	
			
			var target = this;
			setInterval(function() {
				var first = target.find('.googleslide').first();
				//fade out with .animate() in case parent is hidden
				first.animate({opacity:0}, settings.fadespeed, function() {
					first.css('opacity', '');
					first.hide();
					first.next().fadeIn(settings.fadespeed, function() {
						first.appendTo(target);
					})
				})
			 }, settings.time);
		}
	}

  $.fn.googleslides = function(method) {  
		 // Method calling logic
		if ( methods[method] ) {
		  return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
		  return methods.init.apply( this, arguments );
		} else {
		  $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
		}    		
  };
})( jQuery );