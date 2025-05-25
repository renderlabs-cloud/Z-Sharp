#!/usr/bin/node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
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

// node_modules/module-alias/index.js
var require_module_alias = __commonJS({
  "node_modules/module-alias/index.js"(exports2, module2) {
    "use strict";
    var BuiltinModule = require("module");
    var Module = module2.constructor.length > 1 ? module2.constructor : BuiltinModule;
    var nodePath = require("path");
    var modulePaths = [];
    var moduleAliases = {};
    var moduleAliasNames = [];
    var oldNodeModulePaths = Module._nodeModulePaths;
    Module._nodeModulePaths = function(from) {
      var paths = oldNodeModulePaths.call(this, from);
      if (from.indexOf("node_modules") === -1) {
        paths = modulePaths.concat(paths);
      }
      return paths;
    };
    var oldResolveFilename = Module._resolveFilename;
    Module._resolveFilename = function(request, parentModule, isMain, options2) {
      for (var i = moduleAliasNames.length; i-- > 0; ) {
        var alias = moduleAliasNames[i];
        if (isPathMatchesAlias(request, alias)) {
          var aliasTarget = moduleAliases[alias];
          if (typeof moduleAliases[alias] === "function") {
            var fromPath = parentModule.filename;
            aliasTarget = moduleAliases[alias](fromPath, request, alias);
            if (!aliasTarget || typeof aliasTarget !== "string") {
              throw new Error("[module-alias] Expecting custom handler function to return path.");
            }
          }
          request = nodePath.join(aliasTarget, request.substr(alias.length));
          break;
        }
      }
      return oldResolveFilename.call(this, request, parentModule, isMain, options2);
    };
    function isPathMatchesAlias(path2, alias) {
      if (path2.indexOf(alias) === 0) {
        if (path2.length === alias.length) return true;
        if (path2[alias.length] === "/") return true;
      }
      return false;
    }
    function addPathHelper(path2, targetArray) {
      path2 = nodePath.normalize(path2);
      if (targetArray && targetArray.indexOf(path2) === -1) {
        targetArray.unshift(path2);
      }
    }
    function removePathHelper(path2, targetArray) {
      if (targetArray) {
        var index = targetArray.indexOf(path2);
        if (index !== -1) {
          targetArray.splice(index, 1);
        }
      }
    }
    function addPath(path2) {
      var parent;
      path2 = nodePath.normalize(path2);
      if (modulePaths.indexOf(path2) === -1) {
        modulePaths.push(path2);
        var mainModule = getMainModule();
        if (mainModule) {
          addPathHelper(path2, mainModule.paths);
        }
        parent = module2.parent;
        while (parent && parent !== mainModule) {
          addPathHelper(path2, parent.paths);
          parent = parent.parent;
        }
      }
    }
    function addAliases(aliases) {
      for (var alias in aliases) {
        addAlias(alias, aliases[alias]);
      }
    }
    function addAlias(alias, target) {
      moduleAliases[alias] = target;
      moduleAliasNames = Object.keys(moduleAliases);
      moduleAliasNames.sort();
    }
    function reset() {
      var mainModule = getMainModule();
      modulePaths.forEach(function(path2) {
        if (mainModule) {
          removePathHelper(path2, mainModule.paths);
        }
        Object.getOwnPropertyNames(require.cache).forEach(function(name) {
          if (name.indexOf(path2) !== -1) {
            delete require.cache[name];
          }
        });
        var parent = module2.parent;
        while (parent && parent !== mainModule) {
          removePathHelper(path2, parent.paths);
          parent = parent.parent;
        }
      });
      modulePaths = [];
      moduleAliases = {};
      moduleAliasNames = [];
    }
    function init(options2) {
      if (typeof options2 === "string") {
        options2 = { base: options2 };
      }
      options2 = options2 || {};
      var candidatePackagePaths;
      if (options2.base) {
        candidatePackagePaths = [nodePath.resolve(options2.base.replace(/\/package\.json$/, ""))];
      } else {
        candidatePackagePaths = [nodePath.join(__dirname, "../.."), process.cwd()];
      }
      var npmPackage;
      var base;
      for (var i in candidatePackagePaths) {
        try {
          base = candidatePackagePaths[i];
          npmPackage = require(nodePath.join(base, "package.json"));
          break;
        } catch (e) {
        }
      }
      if (typeof npmPackage !== "object") {
        var pathString = candidatePackagePaths.join(",\n");
        throw new Error("Unable to find package.json in any of:\n[" + pathString + "]");
      }
      var aliases = npmPackage._moduleAliases || {};
      for (var alias in aliases) {
        if (aliases[alias][0] !== "/") {
          aliases[alias] = nodePath.join(base, aliases[alias]);
        }
      }
      addAliases(aliases);
      if (npmPackage._moduleDirectories instanceof Array) {
        npmPackage._moduleDirectories.forEach(function(dir) {
          if (dir === "node_modules") return;
          var modulePath = nodePath.join(base, dir);
          addPath(modulePath);
        });
      }
    }
    function getMainModule() {
      return require.main._simulateRepl ? void 0 : require.main;
    }
    module2.exports = init;
    module2.exports.addPath = addPath;
    module2.exports.addAlias = addAlias;
    module2.exports.addAliases = addAliases;
    module2.exports.isPathMatchesAlias = isPathMatchesAlias;
    module2.exports.reset = reset;
  }
});

// node_modules/module-alias/register.js
var require_register = __commonJS({
  "node_modules/module-alias/register.js"() {
    require_module_alias()();
  }
});

// node_modules/commander/lib/error.js
var require_error = __commonJS({
  "node_modules/commander/lib/error.js"(exports2) {
    var CommanderError = class extends Error {
      /**
       * Constructs the CommanderError class
       * @param {number} exitCode suggested exit code which could be used with process.exit
       * @param {string} code an id string representing the error
       * @param {string} message human-readable description of the error
       */
      constructor(exitCode, code, message) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.code = code;
        this.exitCode = exitCode;
        this.nestedError = void 0;
      }
    };
    var InvalidArgumentError = class extends CommanderError {
      /**
       * Constructs the InvalidArgumentError class
       * @param {string} [message] explanation of why argument is invalid
       */
      constructor(message) {
        super(1, "commander.invalidArgument", message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
      }
    };
    exports2.CommanderError = CommanderError;
    exports2.InvalidArgumentError = InvalidArgumentError;
  }
});

// node_modules/commander/lib/argument.js
var require_argument = __commonJS({
  "node_modules/commander/lib/argument.js"(exports2) {
    var { InvalidArgumentError } = require_error();
    var Argument = class {
      /**
       * Initialize a new command argument with the given name and description.
       * The default is that the argument is required, and you can explicitly
       * indicate this with <> around the name. Put [] around the name for an optional argument.
       *
       * @param {string} name
       * @param {string} [description]
       */
      constructor(name, description) {
        this.description = description || "";
        this.variadic = false;
        this.parseArg = void 0;
        this.defaultValue = void 0;
        this.defaultValueDescription = void 0;
        this.argChoices = void 0;
        switch (name[0]) {
          case "<":
            this.required = true;
            this._name = name.slice(1, -1);
            break;
          case "[":
            this.required = false;
            this._name = name.slice(1, -1);
            break;
          default:
            this.required = true;
            this._name = name;
            break;
        }
        if (this._name.length > 3 && this._name.slice(-3) === "...") {
          this.variadic = true;
          this._name = this._name.slice(0, -3);
        }
      }
      /**
       * Return argument name.
       *
       * @return {string}
       */
      name() {
        return this._name;
      }
      /**
       * @package
       */
      _concatValue(value, previous) {
        if (previous === this.defaultValue || !Array.isArray(previous)) {
          return [value];
        }
        return previous.concat(value);
      }
      /**
       * Set the default value, and optionally supply the description to be displayed in the help.
       *
       * @param {*} value
       * @param {string} [description]
       * @return {Argument}
       */
      default(value, description) {
        this.defaultValue = value;
        this.defaultValueDescription = description;
        return this;
      }
      /**
       * Set the custom handler for processing CLI command arguments into argument values.
       *
       * @param {Function} [fn]
       * @return {Argument}
       */
      argParser(fn) {
        this.parseArg = fn;
        return this;
      }
      /**
       * Only allow argument value to be one of choices.
       *
       * @param {string[]} values
       * @return {Argument}
       */
      choices(values) {
        this.argChoices = values.slice();
        this.parseArg = (arg, previous) => {
          if (!this.argChoices.includes(arg)) {
            throw new InvalidArgumentError(
              `Allowed choices are ${this.argChoices.join(", ")}.`
            );
          }
          if (this.variadic) {
            return this._concatValue(arg, previous);
          }
          return arg;
        };
        return this;
      }
      /**
       * Make argument required.
       *
       * @returns {Argument}
       */
      argRequired() {
        this.required = true;
        return this;
      }
      /**
       * Make argument optional.
       *
       * @returns {Argument}
       */
      argOptional() {
        this.required = false;
        return this;
      }
    };
    function humanReadableArgName(arg) {
      const nameOutput = arg.name() + (arg.variadic === true ? "..." : "");
      return arg.required ? "<" + nameOutput + ">" : "[" + nameOutput + "]";
    }
    exports2.Argument = Argument;
    exports2.humanReadableArgName = humanReadableArgName;
  }
});

