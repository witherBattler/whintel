let followersFollowingContainer = document.getElementById("followersFollowingContainer")
let followersFollowingTopBackButton = document.getElementById("followersFollowingTopBackButton")
let followersSwitch = document.getElementById("followersSwitch")
let followingSwitch = document.getElementById("followingSwitch")
let followersContainer = document.getElementById("followersContainer")
let followingContainer = document.getElementById("followingContainer")
let followersFollowingTopUsernameLabel = document.getElementById("followersFollowingTopUsernameLabel")

let currentFollowersList = null
let currentFollowingList = null
let followersListCached = false
let followingListCached = false
let currentOnClose = function() {}

async function setFollowersFollowing(isFollowers, username, followersList, followingList, onClose) {
    followersFollowingContainer.style.display = "block"
    followersContainer.innerHTML = ""
    followingContainer.innerHTML = ""
    currentOnClose = onClose

    currentFollowersList = followersList
    currentFollowingList = followingList
    followersListCached = false
    followingListCached = false

    if(isFollowers) {
        followersSwitch.style.color = "var(--theme-color)"
        followingSwitch.style.color = "#d1d1d1"
        followersContainer.style.display = "block"
        followingContainer.style.display = "none"
        
        await cacheBasicUserDataFromArray(followersList)
        followersListCached = true

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
    } else {
        followersSwitch.style.color = "#d1d1d1"
        followingSwitch.style.color = "var(--theme-color)"
        followersContainer.style.display = "none"
        followingContainer.style.display = "block"

        await cacheBasicUserDataFromArray(followingList)
        followingListCached = true

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
    followersFollowingTopUsernameLabel.textContent = username
}

followersFollowingTopBackButton.addEventListener("click", (event) => {
    followersFollowingContainer.style.display = "none"
    currentOnClose()
})