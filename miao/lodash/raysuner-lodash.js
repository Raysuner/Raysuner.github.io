var raysuner = {
    /*
    基础函数
     */
    getObjKey: function (collection, key, callback) {
        let index
        if (callback instanceof Function) {
            index = callback(collection[key])
        }
        else if (typeof callback === "string") {
            index = collection[key][callback]
        }
        return index
    },

    predicate: function (callback, item) {
        if (callback instanceof Function) {
            if (callback(item)) {
                return true
            }
        }
        else if (typeof callback === "string") {
            if (item[callback]) {
                return true
            }
        }
        return false
    },

    type: function (obj) {
        if (typeof obj === "object") {
            return Object.prototype.toString.call(obj).match(/\b[A-Z]\w+\b/g)[0].toLowerCase();
        }
        return typeof obj;
    },

    objToArray: function(collection) {
        const array = []
        for(let key in collection) {
            if(collection.hasOwnProperty(key)) {
                array.push(key)
            }
        }
        return array
    },

    arrayEach: function(collection, callback) {
        for(let item of collection) {
            callback(item)
        }
    },

    baseEach: function(collection, callback) {
        if(raysuner.type(collection) === "object") {
            const array = raysuner.objToArray(collection)
            raysuner.forEach(array, callback)
        }
    },

    arrayRightEach: function(collection, callback) {
        for(let i = collection.length - 1; i >= 0; i--) {
            callback(collection[i])
        }
    },

    baseRightEach: function(collection, callback) {

    },

    /*
    集合
     */
    countBy: function (collection, callback, arg) {
        let count = {}
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                let index = raysuner.getObjKey(collection, key, callback)
                if (index in count) {
                    count[index]++
                }
                else {
                    count[index] = 1
                }
            }
        }
        return count
    },

    forEach: function (collection, callback) {
        if (collection instanceof Array) {
            raysuner.arrayEach(collection, callback)
        }
        else {
            raysuner.baseEach(collection, callback)
        }
    },

    forEachRight: function (collection, callback) {
        if(Array.isArray(collection)) {
            raysuner.arrayRightEach(collection, callback)
        }
        else {
            const array = raysuner.objToArray(collection)
            raysuner.arrayRightEach(array, callback)
        }
    },

    every: function (collection, callback) {
        const array = []
        if (collection.length === 0) {
            return array
        }
        for (let key in callback) {
            if (callback.hasOwnProperty(key)) {

            }
        }
    },

    filter: function (collection, callback) {
        const array = []
        if (Array.isArray(callback)) {
            for (let i = 0; i < callback.length - 1; i++) {
                if (typeof callback[i] === "string" && typeof callback[i + 1] === "boolean") {
                    for (let obj of collection) {
                        if (callback[i] in obj && obj[callback[i]] === callback[i + 1]) {
                            array.push(obj)
                        }
                    }
                }
            }
        }

        else if (raysuner.type(callback) === "object") {
            for (let obj of collection) {
                let flag = true
                for (let key in callback) {
                    if (callback.hasOwnProperty(key)) {
                        if (callback[key] !== obj[key]) {
                            flag = false
                        }
                    }
                }
                if (flag) {
                    array.push(obj)
                }
            }
        }
        else {
            for (let obj of collection) {
                if (raysuner.predicate(callback, obj)) {
                    array.push(obj)
                }
            }
        }
        return array
    },

    find: function (collection, callback) {
        const array = []
        if (Array.isArray(callback)) {
            for (let i = 0; i < callback.length - 1; i++) {
                if (typeof callback[i] === "string" && typeof callback[i + 1] === "boolean") {
                    for (let obj of collection) {
                        if (callback[i] in obj && obj[callback[i]] === callback[i + 1]) {
                            return obj
                        }
                    }
                }
            }
        }

        else if (raysuner.type(callback) === "object") {
            for (let obj of collection) {
                let flag = true
                for (let key in callback) {
                    if (callback.hasOwnProperty(key)) {
                        if (callback[key] !== obj[key]) {
                            flag = false
                        }
                    }
                }
                if (flag) {
                    return obj
                }
            }
        }
        else {
            for (let obj of collection) {
                if (raysuner.predicate(callback, obj)) {
                    return obj
                }
            }
        }
    },

    flatMap: function (collection, callback) {
        let array = []
        if (callback instanceof Function) {
            for (let item of collection) {
                array = array.concat(callback(item))
            }
            return array
        }
    },

    groupBy: function (collection, callback) {
        const res = {}
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                let resKey = raysuner.getObjKey(collection, key, callback)
                if (resKey in res) {
                    res[resKey].push(collection[key])
                }
                else {
                    res[resKey] = [collection[key]]
                }
            }
        }
        return res
    },

    includes: function (collection, value, fromIndex = 0) {
        if (typeof collection[0] === "object") {
            for (let key in collection) {
                if (collection.hasOwnProperty(key)) {
                    if (key === value) {
                        return true
                    }
                }
            }
        }
        else if (collection instanceof Array || typeof collection === "string") {
            if (fromIndex >= 0) {
                for (let key in collection) {
                    if (collection.hasOwnProperty(key)) {
                        if (collection[key] === value) {
                            return true
                        }
                    }
                }
            }
            else {
                for (let i = collection.length - 1; i >= 0; i--) {
                    if (collection[i] === value) {
                        return true
                    }
                }
            }
        }
        return false
    },

    invokeMap: function (collection, callback, arg) {
        const array = []
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                if (typeof callback === "string") {
                    array.push(collection[key][callback]())
                }
                else if (callback instanceof Function) {
                    array.push(callback.call(collection[key], arg))
                }
            }
        }
        return array
    },

    keyBy: function (collection, callback) {
        const res = {}
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                let resKey = raysuner.getObjKey(collection, key, callback)
                res[resKey] = collection[key]
            }
        }
        return res
    },

    map: function (collection, callback) {
        const array = []
        for(let key in collection) {
            if(collection.hasOwnProperty(key)) {
                if(callback instanceof Function) {
                    array.push(callback(collection[key]))
                }
                else {
                    array.push(collection[key][callback])
                }
            }
        }
        return array
    },

    sortBy: function(collection, compare, callbackFn) {
        for(let i = 1; i < collection.length; i++) {
            let temp = collection[i]
            let j
            for(j = i - 1; j >= 0; j--) {
                if(compare(temp, collection[j]) < 0) {
                    collection[j + 1] = collection[j]
                }
                else {
                    break
                }
            }
            collection[j + 1] = temp
        }
    },

    orderBy: function (collection, callback, order) {

    }
}