// node_modules/commander/lib/help.js
var require_help = __commonJS({
  "node_modules/commander/lib/help.js"(exports2) {
    var { humanReadableArgName } = require_argument();
    var Help = class {
      constructor() {
        this.helpWidth = void 0;
        this.minWidthToWrap = 40;
        this.sortSubcommands = false;
        this.sortOptions = false;
        this.showGlobalOptions = false;
      }
      /**
       * prepareContext is called by Commander after applying overrides from `Command.configureHelp()`
       * and just before calling `formatHelp()`.
       *
       * Commander just uses the helpWidth and the rest is provided for optional use by more complex subclasses.
       *
       * @param {{ error?: boolean, helpWidth?: number, outputHasColors?: boolean }} contextOptions
       */
      prepareContext(contextOptions) {
        this.helpWidth = this.helpWidth ?? contextOptions.helpWidth ?? 80;
      }
      /**
       * Get an array of the visible subcommands. Includes a placeholder for the implicit help command, if there is one.
       *
       * @param {Command} cmd
       * @returns {Command[]}
       */
      visibleCommands(cmd) {
        const visibleCommands = cmd.commands.filter((cmd2) => !cmd2._hidden);
        const helpCommand = cmd._getHelpCommand();
        if (helpCommand && !helpCommand._hidden) {
          visibleCommands.push(helpCommand);
        }
        if (this.sortSubcommands) {
          visibleCommands.sort((a, b) => {
            return a.name().localeCompare(b.name());
          });
        }
        return visibleCommands;
      }
      /**
       * Compare options for sort.
       *
       * @param {Option} a
       * @param {Option} b
       * @returns {number}
       */
      compareOptions(a, b) {
        const getSortKey = (option) => {
          return option.short ? option.short.replace(/^-/, "") : option.long.replace(/^--/, "");
        };
        return getSortKey(a).localeCompare(getSortKey(b));
      }
      /**
       * Get an array of the visible options. Includes a placeholder for the implicit help option, if there is one.
       *
       * @param {Command} cmd
       * @returns {Option[]}
       */
      visibleOptions(cmd) {
        const visibleOptions = cmd.options.filter((option) => !option.hidden);
        const helpOption = cmd._getHelpOption();
        if (helpOption && !helpOption.hidden) {
          const removeShort = helpOption.short && cmd._findOption(helpOption.short);
          const removeLong = helpOption.long && cmd._findOption(helpOption.long);
          if (!removeShort && !removeLong) {
            visibleOptions.push(helpOption);
          } else if (helpOption.long && !removeLong) {
            visibleOptions.push(
              cmd.createOption(helpOption.long, helpOption.description)
            );
          } else if (helpOption.short && !removeShort) {
            visibleOptions.push(
              cmd.createOption(helpOption.short, helpOption.description)
            );
          }
        }
        if (this.sortOptions) {
          visibleOptions.sort(this.compareOptions);
        }
        return visibleOptions;
      }
      /**
       * Get an array of the visible global options. (Not including help.)
       *
       * @param {Command} cmd
       * @returns {Option[]}
       */
      visibleGlobalOptions(cmd) {
        if (!this.showGlobalOptions) return [];
        const globalOptions = [];
        for (let ancestorCmd = cmd.parent; ancestorCmd; ancestorCmd = ancestorCmd.parent) {
          const visibleOptions = ancestorCmd.options.filter(
            (option) => !option.hidden
          );
          globalOptions.push(...visibleOptions);
        }
        if (this.sortOptions) {
          globalOptions.sort(this.compareOptions);
        }
        return globalOptions;
      }
      /**
       * Get an array of the arguments if any have a description.
       *
       * @param {Command} cmd
       * @returns {Argument[]}
       */
      visibleArguments(cmd) {
        if (cmd._argsDescription) {
          cmd.registeredArguments.forEach((argument) => {
            argument.description = argument.description || cmd._argsDescription[argument.name()] || "";
          });
        }
        if (cmd.registeredArguments.find((argument) => argument.description)) {
          return cmd.registeredArguments;
        }
        return [];
      }
      /**
       * Get the command term to show in the list of subcommands.
       *
       * @param {Command} cmd
       * @returns {string}
       */
      subcommandTerm(cmd) {
        const args = cmd.registeredArguments.map((arg) => humanReadableArgName(arg)).join(" ");
        return cmd._name + (cmd._aliases[0] ? "|" + cmd._aliases[0] : "") + (cmd.options.length ? " [options]" : "") + // simplistic check for non-help option
        (args ? " " + args : "");
      }
      /**
       * Get the option term to show in the list of options.
       *
       * @param {Option} option
       * @returns {string}
       */
      optionTerm(option) {
        return option.flags;
      }
      /**
       * Get the argument term to show in the list of arguments.
       *
       * @param {Argument} argument
       * @returns {string}
       */
      argumentTerm(argument) {
        return argument.name();
      }
      /**
       * Get the longest command term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      longestSubcommandTermLength(cmd, helper) {
        return helper.visibleCommands(cmd).reduce((max, command) => {
          return Math.max(
            max,
            this.displayWidth(
              helper.styleSubcommandTerm(helper.subcommandTerm(command))
            )
          );
        }, 0);
      }
      /**
       * Get the longest option term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      longestOptionTermLength(cmd, helper) {
        return helper.visibleOptions(cmd).reduce((max, option) => {
          return Math.max(
            max,
            this.displayWidth(helper.styleOptionTerm(helper.optionTerm(option)))
          );
        }, 0);
      }
      /**
       * Get the longest global option term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      longestGlobalOptionTermLength(cmd, helper) {
        return helper.visibleGlobalOptions(cmd).reduce((max, option) => {
          return Math.max(
            max,
            this.displayWidth(helper.styleOptionTerm(helper.optionTerm(option)))
          );
        }, 0);
      }
      /**
       * Get the longest argument term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      longestArgumentTermLength(cmd, helper) {
        return helper.visibleArguments(cmd).reduce((max, argument) => {
          return Math.max(
            max,
            this.displayWidth(
              helper.styleArgumentTerm(helper.argumentTerm(argument))
            )
          );
        }, 0);
      }
      /**
       * Get the command usage to be displayed at the top of the built-in help.
       *
       * @param {Command} cmd
       * @returns {string}
       */
      commandUsage(cmd) {
        let cmdName = cmd._name;
        if (cmd._aliases[0]) {
          cmdName = cmdName + "|" + cmd._aliases[0];
        }
        let ancestorCmdNames = "";
        for (let ancestorCmd = cmd.parent; ancestorCmd; ancestorCmd = ancestorCmd.parent) {
          ancestorCmdNames = ancestorCmd.name() + " " + ancestorCmdNames;
        }
        return ancestorCmdNames + cmdName + " " + cmd.usage();
      }
      /**
       * Get the description for the command.
       *
       * @param {Command} cmd
       * @returns {string}
       */
      commandDescription(cmd) {
        return cmd.description();
      }
      /**
       * Get the subcommand summary to show in the list of subcommands.
       * (Fallback to description for backwards compatibility.)
       *
       * @param {Command} cmd
       * @returns {string}
       */
      subcommandDescription(cmd) {
        return cmd.summary() || cmd.description();
      }
      /**
       * Get the option description to show in the list of options.
       *
       * @param {Option} option
       * @return {string}
       */
      optionDescription(option) {
        const extraInfo = [];
        if (option.argChoices) {
          extraInfo.push(
            // use stringify to match the display of the default value
            `choices: ${option.argChoices.map((choice) => JSON.stringify(choice)).join(", ")}`
          );
        }
        if (option.defaultValue !== void 0) {
          const showDefault = option.required || option.optional || option.isBoolean() && typeof option.defaultValue === "boolean";
          if (showDefault) {
            extraInfo.push(
              `default: ${option.defaultValueDescription || JSON.stringify(option.defaultValue)}`
            );
          }
        }
        if (option.presetArg !== void 0 && option.optional) {
          extraInfo.push(`preset: ${JSON.stringify(option.presetArg)}`);
        }
        if (option.envVar !== void 0) {
          extraInfo.push(`env: ${option.envVar}`);
        }
        if (extraInfo.length > 0) {
          return `${option.description} (${extraInfo.join(", ")})`;
        }
        return option.description;
      }
      /**
       * Get the argument description to show in the list of arguments.
       *
       * @param {Argument} argument
       * @return {string}
       */
      argumentDescription(argument) {
        const extraInfo = [];
        if (argument.argChoices) {
          extraInfo.push(
            // use stringify to match the display of the default value
            `choices: ${argument.argChoices.map((choice) => JSON.stringify(choice)).join(", ")}`
          );
        }
        if (argument.defaultValue !== void 0) {
          extraInfo.push(
            `default: ${argument.defaultValueDescription || JSON.stringify(argument.defaultValue)}`
          );
        }
        if (extraInfo.length > 0) {
          const extraDescription = `(${extraInfo.join(", ")})`;
          if (argument.description) {
            return `${argument.description} ${extraDescription}`;
          }
          return extraDescription;
        }
        return argument.description;
      }
      /**
       * Generate the built-in help text.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {string}
       */
      formatHelp(cmd, helper) {
        const termWidth = helper.padWidth(cmd, helper);
        const helpWidth = helper.helpWidth ?? 80;
        function callFormatItem(term, description) {
          return helper.formatItem(term, termWidth, description, helper);
        }
        let output = [
          `${helper.styleTitle("Usage:")} ${helper.styleUsage(helper.commandUsage(cmd))}`,
          ""
        ];
        const commandDescription = helper.commandDescription(cmd);
        if (commandDescription.length > 0) {
          output = output.concat([
            helper.boxWrap(
              helper.styleCommandDescription(commandDescription),
              helpWidth
            ),
            ""
          ]);
        }
        const argumentList = helper.visibleArguments(cmd).map((argument) => {
          return callFormatItem(
            helper.styleArgumentTerm(helper.argumentTerm(argument)),
            helper.styleArgumentDescription(helper.argumentDescription(argument))
          );
        });
        if (argumentList.length > 0) {
          output = output.concat([
            helper.styleTitle("Arguments:"),
            ...argumentList,
            ""
          ]);
        }
        const optionList = helper.visibleOptions(cmd).map((option) => {
          return callFormatItem(
            helper.styleOptionTerm(helper.optionTerm(option)),
            helper.styleOptionDescription(helper.optionDescription(option))
          );
        });
        if (optionList.length > 0) {
          output = output.concat([
            helper.styleTitle("Options:"),
            ...optionList,
            ""
          ]);
        }
        if (helper.showGlobalOptions) {
          const globalOptionList = helper.visibleGlobalOptions(cmd).map((option) => {
            return callFormatItem(
              helper.styleOptionTerm(helper.optionTerm(option)),
              helper.styleOptionDescription(helper.optionDescription(option))
            );
          });
          if (globalOptionList.length > 0) {
            output = output.concat([
              helper.styleTitle("Global Options:"),
              ...globalOptionList,
              ""
            ]);
          }
        }
        const commandList = helper.visibleCommands(cmd).map((cmd2) => {
          return callFormatItem(
            helper.styleSubcommandTerm(helper.subcommandTerm(cmd2)),
            helper.styleSubcommandDescription(helper.subcommandDescription(cmd2))
          );
        });
        if (commandList.length > 0) {
          output = output.concat([
            helper.styleTitle("Commands:"),
            ...commandList,
            ""
          ]);
        }
        return output.join("\n");
      }
      /**
       * Return display width of string, ignoring ANSI escape sequences. Used in padding and wrapping calculations.
       *
       * @param {string} str
       * @returns {number}
       */
      displayWidth(str) {
        return stripColor(str).length;
      }
      /**
       * Style the title for displaying in the help. Called with 'Usage:', 'Options:', etc.
       *
       * @param {string} str
       * @returns {string}
       */
      styleTitle(str) {
        return str;
      }
      styleUsage(str) {
        return str.split(" ").map((word) => {
          if (word === "[options]") return this.styleOptionText(word);
          if (word === "[command]") return this.styleSubcommandText(word);
          if (word[0] === "[" || word[0] === "<")
            return this.styleArgumentText(word);
          return this.styleCommandText(word);
        }).join(" ");
      }
      styleCommandDescription(str) {
        return this.styleDescriptionText(str);
      }
      styleOptionDescription(str) {
        return this.styleDescriptionText(str);
      }
      styleSubcommandDescription(str) {
        return this.styleDescriptionText(str);
      }
      styleArgumentDescription(str) {
        return this.styleDescriptionText(str);
      }
      styleDescriptionText(str) {
        return str;
      }
      styleOptionTerm(str) {
        return this.styleOptionText(str);
      }
      styleSubcommandTerm(str) {
        return str.split(" ").map((word) => {
          if (word === "[options]") return this.styleOptionText(word);
          if (word[0] === "[" || word[0] === "<")
            return this.styleArgumentText(word);
          return this.styleSubcommandText(word);
        }).join(" ");
      }
      styleArgumentTerm(str) {
        return this.styleArgumentText(str);
      }
      styleOptionText(str) {
        return str;
      }
      styleArgumentText(str) {
        return str;
      }
      styleSubcommandText(str) {
        return str;
      }
      styleCommandText(str) {
        return str;
      }
      /**
       * Calculate the pad width from the maximum term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      padWidth(cmd, helper) {
        return Math.max(
          helper.longestOptionTermLength(cmd, helper),
          helper.longestGlobalOptionTermLength(cmd, helper),
          helper.longestSubcommandTermLength(cmd, helper),
          helper.longestArgumentTermLength(cmd, helper)
        );
      }
      /**
       * Detect manually wrapped and indented strings by checking for line break followed by whitespace.
       *
       * @param {string} str
       * @returns {boolean}
       */
      preformatted(str) {
        return /\n[^\S\r\n]/.test(str);
      }
      /**
       * Format the "item", which consists of a term and description. Pad the term and wrap the description, indenting the following lines.
       *
       * So "TTT", 5, "DDD DDDD DD DDD" might be formatted for this.helpWidth=17 like so:
       *   TTT  DDD DDDD
       *        DD DDD
       *
       * @param {string} term
       * @param {number} termWidth
       * @param {string} description
       * @param {Help} helper
       * @returns {string}
       */
      formatItem(term, termWidth, description, helper) {
        const itemIndent = 2;
        const itemIndentStr = " ".repeat(itemIndent);
        if (!description) return itemIndentStr + term;
        const paddedTerm = term.padEnd(
          termWidth + term.length - helper.displayWidth(term)
        );
        const spacerWidth = 2;
        const helpWidth = this.helpWidth ?? 80;
        const remainingWidth = helpWidth - termWidth - spacerWidth - itemIndent;
        let formattedDescription;
        if (remainingWidth < this.minWidthToWrap || helper.preformatted(description)) {
          formattedDescription = description;
        } else {
          const wrappedDescription = helper.boxWrap(description, remainingWidth);
          formattedDescription = wrappedDescription.replace(
            /\n/g,
            "\n" + " ".repeat(termWidth + spacerWidth)
          );
        }
        return itemIndentStr + paddedTerm + " ".repeat(spacerWidth) + formattedDescription.replace(/\n/g, `
${itemIndentStr}`);
      }
      /**
       * Wrap a string at whitespace, preserving existing line breaks.
       * Wrapping is skipped if the width is less than `minWidthToWrap`.
       *
       * @param {string} str
       * @param {number} width
       * @returns {string}
       */
      boxWrap(str, width) {
        if (width < this.minWidthToWrap) return str;
        const rawLines = str.split(/\r\n|\n/);
        const chunkPattern = /[\s]*[^\s]+/g;
        const wrappedLines = [];
        rawLines.forEach((line) => {
          const chunks = line.match(chunkPattern);
          if (chunks === null) {
            wrappedLines.push("");
            return;
          }
          let sumChunks = [chunks.shift()];
          let sumWidth = this.displayWidth(sumChunks[0]);
          chunks.forEach((chunk) => {
            const visibleWidth = this.displayWidth(chunk);
            if (sumWidth + visibleWidth <= width) {
              sumChunks.push(chunk);
              sumWidth += visibleWidth;
              return;
            }
            wrappedLines.push(sumChunks.join(""));
            const nextChunk = chunk.trimStart();
            sumChunks = [nextChunk];
            sumWidth = this.displayWidth(nextChunk);
          });
          wrappedLines.push(sumChunks.join(""));
        });
        return wrappedLines.join("\n");
      }
    };
    function stripColor(str) {
      const sgrPattern = /\x1b\[\d*(;\d*)*m/g;
      return str.replace(sgrPattern, "");
    }
    exports2.Help = Help;
    exports2.stripColor = stripColor;
  }
});

// node_modules/commander/lib/option.js
var require_option = __commonJS({
  "node_modules/commander/lib/option.js"(exports2) {
    var { InvalidArgumentError } = require_error();
    var Option = class {
      /**
       * Initialize a new `Option` with the given `flags` and `description`.
       *
       * @param {string} flags
       * @param {string} [description]
       */
      constructor(flags, description) {
        this.flags = flags;
        this.description = description || "";
        this.required = flags.includes("<");
        this.optional = flags.includes("[");
        this.variadic = /\w\.\.\.[>\]]$/.test(flags);
        this.mandatory = false;
        const optionFlags = splitOptionFlags(flags);
        this.short = optionFlags.shortFlag;
        this.long = optionFlags.longFlag;
        this.negate = false;
        if (this.long) {
          this.negate = this.long.startsWith("--no-");
        }
        this.defaultValue = void 0;
        this.defaultValueDescription = void 0;
        this.presetArg = void 0;
        this.envVar = void 0;
        this.parseArg = void 0;
        this.hidden = false;
        this.argChoices = void 0;
        this.conflictsWith = [];
        this.implied = void 0;
      }
      /**
       * Set the default value, and optionally supply the description to be displayed in the help.
       *
       * @param {*} value
       * @param {string} [description]
       * @return {Option}
       */
      default(value, description) {
        this.defaultValue = value;
        this.defaultValueDescription = description;
        return this;
      }
      /**
       * Preset to use when option used without option-argument, especially optional but also boolean and negated.
       * The custom processing (parseArg) is called.
       *
       * @example
       * new Option('--color').default('GREYSCALE').preset('RGB');
       * new Option('--donate [amount]').preset('20').argParser(parseFloat);
       *
       * @param {*} arg
       * @return {Option}
       */
      preset(arg) {
        this.presetArg = arg;
        return this;
      }
      /**
       * Add option name(s) that conflict with this option.
       * An error will be displayed if conflicting options are found during parsing.
       *
       * @example
       * new Option('--rgb').conflicts('cmyk');
       * new Option('--js').conflicts(['ts', 'jsx']);
       *
       * @param {(string | string[])} names
       * @return {Option}
       */
      conflicts(names) {
        this.conflictsWith = this.conflictsWith.concat(names);
        return this;
      }
      /**
       * Specify implied option values for when this option is set and the implied options are not.
       *
       * The custom processing (parseArg) is not called on the implied values.
       *
       * @example
       * program
       *   .addOption(new Option('--log', 'write logging information to file'))
       *   .addOption(new Option('--trace', 'log extra details').implies({ log: 'trace.txt' }));
       *
       * @param {object} impliedOptionValues
       * @return {Option}
       */
      implies(impliedOptionValues) {
        let newImplied = impliedOptionValues;
        if (typeof impliedOptionValues === "string") {
          newImplied = { [impliedOptionValues]: true };
        }
        this.implied = Object.assign(this.implied || {}, newImplied);
        return this;
      }
      /**
       * Set environment variable to check for option value.
       *
       * An environment variable is only used if when processed the current option value is
       * undefined, or the source of the current value is 'default' or 'config' or 'env'.
       *
       * @param {string} name
       * @return {Option}
       */
      env(name) {
        this.envVar = name;
        return this;
      }
      /**
       * Set the custom handler for processing CLI option arguments into option values.
       *
       * @param {Function} [fn]
       * @return {Option}
       */
      argParser(fn) {
        this.parseArg = fn;
        return this;
      }
      /**
       * Whether the option is mandatory and must have a value after parsing.
       *
       * @param {boolean} [mandatory=true]
       * @return {Option}
       */
      makeOptionMandatory(mandatory = true) {
        this.mandatory = !!mandatory;
        return this;
      }
      /**
       * Hide option in help.
       *
       * @param {boolean} [hide=true]
       * @return {Option}
       */
      hideHelp(hide = true) {
        this.hidden = !!hide;
        return this;
      }
      /**
       * @package
       */
      _concatValue(value, previous) {
        if (previous === this.defaultValue || !Array.isArray(previous)) {
          return [value];
        }
        return previous.concat(value);
      }
      /**
       * Only allow option value to be one of choices.
       *
       * @param {string[]} values
       * @return {Option}
       */
      choices(values) {
        this.argChoices = values.slice();
        this.parseArg = (arg, previous) => {
          if (!this.argChoices.includes(arg)) {
            throw new InvalidArgumentError(
              `Allowed choices are ${this.argChoices.join(", ")}.`
            );
          }
          if (this.variadic) {
            return this._concatValue(arg, previous);
          }
          return arg;
        };
        return this;
      }
      /**
       * Return option name.
       *
       * @return {string}
       */
      name() {
        if (this.long) {
          return this.long.replace(/^--/, "");
        }
        return this.short.replace(/^-/, "");
      }
      /**
       * Return option name, in a camelcase format that can be used
       * as an object attribute key.
       *
       * @return {string}
       */
      attributeName() {
        if (this.negate) {
          return camelcase(this.name().replace(/^no-/, ""));
        }
        return camelcase(this.name());
      }
      /**
       * Check if `arg` matches the short or long flag.
       *
       * @param {string} arg
       * @return {boolean}
       * @package
       */
      is(arg) {
        return this.short === arg || this.long === arg;
      }
      /**
       * Return whether a boolean option.
       *
       * Options are one of boolean, negated, required argument, or optional argument.
       *
       * @return {boolean}
       * @package
       */
      isBoolean() {
        return !this.required && !this.optional && !this.negate;
      }
    };
    var DualOptions = class {
      /**
       * @param {Option[]} options
       */
      constructor(options2) {
        this.positiveOptions = /* @__PURE__ */ new Map();
        this.negativeOptions = /* @__PURE__ */ new Map();
        this.dualOptions = /* @__PURE__ */ new Set();
        options2.forEach((option) => {
          if (option.negate) {
            this.negativeOptions.set(option.attributeName(), option);
          } else {
            this.positiveOptions.set(option.attributeName(), option);
          }
        });
        this.negativeOptions.forEach((value, key) => {
          if (this.positiveOptions.has(key)) {
            this.dualOptions.add(key);
          }
        });
      }
      /**
       * Did the value come from the option, and not from possible matching dual option?
       *
       * @param {*} value
       * @param {Option} option
       * @returns {boolean}
       */
      valueFromOption(value, option) {
        const optionKey = option.attributeName();
        if (!this.dualOptions.has(optionKey)) return true;
        const preset = this.negativeOptions.get(optionKey).presetArg;
        const negativeValue = preset !== void 0 ? preset : false;
        return option.negate === (negativeValue === value);
      }
    };
    function camelcase(str) {
      return str.split("-").reduce((str2, word) => {
        return str2 + word[0].toUpperCase() + word.slice(1);
      });
    }
    function splitOptionFlags(flags) {
      let shortFlag;
      let longFlag;
      const shortFlagExp = /^-[^-]$/;
      const longFlagExp = /^--[^-]/;
      const flagParts = flags.split(/[ |,]+/).concat("guard");
      if (shortFlagExp.test(flagParts[0])) shortFlag = flagParts.shift();
      if (longFlagExp.test(flagParts[0])) longFlag = flagParts.shift();
      if (!shortFlag && shortFlagExp.test(flagParts[0]))
        shortFlag = flagParts.shift();
      if (!shortFlag && longFlagExp.test(flagParts[0])) {
        shortFlag = longFlag;
        longFlag = flagParts.shift();
      }
      if (flagParts[0].startsWith("-")) {
        const unsupportedFlag = flagParts[0];
        const baseError = `option creation failed due to '${unsupportedFlag}' in option flags '${flags}'`;
        if (/^-[^-][^-]/.test(unsupportedFlag))
          throw new Error(
            `${baseError}
- a short flag is a single dash and a single character
  - either use a single dash and a single character (for a short flag)
  - or use a double dash for a long option (and can have two, like '--ws, --workspace')`
          );
        if (shortFlagExp.test(unsupportedFlag))
          throw new Error(`${baseError}
- too many short flags`);
        if (longFlagExp.test(unsupportedFlag))
          throw new Error(`${baseError}
- too many long flags`);
        throw new Error(`${baseError}
- unrecognised flag format`);
      }
      if (shortFlag === void 0 && longFlag === void 0)
        throw new Error(
          `option creation failed due to no flags found in '${flags}'.`
        );
      return { shortFlag, longFlag };
    }
    exports2.Option = Option;
    exports2.DualOptions = DualOptions;
  }
});

// node_modules/commander/lib/suggestSimilar.js
var require_suggestSimilar = __commonJS({
  "node_modules/commander/lib/suggestSimilar.js"(exports2) {
    var maxDistance = 3;
    function editDistance(a, b) {
      if (Math.abs(a.length - b.length) > maxDistance)
        return Math.max(a.length, b.length);
      const d = [];
      for (let i = 0; i <= a.length; i++) {
        d[i] = [i];
      }
      for (let j = 0; j <= b.length; j++) {
        d[0][j] = j;
      }
      for (let j = 1; j <= b.length; j++) {
        for (let i = 1; i <= a.length; i++) {
          let cost = 1;
          if (a[i - 1] === b[j - 1]) {
            cost = 0;
          } else {
            cost = 1;
          }
          d[i][j] = Math.min(
            d[i - 1][j] + 1,
            // deletion
            d[i][j - 1] + 1,
            // insertion
            d[i - 1][j - 1] + cost
            // substitution
          );
          if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
            d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
          }
        }
      }
      return d[a.length][b.length];
    }
    function suggestSimilar(word, candidates) {
      if (!candidates || candidates.length === 0) return "";
      candidates = Array.from(new Set(candidates));
      const searchingOptions = word.startsWith("--");
      if (searchingOptions) {
        word = word.slice(2);
        candidates = candidates.map((candidate) => candidate.slice(2));
      }
      let similar = [];
      let bestDistance = maxDistance;
      const minSimilarity = 0.4;
      candidates.forEach((candidate) => {
        if (candidate.length <= 1) return;
        const distance = editDistance(word, candidate);
        const length = Math.max(word.length, candidate.length);
        const similarity = (length - distance) / length;
        if (similarity > minSimilarity) {
          if (distance < bestDistance) {
            bestDistance = distance;
            similar = [candidate];
          } else if (distance === bestDistance) {
            similar.push(candidate);
          }
        }
      });
      similar.sort((a, b) => a.localeCompare(b));
      if (searchingOptions) {
        similar = similar.map((candidate) => `--${candidate}`);
      }
      if (similar.length > 1) {
        return `
(Did you mean one of ${similar.join(", ")}?)`;
      }
      if (similar.length === 1) {
        return `
(Did you mean ${similar[0]}?)`;
      }
      return "";
    }
    exports2.suggestSimilar = suggestSimilar;
  }
});

