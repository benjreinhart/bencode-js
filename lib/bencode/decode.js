(function() {

  // Ensure compatibility with CommonJS modules or browser
  var root;
  root = typeof module !== "undefined" && module.exports ? module.exports : window;

  // if Bencode is not already Defined
  if ( !root.Bencode ) {
    root.Bencode = {};
  }

  var Decode = (function() {

    var bencodedString
      , _object
      , decode
      , getType
      , getString
      , getNumber
      , getArray
      , getObject
      , counter
      , incrementCounter
      , addToDecodedObject
    ;

    function Decode( string ) {
      bencodedString = string;
      counter = 0;
      decode();
    }

    decode = function() {
      var type = getType();

      switch( type ) {
        case "string":
          var string = getString();
          return addToDecodedObject( string );
        case "integer":
          var int = getNumber();
          return addToDecodedObject( int );
        case "list":
          var array = getArray();
          return addToDecodedObject( array );
        case "dictionary":
          var object = getObject();
          return addToDecodedObject( object );
      }
    }

    getType = function() {
      var char = bencodedString.charAt( counter );

      if ( char.match(/\d/) ) return "string";

      switch( char ) {
        case 'i':
          return "integer";
        case 'l':
          return "list";
        case 'd':
          return "dictionary";
      }
    }

    addToDecodedObject = function( obj ) {
      return _object = obj;
    }

    incrementCounter = function( amount ) {
      return counter += amount + 1;
    }

    getString = function() {
      var str           = bencodedString.slice( counter )
        , strArray      = str.split(':')
        , len           = strArray[0]
      ;

      incrementCounter( len.length + 1 + parseInt(len) );

      str = strArray[1];
      return str.slice(0, len );
    }

    getNumber = function() {
      var str = bencodedString.slice( counter )
        , int = str.slice( 1, str.indexOf('e') )
      ;

      incrementCounter( int.length + 2 );
      return parseInt( int );
    }



    // Public Accessor
    Decode.prototype.getDecodedObject = function() {
      return _object;
    }

    return Decode;
  })();

  String.prototype.decode = function() {
    object = new Decode( this );
    return object.getDecodedObject();
  }

  return root.Bencode.Decode = Decode;
}).call(this);
