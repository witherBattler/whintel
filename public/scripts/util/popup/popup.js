let popupOverlay = document.getElementById("popupOverlay")
let popupTitle = document.getElementById("popupTitle")
let popupText = document.getElementById("popupParagraph")
let popupButtons = document.getElementById("popupButtonsContainer")

function setPopup(title, text, ...buttons) {
    if(currentTimeoutDisplayNone != null) {
        clearTimeout(currentTimeoutDisplayNone)
    }
    
    popupOverlay.style.pointerEvents = "auto"
    popupTitle.innerHTML = title
    popupText.innerHTML = text
    popupButtons.innerHTML = buttons.join("")

    popupOverlay.style.display = "block"
    setTimeout(function() {
        popupOverlay.style.opacity = "100%"
    })
}

let currentTimeoutDisplayNone = null
function hidePopup() {
    popupOverlay.style.opacity = "0%"
    popupOverlay.style.pointerEvents = "none"
    currentTimeoutDisplayNone = setTimeout(function() {
        popupOverlay.style.display = "none"
    }, 1000)
}