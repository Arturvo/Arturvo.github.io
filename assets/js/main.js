





(function($) {

	var	$window = $(window),
		$body = $('body');


		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});


		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});


		if (browser.mobile)
			$body.addClass('is-touch');


		var $form = $('form');


			$form.find('textarea').each(function() {

				var $this = $(this),
					$wrapper = $('<div class="textarea-wrapper"></div>'),
					$submits = $this.find('input[type="submit"]');

				$this
					.wrap($wrapper)
					.attr('rows', 1)
					.css('overflow', 'hidden')
					.css('resize', 'none')
					.on('keydown', function(event) {

						if (event.keyCode == 13
						&&	event.ctrlKey) {

							event.preventDefault();
							event.stopPropagation();

							$(this).blur();

						}

					})
					.on('blur focus', function() {
						$this.val($.trim($this.val()));
					})
					.on('input blur focus --init', function() {

						$wrapper
							.css('height', $this.height());

						$this
							.css('height', 'auto')
							.css('height', $this.prop('scrollHeight') + 'px');

					})
					.on('keyup', function(event) {

						if (event.keyCode == 9)
							$this
								.select();

					})
					.triggerHandler('--init');


					if (browser.name == 'ie'
					||	browser.mobile)
						$this
							.css('max-height', '10em')
							.css('overflow-y', 'auto');

			});


		var $menu = $('#menu');

		$menu.wrapInner('<div class="inner"></div>');

		$menu._locked = false;

		$menu._lock = function() {

			if ($menu._locked)
				return false;

			$menu._locked = true;

			window.setTimeout(function() {
				$menu._locked = false;
			}, 350);

			return true;

		};

		$menu._show = function() {

			if ($menu._lock())
				$body.addClass('is-menu-visible');

		};

		$menu._hide = function() {

			if ($menu._lock())
				$body.removeClass('is-menu-visible');

		};

		$menu._toggle = function() {

			if ($menu._lock())
				$body.toggleClass('is-menu-visible');

		};

		$menu
			.appendTo($body)
			.on('click', function(event) {
				event.stopPropagation();
			})
			.on('click', 'a', function(event) {

				var href = $(this).attr('href');

				event.preventDefault();
				event.stopPropagation();


					$menu._hide();


					if (href == '#menu')
						return;

					window.setTimeout(function() {
						window.location.href = href;
					}, 350);

			})
			.append('<a class="close" href="#menu">Close</a>');

		$body
			.on('click', 'a[href="#menu"]', function(event) {

				event.stopPropagation();
				event.preventDefault();


					$menu._toggle();

			})
			.on('click', function(event) {


					$menu._hide();

			})
			.on('keydown', function(event) {


					if (event.keyCode == 27)
						$menu._hide();

			});

})(jQuery);


(function() {
	var images = document.querySelectorAll('.game-contributions img');
	if (!images.length) return;

	var dialog = document.createElement('dialog');
	var enlargedImage = document.createElement('img');
	var sourceImage;
	dialog.className = 'contribution-zoom';
	dialog.setAttribute('aria-label', 'Enlarged contribution image. Click or press Escape to close.');
	dialog.setAttribute('tabindex', '-1');
	dialog.appendChild(enlargedImage);
	document.body.appendChild(dialog);

	function openImage(image) {
		sourceImage = image;
		enlargedImage.src = image.currentSrc || image.src;
		enlargedImage.alt = image.alt;
		dialog.showModal();
		document.body.classList.add('is-image-zoomed');
		dialog.focus();
	}

	images.forEach(function(image) {
		image.classList.add('is-zoomable');
		image.setAttribute('tabindex', '0');
		image.setAttribute('role', 'button');
		image.setAttribute('aria-haspopup', 'dialog');
		image.setAttribute('aria-label', 'Enlarge image' + (image.alt ? ': ' + image.alt : ''));
		image.addEventListener('click', function(event) {
			event.preventDefault();
			openImage(image);
		});
		image.addEventListener('keydown', function(event) {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				openImage(image);
			}
		});
	});

	dialog.addEventListener('click', function() { dialog.close(); });
	dialog.addEventListener('keydown', function(event) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			dialog.close();
		}
	});
	dialog.addEventListener('close', function() {
		document.body.classList.remove('is-image-zoomed');
		if (sourceImage) sourceImage.focus({ preventScroll: true });
		enlargedImage.removeAttribute('src');
	});
})();


(function() {
	var toggle = document.getElementById('contact-toggle');
	var dropdown = document.getElementById('contact-dropdown');
	if (!toggle || !dropdown) return;
	var copyButton = document.getElementById('copy-email');
	var email = document.getElementById('contact-email');
	var status = document.getElementById('copy-status');
	var statusTimer;

	function fallbackCopy(text) {
		var field = document.createElement('textarea');
		field.value = text;
		field.setAttribute('readonly', '');
		field.style.position = 'fixed';
		field.style.opacity = '0';
		dropdown.appendChild(field);
		field.select();
		try {
			if (!document.execCommand('copy')) throw new Error('Copy failed');
		} finally {
			field.remove();
			copyButton.focus();
		}
	}

	copyButton.addEventListener('click', async function() {
		clearTimeout(statusTimer);
		status.textContent = '';
		try {
			var text = email.textContent.trim();
			if (navigator.clipboard && window.isSecureContext) {
				try {
					await navigator.clipboard.writeText(text);
				} catch (error) {
					fallbackCopy(text);
				}
			} else {
				fallbackCopy(text);
			}
			status.textContent = 'Copied to clipboard!';
			statusTimer = setTimeout(function() { status.textContent = ''; }, 2500);
		} catch (error) {
			status.textContent = 'Unable to copy. Please select and copy the email.';
		}
	});

	function setOpen(open) {
		toggle.setAttribute('aria-expanded', String(open));
		dropdown.hidden = !open;
		if (!open) {
			clearTimeout(statusTimer);
			status.textContent = '';
		}
	}

	toggle.addEventListener('click', function() {
		setOpen(dropdown.hidden);
	});

	document.addEventListener('click', function(event) {
		if (!toggle.contains(event.target) && !dropdown.contains(event.target))
			setOpen(false);
	});

	document.addEventListener('keydown', function(event) {
		if (event.key === 'Escape' && !dropdown.hidden) {
			setOpen(false);
			toggle.focus();
		}
	});
})();
