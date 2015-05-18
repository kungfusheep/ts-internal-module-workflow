var kungfu;
(function (kungfu) {
    var Tween = (function () {
        function Tween() {
        }
        return Tween;
    })();
    kungfu.Tween = Tween;
})(kungfu || (kungfu = {}));
var ref;
(function (ref) {
    var Tween = kungfu.Tween;
    var TestClass = (function () {
        function TestClass() {
        }
        TestClass.prototype.meth = function () {
            new Tween();
        };
        return TestClass;
    })();
    ref.TestClass = TestClass;
})(ref || (ref = {}));
/// <reference path="main.ts" />
/// <reference path="Ref.ts" />
