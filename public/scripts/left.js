let homeButtonLeft = document.getElementById("homeButtonLeft")
let postButtonLeft = document.getElementById("postButtonLeft")
let messagesButtonLeft = document.getElementById("messagesButtonLeft")
let profileButtonLeft = document.getElementById("profileButtonLeft")
let settingsButtonLeft = document.getElementById("settingsButtonLeft")
let logOutButtonLeft = document.getElementById("logOutButtonLeft")
let leftBurgerMenu = document.getElementById("leftBurgerMenu")
let left = document.getElementById("left")
let profileWidgetUsername = document.getElementById("profileWidgetUsername")

if(loggedIn) {
    logOutButtonLeft.addEventListener("click", async (event) => {
        let success = await ajax("POST", mainDomain + "/api/log-out")
        if(success) {
            window.location = `${mainDomain}/login`
        }
    })
}
let leftCurrentlyOpened = false
leftBurgerMenu.addEventListener("click", (event) => {
    leftCurrentlyOpened = !leftCurrentlyOpened
    switch(leftCurrentlyOpened) {
        case true:
            leftBurgerMenu.src = "images/icons/burgerMenu-opened.svg"
            left.style.left = "0px"
            break;
        case false:
            leftBurgerMenu.src = "images/icons/burgerMenu-closed.svg"
            left.style.left = "-300px"
            break;
    }
})

function updateLeft() {
    if(loggedIn) {
        profileWidgetUsername.textContent = selfData.username
    }
}