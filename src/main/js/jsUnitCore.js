/* @author Edward Hieatt, edward@jsunit.net */

var JSUNIT_UNDEFINED_VALUE;
var JSUNIT_VERSION="2.1";

function _displayStringForValue(aVar) {
  if (aVar === null) 
    return 'null';
    
  if (aVar === JSUNIT_UNDEFINED_VALUE) 
    return 'undefined';
    
  return aVar;
}

function fail(failureMessage) {
  throw new JsUnitException(null, failureMessage);
}

function error(errorMessage) {
  var errorObject         = new Object();
  errorObject.description = errorMessage;
  errorObject.stackTrace  = getStackTrace();
  throw errorObject;
}

function argumentsIncludeComments(expectedNumberOfNonCommentArgs, args) {
  return args.length == expectedNumberOfNonCommentArgs + 1;
}

function commentArg(expectedNumberOfNonCommentArgs, args) {
  if (argumentsIncludeComments(expectedNumberOfNonCommentArgs, args))
    return args[0];

  return null;
}

function nonCommentArg(desiredNonCommentArgIndex, expectedNumberOfNonCommentArgs, args) {
  return argumentsIncludeComments(expectedNumberOfNonCommentArgs, args) ?
    args[desiredNonCommentArgIndex] :
    args[desiredNonCommentArgIndex - 1];
}

function _validateArguments(expectedNumberOfNonCommentArgs, args) {
  if (!( args.length == expectedNumberOfNonCommentArgs ||
        (args.length == expectedNumberOfNonCommentArgs + 1 && typeof(args[0]) == 'string') ))
    error('Incorrect arguments passed to assert function');
}

function _assert(comment, booleanValue, failureMessage) {
  if (!booleanValue)
    throw new JsUnitException(comment, failureMessage);
}

function assert() {
  _validateArguments(1, arguments);
  var booleanValue=nonCommentArg(1, 1, arguments);

  if (typeof(booleanValue) != 'boolean')
    error('Bad argument to assert(boolean)');

  _assert(commentArg(1, arguments), booleanValue === true, 'Call to assert(boolean) with false');
}

function assertTrue() {
  _validateArguments(1, arguments);
  var booleanValue=nonCommentArg(1, 1, arguments);

  if (typeof(booleanValue) != 'boolean')
    error('Bad argument to assertTrue(boolean)');

  _assert(commentArg(1, arguments), booleanValue === true, 'Call to assertTrue(boolean) with false');
}

function assertFalse() {
  _validateArguments(1, arguments);
  var booleanValue=nonCommentArg(1, 1, arguments);

  if (typeof(booleanValue) != 'boolean')
    error('Bad argument to assertFalse(boolean)');

  _assert(commentArg(1, arguments), booleanValue === false, 'Call to assertFalse(boolean) with true');
}

function assertEquals() {
  _validateArguments(2, arguments);
  var var1=nonCommentArg(1, 2, arguments);
  var var2=nonCommentArg(2, 2, arguments);
  _assert(commentArg(2, arguments), var1 === var2, 'Expected ' + var1 + ' (' + typeof(var1) + ') but was ' + _displayStringForValue(var2) + ' (' + typeof(var2) + ')');
}

function assertNotEquals() {
  _validateArguments(2, arguments);
  var var1=nonCommentArg(1, 2, arguments);
  var var2=nonCommentArg(2, 2, arguments);
  _assert(commentArg(2, arguments), var1 !== var2, 'Expected not to be ' + _displayStringForValue(var2));
}

function assertNull() {
  _validateArguments(1, arguments);
  var aVar=nonCommentArg(1, 1, arguments);
  _assert(commentArg(1, arguments), aVar === null, 'Expected null but was ' + _displayStringForValue(aVar));
}

function assertNotNull() {
  _validateArguments(1, arguments);
  var aVar=nonCommentArg(1, 1, arguments);
  _assert(commentArg(1, arguments), aVar !== null, 'Expected not to be null');
}

function assertUndefined() {
  _validateArguments(1, arguments);
  var aVar=nonCommentArg(1, 1, arguments);
  _assert(commentArg(1, arguments), aVar === JSUNIT_UNDEFINED_VALUE, 'Expected undefined but was ' + _displayStringForValue(aVar));
}

function assertNotUndefined() {
  _validateArguments(1, arguments);
  var aVar=nonCommentArg(1, 1, arguments);
  _assert(commentArg(1, arguments), aVar !== JSUNIT_UNDEFINED_VALUE, 'Expected not to be undefined');
}

function assertNaN() {
  _validateArguments(1, arguments);
  var aVar=nonCommentArg(1, 1, arguments);
  _assert(commentArg(1, arguments), isNaN(aVar), 'Expected NaN');
}

function assertNotNaN() {
  _validateArguments(1, arguments);
  var aVar=nonCommentArg(1, 1, arguments);
  _assert(commentArg(1, arguments), !isNaN(aVar), 'Expected not NaN');
}

function setUp() {
}

function tearDown() {
}

function getFunctionName(aFunction) {
  var name = aFunction.toString().match(/function (\w*)/)[1];

  if ((name == null) || (name.length == 0))
    name = 'anonymous';

  return name;
}

