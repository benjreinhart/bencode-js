# Bencode-js

CURRENTLY A WORK IN PROGRESS. NOT FINISHED YET.


JavaScript solution for implmenting the encoding and decoding of the Bencode
format.

* [BitTorrent Specification](http://wiki.theory.org/BitTorrentSpecification)
* [Bencode](http://en.wikipedia.org/wiki/Bencode)

Currently only works in browser environments, but I intend to add
support for CommonJS modules.

This solution uses classes and OOP.

This repo is implemented in a Ruby environment, for easy Jasmine testing
integration.

# Usage

Include the files in the webpage. Both the ```Encode``` and ```Decode```
classes use functions from the utilities module (aka utilities.js is a
dependency and is required in order for ```Encode``` and ```Decode```
to work). I recommend combining all three files into one, no need for
extra HTTP requests.

### Encode

The ```encode()``` function is attached to ```Object```, ```Array```,
```String``` and ```Number```'s prototype, so you can just call it on
an instance of those types like so:


```
"string".encode()              // => "6:string"
(123).encode()                 // => "i123e"
["str", 123].encode()          // => "l3:stri123ee"
({ key: "value" }).encode()    // => "d3:key5:valuee"
```

### Decode

The ```decode()``` function is attached to ```String```'s prototype
and is therefore available on an instance of a string like so:


```
"d3:key5:valuee".decode()      // => { key: "value" }
```

### Classes

You shouldn't need to directly access the classes (you should just
call ```encode()``` and ```decode()``` on instances of objects),
but if you do, the classes are namespaced under Bencode and
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
