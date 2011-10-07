describe("Utility Functions", function() {

  describe("Array.__each", function() {
      var array = ["obj1", "obj2", "obj3"]
        , newArray
      ;

      var iterator = function( item ) {
        item = '' + item + ' i';
        return newArray.push(item);
      }

      beforeEach(function() { newArray = []; });

    it("should iterate appropriately", function() {
      array.__each( iterator, this);
      expect( newArray ).toEqual( ["obj1 i", "obj2 i", "obj3 i"] );
    });

    it("should break iteration when iterator returns new __Breaker", function() {
      var iterator = function( item ) {
        if ( item === "obj2" ) return new __Breaker;
        item = '' + item + ' i';
        return newArray.push(item);
      }
      array.__each( iterator, this);
      expect( newArray ).toEqual( ["obj1 i"] );
    });
  });

  describe("Object.__each", function() {

  });
});
