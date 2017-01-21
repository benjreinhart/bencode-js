encodeString = (s) -> "#{s.length}:#{s}"

encodeInteger = (i) -> "i#{i}e"

encodeList = (array) ->
  encodedContents = (encode object for object in array).join ''
  "l#{encodedContents}e"

encodeDictionary = (object) ->
  keys = (key for own key of object).sort()
  encodedContents = ("#{encode key}#{encode object[key]}" for key in keys).join ''
  "d#{encodedContents}e"

encode = (object) -> switch
  when typeof object is 'string' then encodeString object
  when typeof object is 'number' then encodeInteger Math.floor object
  when '[object Array]' is {}.toString.call object then encodeList object
  else encodeDictionary object

module.exports = encode
