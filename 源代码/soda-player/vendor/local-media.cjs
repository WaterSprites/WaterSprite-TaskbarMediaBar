var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// soda-player/node_modules/ms/index.js
var require_ms = __commonJS({
  "soda-player/node_modules/ms/index.js"(exports2, module2) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse3(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse3(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// soda-player/node_modules/debug/src/common.js
var require_common = __commonJS({
  "soda-player/node_modules/debug/src/common.js"(exports2, module2) {
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug31(...args) {
          if (!debug31.enabled) {
            return;
          }
          const self = debug31;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self.diff = ms;
          self.prev = prevTime;
          self.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self, args);
          const logFn = self.log || createDebug.log;
          logFn.apply(self, args);
        }
        debug31.namespace = namespace;
        debug31.useColors = createDebug.useColors();
        debug31.color = createDebug.selectColor(namespace);
        debug31.extend = extend;
        debug31.destroy = createDebug.destroy;
        Object.defineProperty(debug31, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug31);
        }
        return debug31;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
        for (const ns of split) {
          if (ns[0] === "-") {
            createDebug.skips.push(ns.slice(1));
          } else {
            createDebug.names.push(ns);
          }
        }
      }
      function matchesTemplate(search, template) {
        let searchIndex = 0;
        let templateIndex = 0;
        let starIndex = -1;
        let matchIndex = 0;
        while (searchIndex < search.length) {
          if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) {
            if (template[templateIndex] === "*") {
              starIndex = templateIndex;
              matchIndex = searchIndex;
              templateIndex++;
            } else {
              searchIndex++;
              templateIndex++;
            }
          } else if (starIndex !== -1) {
            templateIndex = starIndex + 1;
            matchIndex++;
            searchIndex = matchIndex;
          } else {
            return false;
          }
        }
        while (templateIndex < template.length && template[templateIndex] === "*") {
          templateIndex++;
        }
        return templateIndex === template.length;
      }
      function disable() {
        const namespaces = [
          ...createDebug.names,
          ...createDebug.skips.map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        for (const skip of createDebug.skips) {
          if (matchesTemplate(name, skip)) {
            return false;
          }
        }
        for (const ns of createDebug.names) {
          if (matchesTemplate(name, ns)) {
            return true;
          }
        }
        return false;
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module2.exports = setup;
  }
});

// soda-player/node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "soda-player/node_modules/debug/src/browser.js"(exports2, module2) {
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.storage = localstorage();
    exports2.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports2.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      let m;
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module2.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports2.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports2.storage.setItem("debug", namespaces);
        } else {
          exports2.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports2.storage.getItem("debug") || exports2.storage.getItem("DEBUG");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module2.exports = require_common()(exports2);
    var { formatters } = module2.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// soda-player/node_modules/debug/src/node.js
var require_node = __commonJS({
  "soda-player/node_modules/debug/src/node.js"(exports2, module2) {
    var tty = require("tty");
    var util = require("util");
    exports2.init = init;
    exports2.log = log;
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.destroy = util.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    );
    exports2.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = require("supports-color");
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports2.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ];
      }
    } catch (error) {
    }
    exports2.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
        return k.toUpperCase();
      });
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports2.inspectOpts ? Boolean(exports2.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module2.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports2.inspectOpts.hideDate) {
        return "";
      }
      return (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function log(...args) {
      return process.stderr.write(util.formatWithOptions(exports2.inspectOpts, ...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug31) {
      debug31.inspectOpts = {};
      const keys = Object.keys(exports2.inspectOpts);
      for (let i = 0; i < keys.length; i++) {
        debug31.inspectOpts[keys[i]] = exports2.inspectOpts[keys[i]];
      }
    }
    module2.exports = require_common()(exports2);
    var { formatters } = module2.exports;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts);
    };
  }
});

// soda-player/node_modules/debug/src/index.js
var require_src = __commonJS({
  "soda-player/node_modules/debug/src/index.js"(exports2, module2) {
    if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
      module2.exports = require_browser();
    } else {
      module2.exports = require_node();
    }
  }
});

// soda-player/node_modules/strtok3/lib/stream/Errors.js
var defaultMessages, EndOfStreamError, AbortError;
var init_Errors = __esm({
  "soda-player/node_modules/strtok3/lib/stream/Errors.js"() {
    defaultMessages = "End-Of-Stream";
    EndOfStreamError = class extends Error {
      constructor() {
        super(defaultMessages);
        this.name = "EndOfStreamError";
      }
    };
    AbortError = class extends Error {
      constructor(message = "The operation was aborted") {
        super(message);
        this.name = "AbortError";
      }
    };
  }
});

// soda-player/node_modules/strtok3/lib/stream/Deferred.js
var init_Deferred = __esm({
  "soda-player/node_modules/strtok3/lib/stream/Deferred.js"() {
  }
});

// soda-player/node_modules/strtok3/lib/stream/AbstractStreamReader.js
var AbstractStreamReader;
var init_AbstractStreamReader = __esm({
  "soda-player/node_modules/strtok3/lib/stream/AbstractStreamReader.js"() {
    init_Errors();
    AbstractStreamReader = class {
      constructor() {
        this.endOfStream = false;
        this.interrupted = false;
        this.peekQueue = [];
      }
      async peek(uint8Array, mayBeLess = false) {
        const bytesRead = await this.read(uint8Array, mayBeLess);
        this.peekQueue.push(uint8Array.subarray(0, bytesRead));
        return bytesRead;
      }
      async read(buffer, mayBeLess = false) {
        if (buffer.length === 0) {
          return 0;
        }
        let bytesRead = this.readFromPeekBuffer(buffer);
        if (!this.endOfStream) {
          bytesRead += await this.readRemainderFromStream(buffer.subarray(bytesRead), mayBeLess);
        }
        if (bytesRead === 0 && !mayBeLess) {
          throw new EndOfStreamError();
        }
        return bytesRead;
      }
      /**
       * Read chunk from stream
       * @param buffer - Target Uint8Array (or Buffer) to store data read from stream in
       * @returns Number of bytes read
       */
      readFromPeekBuffer(buffer) {
        let remaining = buffer.length;
        let bytesRead = 0;
        while (this.peekQueue.length > 0 && remaining > 0) {
          const peekData = this.peekQueue.pop();
          if (!peekData)
            throw new Error("peekData should be defined");
          const lenCopy = Math.min(peekData.length, remaining);
          buffer.set(peekData.subarray(0, lenCopy), bytesRead);
          bytesRead += lenCopy;
          remaining -= lenCopy;
          if (lenCopy < peekData.length) {
            this.peekQueue.push(peekData.subarray(lenCopy));
          }
        }
        return bytesRead;
      }
      async readRemainderFromStream(buffer, mayBeLess) {
        let bytesRead = 0;
        while (bytesRead < buffer.length && !this.endOfStream) {
          if (this.interrupted) {
            throw new AbortError();
          }
          const chunkLen = await this.readFromStream(buffer.subarray(bytesRead), mayBeLess);
          if (chunkLen === 0)
            break;
          bytesRead += chunkLen;
        }
        if (!mayBeLess && bytesRead < buffer.length) {
          throw new EndOfStreamError();
        }
        return bytesRead;
      }
    };
  }
});

// soda-player/node_modules/strtok3/lib/stream/StreamReader.js
var init_StreamReader = __esm({
  "soda-player/node_modules/strtok3/lib/stream/StreamReader.js"() {
    init_Errors();
    init_Deferred();
    init_AbstractStreamReader();
  }
});

// soda-player/node_modules/strtok3/lib/stream/WebStreamReader.js
var WebStreamReader;
var init_WebStreamReader = __esm({
  "soda-player/node_modules/strtok3/lib/stream/WebStreamReader.js"() {
    init_AbstractStreamReader();
    WebStreamReader = class extends AbstractStreamReader {
      constructor(reader) {
        super();
        this.reader = reader;
      }
      async abort() {
        return this.close();
      }
      async close() {
        this.reader.releaseLock();
      }
    };
  }
});

// soda-player/node_modules/strtok3/lib/stream/WebStreamByobReader.js
var WebStreamByobReader;
var init_WebStreamByobReader = __esm({
  "soda-player/node_modules/strtok3/lib/stream/WebStreamByobReader.js"() {
    init_WebStreamReader();
    WebStreamByobReader = class extends WebStreamReader {
      /**
       * Read from stream
       * @param buffer - Target Uint8Array (or Buffer) to store data read from stream in
       * @param mayBeLess - If true, may fill the buffer partially
       * @protected Bytes read
       */
      async readFromStream(buffer, mayBeLess) {
        if (buffer.length === 0)
          return 0;
        const result = await this.reader.read(new Uint8Array(buffer.length), { min: mayBeLess ? void 0 : buffer.length });
        if (result.done) {
          this.endOfStream = result.done;
        }
        if (result.value) {
          buffer.set(result.value);
          return result.value.length;
        }
        return 0;
      }
    };
  }
});

// soda-player/node_modules/strtok3/lib/stream/WebStreamDefaultReader.js
var WebStreamDefaultReader;
var init_WebStreamDefaultReader = __esm({
  "soda-player/node_modules/strtok3/lib/stream/WebStreamDefaultReader.js"() {
    init_Errors();
    init_AbstractStreamReader();
    WebStreamDefaultReader = class extends AbstractStreamReader {
      constructor(reader) {
        super();
        this.reader = reader;
        this.buffer = null;
      }
      /**
       * Copy chunk to target, and store the remainder in this.buffer
       */
      writeChunk(target, chunk) {
        const written = Math.min(chunk.length, target.length);
        target.set(chunk.subarray(0, written));
        if (written < chunk.length) {
          this.buffer = chunk.subarray(written);
        } else {
          this.buffer = null;
        }
        return written;
      }
      /**
       * Read from stream
       * @param buffer - Target Uint8Array (or Buffer) to store data read from stream in
       * @param mayBeLess - If true, may fill the buffer partially
       * @protected Bytes read
       */
      async readFromStream(buffer, mayBeLess) {
        if (buffer.length === 0)
          return 0;
        let totalBytesRead = 0;
        if (this.buffer) {
          totalBytesRead += this.writeChunk(buffer, this.buffer);
        }
        while (totalBytesRead < buffer.length && !this.endOfStream) {
          const result = await this.reader.read();
          if (result.done) {
            this.endOfStream = true;
            break;
          }
          if (result.value) {
            totalBytesRead += this.writeChunk(buffer.subarray(totalBytesRead), result.value);
          }
        }
        if (!mayBeLess && totalBytesRead === 0 && this.endOfStream) {
          throw new EndOfStreamError();
        }
        return totalBytesRead;
      }
      abort() {
        this.interrupted = true;
        return this.reader.cancel();
      }
      async close() {
        await this.abort();
        this.reader.releaseLock();
      }
    };
  }
});

// soda-player/node_modules/strtok3/lib/stream/WebStreamReaderFactory.js
function makeWebStreamReader(stream) {
  try {
    const reader = stream.getReader({ mode: "byob" });
    if (reader instanceof ReadableStreamDefaultReader) {
      return new WebStreamDefaultReader(reader);
    }
    return new WebStreamByobReader(reader);
  } catch (error) {
    if (error instanceof TypeError) {
      return new WebStreamDefaultReader(stream.getReader());
    }
    throw error;
  }
}
var init_WebStreamReaderFactory = __esm({
  "soda-player/node_modules/strtok3/lib/stream/WebStreamReaderFactory.js"() {
    init_WebStreamByobReader();
    init_WebStreamDefaultReader();
  }
});

// soda-player/node_modules/strtok3/lib/stream/index.js
var init_stream = __esm({
  "soda-player/node_modules/strtok3/lib/stream/index.js"() {
    init_Errors();
    init_StreamReader();
    init_WebStreamByobReader();
    init_WebStreamDefaultReader();
    init_WebStreamReaderFactory();
  }
});

// soda-player/node_modules/strtok3/lib/AbstractTokenizer.js
var AbstractTokenizer;
var init_AbstractTokenizer = __esm({
  "soda-player/node_modules/strtok3/lib/AbstractTokenizer.js"() {
    init_stream();
    AbstractTokenizer = class {
      /**
       * Constructor
       * @param options Tokenizer options
       * @protected
       */
      constructor(options) {
        this.numBuffer = new Uint8Array(8);
        this.position = 0;
        this.onClose = options?.onClose;
        if (options?.abortSignal) {
          options.abortSignal.addEventListener("abort", () => {
            this.abort();
          });
        }
      }
      /**
       * Read a token from the tokenizer-stream
       * @param token - The token to read
       * @param position - If provided, the desired position in the tokenizer-stream
       * @returns Promise with token data
       */
      async readToken(token, position = this.position) {
        const uint8Array = new Uint8Array(token.len);
        const len = await this.readBuffer(uint8Array, { position });
        if (len < token.len)
          throw new EndOfStreamError();
        return token.get(uint8Array, 0);
      }
      /**
       * Peek a token from the tokenizer-stream.
       * @param token - Token to peek from the tokenizer-stream.
       * @param position - Offset where to begin reading within the file. If position is null, data will be read from the current file position.
       * @returns Promise with token data
       */
      async peekToken(token, position = this.position) {
        const uint8Array = new Uint8Array(token.len);
        const len = await this.peekBuffer(uint8Array, { position });
        if (len < token.len)
          throw new EndOfStreamError();
        return token.get(uint8Array, 0);
      }
      /**
       * Read a numeric token from the stream
       * @param token - Numeric token
       * @returns Promise with number
       */
      async readNumber(token) {
        const len = await this.readBuffer(this.numBuffer, { length: token.len });
        if (len < token.len)
          throw new EndOfStreamError();
        return token.get(this.numBuffer, 0);
      }
      /**
       * Read a numeric token from the stream
       * @param token - Numeric token
       * @returns Promise with number
       */
      async peekNumber(token) {
        const len = await this.peekBuffer(this.numBuffer, { length: token.len });
        if (len < token.len)
          throw new EndOfStreamError();
        return token.get(this.numBuffer, 0);
      }
      /**
       * Ignore number of bytes, advances the pointer in under tokenizer-stream.
       * @param length - Number of bytes to ignore.  Must be ≥ 0.
       * @return resolves the number of bytes ignored, equals length if this available, otherwise the number of bytes available
       */
      async ignore(length) {
        if (length < 0) {
          throw new RangeError("ignore length must be \u2265 0 bytes");
        }
        if (this.fileInfo.size !== void 0) {
          const bytesLeft = this.fileInfo.size - this.position;
          if (length > bytesLeft) {
            this.position += bytesLeft;
            return bytesLeft;
          }
        }
        this.position += length;
        return length;
      }
      async close() {
        await this.abort();
        await this.onClose?.();
      }
      normalizeOptions(uint8Array, options) {
        if (!this.supportsRandomAccess() && options && options.position !== void 0 && options.position < this.position) {
          throw new Error("`options.position` must be equal or greater than `tokenizer.position`");
        }
        return {
          ...{
            mayBeLess: false,
            offset: 0,
            length: uint8Array.length,
            position: this.position
          },
          ...options
        };
      }
      abort() {
        return Promise.resolve();
      }
    };
  }
});

// soda-player/node_modules/strtok3/lib/ReadStreamTokenizer.js
var maxBufferSize, ReadStreamTokenizer;
var init_ReadStreamTokenizer = __esm({
  "soda-player/node_modules/strtok3/lib/ReadStreamTokenizer.js"() {
    init_AbstractTokenizer();
    init_stream();
    maxBufferSize = 256e3;
    ReadStreamTokenizer = class extends AbstractTokenizer {
      /**
       * Constructor
       * @param streamReader stream-reader to read from
       * @param options Tokenizer options
       */
      constructor(streamReader, options) {
        super(options);
        this.streamReader = streamReader;
        this.fileInfo = options?.fileInfo ?? {};
      }
      /**
       * Read buffer from tokenizer
       * @param uint8Array - Target Uint8Array to fill with data read from the tokenizer-stream
       * @param options - Read behaviour options
       * @returns Promise with number of bytes read
       */
      async readBuffer(uint8Array, options) {
        const normOptions = this.normalizeOptions(uint8Array, options);
        const skipBytes = normOptions.position - this.position;
        if (skipBytes > 0) {
          await this.ignore(skipBytes);
          return this.readBuffer(uint8Array, options);
        }
        if (skipBytes < 0) {
          throw new Error("`options.position` must be equal or greater than `tokenizer.position`");
        }
        if (normOptions.length === 0) {
          return 0;
        }
        const bytesRead = await this.streamReader.read(uint8Array.subarray(0, normOptions.length), normOptions.mayBeLess);
        this.position += bytesRead;
        if ((!options || !options.mayBeLess) && bytesRead < normOptions.length) {
          throw new EndOfStreamError();
        }
        return bytesRead;
      }
      /**
       * Peek (read ahead) buffer from tokenizer
       * @param uint8Array - Uint8Array (or Buffer) to write data to
       * @param options - Read behaviour options
       * @returns Promise with number of bytes peeked
       */
      async peekBuffer(uint8Array, options) {
        const normOptions = this.normalizeOptions(uint8Array, options);
        let bytesRead = 0;
        if (normOptions.position) {
          const skipBytes = normOptions.position - this.position;
          if (skipBytes > 0) {
            const skipBuffer = new Uint8Array(normOptions.length + skipBytes);
            bytesRead = await this.peekBuffer(skipBuffer, { mayBeLess: normOptions.mayBeLess });
            uint8Array.set(skipBuffer.subarray(skipBytes));
            return bytesRead - skipBytes;
          }
          if (skipBytes < 0) {
            throw new Error("Cannot peek from a negative offset in a stream");
          }
        }
        if (normOptions.length > 0) {
          try {
            bytesRead = await this.streamReader.peek(uint8Array.subarray(0, normOptions.length), normOptions.mayBeLess);
          } catch (err) {
            if (options?.mayBeLess && err instanceof EndOfStreamError) {
              return 0;
            }
            throw err;
          }
          if (!normOptions.mayBeLess && bytesRead < normOptions.length) {
            throw new EndOfStreamError();
          }
        }
        return bytesRead;
      }
      /**
       * @param length Number of bytes to ignore. Must be ≥ 0.
       */
      async ignore(length) {
        if (length < 0) {
          throw new RangeError("ignore length must be \u2265 0 bytes");
        }
        const bufSize = Math.min(maxBufferSize, length);
        const buf = new Uint8Array(bufSize);
        let totBytesRead = 0;
        while (totBytesRead < length) {
          const remaining = length - totBytesRead;
          const bytesRead = await this.readBuffer(buf, { length: Math.min(bufSize, remaining) });
          if (bytesRead < 0) {
            return bytesRead;
          }
          totBytesRead += bytesRead;
        }
        return totBytesRead;
      }
      abort() {
        return this.streamReader.abort();
      }
      async close() {
        return this.streamReader.close();
      }
      supportsRandomAccess() {
        return false;
      }
    };
  }
});

// soda-player/node_modules/strtok3/lib/BufferTokenizer.js
var BufferTokenizer;
var init_BufferTokenizer = __esm({
  "soda-player/node_modules/strtok3/lib/BufferTokenizer.js"() {
    init_stream();
    init_AbstractTokenizer();
    BufferTokenizer = class extends AbstractTokenizer {
      /**
       * Construct BufferTokenizer
       * @param uint8Array - Uint8Array to tokenize
       * @param options Tokenizer options
       */
      constructor(uint8Array, options) {
        super(options);
        this.uint8Array = uint8Array;
        this.fileInfo = { ...options?.fileInfo ?? {}, ...{ size: uint8Array.length } };
      }
      /**
       * Read buffer from tokenizer
       * @param uint8Array - Uint8Array to tokenize
       * @param options - Read behaviour options
       * @returns {Promise<number>}
       */
      async readBuffer(uint8Array, options) {
        if (options?.position) {
          this.position = options.position;
        }
        const bytesRead = await this.peekBuffer(uint8Array, options);
        this.position += bytesRead;
        return bytesRead;
      }
      /**
       * Peek (read ahead) buffer from tokenizer
       * @param uint8Array
       * @param options - Read behaviour options
       * @returns {Promise<number>}
       */
      async peekBuffer(uint8Array, options) {
        const normOptions = this.normalizeOptions(uint8Array, options);
        const bytes2read = Math.min(this.uint8Array.length - normOptions.position, normOptions.length);
        if (!normOptions.mayBeLess && bytes2read < normOptions.length) {
          throw new EndOfStreamError();
        }
        uint8Array.set(this.uint8Array.subarray(normOptions.position, normOptions.position + bytes2read));
        return bytes2read;
      }
      close() {
        return super.close();
      }
      supportsRandomAccess() {
        return true;
      }
      setPosition(position) {
        this.position = position;
      }
    };
  }
});

// soda-player/node_modules/strtok3/lib/BlobTokenizer.js
var BlobTokenizer;
var init_BlobTokenizer = __esm({
  "soda-player/node_modules/strtok3/lib/BlobTokenizer.js"() {
    init_stream();
    init_AbstractTokenizer();
    BlobTokenizer = class extends AbstractTokenizer {
      /**
       * Construct BufferTokenizer
       * @param blob - Uint8Array to tokenize
       * @param options Tokenizer options
       */
      constructor(blob, options) {
        super(options);
        this.blob = blob;
        this.fileInfo = { ...options?.fileInfo ?? {}, ...{ size: blob.size, mimeType: blob.type } };
      }
      /**
       * Read buffer from tokenizer
       * @param uint8Array - Uint8Array to tokenize
       * @param options - Read behaviour options
       * @returns {Promise<number>}
       */
      async readBuffer(uint8Array, options) {
        if (options?.position) {
          this.position = options.position;
        }
        const bytesRead = await this.peekBuffer(uint8Array, options);
        this.position += bytesRead;
        return bytesRead;
      }
      /**
       * Peek (read ahead) buffer from tokenizer
       * @param buffer
       * @param options - Read behaviour options
       * @returns {Promise<number>}
       */
      async peekBuffer(buffer, options) {
        const normOptions = this.normalizeOptions(buffer, options);
        const bytes2read = Math.min(this.blob.size - normOptions.position, normOptions.length);
        if (!normOptions.mayBeLess && bytes2read < normOptions.length) {
          throw new EndOfStreamError();
        }
        const arrayBuffer = await this.blob.slice(normOptions.position, normOptions.position + bytes2read).arrayBuffer();
        buffer.set(new Uint8Array(arrayBuffer));
        return bytes2read;
      }
      close() {
        return super.close();
      }
      supportsRandomAccess() {
        return true;
      }
      setPosition(position) {
        this.position = position;
      }
    };
  }
});

// soda-player/node_modules/strtok3/lib/core.js
function fromWebStream(webStream, options) {
  const webStreamReader = makeWebStreamReader(webStream);
  const _options = options ?? {};
  const chainedClose = _options.onClose;
  _options.onClose = async () => {
    await webStreamReader.close();
    if (chainedClose) {
      return chainedClose();
    }
  };
  return new ReadStreamTokenizer(webStreamReader, _options);
}
function fromBuffer(uint8Array, options) {
  return new BufferTokenizer(uint8Array, options);
}
function fromBlob(blob, options) {
  return new BlobTokenizer(blob, options);
}
var init_core = __esm({
  "soda-player/node_modules/strtok3/lib/core.js"() {
    init_stream();
    init_ReadStreamTokenizer();
    init_BufferTokenizer();
    init_BlobTokenizer();
    init_stream();
    init_AbstractTokenizer();
  }
});

// soda-player/node_modules/strtok3/lib/FileTokenizer.js
var import_promises, FileTokenizer;
var init_FileTokenizer = __esm({
  "soda-player/node_modules/strtok3/lib/FileTokenizer.js"() {
    init_AbstractTokenizer();
    init_stream();
    import_promises = require("node:fs/promises");
    FileTokenizer = class _FileTokenizer extends AbstractTokenizer {
      /**
       * Create tokenizer from provided file path
       * @param sourceFilePath File path
       */
      static async fromFile(sourceFilePath) {
        const fileHandle = await (0, import_promises.open)(sourceFilePath, "r");
        const stat = await fileHandle.stat();
        return new _FileTokenizer(fileHandle, { fileInfo: { path: sourceFilePath, size: stat.size } });
      }
      constructor(fileHandle, options) {
        super(options);
        this.fileHandle = fileHandle;
        this.fileInfo = options.fileInfo;
      }
      /**
       * Read buffer from file
       * @param uint8Array - Uint8Array to write result to
       * @param options - Read behaviour options
       * @returns Promise number of bytes read
       */
      async readBuffer(uint8Array, options) {
        const normOptions = this.normalizeOptions(uint8Array, options);
        this.position = normOptions.position;
        if (normOptions.length === 0)
          return 0;
        const res = await this.fileHandle.read(uint8Array, 0, normOptions.length, normOptions.position);
        this.position += res.bytesRead;
        if (res.bytesRead < normOptions.length && (!options || !options.mayBeLess)) {
          throw new EndOfStreamError();
        }
        return res.bytesRead;
      }
      /**
       * Peek buffer from file
       * @param uint8Array - Uint8Array (or Buffer) to write data to
       * @param options - Read behaviour options
       * @returns Promise number of bytes read
       */
      async peekBuffer(uint8Array, options) {
        const normOptions = this.normalizeOptions(uint8Array, options);
        const res = await this.fileHandle.read(uint8Array, 0, normOptions.length, normOptions.position);
        if (!normOptions.mayBeLess && res.bytesRead < normOptions.length) {
          throw new EndOfStreamError();
        }
        return res.bytesRead;
      }
      async close() {
        await this.fileHandle.close();
        return super.close();
      }
      setPosition(position) {
        this.position = position;
      }
      supportsRandomAccess() {
        return true;
      }
    };
  }
});

// soda-player/node_modules/strtok3/lib/index.js
var fromFile;
var init_lib = __esm({
  "soda-player/node_modules/strtok3/lib/index.js"() {
    init_core();
    init_FileTokenizer();
    init_FileTokenizer();
    init_core();
    fromFile = FileTokenizer.fromFile;
  }
});

// soda-player/node_modules/@borewit/text-codec/lib/index.js
function utf8Decoder() {
  if (typeof globalThis.TextDecoder === "undefined")
    return void 0;
  return _utf8Decoder !== null && _utf8Decoder !== void 0 ? _utf8Decoder : _utf8Decoder = new globalThis.TextDecoder("utf-8");
}
function utf8Encoder() {
  if (typeof globalThis.TextEncoder === "undefined")
    return void 0;
  return _utf8Encoder !== null && _utf8Encoder !== void 0 ? _utf8Encoder : _utf8Encoder = new globalThis.TextEncoder();
}
function textDecode(bytes, encoding = "utf-8") {
  switch (encoding.toLowerCase()) {
    case "utf-8":
    case "utf8": {
      const dec = utf8Decoder();
      return dec ? dec.decode(bytes) : decodeUTF8(bytes);
    }
    case "utf-16le":
      return decodeUTF16LE(bytes);
    case "us-ascii":
    case "ascii":
      return decodeASCII(bytes);
    case "latin1":
    case "iso-8859-1":
      return decodeLatin1(bytes);
    case "windows-1252":
      return decodeWindows1252(bytes);
    default:
      throw new RangeError(`Encoding '${encoding}' not supported`);
  }
}
function textEncode(input = "", encoding = "utf-8") {
  switch (encoding.toLowerCase()) {
    case "utf-8":
    case "utf8": {
      const enc = utf8Encoder();
      return enc ? enc.encode(input) : encodeUTF8(input);
    }
    case "utf-16le":
      return encodeUTF16LE(input);
    case "us-ascii":
    case "ascii":
      return encodeASCII(input);
    case "latin1":
    case "iso-8859-1":
      return encodeLatin1(input);
    case "windows-1252":
      return encodeWindows1252(input);
    default:
      throw new RangeError(`Encoding '${encoding}' not supported`);
  }
}
function flushChunk(parts, chunk) {
  if (chunk.length === 0)
    return;
  parts.push(String.fromCharCode.apply(null, chunk));
  chunk.length = 0;
}
function pushCodeUnit(parts, chunk, codeUnit) {
  chunk.push(codeUnit);
  if (chunk.length >= CHUNK)
    flushChunk(parts, chunk);
}
function pushCodePoint(parts, chunk, cp) {
  if (cp <= 65535) {
    pushCodeUnit(parts, chunk, cp);
    return;
  }
  cp -= 65536;
  pushCodeUnit(parts, chunk, 55296 + (cp >> 10));
  pushCodeUnit(parts, chunk, 56320 + (cp & 1023));
}
function decodeUTF8(bytes) {
  const parts = [];
  const chunk = [];
  let i = 0;
  if (bytes.length >= 3 && bytes[0] === 239 && bytes[1] === 187 && bytes[2] === 191) {
    i = 3;
  }
  while (i < bytes.length) {
    const b1 = bytes[i];
    if (b1 <= 127) {
      pushCodeUnit(parts, chunk, b1);
      i++;
      continue;
    }
    if (b1 < 194 || b1 > 244) {
      pushCodeUnit(parts, chunk, REPLACEMENT);
      i++;
      continue;
    }
    if (b1 <= 223) {
      if (i + 1 >= bytes.length) {
        pushCodeUnit(parts, chunk, REPLACEMENT);
        i++;
        continue;
      }
      const b22 = bytes[i + 1];
      if ((b22 & 192) !== 128) {
        pushCodeUnit(parts, chunk, REPLACEMENT);
        i++;
        continue;
      }
      const cp2 = (b1 & 31) << 6 | b22 & 63;
      pushCodeUnit(parts, chunk, cp2);
      i += 2;
      continue;
    }
    if (b1 <= 239) {
      if (i + 2 >= bytes.length) {
        pushCodeUnit(parts, chunk, REPLACEMENT);
        i++;
        continue;
      }
      const b22 = bytes[i + 1];
      const b32 = bytes[i + 2];
      const valid2 = (b22 & 192) === 128 && (b32 & 192) === 128 && !(b1 === 224 && b22 < 160) && // overlong
      !(b1 === 237 && b22 >= 160);
      if (!valid2) {
        pushCodeUnit(parts, chunk, REPLACEMENT);
        i++;
        continue;
      }
      const cp2 = (b1 & 15) << 12 | (b22 & 63) << 6 | b32 & 63;
      pushCodeUnit(parts, chunk, cp2);
      i += 3;
      continue;
    }
    if (i + 3 >= bytes.length) {
      pushCodeUnit(parts, chunk, REPLACEMENT);
      i++;
      continue;
    }
    const b2 = bytes[i + 1];
    const b3 = bytes[i + 2];
    const b4 = bytes[i + 3];
    const valid = (b2 & 192) === 128 && (b3 & 192) === 128 && (b4 & 192) === 128 && !(b1 === 240 && b2 < 144) && // overlong
    !(b1 === 244 && b2 > 143);
    if (!valid) {
      pushCodeUnit(parts, chunk, REPLACEMENT);
      i++;
      continue;
    }
    const cp = (b1 & 7) << 18 | (b2 & 63) << 12 | (b3 & 63) << 6 | b4 & 63;
    pushCodePoint(parts, chunk, cp);
    i += 4;
  }
  flushChunk(parts, chunk);
  return parts.join("");
}
function decodeUTF16LE(bytes) {
  const parts = [];
  const chunk = [];
  const len = bytes.length;
  let i = 0;
  while (i + 1 < len) {
    const u1 = bytes[i] | bytes[i + 1] << 8;
    i += 2;
    if (u1 >= 55296 && u1 <= 56319) {
      if (i + 1 < len) {
        const u2 = bytes[i] | bytes[i + 1] << 8;
        if (u2 >= 56320 && u2 <= 57343) {
          pushCodeUnit(parts, chunk, u1);
          pushCodeUnit(parts, chunk, u2);
          i += 2;
        } else {
          pushCodeUnit(parts, chunk, REPLACEMENT);
        }
      } else {
        pushCodeUnit(parts, chunk, REPLACEMENT);
      }
      continue;
    }
    if (u1 >= 56320 && u1 <= 57343) {
      pushCodeUnit(parts, chunk, REPLACEMENT);
      continue;
    }
    pushCodeUnit(parts, chunk, u1);
  }
  if (i < len) {
    pushCodeUnit(parts, chunk, REPLACEMENT);
  }
  flushChunk(parts, chunk);
  return parts.join("");
}
function decodeASCII(bytes) {
  const parts = [];
  for (let i = 0; i < bytes.length; i += CHUNK) {
    const end = Math.min(bytes.length, i + CHUNK);
    const codes = new Array(end - i);
    for (let j = i, k = 0; j < end; j++, k++) {
      codes[k] = bytes[j] & 127;
    }
    parts.push(String.fromCharCode.apply(null, codes));
  }
  return parts.join("");
}
function decodeLatin1(bytes) {
  const parts = [];
  for (let i = 0; i < bytes.length; i += CHUNK) {
    const end = Math.min(bytes.length, i + CHUNK);
    const codes = new Array(end - i);
    for (let j = i, k = 0; j < end; j++, k++) {
      codes[k] = bytes[j];
    }
    parts.push(String.fromCharCode.apply(null, codes));
  }
  return parts.join("");
}
function decodeWindows1252(bytes) {
  const parts = [];
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    const extra = b >= 128 && b <= 159 ? WINDOWS_1252_EXTRA[b] : void 0;
    out += extra !== null && extra !== void 0 ? extra : String.fromCharCode(b);
    if (out.length >= CHUNK) {
      parts.push(out);
      out = "";
    }
  }
  if (out)
    parts.push(out);
  return parts.join("");
}
function encodeUTF8(str) {
  const out = [];
  for (let i = 0; i < str.length; i++) {
    let cp = str.charCodeAt(i);
    if (cp >= 55296 && cp <= 56319) {
      if (i + 1 < str.length) {
        const lo = str.charCodeAt(i + 1);
        if (lo >= 56320 && lo <= 57343) {
          cp = 65536 + (cp - 55296 << 10) + (lo - 56320);
          i++;
        } else {
          cp = REPLACEMENT;
        }
      } else {
        cp = REPLACEMENT;
      }
    } else if (cp >= 56320 && cp <= 57343) {
      cp = REPLACEMENT;
    }
    if (cp < 128) {
      out.push(cp);
    } else if (cp < 2048) {
      out.push(192 | cp >> 6, 128 | cp & 63);
    } else if (cp < 65536) {
      out.push(224 | cp >> 12, 128 | cp >> 6 & 63, 128 | cp & 63);
    } else {
      out.push(240 | cp >> 18, 128 | cp >> 12 & 63, 128 | cp >> 6 & 63, 128 | cp & 63);
    }
  }
  return new Uint8Array(out);
}
function encodeUTF16LE(str) {
  const units = [];
  for (let i = 0; i < str.length; i++) {
    const u = str.charCodeAt(i);
    if (u >= 55296 && u <= 56319) {
      if (i + 1 < str.length) {
        const lo = str.charCodeAt(i + 1);
        if (lo >= 56320 && lo <= 57343) {
          units.push(u, lo);
          i++;
        } else {
          units.push(REPLACEMENT);
        }
      } else {
        units.push(REPLACEMENT);
      }
      continue;
    }
    if (u >= 56320 && u <= 57343) {
      units.push(REPLACEMENT);
      continue;
    }
    units.push(u);
  }
  const out = new Uint8Array(units.length * 2);
  for (let i = 0; i < units.length; i++) {
    const code = units[i];
    const o = i * 2;
    out[o] = code & 255;
    out[o + 1] = code >>> 8;
  }
  return out;
}
function encodeASCII(str) {
  const out = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++)
    out[i] = str.charCodeAt(i) & 127;
  return out;
}
function encodeLatin1(str) {
  const out = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++)
    out[i] = str.charCodeAt(i) & 255;
  return out;
}
function encodeWindows1252(str) {
  const out = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    const code = ch.charCodeAt(0);
    if (WINDOWS_1252_REVERSE[ch] !== void 0) {
      out[i] = WINDOWS_1252_REVERSE[ch];
      continue;
    }
    if (code >= 0 && code <= 127 || code >= 160 && code <= 255) {
      out[i] = code;
      continue;
    }
    out[i] = 63;
  }
  return out;
}
var WINDOWS_1252_EXTRA, WINDOWS_1252_REVERSE, _utf8Decoder, _utf8Encoder, CHUNK, REPLACEMENT;
var init_lib2 = __esm({
  "soda-player/node_modules/@borewit/text-codec/lib/index.js"() {
    WINDOWS_1252_EXTRA = {
      128: "\u20AC",
      130: "\u201A",
      131: "\u0192",
      132: "\u201E",
      133: "\u2026",
      134: "\u2020",
      135: "\u2021",
      136: "\u02C6",
      137: "\u2030",
      138: "\u0160",
      139: "\u2039",
      140: "\u0152",
      142: "\u017D",
      145: "\u2018",
      146: "\u2019",
      147: "\u201C",
      148: "\u201D",
      149: "\u2022",
      150: "\u2013",
      151: "\u2014",
      152: "\u02DC",
      153: "\u2122",
      154: "\u0161",
      155: "\u203A",
      156: "\u0153",
      158: "\u017E",
      159: "\u0178"
    };
    WINDOWS_1252_REVERSE = {};
    for (const [code, char] of Object.entries(WINDOWS_1252_EXTRA)) {
      WINDOWS_1252_REVERSE[char] = Number.parseInt(code, 10);
    }
    CHUNK = 32 * 1024;
    REPLACEMENT = 65533;
  }
});

// soda-player/node_modules/ieee754/index.js
var require_ieee754 = __commonJS({
  "soda-player/node_modules/ieee754/index.js"(exports2) {
    exports2.read = function(buffer, offset, isLE, mLen, nBytes) {
      var e, m;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var nBits = -7;
      var i = isLE ? nBytes - 1 : 0;
      var d = isLE ? -1 : 1;
      var s = buffer[offset + i];
      i += d;
      e = s & (1 << -nBits) - 1;
      s >>= -nBits;
      nBits += eLen;
      for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
      }
      m = e & (1 << -nBits) - 1;
      e >>= -nBits;
      nBits += mLen;
      for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
      }
      if (e === 0) {
        e = 1 - eBias;
      } else if (e === eMax) {
        return m ? NaN : (s ? -1 : 1) * Infinity;
      } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
    };
    exports2.write = function(buffer, value, offset, isLE, mLen, nBytes) {
      var e, m, c;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
      var i = isLE ? 0 : nBytes - 1;
      var d = isLE ? 1 : -1;
      var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
      value = Math.abs(value);
      if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
      } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--;
          c *= 2;
        }
        if (e + eBias >= 1) {
          value += rt / c;
        } else {
          value += rt * Math.pow(2, 1 - eBias);
        }
        if (value * c >= 2) {
          e++;
          c /= 2;
        }
        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * Math.pow(2, mLen);
          e = e + eBias;
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
          e = 0;
        }
      }
      for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
      }
      e = e << mLen | m;
      eLen += mLen;
      for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
      }
      buffer[offset + i - d] |= s * 128;
    };
  }
});

// soda-player/node_modules/token-types/lib/index.js
var lib_exports = {};
__export(lib_exports, {
  AnsiStringType: () => AnsiStringType,
  Float16_BE: () => Float16_BE,
  Float16_LE: () => Float16_LE,
  Float32_BE: () => Float32_BE,
  Float32_LE: () => Float32_LE,
  Float64_BE: () => Float64_BE,
  Float64_LE: () => Float64_LE,
  Float80_BE: () => Float80_BE,
  Float80_LE: () => Float80_LE,
  INT16_BE: () => INT16_BE,
  INT16_LE: () => INT16_LE,
  INT24_BE: () => INT24_BE,
  INT24_LE: () => INT24_LE,
  INT32_BE: () => INT32_BE,
  INT32_LE: () => INT32_LE,
  INT64_BE: () => INT64_BE,
  INT64_LE: () => INT64_LE,
  INT8: () => INT8,
  IgnoreType: () => IgnoreType,
  StringType: () => StringType,
  UINT16_BE: () => UINT16_BE,
  UINT16_LE: () => UINT16_LE,
  UINT24_BE: () => UINT24_BE,
  UINT24_LE: () => UINT24_LE,
  UINT32_BE: () => UINT32_BE,
  UINT32_LE: () => UINT32_LE,
  UINT64_BE: () => UINT64_BE,
  UINT64_LE: () => UINT64_LE,
  UINT8: () => UINT8,
  Uint8ArrayType: () => Uint8ArrayType
});
function dv(array) {
  return new DataView(array.buffer, array.byteOffset);
}
var ieee754, UINT8, UINT16_LE, UINT16_BE, UINT24_LE, UINT24_BE, UINT32_LE, UINT32_BE, INT8, INT16_BE, INT16_LE, INT24_LE, INT24_BE, INT32_BE, INT32_LE, UINT64_LE, INT64_LE, UINT64_BE, INT64_BE, Float16_BE, Float16_LE, Float32_BE, Float32_LE, Float64_BE, Float64_LE, Float80_BE, Float80_LE, IgnoreType, Uint8ArrayType, StringType, AnsiStringType;
var init_lib3 = __esm({
  "soda-player/node_modules/token-types/lib/index.js"() {
    ieee754 = __toESM(require_ieee754(), 1);
    init_lib2();
    UINT8 = {
      len: 1,
      get(array, offset) {
        return dv(array).getUint8(offset);
      },
      put(array, offset, value) {
        dv(array).setUint8(offset, value);
        return offset + 1;
      }
    };
    UINT16_LE = {
      len: 2,
      get(array, offset) {
        return dv(array).getUint16(offset, true);
      },
      put(array, offset, value) {
        dv(array).setUint16(offset, value, true);
        return offset + 2;
      }
    };
    UINT16_BE = {
      len: 2,
      get(array, offset) {
        return dv(array).getUint16(offset);
      },
      put(array, offset, value) {
        dv(array).setUint16(offset, value);
        return offset + 2;
      }
    };
    UINT24_LE = {
      len: 3,
      get(array, offset) {
        const dataView = dv(array);
        return dataView.getUint8(offset) + (dataView.getUint16(offset + 1, true) << 8);
      },
      put(array, offset, value) {
        const dataView = dv(array);
        dataView.setUint8(offset, value & 255);
        dataView.setUint16(offset + 1, value >> 8, true);
        return offset + 3;
      }
    };
    UINT24_BE = {
      len: 3,
      get(array, offset) {
        const dataView = dv(array);
        return (dataView.getUint16(offset) << 8) + dataView.getUint8(offset + 2);
      },
      put(array, offset, value) {
        const dataView = dv(array);
        dataView.setUint16(offset, value >> 8);
        dataView.setUint8(offset + 2, value & 255);
        return offset + 3;
      }
    };
    UINT32_LE = {
      len: 4,
      get(array, offset) {
        return dv(array).getUint32(offset, true);
      },
      put(array, offset, value) {
        dv(array).setUint32(offset, value, true);
        return offset + 4;
      }
    };
    UINT32_BE = {
      len: 4,
      get(array, offset) {
        return dv(array).getUint32(offset);
      },
      put(array, offset, value) {
        dv(array).setUint32(offset, value);
        return offset + 4;
      }
    };
    INT8 = {
      len: 1,
      get(array, offset) {
        return dv(array).getInt8(offset);
      },
      put(array, offset, value) {
        dv(array).setInt8(offset, value);
        return offset + 1;
      }
    };
    INT16_BE = {
      len: 2,
      get(array, offset) {
        return dv(array).getInt16(offset);
      },
      put(array, offset, value) {
        dv(array).setInt16(offset, value);
        return offset + 2;
      }
    };
    INT16_LE = {
      len: 2,
      get(array, offset) {
        return dv(array).getInt16(offset, true);
      },
      put(array, offset, value) {
        dv(array).setInt16(offset, value, true);
        return offset + 2;
      }
    };
    INT24_LE = {
      len: 3,
      get(array, offset) {
        const unsigned = UINT24_LE.get(array, offset);
        return unsigned > 8388607 ? unsigned - 16777216 : unsigned;
      },
      put(array, offset, value) {
        const dataView = dv(array);
        dataView.setUint8(offset, value & 255);
        dataView.setUint16(offset + 1, value >> 8, true);
        return offset + 3;
      }
    };
    INT24_BE = {
      len: 3,
      get(array, offset) {
        const unsigned = UINT24_BE.get(array, offset);
        return unsigned > 8388607 ? unsigned - 16777216 : unsigned;
      },
      put(array, offset, value) {
        const dataView = dv(array);
        dataView.setUint16(offset, value >> 8);
        dataView.setUint8(offset + 2, value & 255);
        return offset + 3;
      }
    };
    INT32_BE = {
      len: 4,
      get(array, offset) {
        return dv(array).getInt32(offset);
      },
      put(array, offset, value) {
        dv(array).setInt32(offset, value);
        return offset + 4;
      }
    };
    INT32_LE = {
      len: 4,
      get(array, offset) {
        return dv(array).getInt32(offset, true);
      },
      put(array, offset, value) {
        dv(array).setInt32(offset, value, true);
        return offset + 4;
      }
    };
    UINT64_LE = {
      len: 8,
      get(array, offset) {
        return dv(array).getBigUint64(offset, true);
      },
      put(array, offset, value) {
        dv(array).setBigUint64(offset, value, true);
        return offset + 8;
      }
    };
    INT64_LE = {
      len: 8,
      get(array, offset) {
        return dv(array).getBigInt64(offset, true);
      },
      put(array, offset, value) {
        dv(array).setBigInt64(offset, value, true);
        return offset + 8;
      }
    };
    UINT64_BE = {
      len: 8,
      get(array, offset) {
        return dv(array).getBigUint64(offset);
      },
      put(array, offset, value) {
        dv(array).setBigUint64(offset, value);
        return offset + 8;
      }
    };
    INT64_BE = {
      len: 8,
      get(array, offset) {
        return dv(array).getBigInt64(offset);
      },
      put(array, offset, value) {
        dv(array).setBigInt64(offset, value);
        return offset + 8;
      }
    };
    Float16_BE = {
      len: 2,
      get(dataView, offset) {
        return ieee754.read(dataView, offset, false, 10, this.len);
      },
      put(dataView, offset, value) {
        ieee754.write(dataView, value, offset, false, 10, this.len);
        return offset + this.len;
      }
    };
    Float16_LE = {
      len: 2,
      get(array, offset) {
        return ieee754.read(array, offset, true, 10, this.len);
      },
      put(array, offset, value) {
        ieee754.write(array, value, offset, true, 10, this.len);
        return offset + this.len;
      }
    };
    Float32_BE = {
      len: 4,
      get(array, offset) {
        return dv(array).getFloat32(offset);
      },
      put(array, offset, value) {
        dv(array).setFloat32(offset, value);
        return offset + 4;
      }
    };
    Float32_LE = {
      len: 4,
      get(array, offset) {
        return dv(array).getFloat32(offset, true);
      },
      put(array, offset, value) {
        dv(array).setFloat32(offset, value, true);
        return offset + 4;
      }
    };
    Float64_BE = {
      len: 8,
      get(array, offset) {
        return dv(array).getFloat64(offset);
      },
      put(array, offset, value) {
        dv(array).setFloat64(offset, value);
        return offset + 8;
      }
    };
    Float64_LE = {
      len: 8,
      get(array, offset) {
        return dv(array).getFloat64(offset, true);
      },
      put(array, offset, value) {
        dv(array).setFloat64(offset, value, true);
        return offset + 8;
      }
    };
    Float80_BE = {
      len: 10,
      get(array, offset) {
        return ieee754.read(array, offset, false, 63, this.len);
      },
      put(array, offset, value) {
        ieee754.write(array, value, offset, false, 63, this.len);
        return offset + this.len;
      }
    };
    Float80_LE = {
      len: 10,
      get(array, offset) {
        return ieee754.read(array, offset, true, 63, this.len);
      },
      put(array, offset, value) {
        ieee754.write(array, value, offset, true, 63, this.len);
        return offset + this.len;
      }
    };
    IgnoreType = class {
      /**
       * @param len number of bytes to ignore
       */
      constructor(len) {
        this.len = len;
      }
      // ToDo: don't read, but skip data
      get(_array, _off) {
      }
    };
    Uint8ArrayType = class {
      constructor(len) {
        this.len = len;
      }
      get(array, offset) {
        return array.subarray(offset, offset + this.len);
      }
    };
    StringType = class {
      constructor(len, encoding) {
        this.len = len;
        this.encoding = encoding;
      }
      get(data, offset = 0) {
        const bytes = data.subarray(offset, offset + this.len);
        return textDecode(bytes, this.encoding);
      }
    };
    AnsiStringType = class extends StringType {
      constructor(len) {
        super(len, "windows-1252");
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/common/BasicParser.js
var BasicParser;
var init_BasicParser = __esm({
  "soda-player/node_modules/music-metadata/lib/common/BasicParser.js"() {
    BasicParser = class {
      metadata;
      tokenizer;
      options;
      /**
       * Initialize parser with output (metadata), input (tokenizer) & parsing options (options).
       * @param {INativeMetadataCollector} metadata Output
       * @param {ITokenizer} tokenizer Input
       * @param {IOptions} options Parsing options
       */
      constructor(metadata, tokenizer, options) {
        this.metadata = metadata;
        this.tokenizer = tokenizer;
        this.options = options;
      }
    };
  }
});

// soda-player/node_modules/uint8array-extras/index.js
function isType(value, typeConstructor, typeStringified) {
  if (!value) {
    return false;
  }
  if (value.constructor === typeConstructor) {
    return true;
  }
  return objectToString.call(value) === typeStringified;
}
function isUint8Array(value) {
  return isType(value, Uint8Array, uint8ArrayStringified);
}
function isArrayBuffer(value) {
  return isType(value, ArrayBuffer, arrayBufferStringified);
}
function isUint8ArrayOrArrayBuffer(value) {
  return isUint8Array(value) || isArrayBuffer(value);
}
function toUint8ArrayIfArrayBuffer(value) {
  return isArrayBuffer(value) ? new Uint8Array(value) : value;
}
function assertUint8ArrayOrArrayBuffer(value) {
  if (!isUint8ArrayOrArrayBuffer(value)) {
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof value}\``);
  }
}
function concatUint8Arrays(arrays, totalLength) {
  if (arrays.length === 0) {
    return new Uint8Array(0);
  }
  totalLength ??= arrays.reduce((accumulator, currentValue) => accumulator + currentValue.byteLength, 0);
  const returnValue = new Uint8Array(totalLength);
  let offset = 0;
  for (let array of arrays) {
    assertUint8ArrayOrArrayBuffer(array);
    array = toUint8ArrayIfArrayBuffer(array);
    returnValue.set(array, offset);
    offset += array.length;
  }
  return returnValue;
}
function uint8ArrayToHex(array) {
  assertUint8ArrayOrArrayBuffer(array);
  array = toUint8ArrayIfArrayBuffer(array);
  let hexString = "";
  for (let index = 0; index < array.length; index++) {
    hexString += byteToHexLookupTable[array[index]];
  }
  return hexString;
}
function getUintBE(view) {
  const { byteLength } = view;
  if (byteLength === 6) {
    return view.getUint16(0) * 2 ** 32 + view.getUint32(2);
  }
  if (byteLength === 5) {
    return view.getUint8(0) * 2 ** 32 + view.getUint32(1);
  }
  if (byteLength === 4) {
    return view.getUint32(0);
  }
  if (byteLength === 3) {
    return view.getUint8(0) * 2 ** 16 + view.getUint16(1);
  }
  if (byteLength === 2) {
    return view.getUint16(0);
  }
  if (byteLength === 1) {
    return view.getUint8(0);
  }
}
var objectToString, uint8ArrayStringified, arrayBufferStringified, cachedDecoders, cachedEncoder, byteToHexLookupTable;
var init_uint8array_extras = __esm({
  "soda-player/node_modules/uint8array-extras/index.js"() {
    objectToString = Object.prototype.toString;
    uint8ArrayStringified = "[object Uint8Array]";
    arrayBufferStringified = "[object ArrayBuffer]";
    cachedDecoders = {
      utf8: new globalThis.TextDecoder("utf8")
    };
    cachedEncoder = new globalThis.TextEncoder();
    byteToHexLookupTable = Array.from({ length: 256 }, (_, index) => index.toString(16).padStart(2, "0"));
  }
});

// soda-player/node_modules/music-metadata/lib/ParseError.js
var makeParseError, CouldNotDetermineFileTypeError, UnsupportedFileTypeError, UnexpectedFileContentError, FieldDecodingError, InternalParserError, makeUnexpectedFileContentError;
var init_ParseError = __esm({
  "soda-player/node_modules/music-metadata/lib/ParseError.js"() {
    makeParseError = (name) => {
      return class ParseError extends Error {
        name;
        constructor(message) {
          super(message);
          this.name = name;
        }
      };
    };
    CouldNotDetermineFileTypeError = class extends makeParseError("CouldNotDetermineFileTypeError") {
    };
    UnsupportedFileTypeError = class extends makeParseError("UnsupportedFileTypeError") {
    };
    UnexpectedFileContentError = class extends makeParseError("UnexpectedFileContentError") {
      fileType;
      constructor(fileType, message) {
        super(message);
        this.fileType = fileType;
      }
      // Override toString to include file type information.
      toString() {
        return `${this.name} (FileType: ${this.fileType}): ${this.message}`;
      }
    };
    FieldDecodingError = class extends makeParseError("FieldDecodingError") {
    };
    InternalParserError = class extends makeParseError("InternalParserError") {
    };
    makeUnexpectedFileContentError = (fileType) => {
      return class extends UnexpectedFileContentError {
        constructor(message) {
          super(fileType, message);
        }
      };
    };
  }
});

// soda-player/node_modules/music-metadata/lib/common/Util.js
function getBit(buf, off, bit) {
  return (buf[off] & 1 << bit) !== 0;
}
function findZero(uint8Array, encoding) {
  const len = uint8Array.length;
  if (encoding === "utf-16le" || encoding === "utf-16be") {
    for (let i = 0; i + 1 < len; i += 2) {
      if (uint8Array[i] === 0 && uint8Array[i + 1] === 0) {
        return i;
      }
    }
    return len;
  }
  for (let i = 0; i < len; i++) {
    if (uint8Array[i] === 0) {
      return i;
    }
  }
  return len;
}
function trimRightNull(x) {
  const pos0 = x.indexOf("\0");
  return pos0 === -1 ? x : x.substring(0, pos0);
}
function swapBytes(uint8Array) {
  const l = uint8Array.length;
  if ((l & 1) !== 0) {
    throw new FieldDecodingError("Buffer length must be even");
  }
  for (let i = 0; i < l; i += 2) {
    const a = uint8Array[i];
    uint8Array[i] = uint8Array[i + 1];
    uint8Array[i + 1] = a;
  }
  return uint8Array;
}
function decodeString(uint8Array, encoding) {
  if (uint8Array[0] === 255 && uint8Array[1] === 254) {
    return decodeString(uint8Array.subarray(2), encoding);
  }
  if (encoding === "utf-16le" && uint8Array[0] === 254 && uint8Array[1] === 255) {
    if ((uint8Array.length & 1) !== 0) {
      throw new FieldDecodingError("Expected even number of octets for 16-bit unicode string");
    }
    return decodeString(swapBytes(uint8Array), encoding);
  }
  if (encoding === "utf-16be") {
    if ((uint8Array.length & 1) !== 0) {
      throw new FieldDecodingError("Expected even number of octets for 16-bit unicode string");
    }
    return new StringType(uint8Array.length, "utf-16le").get(swapBytes(Uint8Array.from(uint8Array)), 0);
  }
  return new StringType(uint8Array.length, encoding).get(uint8Array, 0);
}
function stripNulls(str) {
  str = str.replace(/^\x00+/g, "");
  str = str.replace(/\x00+$/g, "");
  return str;
}
function getBitAllignedNumber(source, byteOffset, bitOffset, len) {
  const byteOff = byteOffset + ~~(bitOffset / 8);
  const bitOff = bitOffset % 8;
  let value = source[byteOff];
  value &= 255 >> bitOff;
  const bitsRead = 8 - bitOff;
  const bitsLeft = len - bitsRead;
  if (bitsLeft < 0) {
    value >>= 8 - bitOff - len;
  } else if (bitsLeft > 0) {
    value <<= bitsLeft;
    value |= getBitAllignedNumber(source, byteOffset, bitOffset + bitsRead, bitsLeft);
  }
  return value;
}
function isBitSet(source, byteOffset, bitOffset) {
  return getBitAllignedNumber(source, byteOffset, bitOffset, 1) === 1;
}
function a2hex(str) {
  const arr = [];
  for (let i = 0, l = str.length; i < l; i++) {
    const hex = Number(str.charCodeAt(i)).toString(16);
    arr.push(hex.length === 1 ? `0${hex}` : hex);
  }
  return arr.join(" ");
}
function ratioToDb(ratio) {
  return 10 * Math.log10(ratio);
}
function dbToRatio(dB) {
  return 10 ** (dB / 10);
}
function toRatio(value) {
  const ps = value.split(" ").map((p) => p.trim().toLowerCase());
  if (ps.length >= 1) {
    const v = Number.parseFloat(ps[0]);
    return ps.length === 2 && ps[1] === "db" ? {
      dB: v,
      ratio: dbToRatio(v)
    } : {
      dB: ratioToDb(v),
      ratio: v
    };
  }
}
function decodeUintBE(uint8Array) {
  if (uint8Array.length === 0) {
    throw new Error("decodeUintBE: empty Uint8Array");
  }
  const view = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
  return getUintBE(view);
}
var init_Util = __esm({
  "soda-player/node_modules/music-metadata/lib/common/Util.js"() {
    init_lib3();
    init_uint8array_extras();
    init_ParseError();
  }
});

// soda-player/node_modules/music-metadata/lib/common/FourCC.js
var validFourCC, FourCcToken;
var init_FourCC = __esm({
  "soda-player/node_modules/music-metadata/lib/common/FourCC.js"() {
    init_lib2();
    init_ParseError();
    init_Util();
    validFourCC = /^[\x21-\x7e©][\x20-\x7e\x00()]{3}/;
    FourCcToken = {
      len: 4,
      get: (buf, off) => {
        const id = textDecode(buf.subarray(off, off + FourCcToken.len), "latin1");
        if (!id.match(validFourCC)) {
          throw new FieldDecodingError(`FourCC contains invalid characters: ${a2hex(id)} "${id}"`);
        }
        return id;
      },
      put: (buffer, offset, id) => {
        const str = textEncode(id, "latin1");
        if (str.length !== 4) {
          throw new InternalParserError("Invalid length");
        }
        buffer.set(str, offset);
        return offset + 4;
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/apev2/APEv2Token.js
function parseTagFlags(flags) {
  return {
    containsHeader: isBitSet2(flags, 31),
    containsFooter: isBitSet2(flags, 30),
    isHeader: isBitSet2(flags, 29),
    readOnly: isBitSet2(flags, 0),
    dataType: (flags & 6) >> 1
  };
}
function isBitSet2(num, bit) {
  return (num & 1 << bit) !== 0;
}
var DataType, DescriptorParser, Header, TagFooter, TagItemHeader;
var init_APEv2Token = __esm({
  "soda-player/node_modules/music-metadata/lib/apev2/APEv2Token.js"() {
    init_lib3();
    init_FourCC();
    DataType = {
      text_utf8: 0,
      binary: 1,
      external_info: 2,
      reserved: 3
    };
    DescriptorParser = {
      len: 52,
      get: (buf, off) => {
        return {
          // should equal 'MAC '
          ID: FourCcToken.get(buf, off),
          // versionIndex number * 1000 (3.81 = 3810) (remember that 4-byte alignment causes this to take 4-bytes)
          version: UINT32_LE.get(buf, off + 4) / 1e3,
          // the number of descriptor bytes (allows later expansion of this header)
          descriptorBytes: UINT32_LE.get(buf, off + 8),
          // the number of header APE_HEADER bytes
          headerBytes: UINT32_LE.get(buf, off + 12),
          // the number of header APE_HEADER bytes
          seekTableBytes: UINT32_LE.get(buf, off + 16),
          // the number of header data bytes (from original file)
          headerDataBytes: UINT32_LE.get(buf, off + 20),
          // the number of bytes of APE frame data
          apeFrameDataBytes: UINT32_LE.get(buf, off + 24),
          // the high order number of APE frame data bytes
          apeFrameDataBytesHigh: UINT32_LE.get(buf, off + 28),
          // the terminating data of the file (not including tag data)
          terminatingDataBytes: UINT32_LE.get(buf, off + 32),
          // the MD5 hash of the file (see notes for usage... it's a little tricky)
          fileMD5: new Uint8ArrayType(16).get(buf, off + 36)
        };
      }
    };
    Header = {
      len: 24,
      get: (buf, off) => {
        return {
          // the compression level (see defines I.E. COMPRESSION_LEVEL_FAST)
          compressionLevel: UINT16_LE.get(buf, off),
          // any format flags (for future use)
          formatFlags: UINT16_LE.get(buf, off + 2),
          // the number of audio blocks in one frame
          blocksPerFrame: UINT32_LE.get(buf, off + 4),
          // the number of audio blocks in the final frame
          finalFrameBlocks: UINT32_LE.get(buf, off + 8),
          // the total number of frames
          totalFrames: UINT32_LE.get(buf, off + 12),
          // the bits per sample (typically 16)
          bitsPerSample: UINT16_LE.get(buf, off + 16),
          // the number of channels (1 or 2)
          channel: UINT16_LE.get(buf, off + 18),
          // the sample rate (typically 44100)
          sampleRate: UINT32_LE.get(buf, off + 20)
        };
      }
    };
    TagFooter = {
      len: 32,
      get: (buf, off) => {
        return {
          // should equal 'APETAGEX'
          ID: new StringType(8, "ascii").get(buf, off),
          // equals CURRENT_APE_TAG_VERSION
          version: UINT32_LE.get(buf, off + 8),
          // the complete size of the tag, including this footer (excludes header)
          size: UINT32_LE.get(buf, off + 12),
          // the number of fields in the tag
          fields: UINT32_LE.get(buf, off + 16),
          // reserved for later use (must be zero),
          flags: parseTagFlags(UINT32_LE.get(buf, off + 20))
        };
      }
    };
    TagItemHeader = {
      len: 8,
      get: (buf, off) => {
        return {
          // Length of assigned value in bytes
          size: UINT32_LE.get(buf, off),
          // reserved for later use (must be zero),
          flags: parseTagFlags(UINT32_LE.get(buf, off + 4))
        };
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/apev2/APEv2Parser.js
var APEv2Parser_exports = {};
__export(APEv2Parser_exports, {
  APEv2Parser: () => APEv2Parser,
  ApeContentError: () => ApeContentError,
  tryParseApeHeader: () => tryParseApeHeader
});
function tryParseApeHeader(metadata, tokenizer, options) {
  const apeParser = new APEv2Parser(metadata, tokenizer, options);
  return apeParser.tryParseApeHeader();
}
var import_debug, debug, tagFormat, preamble, ApeContentError, APEv2Parser;
var init_APEv2Parser = __esm({
  "soda-player/node_modules/music-metadata/lib/apev2/APEv2Parser.js"() {
    init_lib2();
    import_debug = __toESM(require_src(), 1);
    init_lib();
    init_lib3();
    init_BasicParser();
    init_Util();
    init_ParseError();
    init_APEv2Token();
    debug = (0, import_debug.default)("music-metadata:parser:APEv2");
    tagFormat = "APEv2";
    preamble = "APETAGEX";
    ApeContentError = class extends makeUnexpectedFileContentError("APEv2") {
    };
    APEv2Parser = class _APEv2Parser extends BasicParser {
      /**
       * Calculate the media file duration
       * @param ah ApeHeader
       * @return {number} duration in seconds
       */
      static calculateDuration(ah) {
        let duration = ah.totalFrames > 1 ? ah.blocksPerFrame * (ah.totalFrames - 1) : 0;
        duration += ah.finalFrameBlocks;
        return duration / ah.sampleRate;
      }
      /**
       * Calculates the APEv1 / APEv2 first field offset
       * @param tokenizer
       * @param offset
       */
      static async findApeFooterOffset(tokenizer, offset) {
        const apeBuf = new Uint8Array(TagFooter.len);
        const position = tokenizer.position;
        if (offset <= TagFooter.len) {
          debug(`Offset is too small to read APE footer: offset=${offset}`);
          return void 0;
        }
        if (offset > TagFooter.len) {
          await tokenizer.readBuffer(apeBuf, { position: offset - TagFooter.len });
          tokenizer.setPosition(position);
          const tagFooter = TagFooter.get(apeBuf, 0);
          if (tagFooter.ID === "APETAGEX") {
            if (tagFooter.flags.isHeader) {
              debug(`APE Header found at offset=${offset - TagFooter.len}`);
            } else {
              debug(`APE Footer found at offset=${offset - TagFooter.len}`);
              offset -= tagFooter.size;
            }
            return { footer: tagFooter, offset };
          }
        }
      }
      static parseTagFooter(metadata, buffer, options) {
        const footer = TagFooter.get(buffer, buffer.length - TagFooter.len);
        if (footer.ID !== preamble) {
          throw new ApeContentError("Unexpected APEv2 Footer ID preamble value");
        }
        fromBuffer(buffer);
        const apeParser = new _APEv2Parser(metadata, fromBuffer(buffer), options);
        return apeParser.parseTags(footer);
      }
      ape = {};
      /**
       * Parse APEv1 / APEv2 header if header signature found
       */
      async tryParseApeHeader() {
        if (this.tokenizer.fileInfo.size && this.tokenizer.fileInfo.size - this.tokenizer.position < TagFooter.len) {
          debug("No APEv2 header found, end-of-file reached");
          return;
        }
        const footer = await this.tokenizer.peekToken(TagFooter);
        if (footer.ID === preamble) {
          await this.tokenizer.ignore(TagFooter.len);
          return this.parseTags(footer);
        }
        debug(`APEv2 header not found at offset=${this.tokenizer.position}`);
        if (this.tokenizer.fileInfo.size) {
          const remaining = this.tokenizer.fileInfo.size - this.tokenizer.position;
          const buffer = new Uint8Array(remaining);
          await this.tokenizer.readBuffer(buffer);
          return _APEv2Parser.parseTagFooter(this.metadata, buffer, this.options);
        }
      }
      async parse() {
        const descriptor = await this.tokenizer.readToken(DescriptorParser);
        if (descriptor.ID !== "MAC ") {
          throw new ApeContentError("Unexpected descriptor ID");
        }
        this.ape.descriptor = descriptor;
        const lenExp = descriptor.descriptorBytes - DescriptorParser.len;
        const header = await (lenExp > 0 ? this.parseDescriptorExpansion(lenExp) : this.parseHeader());
        this.metadata.setAudioOnly();
        await this.tokenizer.ignore(header.forwardBytes);
        return this.tryParseApeHeader();
      }
      async parseTags(footer) {
        const keyBuffer = new Uint8Array(256);
        let bytesRemaining = footer.size - TagFooter.len;
        debug(`Parse APE tags at offset=${this.tokenizer.position}, size=${bytesRemaining}`);
        for (let i = 0; i < footer.fields; i++) {
          if (bytesRemaining < TagItemHeader.len) {
            this.metadata.addWarning(`APEv2 Tag-header: ${footer.fields - i} items remaining, but no more tag data to read.`);
            break;
          }
          const tagItemHeader = await this.tokenizer.readToken(TagItemHeader);
          bytesRemaining -= TagItemHeader.len;
          if (tagItemHeader.size >= bytesRemaining) {
            throw new ApeContentError(`Invalid tag item size: ${tagItemHeader.size}`);
          }
          const keyBytes = await this.tokenizer.peekBuffer(keyBuffer, {
            length: Math.min(keyBuffer.length, bytesRemaining - tagItemHeader.size),
            mayBeLess: true
          });
          let zero = keyBuffer.subarray(0, keyBytes).indexOf(0);
          if (zero === -1) {
            throw new ApeContentError("Unterminated tag item key");
          }
          const key = await this.tokenizer.readToken(new StringType(zero, "ascii"));
          await this.tokenizer.ignore(1);
          bytesRemaining -= key.length + 1;
          if (this.tokenizer.fileInfo.size !== void 0 && tagItemHeader.size > this.tokenizer.fileInfo.size - this.tokenizer.position) {
            throw new ApeContentError(`Invalid tag item size: ${tagItemHeader.size}`);
          }
          bytesRemaining -= tagItemHeader.size;
          switch (tagItemHeader.flags.dataType) {
            case DataType.text_utf8: {
              const value = textDecode(await this.readTagValue(tagItemHeader.size), "utf-8");
              const values = value.split(/\x00/g);
              await Promise.all(values.map((val) => this.metadata.addTag(tagFormat, key, val)));
              break;
            }
            case DataType.binary:
              if (this.options.skipCovers) {
                await this.tokenizer.ignore(tagItemHeader.size);
              } else {
                const picData = await this.readTagValue(tagItemHeader.size);
                zero = findZero(picData);
                const description = textDecode(picData.subarray(0, zero), "utf-8");
                const data = picData.subarray(zero + 1);
                await this.metadata.addTag(tagFormat, key, {
                  description,
                  data
                });
              }
              break;
            case DataType.external_info:
              debug(`Ignore external info ${key}`);
              await this.tokenizer.ignore(tagItemHeader.size);
              break;
            case DataType.reserved:
              debug(`Ignore external info ${key}`);
              this.metadata.addWarning(`APEv2 header declares a reserved datatype for "${key}"`);
              await this.tokenizer.ignore(tagItemHeader.size);
              break;
          }
        }
      }
      async readTagValue(size) {
        const chunkSize = 64 * 1024;
        if ((!this.tokenizer.supportsRandomAccess() || this.tokenizer.fileInfo.size === void 0) && size > chunkSize) {
          const chunks = [];
          for (let remaining = size; remaining > 0; ) {
            const chunk = new Uint8Array(Math.min(remaining, chunkSize));
            await this.tokenizer.readBuffer(chunk);
            chunks.push(chunk);
            remaining -= chunk.length;
          }
          const value2 = new Uint8Array(size);
          let offset = 0;
          for (const chunk of chunks) {
            value2.set(chunk, offset);
            offset += chunk.length;
          }
          return value2;
        }
        const value = new Uint8Array(size);
        await this.tokenizer.readBuffer(value);
        return value;
      }
      async parseDescriptorExpansion(lenExp) {
        await this.tokenizer.ignore(lenExp);
        return this.parseHeader();
      }
      async parseHeader() {
        const header = await this.tokenizer.readToken(Header);
        this.metadata.setFormat("lossless", true);
        this.metadata.setFormat("container", "Monkey's Audio");
        this.metadata.setFormat("bitsPerSample", header.bitsPerSample);
        this.metadata.setFormat("sampleRate", header.sampleRate);
        this.metadata.setFormat("numberOfChannels", header.channel);
        this.metadata.setFormat("duration", _APEv2Parser.calculateDuration(header));
        if (!this.ape.descriptor) {
          throw new ApeContentError("Missing APE descriptor");
        }
        return {
          forwardBytes: this.ape.descriptor.seekTableBytes + this.ape.descriptor.headerDataBytes + this.ape.descriptor.apeFrameDataBytes + this.ape.descriptor.terminatingDataBytes
        };
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/id3v1/ID3v1Parser.js
async function hasID3v1Header(tokenizer) {
  if (tokenizer.fileInfo.size >= 128) {
    const tag = new Uint8Array(3);
    const position = tokenizer.position;
    await tokenizer.readBuffer(tag, { position: tokenizer.fileInfo.size - 128 });
    tokenizer.setPosition(position);
    return textDecode(tag, "latin1") === "TAG";
  }
  return false;
}
var import_debug2, debug2, Genres, Iid3v1Token, Id3v1StringType, ID3v1Parser;
var init_ID3v1Parser = __esm({
  "soda-player/node_modules/music-metadata/lib/id3v1/ID3v1Parser.js"() {
    init_lib2();
    import_debug2 = __toESM(require_src(), 1);
    init_lib3();
    init_APEv2Parser();
    init_BasicParser();
    init_Util();
    debug2 = (0, import_debug2.default)("music-metadata:parser:ID3v1");
    Genres = [
      "Blues",
      "Classic Rock",
      "Country",
      "Dance",
      "Disco",
      "Funk",
      "Grunge",
      "Hip-Hop",
      "Jazz",
      "Metal",
      "New Age",
      "Oldies",
      "Other",
      "Pop",
      "R&B",
      "Rap",
      "Reggae",
      "Rock",
      "Techno",
      "Industrial",
      "Alternative",
      "Ska",
      "Death Metal",
      "Pranks",
      "Soundtrack",
      "Euro-Techno",
      "Ambient",
      "Trip-Hop",
      "Vocal",
      "Jazz+Funk",
      "Fusion",
      "Trance",
      "Classical",
      "Instrumental",
      "Acid",
      "House",
      "Game",
      "Sound Clip",
      "Gospel",
      "Noise",
      "Alt. Rock",
      "Bass",
      "Soul",
      "Punk",
      "Space",
      "Meditative",
      "Instrumental Pop",
      "Instrumental Rock",
      "Ethnic",
      "Gothic",
      "Darkwave",
      "Techno-Industrial",
      "Electronic",
      "Pop-Folk",
      "Eurodance",
      "Dream",
      "Southern Rock",
      "Comedy",
      "Cult",
      "Gangsta Rap",
      "Top 40",
      "Christian Rap",
      "Pop/Funk",
      "Jungle",
      "Native American",
      "Cabaret",
      "New Wave",
      "Psychedelic",
      "Rave",
      "Showtunes",
      "Trailer",
      "Lo-Fi",
      "Tribal",
      "Acid Punk",
      "Acid Jazz",
      "Polka",
      "Retro",
      "Musical",
      "Rock & Roll",
      "Hard Rock",
      "Folk",
      "Folk/Rock",
      "National Folk",
      "Swing",
      "Fast-Fusion",
      "Bebob",
      "Latin",
      "Revival",
      "Celtic",
      "Bluegrass",
      "Avantgarde",
      "Gothic Rock",
      "Progressive Rock",
      "Psychedelic Rock",
      "Symphonic Rock",
      "Slow Rock",
      "Big Band",
      "Chorus",
      "Easy Listening",
      "Acoustic",
      "Humour",
      "Speech",
      "Chanson",
      "Opera",
      "Chamber Music",
      "Sonata",
      "Symphony",
      "Booty Bass",
      "Primus",
      "Porn Groove",
      "Satire",
      "Slow Jam",
      "Club",
      "Tango",
      "Samba",
      "Folklore",
      "Ballad",
      "Power Ballad",
      "Rhythmic Soul",
      "Freestyle",
      "Duet",
      "Punk Rock",
      "Drum Solo",
      "A Cappella",
      "Euro-House",
      "Dance Hall",
      "Goa",
      "Drum & Bass",
      "Club-House",
      "Hardcore",
      "Terror",
      "Indie",
      "BritPop",
      "Negerpunk",
      "Polsk Punk",
      "Beat",
      "Christian Gangsta Rap",
      "Heavy Metal",
      "Black Metal",
      "Crossover",
      "Contemporary Christian",
      "Christian Rock",
      "Merengue",
      "Salsa",
      "Thrash Metal",
      "Anime",
      "JPop",
      "Synthpop",
      "Abstract",
      "Art Rock",
      "Baroque",
      "Bhangra",
      "Big Beat",
      "Breakbeat",
      "Chillout",
      "Downtempo",
      "Dub",
      "EBM",
      "Eclectic",
      "Electro",
      "Electroclash",
      "Emo",
      "Experimental",
      "Garage",
      "Global",
      "IDM",
      "Illbient",
      "Industro-Goth",
      "Jam Band",
      "Krautrock",
      "Leftfield",
      "Lounge",
      "Math Rock",
      "New Romantic",
      "Nu-Breakz",
      "Post-Punk",
      "Post-Rock",
      "Psytrance",
      "Shoegaze",
      "Space Rock",
      "Trop Rock",
      "World Music",
      "Neoclassical",
      "Audiobook",
      "Audio Theatre",
      "Neue Deutsche Welle",
      "Podcast",
      "Indie Rock",
      "G-Funk",
      "Dubstep",
      "Garage Rock",
      "Psybient"
    ];
    Iid3v1Token = {
      len: 128,
      /**
       * @param buf Buffer possibly holding the 128-byte ID3v1/1.1 metadata header
       * @param off Offset in buffer in bytes
       * @returns ID3v1/1.1 header if the first 3 bytes equal 'TAG', otherwise null is returned
       */
      get: (buf, off) => {
        const header = new Id3v1StringType(3).get(buf, off);
        if (header !== "TAG") {
          return null;
        }
        const zeroByte = UINT8.get(buf, off + 125);
        const track = UINT8.get(buf, off + 126);
        const hasTrack = zeroByte === 0 && track !== 0;
        return {
          header,
          title: new Id3v1StringType(30).get(buf, off + 3),
          artist: new Id3v1StringType(30).get(buf, off + 33),
          album: new Id3v1StringType(30).get(buf, off + 63),
          year: new Id3v1StringType(4).get(buf, off + 93),
          comment: new Id3v1StringType(hasTrack ? 28 : 30).get(buf, off + 97),
          track: hasTrack ? track : void 0,
          genre: UINT8.get(buf, off + 127)
        };
      }
    };
    Id3v1StringType = class {
      len;
      stringType;
      constructor(len) {
        this.len = len;
        this.stringType = new StringType(len, "latin1");
      }
      get(buf, off) {
        let value = this.stringType.get(buf, off);
        value = trimRightNull(value);
        value = value.trim();
        return value.length > 0 ? value : void 0;
      }
    };
    ID3v1Parser = class _ID3v1Parser extends BasicParser {
      apeHeader;
      constructor(metadata, tokenizer, options) {
        super(metadata, tokenizer, options);
        this.apeHeader = options.apeHeader;
      }
      static getGenre(genreIndex) {
        if (genreIndex < Genres.length) {
          return Genres[genreIndex];
        }
        return void 0;
      }
      async parse() {
        if (!this.tokenizer.fileInfo.size) {
          debug2("Skip checking for ID3v1 because the file-size is unknown");
          return;
        }
        if (this.apeHeader && this.tokenizer.supportsRandomAccess()) {
          this.tokenizer.setPosition(this.apeHeader.offset);
          const apeParser = new APEv2Parser(this.metadata, this.tokenizer, this.options);
          await apeParser.parseTags(this.apeHeader.footer);
        }
        const offset = this.tokenizer.fileInfo.size - Iid3v1Token.len;
        if (this.tokenizer.position > offset) {
          debug2("Already consumed the last 128 bytes");
          return;
        }
        const header = await this.tokenizer.readToken(Iid3v1Token, offset);
        if (header) {
          debug2("ID3v1 header found at: pos=%s", this.tokenizer.fileInfo.size - Iid3v1Token.len);
          const props = ["title", "artist", "album", "comment", "track", "year"];
          for (const id of props) {
            if (header[id] && header[id] !== "") {
              await this.addTag(id, header[id]);
            }
          }
          const genre = _ID3v1Parser.getGenre(header.genre);
          if (genre) {
            await this.addTag("genre", genre);
          }
        } else {
          debug2("ID3v1 header not found at: pos=%s", this.tokenizer.fileInfo.size - Iid3v1Token.len);
        }
      }
      async addTag(id, value) {
        await this.metadata.addTag("ID3v1", id, value);
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/id3v2/ID3v2ChapterToken.js
var ChapterInfo;
var init_ID3v2ChapterToken = __esm({
  "soda-player/node_modules/music-metadata/lib/id3v2/ID3v2ChapterToken.js"() {
    init_lib3();
    ChapterInfo = {
      len: 16,
      get: (buf, off) => {
        const startOffset = UINT32_BE.get(buf, off + 8);
        const endOffset = UINT32_BE.get(buf, off + 12);
        return {
          startTime: UINT32_BE.get(buf, off),
          endTime: UINT32_BE.get(buf, off + 4),
          startOffset: startOffset === 4294967295 ? void 0 : startOffset,
          endOffset: endOffset === 4294967295 ? void 0 : endOffset
        };
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/id3v2/ID3v2Token.js
var AttachedPictureType, LyricsContentType, TimestampFormat, UINT32SYNCSAFE, ID3v2Header, ExtendedHeader, TextEncodingToken, TextHeader, SyncTextHeader;
var init_ID3v2Token = __esm({
  "soda-player/node_modules/music-metadata/lib/id3v2/ID3v2Token.js"() {
    init_lib3();
    init_Util();
    AttachedPictureType = {
      0: "Other",
      1: "32x32 pixels 'file icon' (PNG only)",
      2: "Other file icon",
      3: "Cover (front)",
      4: "Cover (back)",
      5: "Leaflet page",
      6: "Media (e.g. label side of CD)",
      7: "Lead artist/lead performer/soloist",
      8: "Artist/performer",
      9: "Conductor",
      10: "Band/Orchestra",
      11: "Composer",
      12: "Lyricist/text writer",
      13: "Recording Location",
      14: "During recording",
      15: "During performance",
      16: "Movie/video screen capture",
      17: "A bright coloured fish",
      18: "Illustration",
      19: "Band/artist logotype",
      20: "Publisher/Studio logotype"
    };
    LyricsContentType = {
      other: 0,
      lyrics: 1,
      text: 2,
      movement_part: 3,
      events: 4,
      chord: 5,
      trivia_pop: 6
    };
    TimestampFormat = {
      notSynchronized: 0,
      mpegFrameNumber: 1,
      milliseconds: 2
    };
    UINT32SYNCSAFE = {
      get: (buf, off) => {
        return buf[off + 3] & 127 | buf[off + 2] << 7 | buf[off + 1] << 14 | buf[off] << 21;
      },
      len: 4
    };
    ID3v2Header = {
      len: 10,
      get: (buf, off) => {
        return {
          // ID3v2/file identifier   "ID3"
          fileIdentifier: new StringType(3, "ascii").get(buf, off),
          // ID3v2 versionIndex
          version: {
            major: INT8.get(buf, off + 3),
            revision: INT8.get(buf, off + 4)
          },
          // ID3v2 flags
          flags: {
            // Unsynchronisation
            unsynchronisation: getBit(buf, off + 5, 7),
            // Extended header
            isExtendedHeader: getBit(buf, off + 5, 6),
            // Experimental indicator
            expIndicator: getBit(buf, off + 5, 5),
            footer: getBit(buf, off + 5, 4)
          },
          size: UINT32SYNCSAFE.get(buf, off + 6)
        };
      }
    };
    ExtendedHeader = {
      len: 10,
      get: (buf, off) => {
        return {
          // Extended header size
          size: UINT32_BE.get(buf, off),
          // Extended Flags
          extendedFlags: UINT16_BE.get(buf, off + 4),
          // Size of padding
          sizeOfPadding: UINT32_BE.get(buf, off + 6),
          // CRC data present
          crcDataPresent: getBit(buf, off + 4, 31)
        };
      }
    };
    TextEncodingToken = {
      len: 1,
      get: (uint8Array, off) => {
        switch (uint8Array[off]) {
          case 0:
            return { encoding: "latin1" };
          // binary
          case 1:
            return { encoding: "utf-16le", bom: true };
          case 2:
            return { encoding: "utf-16be", bom: false };
          case 3:
            return { encoding: "utf8", bom: false };
          default:
            return { encoding: "utf8", bom: false };
        }
      }
    };
    TextHeader = {
      len: 4,
      get: (uint8Array, off) => {
        return {
          encoding: TextEncodingToken.get(uint8Array, off),
          language: new StringType(3, "latin1").get(uint8Array, off + 1)
        };
      }
    };
    SyncTextHeader = {
      len: 6,
      get: (uint8Array, off) => {
        const text = TextHeader.get(uint8Array, off);
        return {
          encoding: text.encoding,
          language: text.language,
          timeStampFormat: UINT8.get(uint8Array, off + 4),
          contentType: UINT8.get(uint8Array, off + 5)
        };
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/id3v2/FrameParser.js
function parseGenre(origVal) {
  const genres = [];
  let code;
  let word = "";
  for (const c of origVal) {
    if (typeof code === "string") {
      if (c === "(" && code === "") {
        word += "(";
        code = void 0;
      } else if (c === ")") {
        if (word !== "") {
          genres.push(word);
          word = "";
        }
        const genre = parseGenreCode(code);
        if (genre) {
          genres.push(genre);
        }
        code = void 0;
      } else {
        code += c;
      }
    } else if (c === "(") {
      code = "";
    } else {
      word += c;
    }
  }
  if (word) {
    if (genres.length === 0 && word.match(/^\d*$/)) {
      word = parseGenreCode(word);
    }
    if (word) {
      genres.push(word);
    }
  }
  return genres;
}
function parseGenreCode(code) {
  if (code === "RX") {
    return "Remix";
  }
  if (code === "CR") {
    return "Cover";
  }
  if (code.match(/^\d*$/)) {
    return Genres[Number.parseInt(code, 10)];
  }
}
function makeUnexpectedMajorVersionError(majorVer) {
  throw new Id3v2ContentError(`Unexpected majorVer: ${majorVer}`);
}
var import_debug4, debug4, defaultEnc, urlEnc, FrameParser, Id3v2ContentError;
var init_FrameParser = __esm({
  "soda-player/node_modules/music-metadata/lib/id3v2/FrameParser.js"() {
    import_debug4 = __toESM(require_src(), 1);
    init_lib3();
    init_Util();
    init_Util();
    init_ID3v1Parser();
    init_ParseError();
    init_FrameHeader();
    init_ID3v2ChapterToken();
    init_ID3v2Token();
    debug4 = (0, import_debug4.default)("music-metadata:id3v2:frame-parser");
    defaultEnc = "latin1";
    urlEnc = { encoding: defaultEnc, bom: false };
    FrameParser = class _FrameParser {
      major;
      warningCollector;
      /**
       * Create id3v2 frame parser
       * @param major - Major version, e.g. (4) for  id3v2.4
       * @param warningCollector - Used to collect decode issue
       */
      constructor(major, warningCollector) {
        this.major = major;
        this.warningCollector = warningCollector;
      }
      readData(uint8Array, type, includeCovers) {
        if (uint8Array.length === 0) {
          this.warningCollector.addWarning(`id3v2.${this.major} header has empty tag type=${type}`);
          return;
        }
        const { encoding, bom } = TextEncodingToken.get(uint8Array, 0);
        const length = uint8Array.length;
        let offset = 0;
        let output = [];
        const nullTerminatorLength = _FrameParser.getNullTerminatorLength(encoding);
        let fzero;
        debug4(`Parsing tag type=${type}, encoding=${encoding}, bom=${bom}`);
        switch (type !== "TXXX" && type[0] === "T" ? "T*" : type) {
          case "T*":
          // 4.2.1. Text information frames - details
          case "GRP1":
          // iTunes-specific ID3v2 grouping field
          case "GP1":
          // iTunes-specific ID3v2.2 grouping field
          case "IPLS":
          // v2.3: Involved people list
          case "MVIN":
          case "MVNM":
          case "PCS":
          case "PCST": {
            let text;
            try {
              text = _FrameParser.trimNullPadding(decodeString(uint8Array.subarray(1), encoding));
            } catch (error) {
              if (error instanceof Error) {
                this.warningCollector.addWarning(`id3v2.${this.major} type=${type} header has invalid string value: ${error.message}`);
                break;
              }
              throw error;
            }
            switch (type) {
              case "TMCL":
              // Musician credits list
              case "TIPL":
              // Involved people list
              case "IPLS":
                output = _FrameParser.functionList(this.splitValue(type, text));
                break;
              case "TRK":
              case "TRCK":
              case "TPOS":
              case "TIT1":
              case "TIT2":
              case "TIT3":
                output = text;
                break;
              case "TCOM":
              case "TEXT":
              case "TOLY":
              case "TOPE":
              case "TPE1":
              case "TSRC":
                output = this.splitValue(type, text);
                break;
              case "TCO":
              case "TCON":
                output = this.splitValue(type, text).map((v) => parseGenre(v)).reduce((acc, val) => acc.concat(val), []);
                break;
              case "PCS":
              case "PCST":
                output = this.major >= 4 ? this.splitValue(type, text) : [text];
                output = Array.isArray(output) && output[0] === "" ? 1 : 0;
                break;
              default:
                output = this.major >= 4 ? this.splitValue(type, text) : [text];
            }
            break;
          }
          case "TXXX": {
            const idAndData = _FrameParser.readIdentifierAndData(uint8Array.subarray(1), encoding);
            output = {
              description: idAndData.id,
              text: this.splitValue(type, _FrameParser.trimNullPadding(decodeString(idAndData.data, encoding)))
            };
            break;
          }
          case "PIC":
          case "APIC":
            if (includeCovers) {
              const pic = {};
              uint8Array = uint8Array.subarray(1);
              switch (this.major) {
                case 2:
                  pic.format = decodeString(uint8Array.subarray(0, 3), "latin1");
                  uint8Array = uint8Array.subarray(3);
                  break;
                case 3:
                case 4:
                  fzero = findZero(uint8Array, defaultEnc);
                  pic.format = decodeString(uint8Array.subarray(0, fzero), defaultEnc);
                  uint8Array = uint8Array.subarray(fzero + 1);
                  break;
                default:
                  throw makeUnexpectedMajorVersionError(this.major);
              }
              pic.format = _FrameParser.fixPictureMimeType(pic.format);
              pic.type = AttachedPictureType[uint8Array[0]];
              uint8Array = uint8Array.subarray(1);
              fzero = findZero(uint8Array, encoding);
              pic.description = decodeString(uint8Array.subarray(0, fzero), encoding);
              uint8Array = uint8Array.subarray(fzero + nullTerminatorLength);
              pic.data = uint8Array;
              output = pic;
            }
            break;
          case "CNT":
          case "PCNT":
            output = decodeUintBE(uint8Array);
            break;
          case "SYLT": {
            const syltHeader = SyncTextHeader.get(uint8Array, 0);
            uint8Array = uint8Array.subarray(SyncTextHeader.len);
            const result = {
              descriptor: "",
              language: syltHeader.language,
              contentType: syltHeader.contentType,
              timeStampFormat: syltHeader.timeStampFormat,
              syncText: []
            };
            let readSyllables = false;
            while (uint8Array.length > 0) {
              const nullStr = _FrameParser.readNullTerminatedString(uint8Array, syltHeader.encoding);
              uint8Array = uint8Array.subarray(nullStr.len);
              if (readSyllables) {
                const timestamp = UINT32_BE.get(uint8Array, 0);
                uint8Array = uint8Array.subarray(UINT32_BE.len);
                result.syncText.push({
                  text: nullStr.text,
                  timestamp
                });
              } else {
                result.descriptor = nullStr.text;
                readSyllables = true;
              }
            }
            output = result;
            break;
          }
          case "ULT":
          case "USLT":
          case "COM":
          case "COMM": {
            const textHeader = TextHeader.get(uint8Array, offset);
            offset += TextHeader.len;
            const descriptorStr = _FrameParser.readNullTerminatedString(uint8Array.subarray(offset), textHeader.encoding);
            offset += descriptorStr.len;
            const textStr = _FrameParser.readNullTerminatedString(uint8Array.subarray(offset), textHeader.encoding);
            const comment = {
              language: textHeader.language,
              descriptor: descriptorStr.text,
              text: textStr.text
            };
            output = comment;
            break;
          }
          case "UFID": {
            const ufid = _FrameParser.readIdentifierAndData(uint8Array, defaultEnc);
            output = { owner_identifier: ufid.id, identifier: ufid.data };
            break;
          }
          case "PRIV": {
            const priv = _FrameParser.readIdentifierAndData(uint8Array, defaultEnc);
            output = { owner_identifier: priv.id, data: priv.data };
            break;
          }
          case "POPM": {
            uint8Array = uint8Array.subarray(offset);
            const emailStr = _FrameParser.readNullTerminatedString(uint8Array, urlEnc);
            const email = emailStr.text;
            uint8Array = uint8Array.subarray(emailStr.len);
            if (uint8Array.length === 0) {
              this.warningCollector.addWarning(`id3v2.${this.major} type=${type} POPM frame missing rating byte`);
              output = { email, rating: 0, counter: void 0 };
              break;
            }
            const rating = UINT8.get(uint8Array, 0);
            const counterBytes = uint8Array.subarray(UINT8.len);
            output = {
              email,
              rating,
              counter: counterBytes.length > 0 ? decodeUintBE(counterBytes) : void 0
            };
            break;
          }
          case "GEOB": {
            const encoding2 = TextEncodingToken.get(uint8Array, 0);
            uint8Array = uint8Array.subarray(1);
            const mimeTypeStr = _FrameParser.readNullTerminatedString(uint8Array, urlEnc);
            const mimeType = mimeTypeStr.text;
            uint8Array = uint8Array.subarray(mimeTypeStr.len);
            const filenameStr = _FrameParser.readNullTerminatedString(uint8Array, encoding2);
            const filename = filenameStr.text;
            uint8Array = uint8Array.subarray(filenameStr.len);
            const descriptionStr = _FrameParser.readNullTerminatedString(uint8Array, encoding2);
            const description = descriptionStr.text;
            uint8Array = uint8Array.subarray(descriptionStr.len);
            const geob = {
              type: mimeType,
              filename,
              description,
              data: uint8Array
            };
            output = geob;
            break;
          }
          // W-Frames:
          case "WCOM":
          case "WCOP":
          case "WOAF":
          case "WOAR":
          case "WOAS":
          case "WORS":
          case "WPAY":
          case "WPUB":
            output = _FrameParser.readNullTerminatedString(uint8Array, urlEnc).text;
            break;
          case "WXXX": {
            const encoding2 = TextEncodingToken.get(uint8Array, 0);
            uint8Array = uint8Array.subarray(1);
            const descriptionStr = _FrameParser.readNullTerminatedString(uint8Array, encoding2);
            const description = descriptionStr.text;
            uint8Array = uint8Array.subarray(descriptionStr.len);
            output = { description, url: _FrameParser.trimNullPadding(decodeString(uint8Array, defaultEnc)) };
            break;
          }
          case "WFD":
          case "WFED": {
            const encoding2 = TextEncodingToken.get(uint8Array, 0);
            uint8Array = uint8Array.subarray(1);
            output = _FrameParser.readNullTerminatedString(uint8Array, encoding2).text;
            break;
          }
          case "MCDI": {
            output = uint8Array.subarray(0, length);
            break;
          }
          // ID3v2 Chapters 1.0
          // https://mutagen-specs.readthedocs.io/en/latest/id3/id3v2-chapters-1.0.html#chapter-frame
          case "CHAP": {
            debug4("Reading CHAP");
            fzero = findZero(uint8Array, defaultEnc);
            const chapter = {
              label: decodeString(uint8Array.subarray(0, fzero), defaultEnc),
              info: ChapterInfo.get(uint8Array, fzero + 1),
              frames: /* @__PURE__ */ new Map()
            };
            offset += fzero + 1 + ChapterInfo.len;
            while (offset < length) {
              const subFrame = readFrameHeader(uint8Array.subarray(offset), this.major, this.warningCollector);
              const headerSize = getFrameHeaderLength(this.major);
              offset += headerSize;
              const subOutput = this.readData(uint8Array.subarray(offset, offset + subFrame.length), subFrame.id, includeCovers);
              offset += subFrame.length;
              chapter.frames.set(subFrame.id, subOutput);
            }
            output = chapter;
            break;
          }
          // ID3v2 Chapters 1.0
          // https://mutagen-specs.readthedocs.io/en/latest/id3/id3v2-chapters-1.0.html#table-of-contents-frame
          case "CTOC": {
            debug4("Reading CTOC");
            const idEnd = findZero(uint8Array, defaultEnc);
            const label = decodeString(uint8Array.subarray(0, idEnd), defaultEnc);
            offset = idEnd + 1;
            const flags = uint8Array[offset++];
            const topLevel = (flags & 2) !== 0;
            const ordered = (flags & 1) !== 0;
            const entryCount = uint8Array[offset++];
            const childElementIds = [];
            for (let i = 0; i < entryCount && offset < length; i++) {
              const end = findZero(uint8Array.subarray(offset), defaultEnc);
              const childId = decodeString(uint8Array.subarray(offset, offset + end), defaultEnc);
              childElementIds.push(childId);
              offset += end + 1;
            }
            const toc = {
              label,
              flags: { topLevel, ordered },
              childElementIds,
              frames: /* @__PURE__ */ new Map()
            };
            while (offset < length) {
              const subFrame = readFrameHeader(uint8Array.subarray(offset), this.major, this.warningCollector);
              const headerSize = getFrameHeaderLength(this.major);
              offset += headerSize;
              const subOutput = this.readData(uint8Array.subarray(offset, offset + subFrame.length), subFrame.id, includeCovers);
              offset += subFrame.length;
              toc.frames.set(subFrame.id, subOutput);
            }
            output = toc;
            break;
          }
          default:
            debug4(`Warning: unsupported id3v2-tag-type: ${type}`);
            break;
        }
        return output;
      }
      static readNullTerminatedString(uint8Array, encoding) {
        const originalLen = uint8Array.length;
        const zeroIndex = findZero(uint8Array, encoding.encoding);
        if (zeroIndex >= originalLen) {
          return {
            text: decodeString(uint8Array, encoding.encoding),
            len: originalLen
          };
        }
        const txt = uint8Array.subarray(0, zeroIndex);
        return {
          text: decodeString(txt, encoding.encoding),
          len: zeroIndex + _FrameParser.getNullTerminatorLength(encoding.encoding)
        };
      }
      static fixPictureMimeType(pictureType) {
        pictureType = pictureType.toLocaleLowerCase();
        switch (pictureType) {
          case "jpg":
            return "image/jpeg";
          case "png":
            return "image/png";
        }
        return pictureType;
      }
      /**
       * Converts TMCL (Musician credits list) or TIPL (Involved people list)
       * @param entries
       */
      static functionList(entries2) {
        const res = {};
        for (let i = 0; i + 1 < entries2.length; i += 2) {
          const names = entries2[i + 1].split(",");
          res[entries2[i]] = res[entries2[i]] ? res[entries2[i]].concat(names) : names;
        }
        return res;
      }
      /**
       * id3v2.4 defines that multiple T* values are separated by 0x00
       * id3v2.3 defines that TCOM, TEXT, TOLY, TOPE & TPE1 values are separated by /
       * (TCON/TCO genre values are NOT slash-separated in ID3v2.3)
       * @param tag - Tag name
       * @param text - Concatenated tag value
       * @returns Split tag value
       */
      splitValue(tag, text) {
        let values;
        if (this.major < 4) {
          values = text.split(/\x00/g);
          if (values.length > 1) {
            this.warningCollector.addWarning(`ID3v2.${this.major} ${tag} uses non standard null-separator.`);
          } else if ([
            /* v2.3: */
            "TPE1",
            "TPE2",
            "TPE3",
            "TPE4",
            "TCOM",
            "TEXT",
            "TOLY",
            "TOPE",
            /* v2.2: */
            "TP1",
            "TCM",
            "TXT",
            "TOA",
            "TOL",
            // Picard can flatten multiple values with '/' in these frames.
            // https://picard-docs.musicbrainz.org/en/v2.13/config/options_tags_compatibility_id3.html
            "TXXX",
            "TSRC",
            // Retain legacy support for nonstandard slash-separated credits.
            "IPLS"
          ].includes(tag)) {
            values = text.split(/\//g);
          }
        } else {
          values = text.split(/\x00/g);
        }
        return _FrameParser.trimArray(values);
      }
      static trimArray(values) {
        return values.map((value) => _FrameParser.trimNullPadding(value).trim());
      }
      static trimNullPadding(value) {
        let end = value.length;
        while (end > 0 && value.charCodeAt(end - 1) === 0) {
          end--;
        }
        return end === value.length ? value : value.slice(0, end);
      }
      static readIdentifierAndData(uint8Array, encoding) {
        const idStr = _FrameParser.readNullTerminatedString(uint8Array, { encoding, bom: false });
        return { id: idStr.text, data: uint8Array.subarray(idStr.len) };
      }
      static getNullTerminatorLength(enc) {
        return enc.startsWith("utf-16") ? 2 : 1;
      }
    };
    Id3v2ContentError = class extends makeUnexpectedFileContentError("id3v2") {
    };
  }
});

// soda-player/node_modules/music-metadata/lib/id3v2/FrameHeader.js
function getFrameHeaderLength(majorVer) {
  switch (majorVer) {
    case 2:
      return 6;
    case 3:
    case 4:
      return 10;
    default:
      throw makeUnexpectedMajorVersionError2(majorVer);
  }
}
function readFrameFlags(b, majorVer) {
  if (majorVer === 3) {
    return {
      status: {
        tag_alter_preservation: getBit(b, 0, 7),
        file_alter_preservation: getBit(b, 0, 6),
        read_only: getBit(b, 0, 5)
      },
      format: {
        compression: getBit(b, 1, 7),
        encryption: getBit(b, 1, 6),
        grouping_identity: getBit(b, 1, 5),
        // Unsynchronisation and data-length-indicator do not exist as per-frame flags in ID3v2.3.
        unsynchronisation: false,
        data_length_indicator: false
      }
    };
  }
  return {
    status: {
      tag_alter_preservation: getBit(b, 0, 6),
      file_alter_preservation: getBit(b, 0, 5),
      read_only: getBit(b, 0, 4)
    },
    format: {
      grouping_identity: getBit(b, 1, 6),
      compression: getBit(b, 1, 3),
      encryption: getBit(b, 1, 2),
      unsynchronisation: getBit(b, 1, 1),
      data_length_indicator: getBit(b, 1, 0)
    }
  };
}
function readFrameHeader(uint8Array, majorVer, warningCollector) {
  switch (majorVer) {
    case 2:
      return parseFrameHeaderV22(uint8Array, majorVer, warningCollector);
    case 3:
    case 4:
      return parseFrameHeaderV23V24(uint8Array, majorVer, warningCollector);
    default:
      throw makeUnexpectedMajorVersionError2(majorVer);
  }
}
function parseFrameHeaderV22(uint8Array, majorVer, warningCollector) {
  const header = {
    id: textDecode(uint8Array.subarray(0, 3), "ascii"),
    length: UINT24_BE.get(uint8Array, 3)
  };
  if (!header.id.match(/^[A-Z0-9]{3}$/)) {
    warningCollector.addWarning(`Invalid ID3v2.${majorVer} frame-header-ID: ${header.id}`);
  }
  return header;
}
function parseFrameHeaderV23V24(uint8Array, majorVer, warningCollector) {
  const header = {
    id: textDecode(uint8Array.subarray(0, 4), "ascii"),
    length: (majorVer === 4 ? UINT32SYNCSAFE : UINT32_BE).get(uint8Array, 4),
    flags: readFrameFlags(uint8Array.subarray(8, 10), majorVer)
  };
  if (!header.id.match(/^[A-Z0-9]{4}$/)) {
    warningCollector.addWarning(`Invalid ID3v2.${majorVer} frame-header-ID: ${header.id}`);
  }
  return header;
}
function makeUnexpectedMajorVersionError2(majorVer) {
  throw new Id3v2ContentError(`Unexpected majorVer: ${majorVer}`);
}
var init_FrameHeader = __esm({
  "soda-player/node_modules/music-metadata/lib/id3v2/FrameHeader.js"() {
    init_lib2();
    init_lib3();
    init_Util();
    init_FrameParser();
    init_ID3v2Token();
  }
});

// soda-player/node_modules/music-metadata/lib/id3v2/ID3v2Parser.js
function makeUnexpectedMajorVersionError3(majorVer) {
  throw new Id3v2ContentError(`Unexpected majorVer: ${majorVer}`);
}
var ID3v2Parser;
var init_ID3v2Parser = __esm({
  "soda-player/node_modules/music-metadata/lib/id3v2/ID3v2Parser.js"() {
    init_lib3();
    init_FrameHeader();
    init_FrameParser();
    init_ID3v2Token();
    ID3v2Parser = class _ID3v2Parser {
      static removeUnsyncBytes(buffer) {
        let readI = 0;
        let writeI = 0;
        while (readI < buffer.length - 1) {
          if (readI !== writeI) {
            buffer[writeI] = buffer[readI];
          }
          readI += buffer[readI] === 255 && buffer[readI + 1] === 0 ? 2 : 1;
          writeI++;
        }
        if (readI < buffer.length) {
          buffer[writeI++] = buffer[readI];
        }
        return buffer.subarray(0, writeI);
      }
      static readFrameData(uint8Array, frameHeader, majorVer, includeCovers, warningCollector) {
        const frameParser = new FrameParser(majorVer, warningCollector);
        switch (majorVer) {
          case 2:
            return frameParser.readData(uint8Array, frameHeader.id, includeCovers);
          case 3:
          case 4:
            if (frameHeader.flags?.format.unsynchronisation) {
              uint8Array = _ID3v2Parser.removeUnsyncBytes(uint8Array);
            }
            if (frameHeader.flags?.format.data_length_indicator) {
              uint8Array = uint8Array.subarray(4, uint8Array.length);
            }
            return frameParser.readData(uint8Array, frameHeader.id, includeCovers);
          default:
            throw makeUnexpectedMajorVersionError3(majorVer);
        }
      }
      /**
       * Create a combined tag key, of tag & description
       * @param tag e.g.: COM
       * @param description e.g. iTunPGAP
       * @returns string e.g. COM:iTunPGAP
       */
      static makeDescriptionTagName(tag, description) {
        return tag + (description ? `:${description}` : "");
      }
      tokenizer = void 0;
      id3Header = void 0;
      metadata = void 0;
      headerType = void 0;
      options = void 0;
      async parse(metadata, tokenizer, options) {
        this.tokenizer = tokenizer;
        this.metadata = metadata;
        this.options = options;
        const id3Header = await this.tokenizer.readToken(ID3v2Header);
        if (id3Header.fileIdentifier !== "ID3") {
          throw new Id3v2ContentError("expected ID3-header file-identifier 'ID3' was not found");
        }
        const fileSize = this.tokenizer.fileInfo.size;
        if (fileSize !== void 0) {
          const remainingBytes = fileSize - this.tokenizer.position;
          if (id3Header.size > remainingBytes) {
            throw new Id3v2ContentError(`ID3v2 tag size ${id3Header.size} exceeds remaining file size ${remainingBytes}`);
          }
        }
        this.id3Header = id3Header;
        this.headerType = `ID3v2.${id3Header.version.major}`;
        await (id3Header.flags.isExtendedHeader ? this.parseExtendedHeader() : this.parseId3Data(id3Header.size));
        const chapters = _ID3v2Parser.mapId3v2Chapters(this.metadata.native[this.headerType]);
        this.metadata.setFormat("chapters", chapters);
      }
      async parseExtendedHeader() {
        const extendedHeader = await this.tokenizer.readToken(ExtendedHeader);
        const dataRemaining = extendedHeader.size - ExtendedHeader.len;
        return dataRemaining > 0 ? this.parseExtendedHeaderData(dataRemaining, extendedHeader.size) : this.parseId3Data(this.id3Header.size - extendedHeader.size);
      }
      async parseExtendedHeaderData(dataRemaining, extendedHeaderSize) {
        await this.tokenizer.ignore(dataRemaining);
        return this.parseId3Data(this.id3Header.size - extendedHeaderSize);
      }
      async parseId3Data(dataLen) {
        const uint8Array = await this.tokenizer.readToken(new Uint8ArrayType(dataLen));
        for (const tag of this.parseMetadata(uint8Array)) {
          switch (tag.id) {
            case "TXXX":
              if (tag.value) {
                await this.handleTag(tag, tag.value.text, () => tag.value.description);
              }
              break;
            default:
              await (Array.isArray(tag.value) ? Promise.all(tag.value.map((value) => this.addTag(tag.id, value))) : this.addTag(tag.id, tag.value));
          }
        }
      }
      async handleTag(tag, values, descriptor, resolveValue = (value) => value) {
        await Promise.all(values.map((value) => this.addTag(_ID3v2Parser.makeDescriptionTagName(tag.id, descriptor(value)), resolveValue(value))));
      }
      async addTag(id, value) {
        await this.metadata.addTag(this.headerType, id, value);
      }
      parseMetadata(data) {
        let offset = 0;
        const tags = [];
        while (true) {
          if (offset === data.length) {
            break;
          }
          const frameHeaderLength = getFrameHeaderLength(this.id3Header.version.major);
          if (offset + frameHeaderLength > data.length) {
            this.metadata.addWarning("Illegal ID3v2 tag length");
            break;
          }
          const frameHeaderBytes = data.subarray(offset, offset + frameHeaderLength);
          offset += frameHeaderLength;
          const frameHeader = readFrameHeader(frameHeaderBytes, this.id3Header.version.major, this.metadata);
          const frameDataBytes = data.subarray(offset, offset + frameHeader.length);
          offset += frameHeader.length;
          const values = _ID3v2Parser.readFrameData(frameDataBytes, frameHeader, this.id3Header.version.major, !this.options.skipCovers, this.metadata);
          if (values) {
            tags.push({ id: frameHeader.id, value: values });
          }
        }
        return tags;
      }
      /**
       * Convert parsed ID3v2 chapter frames (CHAP / CTOC) to generic `format.chapters`.
       *
       * This function expects the `native` tags already to contain parsed `CHAP` and `CTOC` frame values,
       * as produced by `FrameParser.readData`.
       */
      static mapId3v2Chapters(id3Tags) {
        if (!id3Tags) {
          return;
        }
        const chapFrames = id3Tags.filter((t) => t.id === "CHAP").map((t) => t.value);
        if (!chapFrames.length) {
          return;
        }
        const tocFrames = id3Tags.filter((t) => t.id === "CTOC").map((t) => t.value);
        const topLevelToc = tocFrames.find((t) => t.flags.topLevel);
        const chapterById = /* @__PURE__ */ new Map();
        for (const chap of chapFrames) {
          chapterById.set(chap.label, chap);
        }
        const orderedIds = topLevelToc?.childElementIds;
        const chapters = [];
        const source = orderedIds ?? [...chapterById.keys()];
        for (const id of source) {
          const chap = chapterById.get(id);
          if (!chap) {
            continue;
          }
          const frames = chap.frames;
          const title = frames.get("TIT2");
          if (!title) {
            continue;
          }
          chapters.push({
            id,
            title,
            url: frames.get("WXXX"),
            start: chap.info.startTime / 1e3,
            end: chap.info.endTime / 1e3,
            image: frames.get("APIC")
          });
        }
        if (!orderedIds) {
          chapters.sort((a, b) => a.start - b.start);
        }
        return chapters.length ? chapters : void 0;
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/iff/index.js
var Header2;
var init_iff = __esm({
  "soda-player/node_modules/music-metadata/lib/iff/index.js"() {
    init_lib3();
    init_FourCC();
    Header2 = {
      len: 8,
      get: (buf, off) => {
        return {
          // Chunk type ID
          chunkID: FourCcToken.get(buf, off),
          // Chunk size
          chunkSize: Number(BigInt(UINT32_BE.get(buf, off + 4)))
        };
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/aiff/AiffToken.js
var compressionTypes, AiffContentError, Common;
var init_AiffToken = __esm({
  "soda-player/node_modules/music-metadata/lib/aiff/AiffToken.js"() {
    init_lib3();
    init_FourCC();
    init_ParseError();
    compressionTypes = {
      NONE: "not compressed	PCM	Apple Computer",
      sowt: "PCM (byte swapped)",
      fl32: "32-bit floating point IEEE 32-bit float",
      fl64: "64-bit floating point IEEE 64-bit float	Apple Computer",
      alaw: "ALaw 2:1	8-bit ITU-T G.711 A-law",
      ulaw: "\xB5Law 2:1	8-bit ITU-T G.711 \xB5-law	Apple Computer",
      ULAW: "CCITT G.711 u-law 8-bit ITU-T G.711 \xB5-law",
      ALAW: "CCITT G.711 A-law 8-bit ITU-T G.711 A-law",
      FL32: "Float 32	IEEE 32-bit float "
    };
    AiffContentError = class extends makeUnexpectedFileContentError("AIFF") {
    };
    Common = class {
      len;
      isAifc;
      constructor(header, isAifc) {
        this.isAifc = isAifc;
        const minimumChunkSize = isAifc ? 22 : 18;
        if (header.chunkSize < minimumChunkSize) {
          throw new AiffContentError(`COMMON CHUNK size should always be at least ${minimumChunkSize}`);
        }
        this.len = header.chunkSize;
      }
      get(buf, off) {
        const shift = UINT16_BE.get(buf, off + 8) - 16398;
        const baseSampleRate = UINT16_BE.get(buf, off + 8 + 2);
        const res = {
          numChannels: UINT16_BE.get(buf, off),
          numSampleFrames: UINT32_BE.get(buf, off + 2),
          sampleSize: UINT16_BE.get(buf, off + 6),
          sampleRate: shift < 0 ? baseSampleRate >> Math.abs(shift) : baseSampleRate << shift
        };
        if (this.isAifc) {
          res.compressionType = FourCcToken.get(buf, off + 18);
          if (this.len > 22) {
            const strLen = UINT8.get(buf, off + 22);
            if (strLen > 0) {
              const padding = (strLen + 1) % 2;
              if (23 + strLen + padding === this.len) {
                res.compressionName = new StringType(strLen, "latin1").get(buf, off + 23);
              } else {
                throw new AiffContentError("Illegal pstring length");
              }
            } else {
              res.compressionName = void 0;
            }
          }
        } else {
          res.compressionName = "PCM";
        }
        return res;
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/aiff/AiffParser.js
var AiffParser_exports = {};
__export(AiffParser_exports, {
  AIFFParser: () => AIFFParser
});
var import_debug5, debug5, AIFFParser;
var init_AiffParser = __esm({
  "soda-player/node_modules/music-metadata/lib/aiff/AiffParser.js"() {
    import_debug5 = __toESM(require_src(), 1);
    init_lib();
    init_lib3();
    init_BasicParser();
    init_FourCC();
    init_ID3v2Parser();
    init_iff();
    init_AiffToken();
    init_AiffToken();
    debug5 = (0, import_debug5.default)("music-metadata:parser:aiff");
    AIFFParser = class extends BasicParser {
      isCompressed = null;
      async parse() {
        const header = await this.tokenizer.readToken(Header2);
        if (header.chunkID !== "FORM") {
          throw new AiffContentError("Invalid Chunk-ID, expected 'FORM'");
        }
        const type = await this.tokenizer.readToken(FourCcToken);
        switch (type) {
          case "AIFF":
            this.metadata.setFormat("container", type);
            this.isCompressed = false;
            break;
          case "AIFC":
            this.metadata.setFormat("container", "AIFF-C");
            this.isCompressed = true;
            break;
          default:
            throw new AiffContentError(`Unsupported AIFF type: ${type}`);
        }
        this.metadata.setFormat("lossless", !this.isCompressed);
        this.metadata.setAudioOnly();
        try {
          while (!this.tokenizer.fileInfo.size || this.tokenizer.fileInfo.size - this.tokenizer.position >= Header2.len) {
            debug5(`Reading AIFF chunk at offset=${this.tokenizer.position}`);
            const chunkHeader = await this.tokenizer.readToken(Header2);
            const nextChunk = 2 * Math.round(chunkHeader.chunkSize / 2);
            const bytesRead = await this.readData(chunkHeader);
            await this.tokenizer.ignore(nextChunk - bytesRead);
          }
        } catch (err) {
          if (err instanceof EndOfStreamError) {
            debug5("End-of-stream");
          } else {
            throw err;
          }
        }
      }
      async readData(header) {
        switch (header.chunkID) {
          case "COMM": {
            if (this.isCompressed === null) {
              throw new AiffContentError("Failed to parse AIFF.COMM chunk when compression type is unknown");
            }
            const common = await this.tokenizer.readToken(new Common(header, this.isCompressed));
            this.metadata.setFormat("bitsPerSample", common.sampleSize);
            this.metadata.setFormat("sampleRate", common.sampleRate);
            this.metadata.setFormat("numberOfChannels", common.numChannels);
            this.metadata.setFormat("numberOfSamples", common.numSampleFrames);
            this.metadata.setFormat("duration", common.numSampleFrames / common.sampleRate);
            if (common.compressionName || common.compressionType) {
              this.metadata.setFormat("codec", common.compressionName ?? compressionTypes[common.compressionType]);
            }
            return header.chunkSize;
          }
          case "ID3 ": {
            const id3_data = await this.tokenizer.readToken(new Uint8ArrayType(header.chunkSize));
            const rst = fromBuffer(id3_data);
            await new ID3v2Parser().parse(this.metadata, rst, this.options);
            return header.chunkSize;
          }
          case "SSND":
            if (this.metadata.format.duration) {
              this.metadata.setFormat("bitrate", 8 * header.chunkSize / this.metadata.format.duration);
            }
            return 0;
          case "NAME":
          // Sample name chunk
          case "AUTH":
          // Author chunk
          case "(c) ":
          // Copyright chunk
          case "ANNO":
            return this.readTextChunk(header);
          default:
            debug5(`Ignore chunk id=${header.chunkID}, size=${header.chunkSize}`);
            return 0;
        }
      }
      async readTextChunk(header) {
        const value = await this.tokenizer.readToken(new StringType(header.chunkSize, "ascii"));
        const values = value.split("\0").map((v) => v.trim()).filter((v) => v?.length);
        await Promise.all(values.map((v) => this.metadata.addTag("AIFF", header.chunkID, v)));
        return header.chunkSize;
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/matroska/types.js
var TargetType, TrackType, TrackTypeValueToKeyMap;
var init_types = __esm({
  "soda-player/node_modules/music-metadata/lib/matroska/types.js"() {
    TargetType = {
      10: "shot",
      20: "scene",
      30: "track",
      40: "part",
      50: "album",
      60: "edition",
      70: "collection"
    };
    TrackType = {
      video: 1,
      audio: 2,
      complex: 3,
      logo: 4,
      subtitle: 17,
      button: 18,
      control: 32
    };
    TrackTypeValueToKeyMap = {
      [TrackType.video]: "video",
      [TrackType.audio]: "audio",
      [TrackType.complex]: "complex",
      [TrackType.logo]: "logo",
      [TrackType.subtitle]: "subtitle",
      [TrackType.button]: "button",
      [TrackType.control]: "control"
    };
  }
});

// soda-player/node_modules/music-metadata/lib/type.js
var init_type = __esm({
  "soda-player/node_modules/music-metadata/lib/type.js"() {
    init_ID3v2Token();
    init_types();
  }
});

// soda-player/node_modules/win-guid/lib/guid.js
function parseWindowsGuid(guid) {
  let s = guid.trim();
  if (s.length !== 36 || s[8] !== "-" || s[13] !== "-" || s[18] !== "-" || s[23] !== "-") {
    throw new Error(`Invalid GUID format: ${guid}`);
  }
  let v;
  const out = new Uint8Array(16);
  v = parseInt(s.slice(0, 8), 16);
  out[0] = v & 255;
  out[1] = v >>> 8 & 255;
  out[2] = v >>> 16 & 255;
  out[3] = v >>> 24 & 255;
  v = parseInt(s.slice(9, 13), 16);
  out[4] = v & 255;
  out[5] = v >>> 8 & 255;
  v = parseInt(s.slice(14, 18), 16);
  out[6] = v & 255;
  out[7] = v >>> 8 & 255;
  v = parseInt(s.slice(19, 23), 16);
  out[8] = v >>> 8 & 255;
  out[9] = v & 255;
  v = parseInt(s.slice(24, 32), 16);
  out[10] = v >>> 24 & 255;
  out[11] = v >>> 16 & 255;
  out[12] = v >>> 8 & 255;
  out[13] = v & 255;
  v = parseInt(s.slice(32, 36), 16);
  out[14] = v >>> 8 & 255;
  out[15] = v & 255;
  for (let i = 0; i < 16; i++) {
    if (!Number.isFinite(out[i])) {
      throw new Error(`Invalid GUID format: ${guid}`);
    }
  }
  if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(s)) {
    throw new Error(`Invalid GUID format: ${guid}`);
  }
  return out;
}
var Guid;
var init_guid = __esm({
  "soda-player/node_modules/win-guid/lib/guid.js"() {
    Guid = class _Guid {
      constructor(bytes) {
        if (bytes.length !== 16)
          throw new Error("GUID must be exactly 16 bytes");
        this.bytes = bytes;
      }
      static fromString(guid) {
        return new _Guid(parseWindowsGuid(guid));
      }
      /**
       * Convert Windows / CFBF byte order into canonical GUID string:
       * xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
       */
      toString() {
        const b = this.bytes;
        const hx = (n) => n.toString(16).padStart(2, "0");
        const g1 = hx(b[3]) + hx(b[2]) + hx(b[1]) + hx(b[0]);
        const g2 = hx(b[5]) + hx(b[4]);
        const g3 = hx(b[7]) + hx(b[6]);
        const g4 = hx(b[8]) + hx(b[9]);
        const g5 = hx(b[10]) + hx(b[11]) + hx(b[12]) + hx(b[13]) + hx(b[14]) + hx(b[15]);
        return `${g1}-${g2}-${g3}-${g4}-${g5}`.toUpperCase();
      }
      /**
       * Compare against a Uint8Array containing GUID bytes
       * in Windows / CFBF layout.
       */
      equals(buf, offset = 0) {
        if (offset < 0 || buf.length - offset < 16)
          return false;
        const a = this.bytes;
        for (let i = 0; i < 16; i++) {
          if (buf[offset + i] !== a[i])
            return false;
        }
        return true;
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/asf/AsfGuid.js
var AsfGuid;
var init_AsfGuid = __esm({
  "soda-player/node_modules/music-metadata/lib/asf/AsfGuid.js"() {
    init_guid();
    AsfGuid = class _AsfGuid {
      // 10.1 Top-level ASF object GUIDs
      static HeaderObject = new _AsfGuid("75B22630-668E-11CF-A6D9-00AA0062CE6C");
      static DataObject = new _AsfGuid("75B22636-668E-11CF-A6D9-00AA0062CE6C");
      static SimpleIndexObject = new _AsfGuid("33000890-E5B1-11CF-89F4-00A0C90349CB");
      static IndexObject = new _AsfGuid("D6E229D3-35DA-11D1-9034-00A0C90349BE");
      static MediaObjectIndexObject = new _AsfGuid("FEB103F8-12AD-4C64-840F-2A1D2F7AD48C");
      static TimecodeIndexObject = new _AsfGuid("3CB73FD0-0C4A-4803-953D-EDF7B6228F0C");
      // 10.2 Header Object GUIDs
      static FilePropertiesObject = new _AsfGuid("8CABDCA1-A947-11CF-8EE4-00C00C205365");
      static StreamPropertiesObject = new _AsfGuid("B7DC0791-A9B7-11CF-8EE6-00C00C205365");
      static HeaderExtensionObject = new _AsfGuid("5FBF03B5-A92E-11CF-8EE3-00C00C205365");
      static CodecListObject = new _AsfGuid("86D15240-311D-11D0-A3A4-00A0C90348F6");
      static ScriptCommandObject = new _AsfGuid("1EFB1A30-0B62-11D0-A39B-00A0C90348F6");
      static MarkerObject = new _AsfGuid("F487CD01-A951-11CF-8EE6-00C00C205365");
      static BitrateMutualExclusionObject = new _AsfGuid("D6E229DC-35DA-11D1-9034-00A0C90349BE");
      static ErrorCorrectionObject = new _AsfGuid("75B22635-668E-11CF-A6D9-00AA0062CE6C");
      static ContentDescriptionObject = new _AsfGuid("75B22633-668E-11CF-A6D9-00AA0062CE6C");
      static ExtendedContentDescriptionObject = new _AsfGuid("D2D0A440-E307-11D2-97F0-00A0C95EA850");
      static ContentBrandingObject = new _AsfGuid("2211B3FA-BD23-11D2-B4B7-00A0C955FC6E");
      static StreamBitratePropertiesObject = new _AsfGuid("7BF875CE-468D-11D1-8D82-006097C9A2B2");
      static ContentEncryptionObject = new _AsfGuid("2211B3FB-BD23-11D2-B4B7-00A0C955FC6E");
      static ExtendedContentEncryptionObject = new _AsfGuid("298AE614-2622-4C17-B935-DAE07EE9289C");
      static DigitalSignatureObject = new _AsfGuid("2211B3FC-BD23-11D2-B4B7-00A0C955FC6E");
      static PaddingObject = new _AsfGuid("1806D474-CADF-4509-A4BA-9AABCB96AAE8");
      // 10.3 Header Extension Object GUIDs
      static ExtendedStreamPropertiesObject = new _AsfGuid("14E6A5CB-C672-4332-8399-A96952065B5A");
      static AdvancedMutualExclusionObject = new _AsfGuid("A08649CF-4775-4670-8A16-6E35357566CD");
      static GroupMutualExclusionObject = new _AsfGuid("D1465A40-5A79-4338-B71B-E36B8FD6C249");
      static StreamPrioritizationObject = new _AsfGuid("D4FED15B-88D3-454F-81F0-ED5C45999E24");
      static BandwidthSharingObject = new _AsfGuid("A69609E6-517B-11D2-B6AF-00C04FD908E9");
      static LanguageListObject = new _AsfGuid("7C4346A9-EFE0-4BFC-B229-393EDE415C85");
      static MetadataObject = new _AsfGuid("C5F8CBEA-5BAF-4877-8467-AA8C44FA4CCA");
      static MetadataLibraryObject = new _AsfGuid("44231C94-9498-49D1-A141-1D134E457054");
      static IndexParametersObject = new _AsfGuid("D6E229DF-35DA-11D1-9034-00A0C90349BE");
      static MediaObjectIndexParametersObject = new _AsfGuid("6B203BAD-3F11-48E4-ACA8-D7613DE2CFA7");
      static TimecodeIndexParametersObject = new _AsfGuid("F55E496D-9797-4B5D-8C8B-604DFE9BFB24");
      static CompatibilityObject = new _AsfGuid("26F18B5D-4584-47EC-9F5F-0E651F0452C9");
      static AdvancedContentEncryptionObject = new _AsfGuid("43058533-6981-49E6-9B74-AD12CB86D58C");
      // 10.4 Stream Properties Object Stream Type GUIDs
      static AudioMedia = new _AsfGuid("F8699E40-5B4D-11CF-A8FD-00805F5C442B");
      static VideoMedia = new _AsfGuid("BC19EFC0-5B4D-11CF-A8FD-00805F5C442B");
      static CommandMedia = new _AsfGuid("59DACFC0-59E6-11D0-A3AC-00A0C90348F6");
      static JFIF_Media = new _AsfGuid("B61BE100-5B4E-11CF-A8FD-00805F5C442B");
      static Degradable_JPEG_Media = new _AsfGuid("35907DE0-E415-11CF-A917-00805F5C442B");
      static FileTransferMedia = new _AsfGuid("91BD222C-F21C-497A-8B6D-5AA86BFC0185");
      static BinaryMedia = new _AsfGuid("3AFB65E2-47EF-40F2-AC2C-70A90D71D343");
      static ASF_Index_Placeholder_Object = new _AsfGuid("D9AADE20-7C17-4F9C-BC28-8555DD98E2A2");
      static fromBin(bin, offset = 0) {
        return new _AsfGuid(_AsfGuid.decode(bin, offset));
      }
      /**
       * Decode GUID in format like "B503BF5F-2EA9-CF11-8EE3-00C00C205365"
       * @param objectId Binary GUID
       * @param offset Read offset in bytes, default 0
       * @returns GUID as dashed hexadecimal representation
       */
      static decode(objectId, offset = 0) {
        return new Guid(objectId.subarray(offset, offset + 16)).toString();
      }
      /**
       * Decode stream type
       * @param mediaType Media type GUID
       * @returns Media type
       */
      static decodeMediaType(mediaType) {
        switch (mediaType.str) {
          case _AsfGuid.AudioMedia.str:
            return "audio";
          case _AsfGuid.VideoMedia.str:
            return "video";
          case _AsfGuid.CommandMedia.str:
            return "command";
          case _AsfGuid.Degradable_JPEG_Media.str:
            return "degradable-jpeg";
          case _AsfGuid.FileTransferMedia.str:
            return "file-transfer";
          case _AsfGuid.BinaryMedia.str:
            return "binary";
        }
      }
      /**
       * Encode GUID
       * @param guid GUID like: "B503BF5F-2EA9-CF11-8EE3-00C00C205365"
       * @returns Encoded Binary GUID
       */
      static encode(guid) {
        return parseWindowsGuid(guid);
      }
      str;
      constructor(str) {
        this.str = str;
      }
      equals(guid) {
        return this.str === guid.str;
      }
      toBin() {
        return _AsfGuid.encode(this.str);
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/asf/AsfUtil.js
function getParserForAttr(i) {
  return attributeParsers[i];
}
function parseUnicodeAttr(uint8Array) {
  return stripNulls(decodeString(uint8Array, "utf-16le"));
}
function parseByteArrayAttr(buf) {
  return new Uint8Array(buf);
}
function parseBoolAttr(buf, offset = 0) {
  return parseWordAttr(buf, offset) === 1;
}
function parseDWordAttr(buf, offset = 0) {
  return UINT32_LE.get(buf, offset);
}
function parseQWordAttr(buf, offset = 0) {
  return UINT64_LE.get(buf, offset);
}
function parseWordAttr(buf, offset = 0) {
  return UINT16_LE.get(buf, offset);
}
var attributeParsers;
var init_AsfUtil = __esm({
  "soda-player/node_modules/music-metadata/lib/asf/AsfUtil.js"() {
    init_lib3();
    init_Util();
    attributeParsers = [
      parseUnicodeAttr,
      parseByteArrayAttr,
      parseBoolAttr,
      parseDWordAttr,
      parseQWordAttr,
      parseWordAttr,
      parseByteArrayAttr
    ];
  }
});

// soda-player/node_modules/music-metadata/lib/asf/AsfObject.js
async function readString(reader) {
  const length = await reader.readNumber(UINT16_LE);
  return (await reader.readToken(new StringType(length * 2, "utf-16le"))).replace("\0", "");
}
async function readCodecEntries(tokenizer, payloadSize) {
  const reader = new BoundedReader(tokenizer, payloadSize);
  const codecHeader = await reader.readToken(CodecListObjectHeader);
  const entries2 = [];
  for (let i = 0; i < codecHeader.entryCount; ++i) {
    entries2.push(await readCodecEntry(reader));
  }
  await reader.ignoreRemaining();
  return entries2;
}
async function readInformation(reader) {
  const length = await reader.readNumber(UINT16_LE);
  return reader.readBuffer(length);
}
async function readCodecEntry(reader) {
  const type = await reader.readNumber(UINT16_LE);
  return {
    type: {
      videoCodec: (type & 1) === 1,
      audioCodec: (type & 2) === 2
    },
    codecName: await readString(reader),
    description: await readString(reader),
    information: await readInformation(reader)
  };
}
var AsfContentParseError, TopLevelHeaderObjectToken, HeaderObjectToken, State, FilePropertiesObject, StreamPropertiesObject, HeaderExtensionObject, CodecListObjectHeader, BoundedReader, ContentDescriptionObjectState, ExtendedContentDescriptionObjectState, ExtendedStreamPropertiesObjectState, MetadataObjectState, MetadataLibraryObjectState, WmPictureToken;
var init_AsfObject = __esm({
  "soda-player/node_modules/music-metadata/lib/asf/AsfObject.js"() {
    init_lib3();
    init_Util();
    init_ID3v2Token();
    init_ParseError();
    init_AsfGuid();
    init_AsfUtil();
    AsfContentParseError = class extends makeUnexpectedFileContentError("ASF") {
    };
    TopLevelHeaderObjectToken = {
      len: 30,
      get: (buf, off) => {
        const base = HeaderObjectToken.get(buf, off);
        if (base.objectSize < TopLevelHeaderObjectToken.len) {
          throw new AsfContentParseError(`Invalid ASF top-level header object size: ${base.objectSize}`);
        }
        return {
          ...base,
          numberOfHeaderObjects: UINT32_LE.get(buf, off + 24)
          // reserved: 2 bytes
        };
      }
    };
    HeaderObjectToken = {
      len: 24,
      get: (buf, off) => {
        const objectSize = UINT64_LE.get(buf, off + 16);
        if (objectSize < BigInt(HeaderObjectToken.len) || objectSize > BigInt(Number.MAX_SAFE_INTEGER)) {
          throw new AsfContentParseError(`Invalid ASF header object size: ${objectSize}`);
        }
        const header = {
          objectId: AsfGuid.fromBin(buf, off),
          objectSize: Number(objectSize)
        };
        return header;
      }
    };
    State = class {
      len;
      constructor(header) {
        this.len = header.objectSize - HeaderObjectToken.len;
      }
      postProcessTag(tags, name, valueType, data) {
        if (name === "WM/Picture") {
          tags.push({ id: name, value: WmPictureToken.fromBuffer(data) });
        } else {
          const parseAttr = getParserForAttr(valueType);
          if (!parseAttr) {
            throw new AsfContentParseError(`unexpected value headerType: ${valueType}`);
          }
          tags.push({ id: name, value: parseAttr(data) });
        }
      }
    };
    FilePropertiesObject = class extends State {
      static guid = AsfGuid.FilePropertiesObject;
      get(buf, off) {
        return {
          fileId: AsfGuid.fromBin(buf, off),
          fileSize: UINT64_LE.get(buf, off + 16),
          creationDate: UINT64_LE.get(buf, off + 24),
          dataPacketsCount: UINT64_LE.get(buf, off + 32),
          playDuration: UINT64_LE.get(buf, off + 40),
          sendDuration: UINT64_LE.get(buf, off + 48),
          preroll: UINT64_LE.get(buf, off + 56),
          flags: {
            broadcast: getBit(buf, off + 64, 24),
            seekable: getBit(buf, off + 64, 25)
          },
          // flagsNumeric: Token.UINT32_LE.get(buf, off + 64),
          minimumDataPacketSize: UINT32_LE.get(buf, off + 68),
          maximumDataPacketSize: UINT32_LE.get(buf, off + 72),
          maximumBitrate: UINT32_LE.get(buf, off + 76)
        };
      }
    };
    StreamPropertiesObject = class extends State {
      static guid = AsfGuid.StreamPropertiesObject;
      get(buf, off) {
        return {
          streamType: AsfGuid.decodeMediaType(AsfGuid.fromBin(buf, off)),
          errorCorrectionType: AsfGuid.fromBin(buf, off + 8)
          // ToDo
        };
      }
    };
    HeaderExtensionObject = class {
      static guid = AsfGuid.HeaderExtensionObject;
      len;
      constructor() {
        this.len = 22;
      }
      get(buf, off) {
        const view = new DataView(buf.buffer, off);
        return {
          reserved1: AsfGuid.fromBin(buf, off),
          reserved2: view.getUint16(16, true),
          extensionDataSize: view.getUint32(18, true)
        };
      }
    };
    CodecListObjectHeader = {
      len: 20,
      get: (buf, off) => {
        const view = new DataView(buf.buffer, off);
        return {
          entryCount: view.getUint16(16, true)
        };
      }
    };
    BoundedReader = class {
      tokenizer;
      remaining;
      constructor(tokenizer, size) {
        this.tokenizer = tokenizer;
        this.remaining = size;
      }
      async readToken(token) {
        this.ensureAvailable(token.len);
        const value = await this.tokenizer.readToken(token);
        this.remaining -= token.len;
        return value;
      }
      async readNumber(token) {
        return this.readToken(token);
      }
      async readBuffer(length) {
        this.ensureAvailable(length);
        const buffer = new Uint8Array(length);
        await this.tokenizer.readBuffer(buffer);
        this.remaining -= length;
        return buffer;
      }
      async ignoreRemaining() {
        const ignored = await this.tokenizer.ignore(this.remaining);
        if (ignored !== this.remaining) {
          throw new AsfContentParseError(`Unexpected end of ASF Codec List Object; missing ${this.remaining - ignored} bytes`);
        }
        this.remaining = 0;
      }
      ensureAvailable(length) {
        if (length > this.remaining) {
          throw new AsfContentParseError(`ASF Codec List field size ${length} exceeds remaining object payload size ${this.remaining}`);
        }
      }
    };
    ContentDescriptionObjectState = class _ContentDescriptionObjectState extends State {
      static guid = AsfGuid.ContentDescriptionObject;
      static contentDescTags = ["Title", "Author", "Copyright", "Description", "Rating"];
      get(buf, off) {
        const tags = [];
        const view = new DataView(buf.buffer, off);
        let pos = 10;
        for (let i = 0; i < _ContentDescriptionObjectState.contentDescTags.length; ++i) {
          const length = view.getUint16(i * 2, true);
          if (length > 0) {
            const tagName = _ContentDescriptionObjectState.contentDescTags[i];
            const end = pos + length;
            tags.push({ id: tagName, value: parseUnicodeAttr(buf.subarray(off + pos, off + end)) });
            pos = end;
          }
        }
        return tags;
      }
    };
    ExtendedContentDescriptionObjectState = class extends State {
      static guid = AsfGuid.ExtendedContentDescriptionObject;
      get(buf, off) {
        const tags = [];
        const view = new DataView(buf.buffer, off);
        const attrCount = view.getUint16(0, true);
        let pos = 2;
        for (let i = 0; i < attrCount; i += 1) {
          const nameLen = view.getUint16(pos, true);
          pos += 2;
          const name = parseUnicodeAttr(buf.subarray(off + pos, off + pos + nameLen));
          pos += nameLen;
          const valueType = view.getUint16(pos, true);
          pos += 2;
          const valueLen = view.getUint16(pos, true);
          pos += 2;
          const value = buf.subarray(off + pos, off + pos + valueLen);
          pos += valueLen;
          this.postProcessTag(tags, name, valueType, value);
        }
        return tags;
      }
    };
    ExtendedStreamPropertiesObjectState = class extends State {
      static guid = AsfGuid.ExtendedStreamPropertiesObject;
      get(buf, off) {
        const view = new DataView(buf.buffer, off);
        return {
          startTime: UINT64_LE.get(buf, off),
          endTime: UINT64_LE.get(buf, off + 8),
          dataBitrate: view.getInt32(12, true),
          bufferSize: view.getInt32(16, true),
          initialBufferFullness: view.getInt32(20, true),
          alternateDataBitrate: view.getInt32(24, true),
          alternateBufferSize: view.getInt32(28, true),
          alternateInitialBufferFullness: view.getInt32(32, true),
          maximumObjectSize: view.getInt32(36, true),
          flags: {
            // ToDo, check flag positions
            reliableFlag: getBit(buf, off + 40, 0),
            seekableFlag: getBit(buf, off + 40, 1),
            resendLiveCleanpointsFlag: getBit(buf, off + 40, 2)
          },
          // flagsNumeric: Token.UINT32_LE.get(buf, off + 64),
          streamNumber: view.getInt16(42, true),
          streamLanguageId: view.getInt16(44, true),
          averageTimePerFrame: view.getInt32(52, true),
          streamNameCount: view.getInt32(54, true),
          payloadExtensionSystems: view.getInt32(56, true),
          streamNames: [],
          // ToDo
          streamPropertiesObject: null
        };
      }
    };
    MetadataObjectState = class extends State {
      static guid = AsfGuid.MetadataObject;
      get(uint8Array, off) {
        const tags = [];
        const view = new DataView(uint8Array.buffer, off);
        const descriptionRecordsCount = view.getUint16(0, true);
        let pos = 2;
        for (let i = 0; i < descriptionRecordsCount; i += 1) {
          pos += 4;
          const nameLen = view.getUint16(pos, true);
          pos += 2;
          const dataType = view.getUint16(pos, true);
          pos += 2;
          const dataLen = view.getUint32(pos, true);
          pos += 4;
          const name = parseUnicodeAttr(uint8Array.subarray(off + pos, off + pos + nameLen));
          pos += nameLen;
          const data = uint8Array.subarray(off + pos, off + pos + dataLen);
          pos += dataLen;
          this.postProcessTag(tags, name, dataType, data);
        }
        return tags;
      }
    };
    MetadataLibraryObjectState = class extends MetadataObjectState {
      static guid = AsfGuid.MetadataLibraryObject;
    };
    WmPictureToken = class _WmPictureToken {
      static fromBuffer(buffer) {
        const pic = new _WmPictureToken(buffer.length);
        return pic.get(buffer, 0);
      }
      len;
      constructor(len) {
        this.len = len;
      }
      get(buffer, offset) {
        const view = new DataView(buffer.buffer, offset);
        const typeId = view.getUint8(0);
        const size = view.getInt32(1, true);
        let index = 5;
        while (view.getUint16(index) !== 0) {
          index += 2;
        }
        const format = new StringType(index - 5, "utf-16le").get(buffer, 5);
        while (view.getUint16(index) !== 0) {
          index += 2;
        }
        const description = new StringType(index - 5, "utf-16le").get(buffer, 5);
        return {
          type: AttachedPictureType[typeId],
          format,
          description,
          size,
          data: buffer.slice(index + 4)
        };
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/asf/AsfParser.js
var AsfParser_exports = {};
__export(AsfParser_exports, {
  AsfParser: () => AsfParser
});
var import_debug6, debug6, headerType, maxAsfMetadataObjectSize, AsfParser;
var init_AsfParser = __esm({
  "soda-player/node_modules/music-metadata/lib/asf/AsfParser.js"() {
    import_debug6 = __toESM(require_src(), 1);
    init_lib();
    init_BasicParser();
    init_type();
    init_AsfGuid();
    init_AsfObject();
    init_AsfObject();
    debug6 = (0, import_debug6.default)("music-metadata:parser:ASF");
    headerType = "asf";
    maxAsfMetadataObjectSize = 16 * 1024 * 1024;
    AsfParser = class extends BasicParser {
      async parse() {
        const header = await this.tokenizer.readToken(TopLevelHeaderObjectToken);
        if (!header.objectId.equals(AsfGuid.HeaderObject)) {
          throw new AsfContentParseError(`expected asf header; but was not found; got: ${header.objectId.str}`);
        }
        if (header.numberOfHeaderObjects < 1 || header.numberOfHeaderObjects > 1e4) {
          throw new AsfContentParseError(`Unrealistic number of ASF header objects: ${header.numberOfHeaderObjects}`);
        }
        await this.parseObjectHeaders(header.numberOfHeaderObjects, header.objectSize - TopLevelHeaderObjectToken.len);
      }
      async parseObjectHeaders(numberOfObjectHeaders, remainingHeaderSize) {
        let tags;
        for (let index = 0; index < numberOfObjectHeaders; ++index) {
          const { header, payloadSize } = await this.readObjectHeader(remainingHeaderSize, "header");
          debug6("header GUID=%s", header.objectId.str);
          switch (header.objectId.str) {
            case FilePropertiesObject.guid.str: {
              this.validateAllocationSize(payloadSize, "File Properties Object");
              const fpo = await this.tokenizer.readToken(new FilePropertiesObject(header));
              this.metadata.setFormat("duration", Number(fpo.playDuration / BigInt(1e3)) / 1e4 - Number(fpo.preroll) / 1e3);
              this.metadata.setFormat("bitrate", fpo.maximumBitrate);
              break;
            }
            case StreamPropertiesObject.guid.str: {
              this.validateAllocationSize(payloadSize, "Stream Properties Object");
              const spo = await this.tokenizer.readToken(new StreamPropertiesObject(header));
              this.metadata.setFormat("container", `ASF/${spo.streamType}`);
              break;
            }
            case HeaderExtensionObject.guid.str: {
              const extensionHeaderToken = new HeaderExtensionObject();
              if (payloadSize < extensionHeaderToken.len) {
                throw new AsfContentParseError(`ASF Header Extension Object payload is too small: ${payloadSize} bytes`);
              }
              const extHeader = await this.tokenizer.readToken(extensionHeaderToken);
              const expectedExtensionSize = payloadSize - extensionHeaderToken.len;
              if (extHeader.extensionDataSize !== expectedExtensionSize) {
                throw new AsfContentParseError(`ASF extension data size ${extHeader.extensionDataSize} does not match enclosing payload size ${expectedExtensionSize}`);
              }
              await this.parseExtensionObject(extHeader.extensionDataSize);
              break;
            }
            case ContentDescriptionObjectState.guid.str:
              this.validateAllocationSize(payloadSize, "Content Description Object");
              tags = await this.tokenizer.readToken(new ContentDescriptionObjectState(header));
              await this.addTags(tags);
              break;
            case ExtendedContentDescriptionObjectState.guid.str:
              this.validateAllocationSize(payloadSize, "Extended Content Description Object");
              tags = await this.tokenizer.readToken(new ExtendedContentDescriptionObjectState(header));
              await this.addTags(tags);
              break;
            case AsfGuid.CodecListObject.str: {
              this.validateAllocationSize(payloadSize, "Codec List Object");
              let codecs;
              try {
                codecs = await readCodecEntries(this.tokenizer, payloadSize);
              } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                throw new AsfContentParseError(`Invalid ASF Codec List Object: ${message}`);
              }
              codecs.forEach((codec) => {
                this.metadata.addStreamInfo({
                  type: codec.type.videoCodec ? TrackType.video : TrackType.audio,
                  codecName: codec.codecName
                });
              });
              const audioCodecs = codecs.filter((codec) => codec.type.audioCodec).map((codec) => codec.codecName).join("/");
              this.metadata.setFormat("codec", audioCodecs);
              break;
            }
            case AsfGuid.StreamBitratePropertiesObject.str:
              await this.ignorePayload(payloadSize, "Stream Bitrate Properties Object");
              break;
            case AsfGuid.PaddingObject.str:
              debug6("Padding: %s bytes", payloadSize);
              await this.ignorePayload(payloadSize, "Padding Object");
              break;
            default:
              this.metadata.addWarning(`Ignore ASF-Object-GUID: ${header.objectId.str}`);
              debug6("Ignore ASF-Object-GUID: %s", header.objectId.str);
              await this.ignorePayload(payloadSize, `object ${header.objectId.str}`);
          }
          remainingHeaderSize -= header.objectSize;
        }
        if (remainingHeaderSize !== 0) {
          throw new AsfContentParseError(`ASF header child objects leave ${remainingHeaderSize} payload byte(s) unaccounted`);
        }
      }
      async addTags(tags) {
        await Promise.all(tags.map(({ id, value }) => this.metadata.addTag(headerType, id, value)));
      }
      async readObjectHeader(remainingSize, containerType) {
        if (remainingSize < HeaderObjectToken.len) {
          throw new AsfContentParseError(`Insufficient ASF ${containerType} data for an object header: ${remainingSize} bytes`);
        }
        const header = await this.tokenizer.readToken(HeaderObjectToken);
        if (header.objectSize > remainingSize) {
          throw new AsfContentParseError(`ASF ${containerType} object size ${header.objectSize} exceeds remaining ${containerType} payload size ${remainingSize}`);
        }
        return {
          header,
          payloadSize: this.validatePayloadAvailability(header, `${containerType} object`)
        };
      }
      validatePayloadAvailability(header, objectType) {
        const payloadSize = header.objectSize - HeaderObjectToken.len;
        const fileSize = this.tokenizer.fileInfo.size;
        if (fileSize !== void 0) {
          const available = fileSize - this.tokenizer.position;
          if (payloadSize > available) {
            throw new AsfContentParseError(`ASF ${objectType} payload size ${payloadSize} exceeds available input size ${available}`);
          }
        }
        return payloadSize;
      }
      validateAllocationSize(payloadSize, objectType) {
        if (payloadSize > maxAsfMetadataObjectSize) {
          throw new AsfContentParseError(`ASF ${objectType} payload size ${payloadSize} exceeds allocation limit ${maxAsfMetadataObjectSize}`);
        }
      }
      async ignorePayload(payloadSize, objectType) {
        let ignored;
        try {
          ignored = await this.tokenizer.ignore(payloadSize);
        } catch (error) {
          if (error instanceof EndOfStreamError) {
            throw new AsfContentParseError(`Unexpected end of ASF ${objectType}`);
          }
          throw error;
        }
        if (ignored !== payloadSize) {
          throw new AsfContentParseError(`Unexpected end of ASF ${objectType}; missing ${payloadSize - ignored} bytes`);
        }
      }
      async parseExtensionObject(extensionSize) {
        while (extensionSize > 0) {
          const { header, payloadSize } = await this.readObjectHeader(extensionSize, "extension");
          switch (header.objectId.str) {
            case ExtendedStreamPropertiesObjectState.guid.str:
              this.validateAllocationSize(payloadSize, "Extended Stream Properties Object");
              await this.tokenizer.readToken(new ExtendedStreamPropertiesObjectState(header));
              break;
            case MetadataObjectState.guid.str: {
              this.validateAllocationSize(payloadSize, "Metadata Object");
              const moTags = await this.tokenizer.readToken(new MetadataObjectState(header));
              await this.addTags(moTags);
              break;
            }
            case MetadataLibraryObjectState.guid.str: {
              this.validateAllocationSize(payloadSize, "Metadata Library Object");
              const mlTags = await this.tokenizer.readToken(new MetadataLibraryObjectState(header));
              await this.addTags(mlTags);
              break;
            }
            case AsfGuid.PaddingObject.str:
              await this.ignorePayload(payloadSize, "extension Padding Object");
              break;
            case AsfGuid.CompatibilityObject.str:
              await this.ignorePayload(payloadSize, "Compatibility Object");
              break;
            case AsfGuid.ASF_Index_Placeholder_Object.str:
              await this.ignorePayload(payloadSize, "Index Placeholder Object");
              break;
            default:
              this.metadata.addWarning(`Ignore ASF-Object-GUID: ${header.objectId.str}`);
              await this.ignorePayload(payloadSize, `extension object ${header.objectId.str}`);
              break;
          }
          extensionSize -= header.objectSize;
        }
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/dsdiff/DsdiffToken.js
var ChunkHeader64;
var init_DsdiffToken = __esm({
  "soda-player/node_modules/music-metadata/lib/dsdiff/DsdiffToken.js"() {
    init_lib3();
    init_FourCC();
    ChunkHeader64 = {
      len: 12,
      get: (buf, off) => {
        return {
          // Group-ID
          chunkID: FourCcToken.get(buf, off),
          // Size
          chunkSize: INT64_BE.get(buf, off + 4)
        };
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/dsdiff/DsdiffParser.js
var DsdiffParser_exports = {};
__export(DsdiffParser_exports, {
  DsdiffContentParseError: () => DsdiffContentParseError,
  DsdiffParser: () => DsdiffParser
});
var import_debug8, debug8, DsdiffContentParseError, DsdiffParser;
var init_DsdiffParser = __esm({
  "soda-player/node_modules/music-metadata/lib/dsdiff/DsdiffParser.js"() {
    import_debug8 = __toESM(require_src(), 1);
    init_lib();
    init_lib3();
    init_BasicParser();
    init_FourCC();
    init_ID3v2Parser();
    init_ParseError();
    init_DsdiffToken();
    debug8 = (0, import_debug8.default)("music-metadata:parser:aiff");
    DsdiffContentParseError = class extends makeUnexpectedFileContentError("DSDIFF") {
    };
    DsdiffParser = class extends BasicParser {
      async parse() {
        const header = await this.tokenizer.readToken(ChunkHeader64);
        if (header.chunkID !== "FRM8") {
          throw new DsdiffContentParseError("Unexpected chunk-ID");
        }
        this.metadata.setAudioOnly();
        const type = (await this.tokenizer.readToken(FourCcToken)).trim();
        switch (type) {
          case "DSD":
            this.metadata.setFormat("container", `DSDIFF/${type}`);
            this.metadata.setFormat("lossless", true);
            return this.readFmt8Chunks(header.chunkSize - BigInt(FourCcToken.len));
          default:
            throw new DsdiffContentParseError(`Unsupported DSDIFF type: ${type}`);
        }
      }
      async readFmt8Chunks(remainingSize) {
        while (remainingSize >= ChunkHeader64.len) {
          const chunkHeader = await this.tokenizer.readToken(ChunkHeader64);
          debug8(`Chunk id=${chunkHeader.chunkID}`);
          await this.readData(chunkHeader);
          remainingSize -= BigInt(ChunkHeader64.len) + chunkHeader.chunkSize;
        }
      }
      async readData(header) {
        debug8(`Reading data of chunk[ID=${header.chunkID}, size=${header.chunkSize}]`);
        const p0 = this.tokenizer.position;
        switch (header.chunkID.trim()) {
          case "FVER": {
            const version = await this.tokenizer.readToken(UINT32_LE);
            debug8(`DSDIFF version=${version}`);
            break;
          }
          case "PROP": {
            const propType = await this.tokenizer.readToken(FourCcToken);
            if (propType !== "SND ") {
              throw new DsdiffContentParseError("Unexpected PROP-chunk ID");
            }
            await this.handleSoundPropertyChunks(header.chunkSize - BigInt(FourCcToken.len));
            break;
          }
          case "ID3": {
            const id3_data = await this.tokenizer.readToken(new Uint8ArrayType(Number(header.chunkSize)));
            const rst = fromBuffer(id3_data);
            await new ID3v2Parser().parse(this.metadata, rst, this.options);
            break;
          }
          case "DSD":
            if (this.metadata.format.numberOfChannels) {
              this.metadata.setFormat("numberOfSamples", Number(header.chunkSize * BigInt(8) / BigInt(this.metadata.format.numberOfChannels)));
            }
            if (this.metadata.format.numberOfSamples && this.metadata.format.sampleRate) {
              this.metadata.setFormat("duration", this.metadata.format.numberOfSamples / this.metadata.format.sampleRate);
            }
            break;
          default:
            debug8(`Ignore chunk[ID=${header.chunkID}, size=${header.chunkSize}]`);
            break;
        }
        const remaining = header.chunkSize - BigInt(this.tokenizer.position - p0);
        if (remaining > 0) {
          debug8(`After Parsing chunk, remaining ${remaining} bytes`);
          await this.tokenizer.ignore(Number(remaining));
        }
      }
      async handleSoundPropertyChunks(remainingSize) {
        debug8(`Parsing sound-property-chunks, remainingSize=${remainingSize}`);
        while (remainingSize > 0) {
          const sndPropHeader = await this.tokenizer.readToken(ChunkHeader64);
          debug8(`Sound-property-chunk[ID=${sndPropHeader.chunkID}, size=${sndPropHeader.chunkSize}]`);
          const p0 = this.tokenizer.position;
          switch (sndPropHeader.chunkID.trim()) {
            case "FS": {
              const sampleRate = await this.tokenizer.readToken(UINT32_BE);
              this.metadata.setFormat("sampleRate", sampleRate);
              break;
            }
            case "CHNL": {
              const numChannels = await this.tokenizer.readToken(UINT16_BE);
              this.metadata.setFormat("numberOfChannels", numChannels);
              await this.handleChannelChunks(sndPropHeader.chunkSize - BigInt(UINT16_BE.len));
              break;
            }
            case "CMPR": {
              const compressionIdCode = (await this.tokenizer.readToken(FourCcToken)).trim();
              const count = await this.tokenizer.readToken(UINT8);
              const compressionName = await this.tokenizer.readToken(new StringType(count, "ascii"));
              if (compressionIdCode === "DSD") {
                this.metadata.setFormat("lossless", true);
                this.metadata.setFormat("bitsPerSample", 1);
              }
              this.metadata.setFormat("codec", `${compressionIdCode} (${compressionName})`);
              break;
            }
            case "ABSS": {
              const hours = await this.tokenizer.readToken(UINT16_BE);
              const minutes = await this.tokenizer.readToken(UINT8);
              const seconds = await this.tokenizer.readToken(UINT8);
              const samples = await this.tokenizer.readToken(UINT32_BE);
              debug8(`ABSS ${hours}:${minutes}:${seconds}.${samples}`);
              break;
            }
            case "LSCO": {
              const lsConfig = await this.tokenizer.readToken(UINT16_BE);
              debug8(`LSCO lsConfig=${lsConfig}`);
              break;
            }
            default:
              debug8(`Unknown sound-property-chunk[ID=${sndPropHeader.chunkID}, size=${sndPropHeader.chunkSize}]`);
              await this.tokenizer.ignore(Number(sndPropHeader.chunkSize));
          }
          const remaining = sndPropHeader.chunkSize - BigInt(this.tokenizer.position - p0);
          if (remaining > 0) {
            debug8(`After Parsing sound-property-chunk ${sndPropHeader.chunkSize}, remaining ${remaining} bytes`);
            await this.tokenizer.ignore(Number(remaining));
          }
          remainingSize -= BigInt(ChunkHeader64.len) + sndPropHeader.chunkSize;
          debug8(`Parsing sound-property-chunks, remainingSize=${remainingSize}`);
        }
        if (this.metadata.format.lossless && this.metadata.format.sampleRate && this.metadata.format.numberOfChannels && this.metadata.format.bitsPerSample) {
          const bitrate = this.metadata.format.sampleRate * this.metadata.format.numberOfChannels * this.metadata.format.bitsPerSample;
          this.metadata.setFormat("bitrate", bitrate);
        }
      }
      async handleChannelChunks(remainingSize) {
        debug8(`Parsing channel-chunks, remainingSize=${remainingSize}`);
        const channels = [];
        while (remainingSize >= FourCcToken.len) {
          const channelId = await this.tokenizer.readToken(FourCcToken);
          debug8(`Channel[ID=${channelId}]`);
          channels.push(channelId);
          remainingSize -= BigInt(FourCcToken.len);
        }
        debug8(`Channels: ${channels.join(", ")}`);
        return channels;
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/id3v2/AbstractID3Parser.js
var import_debug9, debug9, AbstractID3Parser;
var init_AbstractID3Parser = __esm({
  "soda-player/node_modules/music-metadata/lib/id3v2/AbstractID3Parser.js"() {
    import_debug9 = __toESM(require_src(), 1);
    init_lib();
    init_BasicParser();
    init_ID3v1Parser();
    init_ID3v2Parser();
    init_ID3v2Token();
    debug9 = (0, import_debug9.default)("music-metadata:parser:ID3");
    AbstractID3Parser = class extends BasicParser {
      static async startsWithID3v2Header(tokenizer) {
        return (await tokenizer.peekToken(ID3v2Header)).fileIdentifier === "ID3";
      }
      id3parser = new ID3v2Parser();
      async parse() {
        try {
          await this.parseID3v2();
        } catch (err) {
          if (err instanceof EndOfStreamError) {
            debug9("End-of-stream");
          } else {
            throw err;
          }
        }
      }
      finalize() {
        return;
      }
      async parseID3v2() {
        await this.tryReadId3v2Headers();
        debug9("End of ID3v2 header, go to MPEG-parser: pos=%s", this.tokenizer.position);
        await this.postId3v2Parse();
        if (this.options.skipPostHeaders && this.metadata.hasAny()) {
          this.finalize();
        } else {
          const id3v1parser = new ID3v1Parser(this.metadata, this.tokenizer, this.options);
          await id3v1parser.parse();
          this.finalize();
        }
      }
      async tryReadId3v2Headers() {
        const id3Header = await this.tokenizer.peekToken(ID3v2Header);
        if (id3Header.fileIdentifier === "ID3") {
          debug9("Found ID3v2 header, pos=%s", this.tokenizer.position);
          await this.id3parser.parse(this.metadata, this.tokenizer, this.options);
          return this.tryReadId3v2Headers();
        }
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/dsf/DsfChunk.js
var ChunkHeader, DsdChunk, FormatChunk;
var init_DsfChunk = __esm({
  "soda-player/node_modules/music-metadata/lib/dsf/DsfChunk.js"() {
    init_lib3();
    init_FourCC();
    ChunkHeader = {
      len: 12,
      get: (buf, off) => {
        return { id: FourCcToken.get(buf, off), size: UINT64_LE.get(buf, off + 4) };
      }
    };
    DsdChunk = {
      len: 16,
      get: (buf, off) => {
        return {
          fileSize: UINT64_LE.get(buf, off),
          metadataPointer: UINT64_LE.get(buf, off + 8)
        };
      }
    };
    FormatChunk = {
      len: 40,
      get: (buf, off) => {
        return {
          formatVersion: INT32_LE.get(buf, off),
          formatID: INT32_LE.get(buf, off + 4),
          channelType: INT32_LE.get(buf, off + 8),
          channelNum: INT32_LE.get(buf, off + 12),
          samplingFrequency: INT32_LE.get(buf, off + 16),
          bitsPerSample: INT32_LE.get(buf, off + 20),
          sampleCount: INT64_LE.get(buf, off + 24),
          blockSizePerChannel: INT32_LE.get(buf, off + 32)
        };
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/dsf/DsfParser.js
var DsfParser_exports = {};
__export(DsfParser_exports, {
  DsdContentParseError: () => DsdContentParseError,
  DsfParser: () => DsfParser
});
var import_debug10, debug10, DsdContentParseError, DsfParser;
var init_DsfParser = __esm({
  "soda-player/node_modules/music-metadata/lib/dsf/DsfParser.js"() {
    import_debug10 = __toESM(require_src(), 1);
    init_AbstractID3Parser();
    init_ID3v2Parser();
    init_ID3v2Token();
    init_ParseError();
    init_DsfChunk();
    debug10 = (0, import_debug10.default)("music-metadata:parser:DSF");
    DsdContentParseError = class extends makeUnexpectedFileContentError("DSD") {
    };
    DsfParser = class extends AbstractID3Parser {
      async postId3v2Parse() {
        const p0 = this.tokenizer.position;
        const chunkHeader = await this.tokenizer.readToken(ChunkHeader);
        if (chunkHeader.id !== "DSD ") {
          throw new DsdContentParseError("Invalid chunk signature");
        }
        if (chunkHeader.size !== BigInt(ChunkHeader.len + DsdChunk.len)) {
          throw new DsdContentParseError(`Invalid DSD chunk size: ${chunkHeader.size}`);
        }
        this.metadata.setFormat("container", "DSF");
        this.metadata.setFormat("lossless", true);
        this.metadata.setAudioOnly();
        const dsdChunk = await this.tokenizer.readToken(DsdChunk);
        if (dsdChunk.fileSize < chunkHeader.size) {
          throw new DsdContentParseError(`Invalid DSF file size: ${dsdChunk.fileSize}`);
        }
        await this.parseChunks(dsdChunk.fileSize - chunkHeader.size);
        if (dsdChunk.metadataPointer === 0n) {
          debug10("No ID3v2 tag present");
          return;
        }
        debug10(`expect ID3v2 at offset=${dsdChunk.metadataPointer}`);
        const metadataOffset = dsdChunk.metadataPointer - BigInt(this.tokenizer.position - p0);
        if (metadataOffset < 0n || metadataOffset > BigInt(Number.MAX_SAFE_INTEGER) || dsdChunk.metadataPointer + BigInt(ID3v2Header.len) > dsdChunk.fileSize) {
          throw new DsdContentParseError(`Invalid metadata pointer: ${dsdChunk.metadataPointer}`);
        }
        await this.tokenizer.ignore(Number(metadataOffset));
        return new ID3v2Parser().parse(this.metadata, this.tokenizer, this.options);
      }
      async parseChunks(bytesRemaining) {
        const chunkHeaderSize = BigInt(ChunkHeader.len);
        while (bytesRemaining >= chunkHeaderSize) {
          const chunkHeader = await this.tokenizer.readToken(ChunkHeader);
          debug10(`Parsing chunk name=${chunkHeader.id} size=${chunkHeader.size}`);
          if (chunkHeader.size < chunkHeaderSize) {
            throw new DsdContentParseError(`Invalid ${chunkHeader.id} chunk size: ${chunkHeader.size}`);
          }
          if (chunkHeader.size > bytesRemaining) {
            throw new DsdContentParseError(`${chunkHeader.id} chunk exceeds remaining file size`);
          }
          const payloadSize = chunkHeader.size - chunkHeaderSize;
          switch (chunkHeader.id) {
            case "fmt ": {
              if (payloadSize < BigInt(FormatChunk.len)) {
                throw new DsdContentParseError(`Invalid fmt chunk size: ${chunkHeader.size}`);
              }
              const formatChunk = await this.tokenizer.readToken(FormatChunk);
              this.metadata.setFormat("numberOfChannels", formatChunk.channelNum);
              this.metadata.setFormat("sampleRate", formatChunk.samplingFrequency);
              this.metadata.setFormat("bitsPerSample", formatChunk.bitsPerSample);
              this.metadata.setFormat("numberOfSamples", formatChunk.sampleCount);
              this.metadata.setFormat("duration", Number(formatChunk.sampleCount) / formatChunk.samplingFrequency);
              const bitrate = formatChunk.bitsPerSample * formatChunk.samplingFrequency * formatChunk.channelNum;
              this.metadata.setFormat("bitrate", bitrate);
              return;
            }
            default:
              await this.tokenizer.ignore(Number(payloadSize));
              break;
          }
          bytesRemaining -= chunkHeader.size;
        }
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/ogg/vorbis/Vorbis.js
var VorbisPictureToken, CommonHeader, IdentificationHeader;
var init_Vorbis = __esm({
  "soda-player/node_modules/music-metadata/lib/ogg/vorbis/Vorbis.js"() {
    init_lib3();
    init_ID3v2Token();
    VorbisPictureToken = class _VorbisPictureToken {
      static fromBase64(base64str) {
        return _VorbisPictureToken.fromBuffer(Uint8Array.from(atob(base64str), (c) => c.charCodeAt(0)));
      }
      static fromBuffer(buffer) {
        const pic = new _VorbisPictureToken(buffer.length);
        return pic.get(buffer, 0);
      }
      len;
      constructor(len) {
        this.len = len;
      }
      get(buffer, offset) {
        const type = AttachedPictureType[UINT32_BE.get(buffer, offset)];
        offset += 4;
        const mimeLen = UINT32_BE.get(buffer, offset);
        offset += 4;
        const format = new StringType(mimeLen, "utf-8").get(buffer, offset);
        offset += mimeLen;
        const descLen = UINT32_BE.get(buffer, offset);
        offset += 4;
        const description = new StringType(descLen, "utf-8").get(buffer, offset);
        offset += descLen;
        const width = UINT32_BE.get(buffer, offset);
        offset += 4;
        const height = UINT32_BE.get(buffer, offset);
        offset += 4;
        const colour_depth = UINT32_BE.get(buffer, offset);
        offset += 4;
        const indexed_color = UINT32_BE.get(buffer, offset);
        offset += 4;
        const picDataLen = UINT32_BE.get(buffer, offset);
        offset += 4;
        const data = buffer.slice(offset, offset + picDataLen);
        return {
          type,
          format,
          description,
          width,
          height,
          colour_depth,
          indexed_color,
          data
        };
      }
    };
    CommonHeader = {
      len: 7,
      get: (buf, off) => {
        return {
          packetType: UINT8.get(buf, off),
          vorbis: new StringType(6, "ascii").get(buf, off + 1)
        };
      }
    };
    IdentificationHeader = {
      len: 23,
      get: (uint8Array, off) => {
        return {
          version: UINT32_LE.get(uint8Array, off + 0),
          channelMode: UINT8.get(uint8Array, off + 4),
          sampleRate: UINT32_LE.get(uint8Array, off + 5),
          bitrateMax: UINT32_LE.get(uint8Array, off + 9),
          bitrateNominal: UINT32_LE.get(uint8Array, off + 13),
          bitrateMin: UINT32_LE.get(uint8Array, off + 17)
        };
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/ogg/vorbis/VorbisDecoder.js
var VorbisDecoder;
var init_VorbisDecoder = __esm({
  "soda-player/node_modules/music-metadata/lib/ogg/vorbis/VorbisDecoder.js"() {
    init_lib2();
    init_lib3();
    VorbisDecoder = class {
      data;
      offset;
      constructor(data, offset) {
        this.data = data;
        this.offset = offset;
      }
      readInt32() {
        const value = UINT32_LE.get(this.data, this.offset);
        this.offset += 4;
        return value;
      }
      readStringUtf8() {
        const len = this.readInt32();
        const value = textDecode(this.data.subarray(this.offset, this.offset + len), "utf-8");
        this.offset += len;
        return value;
      }
      parseUserComment() {
        const offset0 = this.offset;
        const v = this.readStringUtf8();
        const idx = v.indexOf("=");
        return {
          key: v.substring(0, idx).toUpperCase(),
          value: v.substring(idx + 1),
          len: this.offset - offset0
        };
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/ogg/vorbis/VorbisStream.js
var import_debug11, debug11, VorbisContentError, VorbisStream;
var init_VorbisStream = __esm({
  "soda-player/node_modules/music-metadata/lib/ogg/vorbis/VorbisStream.js"() {
    import_debug11 = __toESM(require_src(), 1);
    init_lib3();
    init_ParseError();
    init_Vorbis();
    init_VorbisDecoder();
    debug11 = (0, import_debug11.default)("music-metadata:parser:ogg:vorbis1");
    VorbisContentError = class extends makeUnexpectedFileContentError("Vorbis") {
    };
    VorbisStream = class _VorbisStream {
      pageSegments = [];
      metadata;
      options;
      lastPageHeader;
      durationOnLastPage = true;
      isMetadataComplete = false;
      constructor(metadata, options) {
        this.metadata = metadata;
        this.options = options;
      }
      /**
       * Vorbis 1 parser
       * @param header Ogg Page Header
       * @param pageData Page data
       */
      async parsePage(header, pageData) {
        this.lastPageHeader = header;
        if (header.headerType.firstPage) {
          this.parseFirstPage(header, pageData);
        } else {
          if (header.headerType.continued) {
            if (this.pageSegments.length === 0) {
              throw new VorbisContentError("Cannot continue on previous page");
            }
            this.pageSegments.push(pageData);
          }
          if (header.headerType.lastPage || !header.headerType.continued) {
            if (this.pageSegments.length > 0) {
              const fullPage = _VorbisStream.mergeUint8Arrays(this.pageSegments);
              await this.parseFullPage(fullPage);
            }
            this.pageSegments = header.headerType.lastPage ? [] : [pageData];
          }
        }
      }
      static mergeUint8Arrays(arrays) {
        const totalSize = arrays.reduce((acc, e) => acc + e.length, 0);
        const merged = new Uint8Array(totalSize);
        arrays.forEach((array, i, _arrays) => {
          const offset = _arrays.slice(0, i).reduce((acc, e) => acc + e.length, 0);
          merged.set(array, offset);
        });
        return merged;
      }
      async flush() {
        await this.parseFullPage(_VorbisStream.mergeUint8Arrays(this.pageSegments));
      }
      async parseUserComment(pageData, offset) {
        const decoder = new VorbisDecoder(pageData, offset);
        const tag = decoder.parseUserComment();
        await this.addTag(tag.key, tag.value);
        return tag.len;
      }
      async addTag(id, value) {
        if (id === "METADATA_BLOCK_PICTURE" && typeof value === "string") {
          if (this.options.skipCovers) {
            debug11("Ignore picture");
            return;
          }
          value = VorbisPictureToken.fromBase64(value);
          debug11(`Push picture: id=${id}, format=${value.format}`);
        } else {
          debug11(`Push tag: id=${id}, value=${value}`);
        }
        await this.metadata.addTag("vorbis", id, value);
      }
      calculateDuration(enfOfStream) {
        if (this.lastPageHeader && (enfOfStream || this.lastPageHeader.headerType.lastPage) && this.metadata.format.sampleRate && this.lastPageHeader.absoluteGranulePosition >= 0) {
          this.metadata.setFormat("numberOfSamples", this.lastPageHeader.absoluteGranulePosition);
          this.metadata.setFormat("duration", this.lastPageHeader.absoluteGranulePosition / this.metadata.format.sampleRate);
        }
      }
      /**
       * Parse first Ogg/Vorbis page
       * @param _header
       * @param pageData
       */
      parseFirstPage(_header, pageData) {
        this.metadata.setFormat("codec", "Vorbis I");
        this.metadata.setFormat("hasAudio", true);
        debug11("Parse first page");
        const commonHeader = CommonHeader.get(pageData, 0);
        if (commonHeader.vorbis !== "vorbis") {
          throw new VorbisContentError("Metadata does not look like Vorbis");
        }
        if (commonHeader.packetType === 1) {
          const idHeader = IdentificationHeader.get(pageData, CommonHeader.len);
          this.metadata.setFormat("sampleRate", idHeader.sampleRate);
          this.metadata.setFormat("bitrate", idHeader.bitrateNominal);
          this.metadata.setFormat("numberOfChannels", idHeader.channelMode);
          debug11("sample-rate=%s[hz], bitrate=%s[b/s], channel-mode=%s", idHeader.sampleRate, idHeader.bitrateNominal, idHeader.channelMode);
        } else {
          throw new VorbisContentError("First Ogg page should be type 1: the identification header");
        }
      }
      async parseFullPage(pageData) {
        const commonHeader = CommonHeader.get(pageData, 0);
        debug11("Parse full page: type=%s, byteLength=%s", commonHeader.packetType, pageData.byteLength);
        switch (commonHeader.packetType) {
          case 3:
            return this.parseUserCommentList(pageData, CommonHeader.len);
          case 1:
          // type 1: the identification header
          case 5:
            break;
        }
      }
      /**
       * Ref: https://xiph.org/vorbis/doc/Vorbis_I_spec.html#x1-840005.2
       */
      async parseUserCommentList(pageData, offset) {
        const strLen = UINT32_LE.get(pageData, offset);
        offset += 4;
        offset += strLen;
        let userCommentListLength = UINT32_LE.get(pageData, offset);
        offset += 4;
        while (userCommentListLength-- > 0) {
          offset += await this.parseUserComment(pageData, offset);
        }
        this.isMetadataComplete = true;
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/flac/FlacToken.js
var BlockType, BlockHeader, BlockStreamInfo;
var init_FlacToken = __esm({
  "soda-player/node_modules/music-metadata/lib/flac/FlacToken.js"() {
    init_lib3();
    init_Util();
    BlockType = {
      STREAMINFO: 0,
      // STREAMINFO
      PADDING: 1,
      // PADDING
      APPLICATION: 2,
      // APPLICATION
      SEEKTABLE: 3,
      // SEEKTABLE
      VORBIS_COMMENT: 4,
      // VORBIS_COMMENT
      CUESHEET: 5,
      // CUESHEET
      PICTURE: 6
      // PICTURE
    };
    BlockHeader = {
      len: 4,
      get: (buf, off) => {
        return {
          lastBlock: getBit(buf, off, 7),
          type: getBitAllignedNumber(buf, off, 1, 7),
          length: UINT24_BE.get(buf, off + 1)
        };
      }
    };
    BlockStreamInfo = {
      len: 34,
      get: (buf, off) => {
        return {
          // The minimum block size (in samples) used in the stream.
          minimumBlockSize: UINT16_BE.get(buf, off),
          // The maximum block size (in samples) used in the stream.
          // (Minimum blocksize == maximum blocksize) implies a fixed-blocksize stream.
          maximumBlockSize: UINT16_BE.get(buf, off + 2) / 1e3,
          // The minimum frame size (in bytes) used in the stream.
          // May be 0 to imply the value is not known.
          minimumFrameSize: UINT24_BE.get(buf, off + 4),
          // The maximum frame size (in bytes) used in the stream.
          // May be 0 to imply the value is not known.
          maximumFrameSize: UINT24_BE.get(buf, off + 7),
          // Sample rate in Hz. Though 20 bits are available,
          // the maximum sample rate is limited by the structure of frame headers to 655350Hz.
          // Also, a value of 0 is invalid.
          sampleRate: UINT24_BE.get(buf, off + 10) >> 4,
          // probably slower: sampleRate: common.getBitAllignedNumber(buf, off + 10, 0, 20),
          // (number of channels)-1. FLAC supports from 1 to 8 channels
          channels: getBitAllignedNumber(buf, off + 12, 4, 3) + 1,
          // bits per sample)-1.
          // FLAC supports from 4 to 32 bits per sample. Currently the reference encoder and decoders only support up to 24 bits per sample.
          bitsPerSample: getBitAllignedNumber(buf, off + 12, 7, 5) + 1,
          // Total samples in stream.
          // 'Samples' means inter-channel sample, i.e. one second of 44.1Khz audio will have 44100 samples regardless of the number of channels.
          // A value of zero here means the number of total samples is unknown.
          totalSamples: getBitAllignedNumber(buf, off + 13, 4, 36),
          // the MD5 hash of the file (see notes for usage... it's a littly tricky)
          fileMD5: new Uint8ArrayType(16).get(buf, off + 18)
        };
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/flac/FlacParser.js
var FlacParser_exports = {};
__export(FlacParser_exports, {
  FlacParser: () => FlacParser
});
var import_debug12, debug12, FlacContentError, FlacParser;
var init_FlacParser = __esm({
  "soda-player/node_modules/music-metadata/lib/flac/FlacParser.js"() {
    import_debug12 = __toESM(require_src(), 1);
    init_lib3();
    init_FourCC();
    init_AbstractID3Parser();
    init_Vorbis();
    init_VorbisDecoder();
    init_VorbisStream();
    init_ParseError();
    init_FlacToken();
    debug12 = (0, import_debug12.default)("music-metadata:parser:FLAC");
    FlacContentError = class extends makeUnexpectedFileContentError("FLAC") {
    };
    FlacParser = class extends AbstractID3Parser {
      vorbisParser = new VorbisStream(this.metadata, this.options);
      async postId3v2Parse() {
        const fourCC = await this.tokenizer.readToken(FourCcToken);
        if (fourCC.toString() !== "fLaC") {
          throw new FlacContentError("Invalid FLAC preamble");
        }
        let blockHeader;
        do {
          blockHeader = await this.tokenizer.readToken(BlockHeader);
          await this.parseDataBlock(blockHeader);
        } while (!blockHeader.lastBlock);
        if (this.tokenizer.fileInfo.size && this.metadata.format.duration) {
          const dataSize = this.tokenizer.fileInfo.size - this.tokenizer.position;
          this.metadata.setFormat("bitrate", 8 * dataSize / this.metadata.format.duration);
        }
      }
      async parseDataBlock(blockHeader) {
        debug12(`blockHeader type=${blockHeader.type}, length=${blockHeader.length}`);
        switch (blockHeader.type) {
          case BlockType.STREAMINFO:
            return this.readBlockStreamInfo(blockHeader.length);
          case BlockType.PADDING:
            break;
          case BlockType.APPLICATION:
            break;
          case BlockType.SEEKTABLE:
            break;
          case BlockType.VORBIS_COMMENT:
            return this.readComment(blockHeader.length);
          case BlockType.CUESHEET:
            break;
          case BlockType.PICTURE:
            await this.parsePicture(blockHeader.length);
            return;
          default:
            this.metadata.addWarning(`Unknown block type: ${blockHeader.type}`);
        }
        return this.tokenizer.ignore(blockHeader.length).then();
      }
      /**
       * Parse STREAMINFO
       */
      async readBlockStreamInfo(dataLen) {
        if (dataLen !== BlockStreamInfo.len) {
          throw new FlacContentError("Unexpected block-stream-info length");
        }
        const streamInfo = await this.tokenizer.readToken(BlockStreamInfo);
        this.metadata.setFormat("container", "FLAC");
        this.processsStreamInfo(streamInfo);
      }
      /**
       * Parse STREAMINFO
       */
      processsStreamInfo(streamInfo) {
        this.metadata.setFormat("codec", "FLAC");
        this.metadata.setFormat("hasAudio", true);
        this.metadata.setFormat("lossless", true);
        this.metadata.setFormat("numberOfChannels", streamInfo.channels);
        this.metadata.setFormat("bitsPerSample", streamInfo.bitsPerSample);
        this.metadata.setFormat("sampleRate", streamInfo.sampleRate);
        if (streamInfo.totalSamples > 0) {
          this.metadata.setFormat("duration", streamInfo.totalSamples / streamInfo.sampleRate);
        }
      }
      /**
       * Read VORBIS_COMMENT from tokenizer
       * Ref: https://www.xiph.org/vorbis/doc/Vorbis_I_spec.html#x1-640004.2.3
       */
      async readComment(dataLen) {
        const data = await this.tokenizer.readToken(new Uint8ArrayType(dataLen));
        return this.parseComment(data);
      }
      /**
       * Parse VORBIS_COMMENT
       * Ref: https://www.xiph.org/vorbis/doc/Vorbis_I_spec.html#x1-640004.2.3
       */
      async parseComment(data) {
        const decoder = new VorbisDecoder(data, 0);
        const vendor = decoder.readStringUtf8();
        if (vendor.length > 0) {
          this.metadata.setFormat("tool", vendor);
        }
        const commentListLength = decoder.readInt32();
        const tags = new Array(commentListLength);
        for (let i = 0; i < commentListLength; i++) {
          tags[i] = decoder.parseUserComment();
        }
        await Promise.all(tags.map((tag) => {
          if (tag.key === "ENCODER") {
            this.metadata.setFormat("tool", tag.value);
          }
          return this.addTag(tag.key, tag.value);
        }));
      }
      async parsePicture(dataLen) {
        if (this.options.skipCovers) {
          return this.tokenizer.ignore(dataLen);
        }
        return this.addPictureTag(await this.tokenizer.readToken(new VorbisPictureToken(dataLen)));
      }
      addPictureTag(picture) {
        return this.addTag("METADATA_BLOCK_PICTURE", picture);
      }
      addTag(id, value) {
        return this.vorbisParser.addTag(id, value);
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/ebml/types.js
var DataType2;
var init_types2 = __esm({
  "soda-player/node_modules/music-metadata/lib/ebml/types.js"() {
    DataType2 = {
      string: 0,
      uint: 1,
      uid: 2,
      bool: 3,
      binary: 4,
      float: 5
    };
  }
});

// soda-player/node_modules/music-metadata/lib/ebml/EbmlIterator.js
function readUIntBE(buf, len) {
  return Number(readUIntBeAsBigInt(buf, len));
}
function readUIntBeAsBigInt(buf, len) {
  const normalizedNumber = new Uint8Array(8);
  const cleanNumber = buf.subarray(0, len);
  try {
    normalizedNumber.set(cleanNumber, 8 - len);
    return UINT64_BE.get(normalizedNumber, 0);
  } catch (_error) {
    return BigInt(-1);
  }
}
function linkParents(element) {
  if (element.container) {
    Object.keys(element.container).map((id) => {
      const child = element.container[id];
      child.id = Number.parseInt(id, 10);
      return child;
    }).forEach((child) => {
      child.parent = element;
      linkParents(child);
    });
  }
  return element;
}
function getElementPath(element) {
  let path2 = "";
  if (element.parent && element.parent.name !== "dtd") {
    path2 += `${getElementPath(element.parent)}/`;
  }
  return path2 + element.name;
}
var import_debug13, debug13, EbmlContentError, ParseAction, EbmlIterator;
var init_EbmlIterator = __esm({
  "soda-player/node_modules/music-metadata/lib/ebml/EbmlIterator.js"() {
    import_debug13 = __toESM(require_src(), 1);
    init_lib();
    init_lib3();
    init_lib3();
    init_ParseError();
    init_types2();
    debug13 = (0, import_debug13.default)("music-metadata:parser:ebml");
    EbmlContentError = class extends makeUnexpectedFileContentError("EBML") {
    };
    ParseAction = {
      ReadNext: 0,
      // Continue reading the next elements
      IgnoreElement: 2,
      // Ignore (do not read) this element
      SkipSiblings: 3,
      // Skip all remaining elements at the same level
      TerminateParsing: 4,
      // Terminate the parsing process
      SkipElement: 5
      // Consider the element has read, assume position is at the next element
    };
    EbmlIterator = class {
      parserMap = /* @__PURE__ */ new Map();
      ebmlMaxIDLength = 4;
      ebmlMaxSizeLength = 8;
      tokenizer;
      /**
       * @param {ITokenizer} tokenizer Input
       * @param tokenizer
       */
      constructor(tokenizer) {
        this.tokenizer = tokenizer;
        this.parserMap.set(DataType2.uint, (e) => this.readUint(e));
        this.parserMap.set(DataType2.string, (e) => this.readString(e));
        this.parserMap.set(DataType2.binary, (e) => this.readBuffer(e));
        this.parserMap.set(DataType2.uid, async (e) => this.readBuffer(e));
        this.parserMap.set(DataType2.bool, (e) => this.readFlag(e));
        this.parserMap.set(DataType2.float, (e) => this.readFloat(e));
      }
      async iterate(dtdElement, posDone, listener) {
        return this.parseContainer(linkParents(dtdElement), posDone, listener);
      }
      async parseContainer(dtdElement, posDone, listener) {
        const tree = {};
        while (this.tokenizer.position < posDone) {
          let element;
          const elementPosition = this.tokenizer.position;
          try {
            element = await this.readElement();
          } catch (error) {
            if (error instanceof EndOfStreamError) {
              break;
            }
            throw error;
          }
          const child = dtdElement.container[element.id];
          if (child) {
            const action = listener.startNext(child);
            switch (action) {
              case ParseAction.ReadNext:
                {
                  if (element.id === 524531317) {
                  }
                  debug13(`Read element: name=${getElementPath(child)}{id=0x${element.id.toString(16)}, container=${!!child.container}} at position=${elementPosition}`);
                  if (child.container) {
                    const childEnd = Math.min(posDone, this.tokenizer.fileInfo.size ?? Number.POSITIVE_INFINITY, element.len >= 0 ? this.tokenizer.position + element.len : posDone);
                    const res = await this.parseContainer(child, childEnd, listener);
                    if (child.multiple) {
                      if (!tree[child.name]) {
                        tree[child.name] = [];
                      }
                      tree[child.name].push(res);
                    } else {
                      tree[child.name] = res;
                    }
                    await listener.elementValue(child, res, elementPosition);
                  } else {
                    const parser = this.parserMap.get(child.value);
                    if (typeof parser === "function") {
                      const end = Math.min(posDone, this.tokenizer.fileInfo.size ?? Number.POSITIVE_INFINITY);
                      if (!Number.isSafeInteger(element.len) || element.len < 0 || element.len > end - this.tokenizer.position) {
                        throw new EbmlContentError(`Invalid element length: ${element.len}`);
                      }
                      const value = await parser(element);
                      tree[child.name] = value;
                      await listener.elementValue(child, value, elementPosition);
                    }
                  }
                }
                break;
              case ParseAction.SkipElement:
                debug13(`Go to next element: name=${getElementPath(child)}, element.id=0x${element.id}, container=${!!child.container} at position=${elementPosition}`);
                break;
              case ParseAction.IgnoreElement:
                debug13(`Ignore element: name=${getElementPath(child)}, element.id=0x${element.id}, container=${!!child.container} at position=${elementPosition}`);
                await this.tokenizer.ignore(element.len);
                break;
              case ParseAction.SkipSiblings:
                debug13(`Ignore remaining container, at: name=${getElementPath(child)}, element.id=0x${element.id}, container=${!!child.container} at position=${elementPosition}`);
                await this.tokenizer.ignore(posDone - this.tokenizer.position);
                break;
              case ParseAction.TerminateParsing:
                debug13(`Terminate parsing at element: name=${getElementPath(child)}, element.id=0x${element.id}, container=${!!child.container} at position=${elementPosition}`);
                return tree;
            }
          } else {
            switch (element.id) {
              case 236:
                await this.tokenizer.ignore(element.len);
                break;
              default:
                debug13(`parseEbml: parent=${getElementPath(dtdElement)}, unknown child: id=${element.id.toString(16)} at position=${elementPosition}`);
                await this.tokenizer.ignore(element.len);
            }
          }
        }
        return tree;
      }
      async readVintData(maxLength) {
        const msb = await this.tokenizer.peekNumber(UINT8);
        let mask = 128;
        let oc = 1;
        while ((msb & mask) === 0) {
          if (oc > maxLength) {
            throw new EbmlContentError("VINT value exceeding maximum size");
          }
          ++oc;
          mask >>= 1;
        }
        const id = new Uint8Array(oc);
        await this.tokenizer.readBuffer(id);
        return id;
      }
      async readElement() {
        const id = await this.readVintData(this.ebmlMaxIDLength);
        const lenField = await this.readVintData(this.ebmlMaxSizeLength);
        lenField[0] ^= 128 >> lenField.length - 1;
        return {
          id: readUIntBE(id, id.length),
          len: readUIntBE(lenField, lenField.length)
        };
      }
      async readFloat(e) {
        switch (e.len) {
          case 0:
            return 0;
          case 4:
            return this.tokenizer.readNumber(Float32_BE);
          case 8:
            return this.tokenizer.readNumber(Float64_BE);
          case 10:
            return this.tokenizer.readNumber(Float64_BE);
          default:
            throw new EbmlContentError(`Invalid IEEE-754 float length: ${e.len}`);
        }
      }
      async readFlag(e) {
        return await this.readUint(e) === 1;
      }
      async readUint(e) {
        const buf = await this.readBuffer(e);
        return readUIntBE(buf, e.len);
      }
      async readString(e) {
        const buf = await this.readBuffer(e);
        const rawString = new StringType(e.len, "utf-8").get(buf, 0);
        return rawString.replace(/\x00.*$/g, "");
      }
      async readBuffer(e) {
        const chunkSize = 64 * 1024;
        if ((!this.tokenizer.supportsRandomAccess() || this.tokenizer.fileInfo.size === void 0) && e.len > chunkSize) {
          const chunks = [];
          for (let remaining = e.len; remaining > 0; ) {
            const chunk = new Uint8Array(Math.min(remaining, chunkSize));
            await this.tokenizer.readBuffer(chunk);
            chunks.push(chunk);
            remaining -= chunk.length;
          }
          const buf2 = new Uint8Array(e.len);
          let offset = 0;
          for (const chunk of chunks) {
            buf2.set(chunk, offset);
            offset += chunk.length;
          }
          return buf2;
        }
        const buf = new Uint8Array(e.len);
        await this.tokenizer.readBuffer(buf);
        return buf;
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/matroska/MatroskaDtd.js
var matroskaDtd;
var init_MatroskaDtd = __esm({
  "soda-player/node_modules/music-metadata/lib/matroska/MatroskaDtd.js"() {
    init_types2();
    matroskaDtd = {
      name: "dtd",
      container: {
        440786851: {
          // 5.1
          name: "ebml",
          container: {
            17030: { name: "ebmlVersion", value: DataType2.uint },
            // 5.1.1
            17143: { name: "ebmlReadVersion", value: DataType2.uint },
            // 5.1.2
            17138: { name: "ebmlMaxIDWidth", value: DataType2.uint },
            // 5.1.3
            17139: { name: "ebmlMaxSizeWidth", value: DataType2.uint },
            // 5.1.4
            17026: { name: "docType", value: DataType2.string },
            // 5.1.5
            17031: { name: "docTypeVersion", value: DataType2.uint },
            // 5.1.6
            17029: { name: "docTypeReadVersion", value: DataType2.uint }
            // 5.1.7
          }
        },
        // Matroska segments
        408125543: {
          name: "segment",
          container: {
            // Meta Seek Information (also known as MetaSeek)
            290298740: {
              name: "seekHead",
              container: {
                19899: {
                  name: "seek",
                  multiple: true,
                  container: {
                    21419: { name: "id", value: DataType2.binary },
                    21420: { name: "position", value: DataType2.uint }
                  }
                }
              }
            },
            // Segment Information
            357149030: {
              name: "info",
              container: {
                29604: { name: "uid", value: DataType2.uid },
                29572: { name: "filename", value: DataType2.string },
                3979555: { name: "prevUID", value: DataType2.uid },
                3965867: { name: "prevFilename", value: DataType2.string },
                4110627: { name: "nextUID", value: DataType2.uid },
                4096955: { name: "nextFilename", value: DataType2.string },
                2807729: { name: "timecodeScale", value: DataType2.uint },
                17545: { name: "duration", value: DataType2.float },
                17505: { name: "dateUTC", value: DataType2.uint },
                31657: { name: "title", value: DataType2.string },
                19840: { name: "muxingApp", value: DataType2.string },
                22337: { name: "writingApp", value: DataType2.string }
              }
            },
            // Cluster
            524531317: {
              name: "cluster",
              multiple: true,
              container: {
                231: { name: "timecode", value: DataType2.uid },
                22743: { name: "silentTracks ", multiple: true },
                167: { name: "position", value: DataType2.uid },
                171: { name: "prevSize", value: DataType2.uid },
                160: { name: "blockGroup" },
                163: { name: "simpleBlock" }
              }
            },
            // Track
            374648427: {
              name: "tracks",
              container: {
                174: {
                  name: "entries",
                  multiple: true,
                  container: {
                    215: { name: "trackNumber", value: DataType2.uint },
                    29637: { name: "uid", value: DataType2.uid },
                    131: { name: "trackType", value: DataType2.uint },
                    185: { name: "flagEnabled", value: DataType2.bool },
                    136: { name: "flagDefault", value: DataType2.bool },
                    21930: { name: "flagForced", value: DataType2.bool },
                    // extended
                    156: { name: "flagLacing", value: DataType2.bool },
                    28135: { name: "minCache", value: DataType2.uint },
                    28136: { name: "maxCache", value: DataType2.uint },
                    2352003: { name: "defaultDuration", value: DataType2.uint },
                    2306383: { name: "timecodeScale", value: DataType2.float },
                    21358: { name: "name", value: DataType2.string },
                    2274716: { name: "language", value: DataType2.string },
                    134: { name: "codecID", value: DataType2.string },
                    25506: { name: "codecPrivate", value: DataType2.binary },
                    2459272: { name: "codecName", value: DataType2.string },
                    3839639: { name: "codecSettings", value: DataType2.string },
                    3883072: { name: "codecInfoUrl", value: DataType2.string },
                    2536e3: { name: "codecDownloadUrl", value: DataType2.string },
                    170: { name: "codecDecodeAll", value: DataType2.bool },
                    28587: { name: "trackOverlay", value: DataType2.uint },
                    // Video
                    224: {
                      name: "video",
                      container: {
                        154: { name: "flagInterlaced", value: DataType2.bool },
                        21432: { name: "stereoMode", value: DataType2.uint },
                        176: { name: "pixelWidth", value: DataType2.uint },
                        186: { name: "pixelHeight", value: DataType2.uint },
                        21680: { name: "displayWidth", value: DataType2.uint },
                        21690: { name: "displayHeight", value: DataType2.uint },
                        21683: { name: "aspectRatioType", value: DataType2.uint },
                        3061028: { name: "colourSpace", value: DataType2.uint },
                        3126563: { name: "gammaValue", value: DataType2.float }
                      }
                    },
                    // Audio
                    225: {
                      name: "audio",
                      container: {
                        181: { name: "samplingFrequency", value: DataType2.float },
                        30901: { name: "outputSamplingFrequency", value: DataType2.float },
                        159: { name: "channels", value: DataType2.uint },
                        // https://www.matroska.org/technical/specs/index.html
                        148: { name: "channels", value: DataType2.uint },
                        32123: { name: "channelPositions", value: DataType2.binary },
                        25188: { name: "bitDepth", value: DataType2.uint }
                      }
                    },
                    // Content Encoding
                    28032: {
                      name: "contentEncodings",
                      container: {
                        25152: {
                          name: "contentEncoding",
                          container: {
                            20529: { name: "order", value: DataType2.uint },
                            20530: { name: "scope", value: DataType2.bool },
                            20531: { name: "type", value: DataType2.uint },
                            20532: {
                              name: "contentEncoding",
                              container: {
                                16980: { name: "contentCompAlgo", value: DataType2.uint },
                                16981: { name: "contentCompSettings", value: DataType2.binary }
                              }
                            },
                            20533: {
                              name: "contentEncoding",
                              container: {
                                18401: { name: "contentEncAlgo", value: DataType2.uint },
                                18402: { name: "contentEncKeyID", value: DataType2.binary },
                                18403: { name: "contentSignature ", value: DataType2.binary },
                                18404: { name: "ContentSigKeyID  ", value: DataType2.binary },
                                18405: { name: "contentSigAlgo ", value: DataType2.uint },
                                18406: { name: "contentSigHashAlgo ", value: DataType2.uint }
                              }
                            },
                            25188: { name: "bitDepth", value: DataType2.uint }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            // Cueing Data
            475249515: {
              name: "cues",
              container: {
                187: {
                  name: "cuePoint",
                  container: {
                    179: { name: "cueTime", value: DataType2.uid },
                    183: {
                      name: "positions",
                      container: {
                        247: { name: "track", value: DataType2.uint },
                        241: { name: "clusterPosition", value: DataType2.uint },
                        21368: { name: "blockNumber", value: DataType2.uint },
                        234: { name: "codecState", value: DataType2.uint },
                        219: {
                          name: "reference",
                          container: {
                            150: { name: "time", value: DataType2.uint },
                            151: { name: "cluster", value: DataType2.uint },
                            21343: { name: "number", value: DataType2.uint },
                            235: { name: "codecState", value: DataType2.uint }
                          }
                        },
                        240: { name: "relativePosition", value: DataType2.uint }
                        // extended
                      }
                    }
                  }
                }
              }
            },
            // Attachment
            423732329: {
              name: "attachments",
              container: {
                24999: {
                  name: "attachedFiles",
                  multiple: true,
                  container: {
                    18046: { name: "description", value: DataType2.string },
                    18030: { name: "name", value: DataType2.string },
                    18016: { name: "mimeType", value: DataType2.string },
                    18012: { name: "data", value: DataType2.binary },
                    18094: { name: "uid", value: DataType2.uid }
                  }
                }
              }
            },
            // Chapters
            272869232: {
              name: "chapters",
              container: {
                17849: {
                  name: "editionEntry",
                  container: {
                    182: {
                      name: "chapterAtom",
                      container: {
                        29636: { name: "uid", value: DataType2.uid },
                        145: { name: "timeStart", value: DataType2.uint },
                        146: { name: "timeEnd", value: DataType2.uid },
                        152: { name: "hidden", value: DataType2.bool },
                        17816: { name: "enabled", value: DataType2.uid },
                        143: {
                          name: "track",
                          container: {
                            137: { name: "trackNumber", value: DataType2.uid },
                            128: {
                              name: "display",
                              container: {
                                133: { name: "string", value: DataType2.string },
                                17276: { name: "language ", value: DataType2.string },
                                17278: { name: "country ", value: DataType2.string }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            // Tagging
            307544935: {
              name: "tags",
              container: {
                29555: {
                  name: "tag",
                  multiple: true,
                  container: {
                    25536: {
                      name: "target",
                      container: {
                        25541: { name: "tagTrackUID", value: DataType2.uid },
                        25540: { name: "tagChapterUID", value: DataType2.uint },
                        25542: { name: "tagAttachmentUID", value: DataType2.uid },
                        25546: { name: "targetType", value: DataType2.string },
                        // extended
                        26826: { name: "targetTypeValue", value: DataType2.uint },
                        // extended
                        25545: { name: "tagEditionUID", value: DataType2.uid }
                        // extended
                      }
                    },
                    26568: {
                      name: "simpleTags",
                      multiple: true,
                      container: {
                        17827: { name: "name", value: DataType2.string },
                        17543: { name: "string", value: DataType2.string },
                        17541: { name: "binary", value: DataType2.binary },
                        17530: { name: "language", value: DataType2.string },
                        // extended
                        17531: { name: "languageIETF", value: DataType2.string },
                        // extended
                        17540: { name: "default", value: DataType2.bool }
                        // extended
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/matroska/MatroskaParser.js
var MatroskaParser_exports = {};
__export(MatroskaParser_exports, {
  MatroskaParser: () => MatroskaParser
});
var import_debug14, debug14, MatroskaParser;
var init_MatroskaParser = __esm({
  "soda-player/node_modules/music-metadata/lib/matroska/MatroskaParser.js"() {
    import_debug14 = __toESM(require_src(), 1);
    init_BasicParser();
    init_EbmlIterator();
    init_MatroskaDtd();
    init_types();
    debug14 = (0, import_debug14.default)("music-metadata:parser:matroska");
    MatroskaParser = class extends BasicParser {
      seekHead;
      seekHeadOffset = 0;
      /**
       * Use index to skip multiple segment/cluster elements at once.
       * Significant performance impact
       */
      flagUseIndexToSkipClusters = this.options.mkvUseIndex ?? false;
      async parse() {
        const containerSize = this.tokenizer.fileInfo.size ?? Number.MAX_SAFE_INTEGER;
        const matroskaIterator = new EbmlIterator(this.tokenizer);
        debug14("Initializing DTD end MatroskaIterator");
        await matroskaIterator.iterate(matroskaDtd, containerSize, {
          startNext: (element) => {
            switch (element.id) {
              // case 0x1f43b675: // cluster
              case 475249515:
                debug14(`Skip element: name=${element.name}, id=0x${element.id.toString(16)}`);
                return ParseAction.IgnoreElement;
              case 524531317:
                if (this.flagUseIndexToSkipClusters && this.seekHead) {
                  const index = this.seekHead.seek.find((index2) => index2.position + this.seekHeadOffset > this.tokenizer.position);
                  if (index) {
                    const ignoreSize = index.position + this.seekHeadOffset - this.tokenizer.position;
                    debug14(`Use index to go to next position, ignoring ${ignoreSize} bytes`);
                    this.tokenizer.ignore(ignoreSize);
                    return ParseAction.SkipElement;
                  }
                }
                return ParseAction.IgnoreElement;
              default:
                return ParseAction.ReadNext;
            }
          },
          elementValue: async (element, value, offset) => {
            debug14(`Received: name=${element.name}, value=${value}`);
            switch (element.id) {
              case 17026:
                this.metadata.setFormat("container", `EBML/${value}`);
                break;
              case 290298740:
                this.seekHead = value;
                this.seekHeadOffset = offset;
                break;
              case 357149030:
                {
                  const info = value;
                  const timecodeScale = info.timecodeScale ? info.timecodeScale : 1e6;
                  if (typeof info.duration === "number") {
                    const duration = info.duration * timecodeScale / 1e9;
                    await this.addTag("segment:title", info.title);
                    this.metadata.setFormat("duration", Number(duration));
                  }
                }
                break;
              case 374648427:
                {
                  const audioTracks = value;
                  if (audioTracks?.entries) {
                    audioTracks.entries.forEach((entry) => {
                      const stream = {
                        codecName: entry.codecID.replace("A_", "").replace("V_", ""),
                        codecSettings: entry.codecSettings,
                        flagDefault: entry.flagDefault,
                        flagLacing: entry.flagLacing,
                        flagEnabled: entry.flagEnabled,
                        language: entry.language,
                        name: entry.name,
                        type: entry.trackType,
                        audio: entry.audio,
                        video: entry.video
                      };
                      this.metadata.addStreamInfo(stream);
                    });
                    const audioTrack = audioTracks.entries.filter((entry) => entry.trackType === TrackType.audio).reduce((acc, cur) => {
                      if (!acc) {
                        return cur;
                      }
                      if (cur.flagDefault && !acc.flagDefault) {
                        return cur;
                      }
                      if (cur.trackNumber < acc.trackNumber) {
                        return cur;
                      }
                      return acc;
                    }, null);
                    if (audioTrack) {
                      this.metadata.setFormat("codec", audioTrack.codecID.replace("A_", ""));
                      this.metadata.setFormat("sampleRate", audioTrack.audio.samplingFrequency);
                      this.metadata.setFormat("numberOfChannels", audioTrack.audio.channels);
                    }
                  }
                }
                break;
              case 307544935:
                {
                  const tags = value;
                  await Promise.all(tags.tag.map(async (tag) => {
                    const target = tag.target;
                    const targetType = target?.targetTypeValue ? TargetType[target.targetTypeValue] : target?.targetType ? target.targetType : "track";
                    await Promise.all(tag.simpleTags.map(async (simpleTag) => {
                      const value2 = simpleTag.string ? simpleTag.string : simpleTag.binary;
                      await this.addTag(`${targetType}:${simpleTag.name}`, value2);
                    }));
                  }));
                }
                break;
              case 423732329:
                {
                  const attachments = value;
                  await Promise.all(attachments.attachedFiles.filter((file) => file.mimeType.startsWith("image/")).map((file) => this.addTag("picture", {
                    data: file.data,
                    format: file.mimeType,
                    description: file.description,
                    name: file.name
                  })));
                }
                break;
            }
          }
        });
      }
      async addTag(tagId, value) {
        await this.metadata.addTag("matroska", tagId, value);
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/mp4/AtomToken.js
function readTokenTable(buf, token, off, remainingLen, numberOfEntries) {
  debug15(`remainingLen=${remainingLen}, numberOfEntries=${numberOfEntries} * token-len=${token.len}`);
  if (remainingLen === 0) {
    return [];
  }
  if (remainingLen !== numberOfEntries * token.len) {
    throw new Mp4ContentError("mismatch number-of-entries with remaining atom-length");
  }
  const entries2 = [];
  for (let n = 0; n < numberOfEntries; ++n) {
    entries2.push(token.get(buf, off));
    off += token.len;
  }
  return entries2;
}
var import_debug15, debug15, Mp4ContentError, Header3, ExtendedSize, ftyp, FixedLengthAtom, SecondsSinceMacEpoch, SecondsSinceMacEpoch64, MdhdAtom, MvhdAtom, DataAtom, NameAtom, TrackHeaderAtom, stsdHeader, SampleDescriptionTable, StsdAtom, SoundSampleDescriptionVersion, SoundSampleDescriptionV0, SimpleTableAtom, TimeToSampleToken, SttsAtom, SampleToChunkToken, StscAtom, StszAtom, StcoAtom, ChapterText, TrackFragmentHeaderBox, TrackRunBox, HandlerBox, ChapterTrackReferenceBox;
var init_AtomToken = __esm({
  "soda-player/node_modules/music-metadata/lib/mp4/AtomToken.js"() {
    import_debug15 = __toESM(require_src(), 1);
    init_lib3();
    init_FourCC();
    init_Util();
    init_ParseError();
    debug15 = (0, import_debug15.default)("music-metadata:parser:MP4:atom");
    Mp4ContentError = class extends makeUnexpectedFileContentError("MP4") {
    };
    Header3 = {
      len: 8,
      get: (buf, off) => {
        const length = UINT32_BE.get(buf, off);
        if (length < 0) {
          throw new Mp4ContentError("Invalid atom header length");
        }
        return {
          length: BigInt(length),
          name: new StringType(4, "latin1").get(buf, off + 4)
        };
      },
      put: (buf, off, hdr) => {
        UINT32_BE.put(buf, off, Number(hdr.length));
        return FourCcToken.put(buf, off + 4, hdr.name);
      }
    };
    ExtendedSize = UINT64_BE;
    ftyp = {
      len: 4,
      get: (buf, off) => {
        return {
          type: new StringType(4, "ascii").get(buf, off)
        };
      }
    };
    FixedLengthAtom = class {
      len;
      /**
       *
       * @param {number} len Length as specified in the size field
       * @param {number} expLen Total length of sum of specified fields in the standard
       * @param atomId Atom ID
       */
      constructor(len, expLen, atomId) {
        if (len < expLen) {
          throw new Mp4ContentError(`Atom ${atomId} expected to be ${expLen}, but specifies ${len} bytes long.`);
        }
        if (len > expLen) {
          debug15(`Warning: atom ${atomId} expected to be ${expLen}, but was actually ${len} bytes long.`);
        }
        this.len = len;
      }
    };
    SecondsSinceMacEpoch = {
      len: 4,
      get: (buf, off) => {
        const secondsSinceUnixEpoch = UINT32_BE.get(buf, off) - 2082844800;
        return new Date(secondsSinceUnixEpoch * 1e3);
      }
    };
    SecondsSinceMacEpoch64 = {
      len: 8,
      get: (buf, off) => {
        const secondsSinceUnixEpoch = Number(UINT64_BE.get(buf, off)) - 2082844800;
        return new Date(secondsSinceUnixEpoch * 1e3);
      }
    };
    MdhdAtom = class extends FixedLengthAtom {
      constructor(len) {
        super(len, 24, "mdhd");
      }
      get(buf, off) {
        const version = UINT8.get(buf, off + 0);
        const flags = UINT24_BE.get(buf, off + 1);
        switch (version) {
          case 0:
            return {
              version,
              flags,
              creationTime: SecondsSinceMacEpoch.get(buf, off + 4),
              modificationTime: SecondsSinceMacEpoch.get(buf, off + 8),
              timeScale: UINT32_BE.get(buf, off + 12),
              duration: UINT32_BE.get(buf, off + 16),
              language: UINT16_BE.get(buf, off + 20),
              quality: UINT16_BE.get(buf, off + 22)
            };
          case 1:
            return {
              version,
              flags,
              creationTime: SecondsSinceMacEpoch64.get(buf, off + 4),
              modificationTime: SecondsSinceMacEpoch64.get(buf, off + 12),
              timeScale: UINT32_BE.get(buf, off + 20),
              duration: Number(UINT64_BE.get(buf, off + 24)),
              language: UINT16_BE.get(buf, off + 32),
              quality: UINT16_BE.get(buf, off + 34)
            };
          default:
            throw new FieldDecodingError("Invalid mdhd version header");
        }
      }
    };
    MvhdAtom = class extends FixedLengthAtom {
      constructor(len) {
        super(len, 100, "mvhd");
      }
      get(buf, off) {
        const version = UINT8.get(buf, off);
        const flags = UINT24_BE.get(buf, off + 1);
        if (version === 1) {
          return {
            version,
            flags,
            creationTime: SecondsSinceMacEpoch64.get(buf, off + 4),
            modificationTime: SecondsSinceMacEpoch64.get(buf, off + 12),
            timeScale: UINT32_BE.get(buf, off + 20),
            duration: Number(UINT64_BE.get(buf, off + 24)),
            preferredRate: UINT32_BE.get(buf, off + 32),
            preferredVolume: UINT16_BE.get(buf, off + 36),
            // ignore reserved: 10 bytes
            // ignore matrix structure: 36 bytes
            previewTime: UINT32_BE.get(buf, off + 84),
            previewDuration: UINT32_BE.get(buf, off + 88),
            posterTime: UINT32_BE.get(buf, off + 92),
            selectionTime: UINT32_BE.get(buf, off + 96),
            selectionDuration: UINT32_BE.get(buf, off + 100),
            currentTime: UINT32_BE.get(buf, off + 104),
            nextTrackID: UINT32_BE.get(buf, off + 108)
          };
        }
        return {
          version,
          flags,
          creationTime: SecondsSinceMacEpoch.get(buf, off + 4),
          modificationTime: SecondsSinceMacEpoch.get(buf, off + 8),
          timeScale: UINT32_BE.get(buf, off + 12),
          duration: UINT32_BE.get(buf, off + 16),
          preferredRate: UINT32_BE.get(buf, off + 20),
          preferredVolume: UINT16_BE.get(buf, off + 24),
          // ignore reserved: 10 bytes
          // ignore matrix structure: 36 bytes
          previewTime: UINT32_BE.get(buf, off + 72),
          previewDuration: UINT32_BE.get(buf, off + 76),
          posterTime: UINT32_BE.get(buf, off + 80),
          selectionTime: UINT32_BE.get(buf, off + 84),
          selectionDuration: UINT32_BE.get(buf, off + 88),
          currentTime: UINT32_BE.get(buf, off + 92),
          nextTrackID: UINT32_BE.get(buf, off + 96)
        };
      }
    };
    DataAtom = class {
      len;
      constructor(len) {
        this.len = len;
      }
      get(buf, off) {
        return {
          type: {
            set: UINT8.get(buf, off + 0),
            type: UINT24_BE.get(buf, off + 1)
          },
          locale: UINT24_BE.get(buf, off + 4),
          value: new Uint8ArrayType(this.len - 8).get(buf, off + 8)
        };
      }
    };
    NameAtom = class {
      len;
      constructor(len) {
        this.len = len;
      }
      get(buf, off) {
        return {
          version: UINT8.get(buf, off),
          flags: UINT24_BE.get(buf, off + 1),
          name: new StringType(this.len - 4, "utf-8").get(buf, off + 4)
        };
      }
    };
    TrackHeaderAtom = class {
      len;
      constructor(len) {
        this.len = len;
      }
      get(buf, off) {
        const available = Math.min(this.len, buf.length - off);
        if (available < 4) {
          throw new Mp4ContentError("Truncated tkhd header");
        }
        const version = UINT8.get(buf, off);
        if (version === 0 && available < 38 || version === 1 && available < 50) {
          throw new Mp4ContentError("Truncated tkhd header");
        }
        const flags = UINT24_BE.get(buf, off + 1);
        switch (version) {
          case 0:
            return {
              version,
              flags,
              creationTime: SecondsSinceMacEpoch.get(buf, off + 4),
              modificationTime: SecondsSinceMacEpoch.get(buf, off + 8),
              trackId: UINT32_BE.get(buf, off + 12),
              // reserved 4 bytes
              duration: UINT32_BE.get(buf, off + 20),
              // reserved 8 bytes
              layer: UINT16_BE.get(buf, off + 32),
              alternateGroup: UINT16_BE.get(buf, off + 34),
              volume: UINT16_BE.get(buf, off + 36)
              // ToDo: fixed point
              // ToDo: add remaining fields
            };
          case 1:
            return {
              version,
              flags,
              creationTime: SecondsSinceMacEpoch64.get(buf, off + 4),
              modificationTime: SecondsSinceMacEpoch64.get(buf, off + 12),
              trackId: UINT32_BE.get(buf, off + 20),
              // reserved 4 bytes
              duration: Number(UINT64_BE.get(buf, off + 28)),
              // reserved 8 bytes
              layer: UINT16_BE.get(buf, off + 44),
              alternateGroup: UINT16_BE.get(buf, off + 46),
              volume: UINT16_BE.get(buf, off + 48)
              // ToDo: fixed point
              // ToDo: add remaining fields
            };
          default:
            throw new FieldDecodingError("Invalid tkhd version header");
        }
      }
    };
    stsdHeader = {
      len: 8,
      get: (buf, off) => {
        return {
          version: UINT8.get(buf, off),
          flags: UINT24_BE.get(buf, off + 1),
          numberOfEntries: UINT32_BE.get(buf, off + 4)
        };
      }
    };
    SampleDescriptionTable = class {
      len;
      constructor(len) {
        this.len = len;
      }
      get(buf, off) {
        const descrLen = this.len - 12;
        return {
          dataFormat: FourCcToken.get(buf, off),
          dataReferenceIndex: UINT16_BE.get(buf, off + 10),
          description: descrLen > 0 ? new Uint8ArrayType(descrLen).get(buf, off + 12) : void 0
        };
      }
    };
    StsdAtom = class {
      len;
      constructor(len) {
        this.len = len;
      }
      get(buf, off) {
        const end = Math.min(off + this.len, buf.length);
        if (end - off < stsdHeader.len) {
          throw new Mp4ContentError("Truncated stsd header");
        }
        const header = stsdHeader.get(buf, off);
        off += stsdHeader.len;
        const table = [];
        for (let n = 0; n < header.numberOfEntries; ++n) {
          if (end - off < UINT32_BE.len) {
            throw new Mp4ContentError("Truncated stsd sample entry");
          }
          const size = UINT32_BE.get(buf, off);
          if (size < 16 || size > end - off) {
            throw new Mp4ContentError(`Invalid stsd sample entry size: ${size}`);
          }
          off += UINT32_BE.len;
          table.push(new SampleDescriptionTable(size - UINT32_BE.len).get(buf, off));
          off += size - UINT32_BE.len;
        }
        return {
          header,
          table
        };
      }
    };
    SoundSampleDescriptionVersion = {
      len: 8,
      get(buf, off) {
        return {
          version: INT16_BE.get(buf, off),
          revision: INT16_BE.get(buf, off + 2),
          vendor: INT32_BE.get(buf, off + 4)
        };
      }
    };
    SoundSampleDescriptionV0 = {
      len: 12,
      get(buf, off) {
        return {
          numAudioChannels: INT16_BE.get(buf, off + 0),
          sampleSize: INT16_BE.get(buf, off + 2),
          compressionId: INT16_BE.get(buf, off + 4),
          packetSize: INT16_BE.get(buf, off + 6),
          sampleRate: UINT16_BE.get(buf, off + 8) + UINT16_BE.get(buf, off + 10) / 1e4
        };
      }
    };
    SimpleTableAtom = class {
      len;
      token;
      constructor(len, token) {
        this.len = len;
        this.token = token;
      }
      get(buf, off) {
        const nrOfEntries = INT32_BE.get(buf, off + 4);
        return {
          version: INT8.get(buf, off + 0),
          flags: INT24_BE.get(buf, off + 1),
          numberOfEntries: nrOfEntries,
          entries: readTokenTable(buf, this.token, off + 8, this.len - 8, nrOfEntries)
        };
      }
    };
    TimeToSampleToken = {
      len: 8,
      get(buf, off) {
        return {
          count: INT32_BE.get(buf, off + 0),
          duration: INT32_BE.get(buf, off + 4)
        };
      }
    };
    SttsAtom = class extends SimpleTableAtom {
      constructor(len) {
        super(len, TimeToSampleToken);
      }
    };
    SampleToChunkToken = {
      len: 12,
      get(buf, off) {
        return {
          firstChunk: INT32_BE.get(buf, off),
          samplesPerChunk: INT32_BE.get(buf, off + 4),
          sampleDescriptionId: INT32_BE.get(buf, off + 8)
        };
      }
    };
    StscAtom = class extends SimpleTableAtom {
      constructor(len) {
        super(len, SampleToChunkToken);
      }
    };
    StszAtom = class {
      len;
      constructor(len) {
        this.len = len;
      }
      get(buf, off) {
        const nrOfEntries = INT32_BE.get(buf, off + 8);
        return {
          version: INT8.get(buf, off),
          flags: INT24_BE.get(buf, off + 1),
          sampleSize: INT32_BE.get(buf, off + 4),
          numberOfEntries: nrOfEntries,
          entries: readTokenTable(buf, INT32_BE, off + 12, this.len - 12, nrOfEntries)
        };
      }
    };
    StcoAtom = class extends SimpleTableAtom {
      constructor(len) {
        super(len, INT32_BE);
      }
    };
    ChapterText = class {
      len;
      constructor(len) {
        this.len = len;
      }
      get(buf, off) {
        const titleLen = INT16_BE.get(buf, off + 0);
        const str = new StringType(titleLen, "utf-8");
        return str.get(buf, off + 2);
      }
    };
    TrackFragmentHeaderBox = class {
      len;
      constructor(len) {
        this.len = len;
      }
      get(buf, off) {
        const flagOffset = off + 1;
        const header = {
          version: INT8.get(buf, off),
          flags: {
            baseDataOffsetPresent: getBit(buf, flagOffset + 2, 0),
            sampleDescriptionIndexPresent: getBit(buf, flagOffset + 2, 1),
            defaultSampleDurationPresent: getBit(buf, flagOffset + 2, 3),
            defaultSampleSizePresent: getBit(buf, flagOffset + 2, 4),
            defaultSampleFlagsPresent: getBit(buf, flagOffset + 2, 5),
            defaultDurationIsEmpty: getBit(buf, flagOffset, 0),
            defaultBaseIsMoof: getBit(buf, flagOffset, 1)
          },
          trackId: UINT32_BE.get(buf, 4)
        };
        let dynOffset = 8;
        if (header.flags.baseDataOffsetPresent) {
          header.baseDataOffset = UINT64_BE.get(buf, dynOffset);
          dynOffset += 8;
        }
        if (header.flags.sampleDescriptionIndexPresent) {
          header.sampleDescriptionIndex = UINT32_BE.get(buf, dynOffset);
          dynOffset += 4;
        }
        if (header.flags.defaultSampleDurationPresent) {
          header.defaultSampleDuration = UINT32_BE.get(buf, dynOffset);
          dynOffset += 4;
        }
        if (header.flags.defaultSampleSizePresent) {
          header.defaultSampleSize = UINT32_BE.get(buf, dynOffset);
          dynOffset += 4;
        }
        if (header.flags.defaultSampleFlagsPresent) {
          header.defaultSampleFlags = UINT32_BE.get(buf, dynOffset);
        }
        return header;
      }
    };
    TrackRunBox = class {
      len;
      constructor(len) {
        this.len = len;
      }
      get(buf, off) {
        const flagOffset = off + 1;
        const trun = {
          version: INT8.get(buf, off),
          flags: {
            dataOffsetPresent: getBit(buf, flagOffset + 2, 0),
            firstSampleFlagsPresent: getBit(buf, flagOffset + 2, 2),
            sampleDurationPresent: getBit(buf, flagOffset + 1, 0),
            sampleSizePresent: getBit(buf, flagOffset + 1, 1),
            sampleFlagsPresent: getBit(buf, flagOffset + 1, 2),
            sampleCompositionTimeOffsetsPresent: getBit(buf, flagOffset + 1, 3)
          },
          sampleCount: UINT32_BE.get(buf, off + 4),
          samples: []
        };
        let dynOffset = off + 8;
        if (trun.flags.dataOffsetPresent) {
          trun.dataOffset = UINT32_BE.get(buf, dynOffset);
          dynOffset += 4;
        }
        if (trun.flags.firstSampleFlagsPresent) {
          trun.firstSampleFlags = UINT32_BE.get(buf, dynOffset);
          dynOffset += 4;
        }
        for (let n = 0; n < trun.sampleCount; ++n) {
          if (dynOffset >= this.len) {
            debug15("TrackRunBox size mismatch");
            break;
          }
          const sample = {};
          if (trun.flags.sampleDurationPresent) {
            sample.sampleDuration = UINT32_BE.get(buf, dynOffset);
            dynOffset += 4;
          }
          if (trun.flags.sampleSizePresent) {
            sample.sampleSize = UINT32_BE.get(buf, dynOffset);
            dynOffset += 4;
          }
          if (trun.flags.sampleFlagsPresent) {
            sample.sampleFlags = UINT32_BE.get(buf, dynOffset);
            dynOffset += 4;
          }
          if (trun.flags.sampleCompositionTimeOffsetsPresent) {
            sample.sampleCompositionTimeOffset = UINT32_BE.get(buf, dynOffset);
            dynOffset += 4;
          }
          trun.samples.push(sample);
        }
        return trun;
      }
    };
    HandlerBox = class {
      len;
      constructor(len) {
        this.len = len;
      }
      get(buf, off) {
        const _flagOffset = off + 1;
        const charTypeToken = new StringType(4, "utf-8");
        return {
          version: INT8.get(buf, off),
          flags: UINT24_BE.get(buf, off + 1),
          componentType: charTypeToken.get(buf, off + 4),
          handlerType: charTypeToken.get(buf, off + 8),
          componentName: new StringType(this.len - 28, "utf-8").get(buf, off + 28)
        };
      }
    };
    ChapterTrackReferenceBox = class {
      len;
      constructor(len) {
        this.len = len;
      }
      get(buf, off) {
        let dynOffset = 0;
        const trackIds = [];
        while (dynOffset < this.len) {
          trackIds.push(UINT32_BE.get(buf, off + dynOffset));
          dynOffset += 4;
        }
        return trackIds;
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/mp4/Atom.js
var import_debug16, debug16, Atom;
var init_Atom = __esm({
  "soda-player/node_modules/music-metadata/lib/mp4/Atom.js"() {
    import_debug16 = __toESM(require_src(), 1);
    init_AtomToken();
    init_AtomToken();
    debug16 = (0, import_debug16.default)("music-metadata:parser:MP4:Atom");
    Atom = class _Atom {
      payloadLength;
      static async readAtom(tokenizer, dataHandler, parent, remaining) {
        const offset = tokenizer.position;
        remaining = Math.min(remaining, (tokenizer.fileInfo.size ?? Number.POSITIVE_INFINITY) - offset);
        if (remaining < Header3.len) {
          throw new Mp4ContentError("Truncated atom header");
        }
        debug16(`Reading next token on offset=${offset}...`);
        const header = await tokenizer.readToken(Header3);
        const extended = header.length === 1n;
        if (extended) {
          if (remaining < 16) {
            throw new Mp4ContentError("Truncated extended atom header");
          }
          header.length = await tokenizer.readToken(ExtendedSize);
        }
        const headerLength = extended ? 16 : 8;
        if ((extended || header.length !== 0n) && header.length < BigInt(headerLength)) {
          throw new Mp4ContentError(`Invalid atom size: ${header.length}`);
        }
        if (header.length > BigInt(Number.MAX_SAFE_INTEGER)) {
          throw new Mp4ContentError(`Atom size exceeds Number.MAX_SAFE_INTEGER: ${header.length}`);
        }
        const length = header.length === 0n ? remaining : Number(header.length);
        if (length > remaining) {
          throw new Mp4ContentError(`Atom size exceeds remaining bytes: ${header.length} > ${remaining}`);
        }
        const payloadLength = length - headerLength;
        const atomBean = new _Atom(header, extended, parent, payloadLength);
        debug16(`parse atom name=${atomBean.atomPath}, extended=${atomBean.extended}, offset=${offset}, len=${atomBean.header.length}`);
        await atomBean.readData(tokenizer, dataHandler, payloadLength);
        return atomBean;
      }
      children;
      atomPath;
      header;
      extended;
      parent;
      constructor(header, extended, parent, payloadLength) {
        this.payloadLength = payloadLength;
        this.header = header;
        this.extended = extended;
        this.parent = parent;
        this.children = [];
        this.atomPath = (this.parent ? `${this.parent.atomPath}.` : "") + this.header.name;
      }
      getHeaderLength() {
        return this.extended ? 16 : 8;
      }
      getPayloadLength() {
        return this.payloadLength;
      }
      async readAtoms(tokenizer, dataHandler, size) {
        while (size > 0) {
          if (size === Number.POSITIVE_INFINITY) {
            const bytesRead = await tokenizer.peekBuffer(new Uint8Array(Header3.len), { mayBeLess: true });
            if (bytesRead === 0) {
              return;
            }
            if (bytesRead < Header3.len) {
              throw new Mp4ContentError("Truncated atom header");
            }
          }
          const atomBean = await _Atom.readAtom(tokenizer, dataHandler, this, size);
          this.children.push(atomBean);
          size = atomBean.header.length === 0n ? 0 : size - Number(atomBean.header.length);
        }
      }
      async readData(tokenizer, dataHandler, remaining) {
        switch (this.header.name) {
          // "Container" atoms, contains nested atoms
          case "moov":
          // The Movie Atom: contains other atoms
          case "udta":
          // User defined atom
          case "mdia":
          // Media atom
          case "minf":
          // Media Information Atom
          case "stbl":
          // The Sample Table Atom
          case "<id>":
          case "ilst":
          case "tref":
          case "moof":
            return this.readAtoms(tokenizer, dataHandler, remaining);
          case "meta": {
            if (remaining < 8) {
              throw new Mp4ContentError("Truncated meta atom");
            }
            const peekHeader = await tokenizer.peekToken(Header3);
            const paddingLength = peekHeader.name === "hdlr" ? 0 : 4;
            await tokenizer.ignore(paddingLength);
            return this.readAtoms(tokenizer, dataHandler, remaining - paddingLength);
          }
          default:
            return dataHandler(this, remaining);
        }
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/mp4/MP4Parser.js
var MP4Parser_exports = {};
__export(MP4Parser_exports, {
  MP4Parser: () => MP4Parser
});
function distinct(value, index, self) {
  return self.indexOf(value) === index;
}
function isAudioTrack(track) {
  const [ssd] = track.soundSampleDescription ?? [];
  if (!ssd) {
    return false;
  }
  if (track.isAudio) {
    return track.isAudio();
  }
  return !!ssd.description && ssd.description.numAudioChannels > 0;
}
var import_debug17, debug17, tagFormat2, encoderDict, MP4Parser;
var init_MP4Parser = __esm({
  "soda-player/node_modules/music-metadata/lib/mp4/MP4Parser.js"() {
    init_lib2();
    import_debug17 = __toESM(require_src(), 1);
    init_lib3();
    init_uint8array_extras();
    init_BasicParser();
    init_ID3v1Parser();
    init_type();
    init_Atom();
    init_AtomToken();
    init_AtomToken();
    debug17 = (0, import_debug17.default)("music-metadata:parser:MP4");
    tagFormat2 = "iTunes";
    encoderDict = {
      raw: {
        lossy: false,
        format: "raw"
      },
      MAC3: {
        lossy: true,
        format: "MACE 3:1"
      },
      MAC6: {
        lossy: true,
        format: "MACE 6:1"
      },
      ima4: {
        lossy: true,
        format: "IMA 4:1"
      },
      ulaw: {
        lossy: true,
        format: "uLaw 2:1"
      },
      alaw: {
        lossy: true,
        format: "uLaw 2:1"
      },
      Qclp: {
        lossy: true,
        format: "QUALCOMM PureVoice"
      },
      ".mp3": {
        lossy: true,
        format: "MPEG-1 layer 3"
      },
      alac: {
        lossy: false,
        format: "ALAC"
      },
      "ac-3": {
        lossy: true,
        format: "AC-3"
      },
      mp4a: {
        lossy: true,
        format: "MPEG-4/AAC"
      },
      mp4s: {
        lossy: true,
        format: "MP4S"
      },
      // Closed Captioning Media, https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/QTFFChap3/qtff3.html#//apple_ref/doc/uid/TP40000939-CH205-SW87
      c608: {
        lossy: true,
        format: "CEA-608"
      },
      c708: {
        lossy: true,
        format: "CEA-708"
      }
    };
    MP4Parser = class _MP4Parser extends BasicParser {
      static read_BE_Integer(array, signed) {
        const integerType = (signed ? "INT" : "UINT") + array.length * 8 + (array.length > 1 ? "_BE" : "");
        const token = lib_exports[integerType];
        if (!token) {
          throw new Mp4ContentError(`Token for integer type not found: "${integerType}"`);
        }
        return Number(token.get(array, 0));
      }
      // Metadata and sample tables are buffered; media data is skipped separately.
      // A bound is also necessary for streams whose total size is unknown.
      validatePayloadLength(length) {
        if (!Number.isSafeInteger(length) || length < 0 || length > 64 * 1024 * 1024) {
          throw new Mp4ContentError(`Atom payload exceeds the 64 MiB buffering limit: ${length}`);
        }
      }
      async readToken(token) {
        this.validatePayloadLength(token.len);
        return this.tokenizer.readToken(token);
      }
      tracks = /* @__PURE__ */ new Map();
      hasVideoTrack = false;
      hasAudioTrack = true;
      async parse() {
        this.hasVideoTrack = false;
        this.hasAudioTrack = true;
        this.tracks.clear();
        let remainingFileSize = this.tokenizer.fileInfo.size ?? Number.POSITIVE_INFINITY;
        while (remainingFileSize > 0) {
          try {
            const token = await this.tokenizer.peekToken(Header3);
            if (token.name === "\0\0\0\0") {
              const errMsg = `Error at offset=${this.tokenizer.position}: box.id=0`;
              debug17(errMsg);
              this.addWarning(errMsg);
              break;
            }
          } catch (error) {
            if (error instanceof Error) {
              const errMsg = `Error at offset=${this.tokenizer.position}: ${error.message}`;
              debug17(errMsg);
              this.addWarning(errMsg);
            } else {
              throw error;
            }
            break;
          }
          const rootAtom = await Atom.readAtom(this.tokenizer, (atom, remaining) => this.handleAtom(atom, remaining), null, remainingFileSize);
          remainingFileSize = rootAtom.header.length === 0n ? 0 : remainingFileSize - Number(rootAtom.header.length);
        }
        const formatList = [];
        this.tracks.forEach((track) => {
          const trackFormats = [];
          const trackIsAudio = isAudioTrack(track);
          track.soundSampleDescription.forEach((ssd) => {
            const streamInfo = {};
            const encoderInfo = encoderDict[ssd.dataFormat];
            if (encoderInfo) {
              trackFormats.push(encoderInfo.format);
              streamInfo.codecName = encoderInfo.format;
            } else {
              streamInfo.codecName = `<${ssd.dataFormat}>`;
            }
            if (trackIsAudio && ssd.description) {
              const { description } = ssd;
              if (description.sampleRate > 0) {
                streamInfo.type = TrackType.audio;
                streamInfo.audio = {
                  samplingFrequency: description.sampleRate,
                  bitDepth: description.sampleSize,
                  channels: description.numAudioChannels
                };
              }
            }
            this.metadata.addStreamInfo(streamInfo);
          });
          if (trackFormats.length >= 1) {
            formatList.push(trackFormats.join("/"));
          }
        });
        if (formatList.length > 0) {
          this.metadata.setFormat("codec", formatList.filter(distinct).join("+"));
        }
        const audioTracks = [...this.tracks.values()].filter(isAudioTrack);
        for (const audioTrack of audioTracks) {
          if (audioTrack.media.header && audioTrack.media.header.timeScale > 0) {
            audioTrack.sampleRate = audioTrack.media.header.timeScale;
            if (audioTrack.media.header.duration > 0) {
              debug17("Using duration defined on audio track");
              audioTrack.samples = audioTrack.media.header.duration;
              audioTrack.duration = audioTrack.samples / audioTrack.sampleRate;
            }
            if (audioTrack.fragments.length > 0) {
              debug17("Calculate duration defined in track fragments");
              let totalTimeUnits = 0;
              audioTrack.sizeInBytes = 0;
              for (const fragment of audioTrack.fragments) {
                for (const sample of fragment.trackRun.samples) {
                  const dur = sample.sampleDuration ?? fragment.header.defaultSampleDuration ?? 0;
                  const size = sample.sampleSize ?? fragment.header.defaultSampleSize ?? 0;
                  if (dur === 0) {
                    throw new Error("Missing sampleDuration and no defaultSampleDuration in track fragment header");
                  }
                  if (size === 0) {
                    throw new Error("Missing sampleSize and no defaultSampleSize in track fragment header");
                  }
                  totalTimeUnits += dur;
                  audioTrack.sizeInBytes += size;
                }
              }
              if (!audioTrack.samples) {
                audioTrack.samples = totalTimeUnits;
              }
              if (!audioTrack.duration) {
                audioTrack.duration = totalTimeUnits / audioTrack.sampleRate;
              }
            } else if (audioTrack.sampleSizeTable.length > 0) {
              audioTrack.sizeInBytes = audioTrack.sampleSizeTable.reduce((sum, n) => sum + n, 0);
            }
          }
          const ssd = audioTrack.soundSampleDescription[0];
          if (ssd.description && audioTrack.media.header) {
            this.metadata.setFormat("sampleRate", ssd.description.sampleRate);
            this.metadata.setFormat("bitsPerSample", ssd.description.sampleSize);
            this.metadata.setFormat("numberOfChannels", ssd.description.numAudioChannels);
            if (audioTrack.media.header.timeScale === 0 && audioTrack.timeToSampleTable.length > 0) {
              const totalSampleSize = audioTrack.timeToSampleTable.map((ttstEntry) => ttstEntry.count * ttstEntry.duration).reduce((total, sampleSize) => total + sampleSize);
              audioTrack.duration = totalSampleSize / ssd.description.sampleRate;
            }
          }
          const encoderInfo = encoderDict[ssd.dataFormat];
          if (encoderInfo) {
            this.metadata.setFormat("lossless", !encoderInfo.lossy);
          }
        }
        if (audioTracks.length >= 1) {
          const firstAudioTrack = audioTracks[0];
          if (firstAudioTrack.duration) {
            this.metadata.setFormat("duration", firstAudioTrack.duration);
            if (firstAudioTrack.sizeInBytes) {
              this.metadata.setFormat("bitrate", 8 * firstAudioTrack.sizeInBytes / firstAudioTrack.duration);
            }
          }
        }
        this.metadata.setFormat("hasAudio", this.hasAudioTrack);
        this.metadata.setFormat("hasVideo", this.hasVideoTrack);
      }
      async handleAtom(atom, remaining) {
        if (atom.parent) {
          switch (atom.parent.header.name) {
            case "ilst":
            case "<id>":
              return this.parseMetadataItemData(atom);
            case "moov":
              switch (atom.header.name) {
                case "trak":
                  return this.parseTrackBox(atom);
                case "udta":
                  return this.parseTrackBox(atom);
              }
              break;
            case "moof":
              switch (atom.header.name) {
                case "traf":
                  return this.parseTrackFragmentBox(atom);
              }
          }
        }
        if (this.atomParsers[atom.header.name]) {
          if (atom.header.name !== "mdat") {
            this.validatePayloadLength(remaining);
          }
          return this.atomParsers[atom.header.name](remaining);
        }
        debug17(`No parser for atom path=${atom.atomPath}, payload-len=${remaining}, ignoring atom`);
        await this.tokenizer.ignore(remaining);
      }
      getTrackDescription() {
        const tracks = [...this.tracks.values()];
        return tracks[tracks.length - 1];
      }
      async addTag(id, value) {
        await this.metadata.addTag(tagFormat2, id, value);
      }
      addWarning(message) {
        debug17(`Warning: ${message}`);
        this.metadata.addWarning(message);
      }
      /**
       * Parse data of Meta-item-list-atom (item of 'ilst' atom)
       * @param metaAtom
       * Ref: https://developer.apple.com/library/content/documentation/QuickTime/QTFF/Metadata/Metadata.html#//apple_ref/doc/uid/TP40000939-CH1-SW8
       */
      parseMetadataItemData(metaAtom) {
        let tagKey = metaAtom.header.name;
        return metaAtom.readAtoms(this.tokenizer, async (child) => {
          const payLoadLength = child.getPayloadLength();
          switch (child.header.name) {
            case "data":
              return this.parseValueAtom(tagKey, child);
            case "name":
            // name atom (optional)
            case "mean":
            case "rate": {
              const name = await this.readToken(new NameAtom(payLoadLength));
              tagKey += `:${name.name}`;
              break;
            }
            default: {
              const uint8Array = await this.readToken(new Uint8ArrayType(payLoadLength));
              this.addWarning(`Unsupported meta-item: ${tagKey}[${child.header.name}] => value=${uint8ArrayToHex(uint8Array)} ascii=${textDecode(uint8Array, "ascii")}`);
            }
          }
        }, metaAtom.getPayloadLength());
      }
      async parseValueAtom(tagKey, metaAtom) {
        const dataAtom = await this.readToken(new DataAtom(metaAtom.getPayloadLength()));
        if (dataAtom.type.set !== 0) {
          throw new Mp4ContentError(`Unsupported type-set != 0: ${dataAtom.type.set}`);
        }
        switch (dataAtom.type.type) {
          case 0:
            switch (tagKey) {
              case "trkn":
              case "disk": {
                const num = UINT8.get(dataAtom.value, 3);
                const of = UINT8.get(dataAtom.value, 5);
                await this.addTag(tagKey, `${num}/${of}`);
                break;
              }
              case "gnre": {
                const genreInt = UINT8.get(dataAtom.value, 1);
                const genreStr = Genres[genreInt - 1];
                await this.addTag(tagKey, genreStr);
                break;
              }
              case "rate": {
                const rate = textDecode(dataAtom.value, "ascii");
                await this.addTag(tagKey, rate);
                break;
              }
              default:
                debug17(`unknown proprietary value type for: ${metaAtom.atomPath}`);
            }
            break;
          case 1:
          // UTF-8: Without any count or NULL terminator
          case 18:
            await this.addTag(tagKey, textDecode(dataAtom.value));
            break;
          case 13:
            if (this.options.skipCovers) {
              break;
            }
            await this.addTag(tagKey, {
              format: "image/jpeg",
              data: Uint8Array.from(dataAtom.value)
            });
            break;
          case 14:
            if (this.options.skipCovers) {
              break;
            }
            await this.addTag(tagKey, {
              format: "image/png",
              data: Uint8Array.from(dataAtom.value)
            });
            break;
          case 21:
            await this.addTag(tagKey, _MP4Parser.read_BE_Integer(dataAtom.value, true));
            break;
          case 22:
            await this.addTag(tagKey, _MP4Parser.read_BE_Integer(dataAtom.value, false));
            break;
          case 65:
            await this.addTag(tagKey, UINT8.get(dataAtom.value, 0));
            break;
          case 66:
            await this.addTag(tagKey, UINT16_BE.get(dataAtom.value, 0));
            break;
          case 67:
            await this.addTag(tagKey, UINT32_BE.get(dataAtom.value, 0));
            break;
          default:
            this.addWarning(`atom key=${tagKey}, has unknown well-known-type (data-type): ${dataAtom.type.type}`);
        }
      }
      async parseTrackBox(trakBox) {
        const track = {
          media: {},
          fragments: []
        };
        await trakBox.readAtoms(this.tokenizer, async (child) => {
          const payLoadLength = child.getPayloadLength();
          switch (child.header.name) {
            case "chap": {
              const chap = await this.readToken(new ChapterTrackReferenceBox(payLoadLength));
              track.chapterList = chap;
              break;
            }
            case "tkhd":
              track.header = await this.readToken(new TrackHeaderAtom(payLoadLength));
              break;
            case "hdlr":
              track.handler = await this.readToken(new HandlerBox(payLoadLength));
              track.isAudio = () => track.handler.handlerType === "audi" || track.handler.handlerType === "soun";
              track.isVideo = () => track.handler.handlerType === "vide";
              if (track.isAudio()) {
                this.hasAudioTrack = true;
              } else if (track.isVideo()) {
                this.hasVideoTrack = true;
              }
              break;
            case "mdhd": {
              const mdhd_data = await this.readToken(new MdhdAtom(payLoadLength));
              track.media.header = mdhd_data;
              break;
            }
            case "stco": {
              const stco = await this.readToken(new StcoAtom(payLoadLength));
              track.chunkOffsetTable = stco.entries;
              break;
            }
            case "stsc": {
              const stsc = await this.readToken(new StscAtom(payLoadLength));
              track.sampleToChunkTable = stsc.entries;
              break;
            }
            case "stsd": {
              const stsd = await this.readToken(new StsdAtom(payLoadLength));
              track.soundSampleDescription = stsd.table.map((dfEntry) => this.parseSoundSampleDescription(dfEntry));
              break;
            }
            case "stts": {
              const stts = await this.readToken(new SttsAtom(payLoadLength));
              track.timeToSampleTable = stts.entries;
              break;
            }
            case "stsz": {
              const stsz = await this.readToken(new StszAtom(payLoadLength));
              track.sampleSize = stsz.sampleSize;
              track.sampleSizeTable = stsz.entries;
              break;
            }
            case "dinf":
            case "vmhd":
            case "smhd":
              debug17(`Ignoring: ${child.header.name}`);
              await this.tokenizer.ignore(payLoadLength);
              break;
            default: {
              debug17(`Unexpected track box: ${child.header.name}`);
              await this.tokenizer.ignore(payLoadLength);
            }
          }
        }, trakBox.getPayloadLength());
        this.tracks.set(track.header.trackId, track);
      }
      parseTrackFragmentBox(trafBox) {
        let tfhd;
        return trafBox.readAtoms(this.tokenizer, async (child) => {
          const payLoadLength = child.getPayloadLength();
          switch (child.header.name) {
            case "tfhd": {
              const fragmentHeaderBox = new TrackFragmentHeaderBox(child.getPayloadLength());
              tfhd = await this.readToken(fragmentHeaderBox);
              break;
            }
            case "tfdt":
              await this.tokenizer.ignore(payLoadLength);
              break;
            case "trun": {
              const trackRunBox = new TrackRunBox(payLoadLength);
              const trun = await this.readToken(trackRunBox);
              if (tfhd) {
                const track = this.tracks.get(tfhd.trackId);
                track?.fragments.push({ header: tfhd, trackRun: trun });
              }
              break;
            }
            default: {
              debug17(`Unexpected box: ${child.header.name}`);
              await this.tokenizer.ignore(payLoadLength);
            }
          }
        }, trafBox.getPayloadLength());
      }
      atomParsers = {
        /**
         * Parse movie header (mvhd) atom
         * Ref: https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/QTFFChap2/qtff2.html#//apple_ref/doc/uid/TP40000939-CH204-56313
         */
        mvhd: async (len) => {
          const mvhd = await this.readToken(new MvhdAtom(len));
          this.metadata.setFormat("creationTime", mvhd.creationTime);
          this.metadata.setFormat("modificationTime", mvhd.modificationTime);
        },
        chap: async (len) => {
          const td = this.getTrackDescription();
          const trackIds = [];
          while (len >= UINT32_BE.len) {
            trackIds.push(await this.tokenizer.readNumber(UINT32_BE));
            len -= UINT32_BE.len;
          }
          td.chapterList = trackIds;
        },
        /**
         * Parse mdat atom.
         * Will scan for chapters
         */
        mdat: async (len) => {
          if (this.options.includeChapters) {
            const trackWithChapters = [...this.tracks.values()].filter((track) => track.chapterList);
            if (trackWithChapters.length === 1) {
              const chapterTrackIds = trackWithChapters[0].chapterList;
              const chapterTracks = [...this.tracks.values()].filter((track) => chapterTrackIds.indexOf(track.header.trackId) !== -1);
              if (chapterTracks.length === 1) {
                return this.parseChapterTrack(chapterTracks[0], trackWithChapters[0], len);
              }
            }
          }
          await this.tokenizer.ignore(len);
        },
        ftyp: async (len) => {
          if (len < 8 || len % ftyp.len !== 0) {
            throw new Mp4ContentError(`Invalid ftyp payload length: ${len}`);
          }
          const types = [];
          while (len > 0) {
            const ftype = await this.readToken(ftyp);
            len -= ftyp.len;
            const value = ftype.type.replace(/\W/g, "");
            if (value.length > 0) {
              types.push(value);
            }
          }
          debug17(`ftyp: ${types.join("/")}`);
          const x = types.filter(distinct).join("/");
          this.metadata.setFormat("container", x);
        },
        /**
         * Parse sample description atom
         */
        stsd: async (len) => {
          const stsd = await this.readToken(new StsdAtom(len));
          const trackDescription = this.getTrackDescription();
          trackDescription.soundSampleDescription = stsd.table.map((dfEntry) => this.parseSoundSampleDescription(dfEntry));
        },
        /**
         * Parse sample-sizes atom ('stsz')
         */
        stsz: async (len) => {
          const stsz = await this.readToken(new StszAtom(len));
          const td = this.getTrackDescription();
          td.sampleSize = stsz.sampleSize;
          td.sampleSizeTable = stsz.entries;
        },
        date: async (len) => {
          const date = await this.readToken(new StringType(len, "utf-8"));
          await this.addTag("date", date);
        }
      };
      /**
       * @param sampleDescription
       * Ref: https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/QTFFChap3/qtff3.html#//apple_ref/doc/uid/TP40000939-CH205-128916
       */
      parseSoundSampleDescription(sampleDescription) {
        const ssd = {
          dataFormat: sampleDescription.dataFormat,
          dataReferenceIndex: sampleDescription.dataReferenceIndex
        };
        let offset = 0;
        const { description } = sampleDescription;
        if (description && description.length >= SoundSampleDescriptionVersion.len) {
          const version = SoundSampleDescriptionVersion.get(description, offset);
          offset += SoundSampleDescriptionVersion.len;
          if (version.version === 0 || version.version === 1) {
            if (description.length >= offset + SoundSampleDescriptionV0.len) {
              ssd.description = SoundSampleDescriptionV0.get(description, offset);
            } else {
              debug17(`Warning: sound-sample-description too short: ${description.length} bytes`);
            }
          } else {
            debug17(`Warning: sound-sample-description ${version} not implemented`);
          }
        }
        return ssd;
      }
      async parseChapterTrack(chapterTrack, track, len) {
        if (!chapterTrack.sampleSize) {
          if (chapterTrack.chunkOffsetTable.length !== chapterTrack.sampleSizeTable.length) {
            throw new Error("Expected equal chunk-offset-table & sample-size-table length.");
          }
        }
        const chapters = [];
        for (let i = 0; i < chapterTrack.chunkOffsetTable.length && len > 0; ++i) {
          const start = chapterTrack.timeToSampleTable.slice(0, i).reduce((acc, cur) => acc + cur.duration, 0);
          const chunkOffset = chapterTrack.chunkOffsetTable[i];
          const nextChunkLen = chunkOffset - this.tokenizer.position;
          const sampleSize = chapterTrack.sampleSize > 0 ? chapterTrack.sampleSize : chapterTrack.sampleSizeTable[i];
          len -= nextChunkLen + sampleSize;
          if (len < 0) {
            throw new Mp4ContentError("Chapter chunk exceeding token length");
          }
          await this.tokenizer.ignore(nextChunkLen);
          const title = await this.readToken(new ChapterText(sampleSize));
          debug17(`Chapter ${i + 1}: ${title}`);
          const chapter = {
            title,
            timeScale: chapterTrack.media.header ? chapterTrack.media.header.timeScale : 0,
            start,
            sampleOffset: this.findSampleOffset(track, this.tokenizer.position)
          };
          debug17(`Chapter title=${chapter.title}, offset=${chapter.sampleOffset}/${track.header.duration}`);
          chapters.push(chapter);
        }
        this.metadata.setFormat("chapters", chapters);
        await this.tokenizer.ignore(len);
      }
      findSampleOffset(track, chapterOffset) {
        let chunkIndex = 0;
        while (chunkIndex < track.chunkOffsetTable.length && track.chunkOffsetTable[chunkIndex] < chapterOffset) {
          ++chunkIndex;
        }
        return this.getChunkDuration(chunkIndex + 1, track);
      }
      getChunkDuration(chunkId, track) {
        let ttsi = 0;
        let ttsc = track.timeToSampleTable[ttsi].count;
        let ttsd = track.timeToSampleTable[ttsi].duration;
        let curChunkId = 1;
        let samplesPerChunk = this.getSamplesPerChunk(curChunkId, track.sampleToChunkTable);
        let totalDuration = 0;
        while (curChunkId < chunkId) {
          const nrOfSamples = Math.min(ttsc, samplesPerChunk);
          totalDuration += nrOfSamples * ttsd;
          ttsc -= nrOfSamples;
          samplesPerChunk -= nrOfSamples;
          if (samplesPerChunk === 0) {
            ++curChunkId;
            samplesPerChunk = this.getSamplesPerChunk(curChunkId, track.sampleToChunkTable);
          } else {
            ++ttsi;
            ttsc = track.timeToSampleTable[ttsi].count;
            ttsd = track.timeToSampleTable[ttsi].duration;
          }
        }
        return totalDuration;
      }
      getSamplesPerChunk(chunkId, stcTable) {
        for (let i = 0; i < stcTable.length - 1; ++i) {
          if (chunkId >= stcTable[i].firstChunk && chunkId < stcTable[i + 1].firstChunk) {
            return stcTable[i].samplesPerChunk;
          }
        }
        return stcTable[stcTable.length - 1].samplesPerChunk;
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/mpeg/ReplayGainDataFormat.js
var ReplayGain;
var init_ReplayGainDataFormat = __esm({
  "soda-player/node_modules/music-metadata/lib/mpeg/ReplayGainDataFormat.js"() {
    init_Util();
    ReplayGain = {
      len: 2,
      get: (buf, off) => {
        const gain_type = getBitAllignedNumber(buf, off, 0, 3);
        const sign = getBitAllignedNumber(buf, off, 6, 1);
        const gain_adj = getBitAllignedNumber(buf, off, 7, 9) / 10;
        if (gain_type > 0) {
          return {
            type: getBitAllignedNumber(buf, off, 0, 3),
            origin: getBitAllignedNumber(buf, off, 3, 3),
            adjustment: sign ? -gain_adj : gain_adj
          };
        }
        return void 0;
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/mpeg/ExtendedLameHeader.js
var ExtendedLameHeader;
var init_ExtendedLameHeader = __esm({
  "soda-player/node_modules/music-metadata/lib/mpeg/ExtendedLameHeader.js"() {
    init_lib3();
    init_Util();
    init_ReplayGainDataFormat();
    ExtendedLameHeader = {
      len: 27,
      get: (buf, off) => {
        const track_peak = UINT32_BE.get(buf, off + 2);
        return {
          revision: getBitAllignedNumber(buf, off, 0, 4),
          vbr_method: getBitAllignedNumber(buf, off, 4, 4),
          lowpass_filter: 100 * UINT8.get(buf, off + 1),
          track_peak: track_peak === 0 ? null : track_peak / 2 ** 23,
          track_gain: ReplayGain.get(buf, 6),
          album_gain: ReplayGain.get(buf, 8),
          music_length: UINT32_BE.get(buf, off + 20),
          music_crc: UINT8.get(buf, off + 24),
          header_crc: UINT16_BE.get(buf, off + 24)
        };
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/mpeg/XingTag.js
async function readXingHeader(tokenizer) {
  const flags = await tokenizer.readToken(XingHeaderFlags);
  const xingInfoTag = { numFrames: null, streamSize: null, vbrScale: null };
  if (flags.frames) {
    xingInfoTag.numFrames = await tokenizer.readToken(UINT32_BE);
  }
  if (flags.bytes) {
    xingInfoTag.streamSize = await tokenizer.readToken(UINT32_BE);
  }
  if (flags.toc) {
    xingInfoTag.toc = new Uint8Array(100);
    await tokenizer.readBuffer(xingInfoTag.toc);
  }
  if (flags.vbrScale) {
    xingInfoTag.vbrScale = await tokenizer.readToken(UINT32_BE);
  }
  const lameTag = await tokenizer.peekToken(new StringType(4, "ascii"));
  if (lameTag === "LAME") {
    await tokenizer.ignore(4);
    xingInfoTag.lame = {
      version: await tokenizer.readToken(new StringType(5, "ascii"))
    };
    const match = xingInfoTag.lame.version.match(/\d+.\d+/g);
    if (match !== null) {
      const majorMinorVersion = match[0];
      const version = majorMinorVersion.split(".").map((n) => Number.parseInt(n, 10));
      if (version[0] >= 3 && version[1] >= 90) {
        xingInfoTag.lame.extended = await tokenizer.readToken(ExtendedLameHeader);
      }
    }
  }
  return xingInfoTag;
}
var InfoTagHeaderTag, LameEncoderVersion, XingHeaderFlags;
var init_XingTag = __esm({
  "soda-player/node_modules/music-metadata/lib/mpeg/XingTag.js"() {
    init_lib3();
    init_Util();
    init_ExtendedLameHeader();
    InfoTagHeaderTag = new StringType(4, "ascii");
    LameEncoderVersion = new StringType(6, "ascii");
    XingHeaderFlags = {
      len: 4,
      get: (buf, off) => {
        return {
          frames: isBitSet(buf, off, 31),
          bytes: isBitSet(buf, off, 30),
          toc: isBitSet(buf, off, 29),
          vbrScale: isBitSet(buf, off, 28)
        };
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/mpeg/MpegParser.js
var MpegParser_exports = {};
__export(MpegParser_exports, {
  MpegContentError: () => MpegContentError,
  MpegParser: () => MpegParser
});
function getVbrCodecProfile(vbrScale) {
  return `V${Math.floor((100 - vbrScale) / 10)}`;
}
var import_debug18, debug18, MpegContentError, maxPeekLen, MPEG4, MPEG4_ChannelConfigurations, MpegFrameHeader, FrameHeader, MpegParser;
var init_MpegParser = __esm({
  "soda-player/node_modules/music-metadata/lib/mpeg/MpegParser.js"() {
    import_debug18 = __toESM(require_src(), 1);
    init_lib();
    init_lib3();
    init_Util();
    init_AbstractID3Parser();
    init_ParseError();
    init_XingTag();
    debug18 = (0, import_debug18.default)("music-metadata:parser:mpeg");
    MpegContentError = class extends makeUnexpectedFileContentError("MPEG") {
    };
    maxPeekLen = 1024;
    MPEG4 = {
      /**
       * Audio Object Types
       */
      AudioObjectTypes: [
        "AAC Main",
        "AAC LC",
        // Low Complexity
        "AAC SSR",
        // Scalable Sample Rate
        "AAC LTP"
        // Long Term Prediction
      ],
      /**
       * Sampling Frequencies
       * https://wiki.multimedia.cx/index.php/MPEG-4_Audio#Sampling_Frequencies
       */
      SamplingFrequencies: [
        96e3,
        88200,
        64e3,
        48e3,
        44100,
        32e3,
        24e3,
        22050,
        16e3,
        12e3,
        11025,
        8e3,
        7350,
        null,
        null,
        null
      ]
      /**
       * Channel Configurations
       */
    };
    MPEG4_ChannelConfigurations = [
      void 0,
      ["front-center"],
      ["front-left", "front-right"],
      ["front-center", "front-left", "front-right"],
      ["front-center", "front-left", "front-right", "back-center"],
      ["front-center", "front-left", "front-right", "back-left", "back-right"],
      ["front-center", "front-left", "front-right", "back-left", "back-right", "LFE-channel"],
      ["front-center", "front-left", "front-right", "side-left", "side-right", "back-left", "back-right", "LFE-channel"]
    ];
    MpegFrameHeader = class _MpegFrameHeader {
      static SyncByte1 = 255;
      static SyncByte2 = 224;
      static VersionID = [2.5, null, 2, 1];
      static LayerDescription = [0, 3, 2, 1];
      static ChannelMode = ["stereo", "joint_stereo", "dual_channel", "mono"];
      static bitrate_index = {
        1: { 11: 32, 12: 32, 13: 32, 21: 32, 22: 8, 23: 8 },
        2: { 11: 64, 12: 48, 13: 40, 21: 48, 22: 16, 23: 16 },
        3: { 11: 96, 12: 56, 13: 48, 21: 56, 22: 24, 23: 24 },
        4: { 11: 128, 12: 64, 13: 56, 21: 64, 22: 32, 23: 32 },
        5: { 11: 160, 12: 80, 13: 64, 21: 80, 22: 40, 23: 40 },
        6: { 11: 192, 12: 96, 13: 80, 21: 96, 22: 48, 23: 48 },
        7: { 11: 224, 12: 112, 13: 96, 21: 112, 22: 56, 23: 56 },
        8: { 11: 256, 12: 128, 13: 112, 21: 128, 22: 64, 23: 64 },
        9: { 11: 288, 12: 160, 13: 128, 21: 144, 22: 80, 23: 80 },
        10: { 11: 320, 12: 192, 13: 160, 21: 160, 22: 96, 23: 96 },
        11: { 11: 352, 12: 224, 13: 192, 21: 176, 22: 112, 23: 112 },
        12: { 11: 384, 12: 256, 13: 224, 21: 192, 22: 128, 23: 128 },
        13: { 11: 416, 12: 320, 13: 256, 21: 224, 22: 144, 23: 144 },
        14: { 11: 448, 12: 384, 13: 320, 21: 256, 22: 160, 23: 160 }
      };
      static sampling_rate_freq_index = {
        1: { 0: 44100, 1: 48e3, 2: 32e3 },
        2: { 0: 22050, 1: 24e3, 2: 16e3 },
        2.5: { 0: 11025, 1: 12e3, 2: 8e3 }
      };
      static samplesInFrameTable = [
        /* Layer   I    II   III */
        [0, 384, 1152, 1152],
        // MPEG-1
        [0, 384, 1152, 576]
        // MPEG-2(.5
      ];
      // B(20,19): MPEG Audio versionIndex ID
      versionIndex;
      // C(18,17): Layer description
      layer;
      // D(16): Protection bit
      isProtectedByCRC;
      // E(15,12): Bitrate index
      bitrateIndex = null;
      // F(11,10): Sampling rate frequency index
      sampRateFreqIndex = null;
      // G(9): Padding bit
      padding = null;
      // H(8): Private bit
      privateBit = null;
      // I(7,6): Channel Mode
      channelModeIndex = null;
      // J(5,4): Mode extension (Only used in Joint stereo)
      modeExtension = null;
      // K(3): Copyright
      isCopyrighted;
      // L(2): Original
      isOriginalMedia = null;
      // M(3): The original bit indicates, if it is set, that the frame is located on its original media.
      emphasis;
      version = null;
      channelMode;
      bitrate = null;
      samplingRate = null;
      container;
      codec;
      codecProfile;
      frameLength = 0;
      mp4ChannelConfig;
      constructor(buf, off) {
        this.versionIndex = getBitAllignedNumber(buf, off + 1, 3, 2);
        this.layer = _MpegFrameHeader.LayerDescription[getBitAllignedNumber(buf, off + 1, 5, 2)];
        if (this.versionIndex > 1 && this.layer === 0) {
          this.parseAdtsHeader(buf, off);
        } else {
          this.parseMpegHeader(buf, off);
        }
        this.isProtectedByCRC = !isBitSet(buf, off + 1, 7);
      }
      calcDuration(numFrames) {
        return this.samplingRate == null ? null : numFrames * this.calcSamplesPerFrame() / this.samplingRate;
      }
      calcSamplesPerFrame() {
        return _MpegFrameHeader.samplesInFrameTable[this.version === 1 ? 0 : 1][this.layer];
      }
      calculateSideInfoLength() {
        if (this.layer !== 3) {
          return 2;
        }
        if (this.channelModeIndex === 3) {
          if (this.version === 1) {
            return 17;
          }
          if (this.version === 2 || this.version === 2.5) {
            return 9;
          }
        } else {
          if (this.version === 1) {
            return 32;
          }
          if (this.version === 2 || this.version === 2.5) {
            return 17;
          }
        }
        return null;
      }
      calcSlotSize() {
        return [null, 4, 1, 1][this.layer];
      }
      parseMpegHeader(buf, off) {
        this.container = "MPEG";
        this.bitrateIndex = getBitAllignedNumber(buf, off + 2, 0, 4);
        this.sampRateFreqIndex = getBitAllignedNumber(buf, off + 2, 4, 2);
        this.padding = isBitSet(buf, off + 2, 6);
        this.privateBit = isBitSet(buf, off + 2, 7);
        this.channelModeIndex = getBitAllignedNumber(buf, off + 3, 0, 2);
        this.modeExtension = getBitAllignedNumber(buf, off + 3, 2, 2);
        this.isCopyrighted = isBitSet(buf, off + 3, 4);
        this.isOriginalMedia = isBitSet(buf, off + 3, 5);
        this.emphasis = getBitAllignedNumber(buf, off + 3, 7, 2);
        this.version = _MpegFrameHeader.VersionID[this.versionIndex];
        this.channelMode = _MpegFrameHeader.ChannelMode[this.channelModeIndex];
        this.codec = `MPEG ${this.version} Layer ${this.layer}`;
        const bitrateInKbps = this.calcBitrate();
        if (!bitrateInKbps) {
          throw new MpegContentError("Cannot determine bit-rate");
        }
        this.bitrate = bitrateInKbps * 1e3;
        this.samplingRate = this.calcSamplingRate();
        if (this.samplingRate == null) {
          throw new MpegContentError("Cannot determine sampling-rate");
        }
      }
      parseAdtsHeader(buf, off) {
        debug18("layer=0 => ADTS");
        this.version = this.versionIndex === 2 ? 4 : 2;
        this.container = `ADTS/MPEG-${this.version}`;
        const profileIndex = getBitAllignedNumber(buf, off + 2, 0, 2);
        this.codec = "AAC";
        this.codecProfile = MPEG4.AudioObjectTypes[profileIndex];
        debug18(`MPEG-4 audio-codec=${this.codec}`);
        const samplingFrequencyIndex = getBitAllignedNumber(buf, off + 2, 2, 4);
        this.samplingRate = MPEG4.SamplingFrequencies[samplingFrequencyIndex];
        debug18(`sampling-rate=${this.samplingRate}`);
        const channelIndex = getBitAllignedNumber(buf, off + 2, 7, 3);
        this.mp4ChannelConfig = MPEG4_ChannelConfigurations[channelIndex];
        debug18(`channel-config=${this.mp4ChannelConfig ? this.mp4ChannelConfig.join("+") : "?"}`);
        this.frameLength = getBitAllignedNumber(buf, off + 3, 6, 2) << 11;
      }
      calcBitrate() {
        if (this.bitrateIndex === 0 || // free
        this.bitrateIndex === 15) {
          return null;
        }
        if (this.version && this.bitrateIndex) {
          const codecIndex = 10 * Math.floor(this.version) + this.layer;
          return _MpegFrameHeader.bitrate_index[this.bitrateIndex][codecIndex];
        }
        return null;
      }
      calcSamplingRate() {
        if (this.sampRateFreqIndex === 3 || this.version === null || this.sampRateFreqIndex == null) {
          return null;
        }
        return _MpegFrameHeader.sampling_rate_freq_index[this.version][this.sampRateFreqIndex];
      }
    };
    FrameHeader = {
      len: 4,
      get: (buf, off) => {
        return new MpegFrameHeader(buf, off);
      }
    };
    MpegParser = class extends AbstractID3Parser {
      frameCount = 0;
      syncFrameCount = -1;
      totalDataLength = 0;
      audioFrameHeader;
      bitrates = [];
      offset = 0;
      frame_size = 0;
      calculateEofDuration = false;
      samplesPerFrame = null;
      buf_frame_header = new Uint8Array(4);
      /**
       * Number of bytes already parsed since beginning of stream / file
       */
      mpegOffset = null;
      syncPeek = {
        buf: new Uint8Array(maxPeekLen),
        len: 0
      };
      /**
       * Called after ID3 headers have been parsed
       */
      async postId3v2Parse() {
        this.metadata.setFormat("lossless", false);
        this.metadata.setAudioOnly();
        try {
          let quit = false;
          while (!quit) {
            await this.sync();
            quit = await this.parseCommonMpegHeader();
          }
        } catch (err) {
          if (err instanceof EndOfStreamError) {
            debug18("End-of-stream");
            if (this.calculateEofDuration) {
              if (this.samplesPerFrame !== null) {
                const numberOfSamples = this.frameCount * this.samplesPerFrame;
                this.metadata.setFormat("numberOfSamples", numberOfSamples);
                if (this.metadata.format.sampleRate) {
                  const duration = numberOfSamples / this.metadata.format.sampleRate;
                  debug18(`Calculate duration at EOF: ${duration} sec.`, duration);
                  this.metadata.setFormat("duration", duration);
                }
              }
            }
          } else {
            throw err;
          }
        }
      }
      /**
       * Called after file has been fully parsed, this allows, if present, to exclude the ID3v1.1 header length
       */
      finalize() {
        const format = this.metadata.format;
        const hasID3v1 = !!this.metadata.native.ID3v1;
        if (this.mpegOffset !== null) {
          if (format.duration && this.tokenizer.fileInfo.size) {
            const mpegSize = this.tokenizer.fileInfo.size - this.mpegOffset - (hasID3v1 ? 128 : 0);
            if (format.codecProfile && format.codecProfile[0] === "V") {
              this.metadata.setFormat("bitrate", mpegSize * 8 / format.duration);
            }
          }
          if (this.tokenizer.fileInfo.size && format.codecProfile === "CBR") {
            const mpegSize = this.tokenizer.fileInfo.size - this.mpegOffset - (hasID3v1 ? 128 : 0);
            if (this.frame_size !== null && this.samplesPerFrame !== null) {
              const numberOfSamples = Math.round(mpegSize / this.frame_size) * this.samplesPerFrame;
              this.metadata.setFormat("numberOfSamples", numberOfSamples);
              if (format.sampleRate && !format.duration) {
                const duration = numberOfSamples / format.sampleRate;
                debug18("Calculate CBR duration based on file size: %s", duration);
                this.metadata.setFormat("duration", duration);
              }
            }
          }
        }
      }
      async sync() {
        let gotFirstSync = false;
        while (true) {
          let bo = 0;
          this.syncPeek.len = await this.tokenizer.peekBuffer(this.syncPeek.buf, { length: maxPeekLen, mayBeLess: true });
          if (this.syncPeek.len <= 163) {
            throw new EndOfStreamError();
          }
          while (true) {
            if (gotFirstSync && (this.syncPeek.buf[bo] & 224) === 224) {
              this.buf_frame_header[0] = MpegFrameHeader.SyncByte1;
              this.buf_frame_header[1] = this.syncPeek.buf[bo];
              await this.tokenizer.ignore(bo);
              debug18(`Sync at offset=${this.tokenizer.position - 1}, frameCount=${this.frameCount}`);
              if (this.syncFrameCount === this.frameCount) {
                debug18(`Re-synced MPEG stream, frameCount=${this.frameCount}`);
                this.frameCount = 0;
                this.frame_size = 0;
              }
              this.syncFrameCount = this.frameCount;
              return;
            }
            gotFirstSync = false;
            bo = this.syncPeek.buf.indexOf(MpegFrameHeader.SyncByte1, bo);
            if (bo === -1) {
              if (this.syncPeek.len < this.syncPeek.buf.length) {
                throw new EndOfStreamError();
              }
              await this.tokenizer.ignore(this.syncPeek.len);
              break;
            }
            ++bo;
            gotFirstSync = true;
          }
        }
      }
      /**
       * Combined ADTS & MPEG (MP2 & MP3) header handling
       * @return {Promise<boolean>} true if parser should quit
       */
      async parseCommonMpegHeader() {
        if (this.frameCount === 0) {
          this.mpegOffset = this.tokenizer.position - 1;
        }
        await this.tokenizer.peekBuffer(this.buf_frame_header.subarray(1), { length: 3 });
        let header;
        try {
          header = FrameHeader.get(this.buf_frame_header, 0);
        } catch (err) {
          await this.tokenizer.ignore(1);
          if (err instanceof Error) {
            this.metadata.addWarning(`Parse error: ${err.message}`);
            return false;
          }
          throw err;
        }
        await this.tokenizer.ignore(3);
        this.metadata.setFormat("container", header.container);
        this.metadata.setFormat("codec", header.codec);
        this.metadata.setFormat("lossless", false);
        this.metadata.setFormat("sampleRate", header.samplingRate);
        this.frameCount++;
        return header.version !== null && header.version >= 2 && header.layer === 0 ? this.parseAdts(header) : this.parseAudioFrameHeader(header);
      }
      /**
       * @return {Promise<boolean>} true if parser should quit
       */
      async parseAudioFrameHeader(header) {
        this.metadata.setFormat("numberOfChannels", header.channelMode === "mono" ? 1 : 2);
        this.metadata.setFormat("bitrate", header.bitrate);
        if (this.frameCount < 20 * 1e4) {
          debug18("offset=%s MP%s bitrate=%s sample-rate=%s", this.tokenizer.position - 4, header.layer, header.bitrate, header.samplingRate);
        }
        const slot_size = header.calcSlotSize();
        if (slot_size === null) {
          throw new MpegContentError("invalid slot_size");
        }
        const samples_per_frame = header.calcSamplesPerFrame();
        debug18(`samples_per_frame=${samples_per_frame}`);
        const bps = samples_per_frame / 8;
        if (header.bitrate !== null && header.samplingRate != null) {
          const fsize = bps * header.bitrate / header.samplingRate + (header.padding ? slot_size : 0);
          this.frame_size = Math.floor(fsize);
        }
        this.audioFrameHeader = header;
        if (header.bitrate !== null) {
          this.bitrates.push(header.bitrate);
        }
        if (this.frameCount === 1) {
          this.offset = FrameHeader.len;
          await this.skipSideInformation();
          return false;
        }
        if (this.frameCount === 4) {
          if (this.areAllSame(this.bitrates)) {
            this.samplesPerFrame = samples_per_frame;
            this.metadata.setFormat("codecProfile", "CBR");
            if (this.tokenizer.fileInfo.size) {
              return true;
            }
          } else if (this.metadata.format.duration) {
            return true;
          }
          if (!this.options.duration) {
            return true;
          }
        }
        if (this.options.duration && this.frameCount === 4) {
          this.samplesPerFrame = samples_per_frame;
          this.calculateEofDuration = true;
        }
        this.offset = 4;
        if (header.isProtectedByCRC) {
          await this.parseCrc();
          return false;
        }
        await this.skipSideInformation();
        return false;
      }
      async parseAdts(header) {
        const buf = new Uint8Array(3);
        await this.tokenizer.readBuffer(buf);
        header.frameLength += getBitAllignedNumber(buf, 0, 0, 11);
        this.totalDataLength += header.frameLength;
        this.samplesPerFrame = 1024;
        if (header.samplingRate !== null) {
          const framesPerSec = header.samplingRate / this.samplesPerFrame;
          const bytesPerFrame = this.frameCount === 0 ? 0 : this.totalDataLength / this.frameCount;
          const bitrate = 8 * bytesPerFrame * framesPerSec + 0.5;
          this.metadata.setFormat("bitrate", bitrate);
          debug18(`frame-count=${this.frameCount}, size=${header.frameLength} bytes, bit-rate=${bitrate}`);
        }
        await this.tokenizer.ignore(header.frameLength > 7 ? header.frameLength - 7 : 1);
        if (this.frameCount === 3) {
          this.metadata.setFormat("codecProfile", header.codecProfile);
          if (header.mp4ChannelConfig) {
            this.metadata.setFormat("numberOfChannels", header.mp4ChannelConfig.length);
          }
          if (this.options.duration) {
            this.calculateEofDuration = true;
          } else {
            return true;
          }
        }
        return false;
      }
      async parseCrc() {
        await this.tokenizer.ignore(INT16_BE.len);
        this.offset += INT16_BE.len;
        return this.skipSideInformation();
      }
      async skipSideInformation() {
        if (this.audioFrameHeader) {
          const sideinfo_length = this.audioFrameHeader.calculateSideInfoLength();
          if (sideinfo_length !== null) {
            await this.tokenizer.readToken(new Uint8ArrayType(sideinfo_length));
            this.offset += sideinfo_length;
            await this.readXtraInfoHeader();
            return;
          }
        }
      }
      async readXtraInfoHeader() {
        const headerTag = await this.tokenizer.readToken(InfoTagHeaderTag);
        this.offset += InfoTagHeaderTag.len;
        switch (headerTag) {
          case "Info":
            this.metadata.setFormat("codecProfile", "CBR");
            return this.readXingInfoHeader();
          case "Xing": {
            const infoTag = await this.readXingInfoHeader();
            if (infoTag.vbrScale !== null) {
              const codecProfile = getVbrCodecProfile(infoTag.vbrScale);
              this.metadata.setFormat("codecProfile", codecProfile);
            }
            return null;
          }
          case "Xtra":
            break;
          case "LAME": {
            const version = await this.tokenizer.readToken(LameEncoderVersion);
            if (this.frame_size !== null && this.frame_size >= this.offset + LameEncoderVersion.len) {
              this.offset += LameEncoderVersion.len;
              this.metadata.setFormat("tool", `LAME ${version}`);
              await this.skipFrameData(this.frame_size - this.offset);
              return null;
            }
            this.metadata.addWarning("Corrupt LAME header");
            break;
          }
        }
        const frameDataLeft = this.frame_size - this.offset;
        if (frameDataLeft < 0) {
          this.metadata.addWarning(`Frame ${this.frameCount}corrupt: negative frameDataLeft`);
        } else {
          await this.skipFrameData(frameDataLeft);
        }
        return null;
      }
      /**
       * Ref: http://gabriel.mp3-tech.org/mp3infotag.html
       * @returns {Promise<string>}
       */
      async readXingInfoHeader() {
        const offset = this.tokenizer.position;
        const infoTag = await readXingHeader(this.tokenizer);
        this.offset += this.tokenizer.position - offset;
        if (infoTag.lame) {
          this.metadata.setFormat("tool", `LAME ${stripNulls(infoTag.lame.version)}`);
          if (infoTag.lame.extended) {
            this.metadata.setFormat("trackPeakLevel", infoTag.lame.extended.track_peak);
            if (infoTag.lame.extended.track_gain) {
              this.metadata.setFormat("trackGain", infoTag.lame.extended.track_gain.adjustment);
            }
            if (infoTag.lame.extended.album_gain) {
              this.metadata.setFormat("albumGain", infoTag.lame.extended.album_gain.adjustment);
            }
            this.metadata.setFormat("duration", infoTag.lame.extended.music_length / 1e3);
          }
        }
        if (infoTag.streamSize && this.audioFrameHeader && infoTag.numFrames !== null) {
          const duration = this.audioFrameHeader.calcDuration(infoTag.numFrames);
          this.metadata.setFormat("duration", duration);
          debug18("Get duration from Xing header: %s", this.metadata.format.duration);
          return infoTag;
        }
        const frameDataLeft = this.frame_size - this.offset;
        await this.skipFrameData(frameDataLeft);
        return infoTag;
      }
      async skipFrameData(frameDataLeft) {
        if (frameDataLeft < 0) {
          throw new MpegContentError("frame-data-left cannot be negative");
        }
        await this.tokenizer.ignore(frameDataLeft);
      }
      areAllSame(array) {
        const first = array[0];
        return array.every((element) => {
          return element === first;
        });
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/musepack/MusepackConentError.js
var MusepackContentError;
var init_MusepackConentError = __esm({
  "soda-player/node_modules/music-metadata/lib/musepack/MusepackConentError.js"() {
    init_ParseError();
    MusepackContentError = class extends makeUnexpectedFileContentError("Musepack") {
    };
  }
});

// soda-player/node_modules/music-metadata/lib/musepack/sv7/BitReader.js
var BitReader;
var init_BitReader = __esm({
  "soda-player/node_modules/music-metadata/lib/musepack/sv7/BitReader.js"() {
    init_lib3();
    BitReader = class {
      pos = 0;
      dword = null;
      tokenizer;
      constructor(tokenizer) {
        this.tokenizer = tokenizer;
      }
      /**
       *
       * @param bits 1..30 bits
       */
      async read(bits) {
        while (this.dword === null) {
          this.dword = await this.tokenizer.readToken(UINT32_LE);
        }
        let out = this.dword;
        this.pos += bits;
        if (this.pos < 32) {
          out >>>= 32 - this.pos;
          return out & (1 << bits) - 1;
        }
        this.pos -= 32;
        if (this.pos === 0) {
          this.dword = null;
          return out & (1 << bits) - 1;
        }
        this.dword = await this.tokenizer.readToken(UINT32_LE);
        if (this.pos) {
          out <<= this.pos;
          out |= this.dword >>> 32 - this.pos;
        }
        return out & (1 << bits) - 1;
      }
      async ignore(bits) {
        if (this.pos > 0) {
          const remaining = 32 - this.pos;
          this.dword = null;
          bits -= remaining;
          this.pos = 0;
        }
        const remainder = bits % 32;
        const numOfWords = (bits - remainder) / 32;
        await this.tokenizer.ignore(numOfWords * 4);
        return this.read(remainder);
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/musepack/sv7/StreamVersion7.js
var Header4;
var init_StreamVersion7 = __esm({
  "soda-player/node_modules/music-metadata/lib/musepack/sv7/StreamVersion7.js"() {
    init_lib2();
    init_lib3();
    init_Util();
    Header4 = {
      len: 6 * 4,
      get: (buf, off) => {
        const header = {
          // word 0
          signature: textDecode(buf.subarray(off, off + 3), "latin1"),
          // versionIndex number * 1000 (3.81 = 3810) (remember that 4-byte alignment causes this to take 4-bytes)
          streamMinorVersion: getBitAllignedNumber(buf, off + 3, 0, 4),
          streamMajorVersion: getBitAllignedNumber(buf, off + 3, 4, 4),
          // word 1
          frameCount: UINT32_LE.get(buf, off + 4),
          // word 2
          maxLevel: UINT16_LE.get(buf, off + 8),
          sampleFrequency: [44100, 48e3, 37800, 32e3][getBitAllignedNumber(buf, off + 10, 0, 2)],
          link: getBitAllignedNumber(buf, off + 10, 2, 2),
          profile: getBitAllignedNumber(buf, off + 10, 4, 4),
          maxBand: getBitAllignedNumber(buf, off + 11, 0, 6),
          intensityStereo: isBitSet(buf, off + 11, 6),
          midSideStereo: isBitSet(buf, off + 11, 7),
          // word 3
          titlePeak: UINT16_LE.get(buf, off + 12),
          titleGain: UINT16_LE.get(buf, off + 14),
          // word 4
          albumPeak: UINT16_LE.get(buf, off + 16),
          albumGain: UINT16_LE.get(buf, off + 18),
          // word
          lastFrameLength: UINT32_LE.get(buf, off + 20) >>> 20 & 2047,
          trueGapless: isBitSet(buf, off + 23, 0)
        };
        header.lastFrameLength = header.trueGapless ? UINT32_LE.get(buf, 20) >>> 20 & 2047 : 0;
        return header;
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/musepack/sv7/MpcSv7Parser.js
var import_debug19, debug19, MpcSv7Parser;
var init_MpcSv7Parser = __esm({
  "soda-player/node_modules/music-metadata/lib/musepack/sv7/MpcSv7Parser.js"() {
    import_debug19 = __toESM(require_src(), 1);
    init_APEv2Parser();
    init_BasicParser();
    init_MusepackConentError();
    init_BitReader();
    init_StreamVersion7();
    debug19 = (0, import_debug19.default)("music-metadata:parser:musepack");
    MpcSv7Parser = class extends BasicParser {
      bitreader = null;
      audioLength = 0;
      duration = null;
      async parse() {
        const header = await this.tokenizer.readToken(Header4);
        if (header.signature !== "MP+") {
          throw new MusepackContentError("Unexpected magic number");
        }
        debug19(`stream-version=${header.streamMajorVersion}.${header.streamMinorVersion}`);
        this.metadata.setFormat("container", "Musepack, SV7");
        this.metadata.setFormat("sampleRate", header.sampleFrequency);
        const numberOfSamples = 1152 * (header.frameCount - 1) + header.lastFrameLength;
        this.metadata.setFormat("numberOfSamples", numberOfSamples);
        this.duration = numberOfSamples / header.sampleFrequency;
        this.metadata.setFormat("duration", this.duration);
        this.bitreader = new BitReader(this.tokenizer);
        this.metadata.setFormat("numberOfChannels", header.midSideStereo || header.intensityStereo ? 2 : 1);
        const version = await this.bitreader.read(8);
        this.metadata.setFormat("codec", (version / 100).toFixed(2));
        await this.skipAudioData(header.frameCount);
        debug19(`End of audio stream, switching to APEv2, offset=${this.tokenizer.position}`);
        return tryParseApeHeader(this.metadata, this.tokenizer, this.options);
      }
      async skipAudioData(frameCount) {
        while (frameCount-- > 0) {
          const frameLength = await this.bitreader.read(20);
          this.audioLength += 20 + frameLength;
          await this.bitreader.ignore(frameLength);
        }
        const lastFrameLength = await this.bitreader.read(11);
        this.audioLength += lastFrameLength;
        if (this.duration !== null) {
          this.metadata.setFormat("bitrate", this.audioLength / this.duration);
        }
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/musepack/sv8/StreamVersion8.js
var import_debug20, debug20, PacketKey, SH_part1, SH_part3, StreamReader2;
var init_StreamVersion8 = __esm({
  "soda-player/node_modules/music-metadata/lib/musepack/sv8/StreamVersion8.js"() {
    import_debug20 = __toESM(require_src(), 1);
    init_lib3();
    init_Util();
    debug20 = (0, import_debug20.default)("music-metadata:parser:musepack:sv8");
    PacketKey = new StringType(2, "latin1");
    SH_part1 = {
      len: 5,
      get: (buf, off) => {
        return {
          crc: UINT32_LE.get(buf, off),
          streamVersion: UINT8.get(buf, off + 4)
        };
      }
    };
    SH_part3 = {
      len: 2,
      get: (buf, off) => {
        return {
          sampleFrequency: [44100, 48e3, 37800, 32e3][getBitAllignedNumber(buf, off, 0, 3)],
          maxUsedBands: getBitAllignedNumber(buf, off, 3, 5),
          channelCount: getBitAllignedNumber(buf, off + 1, 0, 4) + 1,
          msUsed: isBitSet(buf, off + 1, 4),
          audioBlockFrames: getBitAllignedNumber(buf, off + 1, 5, 3)
        };
      }
    };
    StreamReader2 = class {
      _tokenizer;
      get tokenizer() {
        return this._tokenizer;
      }
      set tokenizer(value) {
        this._tokenizer = value;
      }
      constructor(_tokenizer) {
        this._tokenizer = _tokenizer;
      }
      async readPacketHeader() {
        const key = await this.tokenizer.readToken(PacketKey);
        const size = await this.readVariableSizeField();
        return {
          key,
          payloadLength: size.value - 2 - size.len
        };
      }
      async readStreamHeader(size) {
        const streamHeader = {};
        debug20(`Reading SH at offset=${this.tokenizer.position}`);
        const part1 = await this.tokenizer.readToken(SH_part1);
        size -= SH_part1.len;
        Object.assign(streamHeader, part1);
        debug20(`SH.streamVersion = ${part1.streamVersion}`);
        const sampleCount = await this.readVariableSizeField();
        size -= sampleCount.len;
        streamHeader.sampleCount = sampleCount.value;
        const bs = await this.readVariableSizeField();
        size -= bs.len;
        streamHeader.beginningOfSilence = bs.value;
        const part3 = await this.tokenizer.readToken(SH_part3);
        size -= SH_part3.len;
        Object.assign(streamHeader, part3);
        await this.tokenizer.ignore(size);
        return streamHeader;
      }
      async readVariableSizeField(len = 1, hb = 0) {
        let n = await this.tokenizer.readNumber(UINT8);
        if ((n & 128) === 0) {
          return { len, value: hb + n };
        }
        n &= 127;
        n += hb;
        return this.readVariableSizeField(len + 1, n << 7);
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/musepack/sv8/MpcSv8Parser.js
var import_debug21, debug21, MpcSv8Parser;
var init_MpcSv8Parser = __esm({
  "soda-player/node_modules/music-metadata/lib/musepack/sv8/MpcSv8Parser.js"() {
    import_debug21 = __toESM(require_src(), 1);
    init_APEv2Parser();
    init_BasicParser();
    init_FourCC();
    init_MusepackConentError();
    init_StreamVersion8();
    debug21 = (0, import_debug21.default)("music-metadata:parser:musepack");
    MpcSv8Parser = class extends BasicParser {
      audioLength = 0;
      async parse() {
        const signature = await this.tokenizer.readToken(FourCcToken);
        if (signature !== "MPCK") {
          throw new MusepackContentError("Invalid Magic number");
        }
        this.metadata.setFormat("container", "Musepack, SV8");
        return this.parsePacket();
      }
      async parsePacket() {
        const sv8reader = new StreamReader2(this.tokenizer);
        do {
          const header = await sv8reader.readPacketHeader();
          debug21(`packet-header key=${header.key}, payloadLength=${header.payloadLength}`);
          switch (header.key) {
            case "SH": {
              const sh = await sv8reader.readStreamHeader(header.payloadLength);
              this.metadata.setFormat("numberOfSamples", sh.sampleCount);
              this.metadata.setFormat("sampleRate", sh.sampleFrequency);
              this.metadata.setFormat("duration", sh.sampleCount / sh.sampleFrequency);
              this.metadata.setFormat("numberOfChannels", sh.channelCount);
              break;
            }
            case "AP":
              this.audioLength += header.payloadLength;
              await this.tokenizer.ignore(header.payloadLength);
              break;
            case "RG":
            // Replaygain
            case "EI":
            // Encoder Info
            case "SO":
            // Seek Table Offset
            case "ST":
            // Seek Table
            case "CT":
              await this.tokenizer.ignore(header.payloadLength);
              break;
            case "SE":
              if (this.metadata.format.duration) {
                this.metadata.setFormat("bitrate", this.audioLength * 8 / this.metadata.format.duration);
              }
              return tryParseApeHeader(this.metadata, this.tokenizer, this.options);
            default:
              throw new MusepackContentError(`Unexpected header: ${header.key}`);
          }
        } while (true);
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/musepack/MusepackParser.js
var MusepackParser_exports = {};
__export(MusepackParser_exports, {
  MusepackParser: () => MusepackParser
});
var import_debug22, debug22, MusepackParser;
var init_MusepackParser = __esm({
  "soda-player/node_modules/music-metadata/lib/musepack/MusepackParser.js"() {
    import_debug22 = __toESM(require_src(), 1);
    init_lib3();
    init_AbstractID3Parser();
    init_MusepackConentError();
    init_MpcSv7Parser();
    init_MpcSv8Parser();
    debug22 = (0, import_debug22.default)("music-metadata:parser:musepack");
    MusepackParser = class extends AbstractID3Parser {
      async postId3v2Parse() {
        const signature = await this.tokenizer.peekToken(new StringType(3, "latin1"));
        let mpcParser;
        switch (signature) {
          case "MP+": {
            debug22("Stream-version 7");
            mpcParser = new MpcSv7Parser(this.metadata, this.tokenizer, this.options);
            break;
          }
          case "MPC": {
            debug22("Stream-version 8");
            mpcParser = new MpcSv8Parser(this.metadata, this.tokenizer, this.options);
            break;
          }
          default: {
            throw new MusepackContentError("Invalid signature prefix");
          }
        }
        this.metadata.setAudioOnly();
        return mpcParser.parse();
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/ogg/flac/FlacStream.js
var import_debug23, debug23, FlacStream;
var init_FlacStream = __esm({
  "soda-player/node_modules/music-metadata/lib/ogg/flac/FlacStream.js"() {
    import_debug23 = __toESM(require_src(), 1);
    init_FourCC();
    init_FlacParser();
    init_FlacToken();
    init_Vorbis();
    debug23 = (0, import_debug23.default)("music-metadata:parser:ogg:theora");
    FlacStream = class {
      metadata;
      options;
      tokenizer;
      flacParser;
      durationOnLastPage = false;
      constructor(metadata, options, tokenizer) {
        this.metadata = metadata;
        this.options = options;
        this.tokenizer = tokenizer;
        this.flacParser = new FlacParser(this.metadata, this.tokenizer, options);
      }
      /**
       * Vorbis 1 parser
       * @param header Ogg Page Header
       * @param pageData Page data
       */
      async parsePage(header, pageData) {
        if (header.headerType.firstPage) {
          await this.parseFirstPage(header, pageData);
        }
      }
      calculateDuration() {
        debug23("duration calculation not implemented");
      }
      /**
       * Parse first Theora Ogg page. the initial identification header packet
       */
      async parseFirstPage(_header, pageData) {
        debug23("First Ogg/FLAC page");
        const fourCC = await FourCcToken.get(pageData, 9);
        if (fourCC.toString() !== "fLaC") {
          throw new Error("Invalid FLAC preamble");
        }
        const blockHeader = await BlockHeader.get(pageData, 13);
        await this.parseDataBlock(blockHeader, pageData.subarray(13 + BlockHeader.len));
      }
      async parseDataBlock(blockHeader, pageData) {
        debug23(`blockHeader type=${blockHeader.type}, length=${blockHeader.length}`);
        switch (blockHeader.type) {
          case BlockType.STREAMINFO: {
            const streamInfo = BlockStreamInfo.get(pageData, 0);
            return this.flacParser.processsStreamInfo(streamInfo);
          }
          case BlockType.PADDING:
            break;
          case BlockType.APPLICATION:
            break;
          case BlockType.SEEKTABLE:
            break;
          case BlockType.VORBIS_COMMENT:
            return this.flacParser.parseComment(pageData);
          case BlockType.PICTURE:
            if (!this.options.skipCovers) {
              const picture = new VorbisPictureToken(pageData.length).get(pageData, 0);
              return this.flacParser.addPictureTag(picture);
            }
            break;
          default:
            this.metadata.addWarning(`Unknown block type: ${blockHeader.type}`);
        }
        return this.tokenizer.ignore(blockHeader.length).then();
      }
      flush() {
        return Promise.resolve();
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/ogg/OggToken.js
var PageHeader, SegmentTable;
var init_OggToken = __esm({
  "soda-player/node_modules/music-metadata/lib/ogg/OggToken.js"() {
    init_lib3();
    init_lib3();
    init_Util();
    PageHeader = {
      len: 27,
      get: (buf, off) => {
        return {
          capturePattern: new StringType(4, "latin1").get(buf, off),
          version: UINT8.get(buf, off + 4),
          headerType: {
            continued: getBit(buf, off + 5, 0),
            firstPage: getBit(buf, off + 5, 1),
            lastPage: getBit(buf, off + 5, 2)
          },
          // packet_flag: Token.UINT8.get(buf, off + 5),
          absoluteGranulePosition: Number(UINT64_LE.get(buf, off + 6)),
          streamSerialNumber: UINT32_LE.get(buf, off + 14),
          pageSequenceNo: UINT32_LE.get(buf, off + 18),
          pageChecksum: UINT32_LE.get(buf, off + 22),
          page_segments: UINT8.get(buf, off + 26)
        };
      }
    };
    SegmentTable = class _SegmentTable {
      static sum(buf, off, len) {
        const dv2 = new DataView(buf.buffer, 0);
        let s = 0;
        for (let i = off; i < off + len; ++i) {
          s += dv2.getUint8(i);
        }
        return s;
      }
      len;
      constructor(header) {
        this.len = header.page_segments;
      }
      get(buf, off) {
        return {
          totalPageSize: _SegmentTable.sum(buf, off, this.len)
        };
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/ogg/opus/Opus.js
var OpusContentError, IdHeader;
var init_Opus = __esm({
  "soda-player/node_modules/music-metadata/lib/ogg/opus/Opus.js"() {
    init_lib3();
    init_ParseError();
    OpusContentError = class extends makeUnexpectedFileContentError("Opus") {
    };
    IdHeader = class {
      len;
      constructor(len) {
        if (len < 19) {
          throw new OpusContentError("ID-header-page 0 should be at least 19 bytes long");
        }
        this.len = len;
      }
      get(buf, off) {
        return {
          magicSignature: new StringType(8, "ascii").get(buf, off + 0),
          version: UINT8.get(buf, off + 8),
          channelCount: UINT8.get(buf, off + 9),
          preSkip: UINT16_LE.get(buf, off + 10),
          inputSampleRate: UINT32_LE.get(buf, off + 12),
          outputGain: UINT16_LE.get(buf, off + 16),
          channelMapping: UINT8.get(buf, off + 18)
        };
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/ogg/opus/OpusStream.js
var OpusStream;
var init_OpusStream = __esm({
  "soda-player/node_modules/music-metadata/lib/ogg/opus/OpusStream.js"() {
    init_lib3();
    init_VorbisStream();
    init_Opus();
    init_Opus();
    OpusStream = class extends VorbisStream {
      idHeader = null;
      lastPos = -1;
      tokenizer;
      constructor(metadata, options, tokenizer) {
        super(metadata, options);
        this.tokenizer = tokenizer;
        this.durationOnLastPage = true;
      }
      /**
       * Parse first Opus Ogg page
       * @param {IPageHeader} header
       * @param {Uint8Array} pageData
       */
      parseFirstPage(_header, pageData) {
        this.metadata.setFormat("codec", "Opus");
        this.idHeader = new IdHeader(pageData.length).get(pageData, 0);
        if (this.idHeader.magicSignature !== "OpusHead") {
          throw new OpusContentError("Illegal ogg/Opus magic-signature");
        }
        this.metadata.setFormat("sampleRate", this.idHeader.inputSampleRate);
        this.metadata.setFormat("numberOfChannels", this.idHeader.channelCount);
        this.metadata.setAudioOnly();
      }
      async parseFullPage(pageData) {
        const magicSignature = new StringType(8, "ascii").get(pageData, 0);
        switch (magicSignature) {
          case "OpusTags":
            await this.parseUserCommentList(pageData, 8);
            this.lastPos = this.tokenizer.position - pageData.length;
            break;
          default:
            break;
        }
      }
      calculateDuration(enfOfStream) {
        if (this.lastPageHeader && (enfOfStream || this.lastPageHeader.headerType.lastPage) && this.metadata.format.sampleRate && this.lastPageHeader.absoluteGranulePosition >= 0) {
          const pos_48bit = this.lastPageHeader.absoluteGranulePosition - this.idHeader.preSkip;
          this.metadata.setFormat("numberOfSamples", pos_48bit);
          this.metadata.setFormat("duration", pos_48bit / 48e3);
          if (this.lastPos !== -1 && this.tokenizer.fileInfo.size && this.metadata.format.duration) {
            const dataSize = this.tokenizer.fileInfo.size - this.lastPos;
            this.metadata.setFormat("bitrate", 8 * dataSize / this.metadata.format.duration);
          }
        }
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/ogg/speex/Speex.js
var Header5;
var init_Speex = __esm({
  "soda-player/node_modules/music-metadata/lib/ogg/speex/Speex.js"() {
    init_lib3();
    init_Util();
    Header5 = {
      len: 80,
      get: (buf, off) => {
        return {
          speex: new StringType(8, "ascii").get(buf, off + 0),
          version: trimRightNull(new StringType(20, "ascii").get(buf, off + 8)),
          version_id: INT32_LE.get(buf, off + 28),
          header_size: INT32_LE.get(buf, off + 32),
          rate: INT32_LE.get(buf, off + 36),
          mode: INT32_LE.get(buf, off + 40),
          mode_bitstream_version: INT32_LE.get(buf, off + 44),
          nb_channels: INT32_LE.get(buf, off + 48),
          bitrate: INT32_LE.get(buf, off + 52),
          frame_size: INT32_LE.get(buf, off + 56),
          vbr: INT32_LE.get(buf, off + 60),
          frames_per_packet: INT32_LE.get(buf, off + 64),
          extra_headers: INT32_LE.get(buf, off + 68),
          reserved1: INT32_LE.get(buf, off + 72),
          reserved2: INT32_LE.get(buf, off + 76)
        };
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/ogg/speex/SpeexStream.js
var import_debug24, debug24, SpeexStream;
var init_SpeexStream = __esm({
  "soda-player/node_modules/music-metadata/lib/ogg/speex/SpeexStream.js"() {
    import_debug24 = __toESM(require_src(), 1);
    init_VorbisStream();
    init_Speex();
    debug24 = (0, import_debug24.default)("music-metadata:parser:ogg:speex");
    SpeexStream = class extends VorbisStream {
      commentHeaderParsed = false;
      constructor(metadata, options, _tokenizer) {
        super(metadata, options);
      }
      /**
       * Parse first Speex Ogg page
       * @param {IPageHeader} header
       * @param {Uint8Array} pageData
       */
      parseFirstPage(_header, pageData) {
        debug24("First Ogg/Speex page");
        const speexHeader = Header5.get(pageData, 0);
        this.metadata.setFormat("codec", `Speex ${speexHeader.version}`);
        this.metadata.setFormat("numberOfChannels", speexHeader.nb_channels);
        this.metadata.setFormat("sampleRate", speexHeader.rate);
        if (speexHeader.bitrate !== -1) {
          this.metadata.setFormat("bitrate", speexHeader.bitrate);
        }
        this.metadata.setAudioOnly();
      }
      /**
       * The packet following the identification header is the comment header, in
       * Vorbis comment format but without a packet type or magic signature.
       * Ref: https://tools.ietf.org/html/rfc5574#section-3
       */
      async parseFullPage(pageData) {
        if (this.commentHeaderParsed) {
          return;
        }
        this.commentHeaderParsed = true;
        debug24("Parse Ogg/Speex comment header");
        await this.parseUserCommentList(pageData, 0);
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/ogg/theora/Theora.js
var IdentificationHeader2;
var init_Theora = __esm({
  "soda-player/node_modules/music-metadata/lib/ogg/theora/Theora.js"() {
    init_lib3();
    IdentificationHeader2 = {
      len: 42,
      get: (buf, off) => {
        return {
          id: new StringType(7, "ascii").get(buf, off),
          vmaj: UINT8.get(buf, off + 7),
          vmin: UINT8.get(buf, off + 8),
          vrev: UINT8.get(buf, off + 9),
          vmbw: UINT16_BE.get(buf, off + 10),
          vmbh: UINT16_BE.get(buf, off + 17),
          nombr: UINT24_BE.get(buf, off + 37),
          nqual: UINT8.get(buf, off + 40)
        };
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/ogg/theora/TheoraStream.js
var import_debug25, debug25, TheoraStream;
var init_TheoraStream = __esm({
  "soda-player/node_modules/music-metadata/lib/ogg/theora/TheoraStream.js"() {
    import_debug25 = __toESM(require_src(), 1);
    init_Theora();
    debug25 = (0, import_debug25.default)("music-metadata:parser:ogg:theora");
    TheoraStream = class {
      metadata;
      durationOnLastPage = false;
      constructor(metadata, _options, _tokenizer) {
        this.metadata = metadata;
      }
      /**
       * Vorbis 1 parser
       * @param header Ogg Page Header
       * @param pageData Page data
       */
      async parsePage(header, pageData) {
        if (header.headerType.firstPage) {
          await this.parseFirstPage(header, pageData);
        }
      }
      calculateDuration() {
        debug25("duration calculation not implemented");
      }
      /**
       * Parse first Theora Ogg page. the initial identification header packet
       */
      async parseFirstPage(_header, pageData) {
        debug25("First Ogg/Theora page");
        this.metadata.setFormat("codec", "Theora");
        const idHeader = IdentificationHeader2.get(pageData, 0);
        this.metadata.setFormat("bitrate", idHeader.nombr);
        this.metadata.setFormat("hasVideo", true);
      }
      flush() {
        return Promise.resolve();
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/ogg/OggParser.js
var OggParser_exports = {};
__export(OggParser_exports, {
  OggContentError: () => OggContentError,
  OggParser: () => OggParser
});
var import_debug26, OggContentError, debug26, OggStream, OggParser;
var init_OggParser = __esm({
  "soda-player/node_modules/music-metadata/lib/ogg/OggParser.js"() {
    import_debug26 = __toESM(require_src(), 1);
    init_lib();
    init_lib3();
    init_BasicParser();
    init_ParseError();
    init_FlacStream();
    init_OggToken();
    init_OpusStream();
    init_SpeexStream();
    init_TheoraStream();
    init_VorbisStream();
    OggContentError = class extends makeUnexpectedFileContentError("Ogg") {
    };
    debug26 = (0, import_debug26.default)("music-metadata:parser:ogg");
    OggStream = class {
      metadata;
      streamSerial;
      pageNumber = 0;
      closed = false;
      options;
      pageConsumer;
      constructor(metadata, streamSerial, options) {
        this.metadata = metadata;
        this.streamSerial = streamSerial;
        this.options = options;
      }
      async parsePage(tokenizer, header) {
        this.pageNumber = header.pageSequenceNo;
        debug26("serial=%s page#=%s, Ogg.id=%s", header.streamSerialNumber, header.pageSequenceNo, header.capturePattern);
        const segmentTable = await tokenizer.readToken(new SegmentTable(header));
        debug26("totalPageSize=%s", segmentTable.totalPageSize);
        const pageData = await tokenizer.readToken(new Uint8ArrayType(segmentTable.totalPageSize));
        debug26("firstPage=%s, lastPage=%s, continued=%s", header.headerType.firstPage, header.headerType.lastPage, header.headerType.continued);
        if (header.headerType.firstPage) {
          this.metadata.setFormat("container", "Ogg");
          const idData = pageData.subarray(0, 7);
          const asciiId = Array.from(idData).filter((b) => b >= 32 && b <= 126).map((b) => String.fromCharCode(b)).join("");
          switch (asciiId) {
            case "vorbis":
              debug26(`Set Ogg stream serial ${header.streamSerialNumber}, codec=Vorbis`);
              this.pageConsumer = new VorbisStream(this.metadata, this.options);
              break;
            case "OpusHea":
              debug26("Set page consumer to Ogg/Opus");
              this.pageConsumer = new OpusStream(this.metadata, this.options, tokenizer);
              break;
            case "Speex  ":
              debug26("Set page consumer to Ogg/Speex");
              this.pageConsumer = new SpeexStream(this.metadata, this.options, tokenizer);
              break;
            case "fishead":
            case "theora":
              debug26("Set page consumer to Ogg/Theora");
              this.pageConsumer = new TheoraStream(this.metadata, this.options, tokenizer);
              break;
            case "FLAC":
              debug26("Set page consumer to Vorbis");
              this.pageConsumer = new FlacStream(this.metadata, this.options, tokenizer);
              break;
            default:
              throw new OggContentError(`Ogg codec not recognized (id=${asciiId}`);
          }
        }
        if (header.headerType.lastPage) {
          this.closed = true;
        }
        if (this.pageConsumer) {
          await this.pageConsumer.parsePage(header, pageData);
        } else {
          throw new Error("pageConsumer should be initialized");
        }
      }
    };
    OggParser = class extends BasicParser {
      streams = /* @__PURE__ */ new Map();
      /**
       * Parse page
       * @returns {Promise<void>}
       */
      async parse() {
        this.streams = /* @__PURE__ */ new Map();
        let enfOfStream = false;
        let stoppedEarly = false;
        let header;
        try {
          do {
            header = await this.tokenizer.readToken(PageHeader);
            if (header.capturePattern !== "OggS") {
              throw new OggContentError("Invalid Ogg capture pattern");
            }
            let stream = this.streams.get(header.streamSerialNumber);
            if (!stream) {
              stream = new OggStream(this.metadata, header.streamSerialNumber, this.options);
              this.streams.set(header.streamSerialNumber, stream);
            }
            await stream.parsePage(this.tokenizer, header);
            if (stream.pageNumber > 12 && // A comment (including its cover art) may span more than 13 pages.
            [...this.streams.values()].every((stream2) => stream2.pageConsumer?.isMetadataComplete !== false) && !(this.options.duration && [...this.streams.values()].find((stream2) => stream2.pageConsumer?.durationOnLastPage))) {
              stoppedEarly = true;
              debug26("Stop processing Ogg stream");
              break;
            }
          } while (![...this.streams.values()].every((item) => item.closed));
        } catch (err) {
          if (err instanceof EndOfStreamError) {
            debug26("Reached end-of-stream");
            enfOfStream = true;
          } else if (err instanceof OggContentError) {
            this.metadata.addWarning(`Corrupt Ogg content at ${this.tokenizer.position}`);
          } else {
            throw err;
          }
        }
        for (const stream of this.streams.values()) {
          if (!stream.closed) {
            if (!stoppedEarly) {
              this.metadata.addWarning(`End-of-stream reached before reaching last page in Ogg stream serial=${stream.streamSerial}`);
            }
            await stream.pageConsumer?.flush();
          }
          stream.pageConsumer?.calculateDuration(enfOfStream);
        }
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/riff/RiffChunk.js
var Header6, ListInfoTagValue;
var init_RiffChunk = __esm({
  "soda-player/node_modules/music-metadata/lib/riff/RiffChunk.js"() {
    init_lib3();
    Header6 = {
      len: 8,
      get: (buf, off) => {
        return {
          // Group-ID
          chunkID: new StringType(4, "latin1").get(buf, off),
          // Size
          chunkSize: UINT32_LE.get(buf, off + 4)
        };
      }
    };
    ListInfoTagValue = class {
      encoding;
      len;
      tagHeader;
      constructor(tagHeader, encoding = "latin1") {
        this.encoding = encoding;
        this.tagHeader = tagHeader;
        this.len = tagHeader.chunkSize;
        this.len += this.len & 1;
      }
      get(buf, off) {
        return new StringType(this.tagHeader.chunkSize, this.encoding).get(buf, off).split("\0", 1)[0];
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/wav/BwfChunk.js
var BroadcastAudioExtensionChunk;
var init_BwfChunk = __esm({
  "soda-player/node_modules/music-metadata/lib/wav/BwfChunk.js"() {
    init_lib3();
    init_Util();
    BroadcastAudioExtensionChunk = {
      len: 420,
      get: (uint8array, off) => {
        return {
          description: stripNulls(new StringType(256, "ascii").get(uint8array, off)).trim(),
          originator: stripNulls(new StringType(32, "ascii").get(uint8array, off + 256)).trim(),
          originatorReference: stripNulls(new StringType(32, "ascii").get(uint8array, off + 288)).trim(),
          originationDate: stripNulls(new StringType(10, "ascii").get(uint8array, off + 320)).trim(),
          originationTime: stripNulls(new StringType(8, "ascii").get(uint8array, off + 330)).trim(),
          timeReferenceLow: UINT32_LE.get(uint8array, off + 338),
          timeReferenceHigh: UINT32_LE.get(uint8array, off + 342),
          version: UINT16_LE.get(uint8array, off + 346),
          umid: new Uint8ArrayType(64).get(uint8array, off + 348),
          loudnessValue: UINT16_LE.get(uint8array, off + 412),
          maxTruePeakLevel: UINT16_LE.get(uint8array, off + 414),
          maxMomentaryLoudness: UINT16_LE.get(uint8array, off + 416),
          maxShortTermLoudness: UINT16_LE.get(uint8array, off + 418)
        };
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/wav/WaveChunk.js
var WaveContentError, WaveFormat, WaveFormatNameMap, Format, FactChunk;
var init_WaveChunk = __esm({
  "soda-player/node_modules/music-metadata/lib/wav/WaveChunk.js"() {
    init_lib3();
    init_ParseError();
    WaveContentError = class extends makeUnexpectedFileContentError("Wave") {
    };
    WaveFormat = {
      PCM: 1,
      ADPCM: 2,
      IEEE_FLOAT: 3,
      ALAW: 6,
      MULAW: 7,
      DVI_ADPCM: 17,
      GSM610: 49,
      // MPEG-4 and AAC Audio Types
      MPEG_ADTS_AAC: 5632,
      MPEG_LOAS: 5634,
      RAW_AAC1: 255,
      // Dolby Audio Types
      DOLBY_AC3_SPDIF: 146,
      DVM: 8192,
      RAW_SPORT: 576,
      ESST_AC3: 577,
      DRM: 9,
      DTS2: 8193,
      MPEG: 80,
      MPEGLAYER3: 85
    };
    WaveFormatNameMap = {
      [WaveFormat.PCM]: "PCM",
      [WaveFormat.ADPCM]: "ADPCM",
      [WaveFormat.IEEE_FLOAT]: "IEEE_FLOAT",
      [WaveFormat.ALAW]: "ALAW",
      [WaveFormat.MULAW]: "MULAW",
      [WaveFormat.DVI_ADPCM]: "DVI_ADPCM",
      [WaveFormat.GSM610]: "GSM610",
      [WaveFormat.MPEG_ADTS_AAC]: "MPEG_ADTS_AAC",
      [WaveFormat.MPEG_LOAS]: "MPEG_LOAS",
      [WaveFormat.RAW_AAC1]: "RAW_AAC1",
      [WaveFormat.DOLBY_AC3_SPDIF]: "DOLBY_AC3_SPDIF",
      [WaveFormat.DVM]: "DVM",
      [WaveFormat.RAW_SPORT]: "RAW_SPORT",
      [WaveFormat.ESST_AC3]: "ESST_AC3",
      [WaveFormat.DRM]: "DRM",
      [WaveFormat.DTS2]: "DTS2",
      [WaveFormat.MPEG]: "MPEG",
      [WaveFormat.MPEGLAYER3]: "MPEGLAYER3"
    };
    Format = class {
      len;
      constructor(header) {
        if (header.chunkSize < 16) {
          throw new WaveContentError("Invalid chunk size");
        }
        this.len = header.chunkSize;
      }
      get(buf, off) {
        return {
          wFormatTag: UINT16_LE.get(buf, off),
          nChannels: UINT16_LE.get(buf, off + 2),
          nSamplesPerSec: UINT32_LE.get(buf, off + 4),
          nAvgBytesPerSec: UINT32_LE.get(buf, off + 8),
          nBlockAlign: UINT16_LE.get(buf, off + 12),
          wBitsPerSample: UINT16_LE.get(buf, off + 14)
        };
      }
    };
    FactChunk = class {
      len;
      constructor(header) {
        if (header.chunkSize < 4) {
          throw new WaveContentError("Invalid fact chunk size.");
        }
        this.len = header.chunkSize;
      }
      get(buf, off) {
        return {
          dwSampleLength: UINT32_LE.get(buf, off)
        };
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/wav/WaveParser.js
var WaveParser_exports = {};
__export(WaveParser_exports, {
  WaveParser: () => WaveParser
});
var import_debug27, debug27, WaveParser;
var init_WaveParser = __esm({
  "soda-player/node_modules/music-metadata/lib/wav/WaveParser.js"() {
    import_debug27 = __toESM(require_src(), 1);
    init_lib();
    init_lib3();
    init_BasicParser();
    init_FourCC();
    init_ID3v2Parser();
    init_RiffChunk();
    init_BwfChunk();
    init_WaveChunk();
    init_WaveChunk();
    debug27 = (0, import_debug27.default)("music-metadata:parser:RIFF");
    WaveParser = class extends BasicParser {
      // CSET applies to the whole file, including INFO chunks preceding it.
      codePage;
      pendingInfoTags = [];
      fact;
      blockAlign = 0;
      avgBytesPerSec = 0;
      header;
      async parse() {
        const riffHeader = await this.tokenizer.readToken(Header6);
        debug27(`pos=${this.tokenizer.position}, parse: chunkID=${riffHeader.chunkID}`);
        if (riffHeader.chunkID !== "RIFF") {
          return;
        }
        this.metadata.setAudioOnly();
        await this.parseRiffChunk(riffHeader.chunkSize).catch((err) => {
          if (!(err instanceof EndOfStreamError)) {
            throw err;
          }
        });
        await this.flushInfoTags();
      }
      async parseRiffChunk(chunkSize) {
        const type = await this.tokenizer.readToken(FourCcToken);
        this.metadata.setFormat("container", type);
        switch (type) {
          case "WAVE":
            return this.readWaveChunk(chunkSize - FourCcToken.len);
          default:
            throw new WaveContentError(`Unsupported RIFF format: RIFF/${type}`);
        }
      }
      async readWaveChunk(remaining) {
        while (remaining >= Header6.len) {
          const header = await this.tokenizer.readToken(Header6);
          remaining -= Header6.len + header.chunkSize;
          if (header.chunkSize > remaining) {
            this.metadata.addWarning("Data chunk size exceeds file size");
          }
          this.header = header;
          debug27(`pos=${this.tokenizer.position}, readChunk: chunkID=RIFF/WAVE/${header.chunkID}`);
          switch (header.chunkID) {
            case "CSET": {
              if (header.chunkSize < 8) {
                throw new WaveContentError("CSET chunk must contain at least 8 bytes");
              }
              const cset = await this.tokenizer.readToken(new Uint8ArrayType(header.chunkSize));
              this.codePage = UINT16_LE.get(cset, 0);
              if (!this.getInfoEncoding()) {
                this.metadata.addWarning(`Unsupported RIFF CSET code page: ${this.codePage}; LIST/INFO tags will be omitted`);
              }
              await this.flushInfoTags();
              break;
            }
            case "LIST":
              await this.parseListTag(header);
              break;
            case "fact":
              this.metadata.setFormat("lossless", false);
              this.fact = await this.tokenizer.readToken(new FactChunk(header));
              break;
            case "fmt ": {
              const fmt = await this.tokenizer.readToken(new Format(header));
              let subFormat = WaveFormatNameMap[fmt.wFormatTag];
              if (!subFormat) {
                debug27(`WAVE/non-PCM format=${fmt.wFormatTag}`);
                subFormat = `non-PCM (${fmt.wFormatTag})`;
              }
              this.metadata.setFormat("codec", subFormat);
              this.metadata.setFormat("bitsPerSample", fmt.wBitsPerSample);
              this.metadata.setFormat("sampleRate", fmt.nSamplesPerSec);
              this.metadata.setFormat("numberOfChannels", fmt.nChannels);
              this.blockAlign = fmt.nBlockAlign;
              this.avgBytesPerSec = fmt.nAvgBytesPerSec;
              break;
            }
            case "id3 ":
            // The way Picard, FooBar currently stores, ID3 meta-data
            case "ID3 ": {
              const id3_data = await this.tokenizer.readToken(new Uint8ArrayType(header.chunkSize));
              const rst = fromBuffer(id3_data);
              await new ID3v2Parser().parse(this.metadata, rst, this.options);
              break;
            }
            case "data": {
              if (this.metadata.format.lossless !== false) {
                this.metadata.setFormat("lossless", true);
              }
              let chunkSize = header.chunkSize;
              if (this.tokenizer.fileInfo.size) {
                const calcRemaining = this.tokenizer.fileInfo.size - this.tokenizer.position;
                if (calcRemaining < chunkSize) {
                  this.metadata.addWarning("data chunk length exceeding file length");
                  chunkSize = calcRemaining;
                }
              }
              const numberOfSamples = this.fact ? this.fact.dwSampleLength : chunkSize === 4294967295 ? void 0 : chunkSize / this.blockAlign;
              if (numberOfSamples) {
                this.metadata.setFormat("numberOfSamples", numberOfSamples);
                if (this.metadata.format.sampleRate) {
                  this.metadata.setFormat("duration", numberOfSamples / this.metadata.format.sampleRate);
                }
              }
              if (this.avgBytesPerSec > 0) {
                this.metadata.setFormat("bitrate", this.avgBytesPerSec * 8);
              } else if (this.metadata.format.duration) {
                this.metadata.setFormat("bitrate", chunkSize * 8 / this.metadata.format.duration);
              }
              await this.tokenizer.ignore(header.chunkSize);
              break;
            }
            case "bext": {
              const bext = await this.tokenizer.readToken(BroadcastAudioExtensionChunk);
              for (const key of Object.keys(bext)) {
                await this.metadata.addTag("exif", `bext.${key}`, bext[key]);
              }
              const bextRemaining = header.chunkSize - BroadcastAudioExtensionChunk.len;
              await this.tokenizer.ignore(bextRemaining);
              break;
            }
            case "\0\0\0\0":
              debug27(`Ignore padding chunk: RIFF/${header.chunkID} of ${header.chunkSize} bytes`);
              this.metadata.addWarning(`Ignore chunk: RIFF/${header.chunkID}`);
              await this.tokenizer.ignore(header.chunkSize);
              break;
            default:
              debug27(`Ignore chunk: RIFF/${header.chunkID} of ${header.chunkSize} bytes`);
              this.metadata.addWarning(`Ignore chunk: RIFF/${header.chunkID}`);
              await this.tokenizer.ignore(header.chunkSize);
          }
          if (this.header.chunkSize % 2 === 1) {
            debug27("Read odd padding byte");
            await this.tokenizer.ignore(1);
          }
        }
      }
      async parseListTag(listHeader) {
        const listType = await this.tokenizer.readToken(new StringType(4, "latin1"));
        debug27("pos=%s, parseListTag: chunkID=RIFF/WAVE/LIST/%s", this.tokenizer.position, listType);
        switch (listType) {
          case "INFO":
            return this.parseRiffInfoTags(listHeader.chunkSize - 4);
          default:
            this.metadata.addWarning(`Ignore chunk: RIFF/WAVE/LIST/${listType}`);
            debug27(`Ignoring chunkID=RIFF/WAVE/LIST/${listType}`);
            return this.tokenizer.ignore(listHeader.chunkSize - 4).then();
        }
      }
      async parseRiffInfoTags(chunkSize) {
        while (chunkSize >= 8) {
          const header = await this.tokenizer.readToken(Header6);
          const valueToken = new ListInfoTagValue(header);
          const bytes = await this.tokenizer.readToken(new Uint8ArrayType(valueToken.len));
          if (this.codePage === void 0) {
            this.metadata.registerTagType("exif");
            this.pendingInfoTags.push({ header, bytes });
          } else {
            await this.addInfoTag(header, bytes);
          }
          chunkSize -= 8 + valueToken.len;
        }
        if (chunkSize !== 0) {
          throw new WaveContentError(`Illegal remaining size: ${chunkSize}`);
        }
      }
      async addInfoTag(header, bytes) {
        const encoding = this.getInfoEncoding();
        if (encoding) {
          const value = new ListInfoTagValue(header, encoding).get(bytes, 0);
          await this.metadata.addTag("exif", header.chunkID, value);
        }
      }
      async flushInfoTags() {
        for (const { header, bytes } of this.pendingInfoTags.splice(0)) {
          await this.addInfoTag(header, bytes);
        }
      }
      getInfoEncoding() {
        switch (this.codePage) {
          case void 0:
          case 0:
          case 28591:
            return "latin1";
          case 1252:
            return "windows-1252";
          case 65001:
            return "utf-8";
          default:
            return void 0;
        }
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/wavpack/WavPackToken.js
function isBitSet3(flags, bitOffset) {
  return getBitAllignedNumber2(flags, bitOffset, 1) === 1;
}
function getBitAllignedNumber2(flags, bitOffset, len) {
  return flags >>> bitOffset & 4294967295 >>> 32 - len;
}
var SampleRates, BlockHeaderToken, MetadataIdToken;
var init_WavPackToken = __esm({
  "soda-player/node_modules/music-metadata/lib/wavpack/WavPackToken.js"() {
    init_lib3();
    init_FourCC();
    SampleRates = [
      6e3,
      8e3,
      9600,
      11025,
      12e3,
      16e3,
      22050,
      24e3,
      32e3,
      44100,
      48e3,
      64e3,
      88200,
      96e3,
      192e3,
      -1
    ];
    BlockHeaderToken = {
      len: 32,
      get: (buf, off) => {
        const flags = UINT32_LE.get(buf, off + 24);
        const res = {
          // should equal 'wvpk'
          BlockID: FourCcToken.get(buf, off),
          //  0x402 to 0x410 are valid for decode
          blockSize: UINT32_LE.get(buf, off + 4),
          //  0x402 (1026) to 0x410 are valid for decode
          version: UINT16_LE.get(buf, off + 8),
          //  40-bit total samples for entire file (if block_index == 0 and a value of -1 indicates an unknown length)
          totalSamples: (
            /* replace with bigint? (Token.UINT8.get(buf, off + 11) << 32) + */
            UINT32_LE.get(buf, off + 12)
          ),
          // 40-bit block_index
          blockIndex: (
            /* replace with bigint? (Token.UINT8.get(buf, off + 10) << 32) + */
            UINT32_LE.get(buf, off + 16)
          ),
          // 40-bit total samples for entire file (if block_index == 0 and a value of -1 indicates an unknown length)
          blockSamples: UINT32_LE.get(buf, off + 20),
          // various flags for id and decoding
          flags: {
            bitsPerSample: (1 + getBitAllignedNumber2(flags, 0, 2)) * 8,
            isMono: isBitSet3(flags, 2),
            isHybrid: isBitSet3(flags, 3),
            isJointStereo: isBitSet3(flags, 4),
            crossChannel: isBitSet3(flags, 5),
            hybridNoiseShaping: isBitSet3(flags, 6),
            floatingPoint: isBitSet3(flags, 7),
            samplingRate: SampleRates[getBitAllignedNumber2(flags, 23, 4)],
            isDSD: isBitSet3(flags, 31)
          },
          // crc for actual decoded data
          crc: new Uint8ArrayType(4).get(buf, off + 28)
        };
        if (res.flags.isDSD) {
          res.totalSamples *= 8;
        }
        return res;
      }
    };
    MetadataIdToken = {
      len: 1,
      get: (buf, off) => {
        return {
          functionId: getBitAllignedNumber2(buf[off], 0, 6),
          // functionId overlaps with isOptional flag
          isOptional: isBitSet3(buf[off], 5),
          isOddSize: isBitSet3(buf[off], 6),
          largeBlock: isBitSet3(buf[off], 7)
        };
      }
    };
  }
});

// soda-player/node_modules/music-metadata/lib/wavpack/WavPackParser.js
var WavPackParser_exports = {};
__export(WavPackParser_exports, {
  WavPackContentError: () => WavPackContentError,
  WavPackParser: () => WavPackParser
});
var import_debug28, debug28, WavPackContentError, WavPackParser;
var init_WavPackParser = __esm({
  "soda-player/node_modules/music-metadata/lib/wavpack/WavPackParser.js"() {
    import_debug28 = __toESM(require_src(), 1);
    init_lib3();
    init_uint8array_extras();
    init_APEv2Parser();
    init_BasicParser();
    init_FourCC();
    init_ParseError();
    init_WavPackToken();
    debug28 = (0, import_debug28.default)("music-metadata:parser:WavPack");
    WavPackContentError = class extends makeUnexpectedFileContentError("WavPack") {
    };
    WavPackParser = class extends BasicParser {
      audioDataSize = 0;
      async parse() {
        this.metadata.setAudioOnly();
        this.audioDataSize = 0;
        await this.parseWavPackBlocks();
        return tryParseApeHeader(this.metadata, this.tokenizer, this.options);
      }
      async parseWavPackBlocks() {
        do {
          const blockId = await this.tokenizer.peekToken(FourCcToken);
          if (blockId !== "wvpk") {
            break;
          }
          const header = await this.tokenizer.readToken(BlockHeaderToken);
          if (header.BlockID !== "wvpk") {
            throw new WavPackContentError("Invalid WavPack Block-ID");
          }
          debug28(`WavPack header blockIndex=${header.blockIndex}, len=${BlockHeaderToken.len}`);
          if (header.blockIndex === 0 && !this.metadata.format.container) {
            this.metadata.setFormat("container", "WavPack");
            this.metadata.setFormat("lossless", !header.flags.isHybrid);
            this.metadata.setFormat("bitsPerSample", header.flags.bitsPerSample);
            if (!header.flags.isDSD) {
              this.metadata.setFormat("sampleRate", header.flags.samplingRate);
              this.metadata.setFormat("duration", header.totalSamples / header.flags.samplingRate);
            }
            this.metadata.setFormat("numberOfChannels", header.flags.isMono ? 1 : 2);
            this.metadata.setFormat("numberOfSamples", header.totalSamples);
            this.metadata.setFormat("codec", header.flags.isDSD ? "DSD" : "PCM");
          }
          const ignoreBytes = header.blockSize - (BlockHeaderToken.len - 8);
          await (header.blockIndex === 0 ? this.parseMetadataSubBlock(header, ignoreBytes) : this.tokenizer.ignore(ignoreBytes));
          if (header.blockSamples > 0) {
            this.audioDataSize += header.blockSize;
          }
        } while (!this.tokenizer.fileInfo.size || this.tokenizer.fileInfo.size - this.tokenizer.position >= BlockHeaderToken.len);
        if (this.metadata.format.duration) {
          this.metadata.setFormat("bitrate", this.audioDataSize * 8 / this.metadata.format.duration);
        }
      }
      /**
       * Ref: http://www.wavpack.com/WavPack5FileFormat.pdf, 3.0 Metadata Sub-blocks
       * @param header Header
       * @param remainingLength Remaining length
       */
      async parseMetadataSubBlock(header, remainingLength) {
        let remaining = remainingLength;
        while (remaining > MetadataIdToken.len) {
          const id = await this.tokenizer.readToken(MetadataIdToken);
          const dataSizeInWords = await this.tokenizer.readNumber(id.largeBlock ? UINT24_LE : UINT8);
          const data = new Uint8Array(dataSizeInWords * 2 - (id.isOddSize ? 1 : 0));
          await this.tokenizer.readBuffer(data);
          debug28(`Metadata Sub-Blocks functionId=0x${id.functionId.toString(16)}, id.largeBlock=${id.largeBlock},data-size=${data.length}`);
          switch (id.functionId) {
            case 0:
              break;
            case 14: {
              debug28("ID_DSD_BLOCK");
              const mp = 1 << UINT8.get(data, 0);
              const samplingRate = header.flags.samplingRate * mp * 8;
              if (!header.flags.isDSD) {
                throw new WavPackContentError("Only expect DSD block if DSD-flag is set");
              }
              this.metadata.setFormat("sampleRate", samplingRate);
              this.metadata.setFormat("duration", header.totalSamples / samplingRate);
              break;
            }
            case 36:
              debug28("ID_ALT_TRAILER: trailer for non-wav files");
              break;
            case 38:
              this.metadata.setFormat("audioMD5", data);
              break;
            case 47:
              debug28(`ID_BLOCK_CHECKSUM: checksum=${uint8ArrayToHex(data)}`);
              break;
            default:
              debug28(`Ignore unsupported meta-sub-block-id functionId=0x${id.functionId.toString(16)}`);
              break;
          }
          remaining -= MetadataIdToken.len + (id.largeBlock ? UINT24_LE.len : UINT8.len) + dataSizeInWords * 2;
          debug28(`remainingLength=${remaining}`);
          if (id.isOddSize) {
            this.tokenizer.ignore(1);
          }
        }
        if (remaining !== 0) {
          throw new WavPackContentError("metadata-sub-block should fit it remaining length");
        }
      }
    };
  }
});

// soda-player/apple-library.cjs
var require_apple_library = __commonJS({
  "soda-player/apple-library.cjs"(exports2, module2) {
    var fs2 = require("node:fs");
    var path2 = require("node:path");
    var { createDecipheriv } = require("node:crypto");
    var { inflateSync } = require("node:zlib");
    var { fileURLToPath } = require("node:url");
    function unpackLibrary(bytes) {
      if (bytes.length < 100 || bytes.toString("ascii", 0, 4) !== "hfma") throw Error("Apple Music \u8D44\u6599\u5E93\u683C\u5F0F\u4E0D\u652F\u6301");
      const header = bytes.readUInt32LE(4), body = bytes.subarray(header);
      if (header < 100 || header > bytes.length) throw Error("Apple Music \u8D44\u6599\u5E93\u5934\u90E8\u4E0D\u5B8C\u6574");
      let encrypted = bytes.readUInt32LE(84);
      if (encrypted > body.length) encrypted = body.length - body.length % 16;
      if (encrypted % 16) throw Error("Apple Music \u8D44\u6599\u5E93\u6B63\u5728\u5199\u5165");
      let prefix = Buffer.alloc(0);
      if (encrypted) {
        const decipher = createDecipheriv("aes-128-ecb", Buffer.from("BHUILuilfghuila3"), null);
        decipher.setAutoPadding(false);
        prefix = Buffer.concat([decipher.update(body.subarray(0, encrypted)), decipher.final()]);
      }
      return inflateSync(Buffer.concat([prefix, body.subarray(encrypted)]), { maxOutputLength: 128 * 1024 * 1024 });
    }
    function parseTracks(bytes) {
      const data = unpackLibrary(bytes), tracks = [];
      for (let at = data.indexOf("itma"); at >= 0; at = data.indexOf("itma", at + 4)) {
        if (at + 16 > data.length) continue;
        const header = data.readUInt32LE(at + 4), count = data.readUInt32LE(at + 12);
        if (header < 24 || header > 4096 || count > 256 || at + header > data.length) continue;
        const track = { title: "", artist: "", album: "", file: "", duration: 0 };
        let offset = at + header;
        for (let n = 0; n < count; n++) {
          if (offset + 20 > data.length || data.toString("ascii", offset, offset + 4) !== "boma") break;
          const size = data.readUInt32LE(offset + 8), kind = data.readUInt32LE(offset + 12);
          if (size < 20 || offset + size > data.length) break;
          const chunk = data.subarray(offset, offset + size);
          if (kind === 1 && size >= 180) track.duration = chunk.readUInt32LE(176) / 1e3;
          const field = { 2: "title", 3: "album", 4: "artist", 11: "file", 67: "file" }[kind];
          if (field && size >= 36) {
            const encoding = chunk.readUInt32LE(20), length = chunk.readUInt32LE(24);
            if (length <= size - 36 && (encoding === 1 || encoding === 2)) {
              const text = chunk.subarray(36, 36 + length).toString(encoding === 1 ? "utf16le" : "utf8").replace(/\0+$/, "");
              if (text) track[field] = text;
            }
          }
          offset += size;
        }
        if (/^file:/i.test(track.file)) {
          try {
            track.file = fileURLToPath(track.file);
          } catch {
            track.file = "";
          }
        }
        if (track.title && path2.isAbsolute(track.file)) tracks.push(track);
      }
      return tracks;
    }
    var loaded = /* @__PURE__ */ new Map();
    function libraryTracks2(roots) {
      const locations = roots.flatMap((root) => [path2.join(root, "Apple Music/Apple Music Library.musiclibrary/Library.musicdb"), path2.join(root, "iTunes/iTunes Library.musiclibrary/Library.musicdb")]);
      const tracks = [];
      let error = "";
      for (const location of locations) {
        try {
          const info = fs2.statSync(location), stamp = info.size + "|" + info.mtimeMs;
          let cached = loaded.get(location);
          if (cached?.stamp !== stamp) {
            cached = { stamp, tracks: parseTracks(fs2.readFileSync(location)) };
            loaded.set(location, cached);
          }
          tracks.push(...cached.tracks);
        } catch (e) {
          if (e.code !== "ENOENT") error = e.message;
        }
      }
      return { tracks, error };
    }
    module2.exports = { unpackLibrary, parseTracks, libraryTracks: libraryTracks2 };
  }
});

// soda-player/local-media.mjs
var local_media_exports = {};
__export(local_media_exports, {
  readExact: () => readExact,
  readLocal: () => readLocal
});
module.exports = __toCommonJS(local_media_exports);
var import_node_fs = __toESM(require("node:fs"), 1);
var import_node_path = __toESM(require("node:path"), 1);

// soda-player/node_modules/music-metadata/lib/index.js
var import_debug30 = __toESM(require_src(), 1);
init_lib();

// soda-player/node_modules/music-metadata/lib/core.js
init_lib();
init_APEv2Parser();
init_ID3v1Parser();

// soda-player/node_modules/music-metadata/lib/lyrics3/Lyrics3.js
init_lib2();
var endTag2 = "LYRICS200";
async function getLyricsHeaderLength(tokenizer) {
  const fileSize = tokenizer.fileInfo.size;
  if (fileSize >= 143) {
    const buf = new Uint8Array(15);
    const position = tokenizer.position;
    await tokenizer.readBuffer(buf, { position: fileSize - 143 });
    tokenizer.setPosition(position);
    const txt = textDecode(buf, "latin1");
    const tag = txt.substring(6);
    if (tag === endTag2) {
      return Number.parseInt(txt.substring(0, 6), 10) + 15;
    }
  }
  return 0;
}

// soda-player/node_modules/content-type/dist/index.js
var SP = 32;
var HTAB = 9;
var SEMI = 59;
var EQ = 61;
var DQUOTE = 34;
var BSLASH = 92;
var COMMA = 44;
var LOWER_CASE = 1;
var OWS = 2;
var SEMI_FLAG = 4;
var COMMA_FLAG = 8;
var TOKEN_FLAG = 16;
var NON_ASCII = 65280;
var CASE_FLAGS = LOWER_CASE | NON_ASCII;
var CHAR_MAP = new Uint8Array(256);
CHAR_MAP[HTAB] |= OWS;
CHAR_MAP[SP] |= OWS;
CHAR_MAP[SEMI] |= SEMI_FLAG;
CHAR_MAP[COMMA] |= COMMA_FLAG;
for (let code = 128; code <= 255; code++) {
  CHAR_MAP[code] |= LOWER_CASE;
}
for (const char of "!#$%&'*+-.^_`|~") {
  CHAR_MAP[char.charCodeAt(0)] |= TOKEN_FLAG;
}
for (let code = 48; code <= 57; code++) {
  CHAR_MAP[code] |= TOKEN_FLAG;
}
for (let code = 65; code <= 90; code++) {
  CHAR_MAP[code] |= LOWER_CASE | TOKEN_FLAG;
}
for (let code = 97; code <= 122; code++) {
  CHAR_MAP[code] |= TOKEN_FLAG;
}
var NullObject = /* @__PURE__ */ (() => {
  const C = function() {
  };
  C.prototype = /* @__PURE__ */ Object.create(null);
  return C;
})();
function parse(header, options) {
  const stopFlags = SEMI_FLAG | (options?.comma === true ? COMMA_FLAG : 0);
  const len = header.length;
  let valueStart = options?.start ?? 0;
  while ((CHAR_MAP[header.charCodeAt(valueStart)] & OWS) !== 0) {
    valueStart++;
  }
  let index = valueStart;
  let typeFlags = 0;
  let whitespace = -1;
  let stop = options?.parameters === false ? COMMA_FLAG : 0;
  while (index < len) {
    const code = header.charCodeAt(index);
    const flags = CHAR_MAP[code];
    if ((flags & stopFlags) !== 0) {
      stop |= flags & COMMA_FLAG;
      break;
    }
    if ((flags & OWS) !== 0) {
      if (whitespace === -1)
        whitespace = index;
    } else {
      whitespace = -1;
    }
    typeFlags |= code & NON_ASCII | flags;
    index++;
  }
  const valueEnd = whitespace === -1 ? index : whitespace;
  const value = header.slice(valueStart, valueEnd);
  const type = (typeFlags & CASE_FLAGS) === 0 ? value : value.toLowerCase();
  if (index === len || stop !== 0) {
    return { type, index, parameters: new NullObject() };
  }
  return parseParameters(header, type, index, len, stopFlags);
}
function parseParameters(header, type, index, len, stopFlags) {
  const parameters = new NullObject();
  parameter: while (index < len) {
    index++;
    while ((CHAR_MAP[header.charCodeAt(index)] & OWS) !== 0) {
      index++;
    }
    const keyStart = index;
    let keyFlags = 0;
    let keyWhitespace = -1;
    while (index < len) {
      const code = header.charCodeAt(index);
      const flags = CHAR_MAP[code];
      if ((flags & stopFlags) !== 0) {
        if ((flags & COMMA_FLAG) !== 0)
          break parameter;
        continue parameter;
      }
      if (code === EQ) {
        const keyEnd = keyWhitespace === -1 ? index : keyWhitespace;
        const value = header.slice(keyStart, keyEnd);
        const key = (keyFlags & CASE_FLAGS) === 0 ? value : value.toLowerCase();
        index++;
        while ((CHAR_MAP[header.charCodeAt(index)] & OWS) !== 0) {
          index++;
        }
        if (index < len && header.charCodeAt(index) === DQUOTE) {
          const quotedStart = ++index;
          let escaped = false;
          while (index < len) {
            const code2 = header.charCodeAt(index);
            if (code2 === DQUOTE) {
              if (parameters[key] === void 0) {
                parameters[key] = escaped ? unescapeQuotedPairs(header, quotedStart, index) : header.slice(quotedStart, index);
              }
              index++;
              let stop2 = 0;
              while (index < len) {
                const code3 = header.charCodeAt(index);
                const flags2 = CHAR_MAP[code3];
                if ((flags2 & stopFlags) !== 0) {
                  stop2 = flags2 & COMMA_FLAG;
                  break;
                }
                index++;
              }
              if (stop2 !== 0)
                break parameter;
              continue parameter;
            }
            if (code2 === BSLASH && index + 1 < len) {
              escaped = true;
              index += 2;
              continue;
            }
            index++;
          }
          continue parameter;
        }
        const valueStart = index;
        let stop = 0;
        let valueWhitespace = -1;
        while (index < len) {
          const code2 = header.charCodeAt(index);
          const flags2 = CHAR_MAP[code2];
          if ((flags2 & stopFlags) !== 0) {
            stop = flags2 & COMMA_FLAG;
            break;
          }
          if ((flags2 & OWS) !== 0) {
            if (valueWhitespace === -1)
              valueWhitespace = index;
          } else {
            valueWhitespace = -1;
          }
          index++;
        }
        if (parameters[key] === void 0) {
          const valueEnd = valueWhitespace === -1 ? index : valueWhitespace;
          parameters[key] = header.slice(valueStart, valueEnd);
        }
        if (stop !== 0)
          break parameter;
        continue parameter;
      }
      if ((flags & OWS) !== 0) {
        if (keyWhitespace === -1)
          keyWhitespace = index;
      } else {
        keyWhitespace = -1;
      }
      keyFlags |= code & NON_ASCII | flags;
      index++;
    }
  }
  return { type, index, parameters };
}
function unescapeQuotedPairs(str, start, end) {
  let result = "";
  for (let index = start; index < end; index++) {
    if (str.charCodeAt(index) === BSLASH) {
      result += str.slice(start, index);
      start = ++index;
    }
  }
  return result + str.slice(start, end);
}

// soda-player/node_modules/music-metadata/lib/ParserFactory.js
var import_debug29 = __toESM(require_src(), 1);

// soda-player/node_modules/file-type/source/index.js
init_lib3();
init_core();

// soda-player/node_modules/@tokenizer/inflate/lib/ZipHandler.js
init_lib3();
var import_debug3 = __toESM(require_src(), 1);

// soda-player/node_modules/@tokenizer/inflate/lib/ZipToken.js
init_lib3();
var Signature = {
  LocalFileHeader: 67324752,
  DataDescriptor: 134695760,
  CentralFileHeader: 33639248,
  EndOfCentralDirectory: 101010256
};
var DataDescriptor = {
  get(array) {
    return {
      signature: UINT32_LE.get(array, 0),
      compressedSize: UINT32_LE.get(array, 8),
      uncompressedSize: UINT32_LE.get(array, 12)
    };
  },
  len: 16
};
var LocalFileHeaderToken = {
  get(array) {
    const flags = UINT16_LE.get(array, 6);
    return {
      signature: UINT32_LE.get(array, 0),
      minVersion: UINT16_LE.get(array, 4),
      dataDescriptor: !!(flags & 8),
      compressedMethod: UINT16_LE.get(array, 8),
      compressedSize: UINT32_LE.get(array, 18),
      uncompressedSize: UINT32_LE.get(array, 22),
      filenameLength: UINT16_LE.get(array, 26),
      extraFieldLength: UINT16_LE.get(array, 28),
      filename: null
    };
  },
  len: 30
};
var EndOfCentralDirectoryRecordToken = {
  get(array) {
    return {
      signature: UINT32_LE.get(array, 0),
      nrOfThisDisk: UINT16_LE.get(array, 4),
      nrOfThisDiskWithTheStart: UINT16_LE.get(array, 6),
      nrOfEntriesOnThisDisk: UINT16_LE.get(array, 8),
      nrOfEntriesOfSize: UINT16_LE.get(array, 10),
      sizeOfCd: UINT32_LE.get(array, 12),
      offsetOfStartOfCd: UINT32_LE.get(array, 16),
      zipFileCommentLength: UINT16_LE.get(array, 20)
    };
  },
  len: 22
};
var FileHeader = {
  get(array) {
    const flags = UINT16_LE.get(array, 8);
    return {
      signature: UINT32_LE.get(array, 0),
      minVersion: UINT16_LE.get(array, 6),
      dataDescriptor: !!(flags & 8),
      compressedMethod: UINT16_LE.get(array, 10),
      compressedSize: UINT32_LE.get(array, 20),
      uncompressedSize: UINT32_LE.get(array, 24),
      filenameLength: UINT16_LE.get(array, 28),
      extraFieldLength: UINT16_LE.get(array, 30),
      fileCommentLength: UINT16_LE.get(array, 32),
      relativeOffsetOfLocalHeader: UINT32_LE.get(array, 42),
      filename: null
    };
  },
  len: 46
};

// soda-player/node_modules/@tokenizer/inflate/lib/ZipHandler.js
function signatureToArray(signature) {
  const signatureBytes = new Uint8Array(UINT32_LE.len);
  UINT32_LE.put(signatureBytes, 0, signature);
  return signatureBytes;
}
var debug3 = (0, import_debug3.default)("tokenizer:inflate");
var syncBufferSize = 256 * 1024;
var ddSignatureArray = signatureToArray(Signature.DataDescriptor);
var eocdSignatureBytes = signatureToArray(Signature.EndOfCentralDirectory);
var ZipHandler = class _ZipHandler {
  constructor(tokenizer) {
    this.tokenizer = tokenizer;
    this.syncBuffer = new Uint8Array(syncBufferSize);
  }
  async isZip() {
    return await this.peekSignature() === Signature.LocalFileHeader;
  }
  peekSignature() {
    return this.tokenizer.peekToken(UINT32_LE);
  }
  async findEndOfCentralDirectoryLocator() {
    const randomReadTokenizer = this.tokenizer;
    const chunkLength = Math.min(16 * 1024, randomReadTokenizer.fileInfo.size);
    const buffer = this.syncBuffer.subarray(0, chunkLength);
    await this.tokenizer.readBuffer(buffer, { position: randomReadTokenizer.fileInfo.size - chunkLength });
    for (let i = buffer.length - 4; i >= 0; i--) {
      if (buffer[i] === eocdSignatureBytes[0] && buffer[i + 1] === eocdSignatureBytes[1] && buffer[i + 2] === eocdSignatureBytes[2] && buffer[i + 3] === eocdSignatureBytes[3]) {
        return randomReadTokenizer.fileInfo.size - chunkLength + i;
      }
    }
    return -1;
  }
  async readCentralDirectory() {
    if (!this.tokenizer.supportsRandomAccess()) {
      debug3("Cannot reading central-directory without random-read support");
      return;
    }
    debug3("Reading central-directory...");
    const pos = this.tokenizer.position;
    const offset = await this.findEndOfCentralDirectoryLocator();
    if (offset > 0) {
      debug3("Central-directory 32-bit signature found");
      const eocdHeader = await this.tokenizer.readToken(EndOfCentralDirectoryRecordToken, offset);
      const files = [];
      this.tokenizer.setPosition(eocdHeader.offsetOfStartOfCd);
      for (let n = 0; n < eocdHeader.nrOfEntriesOfSize; ++n) {
        const entry = await this.tokenizer.readToken(FileHeader);
        if (entry.signature !== Signature.CentralFileHeader) {
          throw new Error("Expected Central-File-Header signature");
        }
        entry.filename = await this.tokenizer.readToken(new StringType(entry.filenameLength, "utf-8"));
        await this.tokenizer.ignore(entry.extraFieldLength);
        await this.tokenizer.ignore(entry.fileCommentLength);
        files.push(entry);
        debug3(`Add central-directory file-entry: n=${n + 1}/${files.length}: filename=${files[n].filename}`);
      }
      this.tokenizer.setPosition(pos);
      return files;
    }
    this.tokenizer.setPosition(pos);
  }
  async unzip(fileCb) {
    const entries2 = await this.readCentralDirectory();
    if (entries2) {
      return this.iterateOverCentralDirectory(entries2, fileCb);
    }
    let stop = false;
    do {
      const zipHeader = await this.readLocalFileHeader();
      if (!zipHeader)
        break;
      const next = fileCb(zipHeader);
      stop = !!next.stop;
      let fileData;
      await this.tokenizer.ignore(zipHeader.extraFieldLength);
      if (zipHeader.dataDescriptor && zipHeader.compressedSize === 0) {
        const chunks = [];
        let len = syncBufferSize;
        debug3("Compressed-file-size unknown, scanning for next data-descriptor-signature....");
        let nextHeaderIndex = -1;
        while (nextHeaderIndex < 0 && len === syncBufferSize) {
          len = await this.tokenizer.peekBuffer(this.syncBuffer, { mayBeLess: true });
          nextHeaderIndex = indexOf(this.syncBuffer.subarray(0, len), ddSignatureArray);
          const size = nextHeaderIndex >= 0 ? nextHeaderIndex : len;
          if (next.handler) {
            const data = new Uint8Array(size);
            await this.tokenizer.readBuffer(data);
            chunks.push(data);
          } else {
            await this.tokenizer.ignore(size);
          }
        }
        debug3(`Found data-descriptor-signature at pos=${this.tokenizer.position}`);
        if (next.handler) {
          await this.inflate(zipHeader, mergeArrays(chunks), next.handler);
        }
      } else {
        if (next.handler) {
          debug3(`Reading compressed-file-data: ${zipHeader.compressedSize} bytes`);
          fileData = new Uint8Array(zipHeader.compressedSize);
          await this.tokenizer.readBuffer(fileData);
          await this.inflate(zipHeader, fileData, next.handler);
        } else {
          debug3(`Ignoring compressed-file-data: ${zipHeader.compressedSize} bytes`);
          await this.tokenizer.ignore(zipHeader.compressedSize);
        }
      }
      debug3(`Reading data-descriptor at pos=${this.tokenizer.position}`);
      if (zipHeader.dataDescriptor) {
        const dataDescriptor = await this.tokenizer.readToken(DataDescriptor);
        if (dataDescriptor.signature !== 134695760) {
          throw new Error(`Expected data-descriptor-signature at position ${this.tokenizer.position - DataDescriptor.len}`);
        }
      }
    } while (!stop);
  }
  async iterateOverCentralDirectory(entries2, fileCb) {
    for (const fileHeader of entries2) {
      const next = fileCb(fileHeader);
      if (next.handler) {
        this.tokenizer.setPosition(fileHeader.relativeOffsetOfLocalHeader);
        const zipHeader = await this.readLocalFileHeader();
        if (zipHeader) {
          await this.tokenizer.ignore(zipHeader.extraFieldLength);
          const fileData = new Uint8Array(fileHeader.compressedSize);
          await this.tokenizer.readBuffer(fileData);
          await this.inflate(zipHeader, fileData, next.handler);
        }
      }
      if (next.stop)
        break;
    }
  }
  async inflate(zipHeader, fileData, cb) {
    if (zipHeader.compressedMethod === 0) {
      return cb(fileData);
    }
    if (zipHeader.compressedMethod !== 8) {
      throw new Error(`Unsupported ZIP compression method: ${zipHeader.compressedMethod}`);
    }
    debug3(`Decompress filename=${zipHeader.filename}, compressed-size=${fileData.length}`);
    const uncompressedData = await _ZipHandler.decompressDeflateRaw(fileData);
    return cb(uncompressedData);
  }
  static async decompressDeflateRaw(data) {
    const input = new ReadableStream({
      start(controller) {
        controller.enqueue(data);
        controller.close();
      }
    });
    const ds = new DecompressionStream("deflate-raw");
    const output = input.pipeThrough(ds);
    try {
      const response = new Response(output);
      const buffer = await response.arrayBuffer();
      return new Uint8Array(buffer);
    } catch (err) {
      const message = err instanceof Error ? `Failed to deflate ZIP entry: ${err.message}` : "Unknown decompression error in ZIP entry";
      throw new TypeError(message);
    }
  }
  async readLocalFileHeader() {
    const signature = await this.tokenizer.peekToken(UINT32_LE);
    if (signature === Signature.LocalFileHeader) {
      const header = await this.tokenizer.readToken(LocalFileHeaderToken);
      header.filename = await this.tokenizer.readToken(new StringType(header.filenameLength, "utf-8"));
      return header;
    }
    if (signature === Signature.CentralFileHeader) {
      return false;
    }
    if (signature === 3759263696) {
      throw new Error("Encrypted ZIP");
    }
    throw new Error("Unexpected signature");
  }
};
function indexOf(buffer, portion) {
  const bufferLength = buffer.length;
  const portionLength = portion.length;
  if (portionLength > bufferLength)
    return -1;
  for (let i = 0; i <= bufferLength - portionLength; i++) {
    let found = true;
    for (let j = 0; j < portionLength; j++) {
      if (buffer[i + j] !== portion[j]) {
        found = false;
        break;
      }
    }
    if (found) {
      return i;
    }
  }
  return -1;
}
function mergeArrays(chunks) {
  const totalLength = chunks.reduce((acc, curr) => acc + curr.length, 0);
  const mergedArray = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    mergedArray.set(chunk, offset);
    offset += chunk.length;
  }
  return mergedArray;
}

// soda-player/node_modules/@tokenizer/inflate/lib/GzipHandler.js
var GzipHandler = class {
  constructor(tokenizer) {
    this.tokenizer = tokenizer;
  }
  inflate() {
    const tokenizer = this.tokenizer;
    return new ReadableStream({
      async pull(controller) {
        const buffer = new Uint8Array(1024);
        const size = await tokenizer.readBuffer(buffer, { mayBeLess: true });
        if (size === 0) {
          controller.close();
          return;
        }
        controller.enqueue(buffer.subarray(0, size));
      }
    }).pipeThrough(new DecompressionStream("gzip"));
  }
};

// soda-player/node_modules/file-type/source/index.js
init_uint8array_extras();

// soda-player/node_modules/file-type/source/tokens.js
init_lib3();
function stringToBytes(string, encoding) {
  if (encoding === "utf-16le") {
    const bytes = [];
    for (let index = 0; index < string.length; index++) {
      const code = string.charCodeAt(index);
      bytes.push(code & 255, code >> 8 & 255);
    }
    return bytes;
  }
  if (encoding === "utf-16be") {
    const bytes = [];
    for (let index = 0; index < string.length; index++) {
      const code = string.charCodeAt(index);
      bytes.push(code >> 8 & 255, code & 255);
    }
    return bytes;
  }
  return [...string].map((character) => character.charCodeAt(0));
}
function tarHeaderChecksumMatches(arrayBuffer, offset = 0) {
  const readSum = Number.parseInt(new StringType(6).get(arrayBuffer, 148).replace(/\0.*$/v, "").trim(), 8);
  if (Number.isNaN(readSum)) {
    return false;
  }
  let sum = 8 * 32;
  for (let index = offset; index < offset + 148; index++) {
    sum += arrayBuffer[index];
  }
  for (let index = offset + 156; index < offset + 512; index++) {
    sum += arrayBuffer[index];
  }
  return readSum === sum;
}
var uint32SyncSafeToken = {
  get: (buffer, offset) => buffer[offset + 3] & 127 | (buffer[offset + 2] & 127) << 7 | (buffer[offset + 1] & 127) << 14 | (buffer[offset] & 127) << 21,
  len: 4
};

// soda-player/node_modules/file-type/source/supported.js
var extensions = [
  "jpg",
  "png",
  "apng",
  "gif",
  "webp",
  "flif",
  "xcf",
  "cr2",
  "cr3",
  "orf",
  "arw",
  "dng",
  "nef",
  "rw2",
  "raf",
  "tif",
  "bmp",
  "icns",
  "jxr",
  "psd",
  "indd",
  "zip",
  "tar",
  "rar",
  "gz",
  "bz2",
  "7z",
  "dmg",
  "mp4",
  "mid",
  "mkv",
  "webm",
  "mov",
  "avi",
  "mpg",
  "mp2",
  "mp3",
  "m4a",
  "oga",
  "ogg",
  "ogv",
  "opus",
  "flac",
  "wav",
  "spx",
  "amr",
  "pdf",
  "epub",
  "elf",
  "macho",
  "exe",
  "swf",
  "rtf",
  "wasm",
  "woff",
  "woff2",
  "eot",
  "ttf",
  "otf",
  "ttc",
  "ico",
  "flv",
  "ps",
  "xz",
  "sqlite",
  "nes",
  "crx",
  "xpi",
  "cab",
  "deb",
  "ar",
  "rpm",
  "Z",
  "lz",
  "cfb",
  "mxf",
  "mts",
  "blend",
  "bpg",
  "docx",
  "pptx",
  "xlsx",
  "3gp",
  "3g2",
  "j2c",
  "jp2",
  "jpm",
  "jpx",
  "mj2",
  "aif",
  "qcp",
  "odt",
  "ods",
  "odp",
  "xml",
  "mobi",
  "heic",
  "cur",
  "ktx",
  "ape",
  "wv",
  "dcm",
  "ics",
  "glb",
  "pcap",
  "dsf",
  "lnk",
  "alias",
  "voc",
  "ac3",
  "m4v",
  "m4p",
  "m4b",
  "f4v",
  "f4p",
  "f4b",
  "f4a",
  "mie",
  "asf",
  "ogm",
  "ogx",
  "mpc",
  "arrow",
  "shp",
  "aac",
  "mp1",
  "it",
  "s3m",
  "xm",
  "skp",
  "avif",
  "eps",
  "lzh",
  "pgp",
  "asar",
  "stl",
  "chm",
  "3mf",
  "zst",
  "jxl",
  "vcf",
  "jls",
  "pst",
  "dwg",
  "parquet",
  "class",
  "arj",
  "cpio",
  "ace",
  "avro",
  "icc",
  "fbx",
  "vsdx",
  "vtt",
  "apk",
  "drc",
  "lz4",
  "potx",
  "xltx",
  "dotx",
  "xltm",
  "ott",
  "ots",
  "otp",
  "odg",
  "otg",
  "xlsm",
  "docm",
  "dotm",
  "potm",
  "pptm",
  "jar",
  "jmp",
  "rm",
  "sav",
  "ppsm",
  "ppsx",
  "tar.gz",
  "reg",
  "dat",
  "key",
  "numbers",
  "pages",
  "iso"
];
var mimeTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/flif",
  "image/x-xcf",
  "image/x-canon-cr2",
  "image/x-canon-cr3",
  "image/tiff",
  "image/bmp",
  "image/vnd.ms-photo",
  "image/vnd.adobe.photoshop",
  "application/x-indesign",
  "application/epub+zip",
  "application/x-xpinstall",
  "application/vnd.ms-powerpoint.slideshow.macroenabled.12",
  "application/vnd.oasis.opendocument.text",
  "application/vnd.oasis.opendocument.spreadsheet",
  "application/vnd.oasis.opendocument.presentation",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
  "application/zip",
  "application/x-tar",
  "application/x-rar-compressed",
  "application/gzip",
  "application/x-bzip2",
  "application/x-7z-compressed",
  "application/x-apple-diskimage",
  "application/vnd.apache.arrow.file",
  "video/mp4",
  "audio/midi",
  "video/matroska",
  "video/webm",
  "video/quicktime",
  "video/vnd.avi",
  "audio/wav",
  "audio/qcelp",
  "audio/x-ms-asf",
  "video/x-ms-asf",
  "application/vnd.ms-asf",
  "video/mpeg",
  "video/3gpp",
  "audio/mpeg",
  "audio/mp4",
  // RFC 4337
  "video/ogg",
  "audio/ogg",
  "audio/ogg; codecs=opus",
  "application/ogg",
  "audio/flac",
  "audio/ape",
  "audio/wavpack",
  "audio/amr",
  "application/pdf",
  "application/x-elf",
  "application/x-mach-binary",
  "application/x-msdownload",
  "application/x-shockwave-flash",
  "application/rtf",
  "application/wasm",
  "font/woff",
  "font/woff2",
  "application/vnd.ms-fontobject",
  "font/ttf",
  "font/otf",
  "font/collection",
  "image/x-icon",
  "video/x-flv",
  "application/postscript",
  "application/eps",
  "application/x-xz",
  "application/x-sqlite3",
  "application/x-nintendo-nes-rom",
  "application/x-google-chrome-extension",
  "application/vnd.ms-cab-compressed",
  "application/x-deb",
  "application/x-unix-archive",
  "application/x-rpm",
  "application/x-compress",
  "application/lzip",
  "application/x-cfb",
  "application/x-mie",
  "application/mxf",
  "video/mp2t",
  "application/x-blender",
  "image/bpg",
  "image/j2c",
  "image/jp2",
  "image/jpx",
  "image/jpm",
  "image/mj2",
  "audio/aiff",
  "application/xml",
  "application/x-mobipocket-ebook",
  "image/heif",
  "image/heif-sequence",
  "image/heic",
  "image/heic-sequence",
  "image/icns",
  "image/ktx",
  "application/dicom",
  "audio/x-musepack",
  "text/calendar",
  "text/vcard",
  "text/vtt",
  "model/gltf-binary",
  "application/vnd.tcpdump.pcap",
  "audio/x-dsf",
  // Non-standard
  "application/x-ms-shortcut",
  // Informal, used by freedesktop.org shared-mime-info
  "application/x-ft-apple.alias",
  "audio/x-voc",
  "audio/vnd.dolby.dd-raw",
  "audio/x-m4a",
  "image/apng",
  "image/x-olympus-orf",
  "image/x-sony-arw",
  "image/x-adobe-dng",
  "image/x-nikon-nef",
  "image/x-panasonic-rw2",
  "image/x-fujifilm-raf",
  "video/x-m4v",
  "video/3gpp2",
  "application/x-esri-shape",
  "audio/aac",
  "audio/x-it",
  "audio/x-s3m",
  "audio/x-xm",
  "video/MP1S",
  "video/MP2P",
  "application/vnd.sketchup.skp",
  "image/avif",
  "application/x-lzh-compressed",
  "application/pgp-encrypted",
  "application/x-asar",
  "model/stl",
  "application/vnd.ms-htmlhelp",
  "model/3mf",
  "image/jxl",
  "application/zstd",
  "image/jls",
  "application/vnd.ms-outlook",
  "image/vnd.dwg",
  "application/vnd.apache.parquet",
  "application/java-vm",
  "application/x-arj",
  "application/x-cpio",
  "application/x-ace-compressed",
  "application/avro",
  "application/vnd.iccprofile",
  "application/x-ft-fbx",
  "application/vnd.visio",
  "application/vnd.android.package-archive",
  "application/x-ft-draco",
  "application/x-lz4",
  // Informal, used by freedesktop.org shared-mime-info
  "application/vnd.openxmlformats-officedocument.presentationml.template",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
  "application/vnd.ms-excel.template.macroenabled.12",
  "application/vnd.oasis.opendocument.text-template",
  "application/vnd.oasis.opendocument.spreadsheet-template",
  "application/vnd.oasis.opendocument.presentation-template",
  "application/vnd.oasis.opendocument.graphics",
  "application/vnd.oasis.opendocument.graphics-template",
  "application/vnd.ms-excel.sheet.macroenabled.12",
  "application/vnd.ms-word.document.macroenabled.12",
  "application/vnd.ms-word.template.macroenabled.12",
  "application/vnd.ms-powerpoint.template.macroenabled.12",
  "application/vnd.ms-powerpoint.presentation.macroenabled.12",
  "application/java-archive",
  "application/vnd.rn-realmedia",
  "application/x-spss-sav",
  "application/x-ms-regedit",
  "application/x-ft-windows-registry-hive",
  "application/x-jmp-data",
  "application/vnd.apple.keynote",
  "application/vnd.apple.numbers",
  "application/vnd.apple.pages",
  "application/x-iso9660-image"
];

// soda-player/node_modules/file-type/source/parser.js
var maximumUntrustedSkipSizeInBytes = 16 * 1024 * 1024;
var ParserHardLimitError = class extends Error {
};
function getSafeBound(value, maximum, reason) {
  if (!Number.isFinite(value) || value < 0 || value > maximum) {
    throw new ParserHardLimitError(`${reason} has invalid size ${value} (maximum ${maximum} bytes)`);
  }
  return value;
}
async function safeIgnore(tokenizer, length, { maximumLength = maximumUntrustedSkipSizeInBytes, reason = "skip" } = {}) {
  const safeLength = getSafeBound(length, maximumLength, reason);
  await tokenizer.ignore(safeLength);
}
async function safeReadBuffer(tokenizer, buffer, options, { maximumLength = buffer.length, reason = "read" } = {}) {
  const length = options?.length ?? buffer.length;
  const safeLength = getSafeBound(length, maximumLength, reason);
  return tokenizer.readBuffer(buffer, {
    ...options,
    length: safeLength
  });
}
function checkBytes(buffer, headers, options) {
  options = {
    offset: 0,
    ...options
  };
  for (const [index, header] of headers.entries()) {
    if (options.mask) {
      if (header !== (options.mask[index] & buffer[index + options.offset])) {
        return false;
      }
    } else if (header !== buffer[index + options.offset]) {
      return false;
    }
  }
  return true;
}
function hasUnknownFileSize(tokenizer) {
  const fileSize = tokenizer.fileInfo.size;
  return !Number.isFinite(fileSize) || fileSize === Number.MAX_SAFE_INTEGER;
}
function hasExceededUnknownSizeScanBudget(tokenizer, startOffset, maximumBytes) {
  return hasUnknownFileSize(tokenizer) && tokenizer.position - startOffset > maximumBytes;
}

// soda-player/node_modules/file-type/source/detectors/zip.js
init_lib3();
init_core();
var maximumZipEntrySizeInBytes = 1024 * 1024;
var maximumZipEntryCount = 1024;
var maximumZipBufferedReadSizeInBytes = 2 ** 31 - 1;
var maximumZipTextEntrySizeInBytes = maximumZipEntrySizeInBytes;
var recoverableZipErrorMessages = /* @__PURE__ */ new Set([
  "Unexpected signature",
  "Encrypted ZIP",
  "Expected Central-File-Header signature"
]);
var recoverableZipErrorMessagePrefixes = [
  "ZIP entry count exceeds ",
  "Unsupported ZIP compression method:",
  "ZIP entry compressed data exceeds ",
  "ZIP entry decompressed data exceeds ",
  "Expected data-descriptor-signature at position "
];
var recoverableZipErrorCodes = /* @__PURE__ */ new Set([
  "Z_BUF_ERROR",
  "Z_DATA_ERROR",
  "ERR_INVALID_STATE"
]);
async function decompressDeflateRawWithLimit(data, { maximumLength = maximumZipEntrySizeInBytes } = {}) {
  const input = new ReadableStream({
    start(controller) {
      controller.enqueue(data);
      controller.close();
    }
  });
  const output = input.pipeThrough(new DecompressionStream("deflate-raw"));
  const reader = output.getReader();
  const chunks = [];
  let totalLength = 0;
  try {
    for (; ; ) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      totalLength += value.length;
      if (totalLength > maximumLength) {
        await reader.cancel().catch(() => {
        });
        throw new Error(`ZIP entry decompressed data exceeds ${maximumLength} bytes`);
      }
      chunks.push(value);
    }
  } catch (error) {
    if (error.code !== "ERR_TRAILING_JUNK_AFTER_STREAM_END") {
      throw error;
    }
  } finally {
    reader.releaseLock();
  }
  const uncompressedData = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    uncompressedData.set(chunk, offset);
    offset += chunk.length;
  }
  return uncompressedData;
}
function mergeByteChunks(chunks, totalLength) {
  const merged = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.length;
  }
  return merged;
}
function getMaximumZipBufferedReadLength(tokenizer) {
  const fileSize = tokenizer.fileInfo.size;
  const remainingBytes = Number.isFinite(fileSize) ? Math.max(0, fileSize - tokenizer.position) : Number.MAX_SAFE_INTEGER;
  return Math.min(remainingBytes, maximumZipBufferedReadSizeInBytes);
}
function isRecoverableZipError(error) {
  if (error instanceof EndOfStreamError) {
    return true;
  }
  if (error instanceof ParserHardLimitError) {
    return true;
  }
  if (!(error instanceof Error)) {
    return false;
  }
  if (recoverableZipErrorMessages.has(error.message)) {
    return true;
  }
  if (recoverableZipErrorCodes.has(error.code)) {
    return true;
  }
  for (const prefix of recoverableZipErrorMessagePrefixes) {
    if (error.message.startsWith(prefix)) {
      return true;
    }
  }
  return false;
}
function canReadZipEntryForDetection(zipHeader, maximumSize = maximumZipEntrySizeInBytes) {
  const sizes = [zipHeader.compressedSize, zipHeader.uncompressedSize];
  for (const size of sizes) {
    if (!Number.isFinite(size) || size < 0 || size > maximumSize) {
      return false;
    }
  }
  return true;
}
function createIWorkZipDetectionState() {
  return {
    hasDocumentEntry: false,
    hasMasterSlideEntry: false,
    hasTablesEntry: false,
    hasCalculationEngineEntry: false
  };
}
function updateIWorkZipDetectionStateFromFilename(iWorkState, filename) {
  if (filename === "Index/Document.iwa") {
    iWorkState.hasDocumentEntry = true;
  }
  if (filename.startsWith("Index/MasterSlide")) {
    iWorkState.hasMasterSlideEntry = true;
  }
  if (filename.startsWith("Index/Tables/")) {
    iWorkState.hasTablesEntry = true;
  }
  if (filename === "Index/CalculationEngine.iwa") {
    iWorkState.hasCalculationEngineEntry = true;
  }
}
function getIWorkFileTypeFromZipEntries(iWorkState) {
  if (!iWorkState.hasDocumentEntry) {
    return;
  }
  if (iWorkState.hasMasterSlideEntry) {
    return { ext: "key", mime: "application/vnd.apple.keynote" };
  }
  if (iWorkState.hasTablesEntry) {
    return { ext: "numbers", mime: "application/vnd.apple.numbers" };
  }
  return { ext: "pages", mime: "application/vnd.apple.pages" };
}
function getFileTypeFromMimeType(mimeType) {
  mimeType = mimeType.toLowerCase();
  switch (mimeType) {
    case "application/epub+zip":
      return { ext: "epub", mime: mimeType };
    case "application/vnd.oasis.opendocument.text":
      return { ext: "odt", mime: mimeType };
    case "application/vnd.oasis.opendocument.text-template":
      return { ext: "ott", mime: mimeType };
    case "application/vnd.oasis.opendocument.spreadsheet":
      return { ext: "ods", mime: mimeType };
    case "application/vnd.oasis.opendocument.spreadsheet-template":
      return { ext: "ots", mime: mimeType };
    case "application/vnd.oasis.opendocument.presentation":
      return { ext: "odp", mime: mimeType };
    case "application/vnd.oasis.opendocument.presentation-template":
      return { ext: "otp", mime: mimeType };
    case "application/vnd.oasis.opendocument.graphics":
      return { ext: "odg", mime: mimeType };
    case "application/vnd.oasis.opendocument.graphics-template":
      return { ext: "otg", mime: mimeType };
    case "application/vnd.openxmlformats-officedocument.presentationml.slideshow":
      return { ext: "ppsx", mime: mimeType };
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return { ext: "xlsx", mime: mimeType };
    case "application/vnd.ms-excel.sheet.macroenabled":
      return { ext: "xlsm", mime: "application/vnd.ms-excel.sheet.macroenabled.12" };
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.template":
      return { ext: "xltx", mime: mimeType };
    case "application/vnd.ms-excel.template.macroenabled":
      return { ext: "xltm", mime: "application/vnd.ms-excel.template.macroenabled.12" };
    case "application/vnd.ms-powerpoint.slideshow.macroenabled":
      return { ext: "ppsm", mime: "application/vnd.ms-powerpoint.slideshow.macroenabled.12" };
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return { ext: "docx", mime: mimeType };
    case "application/vnd.ms-word.document.macroenabled":
      return { ext: "docm", mime: "application/vnd.ms-word.document.macroenabled.12" };
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.template":
      return { ext: "dotx", mime: mimeType };
    case "application/vnd.ms-word.template.macroenabledtemplate":
      return { ext: "dotm", mime: "application/vnd.ms-word.template.macroenabled.12" };
    case "application/vnd.openxmlformats-officedocument.presentationml.template":
      return { ext: "potx", mime: mimeType };
    case "application/vnd.ms-powerpoint.template.macroenabled":
      return { ext: "potm", mime: "application/vnd.ms-powerpoint.template.macroenabled.12" };
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return { ext: "pptx", mime: mimeType };
    case "application/vnd.ms-powerpoint.presentation.macroenabled":
      return { ext: "pptm", mime: "application/vnd.ms-powerpoint.presentation.macroenabled.12" };
    case "application/vnd.ms-visio.drawing":
      return { ext: "vsdx", mime: "application/vnd.visio" };
    case "application/vnd.ms-package.3dmanufacturing-3dmodel+xml":
      return { ext: "3mf", mime: "model/3mf" };
    default:
  }
}
function createOpenXmlZipDetectionState() {
  return {
    hasContentTypesEntry: false,
    hasParsedContentTypesEntry: false,
    isParsingContentTypes: false,
    hasUnparseableContentTypes: false,
    hasWordDirectory: false,
    hasPresentationDirectory: false,
    hasSpreadsheetDirectory: false,
    hasThreeDimensionalModelEntry: false
  };
}
function updateOpenXmlZipDetectionStateFromFilename(openXmlState, filename) {
  if (filename.startsWith("word/")) {
    openXmlState.hasWordDirectory = true;
  }
  if (filename.startsWith("ppt/")) {
    openXmlState.hasPresentationDirectory = true;
  }
  if (filename.startsWith("xl/")) {
    openXmlState.hasSpreadsheetDirectory = true;
  }
  if (filename.startsWith("3D/") && filename.endsWith(".model")) {
    openXmlState.hasThreeDimensionalModelEntry = true;
  }
}
function getOpenXmlFileTypeFromDirectoryNames(openXmlState) {
  if (openXmlState.hasWordDirectory) {
    return {
      ext: "docx",
      mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    };
  }
  if (openXmlState.hasPresentationDirectory) {
    return {
      ext: "pptx",
      mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    };
  }
  if (openXmlState.hasSpreadsheetDirectory) {
    return {
      ext: "xlsx",
      mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    };
  }
  if (openXmlState.hasThreeDimensionalModelEntry) {
    return {
      ext: "3mf",
      mime: "model/3mf"
    };
  }
}
function getOpenXmlFileTypeFromZipEntries(openXmlState) {
  if (!openXmlState.hasContentTypesEntry || openXmlState.hasUnparseableContentTypes || openXmlState.isParsingContentTypes || openXmlState.hasParsedContentTypesEntry) {
    return;
  }
  return getOpenXmlFileTypeFromDirectoryNames(openXmlState);
}
function getOpenXmlMimeTypeFromContentTypesXml(xmlContent) {
  const endPosition = xmlContent.indexOf('.main+xml"');
  if (endPosition === -1) {
    const mimeType = "application/vnd.ms-package.3dmanufacturing-3dmodel+xml";
    if (xmlContent.includes(`ContentType="${mimeType}"`)) {
      return mimeType;
    }
    return;
  }
  const truncatedContent = xmlContent.slice(0, endPosition);
  const firstQuotePosition = truncatedContent.lastIndexOf('"');
  return truncatedContent.slice(firstQuotePosition + 1);
}
var zipDataDescriptorSignature = 134695760;
var zipDataDescriptorLengthInBytes = 16;
var zipDataDescriptorOverlapLengthInBytes = zipDataDescriptorLengthInBytes - 1;
function findZipDataDescriptorOffset(buffer, bytesConsumed) {
  if (buffer.length < zipDataDescriptorLengthInBytes) {
    return -1;
  }
  const lastPossibleDescriptorOffset = buffer.length - zipDataDescriptorLengthInBytes;
  for (let index = 0; index <= lastPossibleDescriptorOffset; index++) {
    if (UINT32_LE.get(buffer, index) === zipDataDescriptorSignature && UINT32_LE.get(buffer, index + 8) === bytesConsumed + index) {
      return index;
    }
  }
  return -1;
}
async function readZipDataDescriptorEntryWithLimit(zipHandler, { shouldBuffer, maximumLength = maximumZipEntrySizeInBytes } = {}) {
  const { syncBuffer } = zipHandler;
  const { length: syncBufferLength } = syncBuffer;
  const chunks = [];
  let bytesConsumed = 0;
  for (; ; ) {
    const length = await zipHandler.tokenizer.peekBuffer(syncBuffer, { mayBeLess: true });
    const dataDescriptorOffset = findZipDataDescriptorOffset(syncBuffer.subarray(0, length), bytesConsumed);
    const retainedLength = dataDescriptorOffset >= 0 ? 0 : length === syncBufferLength ? Math.min(zipDataDescriptorOverlapLengthInBytes, length - 1) : 0;
    const chunkLength = dataDescriptorOffset >= 0 ? dataDescriptorOffset : length - retainedLength;
    if (chunkLength === 0) {
      break;
    }
    bytesConsumed += chunkLength;
    if (bytesConsumed > maximumLength) {
      throw new ParserHardLimitError(`ZIP entry data descriptor not found within ${maximumLength} bytes`);
    }
    if (shouldBuffer) {
      const data = new Uint8Array(chunkLength);
      await zipHandler.tokenizer.readBuffer(data);
      chunks.push(data);
    } else {
      await zipHandler.tokenizer.ignore(chunkLength);
    }
    if (dataDescriptorOffset >= 0) {
      break;
    }
  }
  if (!hasUnknownFileSize(zipHandler.tokenizer)) {
    zipHandler.knownSizeDescriptorScannedBytes += bytesConsumed;
  }
  if (!shouldBuffer) {
    return;
  }
  return mergeByteChunks(chunks, bytesConsumed);
}
function getRemainingZipScanBudget(zipHandler, startOffset) {
  if (hasUnknownFileSize(zipHandler.tokenizer)) {
    return Math.max(0, maximumUntrustedSkipSizeInBytes - (zipHandler.tokenizer.position - startOffset));
  }
  return Math.max(0, maximumZipEntrySizeInBytes - zipHandler.knownSizeDescriptorScannedBytes);
}
async function readZipEntryData(zipHandler, zipHeader, { shouldBuffer, maximumDescriptorLength = maximumZipEntrySizeInBytes } = {}) {
  if (zipHeader.dataDescriptor && zipHeader.compressedSize === 0) {
    return readZipDataDescriptorEntryWithLimit(zipHandler, {
      shouldBuffer,
      maximumLength: maximumDescriptorLength
    });
  }
  if (!shouldBuffer) {
    await safeIgnore(zipHandler.tokenizer, zipHeader.compressedSize, {
      maximumLength: hasUnknownFileSize(zipHandler.tokenizer) ? maximumZipEntrySizeInBytes : zipHandler.tokenizer.fileInfo.size,
      reason: "ZIP entry compressed data"
    });
    return;
  }
  const maximumLength = getMaximumZipBufferedReadLength(zipHandler.tokenizer);
  if (!Number.isFinite(zipHeader.compressedSize) || zipHeader.compressedSize < 0 || zipHeader.compressedSize > maximumLength) {
    throw new Error(`ZIP entry compressed data exceeds ${maximumLength} bytes`);
  }
  const fileData = new Uint8Array(zipHeader.compressedSize);
  await zipHandler.tokenizer.readBuffer(fileData);
  return fileData;
}
ZipHandler.prototype.inflate = async function(zipHeader, fileData, callback) {
  if (zipHeader.compressedMethod === 0) {
    return callback(fileData);
  }
  if (zipHeader.compressedMethod !== 8) {
    throw new Error(`Unsupported ZIP compression method: ${zipHeader.compressedMethod}`);
  }
  const uncompressedData = await decompressDeflateRawWithLimit(fileData, { maximumLength: maximumZipEntrySizeInBytes });
  return callback(uncompressedData);
};
ZipHandler.prototype.unzip = async function(fileCallback) {
  let stop = false;
  let zipEntryCount = 0;
  const zipScanStart = this.tokenizer.position;
  this.knownSizeDescriptorScannedBytes = 0;
  do {
    if (hasExceededUnknownSizeScanBudget(this.tokenizer, zipScanStart, maximumUntrustedSkipSizeInBytes)) {
      throw new ParserHardLimitError(`ZIP stream probing exceeds ${maximumUntrustedSkipSizeInBytes} bytes`);
    }
    const zipHeader = await this.readLocalFileHeader();
    if (!zipHeader) {
      break;
    }
    zipEntryCount++;
    if (zipEntryCount > maximumZipEntryCount) {
      throw new Error(`ZIP entry count exceeds ${maximumZipEntryCount}`);
    }
    const next = fileCallback(zipHeader);
    stop = Boolean(next.stop);
    await this.tokenizer.ignore(zipHeader.extraFieldLength);
    const fileData = await readZipEntryData(this, zipHeader, {
      shouldBuffer: Boolean(next.handler),
      maximumDescriptorLength: Math.min(maximumZipEntrySizeInBytes, getRemainingZipScanBudget(this, zipScanStart))
    });
    if (next.handler) {
      await this.inflate(zipHeader, fileData, next.handler);
    }
    if (zipHeader.dataDescriptor) {
      const dataDescriptor = new Uint8Array(zipDataDescriptorLengthInBytes);
      await this.tokenizer.readBuffer(dataDescriptor);
      if (UINT32_LE.get(dataDescriptor, 0) !== zipDataDescriptorSignature) {
        throw new Error(`Expected data-descriptor-signature at position ${this.tokenizer.position - dataDescriptor.length}`);
      }
    }
    if (hasExceededUnknownSizeScanBudget(this.tokenizer, zipScanStart, maximumUntrustedSkipSizeInBytes)) {
      throw new ParserHardLimitError(`ZIP stream probing exceeds ${maximumUntrustedSkipSizeInBytes} bytes`);
    }
  } while (!stop);
};
async function detectZip(tokenizer) {
  let fileType;
  const openXmlState = createOpenXmlZipDetectionState();
  const iWorkState = createIWorkZipDetectionState();
  try {
    await new ZipHandler(tokenizer).unzip((zipHeader) => {
      updateOpenXmlZipDetectionStateFromFilename(openXmlState, zipHeader.filename);
      updateIWorkZipDetectionStateFromFilename(iWorkState, zipHeader.filename);
      if (iWorkState.hasDocumentEntry && (iWorkState.hasMasterSlideEntry || iWorkState.hasTablesEntry)) {
        fileType = getIWorkFileTypeFromZipEntries(iWorkState);
        return { stop: true };
      }
      const isOpenXmlContentTypesEntry = zipHeader.filename === "[Content_Types].xml";
      const openXmlFileTypeFromEntries = getOpenXmlFileTypeFromZipEntries(openXmlState);
      if (!isOpenXmlContentTypesEntry && openXmlFileTypeFromEntries) {
        fileType = openXmlFileTypeFromEntries;
        return {
          stop: true
        };
      }
      switch (zipHeader.filename) {
        case "META-INF/mozilla.rsa":
          fileType = {
            ext: "xpi",
            mime: "application/x-xpinstall"
          };
          return {
            stop: true
          };
        case "META-INF/MANIFEST.MF":
          fileType = {
            ext: "jar",
            mime: "application/java-archive"
          };
          return {
            stop: true
          };
        case "mimetype":
          if (!canReadZipEntryForDetection(zipHeader, maximumZipTextEntrySizeInBytes)) {
            return {};
          }
          return {
            async handler(fileData) {
              const mimeType = new TextDecoder("utf-8").decode(fileData).trim();
              fileType = getFileTypeFromMimeType(mimeType);
            },
            stop: true
          };
        case "[Content_Types].xml": {
          openXmlState.hasContentTypesEntry = true;
          if (!canReadZipEntryForDetection(zipHeader, maximumZipTextEntrySizeInBytes)) {
            openXmlState.hasUnparseableContentTypes = true;
            return {};
          }
          openXmlState.isParsingContentTypes = true;
          return {
            async handler(fileData) {
              const xmlContent = new TextDecoder("utf-8").decode(fileData);
              const mimeType = getOpenXmlMimeTypeFromContentTypesXml(xmlContent);
              if (mimeType) {
                fileType = getFileTypeFromMimeType(mimeType);
              }
              openXmlState.hasParsedContentTypesEntry = true;
              openXmlState.isParsingContentTypes = false;
            },
            stop: true
          };
        }
        default:
          if (/classes\d*\.dex/v.test(zipHeader.filename)) {
            fileType = {
              ext: "apk",
              mime: "application/vnd.android.package-archive"
            };
            return { stop: true };
          }
          return {};
      }
    });
  } catch (error) {
    if (!isRecoverableZipError(error)) {
      throw error;
    }
    if (openXmlState.isParsingContentTypes) {
      openXmlState.isParsingContentTypes = false;
      openXmlState.hasUnparseableContentTypes = true;
    }
    if (!fileType && (error instanceof EndOfStreamError || error instanceof ParserHardLimitError) && !openXmlState.hasContentTypesEntry) {
      fileType = getOpenXmlFileTypeFromDirectoryNames(openXmlState);
    }
  }
  const iWorkFileType = hasUnknownFileSize(tokenizer) && iWorkState.hasDocumentEntry && !iWorkState.hasMasterSlideEntry && !iWorkState.hasTablesEntry && !iWorkState.hasCalculationEngineEntry ? void 0 : getIWorkFileTypeFromZipEntries(iWorkState);
  return fileType ?? getOpenXmlFileTypeFromZipEntries(openXmlState) ?? iWorkFileType ?? {
    ext: "zip",
    mime: "application/zip"
  };
}

// soda-player/node_modules/file-type/source/detectors/ebml.js
init_lib3();
init_uint8array_extras();
var maximumEbmlDocumentTypeSizeInBytes = 64;
var maximumEbmlElementPayloadSizeInBytes = 1024 * 1024;
var maximumEbmlElementCount = 256;
async function detectEbml(tokenizer) {
  async function readField() {
    const msb = await tokenizer.peekNumber(UINT8);
    let mask = 128;
    let ic = 0;
    while ((msb & mask) === 0 && mask !== 0) {
      ++ic;
      mask >>= 1;
    }
    const id = new Uint8Array(ic + 1);
    await safeReadBuffer(tokenizer, id, void 0, {
      maximumLength: id.length,
      reason: "EBML field"
    });
    return id;
  }
  async function readElement() {
    const idField = await readField();
    const lengthField = await readField();
    lengthField[0] ^= 128 >> lengthField.length - 1;
    const nrLength = Math.min(6, lengthField.length);
    const idView = new DataView(idField.buffer);
    const lengthView = new DataView(lengthField.buffer, lengthField.length - nrLength, nrLength);
    return {
      id: getUintBE(idView),
      len: getUintBE(lengthView)
    };
  }
  async function readChildren(children) {
    let ebmlElementCount = 0;
    while (children > 0) {
      ebmlElementCount++;
      if (ebmlElementCount > maximumEbmlElementCount) {
        return;
      }
      if (hasExceededUnknownSizeScanBudget(tokenizer, ebmlScanStart, maximumUntrustedSkipSizeInBytes)) {
        return;
      }
      const previousPosition = tokenizer.position;
      const element = await readElement();
      if (element.id === 17026) {
        if (element.len > maximumEbmlDocumentTypeSizeInBytes) {
          return;
        }
        const documentTypeLength = getSafeBound(element.len, maximumEbmlDocumentTypeSizeInBytes, "EBML DocType");
        const rawValue = await tokenizer.readToken(new StringType(documentTypeLength));
        return rawValue.replaceAll(/\0.*$/gv, "");
      }
      if (hasUnknownFileSize(tokenizer) && (!Number.isFinite(element.len) || element.len < 0 || element.len > maximumEbmlElementPayloadSizeInBytes)) {
        return;
      }
      await safeIgnore(tokenizer, element.len, {
        maximumLength: hasUnknownFileSize(tokenizer) ? maximumEbmlElementPayloadSizeInBytes : tokenizer.fileInfo.size,
        reason: "EBML payload"
      });
      --children;
      if (tokenizer.position <= previousPosition) {
        return;
      }
    }
  }
  const rootElement = await readElement();
  const ebmlScanStart = tokenizer.position;
  const documentType = await readChildren(rootElement.len);
  switch (documentType) {
    case "webm":
      return {
        ext: "webm",
        mime: "video/webm"
      };
    case "matroska":
      return {
        ext: "mkv",
        mime: "video/matroska"
      };
    default:
  }
}

// soda-player/node_modules/file-type/source/detectors/png.js
init_lib3();
init_core();
var maximumPngChunkCount = 512;
var maximumPngStreamScanBudgetInBytes = 16 * 1024 * 1024;
var maximumPngChunkSizeInBytes = 1024 * 1024;
function isPngAncillaryChunk(type) {
  return (type.codePointAt(0) & 32) !== 0;
}
async function detectPng(tokenizer) {
  const pngFileType = {
    ext: "png",
    mime: "image/png"
  };
  const apngFileType = {
    ext: "apng",
    mime: "image/apng"
  };
  await tokenizer.ignore(8);
  async function readChunkHeader() {
    return {
      length: await tokenizer.readToken(INT32_BE),
      type: await tokenizer.readToken(new StringType(4, "latin1"))
    };
  }
  const isUnknownPngStream = hasUnknownFileSize(tokenizer);
  const pngScanStart = tokenizer.position;
  let pngChunkCount = 0;
  let hasSeenImageHeader = false;
  do {
    pngChunkCount++;
    if (pngChunkCount > maximumPngChunkCount) {
      break;
    }
    if (hasExceededUnknownSizeScanBudget(tokenizer, pngScanStart, maximumPngStreamScanBudgetInBytes)) {
      break;
    }
    const previousPosition = tokenizer.position;
    const chunk = await readChunkHeader();
    if (chunk.length < 0) {
      return;
    }
    if (chunk.type === "IHDR") {
      if (chunk.length !== 13) {
        return;
      }
      hasSeenImageHeader = true;
    }
    switch (chunk.type) {
      case "IDAT":
        return pngFileType;
      case "acTL":
        return apngFileType;
      default:
        if (!hasSeenImageHeader && chunk.type !== "CgBI") {
          return;
        }
        if (isUnknownPngStream && chunk.length > maximumPngChunkSizeInBytes) {
          return hasSeenImageHeader && isPngAncillaryChunk(chunk.type) ? pngFileType : void 0;
        }
        try {
          await safeIgnore(tokenizer, chunk.length + 4, {
            maximumLength: isUnknownPngStream ? maximumPngChunkSizeInBytes + 4 : tokenizer.fileInfo.size,
            reason: "PNG chunk payload"
          });
        } catch (error) {
          if (!isUnknownPngStream && (error instanceof ParserHardLimitError || error instanceof EndOfStreamError)) {
            return pngFileType;
          }
          throw error;
        }
    }
    if (tokenizer.position <= previousPosition) {
      break;
    }
  } while (tokenizer.position + 8 < tokenizer.fileInfo.size);
  return pngFileType;
}

// soda-player/node_modules/file-type/source/detectors/asf.js
init_lib3();
init_core();
var maximumAsfHeaderObjectCount = 512;
var maximumAsfHeaderPayloadSizeInBytes = 1024 * 1024;
async function detectAsf(tokenizer) {
  let isMalformedAsf = false;
  try {
    async function readHeader() {
      const guid = new Uint8Array(16);
      await safeReadBuffer(tokenizer, guid, void 0, {
        maximumLength: guid.length,
        reason: "ASF header GUID"
      });
      return {
        id: guid,
        size: Number(await tokenizer.readToken(UINT64_LE))
      };
    }
    await safeIgnore(tokenizer, 30, {
      maximumLength: 30,
      reason: "ASF header prelude"
    });
    const isUnknownFileSize = hasUnknownFileSize(tokenizer);
    const asfHeaderScanStart = tokenizer.position;
    let asfHeaderObjectCount = 0;
    while (tokenizer.position + 24 < tokenizer.fileInfo.size) {
      asfHeaderObjectCount++;
      if (asfHeaderObjectCount > maximumAsfHeaderObjectCount) {
        break;
      }
      if (hasExceededUnknownSizeScanBudget(tokenizer, asfHeaderScanStart, maximumUntrustedSkipSizeInBytes)) {
        break;
      }
      const previousPosition = tokenizer.position;
      const header = await readHeader();
      let payload = header.size - 24;
      if (!Number.isFinite(payload) || payload < 0) {
        isMalformedAsf = true;
        break;
      }
      if (checkBytes(header.id, [145, 7, 220, 183, 183, 169, 207, 17, 142, 230, 0, 192, 12, 32, 83, 101])) {
        const typeId = new Uint8Array(16);
        payload -= await safeReadBuffer(tokenizer, typeId, void 0, {
          maximumLength: typeId.length,
          reason: "ASF stream type GUID"
        });
        if (checkBytes(typeId, [64, 158, 105, 248, 77, 91, 207, 17, 168, 253, 0, 128, 95, 92, 68, 43])) {
          return {
            ext: "asf",
            mime: "audio/x-ms-asf"
          };
        }
        if (checkBytes(typeId, [192, 239, 25, 188, 77, 91, 207, 17, 168, 253, 0, 128, 95, 92, 68, 43])) {
          return {
            ext: "asf",
            mime: "video/x-ms-asf"
          };
        }
        break;
      }
      if (isUnknownFileSize && payload > maximumAsfHeaderPayloadSizeInBytes) {
        isMalformedAsf = true;
        break;
      }
      await safeIgnore(tokenizer, payload, {
        maximumLength: isUnknownFileSize ? maximumAsfHeaderPayloadSizeInBytes : tokenizer.fileInfo.size,
        reason: "ASF header payload"
      });
      if (tokenizer.position <= previousPosition) {
        isMalformedAsf = true;
        break;
      }
    }
  } catch (error) {
    if (error instanceof EndOfStreamError || error instanceof ParserHardLimitError) {
      if (hasUnknownFileSize(tokenizer)) {
        isMalformedAsf = true;
      }
    } else {
      throw error;
    }
  }
  if (isMalformedAsf) {
    return;
  }
  return {
    ext: "asf",
    mime: "application/vnd.ms-asf"
  };
}

// soda-player/node_modules/file-type/source/index.js
var reasonableDetectionSizeInBytes = 4100;
var maximumMpegOffsetTolerance = reasonableDetectionSizeInBytes - 4;
var maximumNestedGzipDetectionSizeInBytes = maximumUntrustedSkipSizeInBytes;
var maximumNestedGzipProbeDepth = 1;
var unknownSizeGzipProbeTimeoutInMilliseconds = 100;
var maximumId3HeaderSizeInBytes = maximumUntrustedSkipSizeInBytes;
var maximumTiffTagCount = 512;
var maximumDetectionReentryCount = 256;
var maximumTiffStreamIfdOffsetInBytes = 1024 * 1024;
var maximumTiffIfdOffsetInBytes = maximumUntrustedSkipSizeInBytes;
function normalizeSampleSize(sampleSize) {
  if (!Number.isFinite(sampleSize)) {
    return reasonableDetectionSizeInBytes;
  }
  return Math.max(1, Math.trunc(sampleSize));
}
function normalizeMpegOffsetTolerance(mpegOffsetTolerance) {
  if (!Number.isFinite(mpegOffsetTolerance)) {
    return 0;
  }
  return Math.max(0, Math.min(maximumMpegOffsetTolerance, Math.trunc(mpegOffsetTolerance)));
}
function getKnownFileSizeOrMaximum(fileSize) {
  if (!Number.isFinite(fileSize)) {
    return Number.MAX_SAFE_INTEGER;
  }
  return Math.max(0, fileSize);
}
function importAtRuntime(specifier) {
  return import(
    /* @vite-ignore */
    /* webpackIgnore: true */
    specifier
  );
}
function toDefaultStream(stream) {
  return stream.pipeThrough(new TransformStream());
}
function readWithSignal(reader, signal) {
  if (signal === void 0) {
    return reader.read();
  }
  signal.throwIfAborted();
  return Promise.race([
    reader.read(),
    new Promise((_resolve, reject) => {
      signal.addEventListener("abort", () => {
        reject(signal.reason);
        reader.cancel(signal.reason).catch(() => {
        });
      }, { once: true });
    })
  ]);
}
function createByteLimitedReadableStream(stream, maximumBytes) {
  const reader = stream.getReader();
  let emittedBytes = 0;
  let sourceDone = false;
  let sourceCanceled = false;
  const cancelSource = async (reason) => {
    if (sourceDone || sourceCanceled) {
      return;
    }
    sourceCanceled = true;
    await reader.cancel(reason);
  };
  return new ReadableStream({
    async pull(controller) {
      if (emittedBytes >= maximumBytes) {
        controller.close();
        await cancelSource();
        return;
      }
      const { done, value } = await reader.read();
      if (done || !value) {
        sourceDone = true;
        controller.close();
        return;
      }
      const remainingBytes = maximumBytes - emittedBytes;
      if (value.length > remainingBytes) {
        controller.enqueue(value.subarray(0, remainingBytes));
        emittedBytes += remainingBytes;
        controller.close();
        await cancelSource();
        return;
      }
      controller.enqueue(value);
      emittedBytes += value.length;
    },
    async cancel(reason) {
      await cancelSource(reason);
    }
  });
}
async function fileTypeFromBuffer(input, options) {
  return new FileTypeParser(options).fromBuffer(input);
}
var FileTypeParser = class _FileTypeParser {
  constructor(options) {
    const normalizedMpegOffsetTolerance = normalizeMpegOffsetTolerance(options?.mpegOffsetTolerance);
    this.options = {
      ...options,
      mpegOffsetTolerance: normalizedMpegOffsetTolerance
    };
    this.detectors = [
      ...this.options.customDetectors ?? [],
      { id: "core", detect: this.detectConfident },
      { id: "core.imprecise", detect: this.detectImprecise }
    ];
    this.tokenizerOptions = {
      abortSignal: this.options.signal
    };
    this.gzipProbeDepth = 0;
  }
  getTokenizerOptions() {
    return {
      ...this.tokenizerOptions
    };
  }
  createTokenizerFromWebStream(stream) {
    return fromWebStream(toDefaultStream(stream), this.getTokenizerOptions());
  }
  async parseTokenizer(tokenizer, detectionReentryCount = 0) {
    this.detectionReentryCount = detectionReentryCount;
    const initialPosition = tokenizer.position;
    for (const detector of this.detectors) {
      let fileType;
      try {
        fileType = await detector.detect(tokenizer);
      } catch (error) {
        if (error instanceof EndOfStreamError) {
          return;
        }
        if (error instanceof ParserHardLimitError) {
          return;
        }
        throw error;
      }
      if (fileType) {
        return fileType;
      }
      if (initialPosition !== tokenizer.position) {
        return void 0;
      }
    }
  }
  async fromTokenizer(tokenizer) {
    try {
      return await this.parseTokenizer(tokenizer);
    } finally {
      await tokenizer.close();
    }
  }
  async fromBuffer(input) {
    if (!(input instanceof Uint8Array || input instanceof ArrayBuffer)) {
      throw new TypeError(`Expected the \`input\` argument to be of type \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof input}\``);
    }
    const buffer = input instanceof Uint8Array ? input : new Uint8Array(input);
    if (!(buffer?.length > 1)) {
      return;
    }
    return this.fromTokenizer(fromBuffer(buffer, this.getTokenizerOptions()));
  }
  async fromBlob(blob) {
    this.options.signal?.throwIfAborted();
    const tokenizer = fromBlob(blob, this.getTokenizerOptions());
    return this.fromTokenizer(tokenizer);
  }
  async fromStream(stream) {
    this.options.signal?.throwIfAborted();
    const tokenizer = this.createTokenizerFromWebStream(stream);
    return this.fromTokenizer(tokenizer);
  }
  async fromFile(path2) {
    this.options.signal?.throwIfAborted();
    const [{ default: fsPromises }, { FileTokenizer: FileTokenizer2 }] = await Promise.all([
      importAtRuntime("node:fs/promises"),
      importAtRuntime("strtok3")
    ]);
    const fileHandle = await fsPromises.open(path2, fsPromises.constants.O_RDONLY | fsPromises.constants.O_NONBLOCK);
    const fileStat = await fileHandle.stat();
    if (!fileStat.isFile()) {
      await fileHandle.close();
      return;
    }
    const tokenizer = new FileTokenizer2(fileHandle, {
      ...this.getTokenizerOptions(),
      fileInfo: { path: path2, size: fileStat.size }
    });
    return this.fromTokenizer(tokenizer);
  }
  async toDetectionStream(stream, options) {
    this.options.signal?.throwIfAborted();
    const sampleSize = normalizeSampleSize(options?.sampleSize ?? reasonableDetectionSizeInBytes);
    let detectedFileType;
    let streamEnded = false;
    const reader = stream.getReader();
    const chunks = [];
    let totalSize = 0;
    try {
      while (totalSize < sampleSize) {
        const { value, done } = await readWithSignal(reader, this.options.signal);
        if (done || !value) {
          streamEnded = true;
          break;
        }
        chunks.push(value);
        totalSize += value.length;
      }
      if (!streamEnded && totalSize === sampleSize) {
        const { value, done } = await readWithSignal(reader, this.options.signal);
        if (done || !value) {
          streamEnded = true;
        } else {
          chunks.push(value);
          totalSize += value.length;
        }
      }
    } finally {
      reader.releaseLock();
    }
    if (totalSize > 0) {
      const sample = chunks.length === 1 ? chunks[0] : concatUint8Arrays(chunks);
      try {
        detectedFileType = await this.fromBuffer(sample.subarray(0, sampleSize));
      } catch (error) {
        if (!(error instanceof EndOfStreamError)) {
          throw error;
        }
        detectedFileType = void 0;
      }
      if (!streamEnded && detectedFileType?.ext === "pages") {
        detectedFileType = {
          ext: "zip",
          mime: "application/zip"
        };
      }
    }
    const transformStream = new TransformStream({
      start(controller) {
        for (const chunk of chunks) {
          controller.enqueue(chunk);
        }
      },
      transform(chunk, controller) {
        controller.enqueue(chunk);
      }
    });
    const newStream = stream.pipeThrough(transformStream);
    newStream.fileType = detectedFileType;
    return newStream;
  }
  async detectGzip(tokenizer) {
    if (this.gzipProbeDepth >= maximumNestedGzipProbeDepth) {
      return {
        ext: "gz",
        mime: "application/gzip"
      };
    }
    const gzipHandler = new GzipHandler(tokenizer);
    const limitedInflatedStream = createByteLimitedReadableStream(gzipHandler.inflate(), maximumNestedGzipDetectionSizeInBytes);
    const hasUnknownSize = hasUnknownFileSize(tokenizer);
    let timeout;
    let probeSignal;
    let probeParser;
    let compressedFileType;
    if (hasUnknownSize) {
      const timeoutController = new AbortController();
      timeout = setTimeout(() => {
        timeoutController.abort(new DOMException(`Operation timed out after ${unknownSizeGzipProbeTimeoutInMilliseconds} ms`, "TimeoutError"));
      }, unknownSizeGzipProbeTimeoutInMilliseconds);
      probeSignal = this.options.signal === void 0 ? timeoutController.signal : AbortSignal.any([this.options.signal, timeoutController.signal]);
      probeParser = new _FileTypeParser({
        ...this.options,
        signal: probeSignal
      });
      probeParser.gzipProbeDepth = this.gzipProbeDepth + 1;
    } else {
      this.gzipProbeDepth++;
    }
    try {
      compressedFileType = await (probeParser ?? this).fromStream(limitedInflatedStream);
    } catch (error) {
      if (error?.name === "AbortError" && probeSignal?.reason?.name !== "TimeoutError") {
        throw error;
      }
    } finally {
      clearTimeout(timeout);
      if (!hasUnknownSize) {
        this.gzipProbeDepth--;
      }
    }
    if (compressedFileType?.ext === "tar") {
      return {
        ext: "tar.gz",
        mime: "application/gzip"
      };
    }
    return {
      ext: "gz",
      mime: "application/gzip"
    };
  }
  check(header, options) {
    return checkBytes(this.buffer, header, options);
  }
  checkString(header, options) {
    return this.check(stringToBytes(header, options?.encoding), options);
  }
  // Detections with a high degree of certainty in identifying the correct file type
  detectConfident = async (tokenizer) => {
    this.buffer = new Uint8Array(reasonableDetectionSizeInBytes);
    if (tokenizer.fileInfo.size === void 0) {
      tokenizer.fileInfo.size = Number.MAX_SAFE_INTEGER;
    }
    this.tokenizer = tokenizer;
    if (hasUnknownFileSize(tokenizer)) {
      await tokenizer.peekBuffer(this.buffer, { length: 3, mayBeLess: true });
      if (this.check([31, 139, 8])) {
        return this.detectGzip(tokenizer);
      }
    }
    await tokenizer.peekBuffer(this.buffer, { length: 32, mayBeLess: true });
    if (this.check([66, 77])) {
      return {
        ext: "bmp",
        mime: "image/bmp"
      };
    }
    if (this.check([11, 119])) {
      return {
        ext: "ac3",
        mime: "audio/vnd.dolby.dd-raw"
      };
    }
    if (this.check([120, 1])) {
      return {
        ext: "dmg",
        mime: "application/x-apple-diskimage"
      };
    }
    if (this.check([77, 90])) {
      return {
        ext: "exe",
        mime: "application/x-msdownload"
      };
    }
    if (this.check([37, 33])) {
      await tokenizer.peekBuffer(this.buffer, { length: 24, mayBeLess: true });
      if (this.checkString("PS-Adobe-", { offset: 2 }) && this.checkString(" EPSF-", { offset: 14 })) {
        return {
          ext: "eps",
          mime: "application/eps"
        };
      }
      return {
        ext: "ps",
        mime: "application/postscript"
      };
    }
    if (this.check([31, 160]) || this.check([31, 157])) {
      return {
        ext: "Z",
        mime: "application/x-compress"
      };
    }
    if (this.check([199, 113])) {
      return {
        ext: "cpio",
        mime: "application/x-cpio"
      };
    }
    if (this.check([96, 234])) {
      return {
        ext: "arj",
        mime: "application/x-arj"
      };
    }
    if (this.check([239, 187, 191])) {
      if (this.detectionReentryCount >= maximumDetectionReentryCount) {
        return;
      }
      this.detectionReentryCount++;
      await this.tokenizer.ignore(3);
      return this.detectConfident(tokenizer);
    }
    if (this.check([71, 73, 70])) {
      return {
        ext: "gif",
        mime: "image/gif"
      };
    }
    if (this.check([73, 73, 188])) {
      return {
        ext: "jxr",
        mime: "image/vnd.ms-photo"
      };
    }
    if (this.check([31, 139, 8])) {
      return this.detectGzip(tokenizer);
    }
    if (this.check([66, 90, 104])) {
      return {
        ext: "bz2",
        mime: "application/x-bzip2"
      };
    }
    if (this.checkString("ID3")) {
      await safeIgnore(tokenizer, 6, {
        maximumLength: 6,
        reason: "ID3 header prefix"
      });
      const id3HeaderLength = await tokenizer.readToken(uint32SyncSafeToken);
      const isUnknownFileSize = hasUnknownFileSize(tokenizer);
      if (!Number.isFinite(id3HeaderLength) || id3HeaderLength < 0 || isUnknownFileSize && (id3HeaderLength > maximumId3HeaderSizeInBytes || tokenizer.position + id3HeaderLength > maximumId3HeaderSizeInBytes)) {
        return;
      }
      if (tokenizer.position + id3HeaderLength > tokenizer.fileInfo.size) {
        if (isUnknownFileSize) {
          return;
        }
        return {
          ext: "mp3",
          mime: "audio/mpeg"
        };
      }
      try {
        await safeIgnore(tokenizer, id3HeaderLength, {
          maximumLength: isUnknownFileSize ? maximumId3HeaderSizeInBytes : tokenizer.fileInfo.size,
          reason: "ID3 payload"
        });
      } catch (error) {
        if (error instanceof EndOfStreamError) {
          return;
        }
        throw error;
      }
      if (this.detectionReentryCount >= maximumDetectionReentryCount) {
        return;
      }
      this.detectionReentryCount++;
      return this.parseTokenizer(tokenizer, this.detectionReentryCount);
    }
    if (this.checkString("MP+")) {
      return {
        ext: "mpc",
        mime: "audio/x-musepack"
      };
    }
    if ((this.buffer[0] === 67 || this.buffer[0] === 70) && this.check([87, 83], { offset: 1 })) {
      return {
        ext: "swf",
        mime: "application/x-shockwave-flash"
      };
    }
    if (this.check([255, 216, 255])) {
      if (this.check([247], { offset: 3 })) {
        return {
          ext: "jls",
          mime: "image/jls"
        };
      }
      return {
        ext: "jpg",
        mime: "image/jpeg"
      };
    }
    if (this.check([79, 98, 106, 1])) {
      return {
        ext: "avro",
        mime: "application/avro"
      };
    }
    if (this.checkString("FLIF")) {
      return {
        ext: "flif",
        mime: "image/flif"
      };
    }
    if (this.checkString("8BPS")) {
      return {
        ext: "psd",
        mime: "image/vnd.adobe.photoshop"
      };
    }
    if (this.checkString("MPCK")) {
      return {
        ext: "mpc",
        mime: "audio/x-musepack"
      };
    }
    if (this.checkString("FORM")) {
      return {
        ext: "aif",
        mime: "audio/aiff"
      };
    }
    if (this.checkString("icns", { offset: 0 })) {
      return {
        ext: "icns",
        mime: "image/icns"
      };
    }
    if (this.check([80, 75, 3, 4])) {
      return detectZip(tokenizer);
    }
    if (this.checkString("OggS")) {
      await tokenizer.ignore(28);
      const type = new Uint8Array(8);
      await tokenizer.readBuffer(type);
      if (checkBytes(type, [79, 112, 117, 115, 72, 101, 97, 100])) {
        return {
          ext: "opus",
          mime: "audio/ogg; codecs=opus"
        };
      }
      if (checkBytes(type, [128, 116, 104, 101, 111, 114, 97])) {
        return {
          ext: "ogv",
          mime: "video/ogg"
        };
      }
      if (checkBytes(type, [1, 118, 105, 100, 101, 111, 0])) {
        return {
          ext: "ogm",
          mime: "video/ogg"
        };
      }
      if (checkBytes(type, [127, 70, 76, 65, 67])) {
        return {
          ext: "oga",
          mime: "audio/ogg"
        };
      }
      if (checkBytes(type, [83, 112, 101, 101, 120, 32, 32])) {
        return {
          ext: "spx",
          mime: "audio/ogg"
        };
      }
      if (checkBytes(type, [1, 118, 111, 114, 98, 105, 115])) {
        return {
          ext: "ogg",
          mime: "audio/ogg"
        };
      }
      return {
        ext: "ogx",
        mime: "application/ogg"
      };
    }
    if (this.check([80, 75]) && (this.buffer[2] === 3 || this.buffer[2] === 5 || this.buffer[2] === 7) && (this.buffer[3] === 4 || this.buffer[3] === 6 || this.buffer[3] === 8)) {
      return {
        ext: "zip",
        mime: "application/zip"
      };
    }
    if (this.checkString("MThd")) {
      return {
        ext: "mid",
        mime: "audio/midi"
      };
    }
    if (this.checkString("wOFF") && (this.check([0, 1, 0, 0], { offset: 4 }) || this.checkString("OTTO", { offset: 4 }))) {
      return {
        ext: "woff",
        mime: "font/woff"
      };
    }
    if (this.checkString("wOF2") && (this.check([0, 1, 0, 0], { offset: 4 }) || this.checkString("OTTO", { offset: 4 }))) {
      return {
        ext: "woff2",
        mime: "font/woff2"
      };
    }
    if (this.check([212, 195, 178, 161]) || this.check([161, 178, 195, 212])) {
      return {
        ext: "pcap",
        mime: "application/vnd.tcpdump.pcap"
      };
    }
    if (this.checkString("DSD ")) {
      return {
        ext: "dsf",
        mime: "audio/x-dsf"
        // Non-standard
      };
    }
    if (this.checkString("LZIP")) {
      return {
        ext: "lz",
        mime: "application/lzip"
      };
    }
    if (this.checkString("fLaC")) {
      return {
        ext: "flac",
        mime: "audio/flac"
      };
    }
    if (this.check([66, 80, 71, 251])) {
      return {
        ext: "bpg",
        mime: "image/bpg"
      };
    }
    if (this.checkString("wvpk")) {
      return {
        ext: "wv",
        mime: "audio/wavpack"
      };
    }
    if (this.checkString("%PDF")) {
      return {
        ext: "pdf",
        mime: "application/pdf"
      };
    }
    if (this.check([0, 97, 115, 109])) {
      return {
        ext: "wasm",
        mime: "application/wasm"
      };
    }
    if (this.check([73, 73])) {
      const fileType = await this.readTiffHeader(false);
      if (fileType) {
        return fileType;
      }
    }
    if (this.check([77, 77])) {
      const fileType = await this.readTiffHeader(true);
      if (fileType) {
        return fileType;
      }
    }
    if (this.checkString("MAC ")) {
      return {
        ext: "ape",
        mime: "audio/ape"
      };
    }
    if (this.check([26, 69, 223, 163])) {
      return detectEbml(tokenizer);
    }
    if (this.checkString("SQLi")) {
      return {
        ext: "sqlite",
        mime: "application/x-sqlite3"
      };
    }
    if (this.check([78, 69, 83, 26])) {
      return {
        ext: "nes",
        mime: "application/x-nintendo-nes-rom"
      };
    }
    if (this.checkString("Cr24")) {
      return {
        ext: "crx",
        mime: "application/x-google-chrome-extension"
      };
    }
    if (this.checkString("MSCF") || this.checkString("ISc(")) {
      return {
        ext: "cab",
        mime: "application/vnd.ms-cab-compressed"
      };
    }
    if (this.check([237, 171, 238, 219])) {
      return {
        ext: "rpm",
        mime: "application/x-rpm"
      };
    }
    if (this.check([197, 208, 211, 198])) {
      return {
        ext: "eps",
        mime: "application/eps"
      };
    }
    if (this.check([40, 181, 47, 253])) {
      return {
        ext: "zst",
        mime: "application/zstd"
      };
    }
    if (this.check([127, 69, 76, 70])) {
      return {
        ext: "elf",
        mime: "application/x-elf"
      };
    }
    if (this.check([33, 66, 68, 78])) {
      return {
        ext: "pst",
        mime: "application/vnd.ms-outlook"
      };
    }
    if (this.checkString("PAR1") || this.checkString("PARE")) {
      return {
        ext: "parquet",
        mime: "application/vnd.apache.parquet"
      };
    }
    if (this.checkString("ttcf")) {
      return {
        ext: "ttc",
        mime: "font/collection"
      };
    }
    if (this.check([254, 237, 250, 206]) || this.check([254, 237, 250, 207]) || this.check([206, 250, 237, 254]) || this.check([207, 250, 237, 254])) {
      return {
        ext: "macho",
        mime: "application/x-mach-binary"
      };
    }
    if (this.check([4, 34, 77, 24])) {
      return {
        ext: "lz4",
        mime: "application/x-lz4"
        // Informal, used by freedesktop.org shared-mime-info
      };
    }
    if (this.checkString("regf")) {
      return {
        ext: "dat",
        mime: "application/x-ft-windows-registry-hive"
      };
    }
    if (this.checkString("$FL2") || this.checkString("$FL3")) {
      return {
        ext: "sav",
        mime: "application/x-spss-sav"
      };
    }
    if (this.check([79, 84, 84, 79, 0])) {
      return {
        ext: "otf",
        mime: "font/otf"
      };
    }
    if (this.checkString("#!AMR")) {
      return {
        ext: "amr",
        mime: "audio/amr"
      };
    }
    if (this.checkString(String.raw`{\rtf`)) {
      return {
        ext: "rtf",
        mime: "application/rtf"
      };
    }
    if (this.check([70, 76, 86, 1])) {
      return {
        ext: "flv",
        mime: "video/x-flv"
      };
    }
    if (this.checkString("IMPM")) {
      return {
        ext: "it",
        mime: "audio/x-it"
      };
    }
    if (this.checkString("-lh0-", { offset: 2 }) || this.checkString("-lh1-", { offset: 2 }) || this.checkString("-lh2-", { offset: 2 }) || this.checkString("-lh3-", { offset: 2 }) || this.checkString("-lh4-", { offset: 2 }) || this.checkString("-lh5-", { offset: 2 }) || this.checkString("-lh6-", { offset: 2 }) || this.checkString("-lh7-", { offset: 2 }) || this.checkString("-lzs-", { offset: 2 }) || this.checkString("-lz4-", { offset: 2 }) || this.checkString("-lz5-", { offset: 2 }) || this.checkString("-lhd-", { offset: 2 })) {
      return {
        ext: "lzh",
        mime: "application/x-lzh-compressed"
      };
    }
    if (this.check([0, 0, 1, 186])) {
      if (this.check([33], { offset: 4, mask: [241] })) {
        return {
          ext: "mpg",
          // May also be .ps, .mpeg
          mime: "video/MP1S"
        };
      }
      if (this.check([68], { offset: 4, mask: [196] })) {
        return {
          ext: "mpg",
          // May also be .mpg, .m2p, .vob or .sub
          mime: "video/MP2P"
        };
      }
    }
    if (this.checkString("ITSF")) {
      return {
        ext: "chm",
        mime: "application/vnd.ms-htmlhelp"
      };
    }
    if (this.check([202, 254, 186, 190])) {
      const machOArchitectureCount = UINT32_BE.get(this.buffer, 4);
      const javaClassFileMajorVersion = UINT16_BE.get(this.buffer, 6);
      if (machOArchitectureCount > 0 && machOArchitectureCount <= 30) {
        return {
          ext: "macho",
          mime: "application/x-mach-binary"
        };
      }
      if (javaClassFileMajorVersion > 30) {
        return {
          ext: "class",
          mime: "application/java-vm"
        };
      }
    }
    if (this.checkString(".RMF")) {
      return {
        ext: "rm",
        mime: "application/vnd.rn-realmedia"
      };
    }
    if (this.checkString("DRACO")) {
      return {
        ext: "drc",
        mime: "application/x-ft-draco"
      };
    }
    if (this.check([253, 55, 122, 88, 90, 0])) {
      return {
        ext: "xz",
        mime: "application/x-xz"
      };
    }
    if (this.checkString("<?xml ")) {
      return {
        ext: "xml",
        mime: "application/xml"
      };
    }
    if (this.check([55, 122, 188, 175, 39, 28])) {
      return {
        ext: "7z",
        mime: "application/x-7z-compressed"
      };
    }
    if (this.check([82, 97, 114, 33, 26, 7]) && (this.buffer[6] === 0 || this.buffer[6] === 1)) {
      return {
        ext: "rar",
        mime: "application/x-rar-compressed"
      };
    }
    if (this.checkString("solid ")) {
      return {
        ext: "stl",
        mime: "model/stl"
      };
    }
    if (this.checkString("AC")) {
      const version = new StringType(4, "latin1").get(this.buffer, 2);
      if (/^\d+$/v.test(version) && version >= 1e3 && version <= 1050) {
        return {
          ext: "dwg",
          mime: "image/vnd.dwg"
        };
      }
    }
    if (this.checkString("070707")) {
      return {
        ext: "cpio",
        mime: "application/x-cpio"
      };
    }
    if (this.checkString("BLENDER")) {
      return {
        ext: "blend",
        mime: "application/x-blender"
      };
    }
    if (this.checkString("!<arch>")) {
      await tokenizer.ignore(8);
      const string = await tokenizer.readToken(new StringType(13, "ascii"));
      if (string === "debian-binary") {
        return {
          ext: "deb",
          mime: "application/x-deb"
        };
      }
      return {
        ext: "ar",
        mime: "application/x-unix-archive"
      };
    }
    if (this.checkString("WEBVTT") && // One of LF, CR, tab, space, or end of file must follow "WEBVTT" per the spec (see `fixture/fixture-vtt-*.vtt` for examples). Note that `\0` is technically the null character (there is no such thing as an EOF character). However, checking for `\0` gives us the same result as checking for the end of the stream.
    ["\n", "\r", "	", " ", "\0"].some((char7) => this.checkString(char7, { offset: 6 }))) {
      return {
        ext: "vtt",
        mime: "text/vtt"
      };
    }
    if (this.check([137, 80, 78, 71, 13, 10, 26, 10])) {
      return detectPng(tokenizer);
    }
    if (this.check([65, 82, 82, 79, 87, 49, 0, 0])) {
      return {
        ext: "arrow",
        mime: "application/vnd.apache.arrow.file"
      };
    }
    if (this.check([103, 108, 84, 70, 2, 0, 0, 0])) {
      return {
        ext: "glb",
        mime: "model/gltf-binary"
      };
    }
    if (this.check([102, 114, 101, 101], { offset: 4 }) || this.check([109, 100, 97, 116], { offset: 4 }) || this.check([109, 111, 111, 118], { offset: 4 }) || this.check([119, 105, 100, 101], { offset: 4 })) {
      return {
        ext: "mov",
        mime: "video/quicktime"
      };
    }
    if (this.check([73, 73, 82, 79, 8, 0, 0, 0, 24])) {
      return {
        ext: "orf",
        mime: "image/x-olympus-orf"
      };
    }
    if (this.checkString("gimp xcf ")) {
      return {
        ext: "xcf",
        mime: "image/x-xcf"
      };
    }
    if (this.checkString("ftyp", { offset: 4 }) && (this.buffer[8] & 96) !== 0) {
      const brandMajor = new StringType(4, "latin1").get(this.buffer, 8).replace("\0", " ").trim();
      switch (brandMajor) {
        case "avif":
        case "avis":
          return { ext: "avif", mime: "image/avif" };
        case "mif1":
          return { ext: "heic", mime: "image/heif" };
        case "msf1":
          return { ext: "heic", mime: "image/heif-sequence" };
        case "heic":
        case "heix":
          return { ext: "heic", mime: "image/heic" };
        case "hevc":
        case "hevx":
          return { ext: "heic", mime: "image/heic-sequence" };
        case "qt":
          return { ext: "mov", mime: "video/quicktime" };
        case "M4V":
        case "M4VH":
        case "M4VP":
          return { ext: "m4v", mime: "video/x-m4v" };
        case "M4P":
          return { ext: "m4p", mime: "video/mp4" };
        case "M4B":
          return { ext: "m4b", mime: "audio/mp4" };
        case "M4A":
          return { ext: "m4a", mime: "audio/x-m4a" };
        case "F4V":
          return { ext: "f4v", mime: "video/mp4" };
        case "F4P":
          return { ext: "f4p", mime: "video/mp4" };
        case "F4A":
          return { ext: "f4a", mime: "audio/mp4" };
        case "F4B":
          return { ext: "f4b", mime: "audio/mp4" };
        case "crx":
          return { ext: "cr3", mime: "image/x-canon-cr3" };
        default:
          if (brandMajor.startsWith("3g")) {
            if (brandMajor.startsWith("3g2")) {
              return { ext: "3g2", mime: "video/3gpp2" };
            }
            return { ext: "3gp", mime: "video/3gpp" };
          }
          return { ext: "mp4", mime: "video/mp4" };
      }
    }
    if (this.checkString("REGEDIT4\r\n")) {
      return {
        ext: "reg",
        mime: "application/x-ms-regedit"
      };
    }
    if (this.check([82, 73, 70, 70])) {
      if (this.checkString("WEBP", { offset: 8 })) {
        return {
          ext: "webp",
          mime: "image/webp"
        };
      }
      if (this.check([65, 86, 73], { offset: 8 })) {
        return {
          ext: "avi",
          mime: "video/vnd.avi"
        };
      }
      if (this.check([87, 65, 86, 69], { offset: 8 })) {
        return {
          ext: "wav",
          mime: "audio/wav"
        };
      }
      if (this.check([81, 76, 67, 77], { offset: 8 })) {
        return {
          ext: "qcp",
          mime: "audio/qcelp"
        };
      }
    }
    if (this.check([73, 73, 85, 0, 24, 0, 0, 0, 136, 231, 116, 216])) {
      return {
        ext: "rw2",
        mime: "image/x-panasonic-rw2"
      };
    }
    if (this.check([48, 38, 178, 117, 142, 102, 207, 17, 166, 217])) {
      return detectAsf(tokenizer);
    }
    if (this.check([171, 75, 84, 88, 32, 49, 49, 187, 13, 10, 26, 10])) {
      return {
        ext: "ktx",
        mime: "image/ktx"
      };
    }
    if ((this.check([126, 16, 4]) || this.check([126, 24, 4])) && this.check([48, 77, 73, 69], { offset: 4 })) {
      return {
        ext: "mie",
        mime: "application/x-mie"
      };
    }
    if (this.check([39, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], { offset: 2 })) {
      return {
        ext: "shp",
        mime: "application/x-esri-shape"
      };
    }
    if (this.check([255, 79, 255, 81])) {
      return {
        ext: "j2c",
        mime: "image/j2c"
      };
    }
    if (this.check([0, 0, 0, 12, 106, 80, 32, 32, 13, 10, 135, 10])) {
      await tokenizer.ignore(20);
      const type = await tokenizer.readToken(new StringType(4, "ascii"));
      switch (type) {
        case "jp2 ":
          return {
            ext: "jp2",
            mime: "image/jp2"
          };
        case "jpx ":
          return {
            ext: "jpx",
            mime: "image/jpx"
          };
        case "jpm ":
          return {
            ext: "jpm",
            mime: "image/jpm"
          };
        case "mjp2":
          return {
            ext: "mj2",
            mime: "image/mj2"
          };
        default:
          return;
      }
    }
    if (this.check([255, 10]) || this.check([0, 0, 0, 12, 74, 88, 76, 32, 13, 10, 135, 10])) {
      return {
        ext: "jxl",
        mime: "image/jxl"
      };
    }
    if (this.check([254, 255])) {
      if (this.checkString("<?xml ", { offset: 2, encoding: "utf-16be" })) {
        return {
          ext: "xml",
          mime: "application/xml"
        };
      }
      return void 0;
    }
    if (this.check([208, 207, 17, 224, 161, 177, 26, 225])) {
      return {
        ext: "cfb",
        mime: "application/x-cfb"
      };
    }
    await tokenizer.peekBuffer(this.buffer, { length: Math.min(256, tokenizer.fileInfo.size), mayBeLess: true });
    if (this.check([97, 99, 115, 112], { offset: 36 })) {
      return {
        ext: "icc",
        mime: "application/vnd.iccprofile"
      };
    }
    if (this.checkString("**ACE", { offset: 7 }) && this.checkString("**", { offset: 12 })) {
      return {
        ext: "ace",
        mime: "application/x-ace-compressed"
      };
    }
    if (this.checkString("BEGIN:")) {
      if (this.checkString("VCARD", { offset: 6 })) {
        return {
          ext: "vcf",
          mime: "text/vcard"
        };
      }
      if (this.checkString("VCALENDAR", { offset: 6 })) {
        return {
          ext: "ics",
          mime: "text/calendar"
        };
      }
    }
    if (this.checkString("FUJIFILMCCD-RAW")) {
      return {
        ext: "raf",
        mime: "image/x-fujifilm-raf"
      };
    }
    if (this.checkString("Extended Module:")) {
      return {
        ext: "xm",
        mime: "audio/x-xm"
      };
    }
    if (this.checkString("Creative Voice File")) {
      return {
        ext: "voc",
        mime: "audio/x-voc"
      };
    }
    if (this.check([4, 0, 0, 0]) && this.buffer.length >= 16) {
      const jsonSize = new DataView(this.buffer.buffer).getUint32(12, true);
      if (jsonSize > 12 && this.buffer.length >= jsonSize + 16) {
        try {
          const header = new TextDecoder().decode(this.buffer.subarray(16, jsonSize + 16));
          const json = JSON.parse(header);
          if (json.files) {
            return {
              ext: "asar",
              mime: "application/x-asar"
            };
          }
        } catch {
        }
      }
    }
    if (this.check([6, 14, 43, 52, 2, 5, 1, 1, 13, 1, 2, 1, 1, 2])) {
      return {
        ext: "mxf",
        mime: "application/mxf"
      };
    }
    if (this.checkString("SCRM", { offset: 44 })) {
      return {
        ext: "s3m",
        mime: "audio/x-s3m"
      };
    }
    if (this.check([71]) && this.check([71], { offset: 188 })) {
      return {
        ext: "mts",
        mime: "video/mp2t"
      };
    }
    if (this.check([71], { offset: 4 }) && this.check([71], { offset: 196 })) {
      return {
        ext: "mts",
        mime: "video/mp2t"
      };
    }
    if (this.check([66, 79, 79, 75, 77, 79, 66, 73], { offset: 60 })) {
      return {
        ext: "mobi",
        mime: "application/x-mobipocket-ebook"
      };
    }
    if (this.check([68, 73, 67, 77], { offset: 128 })) {
      return {
        ext: "dcm",
        mime: "application/dicom"
      };
    }
    if (this.check([76, 0, 0, 0, 1, 20, 2, 0, 0, 0, 0, 0, 192, 0, 0, 0, 0, 0, 0, 70])) {
      return {
        ext: "lnk",
        mime: "application/x-ms-shortcut"
        // Informal, used by freedesktop.org shared-mime-info
      };
    }
    if (this.check([98, 111, 111, 107, 0, 0, 0, 0, 109, 97, 114, 107, 0, 0, 0, 0])) {
      return {
        ext: "alias",
        mime: "application/x-ft-apple.alias"
      };
    }
    if (this.checkString("Kaydara FBX Binary  \0")) {
      return {
        ext: "fbx",
        mime: "application/x-ft-fbx"
      };
    }
    if (this.check([76, 80], { offset: 34 }) && (this.check([0, 0, 1], { offset: 8 }) || this.check([1, 0, 2], { offset: 8 }) || this.check([2, 0, 2], { offset: 8 }))) {
      return {
        ext: "eot",
        mime: "application/vnd.ms-fontobject"
      };
    }
    if (this.check([6, 6, 237, 245, 216, 29, 70, 229, 189, 49, 239, 231, 254, 116, 183, 29])) {
      return {
        ext: "indd",
        mime: "application/x-indesign"
      };
    }
    if (this.check([255, 255, 0, 0, 7, 0, 0, 0, 4, 0, 0, 0, 1, 0, 1, 0]) || this.check([0, 0, 255, 255, 0, 0, 0, 7, 0, 0, 0, 4, 0, 1, 0, 1])) {
      return {
        ext: "jmp",
        mime: "application/x-jmp-data"
      };
    }
    await tokenizer.peekBuffer(this.buffer, { length: Math.min(512, tokenizer.fileInfo.size), mayBeLess: true });
    if (this.checkString("ustar", { offset: 257 }) && (this.checkString("\0", { offset: 262 }) || this.checkString(" ", { offset: 262 })) || this.check([0, 0, 0, 0, 0, 0], { offset: 257 }) && tarHeaderChecksumMatches(this.buffer)) {
      return {
        ext: "tar",
        mime: "application/x-tar"
      };
    }
    if (this.check([255, 254])) {
      const encoding = "utf-16le";
      if (this.checkString("<?xml ", { offset: 2, encoding })) {
        return {
          ext: "xml",
          mime: "application/xml"
        };
      }
      if (this.check([255, 14], { offset: 2 }) && this.checkString("SketchUp Model", { offset: 4, encoding })) {
        return {
          ext: "skp",
          mime: "application/vnd.sketchup.skp"
        };
      }
      if (this.checkString("Windows Registry Editor Version 5.00\r\n", { offset: 2, encoding })) {
        return {
          ext: "reg",
          mime: "application/x-ms-regedit"
        };
      }
      return void 0;
    }
    if (this.checkString("-----BEGIN PGP MESSAGE-----")) {
      return {
        ext: "pgp",
        mime: "application/pgp-encrypted"
      };
    }
    const isoStandardIdentifierOffset = 32769;
    const isoStandardIdentifierLength = 5;
    if (tokenizer.supportsRandomAccess() && tokenizer.fileInfo.size >= isoStandardIdentifierOffset + isoStandardIdentifierLength) {
      const isoStandardIdentifier = new Uint8Array(isoStandardIdentifierLength);
      await tokenizer.peekBuffer(isoStandardIdentifier, {
        position: isoStandardIdentifierOffset,
        length: isoStandardIdentifierLength,
        mayBeLess: true
      });
      if (checkBytes(isoStandardIdentifier, stringToBytes("CD001"))) {
        return {
          ext: "iso",
          mime: "application/x-iso9660-image"
        };
      }
    }
  };
  // Detections with limited supporting data, resulting in a higher likelihood of false positives
  detectImprecise = async (tokenizer) => {
    this.buffer = new Uint8Array(reasonableDetectionSizeInBytes);
    const fileSize = getKnownFileSizeOrMaximum(tokenizer.fileInfo.size);
    await tokenizer.peekBuffer(this.buffer, { length: Math.min(8, fileSize), mayBeLess: true });
    if (this.check([0, 0, 1, 186]) || this.check([0, 0, 1, 179])) {
      return {
        ext: "mpg",
        mime: "video/mpeg"
      };
    }
    if (this.check([0, 1, 0, 0, 0])) {
      return {
        ext: "ttf",
        mime: "font/ttf"
      };
    }
    if (this.check([0, 0, 1, 0])) {
      return {
        ext: "ico",
        mime: "image/x-icon"
      };
    }
    if (this.check([0, 0, 2, 0])) {
      return {
        ext: "cur",
        mime: "image/x-icon"
      };
    }
    await tokenizer.peekBuffer(this.buffer, { length: Math.min(4 + this.options.mpegOffsetTolerance, fileSize), mayBeLess: true });
    if (this.buffer.length >= 4 + this.options.mpegOffsetTolerance) {
      for (let depth = 0; depth <= this.options.mpegOffsetTolerance; ++depth) {
        const type = this.scanMpeg(depth);
        if (type) {
          return type;
        }
      }
    }
  };
  async readTiffTag(bigEndian) {
    const tagId = await this.tokenizer.readToken(bigEndian ? UINT16_BE : UINT16_LE);
    await this.tokenizer.ignore(10);
    switch (tagId) {
      case 50341:
        return {
          ext: "arw",
          mime: "image/x-sony-arw"
        };
      case 50706:
        return {
          ext: "dng",
          mime: "image/x-adobe-dng"
        };
      default:
    }
  }
  async readTiffIFD(bigEndian) {
    const numberOfTags = await this.tokenizer.readToken(bigEndian ? UINT16_BE : UINT16_LE);
    if (numberOfTags > maximumTiffTagCount) {
      return;
    }
    if (hasUnknownFileSize(this.tokenizer) && 2 + numberOfTags * 12 > maximumTiffIfdOffsetInBytes) {
      return;
    }
    for (let n = 0; n < numberOfTags; ++n) {
      const fileType = await this.readTiffTag(bigEndian);
      if (fileType) {
        return fileType;
      }
    }
  }
  async readTiffHeader(bigEndian) {
    const tiffFileType = {
      ext: "tif",
      mime: "image/tiff"
    };
    const version = (bigEndian ? UINT16_BE : UINT16_LE).get(this.buffer, 2);
    const ifdOffset = (bigEndian ? UINT32_BE : UINT32_LE).get(this.buffer, 4);
    if (version === 42) {
      if (ifdOffset >= 6) {
        if (this.checkString("CR", { offset: 8 })) {
          return {
            ext: "cr2",
            mime: "image/x-canon-cr2"
          };
        }
        if (ifdOffset >= 8) {
          const someId1 = (bigEndian ? UINT16_BE : UINT16_LE).get(this.buffer, 8);
          const someId2 = (bigEndian ? UINT16_BE : UINT16_LE).get(this.buffer, 10);
          if (someId1 === 28 && someId2 === 254 || someId1 === 31 && someId2 === 11) {
            return {
              ext: "nef",
              mime: "image/x-nikon-nef"
            };
          }
        }
      }
      if (hasUnknownFileSize(this.tokenizer) && ifdOffset > maximumTiffStreamIfdOffsetInBytes) {
        return tiffFileType;
      }
      const maximumTiffOffset = hasUnknownFileSize(this.tokenizer) ? maximumTiffIfdOffsetInBytes : this.tokenizer.fileInfo.size;
      try {
        await safeIgnore(this.tokenizer, ifdOffset, {
          maximumLength: maximumTiffOffset,
          reason: "TIFF IFD offset"
        });
      } catch (error) {
        if (error instanceof EndOfStreamError) {
          return;
        }
        throw error;
      }
      let fileType;
      try {
        fileType = await this.readTiffIFD(bigEndian);
      } catch (error) {
        if (error instanceof EndOfStreamError) {
          return;
        }
        throw error;
      }
      return fileType ?? tiffFileType;
    }
    if (version === 43) {
      return tiffFileType;
    }
  }
  /**
  	Scan check MPEG 1 or 2 Layer 3 header, or 'layer 0' for ADTS (MPEG sync-word 0xFFE).
  
  	@param offset - Offset to scan for sync-preamble.
  	@returns {{ext: string, mime: string}}
  	*/
  scanMpeg(offset) {
    if (this.check([255, 224], { offset, mask: [255, 224] })) {
      if (this.check([16], { offset: offset + 1, mask: [22] })) {
        return {
          ext: "aac",
          mime: "audio/aac"
        };
      }
      if (this.check([255, 254], { offset })) {
        return;
      }
      if (this.check([8], { offset: offset + 1, mask: [24] })) {
        return;
      }
      if (this.check([240], { offset: offset + 2, mask: [240] })) {
        return;
      }
      if (this.check([12], { offset: offset + 2, mask: [12] })) {
        return;
      }
      if (this.check([2], { offset: offset + 1, mask: [6] })) {
        return {
          ext: "mp3",
          mime: "audio/mpeg"
        };
      }
      if (this.check([4], { offset: offset + 1, mask: [6] })) {
        return {
          ext: "mp2",
          mime: "audio/mpeg"
        };
      }
      if (this.check([6], { offset: offset + 1, mask: [6] })) {
        return {
          ext: "mp1",
          mime: "audio/mpeg"
        };
      }
    }
  }
};
var supportedExtensions = new Set(extensions);
var supportedMimeTypes = new Set(mimeTypes);

// soda-player/node_modules/media-typer/dist/index.js
var typeRegExp = /^[A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126}\/[A-Za-z0-9][A-Za-z0-9!#$&^_.+-]{0,126}$/;
function parse2(str) {
  if (!typeRegExp.test(str)) {
    throw new TypeError(`Invalid media type: ${str}`);
  }
  const slashIndex = str.indexOf("/");
  const type = str.slice(0, slashIndex).toLowerCase();
  let subtype = str.slice(slashIndex + 1).toLowerCase();
  let suffix;
  const index = subtype.lastIndexOf("+");
  if (index !== -1) {
    suffix = subtype.slice(index + 1);
    subtype = subtype.slice(0, index);
  }
  return { type, subtype, suffix };
}

// soda-player/node_modules/music-metadata/lib/aiff/AiffLoader.js
var aiffParserLoader = {
  parserType: "aiff",
  extensions: [".aif", "aiff", "aifc"],
  mimeTypes: ["audio/aiff", "audio/aif", "audio/aifc", "application/aiff"],
  async load() {
    return (await Promise.resolve().then(() => (init_AiffParser(), AiffParser_exports))).AIFFParser;
  }
};

// soda-player/node_modules/music-metadata/lib/apev2/Apev2Loader.js
var apeParserLoader = {
  parserType: "apev2",
  extensions: [".ape"],
  mimeTypes: ["audio/ape", "audio/monkeys-audio"],
  async load() {
    return (await Promise.resolve().then(() => (init_APEv2Parser(), APEv2Parser_exports))).APEv2Parser;
  }
};

// soda-player/node_modules/music-metadata/lib/asf/AsfLoader.js
var asfParserLoader = {
  parserType: "asf",
  extensions: [".asf", ".wma", ".wmv"],
  mimeTypes: ["audio/ms-wma", "video/ms-wmv", "audio/ms-asf", "video/ms-asf", "application/vnd.ms-asf"],
  async load() {
    return (await Promise.resolve().then(() => (init_AsfParser(), AsfParser_exports))).AsfParser;
  }
};

// soda-player/node_modules/music-metadata/lib/common/MetadataCollector.js
var import_debug7 = __toESM(require_src(), 1);

// soda-player/node_modules/music-metadata/lib/lrc/LyricsParser.js
init_type();
var TIMESTAMP_REGEX = /\[(\d{2}):(\d{2})\.(\d{2,3})]/;
function parseLyrics(input) {
  if (TIMESTAMP_REGEX.test(input)) {
    return parseLrc(input);
  }
  return toUnsyncedLyrics(input);
}
function toUnsyncedLyrics(lyrics) {
  return {
    contentType: LyricsContentType.lyrics,
    timeStampFormat: TimestampFormat.notSynchronized,
    text: lyrics.trim(),
    syncText: []
  };
}
function parseLrc(lrcString) {
  const lines = lrcString.split("\n");
  const syncText = [];
  for (const line of lines) {
    const match = line.match(TIMESTAMP_REGEX);
    if (match) {
      const minutes = Number.parseInt(match[1], 10);
      const seconds = Number.parseInt(match[2], 10);
      const ms = match[3].length === 3 ? Number.parseInt(match[3], 10) : Number.parseInt(match[3], 10) * 10;
      const timestamp = (minutes * 60 + seconds) * 1e3 + ms;
      const text = line.replace(TIMESTAMP_REGEX, "").trim();
      syncText.push({ timestamp, text });
    }
  }
  return {
    contentType: LyricsContentType.lyrics,
    timeStampFormat: TimestampFormat.milliseconds,
    text: syncText.map((line) => line.text).join("\n"),
    syncText
  };
}

// soda-player/node_modules/music-metadata/lib/common/MetadataCollector.js
init_type();

// soda-player/node_modules/music-metadata/lib/common/GenericTagMapper.js
var CommonTagMapper = class {
  static maxRatingScore = 1;
  static toIntOrNull(str) {
    const cleaned = Number.parseInt(str, 10);
    return Number.isNaN(cleaned) ? null : cleaned;
  }
  // TODO: a string of 1of1 would fail to be converted
  // converts 1/10 to no : 1, of : 10
  // or 1 to no : 1, of : 0
  static normalizeTrack(origVal) {
    const split = origVal.toString().split("/");
    return {
      no: Number.parseInt(split[0], 10) || null,
      of: Number.parseInt(split[1], 10) || null
    };
  }
  tagTypes;
  tagMap;
  constructor(tagTypes, tagMap2) {
    this.tagTypes = tagTypes;
    this.tagMap = tagMap2;
  }
  /**
   * Process and set common tags
   * write common tags to
   * @param tag Native tag
   * @param warnings Register warnings
   * @return common name
   */
  mapGenericTag(tag, warnings) {
    tag = { id: tag.id, value: tag.value };
    this.postMap(tag, warnings);
    const id = this.getCommonName(tag.id);
    return id ? { id, value: tag.value } : null;
  }
  /**
   * Convert native tag key to common tag key
   * @param tag Native header tag
   * @return common tag name (alias)
   */
  getCommonName(tag) {
    return this.tagMap[tag];
  }
  /**
   * Handle post mapping exceptions / correction
   * @param tag Tag e.g. {"©alb", "Buena Vista Social Club")
   * @param warnings Used to register warnings
   */
  postMap(_tag, _warnings) {
    return;
  }
};

// soda-player/node_modules/music-metadata/lib/aiff/AiffTagMap.js
var tagMap = {
  NAME: "title",
  AUTH: "artist",
  "(c) ": "copyright",
  ANNO: "comment"
};
var AiffTagMapper = class extends CommonTagMapper {
  constructor() {
    super(["AIFF"], tagMap);
  }
};

// soda-player/node_modules/music-metadata/lib/common/CaseInsensitiveTagMap.js
var CaseInsensitiveTagMap = class extends CommonTagMapper {
  constructor(tagTypes, tagMap2) {
    const upperCaseMap = {};
    for (const tag of Object.keys(tagMap2)) {
      upperCaseMap[tag.toUpperCase()] = tagMap2[tag];
    }
    super(tagTypes, upperCaseMap);
  }
  /**
   * @tag  Native header tag
   * @return common tag name (alias)
   */
  getCommonName(tag) {
    return this.tagMap[tag.toUpperCase()];
  }
};

// soda-player/node_modules/music-metadata/lib/apev2/APEv2TagMapper.js
var apev2TagMap = {
  Title: "title",
  Artist: "artist",
  Artists: "artists",
  "Album Artist": "albumartist",
  Album: "album",
  Year: "date",
  Date: "date",
  Originalyear: "originalyear",
  Originaldate: "originaldate",
  Releasedate: "releasedate",
  Comment: "comment",
  Track: "track",
  Disc: "disk",
  DISCNUMBER: "disk",
  // ToDo: backwards compatibility', valid tag?
  Genre: "genre",
  "Cover Art (Front)": "picture",
  "Cover Art (Back)": "picture",
  Composer: "composer",
  Lyrics: "lyrics",
  ALBUMSORT: "albumsort",
  TITLESORT: "titlesort",
  WORK: "work",
  ARTISTSORT: "artistsort",
  ALBUMARTISTSORT: "albumartistsort",
  COMPOSERSORT: "composersort",
  Lyricist: "lyricist",
  Writer: "writer",
  Conductor: "conductor",
  // 'Performer=artist (instrument)': 'performer:instrument',
  MixArtist: "remixer",
  Arranger: "arranger",
  Engineer: "engineer",
  Producer: "producer",
  DJMixer: "djmixer",
  Mixer: "mixer",
  Label: "label",
  Grouping: "grouping",
  Subtitle: "subtitle",
  DiscSubtitle: "discsubtitle",
  Compilation: "compilation",
  BPM: "bpm",
  Mood: "mood",
  Media: "media",
  CatalogNumber: "catalognumber",
  MUSICBRAINZ_ALBUMSTATUS: "releasestatus",
  MUSICBRAINZ_ALBUMTYPE: "releasetype",
  RELEASECOUNTRY: "releasecountry",
  Script: "script",
  Language: "language",
  Copyright: "copyright",
  LICENSE: "license",
  EncodedBy: "encodedby",
  EncoderSettings: "encodersettings",
  Barcode: "barcode",
  ISRC: "isrc",
  ASIN: "asin",
  musicbrainz_trackid: "musicbrainz_recordingid",
  musicbrainz_releasetrackid: "musicbrainz_trackid",
  MUSICBRAINZ_ALBUMID: "musicbrainz_albumid",
  MUSICBRAINZ_ARTISTID: "musicbrainz_artistid",
  MUSICBRAINZ_ALBUMARTISTID: "musicbrainz_albumartistid",
  MUSICBRAINZ_RELEASEGROUPID: "musicbrainz_releasegroupid",
  MUSICBRAINZ_WORKID: "musicbrainz_workid",
  MUSICBRAINZ_TRMID: "musicbrainz_trmid",
  MUSICBRAINZ_DISCID: "musicbrainz_discid",
  Acoustid_Id: "acoustid_id",
  ACOUSTID_FINGERPRINT: "acoustid_fingerprint",
  MUSICIP_PUID: "musicip_puid",
  Weblink: "website",
  REPLAYGAIN_TRACK_GAIN: "replaygain_track_gain",
  REPLAYGAIN_TRACK_PEAK: "replaygain_track_peak",
  MP3GAIN_MINMAX: "replaygain_track_minmax",
  MP3GAIN_UNDO: "replaygain_undo"
};
var APEv2TagMapper = class extends CaseInsensitiveTagMap {
  constructor() {
    super(["APEv2"], apev2TagMap);
  }
};

// soda-player/node_modules/music-metadata/lib/asf/AsfTagMapper.js
var asfTagMap = {
  Title: "title",
  Author: "artist",
  "WM/AlbumArtist": "albumartist",
  "WM/AlbumTitle": "album",
  "WM/Year": "date",
  // changed to 'year' to 'date' based on Picard mappings; ToDo: check me
  "WM/OriginalReleaseTime": "originaldate",
  "WM/OriginalReleaseYear": "originalyear",
  Description: "comment",
  "WM/TrackNumber": "track",
  "WM/PartOfSet": "disk",
  "WM/Genre": "genre",
  "WM/Composer": "composer",
  "WM/Lyrics": "lyrics",
  "WM/AlbumSortOrder": "albumsort",
  "WM/TitleSortOrder": "titlesort",
  "WM/ArtistSortOrder": "artistsort",
  "WM/AlbumArtistSortOrder": "albumartistsort",
  "WM/ComposerSortOrder": "composersort",
  "WM/Writer": "lyricist",
  "WM/Conductor": "conductor",
  "WM/ModifiedBy": "remixer",
  "WM/Engineer": "engineer",
  "WM/Producer": "producer",
  "WM/DJMixer": "djmixer",
  "WM/Mixer": "mixer",
  "WM/Publisher": "label",
  "WM/ContentGroupDescription": "grouping",
  "WM/SubTitle": "subtitle",
  "WM/SetSubTitle": "discsubtitle",
  // 'WM/PartOfSet': 'totaldiscs',
  "WM/IsCompilation": "compilation",
  "WM/SharedUserRating": "rating",
  POPULARIMETER: "rating",
  "WM/BeatsPerMinute": "bpm",
  "WM/Mood": "mood",
  "WM/Media": "media",
  "WM/CatalogNo": "catalognumber",
  "MusicBrainz/Album Status": "releasestatus",
  "MusicBrainz/Album Type": "releasetype",
  "MusicBrainz/Album Release Country": "releasecountry",
  "WM/Script": "script",
  "WM/Language": "language",
  Copyright: "copyright",
  LICENSE: "license",
  "WM/EncodedBy": "encodedby",
  "WM/EncodingSettings": "encodersettings",
  "WM/Barcode": "barcode",
  "WM/ISRC": "isrc",
  "MusicBrainz/Track Id": "musicbrainz_recordingid",
  "MusicBrainz/Release Track Id": "musicbrainz_trackid",
  "MusicBrainz/Album Id": "musicbrainz_albumid",
  "MusicBrainz/Artist Id": "musicbrainz_artistid",
  "MusicBrainz/Album Artist Id": "musicbrainz_albumartistid",
  "MusicBrainz/Release Group Id": "musicbrainz_releasegroupid",
  "MusicBrainz/Work Id": "musicbrainz_workid",
  "MusicBrainz/TRM Id": "musicbrainz_trmid",
  "MusicBrainz/Disc Id": "musicbrainz_discid",
  "Acoustid/Id": "acoustid_id",
  "Acoustid/Fingerprint": "acoustid_fingerprint",
  "MusicIP/PUID": "musicip_puid",
  "WM/ARTISTS": "artists",
  "WM/InitialKey": "key",
  ASIN: "asin",
  "WM/Work": "work",
  "WM/AuthorURL": "website",
  "WM/Picture": "picture"
};
var AsfTagMapper = class _AsfTagMapper extends CommonTagMapper {
  static toRating(rating) {
    const value = typeof rating === "number" ? rating : Number.parseFloat(rating);
    if (!Number.isFinite(value) || value <= 0) {
      return { rating: void 0 };
    }
    return { rating: value / 99 };
  }
  constructor() {
    super(["asf"], asfTagMap);
  }
  postMap(tag, warnings) {
    switch (tag.id) {
      case "POPULARIMETER": {
        const [email, rating] = tag.value.split("|");
        const value = Number(rating);
        const valid = /^\d+$/.test(rating) && Number.isInteger(value) && value >= 0 && value <= 255;
        if (!valid) {
          warnings.addWarning(`Invalid ASF POPULARIMETER rating: ${rating}`);
        }
        tag.value = {
          source: email,
          rating: valid && value > 0 ? (value - 1) / 254 * CommonTagMapper.maxRatingScore : void 0
        };
        break;
      }
      case "WM/SharedUserRating": {
        const keys = tag.id.split(":");
        tag.value = _AsfTagMapper.toRating(tag.value);
        tag.id = keys[0];
        break;
      }
    }
  }
};

// soda-player/node_modules/music-metadata/lib/id3v1/ID3v1TagMap.js
var id3v1TagMap = {
  title: "title",
  artist: "artist",
  album: "album",
  year: "year",
  comment: "comment",
  track: "track",
  genre: "genre"
};
var ID3v1TagMapper = class extends CommonTagMapper {
  constructor() {
    super(["ID3v1"], id3v1TagMap);
  }
};

// soda-player/node_modules/music-metadata/lib/id3v2/ID3v22TagMapper.js
var id3v22TagMap = {
  TT2: "title",
  TP1: "artist",
  TP2: "albumartist",
  TAL: "album",
  TYE: "year",
  COM: "comment",
  TRK: "track",
  TPA: "disk",
  TCO: "genre",
  PIC: "picture",
  TCM: "composer",
  TOR: "originaldate",
  TOT: "originalalbum",
  TXT: "lyricist",
  TP3: "conductor",
  TPB: "label",
  TT1: "grouping",
  TT3: "subtitle",
  TLA: "language",
  TCR: "copyright",
  WCP: "license",
  TEN: "encodedby",
  TSS: "encodersettings",
  WAR: "website",
  PCS: "podcast",
  TCP: "compilation",
  TDR: "date",
  TS2: "albumartistsort",
  TSA: "albumsort",
  TSC: "composersort",
  TSP: "artistsort",
  TST: "titlesort",
  WFD: "podcasturl",
  TBP: "bpm",
  GP1: "grouping"
};
var ID3v22TagMapper = class extends CaseInsensitiveTagMap {
  constructor() {
    super(["ID3v2.2"], id3v22TagMap);
  }
};

// soda-player/node_modules/music-metadata/lib/id3v2/ID3v24TagMapper.js
init_lib3();
init_Util();
var id3v24TagMap = {
  // id3v2.3
  TIT2: "title",
  TPE1: "artist",
  "TXXX:Artists": "artists",
  TPE2: "albumartist",
  TALB: "album",
  TDRV: "date",
  // [ 'date', 'year' ] ToDo: improve 'year' mapping
  /**
   * Original release year
   */
  TORY: "originalyear",
  TPOS: "disk",
  TCON: "genre",
  APIC: "picture",
  TCOM: "composer",
  USLT: "lyrics",
  TSOA: "albumsort",
  TSOT: "titlesort",
  TOAL: "originalalbum",
  TSOP: "artistsort",
  TSO2: "albumartistsort",
  TSOC: "composersort",
  TEXT: "lyricist",
  "TXXX:Writer": "writer",
  TPE3: "conductor",
  // 'IPLS:instrument': 'performer:instrument', // ToDo
  TPE4: "remixer",
  "IPLS:arranger": "arranger",
  "IPLS:engineer": "engineer",
  "IPLS:producer": "producer",
  "IPLS:DJ-mix": "djmixer",
  "IPLS:mix": "mixer",
  TPUB: "label",
  TIT1: "grouping",
  TIT3: "subtitle",
  TRCK: "track",
  TCMP: "compilation",
  POPM: "rating",
  TBPM: "bpm",
  TMED: "media",
  "TXXX:CATALOGNUMBER": "catalognumber",
  "TXXX:MusicBrainz Album Status": "releasestatus",
  "TXXX:MusicBrainz Album Type": "releasetype",
  /**
   * Release country as documented: https://picard.musicbrainz.org/docs/mappings/#cite_note-0
   */
  "TXXX:MusicBrainz Album Release Country": "releasecountry",
  /**
   * Release country as implemented // ToDo: report
   */
  "TXXX:RELEASECOUNTRY": "releasecountry",
  "TXXX:SCRIPT": "script",
  TLAN: "language",
  TCOP: "copyright",
  WCOP: "license",
  TENC: "encodedby",
  TSSE: "encodersettings",
  "TXXX:BARCODE": "barcode",
  "TXXX:ISRC": "isrc",
  TSRC: "isrc",
  "TXXX:ASIN": "asin",
  "TXXX:originalyear": "originalyear",
  "UFID:http://musicbrainz.org": "musicbrainz_recordingid",
  "TXXX:MusicBrainz Release Track Id": "musicbrainz_trackid",
  "TXXX:MusicBrainz Album Id": "musicbrainz_albumid",
  "TXXX:MusicBrainz Artist Id": "musicbrainz_artistid",
  "TXXX:MusicBrainz Album Artist Id": "musicbrainz_albumartistid",
  "TXXX:MusicBrainz Release Group Id": "musicbrainz_releasegroupid",
  "TXXX:MusicBrainz Work Id": "musicbrainz_workid",
  "TXXX:MusicBrainz TRM Id": "musicbrainz_trmid",
  "TXXX:MusicBrainz Disc Id": "musicbrainz_discid",
  "TXXX:ACOUSTID_ID": "acoustid_id",
  "TXXX:Acoustid Id": "acoustid_id",
  "TXXX:Acoustid Fingerprint": "acoustid_fingerprint",
  "TXXX:MusicIP PUID": "musicip_puid",
  "TXXX:MusicMagic Fingerprint": "musicip_fingerprint",
  WOAR: "website",
  // id3v2.4
  // ToDo: In same sequence as defined at http://id3.org/id3v2.4.0-frames
  TDRC: "date",
  // date YYYY-MM-DD
  TYER: "year",
  TDOR: "originaldate",
  // 'TMCL:instrument': 'performer:instrument',
  "TIPL:arranger": "arranger",
  "TIPL:engineer": "engineer",
  "TIPL:producer": "producer",
  "TIPL:DJ-mix": "djmixer",
  "TIPL:mix": "mixer",
  TMOO: "mood",
  // additional mappings:
  SYLT: "lyrics",
  TSST: "discsubtitle",
  TKEY: "key",
  COMM: "comment",
  TOPE: "originalartist",
  // Windows Media Player
  "PRIV:AverageLevel": "averageLevel",
  "PRIV:PeakLevel": "peakLevel",
  // Discogs
  "TXXX:DISCOGS_ARTIST_ID": "discogs_artist_id",
  "TXXX:DISCOGS_ARTISTS": "artists",
  "TXXX:DISCOGS_ARTIST_NAME": "artists",
  "TXXX:DISCOGS_ALBUM_ARTISTS": "albumartist",
  "TXXX:DISCOGS_CATALOG": "catalognumber",
  "TXXX:DISCOGS_COUNTRY": "releasecountry",
  "TXXX:DISCOGS_DATE": "originaldate",
  "TXXX:DISCOGS_LABEL": "label",
  "TXXX:DISCOGS_LABEL_ID": "discogs_label_id",
  "TXXX:DISCOGS_MASTER_RELEASE_ID": "discogs_master_release_id",
  "TXXX:DISCOGS_RATING": "discogs_rating",
  "TXXX:DISCOGS_RELEASED": "date",
  "TXXX:DISCOGS_RELEASE_ID": "discogs_release_id",
  "TXXX:DISCOGS_VOTES": "discogs_votes",
  "TXXX:CATALOGID": "catalognumber",
  "TXXX:STYLE": "genre",
  "TXXX:REPLAYGAIN_TRACK_PEAK": "replaygain_track_peak",
  "TXXX:REPLAYGAIN_TRACK_GAIN": "replaygain_track_gain",
  "TXXX:REPLAYGAIN_ALBUM_PEAK": "replaygain_album_peak",
  "TXXX:REPLAYGAIN_ALBUM_GAIN": "replaygain_album_gain",
  "TXXX:MP3GAIN_MINMAX": "replaygain_track_minmax",
  "TXXX:MP3GAIN_ALBUM_MINMAX": "replaygain_album_minmax",
  "TXXX:MP3GAIN_UNDO": "replaygain_undo",
  MVNM: "movement",
  MVIN: "movementIndex",
  PCST: "podcast",
  TCAT: "category",
  TDES: "description",
  TDRL: "releasedate",
  TGID: "podcastId",
  TKWD: "keywords",
  WFED: "podcasturl",
  GRP1: "grouping",
  PCNT: "playCounter"
};
var ID3v24TagMapper = class _ID3v24TagMapper extends CaseInsensitiveTagMap {
  static toRating(popm) {
    return {
      source: popm.email,
      rating: popm.rating > 0 ? (popm.rating - 1) / 254 * CommonTagMapper.maxRatingScore : void 0
    };
  }
  constructor() {
    super(["ID3v2.3", "ID3v2.4"], id3v24TagMap);
  }
  /**
   * Handle post mapping exceptions / correction
   * @param tag to post map
   * @param warnings Wil be used to register (collect) warnings
   */
  postMap(tag, warnings) {
    switch (tag.id) {
      case "UFID":
        {
          const idTag = tag.value;
          if (idTag.owner_identifier === "http://musicbrainz.org") {
            tag.id += `:${idTag.owner_identifier}`;
            tag.value = decodeString(idTag.identifier, "latin1");
          }
        }
        break;
      case "PRIV":
        {
          const customTag = tag.value;
          switch (customTag.owner_identifier) {
            // decode Windows Media Player
            case "AverageLevel":
            case "PeakValue":
              tag.id += `:${customTag.owner_identifier}`;
              tag.value = customTag.data.length === 4 ? UINT32_LE.get(customTag.data, 0) : null;
              if (tag.value === null) {
                warnings.addWarning("Failed to parse PRIV:PeakValue");
              }
              break;
            default:
              warnings.addWarning(`Unknown PRIV owner-identifier: ${customTag.data}`);
          }
        }
        break;
      case "POPM":
        tag.value = _ID3v24TagMapper.toRating(tag.value);
        break;
      default:
        break;
    }
  }
};

// soda-player/node_modules/music-metadata/lib/matroska/MatroskaTagMapper.js
var ebmlTagMap = {
  "segment:title": "title",
  "album:ARTIST": "albumartist",
  "album:ARTISTSORT": "albumartistsort",
  "album:TITLE": "album",
  "album:DATE_RECORDED": "originaldate",
  "album:DATE_RELEASED": "releasedate",
  "album:PART_NUMBER": "disk",
  "album:TOTAL_PARTS": "totaltracks",
  "track:ARTIST": "artist",
  "track:ARTISTSORT": "artistsort",
  "track:TITLE": "title",
  "track:PART_NUMBER": "track",
  "track:MUSICBRAINZ_TRACKID": "musicbrainz_recordingid",
  "track:MUSICBRAINZ_ALBUMID": "musicbrainz_albumid",
  "track:MUSICBRAINZ_ARTISTID": "musicbrainz_artistid",
  "track:PUBLISHER": "label",
  "track:GENRE": "genre",
  "track:ENCODER": "encodedby",
  "track:ENCODER_OPTIONS": "encodersettings",
  "edition:TOTAL_PARTS": "totaldiscs",
  picture: "picture"
};
var MatroskaTagMapper = class extends CaseInsensitiveTagMap {
  constructor() {
    super(["matroska"], ebmlTagMap);
  }
};

// soda-player/node_modules/music-metadata/lib/mp4/MP4TagMapper.js
var mp4TagMap = {
  "\xA9nam": "title",
  "\xA9ART": "artist",
  aART: "albumartist",
  /**
   * ToDo: Album artist seems to be stored here while Picard documentation says: aART
   */
  "----:com.apple.iTunes:Band": "albumartist",
  "\xA9alb": "album",
  "\xA9day": "date",
  "\xA9cmt": "comment",
  "\xA9com": "comment",
  trkn: "track",
  disk: "disk",
  "\xA9gen": "genre",
  covr: "picture",
  "\xA9wrt": "composer",
  "\xA9lyr": "lyrics",
  soal: "albumsort",
  sonm: "titlesort",
  soar: "artistsort",
  soaa: "albumartistsort",
  soco: "composersort",
  "----:com.apple.iTunes:LYRICIST": "lyricist",
  "----:com.apple.iTunes:CONDUCTOR": "conductor",
  "----:com.apple.iTunes:REMIXER": "remixer",
  "----:com.apple.iTunes:ENGINEER": "engineer",
  "----:com.apple.iTunes:PRODUCER": "producer",
  "----:com.apple.iTunes:DJMIXER": "djmixer",
  "----:com.apple.iTunes:MIXER": "mixer",
  "----:com.apple.iTunes:LABEL": "label",
  "\xA9grp": "grouping",
  "----:com.apple.iTunes:SUBTITLE": "subtitle",
  "----:com.apple.iTunes:DISCSUBTITLE": "discsubtitle",
  cpil: "compilation",
  tmpo: "bpm",
  "----:com.apple.iTunes:MOOD": "mood",
  "----:com.apple.iTunes:MEDIA": "media",
  "----:com.apple.iTunes:CATALOGNUMBER": "catalognumber",
  tvsh: "tvShow",
  tvsn: "tvSeason",
  tves: "tvEpisode",
  sosn: "tvShowSort",
  tven: "tvEpisodeId",
  tvnn: "tvNetwork",
  pcst: "podcast",
  purl: "podcasturl",
  "----:com.apple.iTunes:MusicBrainz Album Status": "releasestatus",
  "----:com.apple.iTunes:MusicBrainz Album Type": "releasetype",
  "----:com.apple.iTunes:MusicBrainz Album Release Country": "releasecountry",
  "----:com.apple.iTunes:SCRIPT": "script",
  "----:com.apple.iTunes:LANGUAGE": "language",
  cprt: "copyright",
  "\xA9cpy": "copyright",
  "----:com.apple.iTunes:LICENSE": "license",
  "\xA9too": "encodedby",
  pgap: "gapless",
  "----:com.apple.iTunes:BARCODE": "barcode",
  "----:com.apple.iTunes:ISRC": "isrc",
  "----:com.apple.iTunes:ASIN": "asin",
  "----:com.apple.iTunes:NOTES": "comment",
  "----:com.apple.iTunes:MusicBrainz Track Id": "musicbrainz_recordingid",
  "----:com.apple.iTunes:MusicBrainz Release Track Id": "musicbrainz_trackid",
  "----:com.apple.iTunes:MusicBrainz Album Id": "musicbrainz_albumid",
  "----:com.apple.iTunes:MusicBrainz Artist Id": "musicbrainz_artistid",
  "----:com.apple.iTunes:MusicBrainz Album Artist Id": "musicbrainz_albumartistid",
  "----:com.apple.iTunes:MusicBrainz Release Group Id": "musicbrainz_releasegroupid",
  "----:com.apple.iTunes:MusicBrainz Work Id": "musicbrainz_workid",
  "----:com.apple.iTunes:MusicBrainz TRM Id": "musicbrainz_trmid",
  "----:com.apple.iTunes:MusicBrainz Disc Id": "musicbrainz_discid",
  "----:com.apple.iTunes:Acoustid Id": "acoustid_id",
  "----:com.apple.iTunes:Acoustid Fingerprint": "acoustid_fingerprint",
  "----:com.apple.iTunes:MusicIP PUID": "musicip_puid",
  "----:com.apple.iTunes:fingerprint": "musicip_fingerprint",
  "----:com.apple.iTunes:replaygain_track_gain": "replaygain_track_gain",
  "----:com.apple.iTunes:replaygain_track_peak": "replaygain_track_peak",
  "----:com.apple.iTunes:replaygain_album_gain": "replaygain_album_gain",
  "----:com.apple.iTunes:replaygain_album_peak": "replaygain_album_peak",
  "----:com.apple.iTunes:replaygain_track_minmax": "replaygain_track_minmax",
  "----:com.apple.iTunes:replaygain_album_minmax": "replaygain_album_minmax",
  "----:com.apple.iTunes:replaygain_undo": "replaygain_undo",
  // Additional mappings:
  gnre: "genre",
  // ToDo: check mapping
  "----:com.apple.iTunes:ALBUMARTISTSORT": "albumartistsort",
  "----:com.apple.iTunes:ARTISTS": "artists",
  "----:com.apple.iTunes:ORIGINALDATE": "originaldate",
  "----:com.apple.iTunes:ORIGINALYEAR": "originalyear",
  "----:com.apple.iTunes:RELEASEDATE": "releasedate",
  // '----:com.apple.iTunes:PERFORMER': 'performer'
  desc: "description",
  ldes: "longDescription",
  "\xA9mvn": "movement",
  "\xA9mvi": "movementIndex",
  "\xA9mvc": "movementTotal",
  "\xA9wrk": "work",
  catg: "category",
  egid: "podcastId",
  hdvd: "hdVideo",
  keyw: "keywords",
  shwm: "showMovement",
  stik: "stik",
  rate: "rating"
};
var tagType = "iTunes";
var MP4TagMapper = class extends CaseInsensitiveTagMap {
  constructor() {
    super([tagType], mp4TagMap);
  }
  postMap(tag, _warnings) {
    switch (tag.id) {
      case "rate":
        tag.value = {
          source: void 0,
          rating: Number.parseFloat(tag.value) / 100
        };
        break;
    }
  }
};

// soda-player/node_modules/music-metadata/lib/ogg/vorbis/VorbisTagMapper.js
var vorbisTagMap = {
  TITLE: "title",
  ARTIST: "artist",
  ARTISTS: "artists",
  ALBUMARTIST: "albumartist",
  "ALBUM ARTIST": "albumartist",
  ALBUM: "album",
  DATE: "date",
  ORIGINALDATE: "originaldate",
  ORIGINALYEAR: "originalyear",
  RELEASEDATE: "releasedate",
  COMMENT: "comment",
  DESCRIPTION: "comment",
  TRACKNUMBER: "track",
  DISCNUMBER: "disk",
  GENRE: "genre",
  METADATA_BLOCK_PICTURE: "picture",
  COMPOSER: "composer",
  LYRICS: "lyrics",
  UNSYNCEDLYRICS: "lyrics",
  ALBUMSORT: "albumsort",
  TITLESORT: "titlesort",
  WORK: "work",
  ARTISTSORT: "artistsort",
  ALBUMARTISTSORT: "albumartistsort",
  COMPOSERSORT: "composersort",
  LYRICIST: "lyricist",
  WRITER: "writer",
  CONDUCTOR: "conductor",
  // 'PERFORMER=artist (instrument)': 'performer:instrument', // ToDo
  REMIXER: "remixer",
  ARRANGER: "arranger",
  ENGINEER: "engineer",
  PRODUCER: "producer",
  DJMIXER: "djmixer",
  MIXER: "mixer",
  LABEL: "label",
  ORGANIZATION: "label",
  PUBLISHER: "label",
  GROUPING: "grouping",
  SUBTITLE: "subtitle",
  DISCSUBTITLE: "discsubtitle",
  TRACKTOTAL: "totaltracks",
  DISCTOTAL: "totaldiscs",
  COMPILATION: "compilation",
  RATING: "rating",
  BPM: "bpm",
  KEY: "key",
  MOOD: "mood",
  MEDIA: "media",
  CATALOGNUMBER: "catalognumber",
  RELEASESTATUS: "releasestatus",
  RELEASETYPE: "releasetype",
  RELEASECOUNTRY: "releasecountry",
  SCRIPT: "script",
  LANGUAGE: "language",
  COPYRIGHT: "copyright",
  LICENSE: "license",
  ENCODEDBY: "encodedby",
  ENCODERSETTINGS: "encodersettings",
  BARCODE: "barcode",
  ISRC: "isrc",
  ASIN: "asin",
  MUSICBRAINZ_TRACKID: "musicbrainz_recordingid",
  MUSICBRAINZ_RELEASETRACKID: "musicbrainz_trackid",
  MUSICBRAINZ_ALBUMID: "musicbrainz_albumid",
  MUSICBRAINZ_ARTISTID: "musicbrainz_artistid",
  MUSICBRAINZ_ALBUMARTISTID: "musicbrainz_albumartistid",
  MUSICBRAINZ_RELEASEGROUPID: "musicbrainz_releasegroupid",
  MUSICBRAINZ_WORKID: "musicbrainz_workid",
  MUSICBRAINZ_TRMID: "musicbrainz_trmid",
  MUSICBRAINZ_DISCID: "musicbrainz_discid",
  ACOUSTID_ID: "acoustid_id",
  ACOUSTID_ID_FINGERPRINT: "acoustid_fingerprint",
  MUSICIP_PUID: "musicip_puid",
  // 'FINGERPRINT=MusicMagic Fingerprint {fingerprint}': 'musicip_fingerprint', // ToDo
  WEBSITE: "website",
  NOTES: "notes",
  TOTALTRACKS: "totaltracks",
  TOTALDISCS: "totaldiscs",
  // Discogs
  DISCOGS_ARTIST_ID: "discogs_artist_id",
  DISCOGS_ARTISTS: "artists",
  DISCOGS_ARTIST_NAME: "artists",
  DISCOGS_ALBUM_ARTISTS: "albumartist",
  DISCOGS_CATALOG: "catalognumber",
  DISCOGS_COUNTRY: "releasecountry",
  DISCOGS_DATE: "originaldate",
  DISCOGS_LABEL: "label",
  DISCOGS_LABEL_ID: "discogs_label_id",
  DISCOGS_MASTER_RELEASE_ID: "discogs_master_release_id",
  DISCOGS_RATING: "discogs_rating",
  DISCOGS_RELEASED: "date",
  DISCOGS_RELEASE_ID: "discogs_release_id",
  DISCOGS_VOTES: "discogs_votes",
  CATALOGID: "catalognumber",
  STYLE: "genre",
  //
  REPLAYGAIN_TRACK_GAIN: "replaygain_track_gain",
  REPLAYGAIN_TRACK_PEAK: "replaygain_track_peak",
  REPLAYGAIN_ALBUM_GAIN: "replaygain_album_gain",
  REPLAYGAIN_ALBUM_PEAK: "replaygain_album_peak",
  // To Sure if these (REPLAYGAIN_MINMAX, REPLAYGAIN_ALBUM_MINMAX & REPLAYGAIN_UNDO) are used for Vorbis:
  REPLAYGAIN_MINMAX: "replaygain_track_minmax",
  REPLAYGAIN_ALBUM_MINMAX: "replaygain_album_minmax",
  REPLAYGAIN_UNDO: "replaygain_undo"
};
var VorbisTagMapper = class _VorbisTagMapper extends CommonTagMapper {
  static toRating(email, rating, maxScore) {
    return {
      source: email ? email.toLowerCase() : void 0,
      rating: Number.parseFloat(rating) / maxScore * CommonTagMapper.maxRatingScore
    };
  }
  constructor() {
    super(["vorbis"], vorbisTagMap);
  }
  postMap(tag) {
    if (tag.id === "RATING") {
      tag.value = _VorbisTagMapper.toRating(void 0, tag.value, 100);
    } else if (tag.id.indexOf("RATING:") === 0) {
      const keys = tag.id.split(":");
      tag.value = _VorbisTagMapper.toRating(keys[1], tag.value, 1);
      tag.id = keys[0];
    }
  }
};

// soda-player/node_modules/music-metadata/lib/common/CombinedTagMapper.js
init_ParseError();

// soda-player/node_modules/music-metadata/lib/riff/RiffInfoTagMap.js
var riffInfoTagMap = {
  IART: "artist",
  // Artist
  ICRD: "date",
  // DateCreated
  INAM: "title",
  // Title
  TITL: "title",
  IPRD: "album",
  // Product
  ITRK: "track",
  IPRT: "track",
  // Additional tag for track index
  COMM: "comment",
  // Comments
  ICMT: "comment",
  // Country
  ICNT: "releasecountry",
  GNRE: "genre",
  // Genre
  IWRI: "writer",
  // WrittenBy
  RATE: "rating",
  YEAR: "year",
  ISFT: "encodedby",
  // Software
  CODE: "encodedby",
  // EncodedBy
  TURL: "website",
  // URL,
  IGNR: "genre",
  // Genre
  IENG: "engineer",
  // Engineer
  ITCH: "technician",
  // Technician
  IMED: "media",
  // Original Media
  IRPD: "album"
  // Product, where the file was intended for
};
var RiffInfoTagMapper = class extends CommonTagMapper {
  constructor() {
    super(["exif"], riffInfoTagMap);
  }
};

// soda-player/node_modules/music-metadata/lib/common/CombinedTagMapper.js
var CombinedTagMapper = class {
  tagMappers = {};
  constructor() {
    [
      new ID3v1TagMapper(),
      new ID3v22TagMapper(),
      new ID3v24TagMapper(),
      new MP4TagMapper(),
      new MP4TagMapper(),
      new VorbisTagMapper(),
      new APEv2TagMapper(),
      new AsfTagMapper(),
      new RiffInfoTagMapper(),
      new MatroskaTagMapper(),
      new AiffTagMapper()
    ].forEach((mapper) => {
      this.registerTagMapper(mapper);
    });
  }
  /**
   * Convert native to generic (common) tags
   * @param tagType Originating tag format
   * @param tag     Native tag to map to a generic tag id
   * @param warnings
   * @return Generic tag result (output of this function)
   */
  mapTag(tagType2, tag, warnings) {
    const tagMapper = this.tagMappers[tagType2];
    if (tagMapper) {
      return this.tagMappers[tagType2].mapGenericTag(tag, warnings);
    }
    throw new InternalParserError(`No generic tag mapper defined for tag-format: ${tagType2}`);
  }
  registerTagMapper(genericTagMapper) {
    for (const tagType2 of genericTagMapper.tagTypes) {
      this.tagMappers[tagType2] = genericTagMapper;
    }
  }
};

// soda-player/node_modules/music-metadata/lib/common/GenericTagTypes.js
var defaultTagInfo = {
  multiple: false
};
var commonTags = {
  year: defaultTagInfo,
  track: defaultTagInfo,
  disk: defaultTagInfo,
  title: defaultTagInfo,
  artist: defaultTagInfo,
  artists: { multiple: true, unique: true },
  albumartist: defaultTagInfo,
  albumartists: { multiple: true, unique: true },
  album: defaultTagInfo,
  date: defaultTagInfo,
  originaldate: defaultTagInfo,
  originalyear: defaultTagInfo,
  releasedate: defaultTagInfo,
  comment: { multiple: true, unique: false },
  genre: { multiple: true, unique: true },
  picture: { multiple: true, unique: true },
  composer: { multiple: true, unique: true },
  lyrics: { multiple: true, unique: false },
  albumsort: { multiple: false, unique: true },
  titlesort: { multiple: false, unique: true },
  work: { multiple: false, unique: true },
  artistsort: { multiple: false, unique: true },
  albumartistsort: { multiple: false, unique: true },
  composersort: { multiple: false, unique: true },
  lyricist: { multiple: true, unique: true },
  writer: { multiple: true, unique: true },
  conductor: { multiple: true, unique: true },
  remixer: { multiple: true, unique: true },
  arranger: { multiple: true, unique: true },
  engineer: { multiple: true, unique: true },
  producer: { multiple: true, unique: true },
  technician: { multiple: true, unique: true },
  djmixer: { multiple: true, unique: true },
  mixer: { multiple: true, unique: true },
  label: { multiple: true, unique: true },
  grouping: defaultTagInfo,
  subtitle: { multiple: true },
  discsubtitle: defaultTagInfo,
  totaltracks: defaultTagInfo,
  totaldiscs: defaultTagInfo,
  compilation: defaultTagInfo,
  rating: { multiple: true },
  bpm: defaultTagInfo,
  mood: defaultTagInfo,
  media: defaultTagInfo,
  catalognumber: { multiple: true, unique: true },
  tvShow: defaultTagInfo,
  tvShowSort: defaultTagInfo,
  tvSeason: defaultTagInfo,
  tvEpisode: defaultTagInfo,
  tvEpisodeId: defaultTagInfo,
  tvNetwork: defaultTagInfo,
  podcast: defaultTagInfo,
  podcasturl: defaultTagInfo,
  releasestatus: defaultTagInfo,
  releasetype: { multiple: true },
  releasecountry: defaultTagInfo,
  script: defaultTagInfo,
  language: defaultTagInfo,
  copyright: defaultTagInfo,
  license: defaultTagInfo,
  encodedby: defaultTagInfo,
  encodersettings: defaultTagInfo,
  gapless: defaultTagInfo,
  barcode: defaultTagInfo,
  isrc: { multiple: true },
  asin: defaultTagInfo,
  musicbrainz_recordingid: defaultTagInfo,
  musicbrainz_trackid: defaultTagInfo,
  musicbrainz_albumid: defaultTagInfo,
  musicbrainz_artistid: { multiple: true },
  musicbrainz_albumartistid: { multiple: true },
  musicbrainz_releasegroupid: defaultTagInfo,
  musicbrainz_workid: defaultTagInfo,
  musicbrainz_trmid: defaultTagInfo,
  musicbrainz_discid: defaultTagInfo,
  acoustid_id: defaultTagInfo,
  acoustid_fingerprint: defaultTagInfo,
  musicip_puid: defaultTagInfo,
  musicip_fingerprint: defaultTagInfo,
  website: defaultTagInfo,
  "performer:instrument": { multiple: true, unique: true },
  averageLevel: defaultTagInfo,
  peakLevel: defaultTagInfo,
  notes: { multiple: true, unique: false },
  key: defaultTagInfo,
  originalalbum: defaultTagInfo,
  originalartist: defaultTagInfo,
  discogs_artist_id: { multiple: true, unique: true },
  discogs_release_id: defaultTagInfo,
  discogs_label_id: defaultTagInfo,
  discogs_master_release_id: defaultTagInfo,
  discogs_votes: defaultTagInfo,
  discogs_rating: defaultTagInfo,
  replaygain_track_peak: defaultTagInfo,
  replaygain_track_gain: defaultTagInfo,
  replaygain_album_peak: defaultTagInfo,
  replaygain_album_gain: defaultTagInfo,
  replaygain_track_minmax: defaultTagInfo,
  replaygain_album_minmax: defaultTagInfo,
  replaygain_undo: defaultTagInfo,
  description: { multiple: true },
  longDescription: defaultTagInfo,
  category: { multiple: true },
  hdVideo: defaultTagInfo,
  keywords: { multiple: true },
  movement: defaultTagInfo,
  movementIndex: defaultTagInfo,
  movementTotal: defaultTagInfo,
  podcastId: defaultTagInfo,
  showMovement: defaultTagInfo,
  stik: defaultTagInfo,
  playCounter: defaultTagInfo
};
function isSingleton(alias) {
  return commonTags[alias] && !commonTags[alias].multiple;
}
function isUnique(alias) {
  return !commonTags[alias].multiple || commonTags[alias].unique || false;
}

// soda-player/node_modules/music-metadata/lib/common/MetadataCollector.js
init_Util();
var debug7 = (0, import_debug7.default)("music-metadata:collector");
var TagPriority = [
  "matroska",
  "APEv2",
  "vorbis",
  "ID3v2.4",
  "ID3v2.3",
  "ID3v2.2",
  "exif",
  "asf",
  "iTunes",
  "AIFF",
  "ID3v1"
];
var MetadataCollector = class {
  format = {
    tagTypes: [],
    trackInfo: []
  };
  native = {};
  common = {
    track: { no: null, of: null },
    disk: { no: null, of: null },
    movementIndex: { no: null, of: null }
  };
  quality = {
    warnings: []
  };
  /**
   * Keeps track of origin priority for each mapped id
   */
  commonOrigin = {};
  /**
   * Maps a tag type to a priority
   */
  originPriority = {};
  tagMapper = new CombinedTagMapper();
  opts;
  constructor(opts) {
    this.opts = opts;
    let priority = 1;
    for (const tagType2 of TagPriority) {
      this.originPriority[tagType2] = priority++;
    }
    this.originPriority.artificial = 500;
    this.originPriority.id3v1 = 600;
  }
  /**
   * @returns {boolean} true if one or more tags have been found
   */
  hasAny() {
    return Object.keys(this.native).length > 0;
  }
  addStreamInfo(streamInfo) {
    debug7(`streamInfo: type=${streamInfo.type ? TrackTypeValueToKeyMap[streamInfo.type] : "?"}, codec=${streamInfo.codecName}`);
    this.format.trackInfo.push(streamInfo);
  }
  setFormat(key, value) {
    debug7(`format: ${key} = ${value}`);
    this.format[key] = value;
    if (this.opts?.observer) {
      this.opts.observer({ metadata: this, tag: { type: "format", id: key, value } });
    }
  }
  setAudioOnly() {
    this.setFormat("hasAudio", true);
    this.setFormat("hasVideo", false);
  }
  registerTagType(tagType2) {
    if (!this.format.tagTypes.includes(tagType2)) {
      this.format.tagTypes.push(tagType2);
    }
  }
  async addTag(tagType2, tagId, value) {
    debug7(`tag ${tagType2}.${tagId} = ${value}`);
    if (!this.native[tagType2]) {
      this.registerTagType(tagType2);
      this.native[tagType2] = [];
    }
    this.native[tagType2].push({ id: tagId, value });
    await this.toCommon(tagType2, tagId, value);
  }
  addWarning(warning) {
    this.quality.warnings.push({ message: warning });
  }
  async postMap(tagType2, tag) {
    switch (tag.id) {
      case "artist":
        return this.handleSingularArtistTag(tagType2, tag, "artist", "artists");
      case "albumartist":
        return this.handleSingularArtistTag(tagType2, tag, "albumartist", "albumartists");
      case "artists":
        return this.handlePluralArtistTag(tagType2, tag, "artist", "artists");
      case "albumartists":
        return this.handlePluralArtistTag(tagType2, tag, "albumartist", "albumartists");
      case "picture":
        return this.postFixPicture(tag.value).then((picture) => {
          if (picture !== null) {
            tag.value = picture;
            this.setGenericTag(tagType2, tag);
          }
        });
      case "totaltracks":
        this.common.track.of = CommonTagMapper.toIntOrNull(tag.value);
        this.notifyCommonTag({ id: "track", value: { ...this.common.track } });
        return;
      case "totaldiscs":
        this.common.disk.of = CommonTagMapper.toIntOrNull(tag.value);
        this.notifyCommonTag({ id: "disk", value: { ...this.common.disk } });
        return;
      case "movementTotal":
        this.common.movementIndex.of = CommonTagMapper.toIntOrNull(tag.value);
        this.notifyCommonTag({ id: "movementIndex", value: { ...this.common.movementIndex } });
        return;
      case "track":
      case "disk":
      case "movementIndex": {
        const of = this.common[tag.id].of;
        this.common[tag.id] = CommonTagMapper.normalizeTrack(tag.value);
        this.common[tag.id].of = of != null ? of : this.common[tag.id].of;
        this.notifyCommonTag({ id: tag.id, value: { ...this.common[tag.id] } });
        return;
      }
      case "bpm":
      case "year":
      case "originalyear":
        tag.value = Number.parseInt(tag.value, 10);
        break;
      case "date": {
        const year = Number.parseInt(tag.value.substr(0, 4), 10);
        if (!Number.isNaN(year)) {
          this.common.year = year;
        }
        break;
      }
      case "discogs_label_id":
      case "discogs_release_id":
      case "discogs_master_release_id":
      case "discogs_artist_id":
      case "discogs_votes":
        tag.value = typeof tag.value === "string" ? Number.parseInt(tag.value, 10) : tag.value;
        break;
      case "replaygain_track_gain":
      case "replaygain_track_peak":
      case "replaygain_album_gain":
      case "replaygain_album_peak":
        tag.value = toRatio(tag.value);
        break;
      case "replaygain_track_minmax":
        tag.value = tag.value.split(",").map((v) => Number.parseInt(v, 10));
        break;
      case "replaygain_undo": {
        const minMix = tag.value.split(",").map((v) => Number.parseInt(v, 10));
        tag.value = {
          leftChannel: minMix[0],
          rightChannel: minMix[1]
        };
        break;
      }
      case "gapless":
      // iTunes gap-less flag
      case "compilation":
      case "podcast":
      case "showMovement":
        tag.value = tag.value === "1" || tag.value === 1;
        break;
      case "isrc": {
        const commonTag = this.common[tag.id];
        if (commonTag && commonTag.indexOf(tag.value) !== -1) {
          return;
        }
        break;
      }
      case "comment":
        if (typeof tag.value === "string") {
          tag.value = { text: tag.value };
        }
        if (tag.value.descriptor === "iTunPGAP") {
          this.setGenericTag(tagType2, { id: "gapless", value: tag.value.text === "1" });
        }
        break;
      case "lyrics":
        if (typeof tag.value === "string") {
          tag.value = parseLyrics(tag.value);
        }
        break;
      default:
    }
    if (tag.value !== null) {
      this.setGenericTag(tagType2, tag);
    }
  }
  /**
   * Convert native tags to common tags
   * @returns {IAudioMetadata} Native + common tags
   */
  toCommonMetadata() {
    return {
      format: this.format,
      native: this.native,
      quality: this.quality,
      common: this.common
    };
  }
  /**
   * Handle singular artist tags (artist, albumartist) and cross-populate to plural form
   */
  handleSingularArtistTag(tagType2, tag, singularId, pluralId) {
    if (this.commonOrigin[singularId] === this.originPriority[tagType2]) {
      return this.postMap("artificial", { id: pluralId, value: tag.value });
    }
    if (!this.common[pluralId]) {
      this.setGenericTag("artificial", { id: pluralId, value: tag.value });
    }
    this.setGenericTag(tagType2, tag);
  }
  /**
   * Handle plural artist tags (artists, albumartists) and cross-populate to singular form
   */
  handlePluralArtistTag(tagType2, tag, singularId, pluralId) {
    if (!this.common[singularId] || this.commonOrigin[singularId] === this.originPriority.artificial) {
      if (!this.common[pluralId] || this.common[pluralId].indexOf(tag.value) === -1) {
        const values = (this.common[pluralId] || []).concat([tag.value]);
        const value = joinArtists(values);
        this.setGenericTag("artificial", { id: singularId, value });
      }
    }
    this.setGenericTag(tagType2, tag);
  }
  /**
   * Fix some common issues with picture object
   * @param picture Picture
   */
  async postFixPicture(picture) {
    if (picture.data && picture.data.length > 0) {
      if (!picture.format) {
        const fileType = await fileTypeFromBuffer(Uint8Array.from(picture.data));
        if (fileType) {
          picture.format = fileType.mime;
        } else {
          return null;
        }
      }
      picture.format = picture.format.toLocaleLowerCase();
      switch (picture.format) {
        case "image/jpg":
          picture.format = "image/jpeg";
      }
      return picture;
    }
    this.addWarning("Empty picture tag found");
    return null;
  }
  /**
   * Convert native tag to common tags
   */
  async toCommon(tagType2, tagId, value) {
    const tag = { id: tagId, value };
    const genericTag = this.tagMapper.mapTag(tagType2, tag, this);
    if (genericTag) {
      await this.postMap(tagType2, genericTag);
    }
  }
  /**
   * Set generic tag
   */
  setGenericTag(tagType2, tag) {
    debug7(`common.${tag.id} = ${tag.value}`);
    const prio0 = this.commonOrigin[tag.id] || 1e3;
    const prio1 = this.originPriority[tagType2];
    if (isSingleton(tag.id)) {
      if (prio1 <= prio0) {
        this.common[tag.id] = tag.value;
        this.commonOrigin[tag.id] = prio1;
      } else {
        return debug7(`Ignore native tag (singleton): ${tagType2}.${tag.id} = ${tag.value}`);
      }
    } else {
      if (prio1 === prio0) {
        if (!isUnique(tag.id) || this.common[tag.id].indexOf(tag.value) === -1) {
          this.common[tag.id].push(tag.value);
        } else {
          return debug7(`Ignore duplicate value: ${tagType2}.${tag.id} = ${tag.value}`);
        }
      } else if (prio1 < prio0) {
        this.common[tag.id] = [tag.value];
        this.commonOrigin[tag.id] = prio1;
      } else {
        return debug7(`Ignore native tag (list): ${tagType2}.${tag.id} = ${tag.value}`);
      }
    }
    this.notifyCommonTag(tag);
  }
  notifyCommonTag(tag) {
    if (this.opts?.observer) {
      this.opts.observer({ metadata: this, tag: { type: "common", id: tag.id, value: tag.value } });
    }
  }
};
function joinArtists(artists) {
  if (artists.length > 2) {
    return `${artists.slice(0, artists.length - 1).join(", ")} & ${artists[artists.length - 1]}`;
  }
  return artists.join(" & ");
}

// soda-player/node_modules/music-metadata/lib/dsdiff/DsdiffLoader.js
var dsdiffParserLoader = {
  parserType: "dsdiff",
  extensions: [".dff"],
  mimeTypes: ["audio/dsf", "audio/dsd"],
  async load() {
    return (await Promise.resolve().then(() => (init_DsdiffParser(), DsdiffParser_exports))).DsdiffParser;
  }
};

// soda-player/node_modules/music-metadata/lib/dsf/DsfLoader.js
var dsfParserLoader = {
  parserType: "dsf",
  extensions: [".dsf"],
  mimeTypes: ["audio/dsf"],
  async load() {
    return (await Promise.resolve().then(() => (init_DsfParser(), DsfParser_exports))).DsfParser;
  }
};

// soda-player/node_modules/music-metadata/lib/flac/FlacLoader.js
var flacParserLoader = {
  parserType: "flac",
  extensions: [".flac"],
  mimeTypes: ["audio/flac"],
  async load() {
    return (await Promise.resolve().then(() => (init_FlacParser(), FlacParser_exports))).FlacParser;
  }
};

// soda-player/node_modules/music-metadata/lib/matroska/MatroskaLoader.js
var matroskaParserLoader = {
  parserType: "matroska",
  extensions: [".mka", ".mkv", ".mk3d", ".mks", "webm"],
  mimeTypes: ["audio/matroska", "video/matroska", "audio/webm", "video/webm"],
  async load() {
    return (await Promise.resolve().then(() => (init_MatroskaParser(), MatroskaParser_exports))).MatroskaParser;
  }
};

// soda-player/node_modules/music-metadata/lib/mp4/Mp4Loader.js
var mp4ParserLoader = {
  parserType: "mp4",
  extensions: [".mp4", ".m4a", ".m4b", ".m4pa", "m4v", "m4r", "3gp", ".mov", ".movie", ".qt"],
  mimeTypes: ["audio/mp4", "audio/m4a", "video/m4v", "video/mp4", "video/quicktime"],
  async load() {
    return (await Promise.resolve().then(() => (init_MP4Parser(), MP4Parser_exports))).MP4Parser;
  }
};

// soda-player/node_modules/music-metadata/lib/mpeg/MpegLoader.js
var mpegParserLoader = {
  parserType: "mpeg",
  extensions: [".mp1", ".mp2", ".mp3", ".m2a", ".aac", "aacp"],
  mimeTypes: ["audio/mpeg", "audio/mp3", "audio/aacs", "audio/aacp"],
  async load() {
    return (await Promise.resolve().then(() => (init_MpegParser(), MpegParser_exports))).MpegParser;
  }
};

// soda-player/node_modules/music-metadata/lib/musepack/MusepackLoader.js
var musepackParserLoader = {
  parserType: "musepack",
  extensions: [".mpc"],
  mimeTypes: ["audio/musepack"],
  async load() {
    return (await Promise.resolve().then(() => (init_MusepackParser(), MusepackParser_exports))).MusepackParser;
  }
};

// soda-player/node_modules/music-metadata/lib/ogg/OggLoader.js
var oggParserLoader = {
  parserType: "ogg",
  extensions: [".ogg", ".ogv", ".oga", ".ogm", ".ogx", ".opus", ".spx"],
  mimeTypes: ["audio/ogg", "audio/opus", "audio/speex", "video/ogg"],
  // RFC 7845, RFC 6716, RFC 5574
  async load() {
    return (await Promise.resolve().then(() => (init_OggParser(), OggParser_exports))).OggParser;
  }
};

// soda-player/node_modules/music-metadata/lib/ParserFactory.js
init_ParseError();
init_type();

// soda-player/node_modules/music-metadata/lib/wav/WaveLoader.js
var riffParserLoader = {
  parserType: "riff",
  extensions: [".wav", "wave", ".bwf"],
  mimeTypes: ["audio/vnd.wave", "audio/wav", "audio/wave"],
  async load() {
    return (await Promise.resolve().then(() => (init_WaveParser(), WaveParser_exports))).WaveParser;
  }
};

// soda-player/node_modules/music-metadata/lib/wavpack/WavPackLoader.js
var wavpackParserLoader = {
  parserType: "wavpack",
  extensions: [".wv", ".wvp"],
  mimeTypes: ["audio/wavpack"],
  async load() {
    return (await Promise.resolve().then(() => (init_WavPackParser(), WavPackParser_exports))).WavPackParser;
  }
};

// soda-player/node_modules/music-metadata/lib/ParserFactory.js
var debug29 = (0, import_debug29.default)("music-metadata:parser:factory");
function parseHttpContentType(contentType) {
  const type = parse(contentType);
  const mime = parse2(type.type);
  return {
    type: mime.type,
    subtype: mime.subtype,
    suffix: mime.suffix,
    parameters: type.parameters
  };
}
var ParserFactory = class {
  parsers = [];
  constructor() {
    [
      flacParserLoader,
      mpegParserLoader,
      apeParserLoader,
      mp4ParserLoader,
      matroskaParserLoader,
      riffParserLoader,
      oggParserLoader,
      asfParserLoader,
      aiffParserLoader,
      wavpackParserLoader,
      musepackParserLoader,
      dsfParserLoader,
      dsdiffParserLoader
    ].forEach((parser) => {
      this.registerParser(parser);
    });
  }
  registerParser(parser) {
    this.parsers.push(parser);
  }
  async parse(tokenizer, parserLoader, opts = {}) {
    if (tokenizer.supportsRandomAccess()) {
      debug29("tokenizer supports random-access, scanning for appending headers");
      await scanAppendingHeaders(tokenizer, opts);
    } else {
      debug29("tokenizer does not support random-access, cannot scan for appending headers");
    }
    if (!parserLoader) {
      const buf = new Uint8Array(4100);
      if (tokenizer.fileInfo.mimeType) {
        parserLoader = this.findLoaderForContentType(tokenizer.fileInfo.mimeType);
      }
      if (!parserLoader && tokenizer.fileInfo.path) {
        parserLoader = this.findLoaderForExtension(tokenizer.fileInfo.path);
      }
      if (!parserLoader) {
        debug29("Guess parser on content...");
        await tokenizer.peekBuffer(buf, { mayBeLess: true });
        const guessedType = await fileTypeFromBuffer(buf, { mpegOffsetTolerance: 10 });
        if (!guessedType?.mime) {
          throw new CouldNotDetermineFileTypeError("Failed to determine audio format");
        }
        debug29(`Guessed file type is mime=${guessedType.mime}, extension=${guessedType.ext}`);
        parserLoader = this.findLoaderForContentType(guessedType.mime);
        if (!parserLoader) {
          throw new UnsupportedFileTypeError(`Guessed MIME-type not supported: ${guessedType.mime}`);
        }
      }
    }
    debug29(`Loading ${parserLoader.parserType} parser...`);
    const metadata = new MetadataCollector(opts);
    const ParserImpl = await parserLoader.load();
    const parser = new ParserImpl(metadata, tokenizer, opts ?? {});
    debug29(`Parser ${parserLoader.parserType} loaded`);
    await parser.parse();
    if (metadata.format.trackInfo) {
      if (metadata.format.hasAudio === void 0) {
        metadata.setFormat("hasAudio", !!metadata.format.trackInfo.find((track) => track.type === TrackType.audio));
      }
      if (metadata.format.hasVideo === void 0) {
        metadata.setFormat("hasVideo", !!metadata.format.trackInfo.find((track) => track.type === TrackType.video));
      }
    }
    return metadata.toCommonMetadata();
  }
  /**
   * @param filePath - Path, filename or extension to audio file
   * @return Parser submodule name
   */
  findLoaderForExtension(filePath) {
    if (!filePath) {
      return;
    }
    const extension = getExtension(filePath).toLocaleLowerCase() || filePath;
    return this.parsers.find((parser) => parser.extensions.indexOf(extension) !== -1);
  }
  findLoaderForContentType(httpContentType) {
    let mime;
    if (!httpContentType) {
      return;
    }
    try {
      mime = parseHttpContentType(httpContentType);
    } catch (_err) {
      debug29(`Invalid HTTP Content-Type header value: ${httpContentType}`);
      return;
    }
    const subType = mime.subtype.indexOf("x-") === 0 ? mime.subtype.substring(2) : mime.subtype;
    return this.parsers.find((parser) => parser.mimeTypes.find((loader) => loader.indexOf(`${mime.type}/${subType}`) !== -1));
  }
  getSupportedMimeTypes() {
    const mimeTypeSet = /* @__PURE__ */ new Set();
    this.parsers.forEach((loader) => {
      loader.mimeTypes.forEach((mimeType) => {
        mimeTypeSet.add(mimeType);
        mimeTypeSet.add(mimeType.replace("/", "/x-"));
      });
    });
    return Array.from(mimeTypeSet);
  }
};
function getExtension(fname) {
  const i = fname.lastIndexOf(".");
  return i === -1 ? "" : fname.substring(i);
}

// soda-player/node_modules/music-metadata/lib/core.js
init_ParseError();
init_ParseError();
async function scanAppendingHeaders(tokenizer, options = {}) {
  let apeOffset = tokenizer.fileInfo.size;
  if (await hasID3v1Header(tokenizer)) {
    apeOffset -= 128;
    const lyricsLen = await getLyricsHeaderLength(tokenizer);
    apeOffset -= lyricsLen;
  }
  options.apeHeader = await APEv2Parser.findApeFooterOffset(tokenizer, apeOffset);
}

// soda-player/node_modules/music-metadata/lib/index.js
var debug30 = (0, import_debug30.default)("music-metadata:parser");
async function parseFile(filePath, options = {}) {
  debug30(`parseFile: ${filePath}`);
  const fileTokenizer = await fromFile(filePath);
  const parserFactory = new ParserFactory();
  try {
    const parserLoader = parserFactory.findLoaderForExtension(filePath);
    if (!parserLoader) {
      debug30("Parser could not be determined by file extension");
    }
    try {
      return await parserFactory.parse(fileTokenizer, parserLoader, options);
    } catch (error) {
      if (error instanceof CouldNotDetermineFileTypeError || error instanceof UnsupportedFileTypeError) {
        error.message += `: ${filePath}`;
      }
      throw error;
    }
  } finally {
    await fileTokenizer.close();
  }
}

// soda-player/local-media.mjs
var import_apple_library = __toESM(require_apple_library(), 1);
var normalize = (s) => String(s || "").normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
function textTag(text) {
  if (!text || !/[\u0080-\u00ff]/.test(text) || [...text].some((c) => c.charCodeAt(0) > 255)) return text || "";
  try {
    return new TextDecoder("gb18030", { fatal: true }).decode(Buffer.from(text, "latin1"));
  } catch {
    return text;
  }
}
var entries = [];
var rootKey = "";
var lastScan = 0;
async function scan(roots) {
  const key = roots.join("|");
  if (key === rootKey && Date.now() - lastScan < 3e5) return;
  rootKey = key;
  lastScan = Date.now();
  const files = [], visited = /* @__PURE__ */ new Set();
  function walk(dir, depth) {
    if (depth > 4 || files.length >= 1e4) return;
    let items;
    try {
      const real = import_node_fs.default.realpathSync(dir);
      if (visited.has(real)) return;
      visited.add(real);
      items = import_node_fs.default.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const item of items) {
      if (item.isSymbolicLink()) continue;
      const file = import_node_path.default.join(dir, item.name);
      if (item.isDirectory()) walk(file, depth + 1);
      else if (/\.(mp3|flac|m4a|aac|ogg|opus|wav|aiff|ape)$/i.test(item.name)) files.push(file);
      if (files.length >= 1e4) break;
    }
  }
  roots.forEach((root) => walk(root, 0));
  const next = [];
  for (const file of files) {
    try {
      const metadata = await parseFile(file, { skipCovers: true, duration: false });
      next.push({ file, title: textTag(metadata.common.title), artist: textTag(metadata.common.artist), duration: metadata.format.duration || 0 });
    } catch {
    }
  }
  entries = next;
}
async function readLocal(state) {
  const roots = (state.mediaRoots || []).filter(Boolean);
  if (!roots.length || !state.title || !state.artist) return { cover: "" };
  const title = normalize(state.title), artist = normalize(state.artist);
  let available;
  if (/applemusic/i.test(state.sourceName || state.source)) {
    const library = (0, import_apple_library.libraryTracks)(roots);
    available = library.tracks;
    if (library.error && !available.length) return { cover: "", cacheError: library.error };
  } else {
    await scan(roots);
    available = entries;
  }
  const matches = available.filter((e) => normalize(e.title) === title && (normalize(e.artist) === artist || /applemusic/i.test(state.sourceName || state.source) && normalize(e.artist + " \u2014 " + e.album) === artist) && (!state.duration || !e.duration || Math.abs(e.duration - state.duration) < 4));
  if (matches.length !== 1) return { cover: "" };
  try {
    const metadata = await parseFile(matches[0].file);
    const picture = metadata.common.picture?.find((p) => p.type === "Cover (front)") || metadata.common.picture?.[0];
    const details = { localFile: matches[0].file, canonicalArtist: matches[0].artist, album: matches[0].album || "" };
    if (!picture || picture.data.length > 4e6) return { cover: "", ...details };
    return { cover: "data:" + picture.format + ";base64," + Buffer.from(picture.data).toString("base64"), ...details };
  } catch {
    return { cover: "" };
  }
}
async function readExact(file) {
  try {
    const metadata = await parseFile(file, { duration: false });
    const picture = metadata.common.picture?.find((p) => p.type === "Cover (front)") || metadata.common.picture?.[0];
    return { cover: picture && picture.data.length <= 4e6 ? "data:" + picture.format + ";base64," + Buffer.from(picture.data).toString("base64") : "", localFile: file };
  } catch {
    return { cover: "", localFile: file };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  readExact,
  readLocal
});
/*! Bundled license information:

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

content-type/dist/index.js:
  (*!
   * content-type
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/
