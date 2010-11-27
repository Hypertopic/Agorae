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
              options.success(resp);
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

    login: function(config, username, password, callback){
      this.httpSend(config, {type: "GET", username: username, password: password,
        success: function(doc){
          $.agorae.config = doc;
          //if there is no auth field in config document, then this service don't request authentication.
          if(!doc.auth){
            $.agorae.config.username = username;
            $.ajaxSetup({username: username, password: password});
            callback();
            return;
          }

          //validate username and password on the specific service.
          $.agorae.httpSend(doc.auth, {type: "POST", username: username, password: password,
            data: {name: username, password: password},
            success: function(){
              $.agorae.config.username = username;
              $.ajaxSetup({username: username, password: password});
              callback();
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
    }
  });

})(jQuery);