// node_modules/commander/lib/command.js
var require_command = __commonJS({
  "node_modules/commander/lib/command.js"(exports2) {
    var EventEmitter = require("node:events").EventEmitter;
    var childProcess = require("node:child_process");
    var path2 = require("node:path");
    var fs2 = require("node:fs");
    var process2 = require("node:process");
    var { Argument, humanReadableArgName } = require_argument();
    var { CommanderError } = require_error();
    var { Help, stripColor } = require_help();
    var { Option, DualOptions } = require_option();
    var { suggestSimilar } = require_suggestSimilar();
    var Command = class _Command extends EventEmitter {
      /**
       * Initialize a new `Command`.
       *
       * @param {string} [name]
       */
      constructor(name) {
        super();
        this.commands = [];
        this.options = [];
        this.parent = null;
        this._allowUnknownOption = false;
        this._allowExcessArguments = false;
        this.registeredArguments = [];
        this._args = this.registeredArguments;
        this.args = [];
        this.rawArgs = [];
        this.processedArgs = [];
        this._scriptPath = null;
        this._name = name || "";
        this._optionValues = {};
        this._optionValueSources = {};
        this._storeOptionsAsProperties = false;
        this._actionHandler = null;
        this._executableHandler = false;
        this._executableFile = null;
        this._executableDir = null;
        this._defaultCommandName = null;
        this._exitCallback = null;
        this._aliases = [];
        this._combineFlagAndOptionalValue = true;
        this._description = "";
        this._summary = "";
        this._argsDescription = void 0;
        this._enablePositionalOptions = false;
        this._passThroughOptions = false;
        this._lifeCycleHooks = {};
        this._showHelpAfterError = false;
        this._showSuggestionAfterError = true;
        this._savedState = null;
        this._outputConfiguration = {
          writeOut: (str) => process2.stdout.write(str),
          writeErr: (str) => process2.stderr.write(str),
          outputError: (str, write) => write(str),
          getOutHelpWidth: () => process2.stdout.isTTY ? process2.stdout.columns : void 0,
          getErrHelpWidth: () => process2.stderr.isTTY ? process2.stderr.columns : void 0,
          getOutHasColors: () => useColor() ?? (process2.stdout.isTTY && process2.stdout.hasColors?.()),
          getErrHasColors: () => useColor() ?? (process2.stderr.isTTY && process2.stderr.hasColors?.()),
          stripColor: (str) => stripColor(str)
        };
        this._hidden = false;
        this._helpOption = void 0;
        this._addImplicitHelpCommand = void 0;
        this._helpCommand = void 0;
        this._helpConfiguration = {};
      }
      /**
       * Copy settings that are useful to have in common across root command and subcommands.
       *
       * (Used internally when adding a command using `.command()` so subcommands inherit parent settings.)
       *
       * @param {Command} sourceCommand
       * @return {Command} `this` command for chaining
       */
      copyInheritedSettings(sourceCommand) {
        this._outputConfiguration = sourceCommand._outputConfiguration;
        this._helpOption = sourceCommand._helpOption;
        this._helpCommand = sourceCommand._helpCommand;
        this._helpConfiguration = sourceCommand._helpConfiguration;
        this._exitCallback = sourceCommand._exitCallback;
        this._storeOptionsAsProperties = sourceCommand._storeOptionsAsProperties;
        this._combineFlagAndOptionalValue = sourceCommand._combineFlagAndOptionalValue;
        this._allowExcessArguments = sourceCommand._allowExcessArguments;
        this._enablePositionalOptions = sourceCommand._enablePositionalOptions;
        this._showHelpAfterError = sourceCommand._showHelpAfterError;
        this._showSuggestionAfterError = sourceCommand._showSuggestionAfterError;
        return this;
      }
      /**
       * @returns {Command[]}
       * @private
       */
      _getCommandAndAncestors() {
        const result = [];
        for (let command = this; command; command = command.parent) {
          result.push(command);
        }
        return result;
      }
      /**
       * Define a command.
       *
       * There are two styles of command: pay attention to where to put the description.
       *
       * @example
       * // Command implemented using action handler (description is supplied separately to `.command`)
       * program
       *   .command('clone <source> [destination]')
       *   .description('clone a repository into a newly created directory')
       *   .action((source, destination) => {
       *     console.log('clone command called');
       *   });
       *
       * // Command implemented using separate executable file (description is second parameter to `.command`)
       * program
       *   .command('start <service>', 'start named service')
       *   .command('stop [service]', 'stop named service, or all if no name supplied');
       *
       * @param {string} nameAndArgs - command name and arguments, args are `<required>` or `[optional]` and last may also be `variadic...`
       * @param {(object | string)} [actionOptsOrExecDesc] - configuration options (for action), or description (for executable)
       * @param {object} [execOpts] - configuration options (for executable)
       * @return {Command} returns new command for action handler, or `this` for executable command
       */
      command(nameAndArgs, actionOptsOrExecDesc, execOpts) {
        let desc = actionOptsOrExecDesc;
        let opts = execOpts;
        if (typeof desc === "object" && desc !== null) {
          opts = desc;
          desc = null;
        }
        opts = opts || {};
        const [, name, args] = nameAndArgs.match(/([^ ]+) *(.*)/);
        const cmd = this.createCommand(name);
        if (desc) {
          cmd.description(desc);
          cmd._executableHandler = true;
        }
        if (opts.isDefault) this._defaultCommandName = cmd._name;
        cmd._hidden = !!(opts.noHelp || opts.hidden);
        cmd._executableFile = opts.executableFile || null;
        if (args) cmd.arguments(args);
        this._registerCommand(cmd);
        cmd.parent = this;
        cmd.copyInheritedSettings(this);
        if (desc) return this;
        return cmd;
      }
      /**
       * Factory routine to create a new unattached command.
       *
       * See .command() for creating an attached subcommand, which uses this routine to
       * create the command. You can override createCommand to customise subcommands.
       *
       * @param {string} [name]
       * @return {Command} new command
       */
      createCommand(name) {
        return new _Command(name);
      }
      /**
       * You can customise the help with a subclass of Help by overriding createHelp,
       * or by overriding Help properties using configureHelp().
       *
       * @return {Help}
       */
      createHelp() {
        return Object.assign(new Help(), this.configureHelp());
      }
      /**
       * You can customise the help by overriding Help properties using configureHelp(),
       * or with a subclass of Help by overriding createHelp().
       *
       * @param {object} [configuration] - configuration options
       * @return {(Command | object)} `this` command for chaining, or stored configuration
       */
      configureHelp(configuration) {
        if (configuration === void 0) return this._helpConfiguration;
        this._helpConfiguration = configuration;
        return this;
      }
      /**
       * The default output goes to stdout and stderr. You can customise this for special
       * applications. You can also customise the display of errors by overriding outputError.
       *
       * The configuration properties are all functions:
       *
       *     // change how output being written, defaults to stdout and stderr
       *     writeOut(str)
       *     writeErr(str)
       *     // change how output being written for errors, defaults to writeErr
       *     outputError(str, write) // used for displaying errors and not used for displaying help
       *     // specify width for wrapping help
       *     getOutHelpWidth()
       *     getErrHelpWidth()
       *     // color support, currently only used with Help
       *     getOutHasColors()
       *     getErrHasColors()
       *     stripColor() // used to remove ANSI escape codes if output does not have colors
       *
       * @param {object} [configuration] - configuration options
       * @return {(Command | object)} `this` command for chaining, or stored configuration
       */
      configureOutput(configuration) {
        if (configuration === void 0) return this._outputConfiguration;
        Object.assign(this._outputConfiguration, configuration);
        return this;
      }
      /**
       * Display the help or a custom message after an error occurs.
       *
       * @param {(boolean|string)} [displayHelp]
       * @return {Command} `this` command for chaining
       */
      showHelpAfterError(displayHelp = true) {
        if (typeof displayHelp !== "string") displayHelp = !!displayHelp;
        this._showHelpAfterError = displayHelp;
        return this;
      }
      /**
       * Display suggestion of similar commands for unknown commands, or options for unknown options.
       *
       * @param {boolean} [displaySuggestion]
       * @return {Command} `this` command for chaining
       */
      showSuggestionAfterError(displaySuggestion = true) {
        this._showSuggestionAfterError = !!displaySuggestion;
        return this;
      }
      /**
       * Add a prepared subcommand.
       *
       * See .command() for creating an attached subcommand which inherits settings from its parent.
       *
       * @param {Command} cmd - new subcommand
       * @param {object} [opts] - configuration options
       * @return {Command} `this` command for chaining
       */
      addCommand(cmd, opts) {
        if (!cmd._name) {
          throw new Error(`Command passed to .addCommand() must have a name
- specify the name in Command constructor or using .name()`);
        }
        opts = opts || {};
        if (opts.isDefault) this._defaultCommandName = cmd._name;
        if (opts.noHelp || opts.hidden) cmd._hidden = true;
        this._registerCommand(cmd);
        cmd.parent = this;
        cmd._checkForBrokenPassThrough();
        return this;
      }
      /**
       * Factory routine to create a new unattached argument.
       *
       * See .argument() for creating an attached argument, which uses this routine to
       * create the argument. You can override createArgument to return a custom argument.
       *
       * @param {string} name
       * @param {string} [description]
       * @return {Argument} new argument
       */
      createArgument(name, description) {
        return new Argument(name, description);
      }
      /**
       * Define argument syntax for command.
       *
       * The default is that the argument is required, and you can explicitly
       * indicate this with <> around the name. Put [] around the name for an optional argument.
       *
       * @example
       * program.argument('<input-file>');
       * program.argument('[output-file]');
       *
       * @param {string} name
       * @param {string} [description]
       * @param {(Function|*)} [fn] - custom argument processing function
       * @param {*} [defaultValue]
       * @return {Command} `this` command for chaining
       */
      argument(name, description, fn, defaultValue) {
        const argument = this.createArgument(name, description);
        if (typeof fn === "function") {
          argument.default(defaultValue).argParser(fn);
        } else {
          argument.default(fn);
        }
        this.addArgument(argument);
        return this;
      }
      /**
       * Define argument syntax for command, adding multiple at once (without descriptions).
       *
       * See also .argument().
       *
       * @example
       * program.arguments('<cmd> [env]');
       *
       * @param {string} names
       * @return {Command} `this` command for chaining
       */
      arguments(names) {
        names.trim().split(/ +/).forEach((detail) => {
          this.argument(detail);
        });
        return this;
      }
      /**
       * Define argument syntax for command, adding a prepared argument.
       *
       * @param {Argument} argument
       * @return {Command} `this` command for chaining
       */
      addArgument(argument) {
        const previousArgument = this.registeredArguments.slice(-1)[0];
        if (previousArgument && previousArgument.variadic) {
          throw new Error(
            `only the last argument can be variadic '${previousArgument.name()}'`
          );
        }
        if (argument.required && argument.defaultValue !== void 0 && argument.parseArg === void 0) {
          throw new Error(
            `a default value for a required argument is never used: '${argument.name()}'`
          );
        }
        this.registeredArguments.push(argument);
        return this;
      }
      /**
       * Customise or override default help command. By default a help command is automatically added if your command has subcommands.
       *
       * @example
       *    program.helpCommand('help [cmd]');
       *    program.helpCommand('help [cmd]', 'show help');
       *    program.helpCommand(false); // suppress default help command
       *    program.helpCommand(true); // add help command even if no subcommands
       *
       * @param {string|boolean} enableOrNameAndArgs - enable with custom name and/or arguments, or boolean to override whether added
       * @param {string} [description] - custom description
       * @return {Command} `this` command for chaining
       */
      helpCommand(enableOrNameAndArgs, description) {
        if (typeof enableOrNameAndArgs === "boolean") {
          this._addImplicitHelpCommand = enableOrNameAndArgs;
          return this;
        }
        enableOrNameAndArgs = enableOrNameAndArgs ?? "help [command]";
        const [, helpName, helpArgs] = enableOrNameAndArgs.match(/([^ ]+) *(.*)/);
        const helpDescription = description ?? "display help for command";
        const helpCommand = this.createCommand(helpName);
        helpCommand.helpOption(false);
        if (helpArgs) helpCommand.arguments(helpArgs);
        if (helpDescription) helpCommand.description(helpDescription);
        this._addImplicitHelpCommand = true;
        this._helpCommand = helpCommand;
        return this;
      }
      /**
       * Add prepared custom help command.
       *
       * @param {(Command|string|boolean)} helpCommand - custom help command, or deprecated enableOrNameAndArgs as for `.helpCommand()`
       * @param {string} [deprecatedDescription] - deprecated custom description used with custom name only
       * @return {Command} `this` command for chaining
       */
      addHelpCommand(helpCommand, deprecatedDescription) {
        if (typeof helpCommand !== "object") {
          this.helpCommand(helpCommand, deprecatedDescription);
          return this;
        }
        this._addImplicitHelpCommand = true;
        this._helpCommand = helpCommand;
        return this;
      }
      /**
       * Lazy create help command.
       *
       * @return {(Command|null)}
       * @package
       */
      _getHelpCommand() {
        const hasImplicitHelpCommand = this._addImplicitHelpCommand ?? (this.commands.length && !this._actionHandler && !this._findCommand("help"));
        if (hasImplicitHelpCommand) {
          if (this._helpCommand === void 0) {
            this.helpCommand(void 0, void 0);
          }
          return this._helpCommand;
        }
        return null;
      }
      /**
       * Add hook for life cycle event.
       *
       * @param {string} event
       * @param {Function} listener
       * @return {Command} `this` command for chaining
       */
      hook(event, listener) {
        const allowedValues = ["preSubcommand", "preAction", "postAction"];
        if (!allowedValues.includes(event)) {
          throw new Error(`Unexpected value for event passed to hook : '${event}'.
Expecting one of '${allowedValues.join("', '")}'`);
        }
        if (this._lifeCycleHooks[event]) {
          this._lifeCycleHooks[event].push(listener);
        } else {
          this._lifeCycleHooks[event] = [listener];
        }
        return this;
      }
      /**
       * Register callback to use as replacement for calling process.exit.
       *
       * @param {Function} [fn] optional callback which will be passed a CommanderError, defaults to throwing
       * @return {Command} `this` command for chaining
       */
      exitOverride(fn) {
        if (fn) {
          this._exitCallback = fn;
        } else {
          this._exitCallback = (err) => {
            if (err.code !== "commander.executeSubCommandAsync") {
              throw err;
            } else {
            }
          };
        }
        return this;
      }
      /**
       * Call process.exit, and _exitCallback if defined.
       *
       * @param {number} exitCode exit code for using with process.exit
       * @param {string} code an id string representing the error
       * @param {string} message human-readable description of the error
       * @return never
       * @private
       */
      _exit(exitCode, code, message) {
        if (this._exitCallback) {
          this._exitCallback(new CommanderError(exitCode, code, message));
        }
        process2.exit(exitCode);
      }
      /**
       * Register callback `fn` for the command.
       *
       * @example
       * program
       *   .command('serve')
       *   .description('start service')
       *   .action(function() {
       *      // do work here
       *   });
       *
       * @param {Function} fn
       * @return {Command} `this` command for chaining
       */
      action(fn) {
        const listener = (args) => {
          const expectedArgsCount = this.registeredArguments.length;
          const actionArgs = args.slice(0, expectedArgsCount);
          if (this._storeOptionsAsProperties) {
            actionArgs[expectedArgsCount] = this;
          } else {
            actionArgs[expectedArgsCount] = this.opts();
          }
          actionArgs.push(this);
          return fn.apply(this, actionArgs);
        };
        this._actionHandler = listener;
        return this;
      }
      /**
       * Factory routine to create a new unattached option.
       *
       * See .option() for creating an attached option, which uses this routine to
       * create the option. You can override createOption to return a custom option.
       *
       * @param {string} flags
       * @param {string} [description]
       * @return {Option} new option
       */
      createOption(flags, description) {
        return new Option(flags, description);
      }
      /**
       * Wrap parseArgs to catch 'commander.invalidArgument'.
       *
       * @param {(Option | Argument)} target
       * @param {string} value
       * @param {*} previous
       * @param {string} invalidArgumentMessage
       * @private
       */
      _callParseArg(target, value, previous, invalidArgumentMessage) {
        try {
          return target.parseArg(value, previous);
        } catch (err) {
          if (err.code === "commander.invalidArgument") {
            const message = `${invalidArgumentMessage} ${err.message}`;
            this.error(message, { exitCode: err.exitCode, code: err.code });
          }
          throw err;
        }
      }
      /**
       * Check for option flag conflicts.
       * Register option if no conflicts found, or throw on conflict.
       *
       * @param {Option} option
       * @private
       */
      _registerOption(option) {
        const matchingOption = option.short && this._findOption(option.short) || option.long && this._findOption(option.long);
        if (matchingOption) {
          const matchingFlag = option.long && this._findOption(option.long) ? option.long : option.short;
          throw new Error(`Cannot add option '${option.flags}'${this._name && ` to command '${this._name}'`} due to conflicting flag '${matchingFlag}'
-  already used by option '${matchingOption.flags}'`);
        }
        this.options.push(option);
      }
      /**
       * Check for command name and alias conflicts with existing commands.
       * Register command if no conflicts found, or throw on conflict.
       *
       * @param {Command} command
       * @private
       */
      _registerCommand(command) {
        const knownBy = (cmd) => {
          return [cmd.name()].concat(cmd.aliases());
        };
        const alreadyUsed = knownBy(command).find(
          (name) => this._findCommand(name)
        );
        if (alreadyUsed) {
          const existingCmd = knownBy(this._findCommand(alreadyUsed)).join("|");
          const newCmd = knownBy(command).join("|");
          throw new Error(
            `cannot add command '${newCmd}' as already have command '${existingCmd}'`
          );
        }
        this.commands.push(command);
      }
      /**
       * Add an option.
       *
       * @param {Option} option
       * @return {Command} `this` command for chaining
       */
      addOption(option) {
        this._registerOption(option);
        const oname = option.name();
        const name = option.attributeName();
        if (option.negate) {
          const positiveLongFlag = option.long.replace(/^--no-/, "--");
          if (!this._findOption(positiveLongFlag)) {
            this.setOptionValueWithSource(
              name,
              option.defaultValue === void 0 ? true : option.defaultValue,
              "default"
            );
          }
        } else if (option.defaultValue !== void 0) {
          this.setOptionValueWithSource(name, option.defaultValue, "default");
        }
        const handleOptionValue = (val, invalidValueMessage, valueSource) => {
          if (val == null && option.presetArg !== void 0) {
            val = option.presetArg;
          }
          const oldValue = this.getOptionValue(name);
          if (val !== null && option.parseArg) {
            val = this._callParseArg(option, val, oldValue, invalidValueMessage);
          } else if (val !== null && option.variadic) {
            val = option._concatValue(val, oldValue);
          }
          if (val == null) {
            if (option.negate) {
              val = false;
            } else if (option.isBoolean() || option.optional) {
              val = true;
            } else {
              val = "";
            }
          }
          this.setOptionValueWithSource(name, val, valueSource);
        };
        this.on("option:" + oname, (val) => {
          const invalidValueMessage = `error: option '${option.flags}' argument '${val}' is invalid.`;
          handleOptionValue(val, invalidValueMessage, "cli");
        });
        if (option.envVar) {
          this.on("optionEnv:" + oname, (val) => {
            const invalidValueMessage = `error: option '${option.flags}' value '${val}' from env '${option.envVar}' is invalid.`;
            handleOptionValue(val, invalidValueMessage, "env");
          });
        }
        return this;
      }
      /**
       * Internal implementation shared by .option() and .requiredOption()
       *
       * @return {Command} `this` command for chaining
       * @private
       */
      _optionEx(config, flags, description, fn, defaultValue) {
        if (typeof flags === "object" && flags instanceof Option) {
          throw new Error(
            "To add an Option object use addOption() instead of option() or requiredOption()"
          );
        }
        const option = this.createOption(flags, description);
        option.makeOptionMandatory(!!config.mandatory);
        if (typeof fn === "function") {
          option.default(defaultValue).argParser(fn);
        } else if (fn instanceof RegExp) {
          const regex = fn;
          fn = (val, def) => {
            const m = regex.exec(val);
            return m ? m[0] : def;
          };
          option.default(defaultValue).argParser(fn);
        } else {
          option.default(fn);
        }
        return this.addOption(option);
      }
      /**
       * Define option with `flags`, `description`, and optional argument parsing function or `defaultValue` or both.
       *
       * The `flags` string contains the short and/or long flags, separated by comma, a pipe or space. A required
       * option-argument is indicated by `<>` and an optional option-argument by `[]`.
       *
       * See the README for more details, and see also addOption() and requiredOption().
       *
       * @example
       * program
       *     .option('-p, --pepper', 'add pepper')
       *     .option('--pt, --pizza-type <TYPE>', 'type of pizza') // required option-argument
       *     .option('-c, --cheese [CHEESE]', 'add extra cheese', 'mozzarella') // optional option-argument with default
       *     .option('-t, --tip <VALUE>', 'add tip to purchase cost', parseFloat) // custom parse function
       *
       * @param {string} flags
       * @param {string} [description]
       * @param {(Function|*)} [parseArg] - custom option processing function or default value
       * @param {*} [defaultValue]
       * @return {Command} `this` command for chaining
       */
      option(flags, description, parseArg, defaultValue) {
        return this._optionEx({}, flags, description, parseArg, defaultValue);
      }
      /**
       * Add a required option which must have a value after parsing. This usually means
       * the option must be specified on the command line. (Otherwise the same as .option().)
       *
       * The `flags` string contains the short and/or long flags, separated by comma, a pipe or space.
       *
       * @param {string} flags
       * @param {string} [description]
       * @param {(Function|*)} [parseArg] - custom option processing function or default value
       * @param {*} [defaultValue]
       * @return {Command} `this` command for chaining
       */
      requiredOption(flags, description, parseArg, defaultValue) {
        return this._optionEx(
          { mandatory: true },
          flags,
          description,
          parseArg,
          defaultValue
        );
      }
      /**
       * Alter parsing of short flags with optional values.
       *
       * @example
       * // for `.option('-f,--flag [value]'):
       * program.combineFlagAndOptionalValue(true);  // `-f80` is treated like `--flag=80`, this is the default behaviour
       * program.combineFlagAndOptionalValue(false) // `-fb` is treated like `-f -b`
       *
       * @param {boolean} [combine] - if `true` or omitted, an optional value can be specified directly after the flag.
       * @return {Command} `this` command for chaining
       */
      combineFlagAndOptionalValue(combine = true) {
        this._combineFlagAndOptionalValue = !!combine;
        return this;
      }
      /**
       * Allow unknown options on the command line.
       *
       * @param {boolean} [allowUnknown] - if `true` or omitted, no error will be thrown for unknown options.
       * @return {Command} `this` command for chaining
       */
      allowUnknownOption(allowUnknown = true) {
        this._allowUnknownOption = !!allowUnknown;
        return this;
      }
      /**
       * Allow excess command-arguments on the command line. Pass false to make excess arguments an error.
       *
       * @param {boolean} [allowExcess] - if `true` or omitted, no error will be thrown for excess arguments.
       * @return {Command} `this` command for chaining
       */
      allowExcessArguments(allowExcess = true) {
        this._allowExcessArguments = !!allowExcess;
        return this;
      }
      /**
       * Enable positional options. Positional means global options are specified before subcommands which lets
       * subcommands reuse the same option names, and also enables subcommands to turn on passThroughOptions.
       * The default behaviour is non-positional and global options may appear anywhere on the command line.
       *
       * @param {boolean} [positional]
       * @return {Command} `this` command for chaining
       */
      enablePositionalOptions(positional = true) {
        this._enablePositionalOptions = !!positional;
        return this;
      }
      /**
       * Pass through options that come after command-arguments rather than treat them as command-options,
       * so actual command-options come before command-arguments. Turning this on for a subcommand requires
       * positional options to have been enabled on the program (parent commands).
       * The default behaviour is non-positional and options may appear before or after command-arguments.
       *
       * @param {boolean} [passThrough] for unknown options.
       * @return {Command} `this` command for chaining
       */
      passThroughOptions(passThrough = true) {
        this._passThroughOptions = !!passThrough;
        this._checkForBrokenPassThrough();
        return this;
      }
      /**
       * @private
       */
      _checkForBrokenPassThrough() {
        if (this.parent && this._passThroughOptions && !this.parent._enablePositionalOptions) {
          throw new Error(
            `passThroughOptions cannot be used for '${this._name}' without turning on enablePositionalOptions for parent command(s)`
          );
        }
      }
      /**
       * Whether to store option values as properties on command object,
       * or store separately (specify false). In both cases the option values can be accessed using .opts().
       *
       * @param {boolean} [storeAsProperties=true]
       * @return {Command} `this` command for chaining
       */
      storeOptionsAsProperties(storeAsProperties = true) {
        if (this.options.length) {
          throw new Error("call .storeOptionsAsProperties() before adding options");
        }
        if (Object.keys(this._optionValues).length) {
          throw new Error(
            "call .storeOptionsAsProperties() before setting option values"
          );
        }
        this._storeOptionsAsProperties = !!storeAsProperties;
        return this;
      }
      /**
       * Retrieve option value.
       *
       * @param {string} key
       * @return {object} value
       */
      getOptionValue(key) {
        if (this._storeOptionsAsProperties) {
          return this[key];
        }
        return this._optionValues[key];
      }
      /**
       * Store option value.
       *
       * @param {string} key
       * @param {object} value
       * @return {Command} `this` command for chaining
       */
      setOptionValue(key, value) {
        return this.setOptionValueWithSource(key, value, void 0);
      }
      /**
       * Store option value and where the value came from.
       *
       * @param {string} key
       * @param {object} value
       * @param {string} source - expected values are default/config/env/cli/implied
       * @return {Command} `this` command for chaining
       */
      setOptionValueWithSource(key, value, source) {
        if (this._storeOptionsAsProperties) {
          this[key] = value;
        } else {
          this._optionValues[key] = value;
        }
        this._optionValueSources[key] = source;
        return this;
      }
      /**
       * Get source of option value.
       * Expected values are default | config | env | cli | implied
       *
       * @param {string} key
       * @return {string}
       */
      getOptionValueSource(key) {
        return this._optionValueSources[key];
      }
      /**
       * Get source of option value. See also .optsWithGlobals().
       * Expected values are default | config | env | cli | implied
       *
       * @param {string} key
       * @return {string}
       */
      getOptionValueSourceWithGlobals(key) {
        let source;
        this._getCommandAndAncestors().forEach((cmd) => {
          if (cmd.getOptionValueSource(key) !== void 0) {
            source = cmd.getOptionValueSource(key);
          }
        });
        return source;
      }
      /**
       * Get user arguments from implied or explicit arguments.
       * Side-effects: set _scriptPath if args included script. Used for default program name, and subcommand searches.
       *
       * @private
       */
      _prepareUserArgs(argv, parseOptions) {
        if (argv !== void 0 && !Array.isArray(argv)) {
          throw new Error("first parameter to parse must be array or undefined");
        }
        parseOptions = parseOptions || {};
        if (argv === void 0 && parseOptions.from === void 0) {
          if (process2.versions?.electron) {
            parseOptions.from = "electron";
          }
          const execArgv = process2.execArgv ?? [];
          if (execArgv.includes("-e") || execArgv.includes("--eval") || execArgv.includes("-p") || execArgv.includes("--print")) {
            parseOptions.from = "eval";
          }
        }
        if (argv === void 0) {
          argv = process2.argv;
        }
        this.rawArgs = argv.slice();
        let userArgs;
        switch (parseOptions.from) {
          case void 0:
          case "node":
            this._scriptPath = argv[1];
            userArgs = argv.slice(2);
            break;
          case "electron":
            if (process2.defaultApp) {
              this._scriptPath = argv[1];
              userArgs = argv.slice(2);
            } else {
              userArgs = argv.slice(1);
            }
            break;
          case "user":
            userArgs = argv.slice(0);
            break;
          case "eval":
            userArgs = argv.slice(1);
            break;
          default:
            throw new Error(
              `unexpected parse option { from: '${parseOptions.from}' }`
            );
        }
        if (!this._name && this._scriptPath)
          this.nameFromFilename(this._scriptPath);
        this._name = this._name || "program";
        return userArgs;
      }
      /**
       * Parse `argv`, setting options and invoking commands when defined.
       *
       * Use parseAsync instead of parse if any of your action handlers are async.
       *
       * Call with no parameters to parse `process.argv`. Detects Electron and special node options like `node --eval`. Easy mode!
       *
       * Or call with an array of strings to parse, and optionally where the user arguments start by specifying where the arguments are `from`:
       * - `'node'`: default, `argv[0]` is the application and `argv[1]` is the script being run, with user arguments after that
       * - `'electron'`: `argv[0]` is the application and `argv[1]` varies depending on whether the electron application is packaged
       * - `'user'`: just user arguments
       *
       * @example
       * program.parse(); // parse process.argv and auto-detect electron and special node flags
       * program.parse(process.argv); // assume argv[0] is app and argv[1] is script
       * program.parse(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
       *
       * @param {string[]} [argv] - optional, defaults to process.argv
       * @param {object} [parseOptions] - optionally specify style of options with from: node/user/electron
       * @param {string} [parseOptions.from] - where the args are from: 'node', 'user', 'electron'
       * @return {Command} `this` command for chaining
       */
      parse(argv, parseOptions) {
        this._prepareForParse();
        const userArgs = this._prepareUserArgs(argv, parseOptions);
        this._parseCommand([], userArgs);
        return this;
      }
      /**
       * Parse `argv`, setting options and invoking commands when defined.
       *
       * Call with no parameters to parse `process.argv`. Detects Electron and special node options like `node --eval`. Easy mode!
       *
       * Or call with an array of strings to parse, and optionally where the user arguments start by specifying where the arguments are `from`:
       * - `'node'`: default, `argv[0]` is the application and `argv[1]` is the script being run, with user arguments after that
       * - `'electron'`: `argv[0]` is the application and `argv[1]` varies depending on whether the electron application is packaged
       * - `'user'`: just user arguments
       *
       * @example
       * await program.parseAsync(); // parse process.argv and auto-detect electron and special node flags
       * await program.parseAsync(process.argv); // assume argv[0] is app and argv[1] is script
       * await program.parseAsync(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
       *
       * @param {string[]} [argv]
       * @param {object} [parseOptions]
       * @param {string} parseOptions.from - where the args are from: 'node', 'user', 'electron'
       * @return {Promise}
       */
      async parseAsync(argv, parseOptions) {
        this._prepareForParse();
        const userArgs = this._prepareUserArgs(argv, parseOptions);
        await this._parseCommand([], userArgs);
        return this;
      }
      _prepareForParse() {
        if (this._savedState === null) {
          this.saveStateBeforeParse();
        } else {
          this.restoreStateBeforeParse();
        }
      }
      /**
       * Called the first time parse is called to save state and allow a restore before subsequent calls to parse.
       * Not usually called directly, but available for subclasses to save their custom state.
       *
       * This is called in a lazy way. Only commands used in parsing chain will have state saved.
       */
      saveStateBeforeParse() {
        this._savedState = {
          // name is stable if supplied by author, but may be unspecified for root command and deduced during parsing
          _name: this._name,
          // option values before parse have default values (including false for negated options)
          // shallow clones
          _optionValues: { ...this._optionValues },
          _optionValueSources: { ...this._optionValueSources }
        };
      }
      /**
       * Restore state before parse for calls after the first.
       * Not usually called directly, but available for subclasses to save their custom state.
       *
       * This is called in a lazy way. Only commands used in parsing chain will have state restored.
       */
      restoreStateBeforeParse() {
        if (this._storeOptionsAsProperties)
          throw new Error(`Can not call parse again when storeOptionsAsProperties is true.
- either make a new Command for each call to parse, or stop storing options as properties`);
        this._name = this._savedState._name;
        this._scriptPath = null;
        this.rawArgs = [];
        this._optionValues = { ...this._savedState._optionValues };
        this._optionValueSources = { ...this._savedState._optionValueSources };
        this.args = [];
        this.processedArgs = [];
      }
      /**
       * Throw if expected executable is missing. Add lots of help for author.
       *
       * @param {string} executableFile
       * @param {string} executableDir
       * @param {string} subcommandName
       */
      _checkForMissingExecutable(executableFile, executableDir, subcommandName) {
        if (fs2.existsSync(executableFile)) return;
        const executableDirMessage = executableDir ? `searched for local subcommand relative to directory '${executableDir}'` : "no directory for search for local subcommand, use .executableDir() to supply a custom directory";
        const executableMissing = `'${executableFile}' does not exist
 - if '${subcommandName}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${executableDirMessage}`;
        throw new Error(executableMissing);
      }
      /**
       * Execute a sub-command executable.
       *
       * @private
       */
      _executeSubCommand(subcommand, args) {
        args = args.slice();
        let launchWithNode = false;
        const sourceExt = [".js", ".ts", ".tsx", ".mjs", ".cjs"];
        function findFile(baseDir, baseName) {
          const localBin = path2.resolve(baseDir, baseName);
          if (fs2.existsSync(localBin)) return localBin;
          if (sourceExt.includes(path2.extname(baseName))) return void 0;
          const foundExt = sourceExt.find(
            (ext) => fs2.existsSync(`${localBin}${ext}`)
          );
          if (foundExt) return `${localBin}${foundExt}`;
          return void 0;
        }
        this._checkForMissingMandatoryOptions();
        this._checkForConflictingOptions();
        let executableFile = subcommand._executableFile || `${this._name}-${subcommand._name}`;
        let executableDir = this._executableDir || "";
        if (this._scriptPath) {
          let resolvedScriptPath;
          try {
            resolvedScriptPath = fs2.realpathSync(this._scriptPath);
          } catch {
            resolvedScriptPath = this._scriptPath;
          }
          executableDir = path2.resolve(
            path2.dirname(resolvedScriptPath),
            executableDir
          );
        }
        if (executableDir) {
          let localFile = findFile(executableDir, executableFile);
          if (!localFile && !subcommand._executableFile && this._scriptPath) {
            const legacyName = path2.basename(
              this._scriptPath,
              path2.extname(this._scriptPath)
            );
            if (legacyName !== this._name) {
              localFile = findFile(
                executableDir,
                `${legacyName}-${subcommand._name}`
              );
            }
          }
          executableFile = localFile || executableFile;
        }
        launchWithNode = sourceExt.includes(path2.extname(executableFile));
        let proc;
        if (process2.platform !== "win32") {
          if (launchWithNode) {
            args.unshift(executableFile);
            args = incrementNodeInspectorPort(process2.execArgv).concat(args);
            proc = childProcess.spawn(process2.argv[0], args, { stdio: "inherit" });
          } else {
            proc = childProcess.spawn(executableFile, args, { stdio: "inherit" });
          }
        } else {
          this._checkForMissingExecutable(
            executableFile,
            executableDir,
            subcommand._name
          );
          args.unshift(executableFile);
          args = incrementNodeInspectorPort(process2.execArgv).concat(args);
          proc = childProcess.spawn(process2.execPath, args, { stdio: "inherit" });
        }
        if (!proc.killed) {
          const signals = ["SIGUSR1", "SIGUSR2", "SIGTERM", "SIGINT", "SIGHUP"];
          signals.forEach((signal) => {
            process2.on(signal, () => {
              if (proc.killed === false && proc.exitCode === null) {
                proc.kill(signal);
              }
            });
          });
        }
        const exitCallback = this._exitCallback;
        proc.on("close", (code) => {
          code = code ?? 1;
          if (!exitCallback) {
            process2.exit(code);
          } else {
            exitCallback(
              new CommanderError(
                code,
                "commander.executeSubCommandAsync",
                "(close)"
              )
            );
          }
        });
        proc.on("error", (err) => {
          if (err.code === "ENOENT") {
            this._checkForMissingExecutable(
              executableFile,
              executableDir,
              subcommand._name
            );
          } else if (err.code === "EACCES") {
            throw new Error(`'${executableFile}' not executable`);
          }
          if (!exitCallback) {
            process2.exit(1);
          } else {
            const wrappedError = new CommanderError(
              1,
              "commander.executeSubCommandAsync",
              "(error)"
            );
            wrappedError.nestedError = err;
            exitCallback(wrappedError);
          }
        });
        this.runningCommand = proc;
      }
      /**
       * @private
       */
      _dispatchSubcommand(commandName, operands, unknown) {
        const subCommand = this._findCommand(commandName);
        if (!subCommand) this.help({ error: true });
        subCommand._prepareForParse();
        let promiseChain;
        promiseChain = this._chainOrCallSubCommandHook(
          promiseChain,
          subCommand,
          "preSubcommand"
        );
        promiseChain = this._chainOrCall(promiseChain, () => {
          if (subCommand._executableHandler) {
            this._executeSubCommand(subCommand, operands.concat(unknown));
          } else {
            return subCommand._parseCommand(operands, unknown);
          }
        });
        return promiseChain;
      }
      /**
       * Invoke help directly if possible, or dispatch if necessary.
       * e.g. help foo
       *
       * @private
       */
      _dispatchHelpCommand(subcommandName) {
        if (!subcommandName) {
          this.help();
        }
        const subCommand = this._findCommand(subcommandName);
        if (subCommand && !subCommand._executableHandler) {
          subCommand.help();
        }
        return this._dispatchSubcommand(
          subcommandName,
          [],
          [this._getHelpOption()?.long ?? this._getHelpOption()?.short ?? "--help"]
        );
      }
      /**
       * Check this.args against expected this.registeredArguments.
       *
       * @private
       */
      _checkNumberOfArguments() {
        this.registeredArguments.forEach((arg, i) => {
          if (arg.required && this.args[i] == null) {
            this.missingArgument(arg.name());
          }
        });
        if (this.registeredArguments.length > 0 && this.registeredArguments[this.registeredArguments.length - 1].variadic) {
          return;
        }
        if (this.args.length > this.registeredArguments.length) {
          this._excessArguments(this.args);
        }
      }
      /**
       * Process this.args using this.registeredArguments and save as this.processedArgs!
       *
       * @private
       */
      _processArguments() {
        const myParseArg = (argument, value, previous) => {
          let parsedValue = value;
          if (value !== null && argument.parseArg) {
            const invalidValueMessage = `error: command-argument value '${value}' is invalid for argument '${argument.name()}'.`;
            parsedValue = this._callParseArg(
              argument,
              value,
              previous,
              invalidValueMessage
            );
          }
          return parsedValue;
        };
        this._checkNumberOfArguments();
        const processedArgs = [];
        this.registeredArguments.forEach((declaredArg, index) => {
          let value = declaredArg.defaultValue;
          if (declaredArg.variadic) {
            if (index < this.args.length) {
              value = this.args.slice(index);
              if (declaredArg.parseArg) {
                value = value.reduce((processed, v) => {
                  return myParseArg(declaredArg, v, processed);
                }, declaredArg.defaultValue);
              }
            } else if (value === void 0) {
              value = [];
            }
          } else if (index < this.args.length) {
            value = this.args[index];
            if (declaredArg.parseArg) {
              value = myParseArg(declaredArg, value, declaredArg.defaultValue);
            }
          }
          processedArgs[index] = value;
        });
        this.processedArgs = processedArgs;
      }
      /**
       * Once we have a promise we chain, but call synchronously until then.
       *
       * @param {(Promise|undefined)} promise
       * @param {Function} fn
       * @return {(Promise|undefined)}
       * @private
       */
      _chainOrCall(promise, fn) {
        if (promise && promise.then && typeof promise.then === "function") {
          return promise.then(() => fn());
        }
        return fn();
      }
      /**
       *
       * @param {(Promise|undefined)} promise
       * @param {string} event
       * @return {(Promise|undefined)}
       * @private
       */
      _chainOrCallHooks(promise, event) {
        let result = promise;
        const hooks = [];
        this._getCommandAndAncestors().reverse().filter((cmd) => cmd._lifeCycleHooks[event] !== void 0).forEach((hookedCommand) => {
          hookedCommand._lifeCycleHooks[event].forEach((callback) => {
            hooks.push({ hookedCommand, callback });
          });
        });
        if (event === "postAction") {
          hooks.reverse();
        }
        hooks.forEach((hookDetail) => {
          result = this._chainOrCall(result, () => {
            return hookDetail.callback(hookDetail.hookedCommand, this);
          });
        });
        return result;
      }
      /**
       *
       * @param {(Promise|undefined)} promise
       * @param {Command} subCommand
       * @param {string} event
       * @return {(Promise|undefined)}
       * @private
       */
      _chainOrCallSubCommandHook(promise, subCommand, event) {
        let result = promise;
        if (this._lifeCycleHooks[event] !== void 0) {
          this._lifeCycleHooks[event].forEach((hook) => {
            result = this._chainOrCall(result, () => {
              return hook(this, subCommand);
            });
          });
        }
        return result;
      }
      /**
       * Process arguments in context of this command.
       * Returns action result, in case it is a promise.
       *
       * @private
       */
      _parseCommand(operands, unknown) {
        const parsed = this.parseOptions(unknown);
        this._parseOptionsEnv();
        this._parseOptionsImplied();
        operands = operands.concat(parsed.operands);
        unknown = parsed.unknown;
        this.args = operands.concat(unknown);
        if (operands && this._findCommand(operands[0])) {
          return this._dispatchSubcommand(operands[0], operands.slice(1), unknown);
        }
        if (this._getHelpCommand() && operands[0] === this._getHelpCommand().name()) {
          return this._dispatchHelpCommand(operands[1]);
        }
        if (this._defaultCommandName) {
          this._outputHelpIfRequested(unknown);
          return this._dispatchSubcommand(
            this._defaultCommandName,
            operands,
            unknown
          );
        }
        if (this.commands.length && this.args.length === 0 && !this._actionHandler && !this._defaultCommandName) {
          this.help({ error: true });
        }
        this._outputHelpIfRequested(parsed.unknown);
        this._checkForMissingMandatoryOptions();
        this._checkForConflictingOptions();
        const checkForUnknownOptions = () => {
          if (parsed.unknown.length > 0) {
            this.unknownOption(parsed.unknown[0]);
          }
        };
        const commandEvent = `command:${this.name()}`;
        if (this._actionHandler) {
          checkForUnknownOptions();
          this._processArguments();
          let promiseChain;
          promiseChain = this._chainOrCallHooks(promiseChain, "preAction");
          promiseChain = this._chainOrCall(
            promiseChain,
            () => this._actionHandler(this.processedArgs)
          );
          if (this.parent) {
            promiseChain = this._chainOrCall(promiseChain, () => {
              this.parent.emit(commandEvent, operands, unknown);
            });
          }
          promiseChain = this._chainOrCallHooks(promiseChain, "postAction");
          return promiseChain;
        }
        if (this.parent && this.parent.listenerCount(commandEvent)) {
          checkForUnknownOptions();
          this._processArguments();
          this.parent.emit(commandEvent, operands, unknown);
        } else if (operands.length) {
          if (this._findCommand("*")) {
            return this._dispatchSubcommand("*", operands, unknown);
          }
          if (this.listenerCount("command:*")) {
            this.emit("command:*", operands, unknown);
          } else if (this.commands.length) {
            this.unknownCommand();
          } else {
            checkForUnknownOptions();
            this._processArguments();
          }
        } else if (this.commands.length) {
          checkForUnknownOptions();
          this.help({ error: true });
        } else {
          checkForUnknownOptions();
          this._processArguments();
        }
      }
      /**
       * Find matching command.
       *
       * @private
       * @return {Command | undefined}
       */
      _findCommand(name) {
        if (!name) return void 0;
        return this.commands.find(
          (cmd) => cmd._name === name || cmd._aliases.includes(name)
        );
      }
      /**
       * Return an option matching `arg` if any.
       *
       * @param {string} arg
       * @return {Option}
       * @package
       */
      _findOption(arg) {
        return this.options.find((option) => option.is(arg));
      }
      /**
       * Display an error message if a mandatory option does not have a value.
       * Called after checking for help flags in leaf subcommand.
       *
       * @private
       */
      _checkForMissingMandatoryOptions() {
        this._getCommandAndAncestors().forEach((cmd) => {
          cmd.options.forEach((anOption) => {
            if (anOption.mandatory && cmd.getOptionValue(anOption.attributeName()) === void 0) {
              cmd.missingMandatoryOptionValue(anOption);
            }
          });
        });
      }
      /**
       * Display an error message if conflicting options are used together in this.
       *
       * @private
       */
      _checkForConflictingLocalOptions() {
        const definedNonDefaultOptions = this.options.filter((option) => {
          const optionKey = option.attributeName();
          if (this.getOptionValue(optionKey) === void 0) {
            return false;
          }
          return this.getOptionValueSource(optionKey) !== "default";
        });
        const optionsWithConflicting = definedNonDefaultOptions.filter(
          (option) => option.conflictsWith.length > 0
        );
        optionsWithConflicting.forEach((option) => {
          const conflictingAndDefined = definedNonDefaultOptions.find(
            (defined) => option.conflictsWith.includes(defined.attributeName())
          );
          if (conflictingAndDefined) {
            this._conflictingOption(option, conflictingAndDefined);
          }
        });
      }
      /**
       * Display an error message if conflicting options are used together.
       * Called after checking for help flags in leaf subcommand.
       *
       * @private
       */
      _checkForConflictingOptions() {
        this._getCommandAndAncestors().forEach((cmd) => {
          cmd._checkForConflictingLocalOptions();
        });
      }
      /**
       * Parse options from `argv` removing known options,
       * and return argv split into operands and unknown arguments.
       *
       * Side effects: modifies command by storing options. Does not reset state if called again.
       *
       * Examples:
       *
       *     argv => operands, unknown
       *     --known kkk op => [op], []
       *     op --known kkk => [op], []
       *     sub --unknown uuu op => [sub], [--unknown uuu op]
       *     sub -- --unknown uuu op => [sub --unknown uuu op], []
       *
       * @param {string[]} argv
       * @return {{operands: string[], unknown: string[]}}
       */
      parseOptions(argv) {
        const operands = [];
        const unknown = [];
        let dest = operands;
        const args = argv.slice();
        function maybeOption(arg) {
          return arg.length > 1 && arg[0] === "-";
        }
        let activeVariadicOption = null;
        while (args.length) {
          const arg = args.shift();
          if (arg === "--") {
            if (dest === unknown) dest.push(arg);
            dest.push(...args);
            break;
          }
          if (activeVariadicOption && !maybeOption(arg)) {
            this.emit(`option:${activeVariadicOption.name()}`, arg);
            continue;
          }
          activeVariadicOption = null;
          if (maybeOption(arg)) {
            const option = this._findOption(arg);
            if (option) {
              if (option.required) {
                const value = args.shift();
                if (value === void 0) this.optionMissingArgument(option);
                this.emit(`option:${option.name()}`, value);
              } else if (option.optional) {
                let value = null;
                if (args.length > 0 && !maybeOption(args[0])) {
                  value = args.shift();
                }
                this.emit(`option:${option.name()}`, value);
              } else {
                this.emit(`option:${option.name()}`);
              }
              activeVariadicOption = option.variadic ? option : null;
              continue;
            }
          }
          if (arg.length > 2 && arg[0] === "-" && arg[1] !== "-") {
            const option = this._findOption(`-${arg[1]}`);
            if (option) {
              if (option.required || option.optional && this._combineFlagAndOptionalValue) {
                this.emit(`option:${option.name()}`, arg.slice(2));
              } else {
                this.emit(`option:${option.name()}`);
                args.unshift(`-${arg.slice(2)}`);
              }
              continue;
            }
          }
          if (/^--[^=]+=/.test(arg)) {
            const index = arg.indexOf("=");
            const option = this._findOption(arg.slice(0, index));
            if (option && (option.required || option.optional)) {
              this.emit(`option:${option.name()}`, arg.slice(index + 1));
              continue;
            }
          }
          if (maybeOption(arg)) {
            dest = unknown;
          }
          if ((this._enablePositionalOptions || this._passThroughOptions) && operands.length === 0 && unknown.length === 0) {
            if (this._findCommand(arg)) {
              operands.push(arg);
              if (args.length > 0) unknown.push(...args);
              break;
            } else if (this._getHelpCommand() && arg === this._getHelpCommand().name()) {
              operands.push(arg);
              if (args.length > 0) operands.push(...args);
              break;
            } else if (this._defaultCommandName) {
              unknown.push(arg);
              if (args.length > 0) unknown.push(...args);
              break;
            }
          }
          if (this._passThroughOptions) {
            dest.push(arg);
            if (args.length > 0) dest.push(...args);
            break;
          }
          dest.push(arg);
        }
        return { operands, unknown };
      }
      /**
       * Return an object containing local option values as key-value pairs.
       *
       * @return {object}
       */
      opts() {
        if (this._storeOptionsAsProperties) {
          const result = {};
          const len = this.options.length;
          for (let i = 0; i < len; i++) {
            const key = this.options[i].attributeName();
            result[key] = key === this._versionOptionName ? this._version : this[key];
          }
          return result;
        }
        return this._optionValues;
      }
      /**
       * Return an object containing merged local and global option values as key-value pairs.
       *
       * @return {object}
       */
      optsWithGlobals() {
        return this._getCommandAndAncestors().reduce(
          (combinedOptions, cmd) => Object.assign(combinedOptions, cmd.opts()),
          {}
        );
      }
      /**
       * Display error message and exit (or call exitOverride).
       *
       * @param {string} message
       * @param {object} [errorOptions]
       * @param {string} [errorOptions.code] - an id string representing the error
       * @param {number} [errorOptions.exitCode] - used with process.exit
       */
      error(message, errorOptions) {
        this._outputConfiguration.outputError(
          `${message}
`,
          this._outputConfiguration.writeErr
        );
        if (typeof this._showHelpAfterError === "string") {
          this._outputConfiguration.writeErr(`${this._showHelpAfterError}
`);
        } else if (this._showHelpAfterError) {
          this._outputConfiguration.writeErr("\n");
          this.outputHelp({ error: true });
        }
        const config = errorOptions || {};
        const exitCode = config.exitCode || 1;
        const code = config.code || "commander.error";
        this._exit(exitCode, code, message);
      }
      /**
       * Apply any option related environment variables, if option does
       * not have a value from cli or client code.
       *
       * @private
       */
      _parseOptionsEnv() {
        this.options.forEach((option) => {
          if (option.envVar && option.envVar in process2.env) {
            const optionKey = option.attributeName();
            if (this.getOptionValue(optionKey) === void 0 || ["default", "config", "env"].includes(
              this.getOptionValueSource(optionKey)
            )) {
              if (option.required || option.optional) {
                this.emit(`optionEnv:${option.name()}`, process2.env[option.envVar]);
              } else {
                this.emit(`optionEnv:${option.name()}`);
              }
            }
          }
        });
      }
      /**
       * Apply any implied option values, if option is undefined or default value.
       *
       * @private
       */
      _parseOptionsImplied() {
        const dualHelper = new DualOptions(this.options);
        const hasCustomOptionValue = (optionKey) => {
          return this.getOptionValue(optionKey) !== void 0 && !["default", "implied"].includes(this.getOptionValueSource(optionKey));
        };
        this.options.filter(
          (option) => option.implied !== void 0 && hasCustomOptionValue(option.attributeName()) && dualHelper.valueFromOption(
            this.getOptionValue(option.attributeName()),
            option
          )
        ).forEach((option) => {
          Object.keys(option.implied).filter((impliedKey) => !hasCustomOptionValue(impliedKey)).forEach((impliedKey) => {
            this.setOptionValueWithSource(
              impliedKey,
              option.implied[impliedKey],
              "implied"
            );
          });
        });
      }
      /**
       * Argument `name` is missing.
       *
       * @param {string} name
       * @private
       */
      missingArgument(name) {
        const message = `error: missing required argument '${name}'`;
        this.error(message, { code: "commander.missingArgument" });
      }
      /**
       * `Option` is missing an argument.
       *
       * @param {Option} option
       * @private
       */
      optionMissingArgument(option) {
        const message = `error: option '${option.flags}' argument missing`;
        this.error(message, { code: "commander.optionMissingArgument" });
      }
      /**
       * `Option` does not have a value, and is a mandatory option.
       *
       * @param {Option} option
       * @private
       */
      missingMandatoryOptionValue(option) {
        const message = `error: required option '${option.flags}' not specified`;
        this.error(message, { code: "commander.missingMandatoryOptionValue" });
      }
      /**
       * `Option` conflicts with another option.
       *
       * @param {Option} option
       * @param {Option} conflictingOption
       * @private
       */
      _conflictingOption(option, conflictingOption) {
        const findBestOptionFromValue = (option2) => {
          const optionKey = option2.attributeName();
          const optionValue = this.getOptionValue(optionKey);
          const negativeOption = this.options.find(
            (target) => target.negate && optionKey === target.attributeName()
          );
          const positiveOption = this.options.find(
            (target) => !target.negate && optionKey === target.attributeName()
          );
          if (negativeOption && (negativeOption.presetArg === void 0 && optionValue === false || negativeOption.presetArg !== void 0 && optionValue === negativeOption.presetArg)) {
            return negativeOption;
          }
          return positiveOption || option2;
        };
        const getErrorMessage = (option2) => {
          const bestOption = findBestOptionFromValue(option2);
          const optionKey = bestOption.attributeName();
          const source = this.getOptionValueSource(optionKey);
          if (source === "env") {
            return `environment variable '${bestOption.envVar}'`;
          }
          return `option '${bestOption.flags}'`;
        };
        const message = `error: ${getErrorMessage(option)} cannot be used with ${getErrorMessage(conflictingOption)}`;
        this.error(message, { code: "commander.conflictingOption" });
      }
      /**
       * Unknown option `flag`.
       *
       * @param {string} flag
       * @private
       */
      unknownOption(flag) {
        if (this._allowUnknownOption) return;
        let suggestion = "";
        if (flag.startsWith("--") && this._showSuggestionAfterError) {
          let candidateFlags = [];
          let command = this;
          do {
            const moreFlags = command.createHelp().visibleOptions(command).filter((option) => option.long).map((option) => option.long);
            candidateFlags = candidateFlags.concat(moreFlags);
            command = command.parent;
          } while (command && !command._enablePositionalOptions);
          suggestion = suggestSimilar(flag, candidateFlags);
        }
        const message = `error: unknown option '${flag}'${suggestion}`;
        this.error(message, { code: "commander.unknownOption" });
      }
      /**
       * Excess arguments, more than expected.
       *
       * @param {string[]} receivedArgs
       * @private
       */
      _excessArguments(receivedArgs) {
        if (this._allowExcessArguments) return;
        const expected = this.registeredArguments.length;
        const s = expected === 1 ? "" : "s";
        const forSubcommand = this.parent ? ` for '${this.name()}'` : "";
        const message = `error: too many arguments${forSubcommand}. Expected ${expected} argument${s} but got ${receivedArgs.length}.`;
        this.error(message, { code: "commander.excessArguments" });
      }
      /**
       * Unknown command.
       *
       * @private
       */
      unknownCommand() {
        const unknownName = this.args[0];
        let suggestion = "";
        if (this._showSuggestionAfterError) {
          const candidateNames = [];
          this.createHelp().visibleCommands(this).forEach((command) => {
            candidateNames.push(command.name());
            if (command.alias()) candidateNames.push(command.alias());
          });
          suggestion = suggestSimilar(unknownName, candidateNames);
        }
        const message = `error: unknown command '${unknownName}'${suggestion}`;
        this.error(message, { code: "commander.unknownCommand" });
      }
      /**
       * Get or set the program version.
       *
       * This method auto-registers the "-V, --version" option which will print the version number.
       *
       * You can optionally supply the flags and description to override the defaults.
       *
       * @param {string} [str]
       * @param {string} [flags]
       * @param {string} [description]
       * @return {(this | string | undefined)} `this` command for chaining, or version string if no arguments
       */
      version(str, flags, description) {
        if (str === void 0) return this._version;
        this._version = str;
        flags = flags || "-V, --version";
        description = description || "output the version number";
        const versionOption = this.createOption(flags, description);
        this._versionOptionName = versionOption.attributeName();
        this._registerOption(versionOption);
        this.on("option:" + versionOption.name(), () => {
          this._outputConfiguration.writeOut(`${str}
`);
          this._exit(0, "commander.version", str);
        });
        return this;
      }
      /**
       * Set the description.
       *
       * @param {string} [str]
       * @param {object} [argsDescription]
       * @return {(string|Command)}
       */
      description(str, argsDescription) {
        if (str === void 0 && argsDescription === void 0)
          return this._description;
        this._description = str;
        if (argsDescription) {
          this._argsDescription = argsDescription;
        }
        return this;
      }
      /**
       * Set the summary. Used when listed as subcommand of parent.
       *
       * @param {string} [str]
       * @return {(string|Command)}
       */
      summary(str) {
        if (str === void 0) return this._summary;
        this._summary = str;
        return this;
      }
      /**
       * Set an alias for the command.
       *
       * You may call more than once to add multiple aliases. Only the first alias is shown in the auto-generated help.
       *
       * @param {string} [alias]
       * @return {(string|Command)}
       */
      alias(alias) {
        if (alias === void 0) return this._aliases[0];
        let command = this;
        if (this.commands.length !== 0 && this.commands[this.commands.length - 1]._executableHandler) {
          command = this.commands[this.commands.length - 1];
        }
        if (alias === command._name)
          throw new Error("Command alias can't be the same as its name");
        const matchingCommand = this.parent?._findCommand(alias);
        if (matchingCommand) {
          const existingCmd = [matchingCommand.name()].concat(matchingCommand.aliases()).join("|");
          throw new Error(
            `cannot add alias '${alias}' to command '${this.name()}' as already have command '${existingCmd}'`
          );
        }
        command._aliases.push(alias);
        return this;
      }
      /**
       * Set aliases for the command.
       *
       * Only the first alias is shown in the auto-generated help.
       *
       * @param {string[]} [aliases]
       * @return {(string[]|Command)}
       */
      aliases(aliases) {
        if (aliases === void 0) return this._aliases;
        aliases.forEach((alias) => this.alias(alias));
        return this;
      }
      /**
       * Set / get the command usage `str`.
       *
       * @param {string} [str]
       * @return {(string|Command)}
       */
      usage(str) {
        if (str === void 0) {
          if (this._usage) return this._usage;
          const args = this.registeredArguments.map((arg) => {
            return humanReadableArgName(arg);
          });
          return [].concat(
            this.options.length || this._helpOption !== null ? "[options]" : [],
            this.commands.length ? "[command]" : [],
            this.registeredArguments.length ? args : []
          ).join(" ");
        }
        this._usage = str;
        return this;
      }
      /**
       * Get or set the name of the command.
       *
       * @param {string} [str]
       * @return {(string|Command)}
       */
      name(str) {
        if (str === void 0) return this._name;
        this._name = str;
        return this;
      }
      /**
       * Set the name of the command from script filename, such as process.argv[1],
       * or require.main.filename, or __filename.
       *
       * (Used internally and public although not documented in README.)
       *
       * @example
       * program.nameFromFilename(require.main.filename);
       *
       * @param {string} filename
       * @return {Command}
       */
      nameFromFilename(filename) {
        this._name = path2.basename(filename, path2.extname(filename));
        return this;
      }
      /**
       * Get or set the directory for searching for executable subcommands of this command.
       *
       * @example
       * program.executableDir(__dirname);
       * // or
       * program.executableDir('subcommands');
       *
       * @param {string} [path]
       * @return {(string|null|Command)}
       */
      executableDir(path3) {
        if (path3 === void 0) return this._executableDir;
        this._executableDir = path3;
        return this;
      }
      /**
       * Return program help documentation.
       *
       * @param {{ error: boolean }} [contextOptions] - pass {error:true} to wrap for stderr instead of stdout
       * @return {string}
       */
      helpInformation(contextOptions) {
        const helper = this.createHelp();
        const context = this._getOutputContext(contextOptions);
        helper.prepareContext({
          error: context.error,
          helpWidth: context.helpWidth,
          outputHasColors: context.hasColors
        });
        const text = helper.formatHelp(this, helper);
        if (context.hasColors) return text;
        return this._outputConfiguration.stripColor(text);
      }
      /**
       * @typedef HelpContext
       * @type {object}
       * @property {boolean} error
       * @property {number} helpWidth
       * @property {boolean} hasColors
       * @property {function} write - includes stripColor if needed
       *
       * @returns {HelpContext}
       * @private
       */
      _getOutputContext(contextOptions) {
        contextOptions = contextOptions || {};
        const error = !!contextOptions.error;
        let baseWrite;
        let hasColors;
        let helpWidth;
        if (error) {
          baseWrite = (str) => this._outputConfiguration.writeErr(str);
          hasColors = this._outputConfiguration.getErrHasColors();
          helpWidth = this._outputConfiguration.getErrHelpWidth();
        } else {
          baseWrite = (str) => this._outputConfiguration.writeOut(str);
          hasColors = this._outputConfiguration.getOutHasColors();
          helpWidth = this._outputConfiguration.getOutHelpWidth();
        }
        const write = (str) => {
          if (!hasColors) str = this._outputConfiguration.stripColor(str);
          return baseWrite(str);
        };
        return { error, write, hasColors, helpWidth };
      }
      /**
       * Output help information for this command.
       *
       * Outputs built-in help, and custom text added using `.addHelpText()`.
       *
       * @param {{ error: boolean } | Function} [contextOptions] - pass {error:true} to write to stderr instead of stdout
       */
      outputHelp(contextOptions) {
        let deprecatedCallback;
        if (typeof contextOptions === "function") {
          deprecatedCallback = contextOptions;
          contextOptions = void 0;
        }
        const outputContext = this._getOutputContext(contextOptions);
        const eventContext = {
          error: outputContext.error,
          write: outputContext.write,
          command: this
        };
        this._getCommandAndAncestors().reverse().forEach((command) => command.emit("beforeAllHelp", eventContext));
        this.emit("beforeHelp", eventContext);
        let helpInformation = this.helpInformation({ error: outputContext.error });
        if (deprecatedCallback) {
          helpInformation = deprecatedCallback(helpInformation);
          if (typeof helpInformation !== "string" && !Buffer.isBuffer(helpInformation)) {
            throw new Error("outputHelp callback must return a string or a Buffer");
          }
        }
        outputContext.write(helpInformation);
        if (this._getHelpOption()?.long) {
          this.emit(this._getHelpOption().long);
        }
        this.emit("afterHelp", eventContext);
        this._getCommandAndAncestors().forEach(
          (command) => command.emit("afterAllHelp", eventContext)
        );
      }
      /**
       * You can pass in flags and a description to customise the built-in help option.
       * Pass in false to disable the built-in help option.
       *
       * @example
       * program.helpOption('-?, --help' 'show help'); // customise
       * program.helpOption(false); // disable
       *
       * @param {(string | boolean)} flags
       * @param {string} [description]
       * @return {Command} `this` command for chaining
       */
      helpOption(flags, description) {
        if (typeof flags === "boolean") {
          if (flags) {
            this._helpOption = this._helpOption ?? void 0;
          } else {
            this._helpOption = null;
          }
          return this;
        }
        flags = flags ?? "-h, --help";
        description = description ?? "display help for command";
        this._helpOption = this.createOption(flags, description);
        return this;
      }
      /**
       * Lazy create help option.
       * Returns null if has been disabled with .helpOption(false).
       *
       * @returns {(Option | null)} the help option
       * @package
       */
      _getHelpOption() {
        if (this._helpOption === void 0) {
          this.helpOption(void 0, void 0);
        }
        return this._helpOption;
      }
      /**
       * Supply your own option to use for the built-in help option.
       * This is an alternative to using helpOption() to customise the flags and description etc.
       *
       * @param {Option} option
       * @return {Command} `this` command for chaining
       */
      addHelpOption(option) {
        this._helpOption = option;
        return this;
      }
      /**
       * Output help information and exit.
       *
       * Outputs built-in help, and custom text added using `.addHelpText()`.
       *
       * @param {{ error: boolean }} [contextOptions] - pass {error:true} to write to stderr instead of stdout
       */
      help(contextOptions) {
        this.outputHelp(contextOptions);
        let exitCode = Number(process2.exitCode ?? 0);
        if (exitCode === 0 && contextOptions && typeof contextOptions !== "function" && contextOptions.error) {
          exitCode = 1;
        }
        this._exit(exitCode, "commander.help", "(outputHelp)");
      }
      /**
       * // Do a little typing to coordinate emit and listener for the help text events.
       * @typedef HelpTextEventContext
       * @type {object}
       * @property {boolean} error
       * @property {Command} command
       * @property {function} write
       */
      /**
       * Add additional text to be displayed with the built-in help.
       *
       * Position is 'before' or 'after' to affect just this command,
       * and 'beforeAll' or 'afterAll' to affect this command and all its subcommands.
       *
       * @param {string} position - before or after built-in help
       * @param {(string | Function)} text - string to add, or a function returning a string
       * @return {Command} `this` command for chaining
       */
      addHelpText(position, text) {
        const allowedValues = ["beforeAll", "before", "after", "afterAll"];
        if (!allowedValues.includes(position)) {
          throw new Error(`Unexpected value for position to addHelpText.
Expecting one of '${allowedValues.join("', '")}'`);
        }
        const helpEvent = `${position}Help`;
        this.on(helpEvent, (context) => {
          let helpStr;
          if (typeof text === "function") {
            helpStr = text({ error: context.error, command: context.command });
          } else {
            helpStr = text;
          }
          if (helpStr) {
            context.write(`${helpStr}
`);
          }
        });
        return this;
      }
      /**
       * Output help information if help flags specified
       *
       * @param {Array} args - array of options to search for help flags
       * @private
       */
      _outputHelpIfRequested(args) {
        const helpOption = this._getHelpOption();
        const helpRequested = helpOption && args.find((arg) => helpOption.is(arg));
        if (helpRequested) {
          this.outputHelp();
          this._exit(0, "commander.helpDisplayed", "(outputHelp)");
        }
      }
    };
    function incrementNodeInspectorPort(args) {
      return args.map((arg) => {
        if (!arg.startsWith("--inspect")) {
          return arg;
        }
        let debugOption;
        let debugHost = "127.0.0.1";
        let debugPort = "9229";
        let match;
        if ((match = arg.match(/^(--inspect(-brk)?)$/)) !== null) {
          debugOption = match[1];
        } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null) {
          debugOption = match[1];
          if (/^\d+$/.test(match[3])) {
            debugPort = match[3];
          } else {
            debugHost = match[3];
          }
        } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !== null) {
          debugOption = match[1];
          debugHost = match[3];
          debugPort = match[4];
        }
        if (debugOption && debugPort !== "0") {
          return `${debugOption}=${debugHost}:${parseInt(debugPort) + 1}`;
        }
        return arg;
      });
    }
    function useColor() {
      if (process2.env.NO_COLOR || process2.env.FORCE_COLOR === "0" || process2.env.FORCE_COLOR === "false")
        return false;
      if (process2.env.FORCE_COLOR || process2.env.CLICOLOR_FORCE !== void 0)
        return true;
      return void 0;
    }
    exports2.Command = Command;
    exports2.useColor = useColor;
  }
});

