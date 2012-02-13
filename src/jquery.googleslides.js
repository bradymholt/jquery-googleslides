(function( $ ){
	var methods = {
		init: function (options) {
			console.log(this);
			
			this.attr('albumid', options.albumid);
			this.attr('albumlink', options.albumlink);
			this.attr('random', options.random);
			this.attr('caption', options.caption);
			this.attr('fadespeed', options.fadespeed);
			this.attr('time', options.time);
			
			this.addClass('picasaSlides');
			this.width(options.imgmax);
			
			if  (options.loadingimage === true) {
				this.addClass('loading');
			}
			
			var albumJsonUrl = '<script src="https://picasaweb.google.com/data/feed/base/user/' + options.user + '/albumid/' + options.albumid 
				+ '?alt=json&kind=photo&max-results=' + options.maxresults + '&hl=en_US&imgmax=' + options.imgmax 
				+ '&callback=jQuery.fn.picasaSlides.prepare_' + options.albumid + '&fields=link,entry(link,media:group(media:content,media:description))">' 
				+ '</sc' + 'ript>';
			
			eval('jQuery.fn.picasaSlides.prepare_' + options.albumid 
				+ ' = function(data) { console.log("' + options.albumid + '"); $(".picasaSlides[albumid=' + options.albumid + ']").picasaSlides("prepare", data); };');
			
			$('body').append(albumJsonUrl);
		},
		prepare: function (data) {
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
				if (this.attr('albumlink') == "true") {
					slide.append($('<a target="_blank" href="' + link + '"></a>'));
					slideInner = slide.children().first();
				}
				
				slideInner.append($('<img src="' + url + '" alt="' + caption + '"/>'));
				
				if (this.attr('caption') == "true" && caption != '') {
					slideInner.append('<div class="captionWrapper"><div class="caption">' + caption + '</div></div>');
				}
				
				slides.push(slide);
			}
			
			if (this.attr('random') == "true") {
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
			var fadespeed = this.attr('fadespeed');
			var time = this.attr('time');
			
			$(this).find('.picasaSlide').first().fadeIn(fadespeed);
				var target = $(this);
				setInterval(function() {
				  var first = target.find('.picasaSlide').first();
				  first.fadeOut(fadespeed, function() { 
						first.next().fadeIn(fadespeed, function() {
							first.appendTo(target);
						})
					 })
				 }, time);
		}
	}

  $.fn.picasaSlides = function(method) {  
		if ( methods[method] ) {
		    return methods[ method ].apply( this,  Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			arguments[0] = $.extend(defaults, arguments[0]);
		    return methods.init.apply(this, arguments);
		} else {
		  $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
		}   		
  };
  
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
})( jQuery );