describe("Decoding", function() {

  describe("A String", function() {
    var bencodedString = '10:helloworld'
      , bencodedStringWithColon = '14:0.0.0.0:311989'
    ;

    it("should return a string of value 'helloworld' when given the bencoded string '10:helloworld'", function() {
      expect( bencodedString.decode() ).toEqual( 'helloworld' );
    });

    it("should return a string of value '0.0.0.0:311989' when given '14:0.0.0.0:311989'", function() {
      expect( bencodedStringWithColon.decode() ).toEqual('0.0.0.0:311989');
    });
  });

  describe("An Integer", function() {
    var bencodedString = 'i123e';

    it("should return an integer of value 123 when given the bencoded string 'i123e'", function() {
      expect( bencodedString.decode() ).toEqual( 123 );
    });
  });

  describe("An Array", function() {
    var bencodedArray = "l6:stringi123ed3:keyd3:key5:valueeel3:one3:two5:threeee"
      , expectedArray = ["string", 123, { key: { key: "value" } }, ["one", "two", "three"]]
    ;

    it("should return an array with the appropriate values", function() {
      expect( bencodedArray.decode() ).toEqual( expectedArray );
    });
  });

  describe("An Object", function() {
    var bencodedObject = "d3:key5:value3:numi123e4:key2d3:keyl8:a stringi-9234e14:0.0.0.0:311989eee"
      , expectedObject = { key: "value", num: 123, key2: { key: ["a string", -9234, 0.0.0.0:311989] } }
    ;

    it("should return an object with the appopriate values", function() {
      expect( bencodedObject.decode() ).toEqual( expectedObject );
    });
  });
});
