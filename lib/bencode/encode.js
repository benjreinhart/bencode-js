(function() {

  // Ensure compatibility with CommonJS modules or browser
  var root;
  root = typeof module !== "undefined" && module.exports ? module.exports : window;

  // if Bencode is not already Defined
  if ( !root.Bencode ) {
    root.Bencode = {};
  }

  var Encode = (function() {

    // private
    var type
      , encode
      , bencodedString
    ;

    function Encode() {
      type = getType()
      encode();
    }

    Encode.prototype.getType = function() {
      if ( this instanceof Array ) {
        return 'list';
      }
      else if ( this instanceof Object ) {
        return 'object';
      }
      else {
        throw "Type not allowed for Bencode format";
      }
      return;
    }

    encode = function() {

    }

    Encode.prototype.getBencodedString = function() {
      return bencodedString;
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