// node_modules/commander/index.js
var require_commander = __commonJS({
  "node_modules/commander/index.js"(exports2) {
    var { Argument } = require_argument();
    var { Command } = require_command();
    var { CommanderError, InvalidArgumentError } = require_error();
    var { Help } = require_help();
    var { Option } = require_option();
    exports2.program = new Command();
    exports2.createCommand = (name) => new Command(name);
    exports2.createOption = (flags, description) => new Option(flags, description);
    exports2.createArgument = (name, description) => new Argument(name, description);
    exports2.Command = Command;
    exports2.Option = Option;
    exports2.Argument = Argument;
    exports2.Help = Help;
    exports2.CommanderError = CommanderError;
    exports2.InvalidArgumentError = InvalidArgumentError;
    exports2.InvalidOptionArgumentError = InvalidArgumentError;
  }
});

// node_modules/@mnrendra/chalk-supports-color/dist/index.js
var require_dist = __commonJS({
  "node_modules/@mnrendra/chalk-supports-color/dist/index.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var T = require("node:tty");
    var b = require("node:os");
    var r = (e, o = globalThis.Deno?.args ?? process.argv) => {
      const l = o.indexOf("--" + e), t = o.indexOf("--");
      return l !== -1 && (t === -1 || l < t);
    };
    var g = (e, { streamIsTTY: o, sniffFlags: l = true } = {}) => {
      const { FORCE_COLOR: t, TF_BUILD: p, AGENT_NAME: v, TERM: i, CI: I, TRAVIS: m, CIRCLECI: C, APPVEYOR: _, GITLAB_CI: h, BUILDKITE: E, DRONE: O, GITHUB_ACTIONS: R, GITEA_ACTIONS: A, CI_NAME: M, TEAMCITY_VERSION: c, COLORTERM: d, TERM_PROGRAM: f, TERM_PROGRAM_VERSION: N } = process.env;
      if (t === "true" || t === "") return 1;
      if (t === "false") return 0;
      const u = Math.min(parseInt(t ?? "", 10), 3);
      if (u === 0 || u === 1 || u === 2 || u === 3) return u;
      if (l) {
        if (r("no-color") || r("no-colors") || r("color=false") || r("color=never")) return 0;
        if (r("color") || r("colors") || r("color=true") || r("color=always")) return 1;
        if (r("color=256")) return 2;
        if (r("color=16m") || r("color=full") || r("color=truecolor")) return 3;
      }
      if (p !== void 0 && v !== void 0) return 1;
      if (typeof e == "object" && o !== true || i === "dumb") return 0;
      if (process.platform === "win32") {
        const s = b.release().split(".");
        return Number(s[0]) >= 10 && Number(s[2]) >= 10586 ? Number(s[2]) >= 14931 ? 3 : 2 : 1;
      }
      if (I !== void 0) return R !== void 0 || A !== void 0 ? 3 : [m, C, _, h, E, O].some((s) => s !== void 0) || M === "codeship" ? 1 : 0;
      if (c !== void 0) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(c) ? 1 : 0;
      if (d === "truecolor" || i === "xterm-kitty") return 3;
      if (f !== void 0) {
        const s = parseInt((N ?? "").split(".")[0], 10);
        switch (f) {
          case "iTerm.app":
            return s >= 3 ? 3 : 2;
          case "Apple_Terminal":
            return 2;
        }
      }
      return /-256(color)?$/i.test(i ?? "") ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(i ?? "") || d !== void 0 ? 1 : 0;
    };
    var x = (e) => {
      if (!Number.isInteger(e) || ![0, 1, 2, 3].includes(e)) throw new Error("The `level` value should be an integer from 0 to 3!");
      switch (e) {
        case 0:
          return false;
        case 1:
          return { level: 1, hasBasic: true, has256: false, has16m: false };
        case 2:
          return { level: 2, hasBasic: true, has256: true, has16m: false };
        case 3:
          return { level: 3, hasBasic: true, has256: true, has16m: true };
      }
    };
    var n = (e, { streamIsTTY: o, sniffFlags: l = true } = {}) => {
      const t = g(e, { streamIsTTY: o ?? e.isTTY, sniffFlags: l });
      return x(t);
    };
    var Y = () => ({ stdout: n({ isTTY: T.isatty(1) }), stderr: n({ isTTY: T.isatty(2) }) });
    var a = Y;
    var w = a().stdout;
    var y = a().stderr;
    var B = a();
    exports2.createSupportsColor = n, exports2.default = B, exports2.stderr = y, exports2.stdout = w, exports2.supportsColor = a, module2.exports = exports2.default, Object.defineProperties(module2.exports, { __esModule: { value: exports2.__esModule }, createSupportsColor: { value: exports2.createSupportsColor }, stderr: { value: exports2.stderr }, stdout: { value: exports2.stdout }, supportsColor: { value: exports2.supportsColor }, default: { value: exports2.default } });
  }
});

