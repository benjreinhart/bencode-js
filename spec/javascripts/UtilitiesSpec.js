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

    it("should break iteration when iterator returns an instance of __Breaker", function() {
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

    var obj    = { obj1: "someVal 1", obj2: "someVal 2", obj3: "someVal 3" }
      , newObj
    ;

    var iterator = function( item, key, obj ) {
      value = '' + item + ' i';
      return newObj[key] = value;
    }

    beforeEach(function() { newObj = {} });

    it("should iteratore appropriately", function() {
      obj.__each( iterator, this );
      expect( newObj ).toEqual( { obj1: "someVal 1 i", obj2: "someVal 2 i", obj3: "someVal 3 i" } );
    });

    it("should break iteratio when iterator returns an instance of __Breaker", function() {
      var iterator = function( item, key, obj ) {
        if ( key === "obj2" ) return new __Breaker;
        value = '' + item + ' i';
        return newObj[key] = value;
      }
      obj.__each( iterator, this );
      expect( newObj ).toEqual( { obj1: "someVal 1 i"} );
    });
  });
});
