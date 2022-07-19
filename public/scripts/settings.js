let settingsContainer = document.getElementById("settingsContainer")
let profileSettings = document.getElementById("profileSettings")
let accountSettings = document.getElementById("accountSettings")
let displaySettings = document.getElementById("displaySettings")
let extraSettings = document.getElementById("extraSettings")
let settingsSectionButtons = Array.from(document.getElementsByClassName("settingsCategoryButton"))
let usernameInput = document.getElementById("usernameInput")

function openSettings() {
    settingsContainer.style.display = "flex"
}

let previousSelectedButton = settingsSectionButtons[0]
let previousSelectedSection = profileSettings
for(let i = 0; i != settingsSectionButtons.length; i++) {
    let button = settingsSectionButtons[i]
    let section = settingsSectionButtons[i].dataset.settingsSection
    console.log(section)
    button.addEventListener("click", (event) => {
        unselectPreviousSection()

        switch(section) {
            case "profile":
                selectSection(button, profileSettings)
                break;
            case "account":
                selectSection(button, accountSettings)
                break;
            case "display":
                selectSection(button, displaySettings)
                break;
            case "extra":
                selectSection(button, extraSettings)
                break;
        }
    })
}

function selectSection(button, section) {
    button.classList.add("selected")
    section.style.display = "block"
    previousSelectedButton = button
    previousSelectedSection = section
}

function unselectPreviousSection() {
    if(previousSelectedButton != null) {
        previousSelectedButton.classList.remove("selected")
    }
    if(previousSelectedSection != null) {
        previousSelectedSection.style.display = "none"
    }
}


onSelfDataLoad(function() {
    profileCardAPI.setBio(selfData.bio)
    profileCardAPI.setUsername(selfData.username)
    profileCardAPI.setProfilePicture(selfData.profilePicture)
    usernameInput.placeholder = selfData.username
})