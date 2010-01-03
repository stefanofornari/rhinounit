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

/**
 *  This class is a ResultListener that output the result of a test
 *  execution into a file with the following naming convention:
 *  <code>
 *    TEST-[testsuite name].xml
 *  </code>
 *  The format of this file is the same as sourefire.
 */
function jsUnitResultWriter(suite) {
    this.suite = suite;
}

jsUnitResultWriter.prototype.write = function () {
    this.writeStart();
    this.writeTestSuite();
    this.writeEnd();
}

jsUnitResultWriter.prototype.writeResults = function () {
    this._write( '<testsuite time="'
               + this.suite.getElapsedTime()
               + '" failures="'
               + this.suite.getFailureCount()
               + '" errors="'
               + this.suite.getErrorCount()
               + '" tests="'
               + this.suite.getTestCount()
               + '" name="'
               + this.suite.name
               +'">'
               );

    this.writeTestResults();

    this._write("</suite>");
}

jsUnitResultWriter.prototype.writeStart = function () {
    this._write("<?xml version=\"1.0\" encoding=\"UTF-8\" ?>");
}

jsUnitResultWriter.prototype.writeTestResults = function () {
    var results = this.suite.getResults();
    for (i in results) {
        this.writeResult(results[i]);
    }
}

jsUnitResultWriter.prototype.writeResult = function (result) {
    this._write( '<testcase time="'
               + result.elapsedTime
               + '" name="'
               + result.name
               + '">'
               );
    if (!result.isSuccess()) {
        this.writeError(result);
    }
    this._write("</testcase>");
}

jsUnitResultWriter.prototype.writeError = function (result) {
    var type = (result.isError()) 
             ? "error"
             : "failure"
             ;

    var exception = result.error;
    var name = exception.name;
    
    if (typeof(exception.isJsUnitException) != 'undefined'
            && exception.isJsUnitException) {
        name = "jsUnitException";
    }
    this._write( '<'
               + type
               + ' type="'
               + name
               + '">'
               );
    if (exception.fileName) {
        this._write(exception.fileName + ":" + exception.lineNumber);
    }
    this._write(result.details);
    this._write("</" + type + ">");
}

jsUnitResultWriter.prototype._write = function (s) {
    println(s);
}