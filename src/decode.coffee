{isString} = require './identity_helpers'

module.exports = (bencodedString) ->
  throw (new Error 'Argument must be a bencoded string') unless isString bencodedString

  index = 0
  counter = (amount) ->
    return index unless amount?
    index += amount

  do (composeDecodingFunction bencodedString, counter, bencodedString.length)


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

decodeString = (bencodedString, counter) ->
  str = bencodedString.slice counter()
  len = (str.split ':', 1)[0]

  counter +len + (len.length + 1)

  str.slice(len.length + 1).slice 0, +len

decodeInteger = (bencodedString, counter) ->
  str = bencodedString.slice counter()

  [encodedInteger, integer] = str.match INTEGER_REGEX
  counter encodedInteger.length

  +integer

primitives =
  string  : decodeString
  integer : decodeInteger

composeDecodingFunction = (bencodedString, counter, strLength) ->
  return decode = ->
    type = getType bencodedString[ counter() ]
    return (primitives[type] bencodedString, counter) unless isDataStructure type

    object = if 'list' is type then [] else {}

    counter 1
    while counter() < strLength
      if 'e' is bencodedString[ counter() ]
        counter 1
        break

      if 'list' is type
        object.push decode()
      else
        key = decode()
        object[ key ] = decode()

    object
