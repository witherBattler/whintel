const mainDomain = "https://whintel.herokuapp.com" // "http://" + window.location.hostname


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
                console.log("problem")
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