{ encode } = require '../'
{ expect } = require 'chai'

describe 'encoding', ->
  describe 'strings', ->
    it 'encodes a string as <lenOfString>:<string>', ->
      expect(encode 'omg hay thurrr').to.equal '14:omg hay thurrr'

  describe 'integers', ->
    it 'encodes an as i<integer>e', ->
      expect(encode 2234).to.equal 'i2234e'

  describe 'integers', ->
    it 'encodes a list as l<list items>e', ->
      expect(encode ['a string', 23]).to.equal 'l8:a stringi23ee'

    it 'encodes nested lists', ->
      expect(encode [['james', 'john'], [['jordin', 12]]]).to.equal 'll5:james4:johnell6:jordini12eeee'

  describe 'dictionaries', ->
    it 'encodes an object as d<key><value>e where keys are sorted', ->
      expect(encode { name: 'ben', age: 23 }).to.equal 'd3:agei23e4:name3:bene'

    it 'encodes nested objects and lists', ->
      object = { people: [{name: 'j', age: 20}] }
      expect(encode object).to.equal 'd6:peopleld3:agei20e4:name1:jeee'