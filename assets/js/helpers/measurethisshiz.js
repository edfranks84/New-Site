/* 
  MeasureThisShiz
  Author: by Mat Doidge
  Updated: 15th June 2015
  Version: 0.1.0
*/
  
(function($){

  var defaults = {
    background_color: 'yellow',
    text_color: "blue",
    padding: 10
  };

  // constructor
  var MeasureThisShiz = function(el, options) {
    this.el = $(el);
    this.settings = $.extend({}, defaults, options);

    // save a reference to the MeasureThisShiz instance
    this.el.data('MeasureThisShiz', this);
    this.initialize();
  };

  MeasureThisShiz.prototype.initialize = function() {
    this.setVars();
    this.wrapDom();
    this.createNavigation();
    this.applyStyles();
    this.bindEvents();
    this.setSize();
  };

  MeasureThisShiz.prototype.setVars = function() {
    var s = this.settings;
  };

  MeasureThisShiz.prototype.wrapDom = function() {
    var measure = '<div id="measurements">' +
  '</div>';

    this.el.prepend(measure);
    this.elContainer = this.el.find("#measurements");
    //this.elChild = this.el.children();
  };
  
  MeasureThisShiz.prototype.applyStyles = function() {
    this.elContainer.css({
      'background-color': this.settings.background_color,
      'color': this.settings.text_color,
      'position': "fixed",
      'display': "inline-block",
      'top': 0,
      'width': "auto",
      'z-index': 999,
      'left': 0,
      'padding': "10px"
    });
  };

  MeasureThisShiz.prototype.createNavigation = function() {
    this.elContainer.append('<span class="width">Width:</span>');
    this.elContainer.append('<span class="height">Height:</span>');
    this.widthCalcW = this.elContainer.find('.width');
    this.widthCalcH = this.elContainer.find('.height');
  };

  MeasureThisShiz.prototype.bindEvents = function() {

      $(window).on('resize',
        this.setSize.bind(this)
      )
  };

  MeasureThisShiz.prototype.setSize = function() {
    var windowWidth  = $(window).width();
    var windowHeight = $(window).height();

    this.widthCalcW.html("Width:" + "<strong>" + windowWidth + "</strong>" + " ");
    this.widthCalcH.html("Height:" + "<strong>" + windowHeight + "</strong>");
  };

  $.fn.MeasureThisShiz = function (options) {
    return this.each(function () {
      return new MeasureThisShiz(this, options);
    })
  }
})(jQuery);
