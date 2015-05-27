var ns_test;
(function (ns_test) {
    var BaseOne = (function () {
        function BaseOne() {
            console.log("base!!");
        }
        BaseOne.prototype.testMethod = function () {
            //
        };
        return BaseOne;
    })();
    ns_test.BaseOne = BaseOne;
})(ns_test || (ns_test = {}));

var ns_test;
(function (ns_test) {
    /**
     * ClassTwo
     */
    var BaseTwo = (function () {
        function BaseTwo() {
            //
        }
        return BaseTwo;
    })();
    ns_test.BaseTwo = BaseTwo;
})(ns_test || (ns_test = {}));

//# sourceMappingURL=/base/build/base.js.map