function getStackTrace() {
  var result = '';

  if (typeof(arguments.caller) != 'undefined') { // IE, not ECMA
    for (var a = arguments.caller; a != null; a = a.caller) {
      result += '> ' + getFunctionName(a.callee) + '\n';
      if (a.caller == a) {
        result += '*';
        break;
      }
    }
  }
  else { // Mozilla, not ECMA
    // fake an exception so we can get Mozilla's error stack
    var testExcp;
    try
    {
      foo.bar;
    }
    catch(testExcp)
    {
      var stack = parseErrorStack(testExcp);
      for (var i = 1; i < stack.length; i++)
      {
        result += '> ' + stack[i] + '\n';
      }
    }
  }

  return result;
}

function parseErrorStack(excp)
{
  var stack = [];
  var name;
  
  if (!excp || !excp.stack)
  {
    return stack;
  }
  
  var stacklist = excp.stack.split('\n');

  for (var i = 0; i < stacklist.length - 1; i++)
  {
    var framedata = stacklist[i];

    name = framedata.match(/^(\w*)/)[1];
    if (!name) {
      name = 'anonymous';
    }

    stack[stack.length] = name;
  }
  // remove top level anonymous functions to match IE

  while (stack.length && stack[stack.length - 1] == 'anonymous')
  {
    stack.length = stack.length - 1;
  }
  return stack;
}

function JsUnitException(comment, message) {
  this.isJsUnitException = true;
  this.comment           = comment;
  this.description       = message;
  this.stackTrace        = getStackTrace();
}

function warn() {
  if (tracer != null) 
    tracer.warn(arguments[0], arguments[1]);
}

function inform() {
  if (tracer != null) 
    tracer.inform(arguments[0], arguments[1]);
}

function info() {
  inform(arguments[0], arguments[1]);
}

function debug() {
  if (tracer != null) 
    tracer.debug(arguments[0], arguments[1]);
}

function setjsUnitTracer(ajsUnitTracer) {
  tracer=ajsUnitTracer;
}

function trim(str) {
  if (str == null) 
    return null;

  var startingIndex = 0;
  var endingIndex   = str.length-1;
  
  while (str.substring(startingIndex, startingIndex+1) == ' ')
    startingIndex++;

  while (str.substring(endingIndex, endingIndex+1) == ' ')
    endingIndex--;

  if (endingIndex < startingIndex) 
    return '';

  return str.substring(startingIndex, endingIndex+1);
}

function isBlank(str) {
  return trim(str) == '';
}

// safe, strict access to jsUnitParmHash
function jsUnitGetParm(name)
{
  if (typeof(jsUnitParmHash[name]) != 'undefined')
  {
    return jsUnitParmHash[name];
  }
  return null;
}

if (typeof(xbDEBUG) != 'undefined' && xbDEBUG.on && testManager)
{
  xbDebugTraceObject('testManager.containerTestFrame', 'JSUnitException');
  // asserts
  xbDebugTraceFunction('testManager.containerTestFrame', '_displayStringForValue');
  xbDebugTraceFunction('testManager.containerTestFrame', 'error');
  xbDebugTraceFunction('testManager.containerTestFrame', 'argumentsIncludeComments');
  xbDebugTraceFunction('testManager.containerTestFrame', 'commentArg');
  xbDebugTraceFunction('testManager.containerTestFrame', 'nonCommentArg');
  xbDebugTraceFunction('testManager.containerTestFrame', '_validateArguments');
  xbDebugTraceFunction('testManager.containerTestFrame', '_assert');
  xbDebugTraceFunction('testManager.containerTestFrame', 'assert');
  xbDebugTraceFunction('testManager.containerTestFrame', 'assertTrue');
  xbDebugTraceFunction('testManager.containerTestFrame', 'assertEquals');
  xbDebugTraceFunction('testManager.containerTestFrame', 'assertNotEquals');
  xbDebugTraceFunction('testManager.containerTestFrame', 'assertNull');
  xbDebugTraceFunction('testManager.containerTestFrame', 'assertNotNull');
  xbDebugTraceFunction('testManager.containerTestFrame', 'assertUndefined');
  xbDebugTraceFunction('testManager.containerTestFrame', 'assertNotUndefined');
  xbDebugTraceFunction('testManager.containerTestFrame', 'assertNaN');
  xbDebugTraceFunction('testManager.containerTestFrame', 'assertNotNaN');
  xbDebugTraceFunction('testManager.containerTestFrame', 'isLoaded');
  xbDebugTraceFunction('testManager.containerTestFrame', 'setUp');
  xbDebugTraceFunction('testManager.containerTestFrame', 'tearDown');
  xbDebugTraceFunction('testManager.containerTestFrame', 'getFunctionName');
  xbDebugTraceFunction('testManager.containerTestFrame', 'getStackTrace');
  xbDebugTraceFunction('testManager.containerTestFrame', 'warn');
  xbDebugTraceFunction('testManager.containerTestFrame', 'inform');
  xbDebugTraceFunction('testManager.containerTestFrame', 'debug');
  xbDebugTraceFunction('testManager.containerTestFrame', 'setjsUnitTracer');
  xbDebugTraceFunction('testManager.containerTestFrame', 'trim');
  xbDebugTraceFunction('testManager.containerTestFrame', 'isBlank');
  xbDebugTraceFunction('testManager.containerTestFrame', 'newOnLoadEvent');
  xbDebugTraceFunction('testManager.containerTestFrame', 'push');
  xbDebugTraceFunction('testManager.containerTestFrame', 'pop');
}


function jsUnitKickOffTests() {
    for (i in this) {
        if (typeof(this[i])=='function') {
            if (i.toString().indexOf("jsutest") == 0) {
                this[i]();
            }
        }
    }
}
