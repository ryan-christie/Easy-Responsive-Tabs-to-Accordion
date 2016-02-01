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
                keyboard: true,
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
                    options.activate.call(currentTab, e)
                }
                if (options.keyboard) {
                    currentTab.focus();
                }
            });

            //Main function
            this.each(function () {
                var $respTabs = $(this).css({
                    'display': 'block',
                    'width': jwidth
                });
                var $respTabsList = $respTabs.children('ul').attr('role','tablist');
                var respTabsId = $respTabs.attr('id');
                var $respTabsItems = $respTabsList.children().addClass('resp-tab-item');

                if (options.type == 'vertical')
                    $respTabsList.css('margin-top', '3px');

                var $respTabsContainer = $respTabs.children('div').css('border-color', options.active_content_border_color);
                var $respTabsPanels = $respTabsContainer.children().addClass('resp-tab-content');
                jtab_options();
                //Properties Function
                function jtab_options() {
                    if (jtype == vtabs) {
                        $respTabs.addClass('resp-vtabs');
                    }
                    if (jfit == true) {
                        $respTabs.css({ width: '100%', margin: '0px' });
                    }
                    if (jtype == accord) {
                        $respTabs.addClass('resp-easy-accordion');
                        $respTabsList.css('display', 'none');
                    }
                }

                //Assigning the h2 markup to accordion title
                var tabIndex = options.keyboard ? " tabindex='0'" : '';
                $respTabsPanels.before("<h2 class='resp-accordion' role='tab'" + tabIndex + "><span class='resp-arrow'></span></h2>");

                var $respTabsH2 = $respTabsContainer.children("h2").css({
                    'background-color': options.inactive_bg,
                    'border-color': options.active_border_color
                });

                $respTabsH2.each(function (itemCount) {
                    var $tabItemh2 = $(this);
                    var $tabItem = $($respTabsItems[itemCount]);
                    var $accItem = $($respTabsH2[itemCount]);
                    $accItem.append($tabItem.html());
                    $accItem.data($tabItem.data());
                    $tabItemh2.attr({
                        'id': respTabsId + '-accord-' + (itemCount),
                        'aria-controls': respTabsId + '-container-' + (itemCount),
                        'aria-selected': 'false'
                    });
                });

                //Assigning the 'aria-controls' to Tab items
                var count = 0;
                $respTabsItems.each(function () {
                    var $tabItem = $(this);
                    $tabItem.attr({
                        'id': respTabsId + '-tab-' + (count),
                        'aria-controls': respTabsId + '-container-' + (count),
                        'role': 'tab', 
                        'aria-selected': 'false'
                    }).css({
                        'background-color': options.inactive_bg,
                        'border-color': 'none'
                    });

                    if (options.keyboard) {
                        $tabItem.attr('tabindex','0');
                    }

                    count++;
                });

                //Assigning the 'aria-labelledby' attr to tab-content
                $respTabsPanels.each(function (tabcount) {
                    $tabContent = $(this);
                    $tabContent.attr({
                        'id': respTabsId + '-container-' + (tabcount),
                        'aria-labelledby': respTabsId + '-tab-' + (tabcount),
                        'aria-hidden': 'true'
                    }).css({
                        'border-color': options.active_border_color
                    });
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
                $($respTabsItems[tabNum]).addClass('resp-tab-active').css({
                    'background-color': options.activetab_bg,
                    'border-color': options.active_border_color
                }).attr('aria-selected','true');

                //keep closed if option = 'closed' or option is 'accordion' and the element is in accordion mode
                if (options.closed !== true && !(options.closed === 'accordion' && !$respTabsList.is(':visible')) && !(options.closed === 'tabs' && $respTabsList.is(':visible'))) {
                    $($respTabsH2[tabNum]).addClass('resp-tab-active').css({
                        'background-color': options.activetab_bg + ' !important',
                        'border-color': options.active_border_color,
                        'background': 'none'
                    }).attr('aria-selected','true');

                    $($respTabsPanels[tabNum]).addClass('resp-tab-content-active').attr({
                        'style': 'display:block',
                        'aria-hidden': 'false'
                    });
                }

                var processEvent =  function(currentTab) {
                    var $currentTab = $(currentTab);
                    
                    var $tabAria = $currentTab.attr('aria-controls');

                    if ($currentTab.hasClass('resp-accordion') && $currentTab.hasClass('resp-tab-active')) {
                        $respTabsContainer.find('.resp-tab-content-active').slideUp('', function () {
                            $(this).addClass('resp-accordion-closed').removeAttr('style');
                        });
                        $currentTab.removeClass('resp-tab-active').css({
                            'background-color': options.inactive_bg,
                            'border-color': 'none'
                        }).attr('aria-selected','false');
                        return false;
                    }
                    if (!$currentTab.hasClass('resp-tab-active') && $currentTab.hasClass('resp-accordion')) {
                        $respTabs.children().children('.resp-tab-active')
                            .removeClass('resp-tab-active')
                            .css({
                                'background-color': options.inactive_bg,
                                'border-color': 'none'
                            })
                            .attr('aria-selected','false');
                        $respTabsContainer.find('.resp-tab-content-active')
                            .slideUp()
                            .removeClass('resp-tab-content-active resp-accordion-closed')
                            .attr('aria-hidden','true');
                        $respTabs.find("[aria-controls=" + $tabAria + "]")
                            .addClass('resp-tab-active').css({
                                'background-color': options.activetab_bg,
                                'border-color': options.active_border_color
                            })
                            .attr('aria-selected','true');

                        $respTabsContainer.find('#' + $tabAria)
                            .slideDown()
                            .addClass('resp-tab-content-active')
                            .attr('aria-hidden','false');
                    } else {
                        $respTabs.children().children('.resp-tab-active')
                            .removeClass('resp-tab-active')
                            .css({
                                'background-color': options.inactive_bg,
                                'border-color': 'none'
                            })
                            .attr('aria-selected','false');

                        $respTabsContainer.find('.resp-tab-content-active')
                            .removeAttr('style')
                            .removeClass('resp-tab-content-active')
                            .removeClass('resp-accordion-closed')
                            .attr('aria-hidden','true');

                        $respTabs.find("[aria-controls=" + $tabAria + "]")
                            .addClass('resp-tab-active')
                            .css({
                                'background-color': options.activetab_bg,
                                'border-color': options.active_border_color
                            })
                            .attr('aria-selected','true');

                        $respTabsContainer.find('#' + $tabAria)
                            .addClass('resp-tab-content-active')
                            .attr({
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

                // Setup events
                // $respTabsItems.click(function() {
                //     processEvent(this);
                // });
                // $respTabsH2.click(function() {
                //     processEvent(this);
                // });
                $.merge($respTabsItems, $respTabsH2)
                    .click(function() {
                        processEvent(this);
                    })
                    .keydown(function(e) {
                        if (options.keyboard) {
                            var key = e.keyCode;
                            if ( (key > 36 && key < 41) || key === 13) {
                                var $currentTab = $(this);
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
                        }
                    });
            });
        }
    });
})(jQuery);

