(function($) {
  $.agorae = $.agorae || {};

  $.extend($.agorae, {
    urlPrefix: '',

    newUUID: function() {
      return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
          return v.toString(16);
      });
    },

    httpSend: function(httpAction, httpUrl, httpBody) {
      httpAction = httpAction ? httpAction : "GET";
      httpUrl = httpUrl ? httpUrl : this.urlPrefix;
      httpBody = httpBody || "";
      options = options || {};
      $.ajax({
        type: httpAction, url: httpUrl, dataType: "json",
        data: httpBody,
        complete: function(req) {
          var resp = $.httpData(req, "json");
          if (req.status == 200) {
            if (options.success) options.success(resp);
          } else if (options.error) {
            options.error(req.status, resp.error, resp.reason);
          } else {
            alert("Error: " + resp.reason);
          }
        }
      });
    }
  });

})(jQuery);