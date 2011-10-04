describe("Decoding A String", function() {
  var bencodedString = '6:string';

  it("should return a string of value 'helloworld' when given the bencoded string '10:helloworld'", function() {
    expect( bencodedString.decode() ).toEqual( 'string' );
  });
});

describe("Decoding A Number", function() {
  var bencodedString = 'i123e';

  it("should return an integer of value 123 when given the bencoded string 'i123e'", function() {
    expect( bencodedString.decode() ).toEqual( 123 );
  });
});
