module.exports = class Decode
  @decode = (bencodedString) ->
    (new Decode bencodedString).decode()

  constructor: (@bencodedString) ->
    @bencodedStringLength = @bencodedString.length

    counter  = 0
    @counter = (amount) ->
      return counter unless amount?
      counter += amount

  decode: =>
    type = getType @bencodedString[ @counter() ]
    return (decodingFunctions[type].call this) unless isDataStructure type

    @counter 1
    object = if type is 'list' then [] else {}

    while @counter() < @bencodedStringLength
      if type is 'list'
        object.push @decode()
      else
        key = @decode()
        object[ key ] = @decode()

      if @bencodedString[ @counter() ] is 'e'
        @counter 1
        break

    object


  ###########
  # PRIVATE #
  ###########

  TYPES =
    'i': 'integer'
    'l': 'list'
    'd': 'dictionary'

  INTEGER_REGEX = /^i(-?\d+)e/

  getType = (bencodedString) ->
    TYPES[ bencodedString[0] ] || 'string'

  isDataStructure = (type) ->
    type in ['list', 'dictionary']

  decodeString = ->
    str = @bencodedString.slice @counter()
    len = str.split(':', 1)[0]

    @counter +len + (len.length + 1)

    str.slice(len.length + 1).slice 0, +len

  decodeInteger = ->
    str = @bencodedString.slice @counter()

    [encodedInteger, integer] = str.match INTEGER_REGEX
    @counter encodedInteger.length

    +integer

  decodingFunctions =
    string  : decodeString
    integer : decodeInteger