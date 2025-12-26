(function ($) {
    $.fn.fontZoomer = function (options) {
        var settings = $.extend({
            step: 10,
            minZoom: 80,
            maxZoom: 150,
            container: "html",
            position: "right", // 'left', 'right', 'bottom-right'
            useCookies: true,
            cookieName: "fontZoom",
            cookieDays: 30,
            tooltips: true,
            scope: "site" // 'site' or 'blog'
        }, options);

        // If blog scope, use blog container
        if (settings.scope === "blog") {
            var $blogContainer = $(".blog-basic-grid-item-wrapper .sqs-block-content, .blog-item-wrapper");
            if ($blogContainer.length === 0) return this;
            settings.container = $blogContainer;
        }

        // Cookie helpers
        function setCookie(name, value, days) {
            var d = new Date();
            d.setTime(d.getTime() + (days*24*60*60*1000));
            document.cookie = name + "=" + value + ";path=/;expires=" + d.toUTCString();
        }

        function getCookie(name) {
            var value = "; " + document.cookie;
            var parts = value.split("; " + name + "=");
            if(parts.length === 2) return parts.pop().split(";").shift();
            return null;
        }

        // Load saved zoom
        var currentZoom = 100;
        if (settings.useCookies) {
            var savedZoom = getCookie(settings.cookieName);
            if (savedZoom) currentZoom = parseInt(savedZoom);
        } else if (localStorage.getItem("fontZoom")) {
            currentZoom = parseInt(localStorage.getItem("fontZoom"));
        }

        // Toolbar SVG
        var toggleSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 23" width="36" height="23"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-width="2"><path stroke-linejoin="round" d="M26.58 21.3225806V1m-7.92 4.06451613V1H34.5v4.06451613"/><path d="M22.62 21.3225806h7.92"/><path stroke-linejoin="round" d="M6.78 18.6129032V5.06451613M1.5 7.77419355V5.06451613h10.56v2.70967742"/><path d="M4.14 18.6129032h5.28"/></g></svg>';

        var tooltipClass = settings.tooltips ? 'tooltip-enabled' : '';

        // Create toolbar
        var $controls = $('<div class="fontzoom-controls fontzoom-floating '+tooltipClass+'">' +
            '<button class="fz-toggle" title="Font Options">' + toggleSVG + '</button>' +
            '<div class="fontzoom-buttons">' +
            '<button class="fz-in" data-tooltip="Increase Font Size">A+</button>' +
            '<button class="fz-reset" data-tooltip="Reset Font Size">A</button>' +
            '<button class="fz-out" data-tooltip="Decrease Font Size">A-</button>' +
            '</div></div>');

        $('body').append($controls);

        // Position toolbar
        function setPosition() {
            if ($(window).width() > 767) {
                switch(settings.position) {
                    case 'left':
                        $controls.css({top:'50%', left:'20px', bottom:'auto', right:'auto', transform:'translateY(-50%)'});
                        $controls.find('button').addClass('tooltip-right');
                        break;
                    case 'right':
                        $controls.css({top:'50%', right:'20px', bottom:'auto', left:'auto', transform:'translateY(-50%)'});
                        $controls.find('button').addClass('tooltip-left');
                        break;
                    case 'bottom-right':
                    default:
                        $controls.css({bottom:'20px', right:'20px', top:'auto', left:'auto', transform:'none'});
                        $controls.find('button').addClass('tooltip-left');
                        break;
                }
            } else {
                $controls.css({bottom:'20px', right:'20px', top:'auto', left:'auto', transform:'none'});
            }
        }
        setPosition();
        $(window).on('resize', setPosition);

        // Update zoom
        function updateZoom() {
            $(settings.container).css('font-size', currentZoom + '%');
            if(settings.useCookies){
                setCookie(settings.cookieName, currentZoom, settings.cookieDays);
            } else {
                localStorage.setItem('fontZoom', currentZoom);
            }
        }

        // Button handlers
        $controls.on('click', '.fz-in', function(){ currentZoom = Math.min(currentZoom + settings.step, settings.maxZoom); updateZoom(); });
        $controls.on('click', '.fz-out', function(){ currentZoom = Math.max(currentZoom - settings.step, settings.minZoom); updateZoom(); });
        $controls.on('click', '.fz-reset', function(){ currentZoom = 100; updateZoom(); });

        // Mobile toggle
        $controls.on('click', '.fz-toggle', function(e){
            if($(window).width() <= 767){
                e.stopPropagation();
                $controls.toggleClass('expanded');
            }
        });
        $controls.on('click', '.fontzoom-buttons button', function(e){ e.stopPropagation(); });

        // Close toolbar on outside click (mobile)
        $(document).on('click', function(){
            if($(window).width() <= 767) $controls.removeClass('expanded');
        });

        // Initial zoom
        updateZoom();

        return this;
    };
})(jQuery);
