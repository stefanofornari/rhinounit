function testsuite1() {
}

testsuite1.prototype.run = function (successCondition) {
    if (successCondition == "error") {
        error("ERROR");
    } else if (successCondition == "fail") {
        fail("FAIL");
    }
}

testsuite1.prototype.testRunSuccessfully = function testRunSuccessfully() {
    this.run("success");
}

testsuite1.prototype.testRunWithError = function testRunWithError() {
    try {
        this.run("error");
    } catch (e) {
        assertEquals("ERROR", e.description);
    }
}

testsuite1.prototype.testFail = function testFail() {
    try {
        this.run("fail");
    } catch (e) {
        assertEquals("FAIL", e.description);
    }
}
