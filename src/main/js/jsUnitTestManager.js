/* @author Edward Hieatt, edward@jsunit.net */

function jsUnitTestManager()
{
    this.tracer = new jsUnitTracer();
    this.setup();
}

jsUnitTestManager.prototype.setup = function () {
    this.totalCount    = 0;
    this.errorCount    = 0;
    this.failureCount  = 0;
    this.suiteStack    = Array();
}

jsUnitTestManager.prototype.start = function () {
    this.timeRunStarted = new Date();
    this.initialize();
    this._nextTest();
}

jsUnitTestManager.prototype.addSuite = function (suite) {
    push(this.suiteStack, suite);
}

jsUnitTestManager.prototype._runTest = function (test)  {
    if (this.testIndex + 1 > this.numberOfTests)
    {
        this._nextTest();
        return;
    }

    status = '';
    // either not first test, or no setUpPage defined, or setUpPage completed
    this.executeTestFunction(test);
    this.totalCount++;
    this.testIndex++;
}

jsUnitTestManager.prototype._done = function () {
    var secondsSinceRunBegan = this._elapsed();
    this.setStatus('Done (' + secondsSinceRunBegan + ' seconds)');
    this._cleanUp();
    this._printSummary();
}

jsUnitTestManager.prototype._nextTest = function () {
    println("CHECK0");
    if (this._currentSuite().hasMoreTests()) {
        println("CHECK0.1");
        this._runTest(this._currentSuite().nextTest());
        println("CHECK0.2");
    } else {
        println("CHECK1");
        this._currentSuite().elapsedTime = this._elapsed();
        var w = new jsUnitResultWriter(this._currentSuite());
        w.writeResults();
        pop(this.suiteStack);
        if (this._currentSuite() == null) {
            println("CHECK2");
            this._done();

            return;
        }
    }

    println("CHECK3");
    this._nextTest();
    
    println("CHECK5");
}

jsUnitTestManager.prototype._currentSuite = function () 
{
    var suite = null;

    if (this.suiteStack && this.suiteStack.length > 0)
        suite = this.suiteStack[this.suiteStack.length-1];

    return suite;
}

jsUnitTestManager.prototype._cleanUp = function () 
{
    this.finalize();
    this.tracer.finalize();
}

jsUnitTestManager.prototype._printSummary = function () {
    println("--------------------------------------------------------------------------------");
    print("Tests run: " + this.totalCount);
    print(", Failures: " + this.failureCount);
    print(", Errors: " + this.errorCount + "\n");
    if ((this.errorCount + this.failureCount) > 0) {
        println("--------------------------------------------------------------------------------");
        println("\nWARNING: There are test failures.");
    }
    println("--------------------------------------------------------------------------------");
}

jsUnitTestManager.prototype.abort = function () 
{
    this.setStatus('Aborted');
    this._cleanUp();
}

jsUnitTestManager.prototype.getTestFunctionNames = function () 
{
    var testFrame         = this.containerTestFrame;
    var testFunctionNames = new Array();
    var i;
  
    // TBD

    return testFunctionNames;
}

jsUnitTestManager.prototype.executeTestFunction = function (f) 
{
    this._testFunctionName=f.name;
    this.setStatus('Running test "' + f.name + '"');
    var excep=null;
    var timeBefore = new Date();
    try {
        // TBD setUp() -- this.containerTestFrame.setUp();
        f();
    }
    catch (e1) {
        excep = e1;
    }
    finally {
        try {
        // TBD tearDown -- this.containerTestFrame.tearDown();
        }
        catch (e2) {
            excep = e2;
        }
    }
    var timeTaken = (new Date() - timeBefore) / 1000;
    if (excep != null)
        this._handleTestException(excep);
    var result = new jsUnitResult();

    result.name = this._fullyQualifiedCurrentTestFunctionName();
    result.elapsedTime = timeTaken;
    if (excep != null) {
        result.error = excep;
        result.details = this._problemDetailMessageFor(excep);
    }

    this._currentSuite().addResult(result);
    /*
    var newOption = new Option(serializedTestCaseString);
    this.testCaseResultsField[this.testCaseResultsField.length]=newOption;
    */
}

jsUnitTestManager.prototype._fullyQualifiedCurrentTestFunctionName = function() {
    return this._testFunctionName;
}

