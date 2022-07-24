let settingsContainer = document.getElementById("settingsContainer")
let profileSettings = document.getElementById("profileSettings")
let accountSettings = document.getElementById("accountSettings")
let displaySettings = document.getElementById("displaySettings")
let extraSettings = document.getElementById("extraSettings")
let settingsSectionButtons = Array.from(document.getElementsByClassName("settingsCategoryButton"))
let usernameInput = document.getElementById("usernameInput")
let bioInput = document.getElementById("bioInput")
let profileBanner = document.getElementById("profileBannerSettings")
let profileImage = document.getElementById("profileImage")
let profileBannerInput = document.getElementById("profileBannerInput")
let profileImageInput = document.getElementById("profileImageInput")
let saveButtonProfile = document.getElementById("saveButtonProfile") 

function openSettings() {
    settingsContainer.style.display = "flex"
}

let previousSelectedButton = settingsSectionButtons[0]
let previousSelectedSection = profileSettings
for(let i = 0; i != settingsSectionButtons.length; i++) {
    let button = settingsSectionButtons[i]
    let section = settingsSectionButtons[i].dataset.settingsSection
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

onSelfDataLoad(() => {
    usernameInput.value = selfData.username
    bioInput.value = selfData.bio
    parseProfileImage(selfData.profilePicture, true).then(function(pictureUrl) {
        profileImage.style.backgroundImage = `url(${pictureUrl})`
    })
})


let settingsProfileChanges = {
    username: null,
    bio: null,
    profilePicture: null,
    profileBanner: null
}
profileImageInput.addEventListener("input", (event) => {
    let image = event.target.files[0]
    if(image != null) {
        let reader = new FileReader()
        reader.onload = function(event) {
            let result = event.target.result
            profileImage.style.backgroundImage = `url(${result})`
            settingsProfileChanges.profilePicture = result
        }
        reader.readAsDataURL(image)
    } else {
        profileImage.style.backgroundImage = "none"
        settingsProfileChanges.profilePicture = null
    }
})
profileBannerInput.addEventListener("input", (event) => {
    let image = event.target.files[0]
    if(image != null) {
        let reader = new FileReader()
        reader.onload = function(event) {
            let result = event.target.result
            profileBanner.style.backgroundImage = `url(${result})`
            settingsProfileChanges.profileBanner = result
        }
        reader.readAsDataURL(image)
    } else {
        profileBanner.style.backgroundImage = "none"
        settingsProfileChanges.profileBanner = null
    }
})
usernameInput.onInput((value) => {
    settingsProfileChanges.username = value
    console.log(settingsProfileChanges.username)
})
bioInput.onInput((value) => {
    settingsProfileChanges.bio = value
})

saveButtonProfile.addEventListener("click", async (event) => {
    let usernameChanged = settingsProfileChanges.username != null && settingsProfileChanges.username != selfData.username
    let bioChanged = settingsProfileChanges.bio != null && settingsProfileChanges.bio != selfData.bio
    let profilePictureChanged = settingsProfileChanges.profilePicture != null
    let profileBannerChanged = settingsProfileChanges.profileBanner != null
    let changes = {}
    if(usernameChanged) {
        changes.username = settingsProfileChanges.username
    }
    if(bioChanged) {
        changes.bio = settingsProfileChanges.bio
    }
    if(profilePictureChanged) {
        changes.profilePicture = settingsProfileChanges.profilePicture
    }
    if(profileBannerChanged) {
        changes.profileBanner = settingsProfileChanges.profileBanner
    }
    if(Object.keys(changes).length > 0) {
        showSnackbar("Saving...")
        await updateSelfData(changes)
        showSnackbar("Changes successfully saved!")
    } else {
        showSnackbar("No changes made.")
    }
})