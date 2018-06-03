export {};
declare global {
  interface Math {
    rnd: Function;
  }

  interface Function {
    createDelegate(obj, args, appendArgs);

    createInterceptor(fcn, scope);

    createCallback(obj, args, appendArgs);

    defer(millis, scope, args?, appendArgs?);

    debounce(timeout, invokeAsap, ctx);

    throttle(fn, timeout, ctx);
  }

  interface FunctionConstructor {
    defer(millis, scope, args, appendArgs);

    debounce(fn, timeout, invokeAsap, ctx);

    throttle(fn, timeout, ctx);
  }

  interface Number {
    toFixedFloat(fractionDigits?: number): number;
  }

  interface String {
    format(format);

    toJSON();
  }

  interface StringConstructor {
    escape(string);

    leftPad(val, size, ch);
  }

  interface Window {
    jQuery: any;
  }

  interface WindowContstructor {
    isPrimitive(v);

    isArray(v);

    isObject(v);

    isString(v);

    isNumber(v);

    isBoolean(v);

    parseNumber(v, defaultValue);

    offsetHTMLElement(rawDomNode);

    getMousePos(e, coord);

    isDefined(v, i);

    isEmpty(v, allowBlank?);

    clone(d, s, lvl?: number, ne?: boolean);

    equals(obj1, obj2, u?);

    jQuery: any;
  }

  interface Array<T> {
    indexOfKey(key, val, from);

    insert(index, item);

    remove(o);
  }
}

if (Math)
  /**
   * генератор случайных чисел в заданном диапазоне и с заданной точностью
   * @param {Number} min
   * @param {Number} max
   * @param {Number} [precision=2] точность
   * @returns {Number}
   */
  Math.rnd = function (min, max, precision) {
    precision = ((precision || precision === 0) ? precision : 2);
    var golden_ratio_conjugate = 0.618033988749895,
        res = ((Math.random() + golden_ratio_conjugate) % 1) * (max - min) + min;
    return Math.min(parseFloat(res.toFixed(precision)), max)
  };

if (!Number.prototype.toFixedFloat) {
  /**
   * округление до знака
   * @param {Number} [e] до какого знака округлять
   * @member Number
   */
  Number.prototype.toFixedFloat = function (e) {
    e = parseFloat(String(e));
    let result: any = 0,
        y = Math.round(this * Math.pow(10, e)) / Math.pow(10, e),
        i = e - y.toString().length + y.toString().indexOf(".") + 1;
    if (e > 0) {
      if (y.toString().indexOf(".") < 0) result = y + "." + Math.pow(10, e).toString().substring(1);
      else if (i > 0) result = y + Math.pow(10, i).toString().substring(1);
      else result = y;
    }
    else result = y;

    return parseFloat(result);
  }
}
else {
  Number.prototype.toFixedFloat = (function (orig) {
    return function () {
      return parseFloat(orig.apply(this, arguments))
    }
  })(Number.prototype.toFixed);
}

