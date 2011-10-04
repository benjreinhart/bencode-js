describe("Decoding", function() {
  it("should return 'string'", function() {
    bencodedString = '6:string';
    expect( bencodedString.decode() ).toEqual( 'string' );
  });

  it("should return an Number with value 123", function() {
    bencodedString = 'i123e';
    expect( bencodedString.decode() ).toEqual( 123 );
  });

  it("should fail", function() {
    expect( null ).toEqual( true );
  });

});
