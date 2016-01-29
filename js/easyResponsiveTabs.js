// Easy Responsive Tabs Plugin
// Author: Samson.Onna <Email : samson3d@gmail.com> 
(function ($) {
    $.fn.extend({
        easyResponsiveTabs: function (options) {
            //Set the default values, use comma to separate the settings, example:
            var defaults = {
                type: 'default', //default, vertical, accordion;
                width: 'auto',
                fit: true,
                closed: false,
                tabidentify: '',
                activetab_bg: 'white',
                inactive_bg: '#F5F5F5',
                active_border_color: '#c1c1c1',
                active_content_border_color: '#c1c1c1',
                activate: function () {
                }
            }
            //Variables
            var options = $.extend(defaults, options);
            var opt = options, jtype = opt.type, jfit = opt.fit, jwidth = opt.width, vtabs = 'vertical', accord = 'accordion';
            var hash = window.location.hash;
            var historyApi = !!(window.history && history.replaceState);

            //Events
            $(this).bind('tabactivate', function (e, currentTab) {
                if (typeof options.activate === 'function') {
                    options.activate.call(currentTab, e);
                    currentTab.focus();
                }
            });

            //Main function
            this.each(function () {
                var $respTabs = $(this);
                var $respTabsList = $respTabs.find('ul.resp-tabs-list.' + options.tabidentify).attr('role','tablist');
                var respTabsId = $respTabs.attr('id');
                $respTabs.find('ul.resp-tabs-list.' + options.tabidentify + ' li').addClass('resp-tab-item').addClass(options.tabidentify);
                $respTabs.css({
                    'display': 'block',
                    'width': jwidth
                });

                if (options.type == 'vertical')
                    $respTabsList.css('margin-top', '3px');

                $respTabs.find('.resp-tabs-container.' + options.tabidentify).css('border-color', options.active_content_border_color);
                $respTabs.find('.resp-tabs-container.' + options.tabidentify + ' > div').addClass('resp-tab-content').addClass(options.tabidentify);
                jtab_options();
                //Properties Function
                function jtab_options() {
                    if (jtype == vtabs) {
                        $respTabs.addClass('resp-vtabs').addClass(options.tabidentify);
                    }
                    if (jfit == true) {
                        $respTabs.css({ width: '100%', margin: '0px' });
                    }
                    if (jtype == accord) {
                        $respTabs.addClass('resp-easy-accordion').addClass(options.tabidentify);
                        $respTabs.find('.resp-tabs-list').css('display', 'none');
                    }
                }

                //Assigning the h2 markup to accordion title
                var $tabItemh2;
                $respTabs.find('.resp-tab-content.' + options.tabidentify).before("<h2 class='resp-accordion " + options.tabidentify + "' role='tab' tabindex='0'><span class='resp-arrow'></span></h2>");

                $respTabs.find('.resp-tab-content.' + options.tabidentify).prev("h2").css({
                    'background-color': options.inactive_bg,
                    'border-color': options.active_border_color
                });

                var itemCount = 0;
                $respTabs.find('.resp-accordion').each(function () {
                    $tabItemh2 = $(this);
                    var $tabItem = $respTabs.find('.resp-tab-item:eq(' + itemCount + ')');
                    var $accItem = $respTabs.find('.resp-accordion:eq(' + itemCount + ')');
                    $accItem.append($tabItem.html());
                    $accItem.data($tabItem.data());
                    // $tabItemh2.attr('aria-controls', options.tabidentify + '_tab_item-' + (itemCount));
                    $tabItemh2.attr({
                        'aria-controls': respTabsId + '-container-' + (itemCount),
                        'aria-selected': 'false'
                    });
                    itemCount++;
                });

                //Assigning the 'aria-controls' to Tab items
                var count = 0,
                    $tabContent;
                $respTabs.find('.resp-tab-item').each(function () {
                    $tabItem = $(this);
                    // $tabItem.attr('aria-controls', options.tabidentify + '_tab_item-' + (count));
                    $tabItem.attr('aria-controls', respTabsId + '-container-' + (count));
                    // $tabItem.attr('role', 'tab');
                    $tabItem.attr({
                        role: 'tab', 
                        id: respTabsId + '-tab-' + (count), 
                        tabindex:'0',
                        'aria-selected': 'false'
                    });
                    $tabItem.css({
                        'background-color': options.inactive_bg,
                        'border-color': 'none'
                    });

                    //Assigning the 'aria-labelledby' attr to tab-content
                    var tabcount = 0;
                    $respTabs.find('.resp-tab-content.' + options.tabidentify).each(function () {
                        $tabContent = $(this);
                        $tabContent.attr({
                            'id': respTabsId + '-container-' + (tabcount),
                            'aria-labelledby': respTabsId + '-tab-' + (tabcount),
                            'aria-hidden': 'true'
                        }).css({
                            'border-color': options.active_border_color
                        }).attr('role','tabpanel');
                        tabcount++;
                    });
                    count++;
                });

                // Show correct content area
                var tabNum = 0;
                if (hash != '') {
                    var matches = hash.match(new RegExp(respTabsId + "([0-9]+)"));
                    if (matches !== null && matches.length === 2) {
                        tabNum = parseInt(matches[1], 10) - 1;
                        if (tabNum > count) {
                            tabNum = 0;
                        }
                    }
                }



                //Active correct tab
                $($respTabs.find('.resp-tab-item.' + options.tabidentify)[tabNum]).addClass('resp-tab-active').css({
                    'background-color': options.activetab_bg,
                    'border-color': options.active_border_color
                }).attr('aria-selected','true');

                //keep closed if option = 'closed' or option is 'accordion' and the element is in accordion mode
                if (options.closed !== true && !(options.closed === 'accordion' && !$respTabsList.is(':visible')) && !(options.closed === 'tabs' && $respTabsList.is(':visible'))) {
                    $($respTabs.find('.resp-accordion.' + options.tabidentify)[tabNum]).addClass('resp-tab-active').css({
                        'background-color': options.activetab_bg + ' !important',
                        'border-color': options.active_border_color,
                        'background': 'none'
                    }).attr('aria-selected','true');

                    $($respTabs.find('.resp-tab-content.' + options.tabidentify)[tabNum]).addClass('resp-tab-content-active').addClass(options.tabidentify).attr({
                        'style': 'display:block',
                        'aria-hidden': 'false'
                        });
                }
                //assign proper classes for when tabs mode is activated before making a selection in accordion mode
                else {
                   // $($respTabs.find('.resp-tab-content.' + options.tabidentify)[tabNum]).addClass('resp-accordion-closed'); //removed resp-tab-content-active
                }

                // Move event logic into it's own function for re-use
                var processEvent = function (currentTab) {
                    var $currentTab = $(currentTab);
                    var $tabAria = $currentTab.attr('aria-controls');

                    if ($currentTab.hasClass('resp-accordion') && $currentTab.hasClass('resp-tab-active')) {
                        $respTabs.find('.resp-tab-content-active.' + options.tabidentify).slideUp('', function () {
                            $(this).addClass('resp-accordion-closed');
                        });
                        $currentTab.removeClass('resp-tab-active').css({
                            'background-color': options.inactive_bg,
                            'border-color': 'none'
                        }).attr('aria-selected','false');
                        return false;
                    }
                    if (!$currentTab.hasClass('resp-tab-active') && $currentTab.hasClass('resp-accordion')) {
                        $respTabs.find('.resp-tab-active.' + options.tabidentify).removeClass('resp-tab-active').css({
                            'background-color': options.inactive_bg,
                            'border-color': 'none'
                        }).attr('aria-selected','false');
                        $respTabs.find('.resp-tab-content-active.' + options.tabidentify).slideUp().removeClass('resp-tab-content-active resp-accordion-closed').attr('aria-hidden','true');
                        $respTabs.find("[aria-controls=" + $tabAria + "]").addClass('resp-tab-active').css({
                            'background-color': options.activetab_bg,
                            'border-color': options.active_border_color
                        }).attr('aria-selected','true');
                        // console.log('#' + $tabAria);
                        $respTabs.find('#' + $tabAria).slideDown().addClass('resp-tab-content-active').attr('aria-hidden','false');
                    } else {
                        // console.log('here');
                        // console.log('#' + $tabAria);
                        $respTabs.find('.resp-tab-active.' + options.tabidentify).removeClass('resp-tab-active').css({
                            'background-color': options.inactive_bg,
                            'border-color': 'none'
                        }).attr('aria-selected','false');

                        $respTabs.find('.resp-tab-content-active.' + options.tabidentify).removeAttr('style').removeClass('resp-tab-content-active').removeClass('resp-accordion-closed').attr('aria-hidden','true');

                        $respTabs.find("[aria-controls=" + $tabAria + "]").addClass('resp-tab-active').css({
                            'background-color': options.activetab_bg,
                            'border-color': options.active_border_color
                        }).attr('aria-selected','true');

                        $respTabs.find('#' + $tabAria).addClass('resp-tab-content-active').attr({
                            'style': 'display:block',
                            'aria-hidden': 'false'
                        });
                    }
                    //Trigger tab activation event
                    $currentTab.trigger('tabactivate', $currentTab);

                    //Update Browser History
                    if (historyApi) {
                        var currentHash = window.location.hash;
                        var tabAriaParts = $tabAria.split('-container-');
                        var newHash = respTabsId + (parseInt(tabAriaParts[1], 10) + 1).toString();
                        if (currentHash != "") {
                            var re = new RegExp(respTabsId + "[0-9]+");
                            if (currentHash.match(re) != null) {
                                newHash = currentHash.replace(re, newHash);
                            }
                            else {
                                newHash = currentHash + "|" + newHash;
                            }
                        }
                        else {
                            newHash = '#' + newHash;
                        }

                        history.replaceState(null, null, newHash);
                    }
                }


                //Tab Click action function
                $respTabs.find("[role=tab]").each(function () {

                    var $currentTab = $(this);

                    // Keyboard events
                    $currentTab.keydown('keydown', function (e) {
                        var key = e.keyCode;
                        if ( (key > 36 && key < 41) || key === 13) {
                            var tabActive = $currentTab.hasClass('resp-tab-active');
                            var inAccordion = $currentTab.hasClass('resp-accordion');
                            var inVtabs = options.type === 'vertical';

                            if (tabActive) {
                                switch (key) {
                                    case 37:
                                        if (!inAccordion && !inVtabs) {
                                           var $prev =  $currentTab.prev();
                                           if ($prev.length) {
                                                e.preventDefault();
                                                processEvent($prev);
                                           }
                                        }
                                        break;
                                    case 38:
                                        if (inAccordion || inVtabs) {
                                           var $prev =  inAccordion ? $currentTab.prev().prev() : $currentTab.prev();
                                           if ($prev.length) {
                                                e.preventDefault();
                                                processEvent($prev);
                                           }
                                        }
                                        break;
                                    case 39:
                                        if (!inAccordion && !inVtabs) {
                                           var $next =  $currentTab.next();
                                           if ($next.length) {
                                                e.preventDefault();
                                                processEvent($next);
                                           }
                                        }
                                        break;
                                    case 40:
                                        if (inAccordion || inVtabs) {
                                           var $next = inAccordion ? $currentTab.next().next() :$currentTab.next();
                                           if ($next.length) {
                                                e.preventDefault();
                                                processEvent($next);
                                           }
                                        }
                                        break;
                                };
                            }
                            if (key === 13 || (key === 13 && inAccordion) ) {
                                e.preventDefault();
                                processEvent($currentTab);
                            }
                        }
                    });

                    $currentTab.click(function () {
                        // Process tab event
                        processEvent(this);
                    });

                });

                //Window resize function                   
                $(window).resize(function () {
                    $respTabs.find('.resp-accordion-closed').removeAttr('style');
                });
            });
        }
    });
})(jQuery);

