exports.fnString = function fnString(fn) {
  var result = fn
    .toString()
    .split('\n')
    .slice(1, -1)
    .map(function (s) { return s.replace(/^\s+/, ''); })
    .join('\n');
  console.log('result is:', result);
  return result;
};