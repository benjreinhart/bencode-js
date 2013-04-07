read = (str) -> switch str[0]

  when 'i'
    bencoded = (str.match /^i-?\d+e/)[0]
    [bencoded.length, +bencoded[1...-1]]

  when '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
    [stringLength] = str.match /^\d+/
    startPos = stringLength.length + 1
    bencoded = str[... startPos + +stringLength]
    [bencoded.length, bencoded[startPos...]]

  when 'l'
    cursor = 1
    arr = while str[cursor] isnt 'e'
      [entryLength, entry] = read str[cursor...]
      cursor += entryLength
      entry
    [cursor + 1, arr]

  when 'd'
    cursor = 1
    obj = {}
    while str[cursor] isnt 'e'
      [keyLength, key] = read str[cursor...]
      [valueLength, value] = read str[cursor + keyLength ...]
      cursor += keyLength + valueLength
      obj[key] = value
    [cursor + 1, obj]

module.exports = (str) -> (read str)[1]
