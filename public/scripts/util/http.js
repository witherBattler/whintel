let cachedFullUserData = {}

// Implements caching for user data
async function getFullUserData(id) {
    if(cachedFullUserData[id]) {
        return cachedFullUserData[id]
    }
    let data = await ajax("GET", mainDomain + "/api/user/" + id)
    cachedFullUserData[id] = JSON.parse(data)
    return cachedFullUserData[id]
}

function cacheReadyFullUserDataFromArray(array) {
    for(let i = 0; i != array.length; i++) {
        cachedFullUserData[array[i].id] = array[i]
    }
}
function getCachedFullUserData(id) {
    return cachedFullUserData[id]
}

async function post(url, data) {
    let request = new XMLHttpRequest();
    request.open("POST", url);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(data));
    let promise = new Promise((resolve, reject) => {
        request.onload = () => {
            if (request.status == 200) {
                resolve(request.response);
            } else {
                reject(Error(request.statusText));
            }
        }
    })
    return promise
}
async function ajax(method, url, data = {}) {
    let request = new XMLHttpRequest();
    request.open(method, url);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(data));
    let promise = new Promise((resolve, reject) => {
        request.onload = () => {
            if (request.status == 200) {
                resolve(request.response);
            } else {
                reject(Error(request.statusText));
            }
        }
    })
    return promise
}
async function getSelfData() {
    let data = await ajax("GET", mainDomain + "/api/get-self-data")
    return JSON.parse(data)
}
let selfData
(async () => {
    selfData = await getSelfData()
})()

let cachedProfileImages = {}
async function parseProfileImage(image) {
    return new Promise(async (resolve, reject) => {
        if(image == "default") {
            resolve("/images/icons/defaultProfile.svg")
        } else {
            if(cachedProfileImages[image]) {
                resolve(cachedProfileImages[image])
                return
            }
            let realSrc = await ajax("GET", mainDomain + "/api/assets/images/" + image)
            cachedProfileImages[image] = realSrc
            resolve(realSrc)
        }
    })
}

let cachedBasicUserData = {}
async function cacheBasicUserDataFromArray(usersArray) {
    if(usersArray.length == 0) {
        return
    }
    for(let i = usersArray.length; i != 0; i++) {
        let id = usersArray[i]
        if(cachedBasicUserData[id] == undefined) {
            usersArray.splice(i, 1)
            break
        }
        if(cachedFullUserData.indexOf(id) != -1) {
            cachedBasicUserData[id] = cachedFullUserData[id]
            usersArray.splice(i, 1)
            break
        }
    }
    usersArray = [...new Set(usersArray)]

    let result = await ajax("GET", "/api/basic-user-data-array/" + usersArray.join(","))
    result = JSON.parse(result)
    console.log(result)
    for(let i = 0; i != result.length; i++) {
        cachedBasicUserData[result[i].id] = result[i]
    }
}

function getCachedBasicUserData(id) {
    return cachedBasicUserData[id]
}