// node_modules/@mnrendra/chalk-ansi-styles/dist/index.js
var require_dist2 = __commonJS({
  "node_modules/@mnrendra/chalk-ansi-styles/dist/index.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var C = "\x1B[";
    var h = { foreground: 38, background: 48 };
    var o = { reset: [0, 0], bold: [1, 22], dim: [2, 22], italic: [3, 23], underline: [4, 24], inverse: [7, 27], hidden: [8, 28], strikethrough: [9, 29], overline: [53, 55] };
    var N = 39;
    var a = { black: [30, 39], red: [31, 39], green: [32, 39], yellow: [33, 39], blue: [34, 39], magenta: [35, 39], cyan: [36, 39], white: [37, 39], gray: [90, 39], grey: [90, 39], blackBright: [90, 39], redBright: [91, 39], greenBright: [92, 39], yellowBright: [93, 39], blueBright: [94, 39], magentaBright: [95, 39], cyanBright: [96, 39], whiteBright: [97, 39] };
    var G = 49;
    var i = { bgBlack: [40, 49], bgRed: [41, 49], bgGreen: [42, 49], bgYellow: [43, 49], bgBlue: [44, 49], bgMagenta: [45, 49], bgCyan: [46, 49], bgWhite: [47, 49], bgGray: [100, 49], bgGrey: [100, 49], bgBlackBright: [100, 49], bgRedBright: [101, 49], bgGreenBright: [102, 49], bgYellowBright: [103, 49], bgBlueBright: [104, 49], bgMagentaBright: [105, 49], bgCyanBright: [106, 49], bgWhiteBright: [107, 49] };
    var c = (r) => `${C}${r}m`;
    var b = (r) => c(`${r}`);
    var v = (r, t) => c(`${r};5;${t}`);
    var k = (r, t, g, n) => c(`${r};2;${t};${g};${n}`);
    var e = (r, t) => ({ open: b(r), close: b(t) });
    var P = (r) => {
      const t = /* @__PURE__ */ new Map();
      return Object.values(r).forEach(([g, n]) => {
        t.set(g, n);
      }), t;
    };
    var d = (r) => {
      if (r < 8) return 30 + r;
      if (r < 16) return 90 + (r - 8);
      let t, g, n;
      if (r >= 232) t = ((r - 232) * 10 + 8) / 255, g = t, n = t;
      else {
        r -= 16;
        const w = r % 36;
        t = Math.floor(r / 36) / 5, g = Math.floor(w / 6) / 5, n = w % 6 / 5;
      }
      const u = Math.max(t, g, n) * 2;
      if (u === 0) return 30;
      let m = 30 + (Math.round(n) << 2 | Math.round(g) << 1 | Math.round(t));
      return u === 2 && (m += 60), m;
    };
    var s = (r, t, g) => r === t && t === g ? r < 8 ? 16 : r > 248 ? 231 : Math.round((r - 8) / 247 * 24) + 232 : 16 + 36 * Math.round(r / 255 * 5) + 6 * Math.round(t / 255 * 5) + Math.round(g / 255 * 5);
    var M = (r) => {
      const t = /[a-f\d]{6}|[a-f\d]{3}/i.exec(r.toString(16));
      if (t === null) return [0, 0, 0];
      let [g] = t;
      g.length === 3 && (g = [...g].map((u) => u + u).join(""));
      const n = Number.parseInt(g, 16);
      return [n >> 16 & 255, n >> 8 & 255, n & 255];
    };
    var p = (r) => {
      const [t, g, n] = M(r);
      return s(t, g, n);
    };
    var $ = (r) => {
      const t = p(r);
      return d(t);
    };
    var x = (r, t, g) => {
      const n = s(r, t, g);
      return d(n);
    };
    var B = { reset: e(...o.reset), bold: e(...o.bold), dim: e(...o.dim), italic: e(...o.italic), underline: e(...o.underline), inverse: e(...o.inverse), hidden: e(...o.hidden), strikethrough: e(...o.strikethrough), overline: e(...o.overline) };
    var y = { black: e(...a.black), red: e(...a.red), green: e(...a.green), yellow: e(...a.yellow), blue: e(...a.blue), magenta: e(...a.magenta), cyan: e(...a.cyan), white: e(...a.white), gray: e(...a.gray), grey: e(...a.grey), blackBright: e(...a.blackBright), redBright: e(...a.redBright), greenBright: e(...a.greenBright), yellowBright: e(...a.yellowBright), blueBright: e(...a.blueBright), magentaBright: e(...a.magentaBright), cyanBright: e(...a.cyanBright), whiteBright: e(...a.whiteBright) };
    var f = { bgBlack: e(...i.bgBlack), bgRed: e(...i.bgRed), bgGreen: e(...i.bgGreen), bgYellow: e(...i.bgYellow), bgBlue: e(...i.bgBlue), bgMagenta: e(...i.bgMagenta), bgCyan: e(...i.bgCyan), bgWhite: e(...i.bgWhite), bgGray: e(...i.bgGray), bgGrey: e(...i.bgGrey), bgBlackBright: e(...i.bgBlackBright), bgRedBright: e(...i.bgRedBright), bgGreenBright: e(...i.bgGreenBright), bgYellowBright: e(...i.bgYellowBright), bgBlueBright: e(...i.bgBlueBright), bgMagentaBright: e(...i.bgMagentaBright), bgCyanBright: e(...i.bgCyanBright), bgWhiteBright: e(...i.bgWhiteBright) };
    var l = { ...B, ...y, ...f };
    Object.defineProperty(l, "modifier", { value: B, writable: false, enumerable: false, configurable: false });
    var R = { ...y, close: b(N), ansi: b, ansi256: (r) => v(h.foreground, r), ansi16m: (r, t, g) => k(h.foreground, r, t, g) };
    Object.defineProperty(l, "color", { value: R, writable: false, enumerable: false, configurable: false });
    var T = { ...f, close: b(G), ansi: b, ansi256: (r) => v(h.background, r), ansi16m: (r, t, g) => k(h.background, r, t, g) };
    Object.defineProperty(l, "bgColor", { value: T, writable: false, enumerable: false, configurable: false });
    var W = P({ ...o, ...a, ...i });
    Object.defineProperty(l, "codes", { value: W, writable: false, enumerable: false, configurable: false }), Object.defineProperty(l, "rgbToAnsi256", { value: s, writable: false, enumerable: false, configurable: false }), Object.defineProperty(l, "hexToRgb", { value: M, writable: false, enumerable: false, configurable: false }), Object.defineProperty(l, "hexToAnsi256", { value: p, writable: false, enumerable: false, configurable: false }), Object.defineProperty(l, "ansi256ToAnsi", { value: d, writable: false, enumerable: false, configurable: false }), Object.defineProperty(l, "rgbToAnsi", { value: x, writable: false, enumerable: false, configurable: false }), Object.defineProperty(l, "hexToAnsi", { value: $, writable: false, enumerable: false, configurable: false });
    var Y = Object.keys(B);
    var j = Object.keys(y);
    var O = Object.keys(f);
    var _ = [...j, ...O];
    var A = l;
    exports2.ansiStyles = A, exports2.backgroundColorNames = O, exports2.colorNames = _, exports2.default = l, exports2.foregroundColorNames = j, exports2.modifierNames = Y, module2.exports = exports2.default, Object.defineProperties(module2.exports, { __esModule: { value: exports2.__esModule }, ansiStyles: { value: exports2.ansiStyles }, backgroundColorNames: { value: exports2.backgroundColorNames }, colorNames: { value: exports2.colorNames }, foregroundColorNames: { value: exports2.foregroundColorNames }, modifierNames: { value: exports2.modifierNames }, default: { value: exports2.default } });
  }
});

