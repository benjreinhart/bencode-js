{isArray, isString, isNumber, isObject} = require './identity_helpers'

exports.encode = encode = (object) ->
  encodingFunctions[ (getType object) ] object


###########
# PRIVATE #
###########

Object.keys ?= (o) -> key for own key of o

getType = (object) ->
  return 'string'     if isString object
  return 'integer'    if isNumber object
  return 'list'       if isArray  object
  return 'dictionary' if isObject object

  throw (new Error "Cannot bencode object: #{ object }")

encodeString = (string) ->
  "#{ string.length }:#{ string }"

encodeInteger = (integer) ->
  "i#{ integer }e"

encodeList = (array) ->
  list = (encode object for object in array)

  "l#{ list.join '' }e"

encodeDictionary = (object) ->
  bencodedString = ''

  for key in (Object.keys object).sort()
    bencodedString += "#{ encode key }#{ encode object[key] }"

  "d#{ bencodedString }e"

encodingFunctions =
  'string'     : encodeString
  'integer'    : encodeInteger
  'list'       : encodeList
  'dictionary' : encodeDictionary
