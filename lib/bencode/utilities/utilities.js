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
