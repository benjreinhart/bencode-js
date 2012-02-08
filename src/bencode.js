/*!
 * BencodeJS
 *
 * Copyright, 2011-2012 Ben Reinhart
 * https://github.com/benjreinhart/bencode-js
 *
 * Released under MIT license (https://github.com/benjreinhart/bencode-js/blob/master/license.txt)
 *
 */

/* Utilities */
(function() {

  var root = this;

  // We'll use an instance of this to break iterations
  root.__Breaker = function() {}

  // cache reference to Object.hasOwnProperty
  var hasOwnProperty = Object.hasOwnProperty;

  Array.prototype.__each = function( iterator, context, callback ) {
    var len = this.length;

    if ( len < 1 || iterator == null || typeof iterator !== "function" ) return;

    var self = this, i = 0;

    for ( i; i < len; ++i )
      if ( iterator.call( context, self[i] ) instanceof __Breaker ) return;

    if ( callback != null && typeof callback === "function" ) callback.call( context );
  }

  Object.prototype.__each = function( iterator, context, callback ) {

    if ( iterator == null || typeof iterator !== "function" ) return;

    var self = this;
    for ( var key in self ) {
      if ( hasOwnProperty.call( self, key ) )
        if ( iterator.call( context, self[key], key, self ) instanceof __Breaker ) return;
    }
    if ( callback != null && typeof callback === "function" ) callback.call( context );
  }

  Object.prototype.__length = function() {
    var len = 0;
    for ( var key in this )
      if ( hasOwnProperty.call( this, key ) ) len += 1;
    return len;
  }

}).call( this );

/* Decode */
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
      , isDataStructure
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
      var str = bencodedString.slice( counter )
        , len = str.split(':', 1)[0]
      ;

      incrementCounter( len.length + 1 + parseInt(len) );

      // First set the string to itself minus the preceding numbers and colon
      // i.e. str = "14:0.0.0.0:311989"; str = str.slice( len.length + 1 ); str //=> "0.0.0.0:311989"
      str = str.slice( len.length + 1 );

      // Then return the string from the first character to the intended length (len) of the string
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

/* Encode */
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

