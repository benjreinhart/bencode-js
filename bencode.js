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
    module.exports = {
      encode: require('/lib/encode.js', module),
      decode: require('/lib/decode.js', module)
    };
  });
  require.define('/lib/decode.js', function (module, exports, __dirname, __filename) {
    (function () {
      var INTEGER_REGEX, STRING_REGEX, TYPES, decode, decodeInteger, decodeString, getType, isDataStructure, isString, primitives;
      isString = require('/lib/identity_helpers.js', module).isString;
      module.exports = function (bencodedString) {
        if (!isString(bencodedString)) {
          throw new Error('Argument must be a bencoded string');
        }
        return decode(bencodedString)[0];
      };
      decode = function (bencodedString) {
        var key, object, type, value, _ref, _ref1, _ref2;
        type = getType(bencodedString[0]);
        if (!isDataStructure(type)) {
          return primitives[type](bencodedString);
        }
        object = 'list' === type ? [] : {};
        bencodedString = bencodedString.substr(1);
        while (bencodedString.length) {
          if ('e' === bencodedString[0]) {
            bencodedString = bencodedString.substr(1);
            break;
          }
          if ('list' === type) {
            _ref = decode(bencodedString), value = _ref[0], bencodedString = _ref[1];
            object.push(value);
          } else {
            _ref1 = decode(bencodedString), key = _ref1[0], bencodedString = _ref1[1];
            _ref2 = decode(bencodedString), value = _ref2[0], bencodedString = _ref2[1];
            object[key] = value;
          }
        }
        return [
          object,
          bencodedString
        ];
      };
      TYPES = {
        'i': 'integer',
        'l': 'list',
        'd': 'dictionary'
      };
      STRING_REGEX = /^(\d+):(.*)$/;
      INTEGER_REGEX = /^i(-?\d+)e(.*)$/;
      getType = function (char) {
        return TYPES[char] || 'string';
      };
      isDataStructure = function (type) {
        return type === 'list' || type === 'dictionary';
      };
      decodeString = function (bencodedString) {
        var length, remainingString, _, _ref;
        _ref = bencodedString.match(STRING_REGEX), _ = _ref[0], length = _ref[1], remainingString = _ref[2];
        return [
          remainingString.substr(0, length),
          remainingString.substr(length)
        ];
      };
      decodeInteger = function (bencodedString) {
        var integer, remainingString, _, _ref;
        _ref = bencodedString.match(INTEGER_REGEX), _ = _ref[0], integer = _ref[1], remainingString = _ref[2];
        return [
          +integer,
          remainingString
        ];
      };
      primitives = {
        string: decodeString,
        integer: decodeInteger
      };
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
      var encode, encodeDictionary, encodeInteger, encodeList, encodeString, encodingFunctions, getType, isArray, isNumber, isObject, isString, _ref, _ref1, __hasProp = {}.hasOwnProperty;
      _ref = require('/lib/identity_helpers.js', module), isArray = _ref.isArray, isString = _ref.isString, isNumber = _ref.isNumber, isObject = _ref.isObject;
      module.exports = encode = function (object) {
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
      encodeString = function (string) {
        return '' + string.length + ':' + string;
      };
      encodeInteger = function (integer) {
        return 'i' + integer + 'e';
      };
      encodeList = function (array) {
        var bencodedString, object, _i, _len;
        bencodedString = '';
        for (_i = 0, _len = array.length; _i < _len; _i++) {
          object = array[_i];
          bencodedString += encode(object);
        }
        return 'l' + bencodedString + 'e';
      };
      encodeDictionary = function (object) {
        var bencodedString, key, _i, _len, _ref2;
        bencodedString = '';
        _ref2 = Object.keys(object).sort();
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          key = _ref2[_i];
          bencodedString += encode(key).concat(encode(object[key]));
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