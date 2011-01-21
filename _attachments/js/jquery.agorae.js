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
    getServerUri: function(uri){
      if(uri.indexOf("/viewpoint/") >= 0)
        return uri.substr(0, uri.indexOf("/viewpoint/") + 1);
      if(uri.indexOf("/topic/") >= 0)
        return uri.substr(0, uri.indexOf("/topic/") + 1);
      if(uri.indexOf("/item/") >= 0)
        return uri.substr(0, uri.indexOf("/item/") + 1);
      if(uri.indexOf("/corpus/") >= 0)
        return uri.substr(0, uri.indexOf("/corpus/") + 1);

      return uri;
    },
    getDocumentUri: function(uri){
      var parts = uri.split("/");
      var id = parts.pop();
      if(uri.indexOf("/viewpoint/") >= 0)
        return uri.substr(0, uri.indexOf("/viewpoint/") + 1) + id;
      if(uri.indexOf("/topic/") >= 0){
        id = parts.pop();
        return uri.substr(0, uri.indexOf("/topic/") + 1) + id;
      }
      if(uri.indexOf("/item/") >= 0)
        return uri.substr(0, uri.indexOf("/item/") + 1) + id;
      if(uri.indexOf("/corpus/") >= 0)
        return uri.substr(0, uri.indexOf("/corpus/") + 1) + id;
      return uri;
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

      if(httpAction == 'GET'){
        if(options.cache !== false && url in $.agorae.cache)
        {
          options.success( $.agorae.cache[url] );
          return;
        }
      }
      else
        $.agorae.cache = {};
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
        success: function(resp){
          if(options.cache !== false)
            $.agorae.cache[url] = resp;
          if(options.success)
            options.success(resp);
        },
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
    loadConfig: function(configDocUrl){
      $.agorae.httpSend(configDocUrl,
      {
        type: "GET",
        async: false,
        success: function(doc){
          $.agorae.config = doc.agorae;
        },
        error: function(code, error, reason){
          $.showMessage({title: "error", content: "Impossible de charger config document : " + configDocUrl});
        }
      });
    },
    getCorpora: function(callback){
      if($.agorae.config.corpora)
        $.each($.agorae.config.corpora, function(idx, corpus){
          var corpusUrl = (corpus.indexOf("http") != 0) ?
                            corpusUrl = $.agorae.config.servers[0] + 'corpus/' + corpus : corpus;
          $.agorae.getCorpus(corpusUrl, function(corpus){
            corpus.uri = corpusUrl;
            corpus.source = 'config';
            callback(corpus);
          });
        });
      if($.agorae.session.username)
        $.each($.agorae.config.servers, function(idx, server){
          $.agorae.getUser(server, function(user){
            if(user.corpus)
              for(var i=0, corpus; corpus = user.corpus[i]; i++){
                var corpusUrl = server + 'corpus/' + corpus.id;
                corpus.uri = corpusUrl;
                corpus.source = 'config';
                callback(corpus);
              }
          });
        });
    },
    getCorpus: function(corpusUrl, callback){
      $.agorae.httpSend(corpusUrl,
      {
        type: "GET",
        success: function(doc){
          var corpusID = $.agorae.getDocumentID(corpusUrl);
          if(!(corpusID in doc)) return;
          var corpus = doc[corpusID];
          corpus.id = corpusID;
          callback(corpus);
        }
      });
    },
    renameCorpus: function(url, name, success, error){
      var url = $.agorae.getDocumentUri(url);
      $.agorae.httpSend(url,
      {
        type: "GET",
        cache: false,
        success: function(doc){
          doc.corpus_name = name;
          $.agorae.httpSend(url+"?rev=" + doc._rev,
          {
            type: "PUT",
            data: doc,
            success: success
          });
        },
        error: function(code, error, reason){
          $.showMessage({title: "error", content: "Cannot get:" + url});
        }
      });
    },
    deleteCorpus: function(url, success){
      url = $.agorae.getDocumentUri(url);
      $.agorae.httpSend(url,
      {
        type: "GET",
        cache: false,
        success: function(doc){
          $.agorae.httpSend(url+"?rev=" + doc._rev,
          {
            type: "DELETE",
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
          if(callback)
            callback(item);
        };

      $.agorae.httpSend(itemUrl,
      {
        type: "GET",
        cache: false,
        success: success,
        error: error
      });
    },
    getViewpoint: function(viewpointUrl, callback){
      $.agorae.httpSend(viewpointUrl,
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
    getViewpointByID: function(viewpointID, callback){
      var found = false;
      for(var i=0, server; server = $.agorae.config.servers[i]; i++)
      {
        $.agorae.httpSend(server + 'viewpoint/' + viewpointID,
        {
          type: "GET",
          async: false,
          success: function(doc){
            var viewpointID, viewpoint;
            for (var k in doc) {
              viewpointID = k;
              break;
            }
            viewpoint = doc[viewpointID];
            viewpoint.id = viewpointID;
            callback(viewpoint);
            found = true;
          }
        });
        if(found) return;
      }
    },
    getUser: function(serverUrl, callback){
      this.httpSend(serverUrl + "user/" + $.agorae.session.username,
      {
        type: "GET",
        success: function(doc){
          var user;
          if(!($.agorae.session.username in doc)) return;
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
      $.agorae.httpSend($.agorae.config.servers[0],
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
      var url = $.agorae.getDocumentUri(url);
      $.agorae.httpSend(url,
      {
        type: "GET",
        cache: false,
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
      var prefixUrl, parts, viewpointID, topicID;
      var parts = url.split("/");
      topicID = parts.pop();
      prefixUrl = parts.join("/") + "/";
      viewpointID = parts.pop();
      parts.pop();
      parts.push("viewpoint");
      parts.push(viewpointID);
      viewpointUrl = parts.join("/");
      $.agorae.httpSend(viewpointUrl,
      {
        type: "GET",
        success: function(viewpoint){
          viewpoint = viewpoint[viewpointID];
          var topic = viewpoint[topicID];
          topic.name = topic.name || '';
          var narrower = [];
          if(topic.narrower)
            for(var i=0, n; n = topic.narrower[i]; i++)
              narrower.push({"name": viewpoint[n.id].name, "id": n.id, "uri": prefixUrl + n.id });
          var broader = [];
          function getBroader(topicID){
            if(!viewpoint[topicID] || !viewpoint[topicID].broader)
              return false;
            broader.push(viewpoint[topicID].broader[0]);
            getBroader(viewpoint[topicID].broader[0].id);
          }
          getBroader(topicID);
          success({"item": topic.item, "name": topic.name, "narrower": narrower, "viewpoint_name": viewpoint.name[0],
            "viewpoint_id": viewpointID, "viewpointUrl": viewpointUrl, "broader": broader, "prefixUrl": prefixUrl });
        }
      });
    },
    getTopicName: function(id, viewpoint){
      if(!$.agorae.config.servers)
        return false;
      var found = false;
      for(var i = 0, server; server = $.agorae.config.servers[i]; i++){

        $.agorae.httpSend(server + "viewpoint/" + viewpoint,
        {
          type: "GET",
          async: false,
          success: function(doc){
            if(!(viewpoint in doc)) return;
            doc = doc[viewpoint];
            if(id in doc && doc[id].name)
              found = {"name": doc[id].name, "uri": server + "topic/" + viewpoint + "/" + id};
          }
        });
        if(found) return found;
      }
    },
    createTopic: function(url, name, success){
      var prefixUrl, viewpointID, parentTopicID;
      if(url.indexOf("/topic/") > 0){
        var parts = url.split('/');
        parentTopicID = parts.pop();
        viewpointID = parts.pop();
      }
      url = $.agorae.getDocumentUri(url);
      $.agorae.httpSend(url,
      {
        type: "GET",
        cache: false,
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
              doc.id = topicID;
              doc.name = name;
              success(doc);
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
      url = $.agorae.getDocumentUri(url);
      $.agorae.httpSend(url,
      {
        type: "GET",
        cache: false,
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
      url = $.agorae.getDocumentUri(url);
      $.agorae.httpSend(url,
      {
        type: "GET",
        cache: false,
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
      url = $.agorae.getDocumentUri(url);
      $.agorae.httpSend(url,
      {
        type: "GET",
        cache: false,
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
    moveTopicIn: function(url, topics, success){
      var parts = url.split("/");
      var topicID = parts.pop();
          url = $.agorae.getDocumentUri(url);
      $.agorae.httpSend(url,
      {
        type: "GET",
        cache: false,
        success: function(viewpoint){
          var parents = $.agorae.getBroader(viewpoint, topicID);
          parents.push(topicID);
          var inserts = [];
          for(var i=0, topic; topic = topics[i]; i++)
          {
            if(!(topic.id in viewpoint.topics)) continue;
            if(parents.indexOf(topic.id) >= 0) continue;
            if(!(viewpoint.topics[topic.id].broader)) viewpoint.topics[topic.id].broader = [];
            if(viewpoint.topics[topic.id].broader.indexOf(topicID) >= 0) continue;
            viewpoint.topics[topic.id].broader.push(topicID);
            inserts.push(topic);
          }
          $.agorae.httpSend(url+"?rev=" + viewpoint._rev,
          {
            type: "PUT",
            data: viewpoint,
            success: function(){
              success(inserts);
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
    moveTopicIn2: function(url, topicID, parentTopicID){
      var result = false;
      var documentUri = $.agorae.getDocumentUri(url);
      $.agorae.httpSend(documentUri,
      {
        type: "GET",
        cache: false,
        async: false,
        success: function(viewpoint){
          if(parentTopicID)
          {
            if(!(viewpoint.topics[topicID].broader)) viewpoint.topics[topicID].broader = [];
            if(viewpoint.topics[topicID].broader.indexOf(parentTopicID) < 0)
              viewpoint.topics[topicID].broader.push(parentTopicID);
          }
          else
          {
            viewpoint.topics[topicID].broader = [];
          }
          $.agorae.httpSend(documentUri + "?rev=" + viewpoint._rev,
          {
            type: "PUT",
            data: viewpoint,
            async: false,
            success: function(){
              result = true;
            },
            error: function(){}
          });
        }
      });
      return result;
    },
    getUserCorpus: function(url, success){
      /*if(!$.agorae.config.corpus && !$.agorae.session.username)
      {
        $.showMessage({title: "error", content: "Please set your default corpora in your configuration or login first."});
        return;
      }
      if($.agorae.config.corpus)
      {
        success($.agorae.session.corpus);
        return false;
      }*/
      if($.agorae.session.corpus)
      {
        success($.agorae.session.corpus);
        return false;
      }

      var userUrl = url + "user/" + $.agorae.session.username;
      $.agorae.httpSend(userUrl,
      {
        type: "GET",
        success: function(user){
          user = user[$.agorae.session.username];
          if(user.corpus)
          {
            $.log(user.corpus);
            var corpus = user.corpus[0];
            $.agorae.session.corpus = corpus;
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
      corpusName = corpusName || 'Sans nom';
      var corpus = {};
      corpus.corpus_name = corpusName;
      corpus.users = [$.agorae.session.username];
      $.agorae.httpSend(url,
      {
        type: "POST",
        data: corpus,
        success: function(doc){
          success(doc);
        },
        error: function(code, error, reason){
          $.showMessage({title: "Erreur", content: "Impossible de créer corpus : " + reason});
        }
      });
    },
    createItemWithinCorpus: function(corpusUrl, name, success){
      var corpusID = $.agorae.getDocumentID(corpusUrl),
          prefixUrl = $.agorae.getServerUri(corpusUrl);
      var item = {
        "item_name": name,
        "item_corpus": corpusID,
        "topics": {}
      };

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
          success(item);
        },
        error: function(code, error, reason){
          $.showMessage({title: "error", content: "Cannot create item!"});
        }
      });
    },
    createItemWithTopicAndCorpus: function(topicUrl, corpusUrl, name, success){
      var parts = topicUrl.split('/'),
      topicID = parts.pop(),
      viewpointID = parts.pop(),
      prefixUrl = $.agorae.getServerUri(corpusUrl),
      corpusID = $.agorae.getDocumentID(corpusUrl);
      var item = {
        "item_name": name,
        "item_corpus": corpusID,
        "topics": {}
      };
      item.topics[topicID] = {"viewpoint": viewpointID};
      $.log(item);
      $.agorae.httpSend(prefixUrl,
      {
        type: "POST",
        data: item,
        success: function(doc){
          item.id = doc.id;
          item.corpus = item.item_corpus;
          item.name = item.item_name;
          success(item);
        },
        error: function(code, error, reason){
          $.showMessage({title: "error", content: "Cannot create item!"});
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
      $.agorae.getUserCorpus(prefixUrl, crtItem);
    },
    unlinkItem: function(topicUrl, itemID, success){
      var prefixUrl, topicID, viewpointID;
      topicID = $.agorae.getDocumentID(topicUrl);
      $.each($.agorae.config.servers, function(idx, server){
        $.agorae.httpSend(server + itemID,
        {
          type: "GET",
          cache: false,
          success: function(item){
            if(item.topics[topicID]){
              delete item.topics[topicID];
              $.agorae.httpSend(server + itemID + "?rev=" + item._rev,
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
    linkItem: function(topicUrl, corpusID, itemID, name, success){
      var prefixUrl, topicID, viewpointID;
      topicID = $.agorae.getDocumentID(topicUrl);
      var viewpointUrl = $.agorae.getDocumentUri(topicUrl);
      viewpointID = $.agorae.getDocumentID(viewpointUrl);
      $.each($.agorae.config.servers, function(idx, server){
        $.agorae.httpSend(server + itemID,
        {
          type: "GET",
          cache: false,
          success: function(item){
            item.topics[topicID] = {"viewpoint": viewpointID};
            $.agorae.httpSend(server + itemID + "?rev=" + item._rev,
            {
              type: "PUT",
              data: item,
              success: function(item){
                success(item);
              }
            });
          }
        });
      });
    },
    renameItem: function(prefixUrl, itemID, name, success){
      $.agorae.httpSend(prefixUrl + itemID,
      {
        type: "GET",
        cache: false,
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
        cache: false,
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
        cache: false,
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
        cache: false,
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
    unlinkItemResource: function(itemUrl, success){
      $.agorae.httpSend(itemUrl,
      {
        type: "GET",
        cache: false,
        success: function(doc){
          delete doc.resource
          $.agorae.httpSend(itemUrl + "?rev=" + doc._rev,
          {
            type: "PUT",
            data: doc,
            success: success
          });
        }
      });
    },
    createItemAttribute: function(itemUrl, attributename, attributevalue, success){
      attributename = $.trim(attributename);
      attributevalue = $.trim(attributevalue);
      $.agorae.httpSend(itemUrl,
      {
        type: "GET",
        cache: false,
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
        cache: false,
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
        cache: false,
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
    },
    tagItem: function(itemUrl, topics, success){
      $.agorae.httpSend(itemUrl,
      {
        type: "GET",
        cache: false,
        success: function(item){
          if(!item.topics) item.topics = {};
          for(var i=0, topic; topic = topics[i]; i++)
            item.topics[topic.id] = {"viewpoint": topic.viewpoint };
          $.agorae.httpSend(itemUrl + "?rev=" + item._rev,
          {
            type: "PUT",
            data: item,
            success: success
          });
        },
        error: function(code, error, reason){
          $.showMessage({title: "error", content: "Cannot get:" + itemUrl});
        }
      });
    },
    untagItem: function(itemUrl, id, success){
      itemUrl = $.agorae.getDocumentUri(itemUrl);
      $.agorae.httpSend(itemUrl,
      {
        type: "GET",
        cache: false,
        success: function(item){
          if(!item.topics) { success(); return false; }
          delete item.topics[id];
          $.agorae.httpSend(itemUrl + "?rev=" + item._rev,
          {
            type: "PUT",
            data: item,
            success: success
          });
        },
        error: function(code, error, reason){
          $.showMessage({title: "error", content: "Cannot get:" + itemUrl});
        }
      });
    },
    describeItem: function(itemUrl, name, value, success){
      itemUrl = $.agorae.getDocumentUri(itemUrl);
      $.agorae.httpSend(itemUrl,
      {
        type: "GET",
        cache: false,
        success: function(item){
          if(!item[name])
          {
            item[name] = value;
          }
          else
          {
            if(typeof(item[name]) == "string")
              item[name] = [item[name], value];
            else
              item[name].push(value);
          }
          $.agorae.httpSend(itemUrl + "?rev=" + item._rev,
          {
            type: "PUT",
            data: item,
            success: function(){
              success(name, [value]);
            }
          });
        },
        error: function(code, error, reason){
          $.showMessage({title: "error", content: "Cannot get:" + itemUrl});
        }
      });
    },
    undescribeItem: function(itemUrl, name, value, success){
      itemUrl = $.agorae.getDocumentUri(itemUrl);
      $.agorae.httpSend(itemUrl,
      {
        type: "GET",
        cache: false,
        success: function(item){
          if(!item[name])
          {
            success();
            return;
          }
          if(typeof(item[name]) == "string")
              delete item[name];
          else{
            for(var i=0, v; v = item[name][i]; i++)
              if(v == value)
              {
                item[name].splice(i, 1);
                i--;
              }
            if(item[name].length == 0)
              delete item[name];
            else
              if(item[name].length == 1)
                item[name] = item[name][0];
          }
          $.agorae.httpSend(itemUrl + "?rev=" + item._rev,
          {
            type: "PUT",
            data: item,
            success: function(){
              success();
            }
          });
        },
        error: function(code, error, reason){
          $.showMessage({title: "error", content: "Cannot get:" + itemUrl});
        }
      });
    },
    getBroader: function(viewpoint, topicID){
      var result = [];
      if(topicID in viewpoint.topics && typeof(viewpoint.topics[topicID].broader) != "undefined")
      {
        $.merge(result, viewpoint.topics[topicID].broader);
        for(var i=0, parentID; parentID = viewpoint.topics[topicID].broader[i]; i++)
        {
          var ret = $.agorae.getBroader(viewpoint, parentID);
          $.merge(result, ret);
        }
      }
      return result;
    },
    getNarrower: function(viewpoint, topic, url){
      var topicID = topic.id, result = [];
      if(typeof(viewpoint[topicID].narrower) != "undefined")
        for(var i=0, topic; topic = viewpoint[topicID].narrower[i]; i++)
        {
          var uri = url.replace(/\/viewpoint\//, "/topic/");
              uri += "/" + topic.id;
          var t = {"data": topic.name, "attr": {"viewpointID": viewpoint.id, "topicID": topic.id, "name": topic.name, "rel": "topic", "uri": uri}};
          t.children = $.agorae.getNarrower(viewpoint, topic, url);
          result.push(t);
        }
      return result;
    },
    getTopicTree: function(viewpointUrl){
      var tree = {"data": []}, tagcloud = {},
          viewpoints = [];
      if(!viewpointUrl){
        if($.agorae.session.username)
          $.agorae.httpSend($.agorae.config.servers[0] + "user/" + $.agorae.session.username,
          {
            type: "GET",
            async: false,
            success: function(doc){
              if(typeof doc[$.agorae.session.username] == "undefined")
                return false;
              var user = doc[$.agorae.session.username];
              if(user.viewpoint)
              for(var i=0, viewpoint; viewpoint = user.viewpoint[i]; i++)
                viewpoints.push($.agorae.config.servers[0] + 'viewpoint/' + viewpoint.id);
            }
          });
        if($.agorae.config.viewpoints)
          for(var i=0, url; url = $.agorae.config.viewpoints[i]; i++)
            if(viewpoints.indexOf('http') == 0)
              viewpoints.push(url);
            else
              viewpoints.push($.agorae.config.servers[0] + 'viewpoint/' + url);
      }
      else
        viewpoints.push(viewpointUrl);
      $.log(viewpoints);
      viewpoints = viewpoints.unique();
      for(var i=0, url; url = viewpoints[i]; i++)
        $.agorae.httpSend(url,
        {
          type: "GET",
          success: function(viewpoint){
            var viewpointID;
            for(viewpointID in viewpoint)
              break;
            if(!viewpointID) return;
            viewpoint = viewpoint[viewpointID];
            viewpoint.id = viewpointID;
            $.log(viewpoint);
            var state = (i==0) ? "open" : "close";
            var root = {"data": viewpoint.name, "attr": {"viewpointID": viewpointID, "name": viewpoint.name, "rel": "viewpoint", "uri": url},
                       "children": [], "state": state};
            if(viewpoint.upper)
              for(var i=0, topic; topic = viewpoint.upper[i]; i++)
              {
                var uri = url.replace(/\/viewpoint\//, "/topic/");
                uri += "/" + topic.id;
                var t = {"data": topic.name, "attr": {"viewpointID": viewpoint.id, "topicID": topic.id, "name": topic.name, "rel": "topic", "uri": uri}};
                t.children = $.agorae.getNarrower(viewpoint, topic, url);
                root.children.push(t);
              }
            tree.data.push(root);

            //Generate tag cloud
            for(var topicID in viewpoint)
              if(viewpoint[topicID].name){
                var uri = url.replace(/\/viewpoint\//, "/topic/");
                uri += "/" + topicID;
                var topicName = viewpoint[topicID].name;
                if(!(topicName in tagcloud)) tagcloud[topicName] = {"topics": [], "size": 0};
                tagcloud[topicName].topics.push({"viewpointID": viewpoint.id, "topicID": topicID, "uri": uri});
                tagcloud[topicName].size += (viewpoint[topicID].item && viewpoint[topicID].item.length > 0) ? viewpoint[topicID].item.length : 0;
              }
          }
        });
      $.log(tree);
      return {"tree": tree, "tagcloud": tagcloud};
    },
    getAttributeName : function(corpusUrl){
      var corpusID = $.agorae.getDocumentID(corpusUrl);
      var corpora = [], attributes = {};
      if(!$.agorae.config.servers) return false;

      $.each($.agorae.config.servers, function(idx, server){
        var url = server + "attribute/" + corpusID;
        $.agorae.httpSend(url,
        {
          type: "GET",
          async: false,
          success: function(attribute){
            attribute = attribute[corpusID];
            for(var name in attribute)
            {
              if(!(name in attributes)) attributes[name] = [];
              attributes[name].push(url);
            }
          },
          error: function(code, error, reason){
            $.showMessage({title: "error", content: "Cannot load corpus:" + url});
          }
        });
      });
      return attributes;
    },
    getAttributeValue : function(uris, name){
      var values = {};
      $.each(uris, function(idx, uri){
        var url = uri + "/" + encodeURIComponent(name);
        $.agorae.httpSend(url,
        {
          type: "GET",
          async: false,
          success: function(attribute){
            var corpus, attributevalue;
            for(corpus in attribute)
              break;
            if(!corpus) return;
            attribute = attribute[corpus];
            attribute = attribute[name];
            for(attributevalue in attribute)
            {
              if(!(attributevalue in values)) values[attributevalue] = [];
              values[attributevalue].push({"uri": uri, "attributename": name, "attributevalue": attributevalue});
            }
          }
        });
      });
      return values;
    },
    searchItem : function(uris){
      var items = [], _items ={};
      $.each(uris, function(idx, uri){
        $.agorae.httpSend(uri,
        {
          type: "GET",
          async: false,
          success: function(doc){
            $.log(doc);
            var corpus, attributename, attributevalue, item;
            for(corpus in doc)
              break;
            if(!corpus) return;
            doc = doc[corpus];

            for(attributename in doc)
              break;
            if(!attributename) return;
            doc = doc[attributename];

            for(attributevalue in doc)
              break;
            if(!attributevalue) return;
            doc = doc[attributevalue];

            if(!doc.item) return;
            for(var i=0; item = doc.item[i]; i++)
            {
              items.push({"item": item.id, "name": item.name, "corpus": corpus});
              if(item.id in _items)
                _items[item.id]++;
              else
                _items[item.id] = 1;
            }
          }
        });
      });
      $.log(items);
      var unique = {};
      var result = [];
      for(var i=0, item; item = items[i]; i++)
        if(item.item in _items && _items[item.item] == uris.length)
        {
          if(item.item in unique)
            continue;
          else
          {
            unique[item.item] = {};
            result.push(item);
          }
        }
      return result;
    }
  });
})(jQuery);