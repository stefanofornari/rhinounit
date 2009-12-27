importPackage(java.io);

load('xbDebug.js');
load('jsUnitCore.js');
load('jsUnitParamUtils.js');
load('jsUnitTestManager.js');
load('jsUnitTestSuite.js');
load('jsUnitTracer.js');
load('jsUnitResultWriter.js');
load('jsUnitResult.js');

/**
 * prints the options for JSDoc
*/
function printOptions()
{
    print("Syntax:\n");
    print("jsUnitLoader <test directory>\n");
}

/**
 *  Create a jsUnitTestSuite object from the given file. The name of the
 *  testsuite will be the name of the file stripped out of the extension
 *  (if any).
 *
 *  @param name the file name
 *
 *  @return the newly created jsUnitTestSuite
 */
function createTestSuite(name) {
    var testName = name;
    var indexOfExtension = name.lastIndexOf('.');
    if ( indexOfExtension > 0 ) {
        testName = name.substr(0, indexOfExtension);
    }

    load(dir.absolutePath + dir.separator + lst[i]);

    //
    // I do not know if there is a better way to do the below with 
    // JavaScript inheritance. I am basically creating an object of the
    // test case, an object of type jsUnitTestSuite, and adding all
    // properties and functions of the former to the latter.
    // In this way, the created jsUnitTestSuite object will have all
    // functions and methods of both object...
    //
    // If there is a better way to do it, please let me know.
    //

    var obj = eval("new " + testName + "();");
    var suite = new jsUnitTestSuite(testName, obj);

    return suite;
}

/**
 *  Executes the given jsUnitTestSuite.
 *
 *  @param testSuite the test suite to execute
 *
 */
function executeTestSuite(testSuite) {
    var testManager = new jsUnitTestManager();

    testManager.addSuite(createTestSuite(testSuite));
    testManager.start();
}

// Main Script
// first read the arguments
if (arguments.length == 0) {
    printOptions();
    quit();
}

//
// load all tests in the test directory
//
var dir = new java.io.File(arguments[0]);
if (dir.exists()) {
    var lst = dir.list();
    if (lst != null) {
        for (var i=0; i < lst.length; i++) {
            executeTestSuite(lst[i]);
        }
    }
}
