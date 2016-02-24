/**
 * quikselect2.js
 * @version: v0.0.1
 * @author: Grigory Panov
 *
 * Copyright (c) 2016 Grigory Panov grigory.panov@gmail.com
 *
 * The MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

'use strict';

(function (factory) {

    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery || Zepto);
    }

}(function ($) {

    var QuickSelect = function (el, data) {
        el = $(el);
        var idList = el.attr('id') +'_list';
        var resultsList;
          var p = {

        	createList: function(){
        		try {
        			$('#'+idList).remove();
        			resultsList = $("<div>").attr("id", idList).addClass("quickselect_results").hide();
                    el.parent().append(resultsList);
        	    }catch(e){console.error(e)}
        	},

        	showResults: function(){
        		 try {
        		    var selectedOption = p.getSelectedOption();

                    resultsList.empty();
                    var filteredData = data.filter(function(text) {
                       return text.contains(el.val());
                    });
					if(filteredData.length > 0){
						if($.inArray(el.val(), filteredData) == -1){
							resultsList.append($("<ul/>"));

							filteredData.forEach(function(item){
								var li = $("<li/>");
								li.text(item)
									.mousedown(p.clickOption)
									.hover(function () {
									  	$(this).addClass(globals.selectedCssClass);
									}, function () {
									  	$(this).removeClass(globals.selectedCssClass);
									});
								if(selectedOption == item){
									li.addClass(globals.selectedCssClass);
								}
								resultsList.append(li);
							});
							resultsList.width(el.width())
							resultsList.css(
								{
									top: el.offset().top + el.height() + 5 + "px",
									left: el.offset().left + "px"
								}
							);
							resultsList.show();
						}
                    }
        		 }catch(e){console.error(e)}
        	},
        	hideResults: function(){
				resultsList.hide().empty();
        	},
            clickOption : function(e){
            	p.val($(this).text());
            },
            events: function() {
                el
                .on('input.qs keyup.qs', p.behaviour)

//                .on('paste.mask drop.mask', function() {
//                                    setTimeout(function() {
//                                        el.keydown().keyup();
//                                    }, 100);
//                                })

                .on('blur.qs', function() {
                    p.hideResults();
                })
                .on('focus.qs', function (e) {
                    p.showResults();
                })
                .on('focusout.qs', function() {
                    p.hideResults();
                });
            },
            destroyEvents: function() {
                el.off(['input', 'keyup', 'blur', 'focus', 'focusout', ''].join('.qs '));
            },
            behaviour: function(e) {
				p.showResults();
                var keyCode = e.keyCode || e.which;
                switch(e.keyCode){
                	case 38: // Up arrow
                        e.preventDefault();
                        p.prevSelectedOption();
                    	break;
                    case 40: // Down arrow
                        e.preventDefault();
 					    p.nextSelectedOption();
                    	break;
                    case 13: // Enter/Return
                        var selectedOption = p.getSelectedOption()
                        if(selectedOption){
							e.preventDefault();
							p.val(selectedOption);
							p.hideResults();
							el.select();
                        }
                    	break;
		  		    case 9:  // Tab
//						var selectedOption = p.getSelectedOption()
//                        if(selectedOption){
//							p.val(selectedOption);
//							p.hideResults();
//						}
						break;
                    case 27: // Esc
                    	p.hideResults();
                    	break;
                }
            },
            val : function(newVal){
            	el.val(newVal);
            	setTimeout(function() {
            			el.keydown().keyup();
            	}, 100);
            },

            prevSelectedOption : function(){
            	var list = resultsList.find("li." + globals.selectedCssClass);
            	if(list.length != 0 && list.prev().length != 0 && list.prev().is("li")){
            		list.removeClass(globals.selectedCssClass);
            		list.prev().addClass(globals.selectedCssClass);
            	}
            },
            nextSelectedOption : function(){
            	var list = resultsList.find("li." + globals.selectedCssClass);
            	if(list.length == 0){
            	    resultsList.find("li").first().addClass(globals.selectedCssClass);
            	}else{
            		if(list.next().length != 0){
						list.removeClass(globals.selectedCssClass);
						list.next().addClass(globals.selectedCssClass);
					}
            	}

            },
            getSelectedOption : function(){
               return resultsList.find("li." + globals.selectedCssClass).text();
            }
        };

        // public methods
        QuickSelect.remove = function() {
            p.destroyEvents();
            return el;
        };

       QuickSelect.init = function(isInput) {
       		isInput = isInput || true;
            if(isInput){
                p.createList();
                p.events();
            }
        };

       QuickSelect.init(el.is('input'));
    };

    $.fn.quickselect = function(data) {
		var qs = new QuickSelect(this.selector, data.data);
		$(this.selector).data('quickselect', qs);
        return this;
    };

	var globals = {
            selectedCssClass: 'quickselect_selected'

    };

}));
