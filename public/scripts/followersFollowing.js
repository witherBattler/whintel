let followersFollowingContainer = document.getElementById("followersFollowingContainer")
let followersFollowingTopBackButton = document.getElementById("followersFollowingTopBackButton")
let followersSwitch = document.getElementById("followersSwitch")
let followingSwitch = document.getElementById("followingSwitch")
let followersContainer = document.getElementById("followersContainer")
let followingContainer = document.getElementById("followingContainer")
let followersFollowingTopUsernameLabel = document.getElementById("followersFollowingTopUsernameLabel")

let currentFollowersList = null
let currentFollowingList = null
let followersListRendered = false
let followingListRendered = false
let currentOnClose = function() {}

async function setFollowersFollowing(isFollowers, username, followersList, followingList, onClose) {
    followersFollowingContainer.style.display = "block"
    followersContainer.innerHTML = ""
    followingContainer.innerHTML = ""
    currentOnClose = onClose

    currentFollowersList = followersList
    currentFollowingList = followingList
    followersListRendered = false
    followingListRendered = false

    if(isFollowers) {
        followersSwitch.style.color = "var(--theme-color)"
        followingSwitch.style.color = "#d1d1d1"
        followersContainer.style.display = "block"
        followingContainer.style.display = "none"
        
        await renderFollowersList(followersList)
    } else {
        followersSwitch.style.color = "#d1d1d1"
        followingSwitch.style.color = "var(--theme-color)"
        followersContainer.style.display = "none"
        followingContainer.style.display = "block"

        await renderFollowingList(followingList)
    }
    followersFollowingTopUsernameLabel.textContent = username
}

async function renderFollowersList(followersList) {
    await cacheBasicUserDataFromArray(followersList)
    followersListRendered = true

    // updating dom
    for(let i = 0; i != followersList.length; i++) {
        let userData = getCachedBasicUserData(followersList[i])
        let element = document.createElement("followers-list-element")
        element.setAttribute("username", userData.username)
        element.setAttribute("profile-picture", userData.profilePicture)
        element.setAttribute("bio", userData.bio)
        element.setAttribute("id", userData.id)
        followersContainer.appendChild(element)
    }
}

async function renderFollowingList(followingList) {
    await cacheBasicUserDataFromArray(followingList)
    followingListRendered = true

    // updating dom
    for(let i = 0; i != followingList.length; i++) {
        let userData = getCachedBasicUserData(followingList[i])
        let element = document.createElement("followers-list-element")
        element.setAttribute("username", userData.username)
        element.setAttribute("profile-picture", userData.profilePicture)
        element.setAttribute("bio", userData.bio)
        element.setAttribute("id", userData.id)
        followingContainer.appendChild(element)
    }
}

followersFollowingTopBackButton.addEventListener("click", (event) => {
    followersFollowingContainer.style.display = "none"
    currentOnClose()
})

followersSwitch.addEventListener("click", (event) => {
    followersSwitch.style.color = "var(--theme-color)"
    followingSwitch.style.color = "#d1d1d1"
    followersContainer.style.display = "block"
    followingContainer.style.display = "none"
    if(!followersListRendered) {
        renderFollowersList(currentFollowersList)
    }
})

followingSwitch.addEventListener("click", (event) => {
    followersSwitch.style.color = "#d1d1d1"
    followingSwitch.style.color = "var(--theme-color)"
    followersContainer.style.display = "none"
    followingContainer.style.display = "block"
    if(!followingListRendered) {
        renderFollowingList(currentFollowingList)
    }
})