if (!Function.prototype.createInterceptor) {
  /**
   * Creates an interceptor function. The passed function is called before the original one. If it returns false,
   * the original one is not called. The resulting function returns the results of the original function.
   * The passed function is called with the parameters of the original function. Example usage:
   *
   *    var sayHi = function(name){ alert('Hi, ' + name); }
   *
   *    sayHi('Fred'); // alerts "Hi, Fred"
   *    // create a new function that validates input without
   *    // directly modifying the original function:
   *    var sayHiToFriend = sayHi.createInterceptor(function(name){
   *		    return name == 'Brian';
   *		});
   *
   *    sayHiToFriend('Fred');  // no alert
   *    sayHiToFriend('Brian'); // alerts "Hi, Brian"
   *
   * @param {Function} fcn The function to call before the original
   * @param {Object} scope (optional) The scope (<code><b>this</b></code> reference) in which the passed function is executed.
   * <b>If omitted, defaults to the scope in which the original function is called or the browser window.</b>
   * @return {Function} The new function
   * @member Function
   */
  Function.prototype.createInterceptor = function (fcn, scope) {
    var method = this;
    return !isFunction(fcn) ?
        this :
        function () {
          var me = this,
              args = arguments;
          fcn.target = me;
          fcn.method = method;
          return (fcn.apply(scope || me || window, args) !== false) ?
              method.apply(me || window, args) :
              null;
        };
  };
}
if (!Function.prototype.createCallback) {

  /**
   * Creates a callback that passes arguments[0], arguments[1], arguments[2], ...
   * Call directly on any function. Example: <code>myFunction.createCallback(arg1, arg2)</code>
   * Will create a function that is bound to those 2 args. <b>If a specific scope is required in the
   * callback, use {@link #createDelegate} instead.</b> The function returned by createCallback always
   * executes in the window scope.
   * <p>This method is required when you want to pass arguments to a callback function.  If no arguments
   * are needed, you can simply pass a reference to the function as a callback (e.g., callback: myFn).
   * However, if you tried to pass a function with arguments (e.g., callback: myFn(arg1, arg2)) the function
   * would simply execute immediately when the code is parsed. Example usage:
   * <pre><code>
   *  var sayHi = function(name){
   * 		alert('Hi, ' + name);
   * 	}
   *
   *  // clicking the button alerts "Hi, Fred"
   *  new Core.Button({
   * 		text: 'Say Hi',
   * 		renderTo: Core.getBody(),
   * 		handler: sayHi.createCallback('Fred')
   * 	});
   * </code></pre>
   * @return {Function} The new function
   * @member Function
   */
  Function.prototype.createCallback = function (/*args...*/) {
    // make args available, in function below
    var args = arguments,
        method = this;
    return function () {
      return method.apply(window, args);
    };
  };
}
if (!Function.prototype.createDelegate) {
  /**
   * Creates a delegate (callback) that sets the scope to obj.
   * Call directly on any function. Example: <code>this.myFunction.createDelegate(this, [arg1, arg2])</code>
   * Will create a function that is automatically scoped to obj so that the <tt>this</tt> variable inside the
   * callback points to obj. Example usage:
   *
   *      var sayHi = function (name) {
   *				// Note this use of "this.text" here.  This function expects to
   *				// execute within a scope that contains a text property.  In this
   *				// example, the "this" variable is pointing to the btn object that
   *				// was passed in createDelegate below.
   *				alert('Hi, ' + name + '. You clicked the "' + this.text + '" button.');
   *			}
   *
   *      var btn = new Core.Button({
   *				text: 'Say Hi',
   *				renderTo: Core.getBody()
   *			});
   *
   *      // This callback will execute in the scope of the
   *      // button instance. Clicking the button alerts
   *      // "Hi, Fred. You clicked the "Say Hi" button."
   *      btn.on('click', sayHi.createDelegate(btn, ['Fred']));
   *
   * @param {Object} [obj=this] The scope in which the function is executed.
   * <b>If omitted, defaults to the browser window.</b>
   * @param {Array} [args] Overrides arguments for the call. (Defaults to the arguments passed by the caller)
   * @param {Boolean|Number} [appendArgs] if True args are appended to call args instead of overriding,
   * if a number the args are inserted at the specified position
   * @return {Function} The new function
   * @member Function
   */
  Function.prototype.createDelegate = function (obj, args, appendArgs) {
    var method = this;
    return function () {
      var callArgs = args || arguments;
      if (appendArgs === true) {
        callArgs = Array.prototype.slice.call(arguments, 0);
        callArgs = callArgs.concat(args);
      } else if (isNumber(appendArgs)) {
        callArgs = Array.prototype.slice.call(arguments, 0); // copy arguments first
        var applyArgs = [appendArgs, 0].concat(args); // create method call params
        Array.prototype.splice.apply(callArgs, applyArgs); // splice them in
      }
      return method.apply(obj || window, callArgs);
    };
  };
}
if (!Function.prototype.defer) {
  /**
   * Calls this function after the number of millseconds specified, optionally in a specific scope. Example usage:
   *
   *   var sayHi = function(name){
   *			alert('Hi, ' + name);
   *	 }
   *
   *   // executes immediately:
   *   sayHi('Fred');
   *
   *   // executes after 2 seconds:
   *   sayHi.defer(2000, this, ['Fred']);
   *
   *   // this syntax is sometimes useful for deferring
   *   // execution of an anonymous function:
   *   (function(){
   *			alert('Anonymous');
   *	 }).defer(100);
   *
   * @param {Number} millis The number of milliseconds for the setTimeout call (if less than or equal to 0 the function is executed immediately)
   * @param {Object} [scope=this] The scope in which the function is executed.
   * <b>If omitted, defaults to the browser window.</b>
   * @param {Array} [args] Overrides arguments for the call. (Defaults to the arguments passed by the caller)
   * @param {Boolean|Number} [appendArgs] if True args are appended to call args instead of overriding,
   * if a number the args are inserted at the specified position
   * @return {Number} The timeout id that can be used with clearTimeout
   * @member Function
   */
  Function.prototype.defer = function (millis, scope, args, appendArgs) {
    var fn = this.createDelegate(scope || this, args || [], appendArgs || []);
    return window.setTimeout(fn, millis);
  };
}
if (!Function.prototype.debounce) {
  /**
   * Если дословно переводить — «устранение дребезга». Такой декоратор позволяет превратить несколько вызовов функции в
   * течение определенного времени в один вызов, причем задержка начинает заново отсчитываться с каждой новой попыткой
   * вызова. Возможно два варианта:
   * - Реальный вызов происходит только в случае, если с момента последней попытки прошло время, большее или равное
   *  задержке.
   * - Реальный вызов происходит сразу, а все остальные попытки вызова игнорируются, пока не пройдет время, большее
   * или равное задержке, отсчитанной от времени последней попытки.
   *
   * @param {Number} timeout задержка
   * @param {Boolean} [invokeAsap=false] Параметр, указывающий какой из вышеперечисленных вариантов debouncing нужно
   * использовать (по умолчанию используется первый)
   * @param {Object} ctx контекст оригинальной функции (scope)
   * @return {Function}
   */
  Function.prototype.debounce = function (timeout, invokeAsap, ctx) {
    timeout = isNumber(timeout) ? timeout : 1e2;
    if (arguments.length == 3 && typeof invokeAsap != "boolean") {
      ctx = invokeAsap;
      invokeAsap = false;
    }

    var timer,
        self = this;

    return function () {

      var args = arguments;
      ctx = ctx || this;

      invokeAsap && !timer && self.apply(ctx, args);

      clearTimeout(timer);

      timer = setTimeout(function () {
        !invokeAsap && self.apply(ctx, args);
        timer = null;
      }, timeout);

    };
  };
}
if (!Function.prototype.throttle) {
  /**
   * позволяет «затормозить» функцию — функция будет выполняться не чаще одного раза в указанный период,
   * даже если она будет вызвана много раз в течение этого периода. Т.е. все промежуточные вызовы будут игнорироваться.
   * Например, на resize окна (или, допустим, на mousemove) у вас срабатывает какой-то тяжелый обработчик.
   * Можно его «затормозить»:
   *
   *  $(window).resize($.throttle(doComplexСomputation, 300));
   *
   * @param {Number} timeout период
   * @param {Object} ctx контекст оригинальной функции (scope)
   * @return {Function}
   */
  Function.prototype.throttle = function (fn, timeout, ctx) {
    var timer, args, needInvoke;

    return function () {

      args = arguments;
      needInvoke = true;
      ctx = ctx || this;

      if (!timer) {
        (function () {
          if (needInvoke) {
            fn.apply(ctx, args);
            needInvoke = false;
            timer = setTimeout(arguments.callee, timeout);
          }
          else {
            timer = null;
          }
        })();
      }
    };
  };
}
if (!Function.debounce) {
  /**
   * Если дословно переводить — «устранение дребезга». Такой декоратор позволяет превратить несколько вызовов функции в
   * течение определенного времени в один вызов, причем задержка начинает заново отсчитываться с каждой новой попыткой
   * вызова. Возможно два варианта:
   * - Реальный вызов происходит только в случае, если с момента последней попытки прошло время, большее или равное
   *  задержке.
   * - Реальный вызов происходит сразу, а все остальные попытки вызова игнорируются, пока не пройдет время, большее
   * или равное задержке, отсчитанной от времени последней попытки.
   *
   * @param {Number} timeout задержка
   * @param {Boolean} [invokeAsap=false] Параметр, указывающий какой из вышеперечисленных вариантов debouncing нужно
   * использовать (по умолчанию используется первый)
   * @param {Object} ctx контекст оригинальной функции (scope)
   * @return {Function}
   */
  Function.debounce = function (fn, timeout, invokeAsap, ctx) {
    timeout = isNumber(timeout) ? timeout : 1e2;
    if (arguments.length == 3 && typeof invokeAsap != "boolean") {
      ctx = invokeAsap;
      invokeAsap = false;
    }

    var timer;

    return function () {

      var args = arguments;
      ctx = ctx || this;

      invokeAsap && !timer && fn.apply(ctx, args);

      clearTimeout(timer);

      timer = setTimeout(function () {
        !invokeAsap && fn.apply(ctx, args);
        timer = null;
      }, timeout);

    };
  };
}
if (!Function.throttle) {
  /**
   * позволяет «затормозить» функцию — функция будет выполняться не чаще одного раза в указанный период,
   * даже если она будет вызвана много раз в течение этого периода. Т.е. все промежуточные вызовы будут игнорироваться.
   * Например, на resize окна (или, допустим, на mousemove) у вас срабатывает какой-то тяжелый обработчик.
   * Можно его «затормозить»:
   *
   *  $(window).resize($.throttle(doComplexСomputation, 300));
   *
   * @param {Number} timeout период
   * @param {Object} ctx контекст оригинальной функции (scope)
   * @return {Function}
   */
  Function.throttle = function (fn, timeout, ctx) {
    var timer, args, needInvoke,
        self = this;

    return function () {

      args = arguments;
      needInvoke = true;
      ctx = ctx || this;

      if (!timer) {
        (function () {
          if (needInvoke) {
            fn.apply(ctx, args);
            needInvoke = false;
            timer = setTimeout(arguments.callee, timeout);
          }
          else {
            timer = null;
          }
        })();
      }
    };
  };
}

