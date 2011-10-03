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
  var assertion = this === expected;
  if (!assertion) { log("Assertion Failed"); }
  else { log("Assertion Passed"); }
}
String.prototype.toEqual = function( expected ) {
  var assertion = this === expected;
  if (!assertion) { log("Assertion Failed"); }
  else { log("Assertion Passed"); }
}
Number.prototype.toEqual = function( expected ) {
  var assertion = this === expected;
  if (!assertion) { log("Assertion Failed"); }
  else { log("Assertion Passed"); }
}
Array.prototype.toEqual = function( expected ) {
  var assertion = this === expected;
  if (!assertion) { log("Assertion Failed"); }
  else { log("Assertion Passed"); }
}


