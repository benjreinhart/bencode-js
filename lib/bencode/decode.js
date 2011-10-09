(function() {

  var Decode = (function() {

    var bencodedString
      , _object
      , decode
      , getType
      , getString
      , getNumber
      , getValue
      , counter
      , incrementCounter
      , setDecodedObject
    ;

    function Decode( string ) {
      bencodedString = string;
      counter = 0;

      var type = getType();

      if ( type === "string" || type === "integer" )
        setDecodedObject( getValue( type ) );
      else
        setDecodedObject( decode() );
    }

    decode = function() {
      var obj = getType() === "list" ? [] : {};

      incrementCounter( 1 );
      var type = getType();

      while( counter < bencodedString.length ) {
        if ( obj instanceof Array ) {
          var result = isDataStructure( type ) ? decode() : getValue( type );
          obj.push( result );
        }
        else if ( obj instanceof Object ) {
          var key = getValue( type );

          type = getType();
          var value = isDataStructure( type ) ? decode() : getValue( type );

          obj[ key ] = value;
        }
        else { throw new Error("Unkown object when iterating bencoded string"); }

        if ( bencodedString.charAt( counter ) === 'e' ) {
          incrementCounter( 1 );
          return obj;
        }

        type = getType();
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
        default:
          throw new Error("Format unreadable");
      }
    }

    setDecodedObject = function( obj ) {
      return _object = obj;
    }

    incrementCounter = function( amount ) {
      return counter += amount
    }

    getValue = function( type ) {
      return type === "string" ? getString() : getNumber();
    }

    isDataStructure = function( type ) {
      return ( type === "list" || type === "dictionary" ) ? true : false;
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
    if ( this.length < 2 ) throw new Error("Not in Bencode Format");
    object = new Decode( this );
    return object.getDecodedObject();
  }

  var root = this;
  if ( root.Bencode == null ) root.Bencode = {};
  return root.Bencode.Decode = Decode;
}).call(this);
