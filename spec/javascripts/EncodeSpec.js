describe("Encoding", function() {

  describe("A String", function() {
    var regularString = "A regular string.";

    it("should return a bencoded string of value '17:A regular string.'", function() {
      expect( regularString.encode() ).toEqual( "17:A regular string." );
    });
  });

  describe("An Integer", function() {
    var regularInteger = 12345;

    it("should return a bencoded string of value 'i12345e'", function() {
      expect( regularInteger.encode() ).toEqual( "i12345e" );
    });

    it("should return properly bencoded string of value 'i-1234e' when number is negative", function() {
      var num = -1234;
      expect( num.encode() ).toEqual( "i-1234e" );
    });
  });

  describe("An Array", function() {
    var array = ["Benny", 123, "john", ["tom", -923], { one: "value one" } ];

    var bencodedString = "l5:Bennyi123e4:johnl3:tomi-923eed3:one9:value oneee";

    it("should return a properly bencoded array", function() {
      expect( array.encode() ).toEqual( bencodedString );
    });
  });

  describe("An Object", function() {
    var object = { one: "ben", two: ["john", 123, "james"], three: { key: "value" } };

    var bencodedString = "d3:one3:ben3:twol4:johni123e5:jamese5:threed3:key5:valueee";

    it("should return a properly bencoded Object", function() {
      expect( object.encode() ).toEqual( bencodedString );
    });
  });
});
