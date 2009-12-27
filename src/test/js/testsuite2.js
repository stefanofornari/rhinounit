function testsuite2() {
}

testsuite2.prototype.run = function (successCondition) {
    if (successCondition == "error") {
        error("ERROR");
    } else if (successCondition == "fail") {
        fail("FAIL");
    }
}

testsuite2.prototype.testRunSuccessfully = function testRunSuccessfully() {
    this.run("success");
}

testsuite2.prototype.testRunWithError = function testRunWithError() {
    try {
        this.run("error");
    } catch (e) {
        assertEquals("ERROR", e.description);
    }
}

testsuite2.prototype.testFail = function testFail() {
    try {
        this.run("fail");
    } catch (e) {
        assertEquals("FAIL", e.description);
    }
}
