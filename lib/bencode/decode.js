var Decode = (function() {

  // Private
  var bencodedString
    , bencodedStrLength
    , decodedObject
    , currentIndex
    , objectType
    , setType
    , setDecodedObject
    , dispatch
    , appendToDecodedObject
  ;

  // Constructor
  function Decode(string) {
    currentIndex      = 0;
    bencodedString    = string;
    bencodedStrLength = bencodedString.length
    objectType        = this.getType();
    return dispatch();
  }

  // Private Mutators
  setDecodedObject = function( obj ) {
    return decodedObject = obj;
  }

  appendToDecodedObject = function( obj, lastIdx ) {
    // Increment currentIndex to its new position
    currentIndex += lastIdx + 1;

    switch( objectType ) {
      case 'string':
        return setDecodedObject( obj );
      case 'integer':
        return setDecodedObject( obj );
      case 'list':
        break;
      case 'dictionary':
        break;
    }

    if ( currentIndex >= bencodedStrLength - 1 ) return;
    return dispatch();
  }

  // Private Methods
  dispatch = function() {
    var fn   = Decode.prototype
      , type = fn.getType()
    ;

    switch( type ) {
      case 'string':
        return fn.getString();
      case 'integer':
        return fn.getInteger();
      case 'list':
        return fn.getList();
      case 'dictionary':
        return fn.getDictionary();
      default:
        throw "Unexpected result in dispatch()"
    }
  }

  // Public Accessors
  Decode.prototype.getObjectType = function() {
    return objectType;
  }

  Decode.prototype.getDecodedObject = function() {
    return decodedObject;
  }

  Decode.prototype.getBencodedString = function() {
    return bencodedString;
  }

  Decode.prototype.getType = function() {
    var char = this.getBencodedString().charAt( currentIndex );

    if ( char.match(/\d/) ) {
      return "string";
    }

    switch ( char ) {
      case 'i':
        return "integer";
      case 'l':
        return "list";
      case 'd':
        return "dictionary";
      default:
        throw "String is not in any recognizable bencoding format";
    }
  }

  Decode.prototype.getString = function() {

    // We use currentIndex to extract the string from where we
    // left off in our iteration over the bencoded string. We store
    // this in str.
    //
    // Then we get the index of the colon separator, and store that in
    // separatorIdx, which we'll use to get the number before the separator
    // which represents the length of the string we want. We'll then use that
    // number (stored in len) to get the desired string, and store that
    // in result.

    var str          = this.getBencodedString().substring( currentIndex )
      , separatorIdx = str.indexOf(":")
    ;

    if ( separatorIdx === -1 ) throw "Invalid String, colon separator not found";

    var len    = str.substring( 0, separatorIdx )
      , endIdx = (separatorIdx + 1) + parseInt(len)
      , result = str.substring( (separatorIdx + 1), endIdx )
    ;

    return appendToDecodedObject( result, endIdx );
  }

  Decode.prototype.getInteger = function() {
    var str        = this.getBencodedString( currentIndex )
      , endIdx     = str.indexOf('e')
      , int
    ;

    str = str.slice( 0, endIdx );
    int = str.match( /\d+/ );

    if ( int === null ) throw "Encountered null integer in Bencoded String";

    var result = parseInt( int );

    return appendToDecodedObject( result, endIdx );
  }

  return Decode;
})();

// Ensure compatibility with CommonJS modules or browser
var root;
root = typeof global !== "undefined" && global !== null ? global : window;

root.Decode = Decode;

String.prototype.decode = function() {
  object = new Decode( this );
  return object.getDecodedObject();
}