/**
 * solved problem: Added non-passive event listener to a scroll-blocking 'touchmove' event.
 *  Consider marking event handler as 'passive' to make the page more responsive.
 * @override EventTarget.prototype.addEventListener
 */
(function () {
  var supportsPassive = eventListenerOptionsSupported();

  if (supportsPassive) {
    var addEvent = EventTarget.prototype.addEventListener;
    overwriteAddEvent(addEvent);
  }

  function overwriteAddEvent(superMethod) {
    var defaultOptions = {
      passive: false,
      capture: false
    };

    EventTarget.prototype.addEventListener = function (type: string, listener: EventListenerOrEventListenerObject | null, options?: any) {
      if (["touchstart", "touchend", "touchmove", "touchcancel", "mousewheel", "wheel"].indexOf(type) > -1) {
        var usesListenerOptions = typeof options === "object";
        var useCapture = usesListenerOptions ? options.capture : options;

        options = usesListenerOptions ? options : {};
        options.passive = options.passive !== undefined ? options.passive : defaultOptions.passive;
        options.capture = useCapture !== undefined ? useCapture : defaultOptions.capture;
      }
      superMethod.call(this, type, listener, options);
    };
  }

  function eventListenerOptionsSupported() {
    var supported = false;
    try {
      var opts = Object.defineProperty({}, "passive", {
        get: function () {
          supported = true;
        }
      });
      window.addEventListener("test", null, opts);
    } catch (e) {
    }

    return supported;
  }
})();

