{isString} = require './identity_helpers'

module.exports = (bencodedString) ->
  throw (new Error 'Argument must be a bencoded string') unless isString bencodedString

  (decode bencodedString)[0]

decode = (bencodedString) ->
  type = getType bencodedString[0]
  return (primitives[type] bencodedString) unless isDataStructure type

  object = if 'list' is type then [] else {}

  bencodedString = bencodedString.substr 1
  while bencodedString.length
    if 'e' is bencodedString[0]
      bencodedString = bencodedString.substr 1
      break

    if 'list' is type
      [value, bencodedString] = decode bencodedString
      object.push value
    else
      [key,   bencodedString] = decode bencodedString
      [value, bencodedString] = decode bencodedString

      object[key] = value

  [object, bencodedString]


###########
# PRIVATE #
###########

TYPES =
  'i': 'integer'
  'l': 'list'
  'd': 'dictionary'

STRING_REGEX  = /^(\d+):(.*)$/
INTEGER_REGEX = /^i(-?\d+)e(.*)$/

getType = (char) ->
  TYPES[ char ] || 'string'

isDataStructure = (type) ->
  type in ['list', 'dictionary']

decodeString = (bencodedString) ->
  [_, length, remainingString] = bencodedString.match STRING_REGEX

  length = +length
  [(remainingString.substr 0, length), (remainingString.substr length)]

decodeInteger = (bencodedString) ->
  [_, integer, remainingString] = bencodedString.match INTEGER_REGEX
  [+integer, remainingString]

primitives =
  string  : decodeString
  integer : decodeInteger
