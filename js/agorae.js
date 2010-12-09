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

    function apendViewpoint(viewpoint, server){
      server = server || $.agorae.config.servers[0];
      var el = $('<li><img class="del ctl hide" '
                   + 'src="css/blitzer/images/delete.png"><span '
                   + 'class="editable">' + viewpoint.name + '</span></li>')
                   .attr("rel", viewpoint.id).data("viewpoint", viewpoint)
                   .data("server", server);
      $('ul#index-viewpoint').append(el);
    }

    function loadUser(index, server){
      $.agorae.getUser(server, $.agorae.config.username, function(user){
        if(user.viewpoint)
          for(var i=0, viewpoint; viewpoint = user.viewpoint[i]; i++){
            apendViewpoint(viewpoint, server);
          }
      });
    }

    function checkStatus(){
      $.log($('#index-edit-toggle').attr('checked'));
      if($('#index-edit-toggle').attr('checked'))
        $('.ctl').show();
      else
        $('.ctl').hide();
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
    			$('.ctl').show();
    		},
    		onClickOff: function(){
    		  $('.ctl').hide();
    		}
    	});

    	$('div.viewpoint-list img.add').live('click', function(){
    	  $.log('add viewpoint');
        $.agorae.createViewpoint('no name', function(doc){
          apendViewpoint(doc);
          checkStatus();
        });
    	});

    	$('ul#index-viewpoint img.del').live('click', function(){
    	  $.log('del viewpoint');
    	  var viewpoint = $(this).parent().data('viewpoint');
    	  var server = $(this).parent().data('server');
    	  $.log(viewpoint);
    	  var url = server + viewpoint.id;
    	  $.log(url);
    	  var self = $(this);
    	  $.agorae.delete(url, function(){
    	    self.parent().remove();
    	  });
    	});

      $('ul#index-viewpoint span.editable').live('click', function(){
        var viewpointName = $(this).text();
        $.log(viewpointName);
        var el = $('<input type="textbox">').val(viewpointName);
    	  $(this).replaceWith(el);
    	  el.focus(function() { $(this).select(); }).select()
    	    .mouseup(function(e){ e.preventDefault(); });
    	  el.blur(function(){
    	    var span = $('<span></span>').addClass('editable');
    	    if($(this).val() == '' || $(this).val() == viewpointName)
    	    {
    	      span.html(viewpointName);
    	      $(this).replaceWith(span);
    	    }
    	    else
    	    {
    	      var self = $(this);
    	      var newName = self.val();
    	      var viewpoint = $(this).parent().data('viewpoint');
    	      var server = $(this).parent().data('server');
        	  var url = server + viewpoint.id;
        	  $.log(url);
    	      $.agorae.renameViewpoint(url, newName, function(){
    	        span.html(newName);
    	        self.replaceWith(span);
    	      }, function(){
    	        span.html(viewpointName);
    	        self.replaceWith(span);
    	      });
    	    }
    	  });
    	  el.keyup(function(event){
          if (event.keyCode == 27 || event.keyCode == 13)
            $(this).blur();
        });
    	});
    }
  }
  $.agorae = $.agorae || {};
  $.extend($.agorae, {
    session : new Session(),
    frontpage : new FrontPage()
  });
})(jQuery);