/**
 * определяет абсолютные значения по указанному HTMLElement'у
 * @member window
 * @param {HTMLElement} rawDomNode
 * @returns {{left: Number, top: Number, width: Number, height: Number, bottom: Number, right: Number}}
 */
function offsetHTMLElement(rawDomNode) {
  var body = document.documentElement || document.body,
      scrollX = window.pageXOffset || body.scrollLeft,
      scrollY = window.pageYOffset || body.scrollTop,
      clientRect = rawDomNode.getBoundingClientRect(),
      x = clientRect.left + scrollX,
      y = clientRect.top + scrollY;
  return {
    left: parseInt(x),
    top: parseInt(y),
    width: parseInt(clientRect.width),
    height: parseInt(clientRect.height),
    bottom: parseInt(clientRect.bottom),
    right: parseInt(clientRect.right)
  };
}

/**
 * возвращает глобальную координату расположения мыши
 * @param {event} e
 * @param {String} coord
 * @returns {Number}
 */
function getMousePos(e, coord) {
  var prop = "client" + coord;
  if ((e[prop] || (e.originalEvent && e.originalEvent[prop])) === 0) return 0;
  return e[prop]
      || (e.originalEvent && e.originalEvent[prop])
      || (window.jQuery // jQuery does touches wired
          ? (e.originalEvent ? e.originalEvent.targetTouches[0][prop] : 0)
          : (e.targetTouches ? e.targetTouches[0][prop] : 0))
}

