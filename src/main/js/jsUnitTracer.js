/* @author Edward Hieatt, edward@jsunit.net */

function jsUnitTracer() {
    this.TRACE_LEVEL_WARNING = 1;
    this.TRACE_LEVEL_INFO    = 2;
    this.TRACE_LEVEL_DEBUG   = 3;

    this.chosenTraceLevel = this.TRACE_LEVEL_DEBUG;
}

jsUnitTracer.prototype.initialize = function () {
}

jsUnitTracer.prototype.finalize = function () {
}

jsUnitTracer.prototype.setTraceLevel = function (traceLevel) {
    this.choosenTraceLevel = traceLevel;
}

jsUnitTracer.prototype.warn = function () 
{
    this._trace(arguments[0], arguments[1], this.TRACE_LEVEL_WARNING);
}

jsUnitTracer.prototype.inform = function () 
{
    this._trace(arguments[0], arguments[1], this.TRACE_LEVEL_INFO);
}

jsUnitTracer.prototype.debug = function () 
{
    this._trace(arguments[0], arguments[1], this.TRACE_LEVEL_DEBUG);
}

jsUnitTracer.prototype._trace = function (message, value, traceLevel) 
{
    if (this.chosenTraceLevel >= traceLevel) {
        var traceString = message;
        if (value)
            traceString += ': ' + value;
        this._write(traceString, traceLevel);
    }
}

jsUnitTracer.prototype._write = function (traceString, traceLevel) 
{
    print(traceString + '\n');
}

if (xbDEBUG.on)
{
    xbDebugTraceObject('window', 'jsUnitTracer');
}

