(function($) {
  $.agorae = $.agorae || {};
  $.agorae.cache = $.agorae.cache || {};

  $.extend($.agorae, {
    newUUID: function() {
      return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
          return v.toString(16);
      });
    },
    getDocumentID: function(uri){
      var parts = uri.split("/");
      var id = parts.pop();
      if(id == '')
        id = parts.pop();
      return id;
    },
    httpSend: function(url, options) {
      options = options || {};
      httpAction = options.type ? options.type : "GET";
      httpBody = options.data || "";
      if(typeof(options.processData) == "boolean" && options.processData === true)
        cType = "application/x-www-form-urlencoded";
      else
        cType = (typeof(httpBody) == "string") ? "html/text" : "application/json";
      httpBody = (typeof(httpBody) == "string") ? httpBody : (typeof(options.processData) == "boolean" && options.processData === true) ? httpBody : JSON.stringify(httpBody);
      bAsync = (typeof(options.async) != "boolean") ? false : options.async;
      processData = (typeof(options.processData) != "boolean") ? false : options.processData;
      dataType = (typeof(options.dataType) == "string") ? options.dataType : "json";
      var success = options.success || function(){};

      $.ajax({
        type: httpAction, url: url, contentType: cType, dataType: dataType,
        processData: processData, data: httpBody, async: bAsync,
        dataFilter: function(data, type){
          if(type == "json")
            try{
              var resp = JSON.parse(data);
              return $.agorae.normalize(resp);
            }catch(e){
              $.log(e);
            }
          return data;
        },
        success: success,
        error: function(req) {
          var resp = "";
          try{ resp = $.httpData(req, "json"); } catch(e){}
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
    login: function(username, password, callback, success){
      //validate username and password on the specific service.
      if($.agorae.config.auth)
        $.agorae.httpSend($.agorae.config.auth, {type: "POST", username: username, password: password,
          data: {name: username, password: password},
          processData: true,
          success: function(){
            $.agorae.session.username = username;
            $.agorae.session.password = password;
            success();
            callback();
          },
          error: function(code, error, reason){
            callback({password: "Le nom d'utilisateur ou le mot de passe que vous avez saisi est incorrect.\n" + reason});
          }
        });
      else
      {
        //If no auth service is defined, just asume every user is a validated user
        success();
        callback();
      }
      $.ajaxSetup({username: username, password: password});
    },
    loadConfig: function(configUrl){
      $.agorae.httpSend(configUrl,
      {
        type: "GET",
        async: false,
        success: function(doc){
          $.agorae.config = doc;
        },
        error: function(code, error, reason){
          $.showMessage({title: "error", content: "Impossible de charger config document : " + configUrl});
        }
      });
    },
    getItem: function(itemUrl, callback, success, error){
      if(!error)
        error = function(code, error, reason){
          $.showMessage({title: "error", content: "Impossible de charger d'item : " + itemUrl});
        };
      if(!success)
        success = function(doc){
          var corpusID, itemID, item;
          for (var k in doc) {
            corpusID = k;
            break;
          }
          if(!doc[corpusID]){
            callback(false);
            return;
          }
          for (var k in doc[corpusID]){
            itemID = k;
            break;
          }
          if(!doc[corpusID][itemID]){
            callback(false);
            return;
          }
          item = doc[corpusID][itemID];
          item.corpus = corpusID;
          item.id = itemID;
          callback(item);
        };

      $.agorae.httpSend(itemUrl,
      {
        type: "GET",
        success: success,
        error: error
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
    getUser: function(serverUrl, callback){
      this.httpSend(serverUrl + "user/" + $.agorae.session.username,
      {
        type: "GET",
        success: function(doc){
          var user;
          user = doc[$.agorae.session.username];
          user.id = $.agorae.session.username;
          if(user.corpus)
            $.agorae.config.corpus = user.corpus
          callback(user);
        },
        error: function(code, error, reason){
          $.showMessage({title: "error", content: "Cannot load user:" + $.agorae.session.username + " from server:" + serverUrl});
        }
      });
    },
    createViewpoint: function(viewpointName, callback){
      var viewpoint = {};
      viewpoint.viewpoint_name = viewpointName;
      viewpoint.users = new Array($.agorae.session.username);
      this.httpSend($.agorae.config.servers[0],
      {
        type: "POST",
        data: viewpoint,
        success: function(doc){
          viewpoint.name = viewpointName;
          viewpoint.id = doc.id;
          viewpoint.rev = doc.rev;
          callback(viewpoint);
        },
        error: function(code, error, reason){
          $.showMessage({title: "Erreur", content: "Impossible de cr¨¦er un point de vue : " + reason});
        }
      });
    },
    renameViewpoint: function(url, name, success, error){
      $.agorae.httpSend(url,
      {
        type: "GET",
        success: function(doc){
          doc.viewpoint_name = name;
          $.agorae.httpSend(url+"?rev=" + doc._rev,
          {
            type: "PUT",
            data: doc,
            success: success,
            error: error
          });
        },
        error: function(code, error, reason){
          $.showMessage({title: "error", content: "Cannot get:" + url});
        }
      });
    },
    getTopic: function(url, success){
      var prefixUrl, docID, viewpointID, topicID;
      if(url.substr(-1) == '/')
        url = url.substr(0,url.length -1);

      $.log(url);
      if(url.indexOf("/topic/") > 0){
        var parts = url.split('/');
        topicID = parts.pop();
        viewpointID = parts.pop();
        parts.pop();
        prefixUrl = parts.join('/');
        parts.push('viewpoint');
        parts.push(viewpointID);
        viewpointUrl = parts.join('/');

        $.agorae.httpSend(viewpointUrl,
        {
          type: "GET",
          success: function(viewpoint){
            viewpoint = viewpoint[viewpointID];
            topic = viewpoint[topicID];
            topic.name = topic.name || '';
            var narrower = [];
            if(topic.narrower)
              for(var i=0, n; n = topic.narrower[i]; i++)
                narrower.push({"name": viewpoint[n.id].name, "id": n.id, "uri": prefixUrl + '/topic/' + viewpointID + '/' + n.id });
            var broader = [];
            function getBroader(topicID){
              if(!viewpoint[topicID] || !viewpoint[topicID].broader)
                return false;
              broader.push(viewpoint[topicID].broader[0]);
              getBroader(viewpoint[topicID].broader[0].id);
            }
            getBroader(topicID);
            success({"item": topic.item, "name": topic.name, "narrower": narrower, "viewpoint_name": viewpoint.name[0],
              "viewpoint_id": viewpointID, "prefixUrl": prefixUrl+"/", "broader": broader });
          }
        });
      }

    },
    createTopic: function(url, name, success){
      var prefixUrl, viewpointID, parentTopicID;
      if(url.substr(-1) == '/')
        url = url.substr(0,url.length -1);
      if(url.indexOf("/viewpoint/") > 0){
        prefixUrl = url.substr(0, url.indexOf("viewpoint/"));
        var parts = url.split('/');
        viewpointID = parts.pop();
        url = prefixUrl + viewpointID;
      }
      if(url.indexOf("/topic/") > 0){
        prefixUrl = url.substr(0, url.indexOf("topic/"));
        var parts = url.split('/');
        parentTopicID = parts.pop();
        viewpointID = parts.pop();
        url = prefixUrl + viewpointID;
      }
      $.agorae.httpSend(url,
      {
        type: "GET",
        success: function(doc){
          if(!doc.topics) doc.topics = {};
          var topicID = $.agorae.newUUID();
          var broader = (parentTopicID) ? [parentTopicID] : [];
          doc.topics[topicID] = {
            "broader": broader,
            "name": name
          };
          $.agorae.httpSend(url+"?rev=" + doc._rev,
          {
            type: "PUT",
            data: doc,
            success: function(doc){
              success({"id": topicID, "name": name});
            },
            error: function(code, error, reason){
              $.showMessage({title: "error", content: "Cannot update:" + url});
            }
          });
        },
        error: function(code, error, reason){
          $.showMessage({title: "error", content: "Cannot get:" + url});
        }
      });
    },
    deleteTopic: function(url, id, success){
      var prefixUrl, viewpointID;
      if(url.substr(-1) == '/')
        url = url.substr(0,url.length -1);
      if(url.indexOf("/viewpoint/") > 0){
        prefixUrl = url.substr(0, url.indexOf("viewpoint/"));
        var parts = url.split('/');
        viewpointID = parts.pop();
        url = prefixUrl + viewpointID;
      }
      if(url.indexOf("/topic/") > 0){
        prefixUrl = url.substr(0, url.indexOf("topic/"));
        var parts = url.split('/');
        parts.pop();
        viewpointID = parts.pop();
        url = prefixUrl + viewpointID;
      }
      $.agorae.httpSend(url,
      {
        type: "GET",
        success: function(viewpoint){
          delete viewpoint.topics[id];
          for(var tid in viewpoint.topics){
            var topic = viewpoint.topics[tid];
            if(topic.broader && topic.broader instanceof Array)
              for(var i=0, t; t = topic.broader[i]; i++)
                if(t == id)
                {
                  topic.broader.splice(i, 1);
                  i--;
                }
          }
          $.log(viewpoint);
          $.agorae.httpSend(url+"?rev=" + viewpoint._rev,
          {
            type: "PUT",
            data: viewpoint,
            success: success,
            error: function(code, error, reason){
              $.showMessage({title: "error", content: "Cannot delete:" + url});
            }
          });
        },
        error: function(code, error, reason){
          $.showMessage({title: "error", content: "Cannot get:" + url});
        }
      });
    },
    unlinkTopic: function(url, id, success){
      var prefixUrl, viewpointID;
      if(url.substr(-1) == '/')
        url = url.substr(0,url.length -1);
      if(url.indexOf("/topic/") > 0){
        prefixUrl = url.substr(0, url.indexOf("topic/"));
        var parts = url.split('/');
        parts.pop();
        viewpointID = parts.pop();
        url = prefixUrl + viewpointID;
      }
      $.agorae.httpSend(url,
      {
        type: "GET",
        success: function(viewpoint){
          viewpoint.topics[id].broader = [];
          $.agorae.httpSend(url+"?rev=" + viewpoint._rev,
          {
            type: "PUT",
            data: viewpoint,
            success: success,
            error: function(code, error, reason){
              $.showMessage({title: "error", content: "Cannot delete:" + url});
            }
          });
        },
        error: function(code, error, reason){
          $.showMessage({title: "error", content: "Cannot get:" + url});
        }
      });
    },
    renameTopic: function(url, id, name, success){
      var prefixUrl, viewpointID;
      if(url.substr(-1) == '/')
        url = url.substr(0,url.length -1);
      if(url.indexOf("/viewpoint/") > 0){
        prefixUrl = url.substr(0, url.indexOf("viewpoint/"));
        var parts = url.split('/');
        viewpointID = parts.pop();
        url = prefixUrl + viewpointID;
      }
      if(url.indexOf("/topic/") > 0){
        prefixUrl = url.substr(0, url.indexOf("topic/"));
        var parts = url.split('/');
        parts.pop();
        viewpointID = parts.pop();
        url = prefixUrl + viewpointID;
      }
      $.agorae.httpSend(url,
      {
        type: "GET",
        success: function(viewpoint){
          viewpoint.topics[id].name = name;
          $.agorae.httpSend(url+"?rev=" + viewpoint._rev,
          {
            type: "PUT",
            data: viewpoint,
            success: success,
            error: function(code, error, reason){
              $.showMessage({title: "error", content: "Cannot rename:" + url});
            }
          });
        },
        error: function(code, error, reason){
          $.showMessage({title: "error", content: "Cannot get:" + url});
        }
      });
    },
    deleteDoc: function(url, callback){
      this.httpSend(url,
      {
        type: "GET",
        success: function(doc){
          $.agorae.httpSend(url+"?rev=" + doc._rev,
          {
            type: "DELETE",
            success: function(doc){
              callback(doc);
            },
            error: function(code, error, reason){
              $.showMessage({title: "error", content: "Cannot delete:" + url});
            }
          });
        },
        error: function(code, error, reason){
          $.showMessage({title: "error", content: "Cannot get:" + url});
        }
      });
    },
    getCorpus: function(url, success){
      if($.agorae.config.corpus)
      {
        var corpus = (typeof($.agorae.config.corpus) != 'string') ? $.agorae.config.corpus[0] : $.agorae.config.corpus;
        success(corpus);
        return false;
      }

      var userUrl = url + "user/" + $.agorae.config.username;
      $.agorae.httpSend(userUrl,
      {
        type: "GET",
        success: function(user){
          user = user[$.agorae.config.username];
          if(user.corpus)
          {
            var corpus = user.corpus[0];
            $.agorae.config.corpus = corpus;
            success(corpus);
            return false;
          }
          $.agorae.createCorpus(url, null, success);
        },
        error: function(code, error, reason){
          $.showMessage({title: "error", content: "Cannot load user:" + username + " from server:" + url});
        }
      });
    },
    createCorpus: function(url, corpusName, success){
      corpusName = corpusName || 'no name';
      var corpus = {};
      corpus.corpus_name = corpusName;
      corpus.users = [$.agorae.config.username];
      $.agorae.httpSend(url,
      {
        type: "POST",
        data: corpus,
        success: function(doc){
          success(doc);
        },
        error: function(code, error, reason){
          $.showMessage({title: "error", content: "Cannot create corpus!"});
        }
      });
    },
    createItem: function(topicUrl, itemName, success){
      var prefixUrl, topicID, viewpointID;
      if(topicUrl.substr(-1) == '/')
        topicUrl = topicUrl.substr(0,topicUrl.length -1);
      if(topicUrl.indexOf("/topic/") > 0){
        prefixUrl = topicUrl.substr(0, topicUrl.indexOf("topic/"));
        var parts = topicUrl.split('/');
        topicID = parts.pop();
        viewpointID = parts.pop();
      }

      var crtItem = function(corpus){
        $.log('crtItem');
        var item = {
          "item_name": itemName,
          "item_corpus": corpus.id,
          "topics": {}
        };
        item.topics[topicID] = {"viewpoint": viewpointID};
        $.log(prefixUrl);
        $.log(item);

        $.agorae.httpSend(prefixUrl,
        {
          type: "POST",
          data: item,
          success: function(doc){
            item.id = doc.id;
            item.corpus = item.item_corpus;
            item.name = item.item_name;
            delete item.item_corpus;
            delete item.item_name;
            $.log(item);
            success(item);
          },
          error: function(code, error, reason){
            $.showMessage({title: "error", content: "Cannot create item!"});
          }
        });
      };
      $.agorae.getCorpus(prefixUrl, crtItem);
    },
    unlinkItem: function(topicUrl, itemID, success){
      var prefixUrl, topicID, viewpointID;
      if(topicUrl.substr(-1) == '/')
        topicUrl = topicUrl.substr(0,topicUrl.length -1);
      if(topicUrl.indexOf("/topic/") > 0){
        prefixUrl = topicUrl.substr(0, topicUrl.indexOf("topic/"));
        var parts = topicUrl.split('/');
        topicID = parts.pop();
        viewpointID = parts.pop();
      }
      $.each($.agorae.config.servers, function(idx, server){
        $.agorae.httpSend(prefixUrl + itemID,
        {
          type: "GET",
          success: function(item){
            if(item.topics[topicID]){
              delete item.topics[topicID];
              $.agorae.httpSend(prefixUrl + itemID + "?rev=" + item._rev,
              {
                type: "PUT",
                data: item,
                success: function(item){
                  success(item);
                }
              });
            }
          }
        });
      });
    },
    renameItem: function(prefixUrl, itemID, name, success){
      $.agorae.httpSend(prefixUrl + itemID,
      {
        type: "GET",
        success: function(item){
          item.item_name = name;
          $.agorae.httpSend(prefixUrl + itemID + "?rev=" + item._rev,
          {
            type: "PUT",
            data: item,
            success: function(item){
              success(item);
            }
          });
        }
      });
    },
    deleteItemAttachment: function(itemUrl, attachment_name, callback) {
      $.agorae.httpSend(itemUrl,
      {
        type: "GET",
        success: function(doc){
          $.agorae.httpSend(itemUrl + "/" + attachment_name + "?rev=" + doc._rev,
          {
            type: "DELETE",
            success: function(doc){
              callback(doc);
            },
            error: function(code, error, reason){
              $.showMessage({title: "error", content: "Cannot delete:" + itemUrl});
            }
          });
        },
        error: function(code, error, reason){
          $.showMessage({title: "error", content: "Cannot get:" + itemUrl});
        }
      });
    },
    attachItemResource: function(itemUrl, resource, success){
      $.agorae.httpSend(itemUrl,
      {
        type: "GET",
        success: function(doc){
          $.log(doc);
          if(!doc.resource) doc.resource = [];
          doc.resource.push(resource);
          $.agorae.httpSend(itemUrl + "?rev=" + doc._rev,
          {
            type: "PUT",
            data: doc,
            success: success
          });
        },
        error: function(code, error, reason){
          $.showMessage({title: "error", content: "Cannot get:" + itemUrl});
        }
      });
    },
    updateItemResource: function(itemUrl, resource, newResource, success){
      $.agorae.httpSend(itemUrl,
      {
        type: "GET",
        success: function(doc){
          $.log(doc);
          if(!doc.resource) doc.resource = [];
          for(var i=0, r; r=doc.resource[i]; i++)
            if(r == resource)
            {
              doc.resource.splice(i,1);
              i--;
            }
          doc.resource.push(newResource);
          $.agorae.httpSend(itemUrl + "?rev=" + doc._rev,
          {
            type: "PUT",
            data: doc,
            success: success
          });
        },
        error: function(code, error, reason){
          $.showMessage({title: "error", content: "Cannot get:" + itemUrl});
        }
      });
    },
    createItemAttribute: function(itemUrl, attributename, attributevalue, success){
      $.agorae.httpSend(itemUrl,
      {
        type: "GET",
        success: function(doc){
          $.log(doc);
          if(!doc[attributename]) doc[attributename] = [];
          if(doc[attributename].indexOf(attributevalue) < 0)
            doc[attributename].push(attributevalue);
          $.agorae.httpSend(itemUrl + "?rev=" + doc._rev,
          {
            type: "PUT",
            data: doc,
            success: success
          });
        },
        error: function(code, error, reason){
          $.showMessage({title: "error", content: "Cannot get:" + itemUrl});
        }
      });
    },
    deleteItemAttribute: function(itemUrl, attributename, attributevalue, success){
      $.agorae.httpSend(itemUrl,
      {
        type: "GET",
        success: function(doc){
          $.log(doc);
          if(!doc[attributename] || doc[attributename].indexOf(attributevalue) < 0)
          {
            success();
            return false;
          }
          for(var i=0, v; v = doc[attributename][i]; i++)
            if(v == attributevalue)
            {
              doc[attributename].splice(i, 1);
              i--;
            }
          $.agorae.httpSend(itemUrl + "?rev=" + doc._rev,
          {
            type: "PUT",
            data: doc,
            success: success
          });
        },
        error: function(code, error, reason){
          $.showMessage({title: "error", content: "Cannot get:" + itemUrl});
        }
      });
    },
    updateItemAttribute: function(itemUrl, attributename, attributevalue, name, value, success){
      $.agorae.httpSend(itemUrl,
      {
        type: "GET",
        success: function(doc){
          $.log(doc);
          if(!doc[attributename] || doc[attributename].indexOf(attributevalue) < 0)
          {
            success();
            return false;
          }
          for(var i=0, v; v = doc[attributename][i]; i++)
            if(v == attributevalue)
            {
              doc[attributename].splice(i, 1);
              i--;
            }
          if(!doc[name]) doc[name] = [];
          if(doc[name].indexOf(value))
          {
            success(doc);
            return true;
          }
          doc[name].push(value);
          $.agorae.httpSend(itemUrl + "?rev=" + doc._rev,
          {
            type: "PUT",
            data: doc,
            success: success
          });
        },
        error: function(code, error, reason){
          $.showMessage({title: "error", content: "Cannot get:" + itemUrl});
        }
      });
    }
  });
})(jQuery);