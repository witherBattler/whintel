let followersLabel = document.getElementById("followersLabel")
let followingLabel = document.getElementById("followingLabel")
let followersLabelNumber = document.getElementById("followersLabelNumber")
let followingLabelNumber = document.getElementById("followingLabelNumber")
let editProfileContainer = document.getElementById("editProfileContainer")
let followersFollowingContainer = document.getElementById("followersFollowingContainer")
let followersFollowingTopBackButton = document.getElementById("followersFollowingTopBackButton")
let followersFollowingSwitch = document.getElementById("followersFollowingSwitch")
let followersSwitch = document.getElementById("followersSwitch")
let followingSwitch = document.getElementById("followingSwitch")
let followersContainer = document.getElementById("followersContainer")
let followingContainer = document.getElementById("followingContainer")

followersSwitch.style.color = "var(--theme-color)"
followersSwitch.addEventListener("click", (event) => {
    followersContainer.style.display = "flex"
    followingContainer.style.display = "none"
    followersSwitch.style.color = "var(--theme-color)"
    followingSwitch.style.color = "#d1d1d1"
})
followingSwitch.addEventListener("click", (event) => {
    followingContainer.style.display = "flex"
    followersContainer.style.display = "none"
    followingSwitch.style.color = "var(--theme-color)"
    followersSwitch.style.color = "#d1d1d1"
})

followersLabel.addEventListener("click", async (event) => {
    followersFollowingContainer.style.display = "flex"
    if(userData.id != selfData.id) {
        changeUrlWithoutReload(`${mainDomain}/view-profile/${userData.id}/followers`)
    } else {
        changeUrlWithoutReload(`${mainDomain}/view-profile/self/followers`)
    }

    editProfileContainer.style.display = "none"
    let followers = await ajax("GET", `${mainDomain}/api/get-followers-basic-data/self`, {
        count: 20,
        skip: 0
    })
    followers = JSON.parse(followers)
    for(let i = 0; i != followers.length; i++) {
        let element = document.createElement("followers-list-element")
        element.setAttribute("username", followers[i].username)
        element.setAttribute("profile-picture", followers[i].profilePicture)
        element.setAttribute("bio", followers[i].bio)
        element.setAttribute("id", followers[i].id)
        followersContainer.appendChild(element)
    }
})
followingLabel.addEventListener("click", (event) => {
    followersFollowingContainer.style.display = "flex"
    changeUrlWithoutReload(`${mainDomain}/profile/${userData.id}/following`)
})
followersFollowingTopBackButton.addEventListener("click", (event) => {
    followersFollowingContainer.style.display = "none"
    editProfileContainer.style.display = "flex"
})
