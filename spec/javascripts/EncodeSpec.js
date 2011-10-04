describe("Encoding A String", function() {
  var regularString = "A regular string.";

  it("should return a bencoded string of value '17:A regular string.'", function() {
    expect( regularString.encode() ).toEqual( "17:A regular string." );
  });
});

describe("Encoding An Integer", function() {
  var regularInteger = 12345;

  it("should return a bencoded string of value 'i12345e'", function() {
    expect( regularInteger.encode() ).toEqual( "i12345e" );
  });
});

