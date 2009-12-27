/* @author Edward Hieatt, edward@jsunit.net */

function jsUnitTestSuite() {
    _init();
    this.name        = "Anonymous test suite";
}

function jsUnitTestSuite(name, obj) {
    this._init();
    this.name        = name;

    for (i in obj) {
        this[i.toString()] = obj[i.toString()];
    }

    for (i in this) {
        if (typeof(this[i])=='function') {
            if (i.indexOf("test") == 0) {
                this.addTest(this[i]);
            }
        }
    }
}

jsUnitTestSuite.prototype._init = function() {
    this.tests        = Array();
    this.results      = Array();
    this.currentTest  = 0;
    this.elapsedTime  = 0;
    this.errorCount   = 0;
    this.failureCount = 0;
}

jsUnitTestSuite.prototype.addTest = function (test) {
    this.tests[this.tests.length] = test;
}

jsUnitTestSuite.prototype.addResult = function (result) {
    this.results[this.results.length] = result;
}

jsUnitTestSuite.prototype.addTestSuite = function (suite) 
{
    for (var i = 0; i < suite.tests.length; i++)
        this.addTest(suite.tests[i]);
}

jsUnitTestSuite.prototype.containsTests = function ()
{
    return this.tests.length > 0;
}

jsUnitTestSuite.prototype.nextTest = function ()
{
    return this.tests[this.currentTest++];
}

jsUnitTestSuite.prototype.hasMoreTests = function ()
{
    return this.currentTest < this.tests.length;
}

jsUnitTestSuite.prototype.getTestCount = function () {
    return this.tests.length;
}

jsUnitTestSuite.prototype.getErrorCount = function () {
    return this.errorCount;
}

jsUnitTestSuite.prototype.getFailureCount = function () {
    return this.failureCount;
}

jsUnitTestSuite.prototype.getElapsedTime = function () {
    return this.elapsedTime;
}

jsUnitTestSuite.prototype.getResults = function () {
    return this.results;
}

jsUnitTestSuite.prototype.clone = function ()
{
    var clone = new jsUnitTestSuite();
    clone.tests = this.tests;
    return clone;
}

/*
if (xbDEBUG.on)
{
    xbDebugTraceObject('window', 'jsUnitTestSuite');
}
*/
