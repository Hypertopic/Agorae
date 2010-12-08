(function($) {
  $.agorae = $.agorae || {};

  $.extend($.agorae, {
    newUUID: function() {
      return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
          return v.toString(16);
      });
    },

    httpSend: function(url, options) {
      options = options || {};
      httpAction = options.type ? options.type : "GET";
      httpBody = options.data || "";
      dType = (typeof(httpBody) == "string") ? "text" : "json";
      bAsync = (typeof(options.async) != "boolean") ? false : options.async;
      $.ajax({
        type: httpAction, url: url, dataType: dType,
        data: httpBody, async: bAsync,
        complete: function(req) {
          var resp = "";
          try{ resp = $.httpData(req, "json"); } catch(e){}
          if (req.status >= 200 && req.status < 300) {
            if (options.success)
              options.success($.agorae.normalize(resp));
          }
          else
            if (options.error) {
              var error = (resp && resp.error) ? resp.error : "unkown";
              var reason = (resp && resp.reason) ? resp.reason : "unkown";
              if(req.status == 0)
                reason = "cross domain request limited";
              options.error(req.status, error, reason);
            } else {
              alert("Error: " + resp.reason);
            }
        }
      });
    },

    normalize: function(obj){
      if(!obj.rows) return obj;
      var rows = obj.rows;
      var result = {};
      for(var i=0; i < rows.length; i++)
      {
        var r = rows[i];
        var keys = r.key;
        var current = result;
        for(var k=0; k < keys.length; k++)
        {
          if(!current[keys[k]])
            current[keys[k]] = {};
          current = current[keys[k]];
        }
        var value = r.value;
        for(var attribute in value)
        {
          if(!current[attribute])
            current[attribute] = [];
          current[attribute].push(value[attribute]);
        }
      }
      return result;
    },

    login: function(config, username, password, callback){
      this.httpSend(config, {type: "GET", username: username, password: password,
        success: function(doc){
          $.agorae.config = doc;
          //if there is no auth field in config document, then this service don't request authentication.
          if(!doc.auth){
            $.agorae.config.username = username;
            $.ajaxSetup({username: username, password: password});
            callback();
            $.showPage('page/_index.html', $.agorae.frontpage.init);
            return;
          }

          //validate username and password on the specific service.
          $.agorae.httpSend(doc.auth, {type: "POST", username: username, password: password,
            data: {name: username, password: password},
            success: function(){
              $.agorae.config.username = username;
              $.ajaxSetup({username: username, password: password});
              callback();
              $.showPage('page/_index.html', $.agorae.frontpage.init);
            },
            error: function(code, error, reason){
              callback({name: "Error username:" + reason});
            }
          });

        },
        error: function(code, error, reason){
          callback({config: "Error read config document:" + reason});
        }
      });
    },

    getItem: function(itemUrl, callback){
      this.httpSend(itemUrl,
      {
        type: "GET",
        success: function(doc){
          var corpusID, itemID, item;
          for (var k in doc) {
            corpusID = k;
            break;
          }
          for (var k in doc[corpusID]){
            itemID = k;
            break;
          }
          item = doc[corpusID][itemID];
          item.corpus = corpusID;
          item.id = itemID;
          callback(item);
        },
        error: function(code, error, reason){
          $.showMessage({title: "error", content: "Cannot load item:" + itemUrl});
        }
      });
    },

    getViewpoint: function(viewpointUrl, callback){
      this.httpSend(viewpointUrl,
      {
        type: "GET",
        success: function(doc){
          var viewpointID, viewpoint;
          for (var k in doc) {
            viewpointID = k;
            break;
          }
          viewpoint = doc[viewpointID];
          viewpoint.id = viewpointID;
          callback(viewpoint);
        },
        error: function(code, error, reason){
          $.showMessage({title: "error", content: "Cannot load viewpoint:" + viewpointUrl});
        }
      });
    },

    getUser: function(serverUrl, username, callback){
      this.httpSend(serverUrl + "user/" + username,
      {
        type: "GET",
        success: function(doc){
          var user;
          user = doc[username];
          user.id = username;
          callback(user);
        },
        error: function(code, error, reason){
          $.showMessage({title: "error", content: "Cannot load user:" + username + " from server:" + serverUrl});
        }
      });
    }
  });
})(jQuery);