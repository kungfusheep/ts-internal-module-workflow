var ns_test;
(function (ns_test) {
    var ClassOne = (function () {
        function ClassOne() {
            console.log(1);
        }
        ClassOne.prototype.testMethod = function () {
        };
        return ClassOne;
    })();
    ns_test.ClassOne = ClassOne;
})(ns_test || (ns_test = {}));

var ns_test;
(function (ns_test) {
    /**
     * ClassTwo
     */
    var ClassTwo = (function () {
        function ClassTwo() {
            //
        }
        return ClassTwo;
    })();
    ns_test.ClassTwo = ClassTwo;
})(ns_test || (ns_test = {}));

var test;
(function (test) {
    console.log("entry!?");
    var one = new ns_test.ClassOne();
    var two = new ns_test.ClassTwo();
})(test || (test = {}));

//# sourceMappingURL=base/release/output.js.map