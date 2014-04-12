# Bencode-js

Zero dependency JavaScript solution for implementing the encoding and decoding of the Bencode
format. Works in both browser and commonjs environments.

* [BitTorrent Specification](http://wiki.theory.org/BitTorrentSpecification)
* [Bencode](http://en.wikipedia.org/wiki/Bencode)

## Install

`npm install bencode-js`

For the browser, simply copy either the compressed or uncompressed file into your app and include it on your web page.

## Usage

CommonJS environments:

```javascript
Bencode = require('bencode-js')
Bencode.decode(...)
Bencode.encode(...)
```

In the browser the object is available globally as `window.Bencode`.

### Bencode#encode(object)

`object` is either a `String`, `Number`, `Array`, or `Object`.


```javascript
Bencode.encode("string")         // => "6:string"
Bencode.encode(123)              // => "i123e"
Bencode.encode(["str", 123])     // => "l3:stri123ee"
Bencode.encode({ key: "value" }) // => "d3:key5:valuee"
```

### Bencode#decode(string)

`string` is a Bencoded string.

```javascript
Bencode.decode("d3:key5:valuee") // => { key: "value" }
```
