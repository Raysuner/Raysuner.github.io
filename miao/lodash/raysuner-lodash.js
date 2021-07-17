var raysuner = {
    /*
    基础函数
     */
    getKey: function (item, callback) {
        let key;
        if (typeof callback === "string") {
            key = callback;
        } else if (typeof callback === "function") {
            key = callback(item);
        }
        return key;
    },
    getValue: function (item, callback) {
        let index;
        if (typeof callback === "function") {
            index = callback(item);
        } else if (typeof callback === "string") {
            index = item[callback];
        }
        return index;
    },

    predicate: function (item, callback) {
        if (raysuner.getType(callback) === "object") {
            for (let key in callback) {
                if (callback.hasOwnProperty(key)) {
                    if (callback[key] !== item[key]) {
                        return false;
                    }
                }
            }
            return true;
        } else if (Array.isArray(callback)) {
            return item[callback[0]] === callback[1];
        } else if (typeof callback === "function") {
            if (callback(item)) {
                return true;
            }
        } else if (typeof callback === "string") {
            if (item[callback]) {
                return true;
            }
        }
        return false;
    },

    getType: function (obj) {
        if (typeof obj === "object") {
            return Object.prototype.toString
                .call(obj)
                .match(/\b[A-Z]\w+\b/g)[0]
                .toLowerCase();
        }
        return typeof obj;
    },

    objectToArray: function (collection) {
        const array = [];
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                array.push(key);
            }
        }
        return array;
    },

    originalArrayForEach: function (collection, callback) {
        for (let i = 0; i < collection.length; i++) {
            callback(collection[i], i, collection);
        }
    },

    baseEach: function (collection, callback) {
        for (let i = 0; i < collection.length; i++) {
            if (callback(collection[i], i, collection) === false) {
                break;
            }
        }
    },

    objectEach: function (collection, callback) {
        let keys = raysuner.objectToArray(collection);
        for (let i = 0; i < keys.length; i++) {
            if (callback(collection[keys[i]], keys[i], collection) === false) {
                break;
            }
        }
    },

    baseRightEach: function (collection, callback) {
        for (let i = collection.length - 1; i >= 0; i--) {
            if (callback(collection[i], i, collection) === false) {
                break;
            }
        }
    },

    objectRightEach: function (collection, callback) {
        const keys = raysuner.objectToArray(collection);
        for (let i = keys.length - 1; i >= 0; i--) {
            if (callback(collection[keys[i]], keys[i], collection) === false) {
                break;
            }
        }
    },

    baseFind: function (collection, callback, fromIndex) {
        for (let i = fromIndex; i < collection.length; i++) {
            if (raysuner.predicate(collection[i], callback)) {
                return collection[i];
            }
        }
    },

    objectFind: function (collection, callback, fromIndex) {
        const keys = raysuner.objectToArray(collection);
        for (let i = fromIndex; i < keys.length; i++) {
            if (raysuner.predicate(collection[keys[i]], callback)) {
                return collection[keys[i]];
            }
        }
    },

    baseFindLast: function (collection, callback, fromIndex) {
        for (let i = collection.length - 1 - fromIndex; i >= 0; i--) {
            if (raysuner.predicate(collection[i], callback)) {
                return collection[i];
            }
        }
    },

    objectFindLast: function (collection, callback, fromIndex) {
        const keys = raysuner.objectToArray(collection);
        for (let i = keys.length - 1 - fromIndex; i >= 0; i--) {
            if (raysuner.predicate(collection[keys[i]], callback)) {
                return collection[keys[i]];
            }
        }
    },
    /*
    数组
    */
    chunk: function (array, size = 1) {
        if (!Array.isArray(array)) {
            return [];
        }
        const arr = [];
        let len = size;
        for (let i = 0; i < array.length; ) {
            let temp = [];
            while (i < array.length && len--) {
                temp.push(array[i++]);
            }
            arr.push(temp);
            len = size;
        }
        return arr;
    },

    compact: function (array) {
        if (!Array.isArray(array)) {
            return [];
        }
        const arr = [];
        for (let i = 0; i < array.length; i++) {
            if (array[i]) {
                arr.push(array[i]);
            }
        }
        return arr;
    },

    concat: function (array, ...args) {
        const arr = [];
        if (!Array.isArray(array)) {
            arr.push(array);
        } else {
            for (let item of array) {
                arr.push(item);
            }
        }
        for (let item of args) {
            if (Array.isArray(item)) {
                for (let it of item) {
                    arr.push(it);
                }
            } else {
                arr.push(item);
            }
        }
        return arr;
    },

    difference: function (array, value) {
        if (!Array.isArray(array)) {
            return [];
        } else if (Array.isArray(array) && !Array.isArray(value)) {
            return array;
        }
        let set = {};
        for (let item of value) {
            if (!(item in set)) {
                set[item] = true;
            }
        }
        const arr = [];
        for (let item of array) {
            if (!(item in set)) {
                arr.push(item);
            }
        }
        return arr;
    },

    differenceBy: function (array, values, callback) {
        if (!Array.isArray(array)) {
            return [];
        } else if (
            (Array.isArray(array) && !Array.isArray(values)) ||
            (typeof callback !== "function" && typeof callback !== "string")
        ) {
            return array;
        }
        let set = {};
        let key;
        for (let item of values) {
            key = raysuner.getKey(item, callback);
            if (raysuner.getType(item) === "object") {
                set[key] = item[key];
            } else {
                if (!(key in set)) {
                    set[key] = true;
                }
            }
        }
        const arr = [];
        for (let item of array) {
            key = raysuner.getKey(item, callback);
            if (raysuner.getType(item) === "object") {
                if (item[key] !== set[key]) {
                    arr.push(item);
                }
            } else {
                if (!(key in set)) {
                    arr.push(item);
                }
            }
        }
        return arr;
    },

    /*
    集合
     */
    countBy: function (collection, callback, arg) {
        let count = {};
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                let index = raysuner.getValue(collection[key], callback);
                if (index in count) {
                    count[index]++;
                } else {
                    count[index] = 1;
                }
            }
        }
        return count;
    },

    forEach: function (collection, callback) {
        const func = Array.isArray(collection)
            ? raysuner.baseEach
            : raysuner.objectEach;
        func(collection, callback);
        return collection;
    },

    forEachRight: function (collection, callback) {
        const func = Array.isArray(collection)
            ? raysuner.baseRightEach
            : raysuner.objectRightEach;
        func(collection, callback);
        return collection;
    },

    every: function (collection, callback) {
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                if (!raysuner.predicate(collection[key], callback)) {
                    return false;
                }
            }
        }
        return true;
    },

    filter: function (collection, callback) {
        const array = [];
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                if (raysuner.predicate(collection[key], callback)) {
                    array.push(collection[key]);
                }
            }
        }
        return array;
    },

    find: function (collection, callback, fromIndex = 0) {
        let func = Array.isArray(collection)
            ? raysuner.baseFind
            : raysuner.objectFind;
        return func(collection, callback, fromIndex);
    },

    findLast: function (collection, callback, fromIndex = 0) {
        let func = Array.isArray(collection)
            ? raysuner.baseFindLast
            : raysuner.objectFindLast;
        return func(collection, callback, fromIndex);
    },

    flatMap: function (collection, callback) {
        let array = [];
        if (typeof callback === "function") {
            for (let key in collection) {
                if (collection.hasOwnProperty(key)) {
                    array = array.concat(callback(collection[key]));
                }
            }
        }
        return array;
    },

    groupBy: function (collection, callback) {
        const res = {};
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                let resKey = raysuner.getValue(collection[key], callback);
                if (resKey in res) {
                    res[resKey].push(collection[key]);
                } else {
                    res[resKey] = [collection[key]];
                }
            }
        }
        return res;
    },

    invokeMap: function (collection, callback, arg) {
        const array = [];
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                if (typeof callback === "string") {
                    array.push(collection[key][callback]());
                } else if (typeof callback === "function") {
                    array.push(callback.call(collection[key], arg));
                }
            }
        }
        return array;
    },

    keyBy: function (collection, callback) {
        const res = {};
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                let resKey = raysuner.getValue(collection[key], callback);
                res[resKey] = collection[key];
            }
        }
        return res;
    },

    map: function (collection, callback) {
        const array = [];
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                if (typeof callback === "function") {
                    array.push(callback(collection[key], key, collection));
                } else {
                    array.push(collection[key][callback]);
                }
            }
        }
        return array;
    },

    sortBy: function (collection, compare, callbackFn) {
        for (let i = 1; i < collection.length; i++) {
            let temp = collection[i];
            let j;
            for (j = i - 1; j >= 0; j--) {
                if (compare(temp, collection[j]) < 0) {
                    collection[j + 1] = collection[j];
                } else {
                    break;
                }
            }
            collection[j + 1] = temp;
        }
    },

    orderBy: function (collection, callback, order) {},
};

