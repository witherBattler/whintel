let profileCardUsername = document.getElementById("profileCardUsername")
let profileCardBio = document.getElementById("profileCardBio")
let profileCardProfilePicture = document.getElementById("profileCardProfilePicture")
let profileCardFollowers = document.querySelector("#profileCardFollowersContainer > .followersNumber")
let profileCardFollowing = document.querySelector("#profileCardFollowingContainer > .followingNumber")


let profileCardAPI = {
    setUsername: function(username) {
        profileCardUsername.textContent = username
    },
    setBio: function(bio) {
        profileCardBio.textContent = bio
    },
    setProfilePicture: function(profilePicture, parse = true) {
        if(parse) {
            if(profilePicture != "default") {
                parseProfileImage(profilePicture).then((profilePictureSrc) => {
                    profileCardProfilePicture.src = profilePictureSrc
                })
            } else {
                profileCardProfilePicture.src = "images/icons/defaultProfilePadding.svg"
            }
                
        } else {
            profileCardProfilePicture.src = profilePicture
        }
            
    },
    setFollowers: function(followersList) {
        profileCardFollowers.textContent = followersList.length
    },
    setFollowing: function(followingList) {
        profileCardFollowing.textContent = followingList.length
    },
}