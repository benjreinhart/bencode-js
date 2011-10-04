(function() {

  // Ensure compatibility with CommonJS modules or browser
  var root;
  root = typeof module != "undefined" ? module.exports : window;

  // if Bencode is not already Defined
  if ( !root.Bencode ) {
    root.Bencode = {};
  }

  var Encode = (function() {

    function Encode() {
      //constructor
    }

    return Encode
  })();

  String.prototype.encode = function() {
    return this.length + ':' + this;
  }

  Number.prototype.encode = function() {
    return 'i' + this + 'e'
  }

  return root.Bencode.Encode = Encode;
}).call(this);