jsUnitTestManager.prototype._handleTestException = function (excep) 
{
    var problemMessage = this._fullyQualifiedCurrentTestFunctionName() + ' ';
    var errOption;
    if (typeof(excep.isJsUnitException) == 'undefined' || !excep.isJsUnitException) {
        problemMessage += 'had an error';
        this.errorCount++;
        this._currentSuite().errorCount++;
    }
    else {
        problemMessage += 'failed';
        this._currentSuite().failureCount++;
        this.failureCount++;
    }

    println(problemMessage);
    println(excep);
}

jsUnitTestManager.prototype._problemDetailMessageFor = function (excep) 
{
    var result=null;
    if (typeof(excep.isJsUnitException) != 'undefined' && excep.isJsUnitException) {
        result = '';
        if (excep.comment != null)
            result+=('"'+excep.comment+'"\n');
    
        result += excep.jsUnitMessage;
    
        if (excep.stackTrace)
            result+='\n\nStack trace follows:\n'+excep.stackTrace;
    }
    else {
        result = 'Error message is:\n"';
        result +=
        (typeof(excep.description) == 'undefined') ?
        excep :
        excep.description;
        result += '"';
        if (typeof(excep.stack) != 'undefined') // Mozilla only
            result+='\n\nStack trace follows:\n'+excep.stack;
    }
    return result;
}

jsUnitTestManager.prototype.setStatus = function (str)
{
    println("setStatus: " + str);
}

jsUnitTestManager.prototype._setErrors = function (n)
{
    println("setErrors: " + n);
}

jsUnitTestManager.prototype._setFailures = function (n)
{
    println("setFailures: " + n);
}

jsUnitTestManager.prototype._setTotal = function (n)
{
    println("setTotal: " + n);
}

jsUnitTestManager.prototype._setProgressBarImage = function (imgName)
{
    this.progressBar.src=imgName;
}

jsUnitTestManager.prototype._setProgressBarWidth = function (w)
{
    this.progressBar.width=w;
}

jsUnitTestManager.prototype.showMessageForSelectedProblemTest = function ()
{
    var problemTestIndex = this.problemsListField.selectedIndex;
    if (problemTestIndex != -1)
        alert(this.problemsListField[problemTestIndex].value);
}

jsUnitTestManager.prototype.showMessagesForAllProblemTests = function ()
{
    if (this.problemsListField.length == 0)
        return;

    try
    {
        if (this._windowForAllProblemMessages && !this._windowForAllProblemMessages.closed)
            this._windowForAllProblemMessages.close();
    }
    catch(e)
    {
    }

    this._windowForAllProblemMessages = window.open('','','width=600, height=350,status=no,resizable=yes,scrollbars=yes');
    var resDoc = this._windowForAllProblemMessages.document;
    resDoc.write('<html><head><link rel="stylesheet" href="../css/jsUnitStyle.css"><title>Tests with problems - JsUnit<\/title><head><body>');
    resDoc.write('<p class="jsUnitSubHeading">Tests with problems (' + this.problemsListField.length + ' total) - JsUnit<\/p>');
    resDoc.write('<p class="jsUnitSubSubHeading"><i>Running on '+navigator.userAgent+'</i></p>');
    for (var i = 0; i < this.problemsListField.length; i++)
    {
        resDoc.write('<p class="jsUnitDefault">');
        resDoc.write('<b>' + (i + 1) + '. ');
        resDoc.write(this.problemsListField[i].text);
        resDoc.write('<\/b><\/p><p><pre>');
        resDoc.write(this.problemsListField[i].value);
        resDoc.write('<\/pre><\/p>');
    }

    resDoc.write('<\/body><\/html>');
    resDoc.close();
}

jsUnitTestManager.prototype.initialize = function ()
{
    this.setStatus('Initializing...');
    this.setStatus('Done initializing');
}

jsUnitTestManager.prototype.finalize = function ()
{
}

jsUnitTestManager.prototype._setRunButtonEnabled = function (b)
{
}

jsUnitTestManager.prototype._elapsed = function() {
    return (new Date() - this.timeRunStarted)/1000;
}

// the functions push(anArray, anObject) and pop(anArray) 
// exist because the JavaScript Array.push(anObject) and Array.pop() 
// functions are not available in IE 5.0

function push(anArray, anObject) 
{
    anArray[anArray.length]=anObject;
}

function pop(anArray) 
{
    if (anArray.length>=1) {
        delete anArray[anArray.length - 1];
        anArray.length--;
    }
}

if (xbDEBUG.on)
{
    xbDebugTraceObject('window', 'jsUnitTestManager');
    xbDebugTraceFunction('window', 'getTestFileProtocol');
    xbDebugTraceFunction('window', 'getDocumentProtocol');
}
