function toJSON(obj) {
  return obj !== null ? JSON.stringify(obj) : null;
}

var listener = {};

function register(evt, func, obj){
  listener[evt] = { "fn": func, "source": obj};
}
function unregister(evt){
  if(listener[evt]) delete listener[evt];
}
function dispatch(evt, arguments){
  if(listener[evt])
    listener[evt].fn.apply(this, [arguments]);
}

(function($) {
  $.showMessage = function(options){
      var msgTitle = (typeof(options.title) == "string") ? options.title : "Information";
      $("#message").html(options.content);
      if(options.callback)
      {
        $("#message-dialog").dialog('destroy');
        var i18nButtons = {};
        i18nButtons['Annuler'] = function() { $(this).dialog('close');  };
    	  i18nButtons['Okay'] = function() { $(this).dialog('close');  options.callback();  };
        $("#message-dialog").dialog({
          autoOpen: true,
          modal: true,
          buttons: i18nButtons
        });
      }
      else
      {
      	var i18nButtons = {};
        i18nButtons['Okay'] = function() { $(this).dialog('close');  };
        $("#message-dialog").dialog('destroy');
        $("#message-dialog").dialog({
          bgiframe: true,
          autoOpen: true,
          modal: true,
          buttons: i18nButtons
        });
      }
      $('message-dialog').dialog('option', 'position', 'center');
      $("#ui-dialog-title-message-dialog").html(msgTitle);
  };

  $.showPage = function(url, callback){
    var d = new Date();
    if($('#main'))
	    $('#main').html('Loading...').load(url, function(){ callback(); });
  };

  $.queryString = function(name)
  {
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results == null )
      return "";
    else
      return decodeURIComponent(results[1].replace(/\+/g, " "));
  };

  $.getUri = function(){
    var uri = self.location.hash;
    if(uri.length > 0)
    {
      uri = uri.substr(1);
      return (uri.substr(-1) == "/") ? uri.substr(0,uri.length -1) : uri;
    }
    else
      return null;
  };
  $.escapeHtml = function(str){
    return $('<div/>').text(str).html();
  };
  $.log=function(){
    if(window.console&&window.console.log)
    {
      console.log.apply(window.console,arguments);
    }
  };
  $.fn.log=function(){
    a.log(this);
    return this;
  }
})(jQuery);

'use strict';

// Add ECMA262-5 method binding if not supported natively
//
if (!('bind' in Function.prototype)) {
    Function.prototype.bind= function(owner) {
        var that= this;
        if (arguments.length<=1) {
            return function() {
                return that.apply(owner, arguments);
            };
        } else {
            var args= Array.prototype.slice.call(arguments, 1);
            return function() {
                return that.apply(owner, arguments.length===0? args : args.concat(Array.prototype.slice.call(arguments)));
            };
        }
    };
}

// Add ECMA262-5 string trim if not supported natively
//
if (!('trim' in String.prototype)) {
    String.prototype.trim= function() {
        return this.replace(/^\s+/, '').replace(/\s+$/, '');
    };
}

// Add ECMA262-5 Array methods if not supported natively
//
if (!('indexOf' in Array.prototype)) {
    Array.prototype.indexOf= function(find, i /*opt*/) {
        if (i===undefined) i= 0;
        if (i<0) i+= this.length;
        if (i<0) i= 0;
        for (var n= this.length; i<n; i++)
            if (i in this && this[i]===find)
                return i;
        return -1;
    };
}
if (!('lastIndexOf' in Array.prototype)) {
    Array.prototype.lastIndexOf= function(find, i /*opt*/) {
        if (i===undefined) i= this.length-1;
        if (i<0) i+= this.length;
        if (i>this.length-1) i= this.length-1;
        for (i++; i-->0;) /* i++ because from-argument is sadly inclusive */
            if (i in this && this[i]===find)
                return i;
        return -1;
    };
}
if (!('forEach' in Array.prototype)) {
    Array.prototype.forEach= function(action, that /*opt*/) {
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this)
                action.call(that, this[i], i, this);
    };
}
if (!('map' in Array.prototype)) {
    Array.prototype.map= function(mapper, that /*opt*/) {
        var other= new Array(this.length);
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this)
                other[i]= mapper.call(that, this[i], i, this);
        return other;
    };
}
if (!('filter' in Array.prototype)) {
    Array.prototype.filter= function(filter, that /*opt*/) {
        var other= [], v;
        for (var i=0, n= this.length; i<n; i++)
            if (i in this && filter.call(that, v= this[i], i, this))
                other.push(v);
        return other;
    };
}
if (!('every' in Array.prototype)) {
    Array.prototype.every= function(tester, that /*opt*/) {
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this && !tester.call(that, this[i], i, this))
                return false;
        return true;
    };
}
if (!('some' in Array.prototype)) {
    Array.prototype.some= function(tester, that /*opt*/) {
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this && tester.call(that, this[i], i, this))
                return true;
        return false;
    };
}
if(!('unique' in Array.prototype)) {
  Array.prototype.unique = function() {
    var a = [];
    var l = this.length;
    for(var i=0; i<l; i++) {
      for(var j=i+1; j<l; j++) {
        // If this[i] is found later in the array
        if (this[i] === this[j])
          j = ++i;
      }
      a.push(this[i]);
    }
    return a;
  };
}