var users = [
    { user: "barney", age: 36, active: true },
    { user: "fred", age: 40, active: false },
];

var users1 = [
    { user: "fred", age: 48 },
    { user: "barney", age: 34 },
    { user: "fred", age: 40 },
    { user: "barney", age: 36 },
];

var users2 = [
    { dir: "left", code: 97 },
    { dir: "right", code: 100 },
];
var users3 = [
    { user: "barney", age: 36, active: false },
    { user: "fred", age: 40, active: false },
];

// console.log(raysuner.chunk([1, 2, 3], 2));
// console.log(raysuner.difference([1,2,3], [4,2]))
console.log(raysuner.differenceBy([3.1, 2.2, 1.3], [4.4, 2.5], Math.floor));
console.log(raysuner.differenceBy([{ x: 2 }, { x: 1 }], [{ x: 1 }], "x"));
// raysuner.forEach([1, 2], (item) => {
//     console.log(item);
// });
// raysuner.forEach({ a: 1, b: 2 }, (item) => {
//     console.log(item);
// });
// raysuner.forEachRight([1, 2], (item) => {
//     console.log(item);
// });
// raysuner.forEachRight({ a: 1, b: 2 }, (item, key) => {
//     console.log(item, key);
// });
// console.log(raysuner.countBy([6.1, 4.2, 6.3], Math.floor));
// console.log(raysuner.countBy(["one", "two", "three"], "length"));
// console.log(
//     raysuner.flatMap([1, 2], function (n) {
//         return [n, n];
//     })
// );
// console.log(raysuner.every([true, 1, null, "yes"], Boolean));

