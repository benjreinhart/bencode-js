toString = Object::toString
typeTest = (type) -> (obj) -> (toString.call obj) is "[object #{ type }]"

module.exports =
  isArray  : Array.isArray ? (typeTest 'Array')
  isObject : (obj) -> obj is (Object obj)
  isString : typeTest 'String'
  isNumber : typeTest 'Number'
