//safe JSON.stringify taken and modified from https://github.com/isaacs/json-stringify-safe
 
function stringify(obj, replacer, spaces, cycleReplacer) {
  var myserializer = serializer(replacer, cycleReplacer), ret = JSON.stringify(obj, myserializer, spaces);
  myserializer.destroy();
  return ret;
}

function serializer(replacer, cycleReplacer) {
  var stack = [], keys = [], ret;

  if (cycleReplacer == null) cycleReplacer = function(key, value) {
    if (stack[0] === value) return "[Circular ~]"
    return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
  }

  ret = function(key, value) {
    if (stack.length > 0) {
      var thisPos = stack.indexOf(this);
      ~thisPos ? stack.splice(thisPos + 1) : stack.push(this);
      ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);
      if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value);
    }
    else stack.push(value);

    return replacer == null ? value : replacer.call(this, key, value);
  }
  ret.destroy = function () {
    replacer = null;
    cycleReplacer = null;
    ret.destroy = null;
  };
  return ret;
}

function createJSONizingError(AllexError, inherit) {
  function AllexJSONizingError(code, tojson, caption) {
    return AllexError.call(this,code,(caption ? caption+' ' : '')+stringify(tojson, null, 2));
  }
  inherit(AllexJSONizingError, AllexError);
  return AllexJSONizingError;
}

module.exports = createJSONizingError;

