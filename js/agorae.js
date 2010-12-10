(function($) {
  function Session() {
    function login(){
      $.showDialog("dialog/_login.html", {
        modal: true,
        load: function(dialog){
          //Load default setting from cookie
          var config = $.cookie('config') || 'http://localhost/agorae/config';
          var name = $.cookie('name') || '';
          var password = $.cookie('password') || '';
          var cookie = $.cookie('cookie') || '0';

          $(dialog).find('input[name="config"]').val(config).focus(function(){ $(this).select(); });
          $(dialog).find('input[name="name"]').val(name);
          $(dialog).find('input[name="password"]').val(password);
          if(cookie == '1')
            $(dialog).find('input[name="cookie"]').attr('checked', true);
          else
            $(dialog).find('input[name="cookie"]').removeAttr('checked');
        },
        submit: function(data, callback) {
          if (!validateLoginForm(data, callback)) return;
          $.agorae.login(data.config, data.name, data.password, callback, function(){
            if(data.cookie){
              $.cookie('cookie', '1');
              $.cookie('config', data.config);
              $.cookie('name', data.name);
              $.cookie('password', data.password);
            }
            else
            {
              $.cookie('cookie', '0');
              $.cookie('config', null);
              $.cookie('name', null);
              $.cookie('password', null);
            }
            $.cookie('session', JSON.stringify($.agorae.config), { expires: 1/24/3});
            $.agorae.session.route();
          });
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
      if(!$.cookie('session'))
        login();
      else
      {
        $.agorae.config = JSON.parse($.cookie('session'));
        $.agorae.session.route();
      }
    };

    this.route = function(){
      if(!$.queryString('uri'))
      {
        $.showPage('page/_index.html', $.agorae.frontpage.init);
        return false;
      }
      var uri = $.queryString('uri');
      if(uri.indexOf('/viewpoint/'))
      {
        $.showPage('page/_viewpoint.html', $.agorae.viewpointpage.init);
        return false;
      }
    };

    this.rewrite = function(url){
      self.location.href = '?uri=' + url;
    };
  }

  function PageHelper(){
    this.toggle = function(){
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
    };

    this.checkController = function(){
      $.log($('#index-edit-toggle').attr('checked'));
      if($('#index-edit-toggle').attr('checked'))
        $('.ctl').show();
      else
        $('.ctl').hide();
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

    function loadViewpoint(index, viewpointUrl){
      $.agorae.getViewpoint(viewpointUrl, function(viewpoint){
        var server = viewpointUrl.substr(0, viewpointUrl.indexOf(viewpoint.id));
        var el = $('<li><span>' + viewpoint.name + '</span></li>')
                  .attr("rel", viewpoint.id).data("viewpoint", viewpoint)
                  .data("server", server);
        $('ul#index-viewpoint').append(el);
      });
    }

    function apendViewpoint(viewpoint, server){
      server = server || $.agorae.config.servers[0];
      $.log(server);
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

    function onViewpointClick(el){
      if(!$('#index-edit-toggle').attr('checked'))
      {
        var viewpoint = el.parent().data('viewpoint');
        var server = el.parent().data('server');
        $.agorae.session.rewrite(server + viewpoint.id);
        return false;
      }
      return true;
    }
    this.init = function(){
      $.each($.agorae.config.items, loadItem);
      $.each($.agorae.config.viewpoints, loadViewpoint);
      $.each($.agorae.config.servers, loadUser);
      $.agorae.pagehelper.toggle();

    	$('div.viewpoint-list img.add').live('click', function(){
        $.agorae.createViewpoint('no name', function(doc){
          apendViewpoint(doc);
          $.agorae.pagehelper.checkController();
        });
    	});

    	$('ul#index-viewpoint img.del').live('click', function(){
    	  var viewpoint = $(this).parent().data('viewpoint');
    	  var server = $(this).parent().data('server');
    	  var url = server + viewpoint.id;
    	  var self = $(this);
    	  $.agorae.delete(url, function(){
    	    self.parent().remove();
    	  });
    	});

      $('ul#index-viewpoint span.editable').live('click', function(){
        if(!onViewpointClick($(this)))
          return false;
        var viewpoint = $(this).parent().data('viewpoint');
    	  var server = $(this).parent().data('server');
        var viewpointName = $(this).text();
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
        	  var url = server + viewpoint.id;
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

    	$('ul#index-viewpoint span').live('click', function(){ onViewpointClick($(this)); });
    }
  }

  function ViewpointPage(){
    this.init = function(){
      this.uri = $.queryString('uri');
      $.agorae.pagehelper.toggle();
    };
  }
  $.agorae = $.agorae || {};
  $.extend($.agorae, {
    session : new Session(),
    pagehelper : new PageHelper(),
    frontpage : new FrontPage(),
    viewpointpage : new ViewpointPage()
  });
})(jQuery);