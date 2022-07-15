let homeButtonLeft = document.getElementById("homeButtonLeft")
let postButtonLeft = document.getElementById("postButtonLeft")
let messagesButtonLeft = document.getElementById("messagesButtonLeft")
let profileButtonLeft = document.getElementById("profileButtonLeft")
let settingsButtonLeft = document.getElementById("settingsButtonLeft")
let logOutButtonLeft = document.getElementById("logOutButtonLeft")

if(loggedIn) {
    logOutButtonLeft.addEventListener("click", async (event) => {
        let success = await ajax("POST", mainDomain + "/api/log-out")
        if(success) {
            window.location = `${mainDomain}/login`
        }
    })
}