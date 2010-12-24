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
