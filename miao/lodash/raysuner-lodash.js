var raysuner = {
    /*
    集合
     */
    countBy: function (collection, predicate, arg) {
        let count = {}
        for (let key in collection) {
            let index
            if (collection.hasOwnProperty(key)) {
                if (predicate instanceof Function) {
                    index = predicate(collection[key])
                }
                else if(typeof predicate === "string") {
                    index = collection[key][predicate]
                }
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

    foreach: function (collection, callback) {
        if (collection instanceof Array) {
            for (let item of collection) {
                if (!callback(item)) {
                    break
                }
            }
        }
        else if (typeof collection === "object") {
            for (let key in collection) {
                if (collection.hasOwnProperty(key)) {
                    if (!callback(collection[key], key, collection)) {
                        break
                    }
                }
            }
        }
    },

    forEachRight: function (collection, callback) {
        const array = []
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                array.push([collection[key], key, collection])
            }
        }
        for (let i = array.length - 1; i >= 0; i--) {
            callback(array[i][0], array[i][1], array[i][2])
        }
    },

    every: function (collection, predicate) {
        const array = []
        if (collection.length === 0) {
            return array
        }
        for (let key in predicate) {
            if (predicate.hasOwnProperty(key)) {

            }
        }
    },

    filter: function (collection, predicate) {
        const array = []
        if (predicate instanceof Function) {
            for (let obj of collection) {
                if (predicate(obj)) {
                    array.push(obj)
                }
            }
        }

        else if (typeof predicate === "string") {
            for (let obj of collection) {
                if (obj[predicate]) {
                    array.push(obj)
                }
            }
        }

        else if (Array.isArray(predicate)) {
            for (let i = 0; i < predicate.length - 1; i++) {
                if (typeof predicate[i] === "string" && typeof predicate[i + 1] === "boolean") {
                    for (let obj of collection) {
                        if (predicate[i] in obj && obj[predicate[i]] === predicate[i + 1]) {
                            array.push(obj)
                        }
                    }
                }
            }
        }

        else if (typeof predicate === "object") {
            for (let obj of collection) {
                let flag = true
                for (let key in predicate) {
                    if (predicate.hasOwnProperty(key)) {
                        if (predicate[key] !== obj[key]) {
                            flag = false
                        }
                    }
                }
                if (flag) {
                    array.push(obj)
                }
            }
        }
        return array
    },

    find: function (collection, predicate) {
        const array = []
        if (predicate instanceof Function) {
            for (let obj of collection) {
                if (predicate(obj)) {
                    return obj
                }
            }
        }

        else if (typeof predicate === "string") {
            for (let obj of collection) {
                if (obj[predicate]) {
                    return obj
                }
            }
        }

        else if (Array.isArray(predicate)) {
            for (let i = 0; i < predicate.length - 1; i++) {
                if (typeof predicate[i] === "string" && typeof predicate[i + 1] === "boolean") {
                    for (let obj of collection) {
                        if (predicate[i] in obj && obj[predicate[i]] === predicate[i + 1]) {
                            return obj
                        }
                    }
                }
            }
        }

        else if (typeof predicate === "object") {
            for (let obj of collection) {
                let flag = true
                for (let key in predicate) {
                    if (predicate.hasOwnProperty(key)) {
                        if (predicate[key] !== obj[key]) {
                            flag = false
                        }
                    }
                }
                if (flag) {
                    return obj
                }
            }
        }
    },

    flatMap: function (collection, predicate) {
        let array = []
        if (predicate instanceof Function) {
            for (let item of collection) {
                array = array.concat(predicate(item))
            }
            return array
        }
    },

    groupBy: function (collection, predicate) {
        const res = {}
        for (let key in collection) {
            if (collection.hasOwnProperty(key)) {
                if (predicate instanceof Function) {
                    let resKey = predicate(collection[key])
                    if (resKey in res) {
                        res[resKey].push(collection[key])
                    }
                    else {
                        res[resKey] = [collection[key]]
                    }
                }
                else if (typeof predicate === "string") {
                    let reskey = collection[key][predicate]
                    if (reskey !== undefined) {
                        if (reskey in res) {
                            res[reskey].push(collection[key])
                        }
                        else {
                            res[reskey] = [collection[key]]
                        }
                    }
                    else {
                        res[reskey] = collection
                    }
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

    invokeMap: function (collection, predicate) {

    }
}

var users = [
    {'user': 'barney', 'age': 36, 'active': true},
    {'user': 'fred', 'age': 40, 'active': false}
];
// console.log(raysuner.countBy([6.1, 4.2, 6.3], Math.floor))
// console.log(raysuner.countBy(['one', 'two', 'three'], 'length'))
// console.log(raysuner.flatMap([1,2], function (n) {
//     return [n, n]
// }))
raysuner.forEachRight([1, 2], function(value) {
    console.log(value);
})
// console.log(raysuner.filter(users, function(o) { return !o.active; }))
// console.log(raysuner.filter(users, { 'age': 36, 'active': false }))
// console.log(raysuner.filter(users, ['active', false ]))
// console.log(raysuner.filter(users, 'active'))

// console.log(raysuner.find(users, function(o) { return !o.active; }))
// console.log(raysuner.find(users, { 'age': 36, 'active': true }))
// console.log(raysuner.find(users, ['active', false ]))
// console.log(raysuner.find(users, 'active'))
// console.log(raysuner.flatMapDeep([[1], [2]], function (n) {
//     return [[[n, n]]]
// }))
// console.log(raysuner.groupBy([6.1, 4.2, 6.3], Math.floor))
// console.log(raysuner.groupBy(['one', 'two', 'three'], 'length'))
