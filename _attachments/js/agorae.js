(function($) {
  function PageHelper(){
    this.init = function(config){
      //resize main layer size
      $(window).resize(resizeSidebar).trigger('resize');
      setTimeout('$.agorae.pagehelper.resize();', 300);

      //Load configuration from CouchDB document
      if(!$.cookie('config') && typeof config == "string")
        $.agorae.loadConfig(config);
      else
      {
        //If configuration is written into script
        if(!$.cookie('config') && typeof config == "object")
          $.agorae.config = config;
      }
      
      //Personalize header and footer
      if($.agorae.config.header)
        $('div#header').html($.agorae.config.header);
      if($.agorae.config.footer)
        $('div#footer').html($.agorae.config.footer);

      //init topic tree dialog
      $.agorae.topictree.init();
      //init item search dialog
      $.agorae.itemdialog.init();
      //init event;
      $('a#item-search').click(function(){ $.agorae.itemdialog.open( shortcutToItem );  return false;});
      $('a#sign-in').click($.agorae.session.login);
      $('a#sign-out').click($.agorae.session.logout);
      $('a#shortcut').click(function(){ $.agorae.topictree.openDialog( shortcutToTopic );  return false;});

      $.agorae.session.ctrlPressed = false;
      $(window).keydown(function(evt) {
        if (evt.which == 17) { // ctrl
          $.agorae.session.ctrlPressed = true;
        }
      }).keyup(function(evt) {
        if (evt.which == 17) { // ctrl
          $.agorae.session.ctrlPressed = false;
        }
      });

      if($.cookie('session.username') && $.cookie('session.password'))
      {
        $.agorae.session.username = $.cookie('session.username');
        $.agorae.session.password = $.cookie('session.password');
        $('span.sign-in').hide().next().show();
        $('#index-edit-toggle').show();
      }
      $(window).hashchange($.agorae.pagehelper.route).hashchange();
    };
    this.route = function(){
      var uri = $.getUri();
      if(!uri)
      {
        $('div#main').attr('class', 'index');
        $.showPage('page/_index.html', $.agorae.indexpage.init);
        return false;
      }

      if(uri.indexOf('/viewpoint/') > 0)
      {
        $('div#main').attr('class', 'viewpoint');
        $.showPage('page/_viewpoint.html', $.agorae.viewpointpage.init);
        return false;
      }
      if(uri.indexOf('/topic/') > 0)
      {
        $('div#main').attr('class', 'topic');
        $.showPage('page/_topic.html', $.agorae.topicpage.init);
        return false;
      }
      if(uri.indexOf('/item/') > 0)
      {
        $('div#main').attr('class', 'item');
        $.showPage('page/_item.html', $.agorae.itempage.init);
        return false;
      }
      if(uri.indexOf('/corpus/') > 0)
      {
        $('div#main').attr('class', 'corpus');
        $.showPage('page/_corpus.html', $.agorae.corpuspage.init);
        return false;
      }
    };
    this.rewrite = function(url){
      if(url == "" || url == "#")
        self.location.href = "./";
      else
        self.location.hash = url;
    };
    this.toggle = function(show, clickon, clickoff){
      if(typeof $.agorae.session.username == "undefined" || show !== true){
        $('input#index-edit-toggle').hide();
        return false;
      }
      $('input#index-edit-toggle').show().iToggle({
      	easing: 'easeOutExpo',
      	type: 'radio',
      	keepLabel: true,
      	easing: 'easeInExpo',
      	speed: 300,
      	onClickOn: function(){
      	  if(clickon) clickon();
      		$('.ctl').show();
      		$('ul.links').addClass('editing').removeClass('links');
      	},
      	onClickOff: function(){
      	  if(clickoff) clickoff();
      	  $('.ctl').hide();
      	  $('ul.editing').addClass('links').removeClass('editing');
      	}
      });
    };
    this.checkController = function(){
      if($('#index-edit-toggle').attr('checked'))
        $('.ctl').show();
      else
        $('.ctl').hide();
    };
    this.hideController = function(){
      $('#index-edit-toggle').removeAttr('checked').hide().parent().hide();
      $('.ctl').hide();
    };
    this.navigatorBar = function(obj){
      if(typeof(obj) != 'string'){
        var str = '';
        for(var i=0, bar; bar = obj[i]; i++)
        {
          if(bar.uri)
            str += '<a href="' + bar.uri + '">' + bar.name + '</a>';
          else
            str += '<b>' + bar.name + '</b>';

          if(i < obj.length-1)
            str += ' &gt; ';
        }
        obj = str;
      }
      $('div#header-navigatorbar').html(obj).data('bar', obj);
    };
    this.resize = function(){ resizeSidebar(); };
    function resizeSidebar(){
      var viewportHeight = window.innerHeight ? window.innerHeight : $(window).height();
		  viewportHeight = viewportHeight - 169;
		  viewportHeight = (viewportHeight > 0) ? viewportHeight : 0;
		  viewportHeight = (viewportHeight < $('div#main').outerHeight()) ? $('div#main').outerHeight() : viewportHeight;
		  $('div#sidebar').height(viewportHeight);
    };
    function shortcutToTopic(){
      var uris = [];
      if($('#tt-tree').attr('checked'))
        for(var i=0, t; t = $.jstree._focused().data.ui.selected[i]; i++)
          uris.push($(t).attr("uri"));
      else
        for(var j=0, el; el = $('#tags a.tag-clicked')[j]; j++)
        {
          var el = $(el).parent();
          if(!el.attr("topics")) continue;
          var tag_topics = JSON.parse(el.attr("topics"));
          for(var k=0, t; t = tag_topics[k]; k++)
             uris.push(t.uri);
        }
      $.agorae.topictree.closeDialog();
      if(uris.length == 0) return;
      if(uris.length == 1)
        $.agorae.pagehelper.rewrite(uris[0]);
      else
        for(var i=0, uri; uri = uris[i]; i++)
          if(i == 0)
            $.agorae.pagehelper.rewrite(uris[i]);
          else
            window.open(uris[i]);
    };
    function shortcutToItem(){
      var itemID = $(this).attr("id"),
          corpusID = $(this).attr("corpus");
      $.log("shortcutToItem");
      if($.agorae.config.servers)
        for(var i=0, server; server = $.agorae.config.servers[i]; i++)
        {
          uri = server + 'item/' + corpusID + '/' + itemID;
          $.agorae.getItem(uri, null, function(){
              $.agorae.pagehelper.rewrite(uri);
            }, function(){ return false; });
        }
      $.agorae.itemdialog.close();
    };
  }
  function Session() {
    this.login = function(){
      $.showDialog("dialog/_login.html", {
        modal: true,
        load: function(dialog){
          //Load default setting from cookie
          var name = $.cookie('name') || '';
          var password = $.cookie('password') || '';
          var cookie = $.cookie('cookie') || '0';

          $(dialog).find('input[name="name"]').val(name).focus(function(){ $(this).select(); });
          $(dialog).find('input[name="password"]').val(password);
          if(cookie == '1')
            $(dialog).find('input[name="cookie"]').attr('checked', true);
          else
            $(dialog).find('input[name="cookie"]').removeAttr('checked');
        },
        submit: function(data, callback) {
          if (!data.name || data.name.length == 0) {
            callback({name: "Please enter a name."});
            return false;
          };
          if (!data.password || data.password.length == 0) {
            callback({password: "Please enter a password."});
            return false;
          };
          $.agorae.login(data.name, data.password, callback, function(){
            if(data.cookie){
              $.cookie('cookie', '1', { expires: 365});
              $.cookie('name', data.name, { expires: 365});
              $.cookie('password', data.password, { expires: 365});
              $.cookie('session.username', $.agorae.session.username);
              $.cookie('session.password', $.agorae.session.password);
            }
            else
            {
              $.cookie('session.username', null);
              $.cookie('session.password', null);
              $.cookie('cookie', '0');
              $.cookie('name', null);
              $.cookie('password', null);
            }
            $.agorae.session.username = data.name;
            $.agorae.session.password = data.password;
            $('span.sign-in').hide().next().show();
            $('#index-edit-toggle').show();
            $.agorae.pagehelper.route();
          });
        }
      });
      return false;
    };

    this.logout = function(){
      $.cookie('session.username', null);
      $.cookie('session.password', null);
      $('span.sign-in').show().next().hide();
      $.agorae.pagehelper.hideController();
    };
  }
  function IndexPage(){
    this.init = function(){
      if(!$.agorae.config.servers)
      {
        $.showMessage({title: "Erreur", content: "Une erreur de configuration a été détecté! Aucun Hypertopic service trouvé."});
        return false;
      }
      if($.agorae.config.corpora)
        $.each($.agorae.config.corpora, getCorpus);
      if($.agorae.config.viewpoints)
        $.each($.agorae.config.viewpoints, appendViewpoint);
      if($.agorae.session.username)
        $.each($.agorae.config.servers, appendUser);

      $.agorae.pagehelper.toggle(true);
      $.agorae.pagehelper.navigatorBar('<b>Accueil</b>');

      //Enable the links
      $('div.index div.corpus-list img.add').die().live('click', createCorpus);
      $('div.index ul#corpus li[uri] span').die().live('click', onCorpusClick);
      $('div.index ul#corpus img.del').die().live('click', deleteObject);
      
    	$('div.index div.viewpoint-list img.add').bind('click',createViewpoint);
    	$('div.index ul#viewpoint img.del').die().live('click', deleteObject);
    	$('div.index ul#viewpoint li[uri] span').die().live('click', onViewpointClick);
    }
    function getCorpus(idx, corpus){
      if(corpus.indexOf("http") != 0)
        corpusUrl = $.agorae.config.servers[0] + 'corpus/' + corpus;
      else
        corpusUrl = corpus;
      $.agorae.getCorpus(corpusUrl, function(corpus){
        $.log(corpus);
        var el = $('<li><span>' + corpus.name + '</span></li>').attr("id", corpus.id).attr("uri", corpusUrl);
        $('ul#corpus').append(el);
      });
    };
    function appendViewpoint(idx, viewpointUrl, viewpoint, editable){
      if(!viewpoint){
        var showViewpoint = function(viewpoint){
          var el = $('<li><span>' + viewpoint.name + '</span></li>')
                    .attr("id", viewpoint.id).data("viewpoint", viewpoint)
                    .attr('uri', viewpointUrl);
          $('ul#viewpoint').append(el);
        };
        //If the 2nd parameter is not an URL then assume the viewpoint could be located on the primary server.
        if(viewpointUrl.indexOf('http') != 0)
          viewpointUrl = $.agorae.config.servers[0] + 'viewpoint/' + viewpointUrl;
        $.agorae.getViewpoint(viewpointUrl, showViewpoint);
      }
      else
      {
        $('li#' + viewpoint.id, 'ul#viewpoint').hide().remove();
        var el = $('<li><img class="del ctl hide" src="css/blitzer/images/delete.png">'
                  +'<span>' + viewpoint.name + '</span></li>')
                    .attr("id", viewpoint.id).data("viewpoint", viewpoint)
                    .attr('uri', viewpointUrl);
        if(editable)
          el.find('span').addClass('editable');
        $('ul#viewpoint').append(el);
      }
    };
    function appendUser(index, server){
      $.agorae.getUser(server, function(user){
        if(user.viewpoint)
          for(var i=0, viewpoint; viewpoint = user.viewpoint[i]; i++){
            appendViewpoint(i, server + 'viewpoint/' + viewpoint.id, viewpoint, true);
          }
        if(user.corpus)
          for(var i=0, corpus; corpus = user.corpus[i]; i++){
            $('ul#corpus').find('li#' + corpus.id).hide().remove();
            var corpusUrl = server + 'corpus/' + corpus.id;
            var el = $('<li><img class="del ctl hide" src="css/blitzer/images/delete.png"><span class="editable">' 
                      + corpus.name + '</span></li>').attr("id", corpus.id).attr("uri", corpusUrl);
            $('ul#corpus').append(el);
          }
      });
    };
    
    function createCorpus(){
      $.agorae.createCorpus($.agorae.config.servers[0], 'Sans nom', function(corpus){
        var corpusUrl = $.agorae.config.servers[0] + 'corpus/' + corpus.id;
        var el = $('<li><img class="del ctl hide" src="css/blitzer/images/delete.png"><span class="editable">' 
                  + 'Sans nom' + '</span></li>').attr("id", corpus.id).attr("uri", corpusUrl);
        $('ul#corpus').append(el);
        $.agorae.pagehelper.checkController();
      });
    };
    function onCorpusClick(){
      if(!$('#index-edit-toggle').attr('checked'))
      {
        var uri = $(this).parent().attr('uri');
        $.agorae.pagehelper.rewrite(uri);
        return false;
      }
      if(!$(this).hasClass('editable'))
        return false;
      var corpusName = $(this).text();
      var el = $('<input type="textbox">').val(corpusName);
    	$(this).replaceWith(el);
    	el.focus(function() { $(this).select(); }).select()
    	  .mouseup(function(e){ e.preventDefault(); });
    	el.blur(function(){
    	  var span = $('<span></span>').addClass('editable');
    	  if($(this).val() == '' || $(this).val() == corpusName)
    	  {
    	    span.html(corpusName);
    	    $(this).replaceWith(span);
    	  }
    	  else
    	  {
    	    var self = $(this);
    	    var newName = self.val();
      	  var uri = $(this).parent().attr("uri");
    	    $.agorae.renameCorpus(uri, newName, function(){
    	      span.html(newName);
    	      self.replaceWith(span);
    	    }, function(){
    	      span.html(corpusName);
    	      self.replaceWith(span);
    	    });
    	  }
    	});
    	el.keyup(function(event){
        if (event.keyCode == 27 || event.keyCode == 13)
          $(this).blur();
      });
      return false;
    };
    
    function createViewpoint(){
      $.agorae.createViewpoint('Sans nom', function(doc){
        appendViewpoint(0, $.agorae.config.servers[0] + "viewpoint/" + doc.id, doc, true);
        $.agorae.pagehelper.checkController();
      });
    };
    function onViewpointClick(){
      if(!$('#index-edit-toggle').attr('checked'))
      {
        var uri = $(this).parent().attr('uri');
        $.agorae.pagehelper.rewrite(uri);
        return false;
      }
      if(!$(this).hasClass('editable'))
        return false;
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
      	  var uri = $(this).parent().attr("uri");
    	    $.agorae.renameViewpoint(uri, newName, function(){
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
      return false;
    };
    
    function deleteObject(){
      var uri = $(this).parent().attr('uri');
          uri = $.agorae.getDocumentUri(uri);
      var self = $(this);
      $.agorae.deleteDoc(uri, function(){
        self.parent().remove();
      });
    };
  }
  function CorpusPage(){
    this.init = function(){
      var uri = $.getUri();
      $.agorae.getCorpus(uri, function(corpus){
        var bars = [{'uri': '#', 'name': 'Accueil'}];
        bars.push({'name': corpus.name + ''});
        $.agorae.pagehelper.navigatorBar(bars);
        for(var itemID in corpus)
          if(typeof corpus[itemID] == 'object' && corpus[itemID].name)
          {
            corpus[itemID].id = itemID;
            appendItem(corpus[itemID]);
          }
      });

      if(typeof($.agorae.config.servers[0]) == "string" && uri.indexOf($.agorae.config.servers[0]) == 0)
        $.agorae.pagehelper.toggle(true);
      else
        $.agorae.pagehelper.toggle(false);
      $('div.corpus div.item-list img.add').bind('click', createItem);
    	$('div.corpus div.item-list img.del').die().live('click', deleteItem);
    	$('div.corpus ul#item li[uri] span').die().live('click', onItemClick);
    };
    function appendItem(item){
      var uri = $.getUri();
      var serverUri = $.agorae.getServerUri(uri);
      var corpusID = $.agorae.getDocumentID(uri);
      var itemUrl = serverUri + 'item/' + corpusID + '/' + item.id; 
      var el = $('<li><img class="del ctl hide" src="css/blitzer/images/delete.png"><span class="editable">' 
                + item.name + '</span></li>').attr("id", item.id).attr("uri", itemUrl);
      $('ul#item').append(el);
    };
    function createItem(){
      var uri = $.getUri();
      $.agorae.createItemWithinCorpus(uri, 'Sans nom', function(item){
        appendItem(item);
        $.agorae.pagehelper.checkController();
      });
      return false;
    };
    function deleteItem(){
      var uri = $(this).parent().attr('uri');
      var docUri = $.agorae.getDocumentUri(uri);
    	var self = $(this);
      $.agorae.deleteDoc(docUri, function(){
    	  self.parent().remove();
    	});
    	return false;
    };
    function onItemClick(){
      var corpusUri = $.getUri(),
          itemUri = $(this).parent().attr("uri"),
          prefixUrl = $.agorae.getServerUri(itemUri),
          corpusID = $.agorae.getDocumentID(corpusUri),
          itemID = $(this).parent().attr('id');
      if(!$('#index-edit-toggle').attr('checked'))
      {
        var uri = prefixUrl + 'item/' + corpusID + '/' + itemID;
        $.agorae.getItem(uri, null, function(){
          $.agorae.pagehelper.rewrite(uri);
        }, function(){
          if($.agorae.config.servers)
          for(var i=0, server; server = $.agorae.config.servers[i]; i++)
          {
            if(server == prefixUrl) continue;
            uri = server + 'item/' + corpusID + '/' + itemID;
            $.agorae.getItem(uri, null,  function(){
                $.agorae.pagehelper.rewrite(uri);
              }, function(){ return false; });
          }
        });
        return false;
      }
      var name = $(this).text();
      var el = $('<input type="textbox">').val(name);
    	$(this).replaceWith(el);
    	el.focus(function() { $(this).select(); }).select()
    	  .mouseup(function(e){ e.preventDefault(); });
    	el.blur(function(){
    	  var span = $('<span></span>').addClass('editable');
    	  if($(this).val() == '' || $(this).val() == name)
    	  {
    	    span.html(name);
    	    $(this).replaceWith(span);
    	  }
    	  else
    	  {
    	    var self = $(this);
    	    var newName = self.val();
    	    $.agorae.renameItem(prefixUrl, itemID, newName, function(){
    	      span.html(newName);
    	      self.replaceWith(span);
    	    }, function(){
    	      span.html(name);
    	      self.replaceWith(span);
    	    });
    	  }
    	});
    	el.keyup(function(event){
        if (event.keyCode == 27 || event.keyCode == 13)
          $(this).blur();
      });
      return true;
    };
  }
  function ViewpointPage(){
    this.init = function(){
      var uri = $.getUri();
      $.agorae.getViewpoint(uri, function(viewpoint){
        var bars = [{'uri': '#', 'name': 'Accueil'}];
        bars.push({'name': viewpoint.name + ''});
        $.agorae.pagehelper.navigatorBar(bars);
        if(viewpoint.upper)
          $.each(viewpoint.upper, appendTopic);
      });

      if(typeof($.agorae.config.servers[0]) == "string" && uri.indexOf($.agorae.config.servers[0]) == 0)
        $.agorae.pagehelper.toggle(true);
      else
        $.agorae.pagehelper.toggle(false);
      $('div.viewpoint div.topic-list img.add').click(createTopic);
    	$('div.viewpoint div.topic-list img.del').die().live('click', $.agorae.viewpointpage.deleteTopic);
    	$('div.viewpoint ul#topic li[uri] span').die().live('click', $.agorae.viewpointpage.onTopicClick);
    };
    function createTopic(){
      var uri = $.getUri();
      $.agorae.createTopic(uri, 'sans nom', function(doc){
        appendTopic(0, doc);
        $.agorae.pagehelper.checkController();
      });
    };
    this.deleteTopic = function(){
      var id = $(this).parent().attr('id');
      var uri = $(this).parent().attr('uri');
    	var self = $(this);
    	$.agorae.deleteTopic(uri, id , function(){
    	  self.parent().remove();
    	});
    };
    function appendTopic(index, topic){
      var uri = $.getUri();
      uri += '/' + topic.id;
      uri = uri.replace(/\/viewpoint\//, "/topic/");
      var el = $('<li><img class="del ctl hide" src="css/blitzer/images/delete.png">'
                   + '<span class="editable">' + topic.name + '</span></li>')
                   .attr("id", topic.id).attr("uri", uri);
      $('ul#topic').append(el);
    };
    this.onTopicClick = function(){
      var uri = $(this).parent().attr('uri');
      if(!$('#index-edit-toggle').attr('checked'))
      {
        $.agorae.pagehelper.rewrite(uri);
        return false;
      }
      var id = $(this).parent().attr('id');
      var name = $(this).text();
      var el = $('<input type="textbox">').val(name);
    	$(this).replaceWith(el);
    	el.focus(function() { $(this).select(); }).select()
    	  .mouseup(function(e){ e.preventDefault(); });
    	el.blur(function(){
    	  var span = $('<span></span>').addClass('editable');
    	  if($(this).val() == '' || $(this).val() == name)
    	  {
    	    span.html(name);
    	    $(this).replaceWith(span);
    	  }
    	  else
    	  {
    	    var self = $(this);
    	    var newName = self.val();
    	    $.agorae.renameTopic(uri, id, newName, function(){
    	      span.html(newName);
    	      self.replaceWith(span);
    	    }, function(){
    	      span.html(name);
    	      self.replaceWith(span);
    	    });
    	  }
    	});
    	el.keyup(function(event){
        if (event.keyCode == 27 || event.keyCode == 13)
          $(this).blur();
      });
      return true;
    };
  }
  function TopicPage(){
    this.init = function(){
      var uri = $.getUri();

      $.agorae.getTopic(uri, function(topic){
        var bars = [{'uri': '#', 'name': 'Accueil'}];
        bars.push({'uri': '#' + topic.viewpointUrl, 'name': topic.viewpoint_name});
        if(topic.broader)
          for(var i=0, t; t = topic.broader[i]; i++)
            bars.push({'uri': '#' + topic.prefixUrl + t.id, 'name': t.name});
        bars.push({'name': topic.name});

        $.agorae.pagehelper.navigatorBar(bars);
        if(topic.narrower)
          $.each(topic.narrower, appendTopic);
        if(topic.item)
          $.each(topic.item, appendItem);
      });

      if(typeof($.agorae.config.servers[0]) == "string" && uri.indexOf($.agorae.config.servers[0]) == 0)
        $.agorae.pagehelper.toggle(true);
      else
        $.agorae.pagehelper.toggle(false);

      $('div.topic div.topic-list img.add').click(createTopic);
      $('div.topic div.topic-list img.del').die().live('click', $.agorae.viewpointpage.deleteTopic);
      $('div.topic div.topic-list img.unlink').die().live('click', unlinkTopic);
    	$('div.topic ul#topic li[uri] span').die().live('click', $.agorae.viewpointpage.onTopicClick);
      $('div.topic div.topic-list img.attach').click(attachTopic);

      $('div.topic div.item-list img.add').click(createItem);
      $('div.topic div.item-list img.del').die().live('click', deleteItem);
    	$('div.topic div.item-list img.unlink').die().live('click', unlinkItem);
    	$('div.topic div.item-list img.attach').die().live('click', function(){ $.agorae.itemdialog.open( linkItem );  return false;});
      $('div.topic ul#item span.editable').die().live('click', onItemClick);
    };
    function createTopic(){
      var uri = $.getUri();
      $.agorae.createTopic(uri, 'Sans nom', function(topic){
        var parts = uri.split("/");
        parts.pop();
        parts.push(topic.id);
        topic.uri = parts.join('/');
        appendTopic(0, topic);
        $.agorae.pagehelper.checkController();
      });
      return false;
    };
    function unlinkTopic(){
      var id = $(this).parent().attr('id');
      var uri = $(this).parent().attr('uri');
      var self = $(this);
      $.agorae.unlinkTopic(uri, id , function(){
        self.parent().remove();
      });
      return false;
    };
    function attachTopic(){
      $.agorae.topictree.openDialog(
        function(){
          var topics = [];
          if($('#tt-tree').attr('checked'))
            for(var i=0, t; t = $.jstree._focused().data.ui.selected[i]; i++)
            {
              if($(t).attr("rel") == "viewpoint") continue;
              topics.push({"id": $(t).attr("topicID"), "viewpoint": $(t).attr("viewpointID"), "name": $(t).attr("name"), "uri": $(t).attr("uri")});
            }
          else
          {
            for(var j=0, el; el = $('#tags a.tag-clicked')[j]; j++)
            {

              var el = $(el).parent();
              if(!el.attr("topics")) continue;
              var tag_topics = JSON.parse(el.attr("topics"));
              var topicName = el.attr("name");
              for(var k=0, t; t = tag_topics[k]; k++)
                topics.push({"id": t.topicID, "viewpoint": t.viewpointID, "name": topicName, "uri": t.uri});
            }
          }
          if(topics.length == 0)
          {
            $.showMessage({title: "Warn", content: "Please select a topic first!"});
            return false;
          }
          var uri = $.getUri();
          $.agorae.moveTopicIn(uri, topics, function(inserts){
            $.each(inserts, appendTopic);
            $.agorae.topictree.closeDialog();
            $.agorae.pagehelper.checkController();
          });
        }
      );
    };
    function appendTopic(idx, topic){
      if(!topic.uri){
        var uri = $.getUri();
        parts = uri.split("/");
        parts.pop();
        parts.push(topic.id);
        topic.uri = parts.join("/");
      }
      var el = $('<li><img class="del ctl hide" src="css/blitzer/images/delete.png">'
                   + '<img class="unlink ctl hide" src="css/blitzer/images/unlink.png">'
                   + '<span class="editable">' + topic.name + '</span></li>')
                   .attr("id", topic.id).attr("uri", topic.uri);
      $('ul#topic').append(el);
    };
    function createItem(){
      $.showDialog("dialog/_item.html", {
        modal: true,
        load: function(dialog){
          //Load default setting from cookie
          $(dialog).find('input[name="itemName"]').val('sans nom').focus(function(){ $(this).select(); });
          var corpusSelect = $(dialog).find('select[name="corpus"]');
          if(corpusSelect.find('option').length > 0) 
            corpusSelect.find('option').remove();
          $.agorae.getCorpora(function(corpus){
            if(corpusSelect.find('option[uri="' + corpus.uri + '"]').length > 0) 
              return;
            var el = $('<option></option>').val(corpus.id).attr("uri", corpus.uri).html(corpus.name + "");
            corpusSelect.append(el);
          });
        },
        submit: function(data, callback) {
          $.log(data);
          if (!data.corpus || data.corpus.length == 0) {
            callback({corpus: "Veuillez saisir le corpus!"});
            return false;
          };
          if (!data.itemName || data.itemName.length == 0) {
            callback({itemName: "Veuillez saisir le nom d'item!"});
            return false;
          };
          var uri = $.getUri();
          var corpus = data.corpus;
          var corpusOption = $('select[name="corpus"] option[value="' + corpus + '"]');
          var corpusName = corpusOption.text();
          var corpusUrl = corpusOption.attr("uri");
          
          $.agorae.createItemWithTopicAndCorpus(uri, corpusUrl, data.itemName, function(item){
            appendItem(0, item);
            $.agorae.pagehelper.checkController();
            callback();
          });
        }
      });
      return false;
    };
    function deleteItem(){
      var itemID = $(this).parent().attr('id');
    	var self = $(this);
    	var prefixUrl;
    	var uri = $.getUri();
      if(uri.indexOf("/topic/") > 0)
        prefixUrl = uri.substr(0, uri.indexOf("topic/"));
    	$.agorae.deleteDoc(prefixUrl + itemID, function(){
    	  self.parent().remove();
    	});
    	return false;
    };
    function unlinkItem(){
      var uri = $.getUri();
      var itemID = $(this).parent().attr('id');
    	var self = $(this);
    	$.agorae.unlinkItem(uri, itemID , function(){
    	  self.parent().remove();
    	});
      return false;
    };
    function linkItem(){
      var uri = $.getUri(),
          itemID = $(this).attr('id'),
          corpusID = $(this).attr('corpus'),
          name = $(this).attr('name');
      $.log("linkItem");
    	$.agorae.linkItem(uri, corpusID, itemID, name, function(){
    	  appendItem(0, {"id": itemID, "name": name, "corpus": corpusID});
    	  $.agorae.itemdialog.close();
    	  $.agorae.pagehelper.checkController();
    	});
      return false;
    };
    function appendItem(idx, item){
      var el = $('<li><img class="del ctl hide" src="css/blitzer/images/delete.png">'
                   + '<img class="unlink ctl hide" src="css/blitzer/images/unlink.png">'
                   + '<span class="editable">' + item.name + '</span></li>')
                   .attr("id", item.id).attr("corpus", item.corpus);
      $('ul#item').append(el);
    };
    function onItemClick(){
      var uri = $.getUri(),
          prefixUrl = $.agorae.getServerUri(uri),
          corpusID = $(this).parent().attr('corpus'),
          itemID = $(this).parent().attr('id');
      if(!$('#index-edit-toggle').attr('checked'))
      {
        var uri = prefixUrl + 'item/' + corpusID + '/' + itemID;
        $.agorae.getItem(uri, null, function(){
          $.agorae.pagehelper.rewrite(uri);
        }, function(){
          if($.agorae.config.servers)
          for(var i=0, server; server = $.agorae.config.servers[i]; i++)
          {
            if(server == prefixUrl) continue;
            uri = server + 'item/' + corpusID + '/' + itemID;
            $.agorae.getItem(uri, null,  function(){
                $.agorae.pagehelper.rewrite(uri);
              }, function(){ return false; });
          }
        });
        return false;
      }
      var name = $(this).text();
      var el = $('<input type="textbox">').val(name);
    	$(this).replaceWith(el);
    	el.focus(function() { $(this).select(); }).select()
    	  .mouseup(function(e){ e.preventDefault(); });
    	el.blur(function(){
    	  var span = $('<span></span>').addClass('editable');
    	  if($(this).val() == '' || $(this).val() == name)
    	  {
    	    span.html(name);
    	    $(this).replaceWith(span);
    	  }
    	  else
    	  {
    	    var self = $(this);
    	    var newName = self.val();
    	    $.agorae.renameItem(prefixUrl, itemID, newName, function(){
    	      span.html(newName);
    	      self.replaceWith(span);
    	    }, function(){
    	      span.html(name);
    	      self.replaceWith(span);
    	    });
    	  }
    	});
    	el.keyup(function(event){
        if (event.keyCode == 27 || event.keyCode == 13)
          $(this).blur();
      });
      return true;
    };
  }
  function ItemPage(){
    this.init = function(){
      var uri = $.getUri();
      $.agorae.getItem(uri, function(item){
        $.log(item);
        var bars = [{'uri': '#', 'name': 'Accueil'}];
        bars.push({'name': item.name + ''});
        $.agorae.pagehelper.navigatorBar(bars);
        var reserved = ["corpus", "id", "highlight", "name", "resource", "topic", "_attachments"];
        for(var n in item){
          if(reserved.indexOf(n) >= 0) continue;
          appendAttribute(n, item[n]);
        }
        
        if(item.resource)
          appendRemoteResource(item.resource);
        if(item._attachments)
          appendAttachment(item._attachments[0]);
        if(item.topic)
          $.each(item.topic, appendTopic);
        if(item.corpus){
          var prefixUrl = $.agorae.getServerUri(uri);
          var corpusUrl = prefixUrl + "corpus/" + item.corpus;
          $.agorae.getCorpus(corpusUrl, function(corpus){
            var bars = [{'uri': '#', 'name': 'Accueil'}];
            bars.push({'uri': '#' + corpusUrl, 'name': corpus.name + ''});
            bars.push({'name': item.name + ''});
            $.agorae.pagehelper.navigatorBar(bars);
          })
        }
        onEditOff();
      });

      if(uri.indexOf($.agorae.config.servers[0]) == 0)
        $.agorae.pagehelper.toggle(true, onEditOn, onEditOff);
      else
        $.agorae.pagehelper.toggle(false, onEditOn, onEditOff);
      
      $('div.item div.remote-resource-list img.add').bind('click', attachRemoteResource);
      $('div.item div.remote-resource-list img.unlink').die().live('click', unlinkRemoteResource);
      $('div.item div.remote-resource-list span.resource').die().live('click', clickRemoteResource);
      
      $('div.item div.local-resource-list li.attribute img.del').die().live('click', deleteAttribute);
      $('div.item div.local-resource-list li.attachment img.del').die().live('click', deleteAttachment);
      $('div.item div.local-resource-list img.add').bind('click', addLocalResource);
      $('div.item div.local-resource-list img.upload').bind('click', uploadAttachment);
      
      $('div.item div.topic-list img.attach').click(attachTopic);
      $('div.item div.topic-list ul#topic img.unlink').click(detachTopic);

      $('div.item div.attribute-list img.add').click(addAttribute);
      $('div.item div.attribute-list img.del').die().live('click', deleteAttribute);

      $('div.item ul#topic li[uri] span').die().live('click', $.agorae.viewpointpage.onTopicClick);
    };
    function onEditOn(){
      var attributes = {};
      $('div.attribute').each(function(){
        var name = $(this).find(".attributename").html();
        attributes[name] = [];
        $(this).find(".attributevalue span").each(function(){
          attributes[name].push($(this).attr("attributevalue"));
        });
      });
      $('ul#attribute').html('');
      for(var name in attributes)
        appendAttribute(name, attributes[name]);
      $('div.attributes').hide();
      $('ul#attribute').show();
      $('div.local-resource-list').show();
      $('div.remote-resource-list').show();
      
      if($('ul#remote-resource li').length > 0)
        $('div.remote-resource-list img.add').removeClass('ctl').hide();
      else
        $('div.remote-resource-list img.add').addClass('ctl').show();
    };
    function onEditOff(){
      var attributes = {};
      $('ul#attribute li').each(function(){
        var name = $(this).attr("attributename");
        if(!(name in attributes)) attributes[name] = [];
        attributes[name].push($(this).attr("attributevalue"));
      });
      $('div.attributes').html('');
      for(var name in attributes){
        var el_attribute = $('<div class="attribute">');
        var el_name = $('<div style="display: inline;" class="attributename"></div>').html(name).attr('attributename', name);
        var el_values = $('<div style="display: inline;" class="attributevalue"></div>');
        for(var i=0, v; v = attributes[name][i]; i++)
        {
          var comma = (i < attributes[name].length - 1) ? "," : "";
          var span_value = $('<span></span>').attr('attributevalue', v).html(v + comma);
          el_values.append(span_value);
        }
        el_attribute.append(el_name).append(el_values);
        $('div.attributes').append(el_attribute);
      }
      $('div.attributes').show();
      $('ul#attribute').hide();
      ($('ul#local-resource li').length > 0) ? $('div.local-resource-list').show() : $('div.local-resource-list').hide();
      ($('ul#remote-resource li').length > 0) ? $('div.remote-resource-list').show() : $('div.remote-resource-list').hide();
    };
    function parseUri(){
      var uri = $.getUri();
      if(uri.substr(-1) == '/')
        uri = uri.substr(0,uri.length -1);
      parts = uri.split('/');
      var result = {};
      result.item = parts.pop();
      result.corpus = parts.pop();
      parts.pop();
      result.prefixUrl = parts.join('/') + "/";
      result.itemUrl = result.prefixUrl + result.item;
      return result;
    };
    
    function addAttribute(){
      $.showDialog("dialog/_attribute.html", {
        submit: function(data, callback) {
          if (!data.attributename || data.attributename.length == 0) {
            callback({attributename: "Veuillez saisir le nom d'attribut"});
            return;
          }
          if (!data.attributevalue || data.attributevalue.length == 0) {
            callback({attributename: "Veuillez saisir le valeur d'attribut"});
            return;
          }
          uri = $.getUri();
          $.agorae.describeItem(uri, data.attributename, data.attributevalue, appendAttribute);
          callback();
          $.agorae.pagehelper.checkController();
        }
      });
    };
    function deleteAttribute(){
      var attributename = $(this).parent().attr("attributename");
      var attributevalue = $(this).parent().attr("attributevalue");
      var uri = $.getUri();
      var self = $(this);
      $.agorae.undescribeItem(uri, attributename, attributevalue, function(){
        self.parent().remove();
      });
    };
    function appendAttribute(name, value){
      value = (typeof(value[0]) == "string") ? value : value[0];
      for(var i=0, v; v = value[i]; i++)
      {
        var el = $('<li><img class="del ctl hide" src="css/blitzer/images/delete.png"></li>')
                 .attr("attributename", name).attr("attributevalue", v);
        var protocol = $.url.setUrl(v).attr("protocol");
        if(protocol == "http" || protocol == "https" || protocol == "ftp" || protocol == "sftp")
        {
          //The attribute value is an URL
          el.addClass('attribute');
          var el_href = $('<a></a>').html(name).attr('href', v).attr('attributename', name).addClass('editable');
          el.append(el_href);
          $('ul#local-resource').append(el);
        }
        else
        {
          //Is noraml attribute
          var span_name = $('<span class="editable attributename"></span>').html(name);
          var span_value = $('<span class="editable attributevalue"></span>').html(v);
          el.append(span_name).append(span_value);
          $('ul#attribute').append(el);
        }
      }
    };
    
    function uploadAttachment() {
      $.showDialog("dialog/_upload.html", {
        load: function(elem) {
        },
        submit: function(data, callback) {
          if (!data._attachments || data._attachments.length == 0) {
            callback({_attachments: "Please select a file to upload."});
            return;
          }
          var form = $("#upload-form");
          form.find("#progress").css("visibility", "visible");
          var uris = parseUri();
          var itemUrl = uris.prefixUrl + uris.item;
          $.log(itemUrl);
          $.agorae.getItem(itemUrl, null, function(doc){
            $.log(doc);
            $("input[name='_rev']", form).val(doc._rev);
            form.ajaxSubmit({
              url: itemUrl,
              success: function(resp) {
                var uri = $.getUri();
                $.agorae.getItem(uri, function(item){
                  $.log(item);
                  if(item._attachments){
                    $('ul#local-resource li.attachment').remove();
                    appendAttachment(item._attachments[0]);
                  }
                });
                form.find("#progress").css("visibility", "hidden");
                callback();
                $.agorae.pagehelper.checkController();
              }
            });
          });
        }
      });
    };
    function deleteAttachment(){
      var file = $(this).parent().attr("file");
      var uris = parseUri();
      var self = $(this);
      $.agorae.deleteItemAttachment(uris.itemUrl, file, function(){
        self.parent().remove();
      });
    };
    function clickAttachment(){
      var uris = parseUri();
      var url = uris.itemUrl + "/" + $(this).parent().attr("file");
      window.open(url);
    };
    function appendAttachment(attachments){
      var uris = parseUri();
      for(var file in attachments)
      {
        var uri = uris.itemUrl + "/" + file;
        var contentType = (typeof attachments[file].content_type == "string") ? attachments[file].content_type : "";
        var fancybox_group = (contentType.indexOf("image/") == 0) ? "fancybox_group" : null;
        
        var el = $('<li><img class="del ctl hide" src="css/blitzer/images/delete.png"></li>').addClass('attachment').attr("file", file);
        var el_href = $('<a class="editable attachment"></a>').attr('href', uri).html(file);
        if(fancybox_group)
          el_href.attr('rel', fancybox_group);
        el.append(el_href);
        $('ul#local-resource').append(el);
      }
      fbox();
    };
    
    function attachRemoteResource(){
      $.showDialog("dialog/_resource.html", {
        submit: function(data, callback) {
          if (!data.resource || data.resource.length == 0) {
            callback({resource: "L'aderesse de la ressource ne doit pas être vide!"});
            return;
          }
          var form = $("#resource-form");
          var uris = parseUri();
          var itemUrl = uris.itemUrl;
          $.agorae.attachItemResource(itemUrl, data.resource, function(){
            appendRemoteResource(data.resource);
            callback();
            $('div.remote-resource-list img.add').removeClass('ctl').hide();
            $.agorae.pagehelper.checkController();
          });
        }
      });
    };
    function unlinkRemoteResource(){
      var uris = parseUri();
      var self = $(this);
      $.agorae.unlinkItemResource(uris.itemUrl, function(){
        self.parent().remove();
        $('div.remote-resource-list img.add').addClass('ctl').show();
      });
    };
    function clickRemoteResource(){
      var url = $(this).attr("rel");
      if(!$('#index-edit-toggle').attr('checked'))
      {
        window.open(url);
        return false;
      }
      $(this).parent().attr("url", url);
      var el = $('<input type="textbox">').val(url);
    	$(this).replaceWith(el);
    	el.focus(function() { $(this).select(); }).select()
    	  .mouseup(function(e){ e.preventDefault(); });
    	el.blur(function(){
    	  var span = $('<span></span>').addClass('editable').addClass('resource').attr('rel',url);
    	  if($(this).val() == '' || $(this).val() == url)
    	  {
    	    span.html($(this).parent().attr("url"));
    	    $(this).replaceWith(span);
    	  }
    	  else
    	  {
    	    var self = $(this);
    	    var newUrl = self.val();
    	    var uris = parseUri();
    	    $.agorae.updateItemResource(uris.itemUrl, url, newUrl, function(){
    	      self.parent().attr("rel", newUrl);
    	      span.html(newUrl).attr('rel', newUrl);
    	      self.replaceWith(span);
    	    }, function(){
    	      span.html($(this).parent().attr("url"));
    	      self.replaceWith(span);
    	    });
    	  }
    	});
    	el.keyup(function(event){
        if (event.keyCode == 27 || event.keyCode == 13)
          $(this).blur();
      });
    };
    function appendRemoteResource(resource){
      resource = (typeof resource == "string") ? resource : resource + "";
      var el_container = $('<li></li>').append($('<img class="unlink ctl hide" src="css/blitzer/images/unlink.png">'));
      var span_resource = $('<span class="editable resource"></span>').html(resource).attr("rel", resource);
      el_container.append(span_resource);
      $('ul#remote-resource').append(el_container);
    };
    
    function addLocalResource(){
      $.showDialog("dialog/_localresource.html", {
        submit: function(data, callback) {
          if (!data.attributename || data.attributename.length == 0) {
            callback({attributename: "Veuillez saisir le nom de la ressource"});
            return;
          }
          if (!data.attributevalue || data.attributevalue.length == 0) {
            callback({attributename: "Veuillez saisir l'aderesse de la ressource"});
            return;
          }
          var protocol = $.url.setUrl(data.attributevalue).attr("protocol");
          if(protocol != "http" && protocol != "https" && protocol != "ftp" && protocol != "sftp"){
            callback({attributevalue: "L'aderesse de la ressource n'est pas correct!"});
            return;
          }
          uri = $.getUri();
          $.agorae.describeItem(uri, data.attributename, data.attributevalue, appendAttribute);
          callback();
          $.agorae.pagehelper.checkController();
        }
      });
    };
    
    function attachTopic(){
      $.agorae.topictree.openDialog(
        function(){
          var topics = [];
          if($('#tt-tree').attr('checked'))
            for(var i=0, t; t = $.jstree._focused().data.ui.selected[i]; i++)
            {
              if($(t).attr("rel") == "viewpoint") continue;
              topics.push({"id": $(t).attr("topicID"), "viewpoint": $(t).attr("viewpointID"), "name": $(t).attr("name"), "uri": $(t).attr("uri")});
            }
          else
          {
            for(var j=0, el; el = $('#tags a.tag-clicked')[j]; j++)
            {

              var el = $(el).parent();
              if(!el.attr("topics")) continue;
              var tag_topics = JSON.parse(el.attr("topics"));
              var topicName = el.attr("name");
              for(var k=0, t; t = tag_topics[k]; k++)
                topics.push({"id": t.topicID, "viewpoint": t.viewpointID, "name": topicName, "uri": t.uri});
            }
          }
          if(topics.length == 0)
          {
            $.showMessage({title: "Warn", content: "Please select a topic first!"});
            return false;
          }
          var uri = $.getUri();
          uri = $.agorae.getDocumentUri(uri);
          $.agorae.tagItem(uri, topics, function(){
            $.agorae.topictree.closeDialog();
            $.each(topics, appendTopic);
            $.agorae.pagehelper.checkController();
          });
        }
      );
    };
    function detachTopic(){
      var id = $(this).parent().attr("id");
      var itemUrl = $.getUri();
      $.agorae.untagItem(itemUrl, id, function(){
        $('div.item div.topic-list ul#topic li[id="' + id + '"]').hide().remove();
      });
    };
    function appendTopic(idx, topic){
      if(!topic.name)
      {
        var ret = $.agorae.getTopicName(topic.id, topic.viewpoint);
        $.extend(topic, ret);
      }
      var el = $('<li><img class="unlink ctl hide" src="css/blitzer/images/unlink.png">'
               + '<span class="editable">' + topic.name + '</span></li>')
               .attr("id", topic.id).attr("viewpoint", topic.viewpoint).attr("uri", topic.uri);
      $('ul#topic').append(el);
    };
    
    function fbox(){
      $("a[rel=fancybox_group]").fancybox({
				'transitionIn'		: 'none',
				'transitionOut'		: 'none',
				'titlePosition' 	: 'over',
				'titleFormat'		: function(title, currentArray, currentIndex, currentOpts) {
					return '<span id="fancybox-title-over">Image ' + (currentIndex + 1) + ' / ' + currentArray.length + (title.length ? ' &nbsp; ' + title : '') + '</span>';
				}
			});
		};
  }
  function TopicTree(){
    function radiobar(){
      var el = '<div id="topictree">'
		         + '<input type="radio" id="tt-cloud" name="topictree" /><label for="tt-cloud">Tag Cloud</label>'
		         + '<input type="radio" id="tt-tree" name="topictree"/><label for="tt-tree">Tree</label>'
		         + '</div>';
    		  $("#topic-tree-dialog").nextAll('div.ui-dialog-buttonpane').prepend(el);
    		  $( "#topictree" ).buttonset();
    		  $( "#tt-cloud" ).button({ icons: {primary:'ui-icon-tag'} }).click(function(){ $('#tree').hide(); $('#tags').show(); });
    		  $( "#tt-tree" ).button({ icons: {primary:'ui-icon-bookmark'} }).click(function(){ $('#tree').show(); $('#tags').hide(); });
      if($('#tags').css('display') != 'none'){
        $( "#tt-tree" ).removeAttr('checked').button( "refresh" );
        $( "#tt-cloud" ).attr('checked', true).button( "refresh" );
      }
      else
      {
        $( "#tt-cloud" ).removeAttr('checked').button( "refresh" );
        $( "#tt-tree" ).attr('checked', true).button( "refresh" );
      }
    };
    function showTagCloud(tags){
      $("#tags ul li").hide().remove();
      var max = 0;
      var min = 32768;
      for(var name in tags)
      {
        if(tags[name].size > max) max = tags[name].size;
        if(tags[name].size < min) min = tags[name].size;
      }
      $.log("max:" + max + ", min:" + min, 4);
      for(var name in tags)
      {
        var size = Math.round((tags[name].size - min) / (max-min) * 4) + 1;
        var content = $("<li class='tag" + size + "'><a>" + name + "</a></li>").attr("topics", JSON.stringify(tags[name].topics)).attr("name", name);
        $("#tags ul").append(content);
      }
      $("#tags ul li").tsort();
      $("#tags ul li a").click(function(){
        if($.agorae.session.ctrlPressed)
          $(this).toggleClass('tag-clicked');
        else
        {
          $("#tags ul li a").removeClass('tag-clicked');
          $(this).addClass('tag-clicked');
        }
      });
    };
    function showTopicTree(tree){
      $.jstree._themes = 'css/jsTree/themes/';
      $("#tree").jstree({
        "json_data" : tree,
        "types" : $.agorae.topictree.jstree_types,
        "plugins" : [ "themes", "json_data", "ui", "crrm", "types" ]
      });
    };
    this.init = function(){
      $("#topic-tree-dialog").dialog({
        bgiframe: true,
        autoOpen: false,
        modal: true,
        width: 400,
        title: "Thèmes",
        close: function(){
          $("#tree").jstree('destroy');
        },
        open: function(){
          var uri = $.getUri();
          if(uri && uri.indexOf("/topic/") > 0)
          {
            var parts = uri.split("/");
            parts.pop();
            var viewpointID = parts.pop();
            parts.pop();
            parts.push("viewpoint");
            parts.push(viewpointID);
            uri = parts.join("/");
          }
          else
            uri = null;
          var topics = $.agorae.getTopicTree(uri);
          radiobar();
          showTopicTree(topics.tree);
          showTagCloud(topics.tagcloud);
        }
      });
    };
    this.openDialog = function(callback){
      $("#topic-tree-dialog").dialog('option', "buttons", {
          'Okay': callback,
          'Annuler': function(){
            $("#topic-tree-dialog").dialog('close');
          }
      }).dialog('open');
    };
    this.closeDialog = function(){
      $("#topic-tree-dialog").dialog('close');
    };
    this.jstree_types = {
      "valid_children" : [ "viewpoint" ],
      "types" : {
        "viewpoint": { "icon" : {  "image" : "css/blitzer/images/viewpoint.png"} },
        "topic": { "icon" : {  "image" : "css/blitzer/images/topic.png" } }
      }
    };
  }
  function ItemDialog(){
    this.init = function(){
      $("#item-dialog").dialog({
        bgiframe: true,
        autoOpen: false,
        modal: true,
        width: 500,
        title: "Rechercher Items",
        close: function(){
          //Clear search result
        },
        open: function(){
          $('#item-search-corpus').show();
          $('#item-search-condition').hide().html('<ul class="search-condition"></ul>');
          $('#item-search-result').hide().html('<ul></ul>');
          $('#item-search-corpus select').find('option').remove();
          $('#item-search-corpus select').append($('<option></option>').attr("selected", true));
          $.agorae.getCorpora(function(corpus){
            var option = $('<option></option>').val(corpus.uri).text(corpus.name + "");
            $('#item-search-corpus select').append(option);
          });
          /*//Init attribute name
          $.agorae.itemdialog.names = $.agorae.getAttributeName();
          $('#item-search-condition').html('<ul class="search-condition"></ul>');
          showSearchCondition();*/
        }
      });
      $('#item-search-corpus select').bind('change', corpusChange);
      $('ul.search-condition select.attributename').die().live('change', onNameChange);
      $('ul.search-condition button.plus').die().live('click', showSearchCondition);
      $('ul.search-condition button.minus').die().live('click', removeSearchCondition);
    };
    this.open = function(callback){
      callback = callback || function(){};
      $("#item-search-result ul li").die().live('click', callback);
      $("#item-dialog").dialog('option', "buttons", {
          'Rechercher': doSearch,
          'Annuler': function(){
            $("#item-dialog").dialog('close');
          }
      }).dialog('open');
    };
    this.close = function(callback){
      $("#item-dialog").dialog('close');
    };
    function corpusChange(){
      $('#item-search-condition').hide().html('<ul class="search-condition"></ul>');
      if($(this).val() == "") return;
      $.agorae.itemdialog.names = $.agorae.getAttributeName($(this).val());
      $('#item-search-condition').show();
      showSearchCondition();
    };
    function showSearchCondition(){
      $.log($.agorae.itemdialog.names);
      var uuid = $.agorae.newUUID();
      var el = $('<li style="display: none">Nom : <select class="attributename"><option value=""></option></select>'
               + ' Valeur : <select class="attributevalue"><option value=""></option></select>'
               +'<button class="plus"></button><button class="minus"></button></li>').attr("id", uuid);

      for(var name in $.agorae.itemdialog.names)
        el.find("select:first").append('<option value="' + $.escapeHtml(name) +'">' + $.escapeHtml(name) +'</option>');
      $('ul.search-condition').append(el);
      el.slideDown({duration: 500, easing: 'easeOutBounce'});
      $("button:first", 'li#' + uuid).button({
          icons: {
              primary: "ui-icon-plusthick"
          },
          text: false
      }).next().button({
          icons: {
              primary: "ui-icon-minusthick"
          },
          text: false
      });
      $('ul.search-condition button:first').next().button({ disabled: true });
    };
    function removeSearchCondition(){
      var li = $(this).parent();
      li.slideUp({duration: 500, easing: 'easeOutCubic', complete: function(){ li.remove(); }});
    };
    function onNameChange(){
      var valSelect = $(this).nextAll("select");
      valSelect.find('option').remove();
      var name = $(this).val().trim();
      if(name == "")
        return;
      var values = $.agorae.getAttributeValue($.agorae.itemdialog.names[name], name);
      $.log(values);
      for(var v in values)
      {
        var el = $('<option></option>').attr('value', v).html(v);
        el.attr("values", JSON.stringify(values[v]));
        valSelect.append(el);
      }
    };
    function doSearch(){
      if($('#item-search-condition').css('display') != 'none')
      {
        /*$('select.attributevalue','ul.search-condition').each(function(){
          if($(this).val() == "")
            $(this).parent().slideUp({duration: 500, easing: 'easeOutCubic', complete: function(){ li.remove(); }});
        });*/
        var uris = [];
        $('select.attributevalue','ul.search-condition').each(function(){
          if($(this).val() == "") return;
          var option = $(this).find('option:selected');
          if(!option || option.length <= 0) return;
          var values = JSON.parse(option.attr("values"));
          $.log(values);
          for(var i=0, v; v = values[i]; i++)
          {
            var uri = v.uri + "/" + encodeURIComponent(v.attributename) + "/" + encodeURIComponent(v.attributevalue);
            if(uris.indexOf(uri) < 0) uris.push(uri);
          }
        });
        if(uris.length == 0) return;

        $(this).parents(".ui-dialog").find(".ui-dialog-buttonset").find("button:first span").html("Return");
        $('#item-search-result').show().html('<img src="css/blitzer/images/loading.gif" style="padding-left: 1em;">');
        $('#item-search-condition').hide();
        $('#item-search-corpus').hide();
        var items = $.agorae.searchItem(uris);
        $.log(items);
        $('#item-search-result').html('<ul></ul>');
        for(var i=0, item; item = items[i]; i++)
        {
          var el = $('<li></li>').html(item.name).attr("id", item.item).attr("name", item.name).attr("corpus", item.corpus);
          $("#item-search-result ul").append(el);
        }
      }
      else
      {
        $('#item-search-condition').show();
        $('#item-search-corpus').show();
        $('#item-search-result').hide();
        $(this).parents(".ui-dialog").find(".ui-dialog-buttonset").find("button:first span").html("Rechercher");
      }
    };
  }
  $.agorae = $.agorae || {};
  $.extend($.agorae, {
    session : new Session(),
    pagehelper : new PageHelper(),
    indexpage : new IndexPage(),
    corpuspage : new CorpusPage(),
    viewpointpage : new ViewpointPage(),
    topicpage : new TopicPage(),
    itempage : new ItemPage(),
    topictree : new TopicTree(),
    itemdialog : new ItemDialog()
  });
})(jQuery);