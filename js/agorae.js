(function($) {
  function Session() {
    function login(){
      $.showDialog("dialog/_login.html", {
        modal: true,
        submit: function(data, callback) {
          if (!validateLoginForm(data, callback)) return;
          $.agorae.login(data.config, data.name, data.password, callback);
        }
      });
      return false;
    };

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
    };

    this.init = function(){
      login();
    };
  }

  $.agorae = $.agorae || {};
  $.extend($.agorae, {
    session : new Session()
  });
})(jQuery);