/**
 * строковый JSON преобразует к Object.
 * @method toJSON
 * @member String
 */
if (!String.prototype.toJSON) {
  String.prototype.toJSON = function () {
    return JSON.parse(this.toString());
  }
}
/**
 * позволяет форматировать строку по маске:
 *  "Hello world {0}th and {1}.".format(23, 'some body')
 * @method format
 * @member String
 */
if (!String.prototype.format) {
  String.prototype.format = function (format) {
    var a = arguments;
    return this.replace(/\{(\d+)\}/g, function (m, i) {
      return a[i];
    });
  }
}
/**
 * Escapes the passed string for ' and \
 * @param {String} string The string to escape
 * @return {String} The escaped string
 * @static
 */
if (!String.escape) {
  String.escape = function (string) {
    return string.replace(/('|\\)/g, "\\$1");
  };
}
/**
 * Pads the left side of a string with a specified character.  This is especially useful
 * for normalizing number and date strings.  Example usage:
 * <pre><code>
 var s = String.leftPad('123', 5, '0');
 // s now contains the string: '00123'
 * </code></pre>
 * @param {String} string The original string
 * @param {Number} size The total length of the output string
 * @param {String} char (optional) The character with which to pad the original string (defaults to empty string " ")
 * @return {String} The padded string
 * @static
 */
if (!String.leftPad) {
  String.leftPad = function (val, size, ch) {
    var result = String(val);
    if (!ch) {
      ch = " ";
    }
    while (result.length < size) {
      result = ch + result;
    }
    return result;
  };
}

/**
 * Add assign property for IE
 * @method assign
 * @member Object
 */
if (!Object.assign) {
  Object.defineProperty(Object, "assign", {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function (target, firstSource) {
      "use strict";
      if (target === undefined || target === null) {
        throw new TypeError("Cannot convert first argument to object");
      }

      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) {
          continue;
        }

        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    }
  });
}

if (!Array.prototype.indexOfKey) {
  Array.prototype.indexOfKey = function (key, val, from) {
    var len = this.length;
    from = Number(arguments[2]) || 0;
    from = (from < 0)
        ? Math.ceil(from)
        : Math.floor(from);
    if (from < 0) from += len;

    for (; from < len; from++) {
      try {
        if (key in this[from]) {
          if (this[from][key] === val) return from;
          if (isNumber(this[from][key]) || isNumber(val)) if (parseInt(val) === parseInt(this[from][key])) return from;
        }
      } catch (e) {
        ;
      }
    }
    return -1;
  }
}

if (!Array.prototype.insert) {
  Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
    return this;
  };
}

if (!Array.prototype.remove) {
  /**
   * Removes the specified object from the array.  If the object is not found nothing happens.
   * @method remove
   * @param {Object} o The object to remove
   * @return {Array} this array
   * @member Array
   */
  Array.prototype.remove = function (o) {
    var index = this.indexOf(o);
    if (index != -1) {
      this.splice(index, 1);
    }
    return this;
  }
}

/**
 * Returns true if the passed value is a boolean.
 * @param v The value to test
 * @return {Boolean}
 * @member window
 */
function isBoolean(v) {
  return typeof v === "boolean";
}

/**
 * Returns true if the passed value is a number. Returns false for non-finite numbers.
 * @param v The value to test
 * @return {Boolean}
 * @member window
 */
function isNumber(v) {
  return (typeof v === "number" || parseFloat(v) == v) && isFinite(v);
}

