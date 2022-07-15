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
followersSwitch.addEventListener("click", async (event) => {
    followersContainer.style.display = "flex"
    followingContainer.style.display = "none"
    followersSwitch.style.color = "var(--theme-color)"
    followingSwitch.style.color = "#d1d1d1"

    if(!followersAlreadyLoaded) {
        let followers = await ajax("GET", `${mainDomain}/api/get-followers-basic-data/` + userData.id, {
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
        followersAlreadyLoaded = true
    }
})
followingSwitch.addEventListener("click", async (event) => {
    followingContainer.style.display = "flex"
    followersContainer.style.display = "none"
    followingSwitch.style.color = "var(--theme-color)"
    followersSwitch.style.color = "#d1d1d1"

    if(!followersAlreadyLoaded) {
        let following = await ajax("GET", "/api/get-following-basic-data/" + userData.id, {
            count: 20,
            skip: 0
        })
        following = JSON.parse(following)
        for(let i = 0; i != following.length; i++) {
            let element = document.createElement("followers-list-element")
            element.setAttribute("username", following[i].username)
            element.setAttribute("profile-picture", following[i].profilePicture)
            element.setAttribute("bio", following[i].bio)
            element.setAttribute("id", following[i].id)
            followingContainer.appendChild(element)
        }
        followingAlreadyLoaded = true
    }
})

let followersAlreadyLoaded = false
followersLabel.addEventListener("click", async (event) => {
    followersFollowingContainer.style.display = "flex"
    editProfileContainer.style.display = "none"
    if(userData.id != selfData.id) {
        changeUrlWithoutReload(`${mainDomain}/view-profile/${userData.id}/followers`)
    } else {
        changeUrlWithoutReload(`${mainDomain}/view-profile/self/followers`)
    }

    
    if(!followersAlreadyLoaded) {
        let followers = await ajax("GET", `${mainDomain}/api/get-followers-basic-data/` + userData.id, {
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
        followersAlreadyLoaded = true
    }
})
let followingAlreadyLoaded = false
followingLabel.addEventListener("click", async (event) => {
    followersFollowingContainer.style.display = "flex"
    editProfileContainer.style.display = "none"
    if(userData.id != selfData.id) {
        changeUrlWithoutReload(`${mainDomain}/profile/${userData.id}/following`)
    } else {
        changeUrlWithoutReload(`${mainDomain}/profile/self/following`)
    }

    if(!followersAlreadyLoaded) {
        let following = await ajax("GET", "/api/get-following-basic-data/" + userData.id, {
            count: 20,
            skip: 0
        })
        following = JSON.parse(following)
        for(let i = 0; i != following.length; i++) {
            let element = document.createElement("followers-list-element")
            element.setAttribute("username", following[i].username)
            element.setAttribute("profile-picture", following[i].profilePicture)
            element.setAttribute("bio", following[i].bio)
            element.setAttribute("id", following[i].id)
            followingContainer.appendChild(element)
        }
        followingAlreadyLoaded = true
    }
})
followersFollowingTopBackButton.addEventListener("click", (event) => {
    followersFollowingContainer.style.display = "none"
    editProfileContainer.style.display = "flex"
})
