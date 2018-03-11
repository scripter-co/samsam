"use strict";

var referee = require("referee");
var assert = referee.assert;
var refute = referee.refute;
require("jsdom-global")();
var samsam = require("./samsam");

describe("isElement", function () {
    it("Should pass if DOM element node", function () {
        if (typeof document !== "undefined") {
            var element = document.createElement("div");
            var checkElement = samsam.isElement(element);
            assert.equals(checkElement, true);
        }
    });

    it("Should fail if DOM text node", function () {
        if (typeof document !== "undefined") {
            var element = document.createTextNode("Hello");
            var checkElement = samsam.isElement(element);
            refute.equals(checkElement, true);
        }
    });

    it("Should fail if node like object", function () {
        var nodeLike = { nodeType: 1 };
        var checkElement = samsam.isElement(nodeLike);
        refute.equals(checkElement, true);
    });

    it("Should fail if number", function () {
        var checkElement = samsam.isElement(42);
        refute.equals(checkElement, true);
    });

    it("Should fail if object", function () {
        var checkElement = samsam.isElement({});
        refute.equals(checkElement, true);
    });
});

describe("isArguments", function () {
    it("Should pass if arguments is an object", function () {
        var checkArgs = samsam.isArguments(arguments);
        assert.equals(checkArgs, true);
    });

    it("Should fail if number", function () {
        var checkArgs = samsam.isArguments(24);
        refute.equals(checkArgs, true);
    });

    it("Should fail if empty object", function () {
        var checkArgs = samsam.isArguments({});
        refute.equals(checkArgs, true);
    });

    it("Should pass if arguments object from strict-mode function", function () {
        var returnArgs = function () {
            return arguments;
        };
        var checkArgs = samsam.isArguments(returnArgs());
        assert.equals(checkArgs, true);
    });
});

describe("isNegZero", function () {
    it("Should pass if negative zero", function () {
        var checkZero = samsam.isNegZero(-0);
        assert.equals(checkZero, true);
    });

    it("Should fail if zero", function () {
        var checkZero = samsam.isNegZero(0);
        refute.equals(checkZero, true);
    });

    it("Should fail if object", function () {
        var checkZero = samsam.isNegZero({});
        refute.equals(checkZero, true);
    });

    it("Should fail if String", function () {
        var checkZero = samsam.isNegZero("-0");
        refute.equals(checkZero, true);
    });
});

describe("identical", function () {
    it("Should pass if strings are identical", function () {
        var str = "string";
        var checkIdent = samsam.identical(str, str);
        assert.equals(checkIdent, true);
    });

    it("Should pass if objects are identical", function () {
        var obj = { id: 42 };
        var checkIdent = samsam.identical(obj, obj);
        assert.equals(checkIdent, true);
    });

    it("Should pass if NaN", function () {
        var checkIdent = samsam.identical(NaN, NaN);
        assert.equals(checkIdent, true);
    });

    it("Should fail if equal but different type", function () {
        var checkIdent = samsam.identical(0, "0");
        refute.equals(checkIdent, true);
    });

    it("Should fail on -0 and 0", function () {
        var checkIdent = samsam.identical(0, -0);
        refute.equals(checkIdent, true);
    });
});

describe("deepEqual (cyclic)", function () {
    it("Should pass if equal cyclic objects (cycle on 2nd level)", function () {
        var cyclic1 = {};
        var cyclic2 = {};
        cyclic1.ref = cyclic1;
        cyclic2.ref = cyclic2;
        var checkDeep = samsam.deepEqual(cyclic1, cyclic2);
        assert.equals(checkDeep, true);
    });

    it("Should fail if different cyclic objects (cycle on 2nd level)", function () {
        var cyclic1 = {};
        var cyclic2 = {};
        cyclic1.ref = cyclic1;
        cyclic2.ref = cyclic2;
        cyclic2.ref2 = cyclic2;
        var checkDeep = samsam.deepEqual(cyclic1, cyclic2);
        refute.equals(checkDeep, true);
    });

    it("Should pass if equal cyclic objects (cycle on 3rd level)", function () {
        var cyclic1 = {};
        var cyclic2 = {};
        cyclic1.ref = {};
        cyclic1.ref.ref = cyclic1;
        cyclic2.ref = {};
        cyclic2.ref.ref = cyclic2;
        var checkDeep = samsam.deepEqual(cyclic1, cyclic2);
        assert.equals(checkDeep, true);
    });

    it("Should fail if different cyclic objects (cycle on 3rd level)", function () {
        var cyclic1 = {};
        var cyclic2 = {};
        cyclic1.ref = {};
        cyclic1.ref.ref = cyclic1;
        cyclic2.ref = {};
        cyclic2.ref.ref = cyclic2;
        cyclic2.ref.ref2 = cyclic2;
        var checkDeep = samsam.deepEqual(cyclic1, cyclic2);
        refute.equals(checkDeep, true);
    });

    it("Should pass if equal objects even though only one object is cyclic", function () {
        var cyclic1 = {};
        var cyclic2 = {};
        cyclic1.ref = cyclic1;
        cyclic2.ref = cyclic1;
        var checkDeep = samsam.deepEqual(cyclic1, cyclic2);
        assert.equals(checkDeep, true);
    });

    it("Should pass if referencing different but equal cyclic objects", function () {
        var cyclic1 = {};
        var cyclic2 = {};
        cyclic1.ref = {
            ref: cyclic1
        };
        cyclic2.ref = {};
        cyclic2.ref.ref = cyclic2.ref;
        var checkDeep = samsam.deepEqual(cyclic1, cyclic2);
        assert.equals(checkDeep, true);
    });

    it("Should fail if referencing different and unequal cyclic objects", function () {
        var cyclic1 = {a: "a"};
        var cyclic2 = {a: "a"};
        cyclic1.ref = {
            b: "b",
            ref: cyclic1
        };
        cyclic2.ref = {
            b: "b"
        };
        cyclic2.ref.ref = cyclic2.ref;
        var checkDeep = samsam.deepEqual(cyclic1, cyclic2);
        refute.equals(checkDeep, true);
    });
});

