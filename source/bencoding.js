String.prototype.encode = function() {
  return this.length + ':' + this;
}
Number.prototype.encode = function() {
  return 'i' + this + 'e'
}



var Decode = (function() {

  var setType;

  function Decode(string) {
    this.bencodedString = string;
    this.firstRun = true;
    return this.discoverType();
  }

  setType = function(type) {
    this.type = type;
  }

  Decode.prototype.discoverType = function() {
    var char = this.bencodedString.charAt(0);

    if ( char.match(/[0-9]/) ) {
      return this.getString();
    }

    switch ( char ) {
      case 'i':
        return this.getNumber();
      case 'l':
        return this.getList();
      case 'd':
        return this.getDictionary();
      default:
        throw "String is not in any recognizable bencoding format";
    }
  }

  Decode.prototype.getString = function(str) {
    var str           = str || this.bencodedString
      , strArray      = str.split(':')
      , strLength     = strArray[0]
      , currentStr    = strArray[1]
      , result        = "";

    for (var i = 0; i < strLength; ++i) {
      result << actualString[i];
    }

    if ( strLength < str.length ) {
      
    }

    this.nativeObject = result;
  }

  return Decode;
})();



// DECODE

String.prototype.decode = function() {
  $self = new Decode( this.toString() );
  return $self;
}