// node_modules/@mnrendra/chalk/dist/index.js
var require_dist3 = __commonJS({
  "node_modules/@mnrendra/chalk/dist/index.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var u = require_dist();
    var o = require_dist2();
    var k = u.stdout;
    var C = u.stderr;
    var w = (l, { level: e } = {}) => {
      if (e !== void 0 && ![0, 1, 2, 3].includes(e)) throw new Error("The `level` option should be an integer from 0 to 3!");
      const g = u.stdout !== false ? u.stdout.level : 0;
      l.level = e ?? g;
    };
    var c = Symbol("GENERATOR");
    var h = Symbol("IS_EMPTY");
    var s = Symbol("STYLER");
    var B = { proto: () => {
    } };
    var N = o.modifierNames;
    var O = o.foregroundColorNames;
    var S = o.backgroundColorNames;
    var x = o.colorNames;
    var y = (l, e, g) => {
      let t, i;
      return g === void 0 ? (t = l, i = e) : (t = g.openAll + l, i = e + g.closeAll), { open: l, close: e, openAll: t, closeAll: i, parent: g };
    };
    var G = (l, e, g) => {
      let t = l.indexOf(e);
      if (t === -1) return l;
      const i = e.length;
      let n = 0, a = "";
      do
        a += l.slice(n, t) + e + g, n = t + i, t = l.indexOf(e, n);
      while (t !== -1);
      return a += l.slice(n), a;
    };
    var R = (l, e, g, t) => {
      let i = 0, n = "";
      do {
        const a = l[t - 1] === "\r";
        n += l.slice(i, a ? t - 1 : t) + e + (a ? `\r
` : `
`) + g, i = t + 1, t = l.indexOf(`
`, i);
      } while (t !== -1);
      return n += l.slice(i), n;
    };
    var j = (l, e) => {
      if (l.level <= 0 || typeof e != "string" || e === "") return l[h] === true ? "" : e;
      let g = l[s];
      if (g === void 0) return e;
      const { open: t, close: i, openAll: n, closeAll: a } = g;
      if (e.includes("\x1B")) for (; g !== void 0; ) e = G(e, i, t), g = g.parent;
      const v = e.indexOf(`
`);
      return v !== -1 && (e = R(e, a, n, v)), n + e + a;
    };
    var d = (l, e, g) => {
      const t = (...i) => j(t, i.join(" "));
      return Object.setPrototypeOf(t, B.proto), t[c] = l, t[s] = e, t[h] = g, t;
    };
    var { entries: A, defineProperty: P } = Object;
    var M = (l) => {
      for (const [e, { open: g, close: t }] of A(o.ansiStyles)) l[e] = { get() {
        const i = this, n = y(g, t, i[s]), a = d(i, n, i[h]);
        return P(i, e, { value: a }), a;
      } };
    };
    var Y = (l) => {
      l.visible = { get() {
        const e = this, g = d(e, e[s], true);
        return Object.defineProperty(e, "visible", { value: g }), g;
      } };
    };
    var W = ["ansi", "ansi", "ansi256", "ansi16m"];
    var T = ["rgb", "hex", "ansi256"];
    var f = (l, e, g, ...t) => {
      if (l === "rgb") {
        if (e === "ansi16m") return o.ansiStyles[g].ansi16m(t[0], t[1], t[2]);
        if (e === "ansi256") {
          const n = o.ansiStyles.rgbToAnsi256(t[0], t[1], t[2]);
          return o.ansiStyles[g].ansi256(n);
        }
        const i = o.ansiStyles.rgbToAnsi(t[0], t[1], t[2]);
        return o.ansiStyles[g].ansi(i);
      }
      if (l === "hex") {
        const i = o.ansiStyles.hexToRgb(t[0]);
        return f("rgb", e, g, ...i);
      }
      return o.ansiStyles[g].ansi256(t[0]);
    };
    var p = (l, e, g) => (...t) => {
      const i = f(e, W[l.level], g, ...t), { close: n } = o.ansiStyles[g], a = y(i, n, l[s]);
      return d(l, a, l[h]);
    };
    var _ = (l) => {
      for (const e of T) {
        l[e] = { get() {
          return p(this, e, "color");
        } };
        const g = "bg" + e[0].toUpperCase() + e.slice(1);
        l[g] = { get() {
          return p(this, e, "bgColor");
        } };
      }
    };
    var { setPrototypeOf: E, defineProperties: m } = Object;
    var H = (l) => {
      const e = /* @__PURE__ */ Object.create(null);
      E(l.prototype, Function.prototype), M(e), Y(e), _(e), B.proto = m(() => {
      }, { ...e, level: { enumerable: true, get() {
        return this[c].level;
      }, set(g) {
        this[c].level = g;
      } } }), m(l.prototype, e);
    };
    function b(l = {}) {
      const e = (...g) => g.join(" ");
      return w(e, l), Object.setPrototypeOf(e, b.prototype), e;
    }
    H(b);
    var r = b();
    var q = b({ level: u.stderr !== false ? u.stderr.level : 0 });
    var F = r.reset;
    var I = r.bold;
    var L = r.dim;
    var U = r.italic;
    var $ = r.underline;
    var z = r.inverse;
    var D = r.hidden;
    var J = r.strikethrough;
    var K = r.overline;
    var Q = r.black;
    var V = r.red;
    var X = r.green;
    var Z2 = r.yellow;
    var ee = r.blue;
    var re = r.magenta;
    var le = r.cyan;
    var te = r.white;
    var ge = r.gray;
    var ie = r.grey;
    var oe = r.blackBright;
    var ne = r.redBright;
    var ae = r.greenBright;
    var ue = r.yellowBright;
    var se = r.blueBright;
    var be = r.magentaBright;
    var he = r.cyanBright;
    var ce = r.whiteBright;
    var de = r.bgBlack;
    var ve = r.bgRed;
    var Be = r.bgGreen;
    var ye = r.bgYellow;
    var fe = r.bgBlue;
    var pe = r.bgMagenta;
    var me = r.bgCyan;
    var ke = r.bgWhite;
    var Ce = r.bgGray;
    var we = r.bgGrey;
    var Ne = r.bgBlackBright;
    var Oe = r.bgRedBright;
    var Se = r.bgGreenBright;
    var xe = r.bgYellowBright;
    var Ge = r.bgBlueBright;
    var Re = r.bgMagentaBright;
    var je = r.bgCyanBright;
    var Ae = r.bgWhiteBright;
    var Pe = r.visible;
    var Me = r.hex;
    var Ye = r.rgb;
    var We = r.ansi256;
    var Te = r.bgHex;
    var _e = r.bgRgb;
    var Ee = r.bgAnsi256;
    Object.defineProperty(exports2, "backgroundColorNames", { get: function() {
      return o.backgroundColorNames;
    } }), Object.defineProperty(exports2, "colorNames", { get: function() {
      return o.colorNames;
    } }), Object.defineProperty(exports2, "foregroundColorNames", { get: function() {
      return o.foregroundColorNames;
    } }), Object.defineProperty(exports2, "modifierNames", { get: function() {
      return o.modifierNames;
    } }), exports2.Chalk = b, exports2.ansi256 = We, exports2.backgroundColors = S, exports2.bgAnsi256 = Ee, exports2.bgBlack = de, exports2.bgBlackBright = Ne, exports2.bgBlue = fe, exports2.bgBlueBright = Ge, exports2.bgCyan = me, exports2.bgCyanBright = je, exports2.bgGray = Ce, exports2.bgGreen = Be, exports2.bgGreenBright = Se, exports2.bgGrey = we, exports2.bgHex = Te, exports2.bgMagenta = pe, exports2.bgMagentaBright = Re, exports2.bgRed = ve, exports2.bgRedBright = Oe, exports2.bgRgb = _e, exports2.bgWhite = ke, exports2.bgWhiteBright = Ae, exports2.bgYellow = ye, exports2.bgYellowBright = xe, exports2.black = Q, exports2.blackBright = oe, exports2.blue = ee, exports2.blueBright = se, exports2.bold = I, exports2.chalk = r, exports2.chalkStderr = q, exports2.colors = x, exports2.cyan = le, exports2.cyanBright = he, exports2.default = r, exports2.dim = L, exports2.foregroundColors = O, exports2.gray = ge, exports2.green = X, exports2.greenBright = ae, exports2.grey = ie, exports2.hex = Me, exports2.hidden = D, exports2.inverse = z, exports2.italic = U, exports2.magenta = re, exports2.magentaBright = be, exports2.modifiers = N, exports2.overline = K, exports2.red = V, exports2.redBright = ne, exports2.reset = F, exports2.rgb = Ye, exports2.strikethrough = J, exports2.supportsColor = k, exports2.supportsColorStderr = C, exports2.underline = $, exports2.visible = Pe, exports2.white = te, exports2.whiteBright = ce, exports2.yellow = Z2, exports2.yellowBright = ue, module2.exports = exports2.default, Object.defineProperties(module2.exports, { __esModule: { value: exports2.__esModule }, backgroundColorNames: { get: function() {
      return o.backgroundColorNames;
    } }, colorNames: { get: function() {
      return o.colorNames;
    } }, foregroundColorNames: { get: function() {
      return o.foregroundColorNames;
    } }, modifierNames: { get: function() {
      return o.modifierNames;
    } }, Chalk: { value: exports2.Chalk }, ansi256: { value: exports2.ansi256 }, backgroundColors: { value: exports2.backgroundColors }, bgAnsi256: { value: exports2.bgAnsi256 }, bgBlack: { value: exports2.bgBlack }, bgBlackBright: { value: exports2.bgBlackBright }, bgBlue: { value: exports2.bgBlue }, bgBlueBright: { value: exports2.bgBlueBright }, bgCyan: { value: exports2.bgCyan }, bgCyanBright: { value: exports2.bgCyanBright }, bgGray: { value: exports2.bgGray }, bgGreen: { value: exports2.bgGreen }, bgGreenBright: { value: exports2.bgGreenBright }, bgGrey: { value: exports2.bgGrey }, bgHex: { value: exports2.bgHex }, bgMagenta: { value: exports2.bgMagenta }, bgMagentaBright: { value: exports2.bgMagentaBright }, bgRed: { value: exports2.bgRed }, bgRedBright: { value: exports2.bgRedBright }, bgRgb: { value: exports2.bgRgb }, bgWhite: { value: exports2.bgWhite }, bgWhiteBright: { value: exports2.bgWhiteBright }, bgYellow: { value: exports2.bgYellow }, bgYellowBright: { value: exports2.bgYellowBright }, black: { value: exports2.black }, blackBright: { value: exports2.blackBright }, blue: { value: exports2.blue }, blueBright: { value: exports2.blueBright }, bold: { value: exports2.bold }, chalk: { value: exports2.chalk }, chalkStderr: { value: exports2.chalkStderr }, colors: { value: exports2.colors }, cyan: { value: exports2.cyan }, cyanBright: { value: exports2.cyanBright }, dim: { value: exports2.dim }, foregroundColors: { value: exports2.foregroundColors }, gray: { value: exports2.gray }, green: { value: exports2.green }, greenBright: { value: exports2.greenBright }, grey: { value: exports2.grey }, hex: { value: exports2.hex }, hidden: { value: exports2.hidden }, inverse: { value: exports2.inverse }, italic: { value: exports2.italic }, magenta: { value: exports2.magenta }, magentaBright: { value: exports2.magentaBright }, modifiers: { value: exports2.modifiers }, overline: { value: exports2.overline }, red: { value: exports2.red }, redBright: { value: exports2.redBright }, reset: { value: exports2.reset }, rgb: { value: exports2.rgb }, strikethrough: { value: exports2.strikethrough }, supportsColor: { value: exports2.supportsColor }, supportsColorStderr: { value: exports2.supportsColorStderr }, underline: { value: exports2.underline }, visible: { value: exports2.visible }, white: { value: exports2.white }, whiteBright: { value: exports2.whiteBright }, yellow: { value: exports2.yellow }, yellowBright: { value: exports2.yellowBright }, default: { value: exports2.default } });
  }
});

