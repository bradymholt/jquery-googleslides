(function( $ ){
	var defaults = {
			  'user'			 : '',
			  'albumid'			 : '',
			  'imgmax'           : 460,
			  'maxresults'		 : 100,
			  'random'			 : true,
			  'caption'			 : true,
			  'loadingimage'     : true,
			  'albumlink'		 : true,
			  'time'	 		 : 5000,
			  'fadespeed'		 : 1000
	};
			
	var methods = {
		init: function (options) {
		    var settings = $.extend({}, defaults, options);
			this.attr('albumid', settings.albumid);
			this.addClass('picasaSlides');
			this.width(settings.imgmax);
			
			if  (settings.loadingimage === true) {
				this.addClass('loading');
			}
			
			var albumJsonUrl = '<script src="https://picasaweb.google.com/data/feed/base/user/' + settings.user + '/albumid/' + settings.albumid 
				+ '?alt=json&kind=photo&max-results=' + settings.maxresults + '&hl=en_US&imgmax=' + settings.imgmax 
				+ '&callback=jQuery.fn.picasaSlides.prepare_' + settings.albumid + '&fields=link,entry(link,media:group(media:content,media:description))">' 
				+ '</sc' + 'ript>';
			
			var prepareFunCallback = 'jQuery.fn.picasaSlides.prepare_' + settings.albumid 
				+ ' = function(data) { $(".picasaSlides[albumid=' + settings.albumid + ']").picasaSlides("prepare", data); };';
			eval(prepareFunCallback);
			
			this.data('picasaSlidesOptions', settings);
			$('body').append(albumJsonUrl);
		},
		prepare: function (data) {
			var settings = this.data('picasaSlidesOptions');
			var i = data.feed.entry.length;
			var item, url, link, caption, slide;
			var slides = [];
			while (i--) {
				item = data.feed.entry[i];
				url = item.media$group.media$content[0].url;
				link = item.link[1].href;
				caption = item.media$group.media$description.$t;
				slide = $('<div class="picasaSlide"></div>');
				var slideInner = slide;
				if (settings.albumlink == true) {
					slide.append($('<a target="_blank" href="' + link + '"></a>'));
					slideInner = slide.children().first();
				}
				
				slideInner.append($('<img src="' + url + '" alt="' + caption + '"/>'));
				
				if (settings.caption == true && caption != '') {
					slideInner.append('<div class="captionWrapper"><div class="caption">' + caption + '</div></div>');
				}
				
				slides.push(slide);
			}
			
			if (settings.random == true) {
				slides.sort(methods.randomSort);
			}
			
			for (var i = 0; i < slides.length; i++) {
				this.append(slides[i]);
			}
			
			this.picasaSlides('start');
		},
		randomSort: function (a, b) {
			return (0.5 - Math.random());
		},
		start: function () {
			var settings = this.data('picasaSlidesOptions');
			
			this.find('.picasaSlide').first().fadeIn(settings.fadespeed);
				var target = $(this);
				setInterval(function() {
				  var first = target.find('.picasaSlide').first();
				  first.fadeOut(settings.fadespeed, function() { 
						first.next().fadeIn(settings.fadespeed, function() {
							first.appendTo(target);
						})
					 })
				 }, settings.time);
		}
	}

  $.fn.picasaSlides = function(method) {  
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