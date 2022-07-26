let profileCardElement = document.getElementById("profileCard")
let profileCardBanner = document.getElementById("profileCardBanner")
let profileCardProfilePicture = document.getElementById("profileCardProfilePicture")
let profileCardUsername = document.getElementById("profileCardUsername")
let profileCardBio = document.getElementById("profileCardBio")
let profileCardFollowButton = document.getElementById("profileCardFollowButton")
let profileCardFollowButtonIcon = document.getElementById("profileCardFollowButtonIcon")
let profileCardFollowButtonLabel = document.getElementById("profileCardFollowButtonLabel")
let profileCardFollowers = document.querySelector("#profileCardFollowersContainer > .followersNumber")
let profileCardFollowing = document.querySelector("#profileCardFollowingContainer > .followingNumber")
let profileCardFollowersContainer = document.getElementById("profileCardFollowersContainer")
let profileCardFollowingContainer = document.getElementById("profileCardFollowingContainer")
let profileCardEditButton = document.getElementById("profileCardEditButton")

let lastProfileCardReset = -Infinity


async function setProfileCard(x, y, userId, profilePicture, bannerImage, username, bio, followersList, followingList, onFollowersFollowingShown, onFollowersFollowingHidden) {
    currentOnFollowersFollowingShown = onFollowersFollowingShown
    currentOnFollowersFollowingHidden = onFollowersFollowingHidden
    
    lastProfileCardReset = Date.now()
    profileCardCurrentUsername = username
    profileCardCurrentFollowersList = followersList
    profileCardCurrentFollowingList = followingList

    // Setting profile card values
    if([profilePicture, username, bio, followersList, followingList].indexOf(undefined) == -1) {
        let profileLink = mainDomain + "/view-profile/" + userId
        let followed = loggedIn ? followersList.indexOf(selfData.id) != -1 : false
        let profilePictureParsed = await parseProfileImage(profilePicture, true)
        bannerImage = await parseBannerImage(bannerImage, false)
        let bannerColor = "#E1E5EA"
        if(bannerImage == "" && profilePicture != "default") {
            bannerColor = await getMainColorFromImageSrc(profilePictureParsed)
        }
        setProfileCardValues(userId, profilePictureParsed, bannerImage, username, bio, followersList, followingList, profileLink, followed, bannerColor)
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
            setProfileCardIsFollowed(stringToBoolean(success))
        } else {
            let success = await ajax("POST", "/api/unfollow/" + profileCardCurrentUserId)
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
    window.location = mainDomain + "/settings"
})
let currentOnFollowersFollowingShown = () => {}
let currentOnFollowersFollowingHidden = () => {}

// also changes colors for buttons and removes in some particular cases
function setProfileCardValues(userId, profilePicture, bannerImage, username, bio, followersList, followingList, profileLink, isFollowed, bannerColor) {
    profileCardProfilePicture.src = profilePicture
    profileCardBanner.style.backgroundColor = bannerColor
    profileCardBanner.style.backgroundImage = `url(${bannerImage})`
    profileCardUsername.innerHTML = username
    profileCardBio.innerHTML = bio
    profileCardFollowers.innerHTML = followersList.length
    profileCardFollowing.innerHTML = followingList.length

    if(loggedIn && userId != selfData.id) {
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

let profileCardCurrentUsername = ""
let profileCardCurrentFollowersList = []
let profileCardCurrentFollowingList = []
profileCardFollowersContainer.addEventListener("click", (event) => {
    hideProfileCard()
    currentOnFollowersFollowingShown()
    setFollowersFollowing(true, profileCardCurrentUsername, profileCardCurrentFollowersList, profileCardCurrentFollowingList, function() {
        currentOnFollowersFollowingHidden()
    })
})
profileCardFollowingContainer.addEventListener("click", (event) => {
    hideProfileCard()
    currentOnFollowersFollowingShown()
    setFollowersFollowing(false, profileCardCurrentUsername, profileCardCurrentFollowersList, profileCardCurrentFollowingList, function() {
        currentOnFollowersFollowingHidden()
    })
})