// console.log(raysuner.every(users3, { user: "barney", active: false }));
// // => true
// console.log(raysuner.every(users3, ["active", false]));
// // The `_.property` iteratee shorthand.
// console.log(raysuner.every(users3, "active"));
// // => false
// console.log(
//     raysuner.filter(users, function (o) {
//         return !o.active;
//     })
// );
// console.log(raysuner.filter(users, { age: 36, active: true }));
// console.log(raysuner.filter(users, ["active", false]));
// console.log(raysuner.filter(users, "active"));

// console.log(
//     raysuner.find(users, function (o) {
//         return o.age < 40;
//     })
// );
// console.log(raysuner.find(users, { age: 1, active: true }));
// console.log(raysuner.find(users, ["active", false]));
// console.log(raysuner.find(users, "active"));
// debugger;
// console.log(
//     "last",
//     raysuner.findLast(users, (val) => val.age % 2 === 0)
// );
// console.log(raysuner.groupBy([6.1, 4.2, 6.3], Math.floor));
// console.log(raysuner.groupBy(["one", "two", "three"], "length"));
// console.log(
//     raysuner.invokeMap(
//         [
//             [5, 1, 7],
//             [3, 2, 1],
//         ],
//         "sort"
//     )
// );
// console.log(raysuner.invokeMap([123, 456], String.prototype.split, ""));
// console.log(raysuner.keyBy(users2, (o) => String.fromCharCode(o.code)));
// console.log(raysuner.keyBy(users2, "dir"));
// console.log(raysuner.map([2, 4], (x) => x * x));
// console.log(raysuner.map({ a: 3, b: 9 }, (x) => x * x));
// debugger
// console.log(raysuner.map([1,2,3,4,5], (a,b) => (a + b) % 2 === 0));
// console.log(raysuner.map(users, "user"));
// raysuner.sortBy(users1, (a, b) => a.user - b.user);
// raysuner.sortBy(users1, (a, b) => a.age - b.age);
// console.log(users1);