/**
 * Utility method for validating that a value is numeric, returning the specified default value if it is not.
 * @param {*} v Should be a number, but any type will be handled appropriately
 * @param {Number} defaultValue The value to return if the original value is non-numeric
 * @return {Number} Value, if numeric, else defaultValue
 * @member window
 */
function parseNumber(v, defaultValue) {
  v = Number(isEmpty(v) || isArray(v) || typeof v == "boolean" || (typeof v == "string" && v.trim().length == 0)
      ? NaN : v);
  return isNaN(v) ? defaultValue : v;
}

/**
 * return true if value is primitive (String|Number|Boolean|Date)
 * @param v
 * @return {Boolean}
 * @member window
 */
function isPrimitive(v) {
  return isString(v) || isNumber(v) || isDate(v) || isBoolean(v)
}

/**
 * Returns true if the passed value is a string.
 * @param v The value to test
 * @return {Boolean}
 * @member window
 */
function isString(v) {
  return typeof v === "string";
}

/**
 * Returns true if the passed value is a JavaScript Object, otherwise false.
 * @param {*} v The value to test
 * @return {Boolean}
 * @member window
 */
function isObject(v) {
  return !!v && Object.prototype.toString.call(v) === "[object Object]";
}

/**
 * Returns true if the passed value is a JavaScript array, otherwise false.
 * @param v The value to test
 * @return {Boolean}
 * @member window
 */
function isArray(v) {
  return (Array.isArray
      ? Array.isArray(v)
      : ((v instanceof Array) || Object.prototype.toString.apply(v) === "[object Array]"));
}

/**
 * Returns true if the passed value is empty.
 * <p>The value is deemed to be empty if it is<div class="mdetail-params"><ul>
 * <li>null</li>
 * <li>undefined</li>
 * <li>an empty array</li>
 * <li>a zero length string (Unless the <tt>allowBlank</tt> parameter is <tt>true</tt>)</li>
 * </ul></div>
 * @param v The value to test
 * @param {Boolean} [allowBlank=false] true to allow empty strings
 * @return {Boolean}
 * @member window
 */
function isEmpty(v, allowBlank?) {
  if (isBoolean(v)) return false;
  var result = false;
  result = (!allowBlank && parseFloat(v) == v
      ? parseFloat(v) === 0
      : false)
      || v === null
      || v === undefined
      || (typeof v in {"unknown": 1, "undefined": 1})
      || (isArray(v)
          ? (!allowBlank
              ? !v.length
              : false)
          : false)
      || (!allowBlank
          ? (isString(v) && v.trim() === "")
          : false);
  if (result) return result;
  if (isObject(v)) {
    result = true;
    for (var io in v)
      if (v.hasOwnProperty(io)) {
        result = false;
        break;
      }
    if (allowBlank) result = false;
  }
  return result;
}

/**
 * Returns true if the passed object is a JavaScript date object, otherwise false.
 * @param v The object to test
 * @return {Boolean}
 * @member window
 */
function isDate(v) {
  return Object.prototype.toString.apply(v) === "[object Date]";
}

/**
 * Returns true if the passed value is a JavaScript Function, otherwise false.
 * @param v The value to test
 * @return {Boolean}
 * @member window
 */
function isFunction(v) {
  return Object.prototype.toString.apply(v) === "[object Function]";
}

/**
 * Returns true if the passed value is not undefined.
 *
 *  isDefined(localStorage)
 *  isDefined('window.localStorage',true)
 *  isDefined('window.localStorage')
 *  isDefined(window, 'localStorage')
 *
 * @param {*} v The value to test
 * @param {String|boolean} [i] искомая переменная внутри <strong>v</strong>
 * @return {Boolean}
 * @member window
 */
