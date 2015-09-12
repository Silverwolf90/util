import { curry, mapValues, pick, zipObject, flow, sortBy, fill,
  merge, keys, identity, map, range, isUndefined, constant, partial, fill } from 'lodash-fp';

const { abs, acos, sqrt } = Math;

export const log =
  (arg) =>
    console.log(arg) || arg;

export const trace = curry(
  (msg, val) => {
    console.log(msg, val);
    return val;
  });

export const debug =
  (arg) => {
    debugger;
    return arg;
  };

export const breakpoint = debug;

export const trace = curry(
  (msg, val) =>
    console.log(msg, val) || val);

export const or = curry(
  (func1, func2, arg) =>
    func1(arg) || func2(arg));

export const indexes =
  (array) =>
    range(0, array.length);

export const mapIndexes = curry(
  (cb, array) =>
    map(cb, indexes(array)));

export const mapIndexes2d = curry(
  (cb, array2d) =>
    mapIndexes((x) =>
      mapIndexes((y) =>
        cb(x, y), array2d[x]), array2d));

export const ifThen = curry(
  (predicate, then, val) =>
    predicate(val) ? then(val) : val);

export const defaultValue = curry(
  (defaultVal, val) =>
    ifThen(isUndefined, constant(defaultVal), val));

export const join = curry(
  (seperator, array) =>
    array.join(seperator));

export const printNewLine =
  partial(log, '\n');

export const makeArray =
  (length, initValue) =>
    fill(0, length, initValue, new Array(length));


// Map over a two dimensional array and spread each array
// as arguments into the `callback`
// (... -> B) -> [Array] -> [B]
export const spreadMap = curry(
  (callback, array2d) =>
    map(array => callback(...array), array2d));

// A -> B -> (B, A)
export const pairWith = curry(
  (a, b) => [b, a]);

// * -> [*] -> [*]
export const prepend = curry(
  (val, array) => [val].concat(array));

// * -> [*] -> [*]
export const append = curry(
  (val, array) => [array].concat(val));

export const appendStringIf = curry(
  (predicate, b, a) =>
    predicate(a)
      ? a + b
      : null);

/**
 * Given a `funcObject` whose properties are all functions, bind
 * each function to the `context` and return an object with each bound
 * function.
 */
export const bindAllTo = 
  (funcObj, context) => {
    return mapValues((func) => {
      return func.bind(context);
    }, funcObj);
  };

/**
 * Takes an array of `keys` and passes each `key` to the callback.
 * The returned value of the callback becomes the key's value
 * in the returned object.
 * @return {Object}
 */
export const mapToObj = curry(
  (callback, keys) => {
    let values = map((keyName) => callback(keyName), keys);
    return zipObject(keys, values);
  });

/**
 * Maps over the `keys` of the `target` using the `callback` and
 * returns the `target` with the mapped values.
 */
export const mapPickedValues = curry(
  (target, keys, callback) => flow(
    pick(keys), 
    mapValues(callback), 
    merge(target)
  )(target));

const callbackIf = curry(
  (predicate, callback, value) => 
    predicate(value) ? callback(value) : value);

/**
 * Map over an array of `values`, if the value satisfies the `predicate`
 * then the value returned by the `callback` is appended to the result,
 * otherwise the identity is appended to the result.
 */
export const mapIf =
  (predicate, callback, values) =>
    map(callbackIf(predicate, callback), values);

export const toCanvasCoords = curry(
  (domElement, scale = 1, offset = { x: 0, y: 0 }, {pageX = 0, pageY = 0}) => {
    while (domElement) {
      offset.x  += domElement.offsetLeft;
      offset.y  += domElement.offsetTop;
      domElement = domElement.offsetParent;
    }

    return {
      x: (pageX - offset.x) / scale,
      y: (pageY - offset.y) / scale
    };
  });

export const areCoordsInCircle = curry(
  (radius, x, y, circleOrigin) => {
    let dx = abs(x - circleOrigin.x);
    let dy = abs(y - circleOrigin.y);

    return (dx ** 2) + (dy ** 2) <= (radius ** 2);
  });

export const timer =
  (timerString, cb) => {
    console.time(timerString);
    let result = cb();
    console.timeEnd(timerString);
    return result;
  };

export const mathToIncrement = 
  (mathFn, increment, value) =>
    mathFn( value / increment ) * increment;

export const hypot =
  (adjacent, opposite) => 
    sqrt(adjacent ** 2 + opposite ** 2);
