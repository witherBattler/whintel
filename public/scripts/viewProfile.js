let followersLabel = document.getElementById("followersLabel")
let followingLabel = document.getElementById("followingLabel")
let followersLabelNumber = document.getElementById("followersLabelNumber")
let followingLabelNumber = document.getElementById("followingLabelNumber")
let editProfileContainer = document.getElementById("editProfileContainer")
let followersFollowingContainer = document.getElementById("followersFollowingContainer")
let followersFollowingTopBackButton = document.getElementById("followersFollowingTopBackButton")
let followersFollowingTabSwitch = document.getElementById("followersFollowingTabSwitch")
let followersContainer = document.getElementById("followersContainer")
let followingContainer = document.getElementById("followingContainer")



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



followersFollowingTabSwitch.appendEvent("tabSwitch", (tab) => {
    if(tab == "followers") {
        followersContainer.style.display = "flex"
        followingContainer.style.display = "none"
    } else {
        followingContainer.style.display = "flex"
        followersContainer.style.display = "none"
    }
})