function isDefined(v, i) {
  var unknownRe = /undefined|unknown/,
      glob = this, //window
      v_isString = isString(v);
  if (v_isString && i) {
    if (v_isString) {
      var parts = v.split(".") || [];
      try {
        var cls = glob;
        for (var ii = 0, n = parts.length; cls && ii < n; ++ii) {
          cls = cls[parts[ii]];
        }
        // if(cls && glob[v]){
        v = cls; // return true; }
      } catch (ex) {
        v = undefined
      }
    }
    if (i && !isBoolean(i))
      if ((("hasOwnProperty" in v) && v.hasOwnProperty(i)) || (i in v))
        v = v[i];
  }
  else if (i && !isBoolean(i) && isObject(v)) {
    if ((("hasOwnProperty" in v) && !v.hasOwnProperty(i)) || !(i in v))
      v = v[i];
  }
  return !unknownRe.test(typeof(v));
}

/**
 * клонирует/применяет объект\массив
 * @param {Array|Object} d destination
 * @param {Array|Object} s source
 * @param {Number} [lvl]
 * @param {Boolean} [ne=false] apply if key in destination not exist (use only for object)
 * @member window
 */
function clone(d, s, lvl?, ne?) {
  ne = ne || false;
  if (!s || (isArray(s) && !s.length)) return d;
  var isA_d = isArray(d);
  if (!isA_d && !isObject(d)) throw {message: "Destination of an unsupported type", "function": "clone"};
  var isA_s = (isArray(s) || s.length);
  if (!isA_s && !isObject(s)) throw {message: "Source of an unsupported type", "function": "clone"};

  function _i(i, s) {
    var sO = isArray(s[i]) ? [] : isObject(s[i]) ? {} : undefined;
    if (sO && lvl > 0) {
      if (isA_d) d.push(clone(sO, s[i], lvl - 1));
      else {
        if (ne && d.hasOwnProperty(i)) return;
        d[i] = clone(sO, s[i], lvl - 1);
      }
    }
    else {
      if (isA_d) d.push(s[i]);
      else {
        if (ne && d.hasOwnProperty(i)) return;
        d[i] = s[i];
      }
    }
  }

  if (isA_s) {
    for (let i: number = 0; i < s.length; i++) { // may use .map(), but this to faster (mb)
      _i(i, s)
    }
  }
  else {
    for (let i in s) {
      if (ne && d.hasOwnProperty(i)) continue;
      if (!s.hasOwnProperty(i)) continue;
      _i(i, s)
    }
  }
  return d
}

/**
 * сравнивает два объекта с учетом вложенностей
 * @param {Array|Object} obj1
 * @param {Array|Object} obj2
 * @param {Boolean} [u=false] строгое соответствие (с приведением типов)
 * @return {Boolean} <dd>false</dd> if not equals
 * @member window
 */
function equals(obj1, obj2, u?) {
  var excluded = ["$$hashKey"];

  if (obj1 && obj2) {
    if ((obj1.self && obj1.self.$isClass) || (obj2.self && obj2.self.$isClass))
      throw new Error("Функция не предусмотрена для сравнения объектов от классов.");

    var cnt1 = 0, cnt2 = 0;
    for (var io in obj1) {
      if (!obj1.hasOwnProperty(io)) continue;
      if (excluded.indexOf(io) > -1) continue;
      cnt1++
    }
    for (var io in obj2) {
      if (!obj2.hasOwnProperty(io)) continue;
      if (excluded.indexOf(io) > -1) continue;
      cnt2++
    }
    if (cnt1 != cnt2) return false;
  }

  for (var io in obj1) {
    if (!obj1.hasOwnProperty(io)) continue;
    if (excluded.indexOf(io) > -1) continue;
    // console.log('typeof obj1[io] !== typeof obj2[io]',typeof obj1[io] !== typeof obj2[io], io, obj1[io], obj2[io])
    if (typeof obj1[io] !== typeof obj2[io]) return false;
    if (isFunction(obj1[io])) {
      if (obj1[io].toString() != obj2[io].toString()) return false;
    }
    else if (isDate(obj1[io])) {
      if ((new Date(obj1[io])).valueOf() !== (new Date(obj2[io])).valueOf()) return false
    }
    else if (typeof obj1[io] == "object") {
      if (!equals(obj1[io], obj2[io])) return false;
    }
    else if (!(u
        ? (obj1[io] === obj2[io])
        : (obj1[io] == obj2[io]))) {
      // console.log('obj1[io] === obj2[io]',obj1[io] === obj2[io], io)
      return false;
    }
  }
  return true
}
