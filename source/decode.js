var Decode = (function() {

  // Private
  var bencodedString
    , decodedObject
    , objectType
    , setType
    , setDecodedObject
    , dispatch
    , appendToDecodedObject
  ;

  // Constructor
  function Decode(string) {
    bencodedString = string;
    objectType = this.getType();
    return dispatch();
  }

  // Private Mutators
  setDecodedObject = function( obj ) {
    return decodedObject = obj;
  }

  appendToDecodedObject = function( obj ) { }

  // Private Methods
  dispatch = function() {
    fn = Decode.prototype
    var type = fn.getType();

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
    var char = this.getBencodedString().charAt(0);

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

  Decode.prototype.getString = function(str) {
    var str           = str || this.getBencodedString()
      , strArray      = str.split(':')
      , strLength     = strArray[0]
      , currentStr    = strArray[1]
      , result        = ""
    ;

    for (var i = 0; i < strLength; ++i) {
      result += currentStr[i];
    }

    if ( this.getObjectType() === 'string' ) {
      return setDecodedObject( result );
    }

    appendToDecodedObject( result );
    return dispatch();
  }

  Decode.prototype.getInteger = function(str) {
    var str        = str || this.getBencodedString()
      , integerStr = str.match(/^i(\d+)e/)[1]
    ;

    var result = parseInt(integerStr);

    if ( this.getObjectType() === 'integer' ) {
      return setDecodedObject( result );
    }

    appendToDecodedObject( result );
    return dispatch();
  }

  return Decode;
})();

window.Decode = Decode;

String.prototype.decode = function() {
  object = new Decode( this );
  return object.getDecodedObject();
}
