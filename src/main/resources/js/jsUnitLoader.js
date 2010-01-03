/*
Copyright Stefano Fornari 2009

This file is part of RhinoUnit.

RhinoUnit is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Foobar is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/


importPackage(java.io);
importPackage(java.lang);

var rhinounitDir = System.getProperty("rhinounit.home", ".");

load(rhinounitDir + File.separator + 'xbDebug.js');
load(rhinounitDir + File.separator + 'jsUnitCore.js');
load(rhinounitDir + File.separator + 'jsUnitParamUtils.js');
load(rhinounitDir + File.separator + 'jsUnitTestManager.js');
load(rhinounitDir + File.separator + 'jsUnitTestSuite.js');
load(rhinounitDir + File.separator + 'jsUnitTracer.js');
load(rhinounitDir + File.separator + 'jsUnitResultWriter.js');
load(rhinounitDir + File.separator + 'jsUnitResult.js');

/**
 * prints the options for JSDoc
*/
function printOptions()
{
    print("Syntax:\n");
    print("jsUnitLoader [-Drhinounit.home=<rhinounit home>] <test directory>\n");
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
var dir = new File(arguments[0]);
if (dir.exists()) {
    var lst = dir.list();
    if (lst != null) {
        for (var i in lst) {
            executeTestSuite(lst[i]);
        }
    }
}
