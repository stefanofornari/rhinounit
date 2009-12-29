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

function jsUnitResult() {
    this.elapsedTime = 0;
    this.error       = null;
    this.name        = "Anonymous result";
    this.description = "";
}

jsUnitResult.prototype.isSuccess = function() {
    return (this.error == null);
}

jsUnitResult.prototype.isError = function() {

    return (this.error != null)
        && !(typeof(this.error.isJsUnitException) != 'undefined' && this.error.isJsUnitException);
}

jsUnitResult.prototype.isFailure = function() {

    return (this.error != null)
        && (typeof(this.error.isJsUnitException) != 'undefined' && this.error.isJsUnitException);
}