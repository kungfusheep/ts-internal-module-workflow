var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ns_testModule;
(function (ns_testModule) {
    /**
     * ClassTwo
     */
    var ClassTwo = (function (_super) {
        __extends(ClassTwo, _super);
        function ClassTwo() {
            _super.call(this);
        }
        return ClassTwo;
    })(ns_test.ClassTwo);
    ns_testModule.ClassTwo = ClassTwo;
})(ns_testModule || (ns_testModule = {}));







var ns_testModule;
(function (ns_testModule) {
    var ClassOne = (function (_super) {
        __extends(ClassOne, _super);
        function ClassOne() {
            _super.call(this);
            console.log("TestModule!");
        }
        ClassOne.prototype.testMethod = function () {
        };
        return ClassOne;
    })(ns_test.ClassOne);
    ns_testModule.ClassOne = ClassOne;
})(ns_testModule || (ns_testModule = {}));

var testModule;
(function (testModule) {
    console.log("entry!?");
    var one = new ns_testModule.ClassOne();
    var two = new ns_testModule.ClassTwo();
})(testModule || (testModule = {}));

//# sourceMappingURL=TestModule/build/output.js.map