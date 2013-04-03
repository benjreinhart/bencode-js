exports.encode = encode = (object) ->
  encodingFunctions[ (getType object) ] object


###########
# PRIVATE #
###########

Object.keys ?= (o) -> key for own key of o

sort = Array::sort

toString = Object::toString
typeTest = (type) -> (obj) -> (toString.call obj) is "[object #{ type }]"

isArray  = Array.isArray ? (typeTest 'Array')
isObject = (obj) -> obj is (Object obj)
isString = typeTest 'String'
isNumber = typeTest 'Number'

getType = (object) ->
  return 'string'     if isString object
  return 'integer'    if isNumber object
  return 'list'       if isArray  object
  return 'dictionary' if isObject object

  throw (new Error "Cannot bencode object: #{ object }")

isDataStructure = (object) ->
  (getType object) in ['list', 'dictionary']

encodeString = (string) ->
  "#{ string.length }:#{ string }"

encodeInteger = (integer) ->
  "i#{ integer }e"

encodeList = (array) ->
  list = (encode object for object in array)

  "l#{ list.join '' }e"

encodeDictionary = (object) ->
  sortedKeys = sort.call (Object.keys object)

  bencodedString = ''
  for key in sortedKeys
    bencodedString = bencodedString.concat "#{ encode key }#{ encode object[key] }"

  "d#{ bencodedString }e"

encodingFunctions =
  'string'     : encodeString
  'integer'    : encodeInteger
  'list'       : encodeList
  'dictionary' : encodeDictionary
