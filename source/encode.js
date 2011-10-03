String.prototype.encode = function() {
  return this.length + ':' + this;
}

Number.prototype.encode = function() {
  return 'i' + this + 'e'
}
