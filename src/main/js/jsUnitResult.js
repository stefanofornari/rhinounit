/*
 * @author Stefano Fornari stefano.fornari funambol.com
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