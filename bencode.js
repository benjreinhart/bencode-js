(function (global) {
  var process = function () {
      var cwd = '/';
      return {
        title: 'browser',
        version: 'v0.10.1',
        browser: true,
        env: {},
        argv: [],
        nextTick: function (fn) {
          setTimeout(fn, 0);
        },
        cwd: function () {
          return cwd;
        },
        chdir: function (dir) {
          cwd = dir;
        }
      };
    }();
  function require(file, parentModule) {
    if ({}.hasOwnProperty.call(require.cache, file))
      return require.cache[file];
    var resolved = require.resolve(file);
    if (!resolved)
      throw new Error('Failed to resolve module ' + file);
    var module$ = {
        id: file,
        require: require,
        filename: file,
        exports: {},
        loaded: false,
        parent: parentModule,
        children: []
      };
    if (parentModule)
      parentModule.children.push(module$);
    var dirname = file.slice(0, file.lastIndexOf('/') + 1);
    require.cache[file] = module$.exports;
    resolved.call(module$.exports, module$, module$.exports, dirname, file);
    module$.loaded = true;
    return require.cache[file] = module$.exports;
  }
  require.modules = {};
  require.cache = {};
  require.resolve = function (file) {
    return {}.hasOwnProperty.call(require.modules, file) ? require.modules[file] : void 0;
  };
  require.define = function (file, fn) {
    require.modules[file] = fn;
  };
  require.define('/index.js', function (module, exports, __dirname, __filename) {
    var Encode = require('/lib/encode.js', module), Decode = require('/lib/decode.js', module);
    module.exports = {
      encode: Encode.encode,
      decode: Decode.decode
    };
  });
  require.define('/lib/decode.js', function (module, exports, __dirname, __filename) {
    (function () {
      var Decode, isString, __bind = function (fn, me) {
          return function () {
            return fn.apply(me, arguments);
          };
        };
      isString = require('/lib/identity_helpers.js', module).isString;
      module.exports = Decode = function () {
        var INTEGER_REGEX, TYPES, decodeInteger, decodeString, getType, isDataStructure, primitives;
        Decode.decode = function (bencodedString) {
          if (bencodedString == null) {
            throw new Error('Cannont decode null objects');
          }
          if (!isString(bencodedString)) {
            throw new Error('Decode only accepts a bencoded string');
          }
          return new Decode(bencodedString).decode();
        };
        function Decode(bencodedString) {
          var counter, _this = this;
          this.bencodedString = bencodedString;
          this.decode = __bind(this.decode, this);
          this.bencodedStringLength = this.bencodedString.length;
          counter = 0;
          this.counter = function (amount) {
            if (amount == null) {
              return counter;
            }
            return counter += amount;
          };
        }
        Decode.prototype.decode = function () {
          var key, object, type;
          type = getType(this.bencodedString[this.counter()]);
          if (!isDataStructure(type)) {
            return primitives[type].call(this);
          }
          object = type === 'list' ? [] : {};
          this.counter(1);
          while (this.counter() < this.bencodedStringLength) {
            if ('e' === this.bencodedString[this.counter()]) {
              this.counter(1);
              break;
            }
            if ('list' === type) {
              object.push(this.decode());
            } else {
              key = this.decode();
              object[key] = this.decode();
            }
          }
          return object;
        };
        TYPES = {
          'i': 'integer',
          'l': 'list',
          'd': 'dictionary'
        };
        INTEGER_REGEX = /^i(-?\d+)e/;
        getType = function (bencodedString) {
          return TYPES[bencodedString[0]] || 'string';
        };
        isDataStructure = function (type) {
          return type === 'list' || type === 'dictionary';
        };
        decodeString = function () {
          var len, str;
          str = this.bencodedString.slice(this.counter());
          len = str.split(':', 1)[0];
          this.counter(+len + (len.length + 1));
          return str.slice(len.length + 1).slice(0, +len);
        };
        decodeInteger = function () {
          var encodedInteger, integer, str, _ref;
          str = this.bencodedString.slice(this.counter());
          _ref = str.match(INTEGER_REGEX), encodedInteger = _ref[0], integer = _ref[1];
          this.counter(encodedInteger.length);
          return +integer;
        };
        primitives = {
          string: decodeString,
          integer: decodeInteger
        };
        return Decode;
      }();
    }.call(this));
  });
  require.define('/lib/identity_helpers.js', function (module, exports, __dirname, __filename) {
    (function () {
      var toString, typeTest, _ref;
      toString = Object.prototype.toString;
      typeTest = function (type) {
        return function (obj) {
          return toString.call(obj) === '[object ' + type + ']';
        };
      };
      module.exports = {
        isArray: (_ref = Array.isArray) != null ? _ref : typeTest('Array'),
        isObject: function (obj) {
          return obj === Object(obj);
        },
        isString: typeTest('String'),
        isNumber: typeTest('Number')
      };
    }.call(this));
  });
  require.define('/lib/encode.js', function (module, exports, __dirname, __filename) {
    (function () {
      var encode, encodeDictionary, encodeInteger, encodeList, encodeString, encodingFunctions, getType, isArray, isDataStructure, isNumber, isObject, isString, sort, _ref, _ref1, __hasProp = {}.hasOwnProperty;
      _ref = require('/lib/identity_helpers.js', module), isArray = _ref.isArray, isString = _ref.isString, isNumber = _ref.isNumber, isObject = _ref.isObject;
      exports.encode = encode = function (object) {
        return encodingFunctions[getType(object)](object);
      };
      if ((_ref1 = Object.keys) == null) {
        Object.keys = function (o) {
          var key, _results;
          _results = [];
          for (key in o) {
            if (!__hasProp.call(o, key))
              continue;
            _results.push(key);
          }
          return _results;
        };
      }
      sort = Array.prototype.sort;
      getType = function (object) {
        if (isString(object)) {
          return 'string';
        }
        if (isNumber(object)) {
          return 'integer';
        }
        if (isArray(object)) {
          return 'list';
        }
        if (isObject(object)) {
          return 'dictionary';
        }
        throw new Error('Cannot bencode object: ' + object);
      };
      isDataStructure = function (object) {
        var _ref2;
        return (_ref2 = getType(object)) === 'list' || _ref2 === 'dictionary';
      };
      encodeString = function (string) {
        return '' + string.length + ':' + string;
      };
      encodeInteger = function (integer) {
        return 'i' + integer + 'e';
      };
      encodeList = function (array) {
        var list, object;
        list = function () {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = array.length; _i < _len; _i++) {
            object = array[_i];
            _results.push(encode(object));
          }
          return _results;
        }();
        return 'l' + list.join('') + 'e';
      };
      encodeDictionary = function (object) {
        var bencodedString, key, sortedKeys, _i, _len;
        sortedKeys = sort.call(Object.keys(object));
        bencodedString = '';
        for (_i = 0, _len = sortedKeys.length; _i < _len; _i++) {
          key = sortedKeys[_i];
          bencodedString = bencodedString.concat('' + encode(key) + encode(object[key]));
        }
        return 'd' + bencodedString + 'e';
      };
      encodingFunctions = {
        'string': encodeString,
        'integer': encodeInteger,
        'list': encodeList,
        'dictionary': encodeDictionary
      };
    }.call(this));
  });
  global.Bencode = require('/index.js');
}.call(this, this));