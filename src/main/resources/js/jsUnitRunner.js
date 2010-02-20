/*
  Copyright Stefano Fornari 2010

  This file is part of RhinoUnit.

  RhinoUnit is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  RhinoUnit is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

importPackage(java.io);

IOUtils = Packages.org.apache.commons.io.IOUtils;


function jsUnitRunner(directory) {
    this.directory = directory;
    this.latestExecutedSuite = null;
}

/**
 * Returns the latest executed test suite
 *
 * @return the latest executed test suite
 */
jsUnitRunner.prototype.getLatestExecutedSuite = function() {
    return this.latestExecutedSuite;
}

/**
 * Executes all test suites found in the given directory.
 * 
 * @param directory the path of the directory that contains the test suites
 */
jsUnitRunner.prototype.run = function() {
    var dir = new File(this.directory);
    if (dir.exists()) {
        var lst = dir.list();
        if (lst != null) {
            for (var i in lst) {
                this.executeTestSuite(lst[i]);
                this.latestExecutedSuite = lst[i];
            }
        }
    }
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
jsUnitRunner.prototype.createTestSuite = function (name) {
    var testName = name;
    var indexOfExtension = name.lastIndexOf('.');
    if ( indexOfExtension > 0 ) {
        testName = name.substr(0, indexOfExtension);
    }

    var dir = new File(this.directory);
    var script = String(
                     IOUtils.toString(
                        new FileReader(
                            dir.absolutePath +
                            dir.separator    +
                            name
                        )
                    )
                );
    eval(script);

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
jsUnitRunner.prototype.executeTestSuite = function(testSuite) {
    var testManager = new jsUnitTestManager();

    testManager.addSuite(this.createTestSuite(testSuite));
    testManager.start();
}