var users = [
    {'user': 'barney', 'age': 36, 'active': true},
    {'user': 'fred', 'age': 40, 'active': false}
];

var users1 = [
    { 'user': 'fred',   'age': 48 },
    { 'user': 'barney', 'age': 34 },
    { 'user': 'fred',   'age': 40 },
    { 'user': 'barney', 'age': 36 }
];

var users2 = [
    { 'dir': 'left', 'code': 97 },
    { 'dir': 'right', 'code': 100 }
];


raysuner.forEach([1, 2], item => {console.log(item)});
raysuner.forEach({ 'a': 1, 'b': 2 }, item => {console.log(item)})
raysuner.forEachRight([1, 2], item => {console.log(item)});
raysuner.forEachRight({ 'a': 1, 'b': 2 }, item => {console.log(item)})
console.log(raysuner.countBy([6.1, 4.2, 6.3], Math.floor))
console.log(raysuner.countBy(['one', 'two', 'three'], 'length'))
console.log(raysuner.flatMap([1, 2], function (n) {
    return [n, n]
}))
console.log(raysuner.filter(users, function (o) {
    return !o.active;
}))
console.log(raysuner.filter(users, {'age': 36, 'active': true}))
console.log(raysuner.filter(users, ['active', false]))
console.log(raysuner.filter(users, 'active'))

console.log(raysuner.find(users, function (o) {
    return !o.active;
}))
console.log(raysuner.find(users, {'age': 36, 'active': true}))
console.log(raysuner.find(users, ['active', false]))
console.log(raysuner.find(users, 'active'))
console.log(raysuner.groupBy([6.1, 4.2, 6.3], Math.floor))
console.log(raysuner.groupBy(['one', 'two', 'three'], 'length'))
console.log(raysuner.invokeMap([[5, 1, 7], [3, 2, 1]], 'sort'))
console.log(raysuner.invokeMap([123, 456], String.prototype.split, ''))
console.log(raysuner.keyBy(users2, o => String.fromCharCode(o.code)))
console.log(raysuner.keyBy(users2, 'dir'))
console.log(raysuner.map([2,4], x => x * x))
console.log(raysuner.map({a: 3, b: 9}, x => x * x))
console.log(raysuner.map(users, 'user'))
raysuner.sortBy(users1, (a, b)=> a.user - b.user)
raysuner.sortBy(users1, (a, b) => a.age - b.age)
console.log("sortBy",users1)