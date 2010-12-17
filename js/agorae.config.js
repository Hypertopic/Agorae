(function($) {
  $.agorae = $.agorae || {};
  $.agorae.config = $.agorae.config || {};
  $.extend($.agorae.config,
    {
       "viewpoints": [
           "http://127.0.0.1/argos/_design/argos/_rewrite/viewpoint/e171d92c4dbce38435d63c5cf309cac5/",
           "http://127.0.0.1/argos/_design/argos/_rewrite/viewpoint/e171d92c4dbce38435d63c5cf307e584/"
       ],
       "items": [
           "http://127.0.0.1/argos/_design/argos/_rewrite/item/e171d92c4dbce38435d63c5cf30ad1aa/e171d92c4dbce38435d63c5cf30c5675/"
       ],
       "servers": [
           "http://127.0.0.1/argos/_design/argos/_rewrite/"
       ]
    });
})(jQuery);