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
        callback({
            config: "Please enter a correct configuration document URL."});
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

  function FrontPage(){
    function loadItem(index, item){
      $.agorae.getItem(item, function(item){
        var el = $('<li>' + item.name + '</li>').attr("rel", item.id)
                  .data("item", item);
        $('ul#index-item').append(el);
      });
    }
    function loadViewpoint(index, viewpoint){
      $.agorae.getViewpoint(viewpoint, function(viewpoint){
        var el = $('<li>' + viewpoint.name + '</li>')
                  .attr("rel", viewpoint.id).data("viewpoint", viewpoint);
        $('ul#index-viewpoint').append(el);
      });
    }
    function loadUser(index, server){
      $.agorae.getUser(server, $.agorae.config.username, function(user){
        if(user.viewpoint)
          for(var i=0, viewpoint; viewpoint = user.viewpoint[i]; i++){
            var el = $('<li class="editable">' + viewpoint.name + '</li>')
                  .attr("rel", viewpoint.id).data("viewpoint", viewpoint);
            $('ul#index-viewpoint').append(el);
          }
      });
    }

    this.init = function(){
      $.each($.agorae.config.items, loadItem);
      $.each($.agorae.config.viewpoints, loadViewpoint);
      $.each($.agorae.config.servers, loadUser);
      $('input#index-edit-toggle').iToggle({
    		easing: 'easeOutExpo',
    		type: 'radio',
    		keepLabel: true,
    		easing: 'easeInExpo',
    		speed: 300,
    		onClickOn: function(){
    			//Function here
    		},
    		onClickOff: function(){
    			//Function here
    		}
    	});
    }
  }
  $.agorae = $.agorae || {};
  $.extend($.agorae, {
    session : new Session(),
    frontpage : new FrontPage()
  });
})(jQuery);