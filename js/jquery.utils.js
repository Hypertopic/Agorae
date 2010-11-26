function toJSON(obj) {
  return obj !== null ? JSON.stringify(obj) : null;
}

var listener = {};

function register(evt, func, obj){
  listener[evt] = { "fn": func, "source": obj};
}
function unregister(evt){
  if(listener[evt]) delete listener[evt];
}
function dispatch(evt, arguments){
  if(listener[evt])
    listener[evt].fn.apply(this, [arguments]);
}

(function($) {
  register('my.test', function(param){ alert(param); }, this);
  dispatch('my.test', 'test');
  unregister('my.test')
  dispatch('my.test', 'test2');
  /*var _tasks = [];
  var testObj = {
    a : function(){
      alert('test');
    }
  }
  register('ui.test', testObj.a, testObj);*/
/*  setInterval(function(){
    var tasks = $.data(document.body, "_tasks") || {};
    var events = $.data(document.body, "_events") || {};
    if(!events[evt]) return false;
    var fn = events[evt].fn;
    var obj = events[evt].source;
    fn.call(
  }, 500);*/


})(jQuery);