// src/error.ts
var error_exports = {};
__export(error_exports, {
  Errors: () => Errors
});
var import_chalk, Errors;
var init_error = __esm({
  "src/error.ts"() {
    "use strict";
    import_chalk = __toESM(require_dist3());
    ((Errors2) => {
      const colon = import_chalk.default.reset(":");
      const exclamation = import_chalk.default.reset("!");
      const dash = import_chalk.default.reset("-");
      const newline = import_chalk.default.reset("\n");
      class MainError {
        constructor(message, stack) {
          this.message = message;
          this.stack = stack;
        }
        count = 0;
      }
      Errors2.MainError = MainError;
      ;
      function highlight(position, highlight2) {
        return import_chalk.default.cyan(position?.path) + colon + import_chalk.default.yellow(String(position?.line)) + colon + import_chalk.default.yellow(String(position?.column)) + newline + import_chalk.default.white.bgRed(highlight2);
      }
      ;
      let Parts2;
      ((Parts3) => {
        class PartError extends MainError {
          constructor(message, position, contents) {
            super(
              import_chalk.default.red.bold("A parsing error has occurred") + exclamation + newline + message + newline + highlight(position, contents)
            );
          }
        }
        Parts3.PartError = PartError;
        ;
        class Unknown extends PartError {
          constructor(contents, position) {
            super(
              import_chalk.default.red("Unknown token detected") + colon,
              position,
              contents
            );
          }
        }
        Parts3.Unknown = Unknown;
        ;
      })(Parts2 = Errors2.Parts || (Errors2.Parts = {}));
      ;
      let Syntax2;
      ((Syntax3) => {
        class SyntaxError extends MainError {
          constructor(message, position, contents) {
            super(
              import_chalk.default.red.bold("A syntax error has occurred") + exclamation + newline,
              message + newline + highlight(position, contents)
            );
          }
        }
        Syntax3.SyntaxError = SyntaxError;
        ;
        class Generic extends SyntaxError {
          constructor(contents, position) {
            super(
              import_chalk.default.red("Syntax is invalid") + colon,
              position,
              contents
            );
          }
        }
        Syntax3.Generic = Generic;
        ;
        class Duplicate extends SyntaxError {
          constructor(contents, position) {
            super(
              import_chalk.default.red(`Duplicate entries for ${contents}`) + colon,
              position,
              contents
            );
          }
        }
        Syntax3.Duplicate = Duplicate;
        ;
      })(Syntax2 = Errors2.Syntax || (Errors2.Syntax = {}));
      ;
      let Reference;
      ((Reference2) => {
        class ReferenceError2 extends MainError {
          constructor(message, contents, position) {
            super(
              import_chalk.default.red.bold("A reference error has occured") + exclamation + newline + message + "\n" + highlight(position, contents)
            );
          }
        }
        Reference2.ReferenceError = ReferenceError2;
        ;
        class Undefined extends ReferenceError2 {
          constructor(reference, position) {
            super(
              import_chalk.default.red("Undefined reference") + colon + newline + reference + newline,
              reference,
              position
            );
          }
        }
        Reference2.Undefined = Undefined;
        ;
      })(Reference = Errors2.Reference || (Errors2.Reference = {}));
      ;
      let Command;
      ((Command2) => {
        class CommandError extends MainError {
          constructor(message) {
            super(
              import_chalk.default.red.bold("A command error has occurred") + exclamation + newline + message
            );
            console.log(this.message);
            process.exit(1);
          }
        }
        Command2.CommandError = CommandError;
        ;
        let Missing;
        ((Missing2) => {
          class Parameters extends CommandError {
            constructor(parameters) {
              super(
                import_chalk.default.red("Missing parameters") + colon + newline + parameters.join(", ")
              );
            }
          }
          Missing2.Parameters = Parameters;
          ;
        })(Missing = Command2.Missing || (Command2.Missing = {}));
        ;
        let Conflicting;
        ((Conflicting2) => {
          class Parameters extends CommandError {
            constructor(parameters) {
              super(
                import_chalk.default.red("Conflicting parameters found") + colon + newline + parameters.join(", ")
              );
            }
          }
          Conflicting2.Parameters = Parameters;
          ;
        })(Conflicting = Command2.Conflicting || (Command2.Conflicting = {}));
        ;
      })(Command = Errors2.Command || (Errors2.Command = {}));
      ;
    })(Errors || (Errors = {}));
  }
});

// src/parts.ts
var Parts;
var init_parts = __esm({
  "src/parts.ts"() {
    "use strict";
    init_error();
    ((Parts2) => {
      let PartType;
      ((PartType2) => {
        PartType2["WORD"] = "/([a-zA-Z$_][a-zA-Z0-9$_]*)/g";
        PartType2["NUMBER"] = "/([0-9][0-9]*)/g";
        PartType2["DOUBLE_QUOTE_STRING"] = '/\\"(.*)\\"/g';
        PartType2["SINGLE_QUOTE_STRING"] = "/\\'(.*)\\'/g";
        PartType2["BACKTICK_QUOTE_STRING"] = "/\\`([^\\0]+)\\`/g";
        PartType2["BACKTICK_INTERPOLATION"] = "/\\$\\{[^\\0]+\\}/g";
        PartType2["PARENTHESIS_OPEN"] = "/\\(/g";
        PartType2["PARENTHESIS_CLOSE"] = "/\\)/g";
        PartType2["SQUARE_BRACKET_OPEN"] = "/\\[/g";
        PartType2["SQUARE_BRACKET_CLOSE"] = "/\\]/g";
        PartType2["CURLY_BRACKET_OPEN"] = "/\\{/g";
        PartType2["CURLY_BRACKET_CLOSE"] = "/\\}/g";
        PartType2["ANGLE_BRACKET_OPEN"] = "/\\</g";
        PartType2["ANGLE_BRACKET_CLOSE"] = "/\\>/g";
        PartType2["COLON"] = "/\\:/g";
        PartType2["COMMA"] = "/\\,/g";
        PartType2["PERIOD"] = "/\\./g";
        PartType2["SEMICOLON"] = "/\\;/g";
        PartType2["EQUALS"] = "/\\=/g";
        PartType2["EXTRA_WHITESPACE"] = "/\\s+/g";
        PartType2["UNKNOWN"] = "/\\0/g";
      })(PartType = Parts2.PartType || (Parts2.PartType = {}));
      ;
      function parseRegex(str) {
        const match = str.match(/^\/(.*)\/([a-z]*)$/i);
        if (!match) return "/\\0/g" /* UNKNOWN */;
        const [, pattern, flags] = match;
        return new RegExp(pattern, flags);
      }
      Parts2.parseRegex = parseRegex;
      ;
      function toParts(content, path2) {
        const parts = [];
        const position = {};
        const origin = content.split("\n");
        let done = false;
        position.path = path2;
        while (!done) {
          for (const partType of Object.values(PartType)) {
            const match = content.match(parseRegex(partType));
            if (partType == "/\\0/g" /* UNKNOWN */) {
              throw new Errors.Parts.Unknown(content[0], position);
            }
            ;
            if (!match) continue;
            if (content.indexOf(match[0]) == 0) {
              if (partType == "/\\s+/g" /* EXTRA_WHITESPACE */) {
                content = content.slice(match[0].length).trim();
                break;
              }
              ;
              position.line = origin.indexOf(content.split("\n")[0]) + 1 || position.line;
              parts.push({ content: match[0] || content, type: partType, position });
              content = content.slice(match[0].length).trim();
              if (content == "" || match[0] == content) {
                done = true;
              }
              ;
              break;
            }
            ;
          }
          ;
        }
        ;
        return parts;
      }
      Parts2.toParts = toParts;
      ;
    })(Parts || (Parts = {}));
  }
});

// src/feature.ts
var Feature;
var init_feature = __esm({
  "src/feature.ts"() {
    "use strict";
    ((_Feature) => {
      class Feature2 {
        constructor(sequence) {
          this.sequence = sequence;
        }
        create(data, scope, position) {
          return { scope };
        }
        toAssembly(feature, scope) {
          return "";
        }
        match(parts) {
          let i = 0;
          let p = 0;
          let d = 0;
          const matchedParts = [];
          const exports2 = {};
          while (i < this.sequence.length && p < parts.length) {
            const sequenceItem = this.sequence[i];
            const currentPart = parts[p];
            let matched = false;
            if (sequenceItem.part) {
              if (sequenceItem.part.type === currentPart.type && (sequenceItem.part.value === void 0 || sequenceItem.part.value === currentPart.content)) {
                matchedParts.push(currentPart);
                matched = true;
                p++;
                i++;
              }
              ;
              if (sequenceItem.export) {
                exports2[sequenceItem.export] = currentPart.content;
              }
              ;
            } else if (sequenceItem.feature) {
              const subFeature = new sequenceItem.feature.type();
              const result = subFeature.match(parts.slice(p));
              if (result) {
                matchedParts.push(...result.parts);
                p += result.length;
                i++;
                matched = true;
                if (sequenceItem.export) {
                  exports2[sequenceItem.export] = result.exports;
                }
                ;
              }
              ;
            } else if (sequenceItem.or) {
              for (const altSeq of sequenceItem.or) {
                const altFeature = new Feature2(altSeq);
                const result = altFeature.match(parts.slice(p));
                if (result) {
                  matchedParts.push(...result.parts);
                  p += result.parts.length;
                  matched = true;
                  if (sequenceItem.export) {
                    exports2[sequenceItem.export] = result.exports;
                  }
                  ;
                  break;
                }
                ;
              }
              ;
              if (matched) i++;
            } else if (sequenceItem.repeat) {
              const repeatFeature = new Feature2(sequenceItem.repeat);
              let repeatMatched = true;
              while (repeatMatched) {
                const result = repeatFeature.match(parts.slice(p));
                if (result) {
                  matchedParts.push(...result.parts);
                  p += result.parts.length;
                  if (sequenceItem.export) {
                    if (!exports2[sequenceItem.export]) {
                      exports2[sequenceItem.export] = [];
                    }
                    ;
                    exports2[sequenceItem.export].push(result.exports);
                  }
                  ;
                } else {
                  repeatMatched = false;
                }
                ;
              }
              ;
              matched = true;
              i++;
            } else if (sequenceItem.between) {
              let balance = 0;
              let j = 0;
              for (const part of parts.slice(p)) {
                if (part.type == sequenceItem.between.left.part?.type) {
                  balance++;
                }
                ;
                if (part.type == sequenceItem.between.right.part?.type) {
                  balance--;
                }
                ;
                j++;
                p++;
                if (balance == -1) {
                  p--;
                  j--;
                  break;
                }
                ;
              }
              ;
              const between = parts.slice(p - j, p);
              if (sequenceItem.export) {
                exports2[sequenceItem.export] = between;
              }
              ;
              matched = true;
              i++;
            }
            ;
            if (!matched) {
              if (sequenceItem.required !== false) {
                return null;
              } else {
                exports2[sequenceItem.export || "?"] = null;
                i++;
              }
              ;
            }
            ;
          }
          ;
          if (i === this.sequence.length) {
            return { parts: matchedParts, length: p, exports: exports2 };
          }
          ;
          return null;
        }
      }
      _Feature.Feature = Feature2;
      ;
      function generateId(label, scope) {
        const base62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        const size = 64;
        let n = size;
        let current = scope.parent;
        let id = scope.label + "_";
        while (current) {
          id += current.label + "_";
          current = current.parent;
        }
        ;
        id += `$${label}$`;
        while (n > 0) {
          id += base62[Math.floor(Math.random() * 62)];
          n--;
        }
        ;
        return id;
      }
      _Feature.generateId = generateId;
      ;
      class Scope {
        constructor(importer, label, parent) {
          this.importer = importer;
          this.label = label;
          this.parent = parent;
          this._data = parent?._data || {};
          this._alias = parent?._alias || {};
          this.id = generateId(this.label, this);
        }
        set(name, value) {
          this._data[name] = value;
        }
        get(name) {
          return this._data[name];
        }
        alias(name) {
          const id = generateId(name, this);
          this._alias[name] = id;
          return id;
        }
        resolve(name) {
          return this._alias[name];
        }
        _data;
        _alias;
        id;
      }
      _Feature.Scope = Scope;
      ;
    })(Feature || (Feature = {}));
  }
});

// src/features/identifier.ts
var Identifier;
var init_identifier = __esm({
  "src/features/identifier.ts"() {
    "use strict";
    init_feature();
    init_parts();
    Identifier = class extends Feature.Feature {
      constructor() {
        super([
          { "part": { "type": Parts.PartType.WORD }, "export": "name" },
          { "repeat": [
            { "part": { "type": Parts.PartType.PERIOD } },
            { "part": { "type": Parts.PartType.WORD }, "export": "property" }
          ], "export": "location" }
        ]);
      }
      create(data, scope, position) {
        return { scope, export: {
          location: data.location?.join(".")
        } };
      }
    };
  }
});

// src/features/accessor.ts
var Accessor;
var init_accessor = __esm({
  "src/features/accessor.ts"() {
    "use strict";
    init_feature();
    init_identifier();
    Accessor = class extends Feature.Feature {
      constructor() {
        super([
          {
            "or": [
              [
                { "feature": { "type": Identifier }, "export": "identifier" }
              ]
            ],
            "export": "declaration"
          }
        ]);
      }
      create(data, scope, position) {
        let propertyData = {};
        console.log(data);
        return { scope, exports: propertyData };
      }
      toAssembly(propertyData, scope) {
        let content = `// ???
`;
        return content;
      }
    };
  }
});

// src/features/type.ts
var Type, TypeRef;
var init_type = __esm({
  "src/features/type.ts"() {
    "use strict";
    init_feature();
    init_parts();
    init_error();
    init_identifier();
    Type = class extends Feature.Feature {
      constructor() {
        super([
          { "part": { "type": Parts.PartType.WORD, "value": "type" } },
          { "part": { "type": Parts.PartType.WORD }, "export": "name" },
          {
            "or": [
              [
                { "part": { "type": Parts.PartType.EQUALS } },
                { "part": { "type": Parts.PartType.CURLY_BRACKET_OPEN } },
                {
                  "repeat": [
                    { "part": { "type": Parts.PartType.WORD }, "export": "name" },
                    { "part": { "type": Parts.PartType.COLON } },
                    { "feature": { "type": TypeRef }, "export": "typeRef" },
                    { "part": { "type": Parts.PartType.COMMA }, "required": false, "export": "comma" }
                  ],
                  "export": "fields"
                },
                { "part": { "type": Parts.PartType.CURLY_BRACKET_CLOSE } }
              ],
              [
                { "feature": { "type": TypeRef }, "export": "alias" }
              ]
            ],
            "export": "type"
          }
        ]);
      }
      static get(data, scope) {
        if (data.type.alias) {
          return scope.get(`type.${scope.resolve(data.type.alias.name)}`);
        }
        ;
      }
      create(data, scope, position) {
        const typeData = {};
        typeData.name = data.name;
        typeData.id = `type.${scope.alias(data.name)}`;
        if (data.type.fields) {
          let fields = [];
          for (const i in data.type.fields) {
            const item = data.type.fields[i];
            if (!item.comma && Number(i) < data.type.fields.length - 1) {
              throw new Errors.Syntax.Generic(data.type.fields[String(Number(i) + 1)], position);
            }
            ;
            item.id = `type_field.${scope.alias(item.name)}`;
            if (fields.map((v) => {
              return v?.name == item?.name && v && item;
            }).includes(true)) {
              throw new Errors.Syntax.Duplicate(item.name, position);
            }
            ;
            scope.set(item.id, item);
            fields.push(item);
          }
          ;
          typeData.fields = fields;
        }
        ;
        scope.set(typeData.id, typeData);
        return { scope, exports: typeData };
      }
      toAssembly(typeData, scope) {
        let content = `TYPE ${typeData?.id}
`;
        if (typeData.fields) {
          for (const _field of typeData.fields || []) {
            const field = _field;
            content += "	TYPE_FIELD ";
            const type = scope.get(field.id);
            if (!type) {
              throw new Errors.Reference.Undefined(field.name, field.position);
            }
            ;
            if (type.typeRef.type?.alias.name == "byte") {
              content += "BYTE, ";
            } else {
              if (type.typeRef.type.alias) {
                const alias = scope.get(`type.${scope.resolve(type.typeRef.type.alias.name)}`);
                content += `${alias.id}, `;
              } else {
              }
              ;
            }
            ;
            content += `${type.id}, `;
            content += "\n";
          }
          ;
        }
        ;
        content += "TYPE_END\n";
        return content;
      }
    };
    TypeRef = class extends Feature.Feature {
      constructor() {
        super([
          {
            "or": [
              [
                { "feature": { "type": Identifier }, "export": "alias" }
              ]
              /*	[
              		{
              			'repeat': [
              				{ 'part': { 'type': Parts.PartType.SQUARE_BRACKET_OPEN } },
              				{ 'part': { 'type': Parts.PartType.NUMBER }, 'required': false, 'export': 'size' },
              				{ 'part': { 'type': Parts.PartType.SQUARE_BRACKET_CLOSE } },
              			], 'export': 'size'
              		}
              	]*/
              // Replace with features/array.ts
            ],
            "export": "type"
          }
        ]);
      }
    };
  }
});

// src/features/variable.ts
var Variable;
var init_variable = __esm({
  "src/features/variable.ts"() {
    "use strict";
    init_feature();
    init_parts();
    init_type();
    init_accessor();
    Variable = class extends Feature.Feature {
      constructor() {
        super([
          { "part": { "type": Parts.PartType.WORD, "value": "let" } },
          { "part": { "type": Parts.PartType.WORD }, "export": "name" },
          { "part": { "type": Parts.PartType.COLON } },
          { "feature": { "type": TypeRef }, "export": "type" },
          {
            "or": [
              [
                { "part": { "type": Parts.PartType.EQUALS } },
                { "feature": { "type": Accessor }, "export": "acessor" }
              ]
            ],
            "export": "declaration"
          }
        ]);
      }
      create(data, scope, position) {
        let variableData = {};
        variableData.name = data.name;
        variableData.id = `var.${scope.alias(variableData.name)}`;
        console.log(variableData, data);
        return { scope, exports: variableData };
      }
      toAssembly(variableData, scope) {
        let content = `VAR ${variableData.id}
`;
        return content;
      }
    };
  }
});

// src/assembler.ts
var Assembler;
var init_assembler = __esm({
  "src/assembler.ts"() {
    "use strict";
    ((Assembler2) => {
      function assemble(syntaxData, isMain) {
        let content = isMain ? '#include "z.S"\n' : "";
        for (const data of syntaxData) {
          content += data.feature.toAssembly(data.exports, data.scope);
        }
        ;
        console.log(content);
        return content;
      }
      Assembler2.assemble = assemble;
      ;
    })(Assembler || (Assembler = {}));
  }
});

// src/features/body.ts
var Body;
var init_body = __esm({
  "src/features/body.ts"() {
    "use strict";
    init_feature();
    init_parts();
    Body = class extends Feature.Feature {
      constructor() {
        super([
          { "part": { "type": Parts.PartType.CURLY_BRACKET_OPEN } },
          { "between": {
            "left": { "part": { "type": Parts.PartType.CURLY_BRACKET_OPEN } },
            "right": { "part": { "type": Parts.PartType.CURLY_BRACKET_CLOSE } }
          }, "export": "parts" },
          { "part": { "type": Parts.PartType.CURLY_BRACKET_CLOSE } }
        ]);
      }
      create(data, scope, position) {
        let bodyData = {};
        console.log(bodyData, data);
        return { scope, exports: bodyData };
      }
      toAssembly(bodyData, scope) {
        let content = ``;
        return content;
      }
    };
  }
});

