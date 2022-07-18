let followersFollowingContainer = document.getElementById("followersFollowingContainer")
let followersFollowingTopBackButton = document.getElementById("followersFollowingTopBackButton")
let followersSwitch = document.getElementById("followersSwitch")
let followingSwitch = document.getElementById("followingSwitch")
let followersContainer = document.getElementById("followersContainer")
let followingContainer = document.getElementById("followingContainer")
let followersFollowingTopUsernameLabel = document.getElementById("followersFollowingTopUsernameLabel")
let userDoesntHaveFollowers = document.getElementById("userDoesntHaveFollowers")
let userDoesntHaveFollowing = document.getElementById("userDoesntHaveFollowing")

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

        if(currentFollowersList.length == 0) {
            userDoesntHaveFollowers.style.display = "block"
        }
        userDoesntHaveFollowing.style.display = "none"
    } else {
        followersSwitch.style.color = "#d1d1d1"
        followingSwitch.style.color = "var(--theme-color)"
        followersContainer.style.display = "none"
        followingContainer.style.display = "block"

        await renderFollowingList(followingList)

        if(currentFollowingList.length == 0) {
            userDoesntHaveFollowing.style.display = "block"
        }
        userDoesntHaveFollowers.style.display = "none"
    }
    followersFollowingTopUsernameLabel.textContent = username
}

async function renderFollowersList(followersList) {
    if(followersList.length > 0) {
        userDoesntHaveFollowers.style.display = "none"

        await cacheBasicUserDataFromArray(followersList)

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
    
    followersListRendered = true
}

async function renderFollowingList(followingList) {
    if(followingList.length > 0) {
        userDoesntHaveFollowing.style.display = "none"
        await cacheBasicUserDataFromArray(followingList)
        
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
        

    followingListRendered = true
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
    if(currentFollowersList.length == 0) {
        userDoesntHaveFollowers.style.display = "block"
    }
    userDoesntHaveFollowing.style.display = "none"
})

followingSwitch.addEventListener("click", (event) => {
    followersSwitch.style.color = "#d1d1d1"
    followingSwitch.style.color = "var(--theme-color)"
    followersContainer.style.display = "none"
    followingContainer.style.display = "block"
    if(!followingListRendered) {
        renderFollowingList(currentFollowingList)
    }
    if(currentFollowingList.length == 0) {
        userDoesntHaveFollowing.style.display = "block"
    }
    userDoesntHaveFollowers.style.display = "none"
})