describe("deepEqual (non cyclic)", function () {

    it("Should pass when passing the same object", function () {
        var checkDeep = samsam.deepEqual({ someKey: true }, { someKey: true });
        assert.equals(checkDeep, true);
    });

    it("Should pass when passing the same string", function () {
        var checkDeep = samsam.deepEqual("hello", "hello");
        assert.equals(checkDeep, true);
    });

    it("Should pass when passing the same numbers", function () {
        var checkDeep = samsam.deepEqual(123, 123);
        assert.equals(checkDeep, true);
    });

    it("Should pass when passing the same boolean values", function () {
        var checkDeep = samsam.deepEqual(false, false);
        assert.equals(checkDeep, true);
    });

    it("Should pass when passing the same null value", function () {
        var checkDeep = samsam.deepEqual(null, null);
        assert.equals(checkDeep, true);
    });

    it("Should pass when passing the same undefined value", function () {
        var checkDeep = samsam.deepEqual(undefined, undefined);
        assert.equals(checkDeep, true);
    });

    it("Should pass when passing the same function reference", function () {
        function test() {
            return false;
        }
        var checkDeep = samsam.deepEqual(test, test);
        assert.equals(checkDeep, true);
    });

    it("Should fail when passing two different functions", function () {
        var functionOne = function () {};
        var functionTwo = function () {};
        var checkDeep = samsam.deepEqual(functionOne, functionTwo);
        refute.equals(checkDeep, true);
    });

    it("Should pass when passing the same array", function () {
        var checkDeep = samsam.deepEqual(["something", 1, {}], ["something", 1, {}]);
        assert.equals(checkDeep, true);
    });

    it("Should pass when passing the same date", function () {
        var now = new Date();
        var checkDeep = samsam.deepEqual(now, now);
        assert.equals(checkDeep, true);
    });

    it("Should fail when passing the different dates", function () {
        var currentTime = (new Date()).getTime();
        var now = new Date(currentTime);
        var yesterday = new Date(currentTime - 86400);
        var checkDeep = samsam.deepEqual(now, yesterday);
        refute.equals(checkDeep, true);
    });

    it("Should fail when passing date and null", function () {
        var checkDeep = samsam.deepEqual(new Date(), null);
        refute.equals(checkDeep, true);
    });

    it("Should fail when passing the same date but with different object properties", function () {
        var now = new Date();
        var nowWithCustomProp = Object.assign({ someOtherProp: "foo" }, now);
        var checkDeep = samsam.deepEqual(now, nowWithCustomProp);
        refute.equals(checkDeep, true);
    });

    it("Should fail when passing two numbers that are in types string and int", function () {
        var checkDeep = samsam.deepEqual("44", 44);
        refute.equals(checkDeep, true);
    });

    it("Should fail when passing in a number and a number object", function () {
        var checkDeep = samsam.deepEqual(44, new Number(44));
        refute.equals(checkDeep, true);
    });

    it("Should fail when passing a falsy value", function () {
        var checkDeep = samsam.deepEqual("", 0);
        refute.equals(checkDeep, true);
    });

    it("Should fail when passing in a string and string object", function () {
        var checkDeep = samsam.deepEqual("hello", new String("hello"));
        refute.equals(checkDeep, true);
    });

    it("Should pass when passing in the same NaN", function () {
        var checkDeep = samsam.deepEqual(NaN, NaN);
        assert.equals(checkDeep, true);
    });

    it("Should fail when comparing -0 to +0", function () {
        var checkDeep = samsam.deepEqual(-0, +0);
        refute.equals(checkDeep, true);
    });

    it("Should fail when comparing -0 to 0", function () {
        var checkDeep = samsam.deepEqual(-0, 0);
        refute.equals(checkDeep, true);
    });

    it("Should fail when comparing objects with different properties", function () {
        var objectOne = { id: 12, key: true };
        var objectTwo = { di: 12, key: true };
        var checkDeep = samsam.deepEqual(objectOne, objectTwo);
        refute.equals(checkDeep, true);
    });

    it("Should pass when comparing two objects with same properties", function () {
        assert.equals(samsam.deepEqual({ id: 1 }, { id: 1 }), true);
        assert.equals(samsam.deepEqual({ obj: { id: 1 } }, { obj: { id: 1 } }), true);
    });

    it("Should fail when comparing two objects with same keys, different values", function () {
        var checkDeep = samsam.deepEqual({ id: 321 }, { id: 123 });
        refute.equals(checkDeep, true);
    });

    it("Should pass when comparign a complex object", function () {
        var object = {
            internalObject: {
                id: 1234
            },
            name: "objectName",
            someArray: [
                {
                    id: 1
                },
                {
                    id: 2
                }
            ]
        };
        var checkDeep = samsam.deepEqual(object, object);
        assert.equals(checkDeep, true);
    });

    it("Should pass when comparign a complex array", function () {
        var array = [
            {
                id: 123
            },
            [1, 2, 3],
            "hello"
        ];
        var checkDeep = samsam.deepEqual(array, array);
        assert.equals(checkDeep, true);
    });

    it("Should fail when comparing shallow and nested array", function () {
        var arrayOne = [1];
        var arrayTwo = [[1]];
        var checkDeep = samsam.deepEqual(arrayOne, arrayTwo);
        refute.equals(checkDeep, true);
    });

    it("Should fail when comparing array with different custom properties", function () {
        var arrayOne = [1];
        var arrayTwo = [1];
        arrayTwo.customProp = true;
        var checkDeep = samsam.deepEqual(arrayOne, arrayTwo);
        refute.equals(checkDeep, true);
    });

    it("Should pass when comparing regex literals", function () {
        var checkDeep = samsam.deepEqual(/(.*)/, /(.*)/);
        assert.equals(checkDeep, true);
    });

    it("Should pass when comparing regex objects", function () {
        var checkDeep = samsam.deepEqual(new RegExp("/(.*)/"), new RegExp("/(.*)/"));
        assert.equals(checkDeep, true);
    });

    it("Should fail when comparing regex objects with different custom properties", function () {
        var regexOne = new RegExp("/(.*)/");
        var regexTwo = new RegExp("/(.*)/");
        regexTwo.customProp = true;
        var checkDeep = samsam.deepEqual(regexOne, regexTwo);
        refute.equals(checkDeep, true);
    });

    it("Should fail when comparing object to null", function () {
        var checkDeep = samsam.deepEqual({ id: 123 }, null);
        refute.equals(checkDeep, true);
    });

    it("Should fail when comparing object to undefined", function () {
        var checkDeep = samsam.deepEqual({ id: 123 }, undefined);
        refute.equals(checkDeep, true);
    });

    it("Should fail when comparing object to false", function () {
        var checkDeep = samsam.deepEqual({ id: 123 }, false);
        refute.equals(checkDeep, true);
    });

    it("Should fail when comparing object to true", function () {
        var checkDeep = samsam.deepEqual({ id: 123 }, true);
        refute.equals(checkDeep, true);
    });

    it("Should fail when comparing empty object to date object", function () {
        var checkDeep = samsam.deepEqual({}, new Date());
        refute.equals(checkDeep, true);
    });

    it("Should fail when comparing empty object to string object", function () {
        var checkDeep = samsam.deepEqual({}, new String());
        refute.equals(checkDeep, true);
    });

    it("Should fail when comparing empty object to number object", function () {
        var checkDeep = samsam.deepEqual({}, new Number());
        refute.equals(checkDeep, true);
    });

    it("Should fail when comparing empty object to empty array", function () {
        var checkDeep = samsam.deepEqual({}, []);
        refute.equals(checkDeep, true);
    });

    it("Should pass when comparing arguments to arrays", function () {
        function passThrouhArgs() { return arguments; }
        var checkDeep = samsam.deepEqual([1, 2, 3], passThrouhArgs(1, 2, 3));
        assert.equals(checkDeep, true);
    });

    it("Should pass when comparing array to arguments", function () {
        function passThrouhArgs() { return arguments; }
        var checkDeep = samsam.deepEqual([1, 2, 3], passThrouhArgs(1, 2, 3));
        assert.equals(checkDeep, true);
    });

    it("Should pass when comparing arguments to array like object", function () {
        function passThrouhArgs() { return arguments; }
        var checkDeep = samsam.deepEqual({ length: 3, "0": true, "1": {}, "2": [] }, passThrouhArgs(true, {}, []));
        assert.equals(checkDeep, true);
    });

    if (typeof Set !== "undefined") {

        it("Should pass when set with the same content", function () {
            var checkDeep = samsam.deepEqual(new Set([3, 2, 1]), new Set([1, 2, 3]));
            assert.equals(checkDeep, true);
        });

        it("Should fail when set with different content", function () {
            var checkDeep = samsam.deepEqual(new Set([5, 6, 1]), new Set([3, 2, 1]));
            refute.equals(checkDeep, true);
        });

    }

});
