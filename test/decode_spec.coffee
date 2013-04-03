{ decode } = require '../'
{ expect } = require 'chai'

describe 'decoding', ->
  describe 'strings', ->
    it 'with a basic value returns the string', ->
      expect(decode '10:helloworld').to.equal 'helloworld'

    it 'with a colon in them returns the correct string', ->
      expect(decode '12:0.0.0.0:3000').to.equal '0.0.0.0:3000'

  describe 'integers', ->
    it 'is the integer between i and e', ->
      expect(decode 'i42e').to.equal 42

    it 'allows negative numbers', ->
      expect(decode 'i-42e').to.equal -42

    it 'allows zeros', ->
      expect(decode 'i0e').to.equal 0

  describe 'lists', ->
    it 'creates a list with strings and integers', ->
      expect(decode 'l5:helloi42ee').to.eql ['hello', 42]

    it 'creates a list with nested lists of strings and integers', ->
      expect(decode 'l5:helloi42eli-1ei0ei1ei2ei3e4:fouree').to.eql ['hello', 42, [-1, 0, 1, 2, 3, 'four']]

    it 'has no problem with multiple empty lists or objects', ->
      expect(decode 'lllleeee').to.eql [[[[]]]]
      expect(decode 'llelelelleee').to.eql [[], [], [], [[]]]
      expect(decode 'ldededee').to.eql [{}, {}, {}]

  describe 'dictionaries', ->
    it 'creates an object with strings and integers', ->
      expect(decode 'd3:agei100e4:name8:the dudee').to.eql { age: 100, name: 'the dude' }

    it 'creates an object with nested objects of strings and integers', ->
      bencodedString = 'd3:agei100e4:infod5:email13:dude@dude.com6:numberi2488081446ee4:name8:the dudee'
      expected = { age: 100, name: 'the dude', info: { email: 'dude@dude.com', number: 2488081446 } }

      expect(decode bencodedString).to.eql expected

    it 'has no problem with an empty object', ->
      expect(decode 'de').to.eql {}

  describe 'lists and dictionaries', ->
    it 'creates an object with a list of objects', ->
      bencodedString = 'd9:locationsld7:address10:484 streeted7:address10:828 streeteee'
      expected = { locations: [{ address: '484 street' }, { address: '828 street' } ]}

      expect(decode bencodedString).to.eql expected

    it 'has no problem when there are multiple "e"s in a row', ->
      bencodedString = 'lld9:favoritesleeei500ee'
      expected = [[{ favorites: [] }], 500]

      expect(decode bencodedString).to.eql expected
