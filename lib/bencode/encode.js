(function() {

  // Ensure compatibility with CommonJS modules or browser
  var root;
  root = typeof module !== "undefined" && module.exports ? module.exports : window;

  // if Bencode is not already Defined
  if ( !root.Bencode ) {
    root.Bencode = {};
  }

  var Encode = (function() {

    // Private
    var fn // hold reference to class' prototype
      , becodedString
      , addToBencodedString
    ;

    function Encode( obj ) {
      fn             = Encode.prototype;
      bencodedString = ""
      encode( obj );
    }

    addToBencodedString = function( val ) {
      return bencodedString = bencodedString.concat( val );
    }

    encode = function( obj ) {
      var type = fn.getType( obj );

      switch( type ) {
        case "string":
          return addToBencodedString( obj.encode() );
        case "number":
          return addToBencodedString( obj.encode() );
        case "list":
          return fn.encodeArray( obj );
        case "dictionary":
          return fn.encodeObject( obj );
        default:
          throw "Uknown object type in call to encode()";
      }
    }

    Encode.prototype.getBencodedString = function() {
      return bencodedString;
    }

    Encode.prototype.getType = function( obj ) {
      if      ( typeof obj === "string" ) return "string";
      else if ( typeof obj === "number" ) return "number";
      else if ( obj instanceof Array ) return "list";
      else if ( obj instanceof Object ) return "dictionary";
      else    throw new TypeError("Uknown object type");
    }

    Encode.prototype.encodeArray = function( array ) {
      addToBencodedString("l");
      array.__each(function( item ) {
        encode( item );
      }, this, function() { addToBencodedString( "e" ) });
    }

    Encode.prototype.encodeObject = function( object ) {
      addToBencodedString("d");
      object.__each(function( value, key, obj ) {
        encode( key.toString() );
        encode( value );
      }, this, function() { addToBencodedString( "e" ) });
    }

    return Encode;
  })();

  String.prototype.encode = function() {
    return this.length + ':' + this;
  }

  Number.prototype.encode = function() {
    return 'i' + this + 'e'
  }

  Array.prototype.encode = function() {
    encodedObject = new Encode( this );
    return encodedObject.getBencodedString();
  }

  Object.prototype.encode = function() {
    encodedObject = new Encode( this );
    return encodedObject.getBencodedString();
  }

  return root.Bencode.Encode = Encode;
}).call(this);
