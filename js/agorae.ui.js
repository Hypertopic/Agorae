(function($) {
  $.agorae = $.agorae || {};
  $.agorae.ui = $.agorae.ui || {};

  $.extend($.agorae.ui, {
    targetDiv : "#main",

    login: function(){
      $.showDialog("dialog/_login.html", {
        submit: function(data, callback) {
          if (!validateLoginForm(data, callback)) return;
          alert(data.name, data.password);
        }
      });
      return false;
    }
  });

  function validateLoginForm(data, callback) {
    if (!data.config || data.config.length == 0) {
      callback({config: "Please enter a correct configuration document URL."});
      return false;
    };
    if (!data.name || data.name.length == 0) {
      callback({name: "Please enter a name."});
      return false;
    };
    if (!data.password || data.password.length == 0) {
      callback({password: "Please enter a password."});
      return false;
    };
    return true;
  }
})(jQuery);