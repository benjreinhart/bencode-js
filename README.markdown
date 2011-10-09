# Bencode-js

JavaScript solution for implmenting the encoding and decoding of the Bencode
format.

* [BitTorrent Specification](http://wiki.theory.org/BitTorrentSpecification)
* [Bencode](http://en.wikipedia.org/wiki/Bencode)

Currently only works in browser environments, but support for CommonJS
modules coming soon.

This solution uses classes and OOP.

This repo is implemented in a Ruby environment, for easy Jasmine testing
integration.

# Usage

Include the files in the webpage. Both the ```Encode``` and ```Decode```
classes use functions from the utilities module (aka utilities.js is a
dependency and is required in order for ```Encode``` and ```Decode```
to work). I recommend combining all three files into one, no need for
extra HTTP requests.

The functions are attached to the native object's ```prototype```, so you can
just call ```encode()``` or ```decode()``` on an instance of an object like so:

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

If you need access to the classes, it is namespaced under Bencode and
attached to ```window```:

```
window.Bencode.Encode
window.Bencode.Decode
```

# TODOS

Needs much more thorough testing.

Needs much better Error handling.

Decode class (especially the decode() method in the Decode class) needs
refactoring.

Implement it so it can be used in both a Browser and CommonJS
environment.