// src/features/function.ts
var Function2;
var init_function = __esm({
  "src/features/function.ts"() {
    "use strict";
    init_feature();
    init_parts();
    init_syntax();
    init_assembler();
    init_type();
    init_body();
    Function2 = class extends Feature.Feature {
      constructor() {
        super([
          { "part": { "type": Parts.PartType.WORD, "value": "function" } },
          { "part": { "type": Parts.PartType.WORD }, "export": "name" },
          { "part": { "type": Parts.PartType.PARENTHESIS_OPEN } },
          { "repeat": [
            { "part": { "type": Parts.PartType.WORD }, "export": "name" },
            { "part": { "type": Parts.PartType.COLON } },
            { "feature": { "type": TypeRef }, "export": "type" },
            { "part": { "type": Parts.PartType.COMMA }, "required": false, "export": "comma" }
          ], "export": "parameters", required: false },
          { "part": { "type": Parts.PartType.PARENTHESIS_CLOSE } },
          { "part": { "type": Parts.PartType.COLON } },
          { "feature": { "type": TypeRef }, "export": "type" },
          { "feature": { "type": Body }, "export": "body" }
        ]);
      }
      create(data, scope, position) {
        let functionData = {};
        functionData.name = data.name;
        functionData.id = `function.${scope.alias(functionData.name)}`;
        functionData.scope = new Feature.Scope(scope.importer, functionData.name, scope);
        functionData.type = data.type;
        functionData.parameters = data.parameters;
        const features = Syntax.toFeatures(data.body.parts, functionData.scope, position);
        functionData.body = features;
        console.log(functionData, data);
        scope.set(functionData.id, functionData);
        return { scope, exports: functionData };
      }
      toAssembly(functionData, scope) {
        let content = `FUNC ${functionData.id}, PARAMS
 `;
        for (const parameter of functionData.parameters) {
          const type = Type.get(parameter.type, scope);
          parameter.id = functionData.scope.alias(parameter.name);
          console.log(parameter);
          content += `PARAM ${type.id}, ${parameter.id}
`;
        }
        ;
        content += `PARAMS_END
`;
        content += `${Assembler.assemble(functionData.body)}
FUNC_END
`;
        return content;
      }
    };
  }
});

// src/features/semantics.ts
var Semicolon;
var init_semantics = __esm({
  "src/features/semantics.ts"() {
    "use strict";
    init_feature();
    init_parts();
    Semicolon = class extends Feature.Feature {
      constructor() {
        super([
          { part: { type: Parts.PartType.SEMICOLON } }
        ]);
      }
    };
  }
});

// src/official.ts
var official;
var init_official = __esm({
  "src/official.ts"() {
    "use strict";
    init_accessor();
    init_type();
    init_variable();
    init_function();
    init_semantics();
    official = [
      // Word specifics come first
      Type,
      Variable,
      Function2,
      // Then, generalized specifics
      Accessor,
      // And finally, semantics
      Semicolon
    ];
  }
});

// src/syntax.ts
var Syntax;
var init_syntax = __esm({
  "src/syntax.ts"() {
    "use strict";
    init_error();
    init_official();
    ((Syntax2) => {
      function toFeatures(parts, scope, position, _features = official, path2) {
        const features = _features.map((v) => {
          return new v();
        });
        const syntax = [];
        const contents = position.content || "";
        let done = false;
        let foundMatch = false;
        while (!done) {
          if (parts.length == 0) {
            done = true;
            continue;
          }
          ;
          for (const feature of features) {
            const match = feature.match(parts);
            if (match) {
              const data = feature.create(match.exports, scope, position);
              syntax.push({ exports: data.exports, scope: data.scope, feature });
              parts = parts.slice(match.length);
              foundMatch = true;
              break;
            }
            ;
          }
          ;
          if (!foundMatch) {
            throw new Errors.Syntax.Generic(contents, position);
          }
          ;
          foundMatch = false;
        }
        ;
        return syntax;
      }
      Syntax2.toFeatures = toFeatures;
      ;
    })(Syntax || (Syntax = {}));
  }
});

// src/asm/dist/z_S.ts
var z_S_default;
var init_z_S = __esm({
  "src/asm/dist/z_S.ts"() {
    "use strict";
    z_S_default = '\n/*\n * This code was generated by the Z# programming system. \u{1FACE}\n *\n * Z# is an open-source community project. By using Z#, you acknowledge and agree:\n *\n * - You trust the code you are running.\n * - You may not hold the Z# organization, its developers, or contributors liable\n *   for any damage caused by the code, even if it behaves maliciously. \n * - Responsibility for malicious or harmful behavior lies solely with the author\n *   of the code, not with Z# or its maintainers. \u{1F47A}\n *\n * Z# is not designed to generate malicious code, but like any programming tool,\n * it can be used to write harmful or unsafe programs.\n *\n * If you find Z# useful, please consider supporting the project:\n * https://zsharp.dev/donate. \u2764\uFE0F\n *\n * Use at your own risk. \u26A0\uFE0F\n */\n\n#define EVAL(x) x\n\n/*\n * R0 - R4 : Mnemonic control\n * R5      : Scope\n * R6      : Selector control\n * R7      : Parameter control\n * R8      : Stack\n * R9 - R14: Unallocated\n * R15     : Temporary\n */\n# Architecture mapping\n\n/* x86_64 (64-bit) */\n#if defined(__x86_64__) || defined(__amd64__)\n    # Registers\n    #define RAX rax\n    #define RBX rbx\n    #define RCX rcx\n    #define RDX rdx\n    #define RSI rsi\n    #define RDI rdi\n    #define RSP rsp\n    #define RBP rbp\n    #define R8  r8\n    #define R9  r9\n    #define R10 r10\n    #define R11 r11\n    #define R12 r12\n    #define R13 r13\n    #define R14 r14\n    #define R15 r15\n\n    #define RIP rip\n\n    # Mnemonics\n    #define SYSCALL syscall\n    #define MOV(x, y) mov x, y\n    #define LDR(x, y) mov (x), y\n    #define LEA(x, y, z) lea x(z), y\n	#define XOR(x, y) xor x, y\n	#define ADD(x, y) add x, y\n	#define SUB(x, y) sub x, y\n	#define IMUL(x, y) imul x, y\n\n	#define JNE(x, y) jne x, y\n	\n    # Value\n    #define REF(x) $x\n/* ARM64 (AArch64) */\n#elif defined(__aarch64__)\n    # Registers\n    #define RAX x0\n    #define RBX x1\n    #define RCX x2\n    #define RDX x3\n    #define RSI x4\n    #define RDI x5\n    #define RSP sp\n    #define RBP x29\n    #define R8  x8\n    #define R9  x9\n    #define R10 x10\n    #define R11 x11\n    #define R12 x12\n    #define R13 x13\n    #define R14 x14\n    #define R15 x15\n\n    #define RIP rip\n\n    # Mnemonics\n    #define SYSCALL svc 0\n	#define MOV(x, y) mov y, x\n	#define LDR(x, y) ldr y, [x]\n	#define LEA(x, y, z) adr y, x\n	#define XOR(x, y) eor x, x, y\n	#define ADD(x, y) add x, x, y\n	#define SUB(x, y) sub x, x, y\n	#define IMUL(x, y, z) MOV(x, R15) \n \\\n						  MUL R15, y, z\n\n	#define JNE(x, y) \n	\n    # Value\n    #define REF(x) #EVAL(x)\n#else\n    #error "Unsupported architecture for register mapping"\n#endif\n\n#ifdef __WIN32\n	#define TARGET "MICROSOFT/WINDOWS"\n#elif TARGET_OS_MAC\n	#define TARGET "APPLE/MAC-OS"\n#elif TARGET_OS_IPHONE\n	#define TARGET "APPLE/IPHONE"\n#elif __linux__\n	#define TARGET "LINUX"\n#elif __ANDROID__\n	#define TARGET "ANDROID"\n#elif __unix__\n	#define TARGET "UNIX"\n#else\n	#define TARGET "UNKNOWN"\n#endif\n\n# Usage: \n# STRUCT name\n#   STRUCT_FIELD field_name, size\n# STRUCT_END\n\n.set STRUCT_OFFSET, 0\n\n.macro STRUCT name\n    .set \\name\\()_SIZE, 0\n    .pushsection .data\n\\name:\n.endm\n\n.macro STRUCT_FIELD name, size\n\\name:\n    .skip \\size\n    .set STRUCT_OFFSET, STRUCT_OFFSET + \\size\n.endm\n\n.macro STRUCT_END\n    .popsection\n    .set STRUCT_SIZE, STRUCT_OFFSET\n    .set STRUCT_OFFSET, 0\n.endm\n\n.macro ALIGN boundary\n    .balign \\boundary\n.endm\n\n# Allocate N bytes \u2192 result in %rax\n.macro MALLOC size\n    MOV (REF(9), RAX)     ;// sys_mmap\n    XOR (RDI, RDI)        ;// NULL address\n    MOV (REF(\\size), RSI) ;// size in bytes\n    MOV (REF(3), RAX)     ;// PROT_READ | PROT_WRITE\n    MOV (REF(34), R10)    ;// MAP_PRIVATE | MAP_ANONYMOUS\n    XOR (R8, R8)          ;// fd = -1\n    XOR (R9, R9)          ;// offset\n    SYSCALL               ;// -> %rax = allocated pointer\n.endm\n\n# Read value at pointer \u2192 %reg\n#   ptr = register with pointer\n#   reg = output register\n.macro PTR_READ ptr, reg\n    MOV ((\\ptr), \\reg)\n.endm\n\n# Write value to pointer\n#   value = register with value\n#   ptr = pointer register\n.macro PTR_WRITE value, ptr\n    MOV (\\value, (\\ptr))\n.endm\n\n# Store value in memory, and return a pointer to it\n#   value = register with value\n#   out = output register with pointer\n.macro PTR_CREATE value, out\n    MALLOC 8            ;// allocate 8 bytes\n    MOV (\\value, (RAX)) ;// store value at allocated address\n    MOV (RAX, \\out)     ;// return pointer\n.endm\n\n# Optional, depending on the environment\n.macro FREE ptr, size\n    MOV (REF(11), RAX)    ;// sys_munmap\n   	MOV (REF(\\ptr), RDI)  ;// pointer\n    MOV (REF(\\size), RSI) ;// size in bytes\n    SYSCALL\n.endm\n\n# Allocate the table itself once\n.macro LAZY_LIST_INIT name, slots\n    .lcomm \\name, \\slots * 8\n.endm\n\n# Get address of list[index] \u2192 in %rdi\n.macro LAZY_PTR_GET name, index, reg\n    LEA (\\name, \\reg, RIP)\n    MOV (REF(\\index), RSI)\n    IMUL (REF(8), RSI, RSI)\n    ADD (RSI, \\reg)\n.endm\n\n# Access item at index, allocate if null\n#   name = list name\n#   index = integer index\n#   size = allocation size\n#   reg = register for result address\n.macro LAZY_BLOCK_GET name, index, size, reg\n    LAZY_PTR_GET \\name, \\index, \\reg\n    MOV ((\\reg), RSI)\n    JNE (REF(1f), RSI)\n    MALLOC \\size\n    MOV (RAX, \\reg)\n1:\n    LDR (\\reg, \\reg)\n.endm\n\n# Set value at a specific index in a lazy list\n#   name = list name\n#   index = integer index\n#   value = value to set (in register)\n.macro LAZY_BLOCK_SET name, index, value\n    LAZY_PTR_GET \\name, \\index, RDI\n    MOV (REF(\\value), RDI)\n.endm\n\n# Type initialization\n.macro TYPE name\n    STRUCT \\name\n.endm\n\n.macro TYPE_FIELD type, name, size\n    #if type == BYTE\n        STRUCT_FIELD \\name, \\size\n    #endif\n.endm\n\n.macro TYPE_END\n    STRUCT_END\n.endm\n\n.macro FUNC name, _\n.section .text\n.global \\name\n\\name:\n.endm\n\n.macro PARAM type, name\n# Store param info\n.byte 0x10\n.asciz "\\name"\n.byte \\type\n.endm\n\n.macro PARAMS_END\n.byte 0x11\n.endm\n\n.macro FUNC_END\n.byte 0xFF\n.endm\n\n.macro DEBUG value\n    MOV(REF(1), RAX)  ;// sys_write system call\n    MOV(REF(1), RDI)  ;// stdout file descriptor\n    MOV(\\value, RSI)  ;// pointer to the string\n    MOV(REF(10), RDX) ;// length of the string\n    SYSCALL\n.endm\n\n.macro STRING name, string\n	.section data\n		\\name: .asciz \\string\n	.section text\n.endm\n\n';
  }
});

// src/cli/header.ts
var header_exports = {};
__export(header_exports, {
  Z_bug: () => Z_bug,
  Zasm_bug: () => Zasm_bug,
  failure: () => failure,
  header: () => header,
  hyperlink: () => hyperlink,
  success: () => success,
  zs: () => zs
});
function hyperlink(text, url, attrs) {
  return `\x1B]8;${attrs || ""};${url || text}\x07${text}\x1B]8;;\x07`;
}
function success(data) {
  return import_chalk2.chalk.white(
    `
Code compilation ${import_chalk2.chalk.green("succeeded")} in ${import_chalk2.chalk.green(data.time)}ms with ${data.vulnerabilities == 0 ? import_chalk2.chalk.green("0") : data.vulnerabilities < 5 ? import_chalk2.chalk.yellow(data.vulnerabilities) : import_chalk2.chalk.red(data.vulnerabilities)} known vulnerabilit(ies).`
  );
}
function failure(data) {
  return import_chalk2.chalk.white(
    `
Code compilation ${import_chalk2.chalk.red("failed")} with ${import_chalk2.chalk.red(data.errors)} error(s).`
  );
}
var import_chalk2, header, Z_bug, Zasm_bug, zs;
var init_header = __esm({
  "src/cli/header.ts"() {
    "use strict";
    import_chalk2 = __toESM(require_dist3());
    header = import_chalk2.chalk.white(
      ":===: " + import_chalk2.chalk.red("Z#") + " :===:\n\n" + import_chalk2.chalk.blue(hyperlink("Documentation", "https://docs.zsharp.dev")) + "\n"
    );
    Z_bug = import_chalk2.chalk.red("This is a bug! Please report it:");
    Zasm_bug = hyperlink("Report", "");
    zs = import_chalk2.chalk.red("Z#");
  }
});

// src/emit.ts
async function compileAssemblyToBinary(source, output) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "zsharp-"));
  const inputFile = path.join(tempDir, "temp.s");
  const outputFile = path.join(tempDir, "temp" + output);
  const zHeaderFile = path.join(tempDir, "z.S");
  await fs.writeFile(inputFile, source);
  await fs.writeFile(zHeaderFile, z_S_default);
  await new Promise((resolve, reject) => {
    const gcc = (0, import_child_process.spawn)("gcc", ["-x", "assembler-with-cpp", "-c", inputFile, "-o", outputFile]);
    gcc.stderr.on("data", (data) => console.error(`GCC Error: 
${data}
${Z_bug} ${Zasm_bug}`));
    gcc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(process.exit(1));
    });
  });
  const binary = await fs.readFile(outputFile);
  await fs.rm(tempDir, { recursive: true, force: true });
  return binary;
}
var import_child_process, fs, path, os;
var init_emit = __esm({
  "src/emit.ts"() {
    "use strict";
    import_child_process = require("child_process");
    fs = __toESM(require("fs/promises"));
    path = __toESM(require("path"));
    os = __toESM(require("os"));
    init_z_S();
    init_header();
  }
});

// src/cli/spinner.ts
var import_chalk3, SpinnerTypes, Spinner;
var init_spinner = __esm({
  "src/cli/spinner.ts"() {
    "use strict";
    import_chalk3 = __toESM(require_dist3());
    SpinnerTypes = {
      "compile": {
        frames: [" == ", "  ==", "   =", "  ==", " == ", "==  ", "=   ", "==  "].map((v) => {
          return import_chalk3.chalk.white(`[${import_chalk3.chalk.blue(v)}]`);
        }),
        success: import_chalk3.chalk.white(`[ ${import_chalk3.chalk.green("OK")} ]`),
        fail: import_chalk3.chalk.white(`[ ${import_chalk3.chalk.red("ER")} ]`),
        warning: import_chalk3.chalk.white(`[ ${import_chalk3.chalk.yellow("WN")} ]`),
        framecount: 8
      }
    };
    Spinner = class {
      constructor(options2) {
        this.options = options2;
      }
      start() {
        let i = 0;
        this.interval = setInterval(() => {
          process.stdout.clearLine(0);
          process.stdout.write(this.options.style.frames[i++] + " " + this.options.text);
          process.stdout.cursorTo(0);
          i = i % this.options.style.framecount;
        }, 1e3 / (this.options.framerate || 2));
      }
      success() {
        clearInterval(this.interval);
        process.stdout.clearLine(0);
        process.stdout.write(this.options.style.success + " " + this.options.text + "\n");
      }
      warning() {
        clearInterval(this.interval);
        process.stdout.clearLine(0);
        process.stdout.write(this.options.style.warning + " " + this.options.text + "\n");
      }
      fail() {
        clearInterval(this.interval);
        process.stdout.clearLine(0);
        process.stdout.write(this.options.style.fail + " " + this.options.text + "\n");
      }
      interval;
    };
  }
});

// src/zs.ts
var zs_exports = {};
__export(zs_exports, {
  Z: () => Z
});
var Z;
var init_zs = __esm({
  "src/zs.ts"() {
    "use strict";
    init_parts();
    init_syntax();
    init_feature();
    init_assembler();
    init_emit();
    init_spinner();
    init_header();
    ((Z2) => {
      function spin(spinner) {
        spinner.start();
      }
      Z2.spin = spin;
      ;
      function toAssembly(content, importer, path2) {
        const start = Date.now();
        let spinners = [];
        let assembly = "";
        if (importer.cli) {
          console.log(header);
          spinners = Array.from({ length: 10 }, () => {
            const spinner = new Spinner({ text: "", style: SpinnerTypes["compile"] });
            return spinner;
          });
          spinners[0].options.text = "Parsing";
          spinners[1].options.text = "Applying syntax";
          spinners[2].options.text = "Compiling to assembly";
          spinners[0].start();
        }
        ;
        try {
          const parts = Parts.toParts(content, path2);
          if (importer.cli) {
            spinners[0].success();
            spinners[1].start();
          }
          ;
          const scope = new Feature.Scope(importer, "main");
          const basePosition = {
            content
          };
          const syntax = Syntax.toFeatures(parts, scope, basePosition, void 0, path2);
          if (importer.cli) {
            spinners[1].success();
            spinners[2].start();
          }
          ;
          assembly = Assembler.assemble(syntax, true);
          if (importer.cli) {
            spinners[2].success();
          }
          ;
          if (importer.cli) {
            const end = Date.now();
            console.log(success({
              vulnerabilities: 0,
              // add later
              time: end - start
            }));
          }
          ;
        } catch (_err) {
          let err = _err;
          console.log(err.message);
          console.log(failure({
            errors: err.count || 1
          }));
          process.exit(1);
        }
        ;
        return assembly;
      }
      Z2.toAssembly = toAssembly;
      ;
      async function emit(content, output) {
        const compiled = await compileAssemblyToBinary(content, output);
        return compiled;
      }
      Z2.emit = emit;
      ;
    })(Z || (Z = {}));
  }
});

// src/file.ts
var file_exports = {};
__export(file_exports, {
  FileType: () => FileType
});
var FileType;
var init_file = __esm({
  "src/file.ts"() {
    "use strict";
    ((FileType2) => {
      function get(path2) {
        return path2.match(/.*(\.\w*)/gm)?.[0];
      }
      FileType2.get = get;
      ;
    })(FileType || (FileType = {}));
  }
});

// dist/cmd.js
var __importDefault = exports && exports.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require_register();
var commander_1 = require_commander();
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var chalk_1 = __importDefault(require_dist3());
var zs_1 = (init_zs(), __toCommonJS(zs_exports));
var file_1 = (init_file(), __toCommonJS(file_exports));
var error_1 = (init_error(), __toCommonJS(error_exports));
var header_1 = (init_header(), __toCommonJS(header_exports));
var project = {};
function getProject(path2) {
  try {
    return JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(path2 + "/.zsharp.json")).toString());
  } catch (err) {
    if (path2 == path_1.default.resolve(path2)) {
      return {};
    }
    ;
    return getProject(path_1.default.resolve(path2 + "/../"));
  }
  ;
}
commander_1.program.name("zs").description(chalk_1.default.white(`${header_1.zs} compiler`));
commander_1.program.command("build").description(`Build ${header_1.zs} code`).option("--input, -I <path>").option("--output, -O <path>").option("--mode, -M <string>").action((_options) => {
  for (const option in _options) {
    if (project?.[option] && _options[option] !== project?.[option]) {
      throw new error_1.Errors.Command.Conflicting.Parameters([option, option]);
    }
    ;
  }
  ;
  const options2 = { ..._options, ...project };
  if (!options2.input) {
    throw new error_1.Errors.Command.Missing.Parameters(["input"]);
  }
  ;
  project = getProject(options2.input.split("/").slice(0, -1).join("/"));
  const asm = zs_1.Z.toAssembly(fs_1.default.readFileSync(options2.input).toString(), {
    import: (path2) => {
      return fs_1.default.readFileSync(path2).toString();
    },
    cli: true
  }, options2.input);
  fs_1.default.writeFileSync(options2.output || options2.input + ".iz", asm);
});
commander_1.program.command("emit").description(`Compile ${header_1.zs} intermediate assembly`).option("--input, -I <path>").option("--output, -O <path>").option("--target, -T <arch>").action(async (_options) => {
  if (!_options.input) {
    throw new error_1.Errors.Command.Missing.Parameters(["input"]);
  }
  ;
  const asm = fs_1.default.readFileSync(_options.input).toString();
  const binary = await zs_1.Z.emit(asm, file_1.FileType.get(_options.output));
  fs_1.default.writeFileSync(_options.output, binary);
});
commander_1.program.parse();
var options = commander_1.program.opts();
