let homeButtonLeft = document.getElementById("homeButtonLeft")
let postButtonLeft = document.getElementById("postButtonLeft")
let messagesButtonLeft = document.getElementById("messagesButtonLeft")
let profileButtonLeft = document.getElementById("profileButtonLeft")
let settingsButtonLeft = document.getElementById("settingsButtonLeft")
let logOutButtonLeft = document.getElementById("logOutButtonLeft")

homeButtonLeft.addEventListener("click", (event) => {
    window.location = `${mainDomain}/home`
})
postButtonLeft.addEventListener("click", (event) => {
    window.location = `${mainDomain}/create-post`
})
messagesButtonLeft.addEventListener("click", (event) => {
    window.location = `${mainDomain}/messages`
})
profileButtonLeft.addEventListener("click", (event) => {
    window.location = `${mainDomain}/edit-profile`
})
settingsButtonLeft.addEventListener("click", (event) => {
    window.location = `${mainDomain}/settings`
})
logOutButtonLeft.addEventListener("click", async (event) => {
    console.log("posdf")
    let success = await ajax("POST", mainDomain + "/api/log-out")
    console.log(success)
    if(success) {
        window.location = `${mainDomain}/login`
    }
})