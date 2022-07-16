let profileCardElement = document.getElementById("profileCard")
let profileCardBanner = document.getElementById("profileCardBanner")
let profileCardProfilePicture = document.getElementById("profileCardProfilePicture")
let profileCardUsername = document.getElementById("profileCardUsername")
let profileCardBio = document.getElementById("profileCardBio")
let profileCardFollowButton = document.getElementById("profileCardFollowButton")
let profileCardFollowButtonIcon = document.getElementById("profileCardFollowButtonIcon")
let profileCardFollowButtonLabel = document.getElementById("profileCardFollowButtonLabel")
let profileCardFollowers = document.querySelector("#profileCardfollowersContainer > .followersNumber")
let profileCardFollowing = document.querySelector("#profileCardFollowingContainer > .followingNumber")
let profileCardEditButton = document.getElementById("profileCardEditButton")

let lastProfileCardReset = -Infinity
async function setProfileCard(x, y, userId, profilePicture, username, bio, followersList, followingList) {
    lastProfileCardReset = Date.now()
    
    // Setting profile card values
    if([profilePicture, username, bio, followersList, followingList].indexOf(undefined) == -1) {
        let bannerColor
        let profilePictureSrc
        let profileLink = mainDomain + "/view-profile/" + userId
        let followed = followersList.indexOf(selfData.id) != -1
        if(profilePicture != "default") {
            bannerColor = await getMainColorFromImageSrc(profilePicture)
            profilePictureSrc = profilePicture
            setProfileCardValues(userId, profilePictureSrc, bannerColor, username, bio, followersList, followingList, profileLink, followed)
        } else {
            bannerColor = "#e0e5ea"
            profilePictureSrc = "images/icons/defaultProfilePadding.svg"
            setProfileCardValues(userId, profilePictureSrc, bannerColor, username, bio, followersList, followingList, profileLink, followed)
        }
        socket.emit("subscribe", {
            type: "user-update",
            id: userId
        })
    } else {
        throw new Error("data undefined (for setProfileCard).")
    }

    // Animating the profile card
    profileCardElement.style.display = "none"
    setTimeout(() => {
        profileCardElement.style.left = x + "px"
        profileCardElement.style.top = y - 30 + "px"
        profileCardElement.style.display = "block"
        setTimeout(() => {
            profileCardElement.style.left = x + "px"
            profileCardElement.style.top = y + "px"
        }, 10)
    }, 10)
}

function stringToBoolean(string) {
    return string == "true"
}

let profileRedirectLink = mainDomain + "/home"
profileCardProfilePicture.addEventListener("click", (event) => {
    window.open(profileRedirectLink)
})
let profileCardFollow = true
let profileCardCurrentUserId
profileCardFollowButton.addEventListener("click", async (event) => {
    if(loggedIn) {
        if(profileCardFollow) {
            let success = await ajax("POST", "/api/follow/" + profileCardCurrentUserId)
            console.log(success)
            setProfileCardIsFollowed(stringToBoolean(success))
        } else {
            let success = await ajax("POST", "/api/unfollow/" + profileCardCurrentUserId)
            console.log(success)
            setProfileCardIsFollowed(!stringToBoolean(success))
        }
    } else {
        setPopup(
            `<span class="special">Login</span> to follow this user.`,
            `On SOCAL, you need to be logged into an account to be able to follow other people. Why aren't you!?`,
            `<a href="/login">Login</a>`,
            `<button style="background-color: black;" onclick="hidePopup()">Later</button>`
        )
    }
})
profileCardEditButton.addEventListener("click", (event) => {
    window.location = mainDomain + "/edit-profile"
})

// also changes colors for buttons and removes in some particular cases
function setProfileCardValues(userId, profilePicture, bannerColor, username, bio, followersList, followingList, profileLink, isFollowed) {
    profileCardProfilePicture.src = profilePicture
    profileCardBanner.style.backgroundColor = bannerColor
    profileCardUsername.innerHTML = username
    profileCardBio.innerHTML = bio
    profileCardFollowers.innerHTML = followersList.length
    profileCardFollowing.innerHTML = followingList.length
    if(userId != selfData.id) {
        profileCardEditButton.style.display = "none"
        profileCardFollowButton.style.display = "flex"
        if(isFollowed != undefined) {
            if(isFollowed) {
                profileCardFollowButton.style.backgroundColor = "#FF5775"
                profileCardFollowButtonIcon.src = "images/icons/checkmark.svg"
                profileCardFollowButtonLabel.innerHTML = "Unfollow"
            } else {
                profileCardFollowButton.style.backgroundColor = "var(--theme-color)"
                profileCardFollowButtonIcon.src = "images/icons/plusFollow.svg"
                profileCardFollowButtonLabel.innerHTML = "Follow"
            }
            profileCardFollow = !isFollowed
        }
    } else {
        profileCardEditButton.style.display = "flex"
        profileCardFollowButton.style.display = "none"
    }
        

    profileRedirectLink = profileLink
    profileCardCurrentUserId = userId
}

function hideProfileCard() {
    profileCardElement.style.display = "none"

    socket.emit("unsubscribe", {
        type: "user-update",
        id: profileCardCurrentUserId
    })
}

socket.on("user-update", (data) => {
    if(data.id == profileCardCurrentUserId) {
        setProfileCardFollowers(data.value.followers)
        setProfileCardFollowing(data.value.following)
    }
})

function setProfileCardFollowers(followersList) {
    profileCardFollowers.innerHTML = followersList.length
}

function setProfileCardFollowing(followingList) {
    profileCardFollowing.innerHTML = followingList.length
}

function setProfileCardIsFollowed(isFollowed) {
    if(isFollowed) {
        profileCardFollowButton.style.backgroundColor = "#FF5775"
        profileCardFollowButtonIcon.src = "images/icons/checkmark.svg"
        profileCardFollowButtonLabel.innerHTML = "Unfollow"
    } else {
        profileCardFollowButton.style.backgroundColor = "var(--theme-color)"
        profileCardFollowButtonIcon.src = "images/icons/plusFollow.svg"
        profileCardFollowButtonLabel.innerHTML = "Follow"
    }
    profileCardFollow = !isFollowed
}

function profileCardIsShown() {
    return profileCardElement.style.display == "block"
}

window.addEventListener("click", (event) => {
    if(Math.abs(lastProfileCardReset - Date.now()) > 100 && !profileCardElement.matches(":hover")) {
        if(profileCardIsShown()) {
            hideProfileCard()
        }
    }
})