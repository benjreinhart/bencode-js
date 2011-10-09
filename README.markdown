# Bencode-js

JavaScript solution for implmenting the encoding and decoding of the Bencode
format.

* [BitTorrent Specification](http://wiki.theory.org/BitTorrentSpecification)
* [Bencode](http://en.wikipedia.org/wiki/Bencode)

Currently only works in browser environments, but support for CommonJS
modules coming soon.

This repo is implemented in a Ruby environment, for easy Jasmine testing
integration.

# Usage

The functions are attached to the native object's prototype, so you can
just call encode on Native objects like so:

### Encode

```
  "string".encode()              // => "6:string"
  (123).encode()                 // => "i123e"
  ["str", 123].encode()          // => "l3:stri123ee"
  ({ key: "value" }).encode()    // => "d3:key5:valuee"
```
### Decode

```
  "d3:key5:valuee".decode()      // => { key: "value" }
```
