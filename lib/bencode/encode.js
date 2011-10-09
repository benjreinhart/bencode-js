(function() {

  var Encode = (function() {

    // Private variables/functions
    var bencodedString
      , addToBencodedString
      , getType
      , encodeArray
      , encodeObject
    ;

    // Constructor
    function Encode( obj ) {
      bencodedString = ""
      encode( obj );
    }

    addToBencodedString = function( val ) {
      return bencodedString = bencodedString.concat( val );
    }

    encode = function( obj ) {
      var type = getType( obj );

      switch( type ) {
        case "string":
          return addToBencodedString( obj.encode() );
        case "number":
          return addToBencodedString( obj.encode() );
        case "list":
          return encodeArray( obj );
        case "dictionary":
          return encodeObject( obj );
        default:
          throw new Error("Unknown object type in call to encode()");
      }
    }

    getType = function( obj ) {
      if      ( typeof obj === "string" ) return "string";
      else if ( typeof obj === "number" ) return "number";
      else if ( obj instanceof Array    ) return "list";
      else if ( obj instanceof Object   ) return "dictionary";
      else    throw new TypeError("Unknown object type");
    }

    encodeArray = function( array ) {
      if ( array.length < 1 ) return;
      addToBencodedString("l");
      array.__each(function( item ) {
        encode( item );
      }, this, function() { addToBencodedString( "e" ) });
    }

    encodeObject = function( object ) {
      if ( object.__length() < 1 ) return;
      addToBencodedString("d");
      object.__each(function( value, key, obj ) {
        encode( key );
        encode( value );
      }, this, function() { addToBencodedString( "e" ) });
    }

    // Public accessor
    Encode.prototype.getBencodedString = function() {
      return bencodedString;
    }

    return Encode;
  })();

  String.prototype.encode = function() {
    var len = this.length;
    if ( len < 1 ) return "";
    return len + ':' + this;
  }

  Number.prototype.encode = function() {
    return 'i' + this + 'e';
  }

  Array.prototype.encode = function() {
    if ( this.length < 1 ) return "";
    encodedObject = new Encode( this );
    return encodedObject.getBencodedString();
  }

  Object.prototype.encode = function() {
    if ( this.__length() < 1 ) return "";
    encodedObject = new Encode( this );
    return encodedObject.getBencodedString();
  }

  var root = this;
  if ( root.Bencode == null ) root.Bencode = {};
  return root.Bencode.Encode = Encode;
}).call(this);
