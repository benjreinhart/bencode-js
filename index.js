var Encode = require('./lib/encode')
  , Decode = require('./lib/decode');

module.exports = {
  encode  : Encode.encode,
  decode  : Decode.decode,
  classes : {
    Encode: Encode,
    Decode: Decode
  }
};