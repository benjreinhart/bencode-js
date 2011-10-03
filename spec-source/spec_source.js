window.log = function( message ) {
  if ( console !== null && console !== undefined && typeof console.log === "function" )
    return console.log(message);
}

var assertEqual = function( actual, expected ) {
  var assertion = actual === expected;
  if (!assertion) { log("Assertion Failed"); }
  else { log("Assertion Passed"); }
  return assertion
}

var assertInstanceOf = function( actual, expected ) {
  var assertion = (actual instanceof expected);
  if (!assertion) { log("Assertion Failed"); }
  else { log("Assertion Passed"); }
  return assertion
}

var expect = function( assertion ) {
  if (typeof assertion === "function") return assertion();
  else return assertion;
}

Object.prototype.toEqual = function( expected ) {
  return this === expected;
}
String.prototype.toEqual = function( expected ) {
  return this.toString() === expected;
}
Number.prototype.toEqual = function( expected ) {
  return this === expected;
}
Array.prototype.toEqual = function( expected ) {
  return this === expected;
}


