require("dotenv").config()
require('source-map-support').install();
const tinify = require("tinify")
tinify.key = process.env.TINIFY_KEY
const { MongoClient, ServerApiVersion } = require('mongodb')
const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const express = require("express")
const app = express()
const fs = require("fs")
const cookieParser = require("cookie-parser")
const socketIo = require("socket.io");
const bcrypt = require("bcrypt")
const xss = require("xss");

const currentDomain = "http://localhost:3000"
const hashRounds = 10
app.use(cookieParser())
app.use(express.static('public'))
app.use(express.json({ limit: '50mb' }))
app.set('view engine', 'ejs')
app.set('trust proxy', true)
const server = app.listen(process.env.PORT || 3000, () => {
    console.log("Listening on http://localhost:3000")
})
const io = socketIo(server)
let feedSubscriptions = []
io.on("connection", (socket) => {
    socket.on("subscribe", (data) => {
        switch(data.type) {
            case "feed-update":
                feedSubscriptions.push(socket)
                break
            case "post-update":
                socket.join(data.id)
                break
            case "user-update":
                console.log("update:" + data.id)
                break;
        }
    })
    socket.on("disconnect", () => {
        let feedSubscriptionIndex = feedSubscriptions.indexOf(socket)
        if(feedSubscriptionIndex != -1) {
            feedSubscriptions.splice(feedSubscriptionIndex, 1)
        }
    })
    socket.on("unsubscribe", (data) => {
        switch(data.type) {
            case "feed-update":
                feedSubscriptions.splice(feedSubscriptions.indexOf(socket), 1)
                break
            case "post-update":
                socket.leave(data.id)
                break
            case "user-update":
                socket.leave("update:" + data.id)
                break
        }
    })
})


let sessions = {}
let users = client.db("users").collection("users")
let posts = client.db("posts").collection("posts")
let imageAssets = client.db("assets").collection("images")
let xssShame = client.db("shame").collection("xss")

app.get("/settings", async (req, res) => {
    getStartingAppData(req, res, function(username, level, profilePicture, fullUser) {
        res.render("settings", {
            username,
            level,
            profilePicture,
            loggedIn: true,
            settings: fullUser.settings
        })
    }, function() {
        res.render("404")
    })
})
app.get("/xss", async (req, res) => {
    res.render("xss")
})
app.get("/app", async (req, res) => {
    res.redirect("/home")
})
app.get("/", (req, res) => {
    res.redirect("/home")
})
app.get("/login", (req, res) => {
    res.render("login")
})
app.get("/view-profile", async (req, res) => {
    res.redirect("/view-profile/self")
})
app.get("/view-profile/self", async (req, res) => {
    getStartingAppData(req, res, function(username, level, profilePicture, fullUser) {
        res.render("view-profile", {
            username,
            level,
            profilePicture,
            loggedIn: true,
            isSelf: true,
            userData: fullUser,
        })
    }, function() {
        res.render("404")
    })
})
app.get("/view-profile/:id", async (req, res) => {
    let user = await users.findOne( { id: req.params.id } )
    user = tryDelete(user, "password", "_id")
    getStartingAppData(req, res, function(username, level, profilePicture, fullUser) {
        res.render("view-profile", {
            username,
            level,
            profilePicture,
            userData: user,
            loggedIn: true,
            isSelf: sessions[req.cookies.session].id == fullUser.id
        })
    }, function() {
        res.render("view-profile", {
            userData: user,
            loggedIn: false,
            isSelf: false
        })
    })
})
async function getStartingAppData(req, res, onSuccess, notLoggedIn = function() {}) {
    let session = req.cookies.session
    if(sessions[session] == undefined) {
        notLoggedIn()
        return false
    }
    let user = await users.findOne({ id: sessions[session].id })
    if(user == null) {
        notLoggedIn()
        return false
    }
    let username = user.username || ""
    let level = user.level || "?"
    let profilePicture = user.profilePicture || "default"
    if(user.profilePicture != "default") {
        profilePicture = await retrieveImageAsset(user.profilePicture)
    }
    onSuccess(username, level, profilePicture, user)
    return true
}
app.get("/home", (req, res) => {
    getStartingAppData(req, res, function(username, level, profilePicture) {
        res.render("app", {
            username,
            level,
            profilePicture,
            loggedIn: true,
        })
    }, function() {
        res.render("app", {
            loggedIn: false
        })
    })
})
app.get("/messages", (req, res) => {
    res.send("Unfinished")
})
app.get("/profile", (req, res) => {
    res.send("Unfinished")
})
app.get("/settings", (req, res) => {
    res.send("Unfinished")
})
app.get("/register", (req, res) => {
    res.render("register")
})
app.get("/create-post", (req, res) => {
    getStartingAppData(req, res, function(username, level, profilePicture) {
        res.render("create-post", {
            username,
            level,
            profilePicture,
            loggedIn: true,
        })
    }, function() {
        res.render("app", {
            loggedIn: false
        })
    })
})


app.post("/api/login/", async(req, res) => {
    (async() => {
        const username = req.body.username
        const password = req.body.password
        const result = await users.findOne({ username: username })
        if(result == null) {
            res.send(false)
            return
        }
        let passwordIsValid = await bcrypt.compare(password, result.password)
        if(passwordIsValid) {
            const session = getId()
            sessions[session] = {
                id: result.id,
                creationDate: Date.now(),
            }
            res.send(session)
            return
        }
        res.send(false)
    })()
})
async function ipInXssShame(ip) {
    return false
}
function getIpFromReq(req) {
    return req.headers['x-forwarded-for'] || req.socket.remoteAddress

}
app.post("/api/register/", async(req, res) => {
    let ipBanned = await ipInXssShame(getIpFromReq(req))
    if(ipBanned) {
        res.send(false)
        return
    }
    
    const username = xss(req.body.username)
    const password = req.body.password
    const result = await users.findOne({ username: username })
    if(result != null) {
        res.send(false)
        return;
    }
    let userId = getId()
    const hashedPassword = await bcrypt.hash(password, hashRounds)
    await users.insertOne({
        username: username,
        password: hashedPassword,
        profilePicture: "default",
        level: "1",
        id: userId,
        posts: [],
        comments: [],
        heartedPosts: [],
        heartedComments: [],
        followers: [],
        following: [],
        bio: "No bio yet.",
        location: "unknown",
        createdAt: Date.now()
    })
    const session = getId()
    sessions[session] = {
        id: userId,
        creationDate: Date.now(),
    }
    res.send(session)
    return true
})
app.get("/post/:id", async (req, res) => {
    let postData = await getPostData(req.params.id)
    let authorData = await getUserById(postData.user)
    let postImages = await postData.images
    postImages = JSON.stringify(postImages)
    getStartingAppData(req, res, function(username, level, profilePicture) {
        res.render("post", {
            username,
            level,
            profilePicture,
            postData,
            authorData,
            postImages,
            loggedIn: true
        })
    }, function() {
        res.render("post", {
            postImages,
            postData,
            authorData,
            loggedIn: false,
        })
    })
})
app.get("/api/get-self-data", async (req, res) => {
    const user = await getUserBySession(req.cookies.session)
    if(user == null) {
        res.send(false)
        return
    }
    delete user.password
    res.send(user)
    return true
})

app.post("/api/log-out", (req, res) => {
    if(sessions[req.cookies.session] != undefined) {
        delete sessions[req.cookies.session]
        res.send(true)
        return
    }
})

// IMPORTANT TO REWRITE!!! Images are stored in the server as base64 strings and not as binary data, which makes them 33% bigger than they should be.
app.post("/api/set-profile-image", (req, res) => {
    (async() => {
        const image = req.body.image
        const base64body = image.replace(/^data:image\/png;base64,/, "")
        let fileType = getFileTypeFromBase64(base64body)

        // Session + user check
        const session = req.cookies.session
        let sessionObject = sessions[session]
        if(sessions[session] == undefined) {
            res.redirect(405, "/login")
            return
        }
        const result = await users.findOne({ username: sessionObject.username })
        if(result == null) {
            res.redirect(405, "/login")
            return
        }

        // Compression
        if(fileType != "gif" && fileType != "unknown") {
            fs.writeFile("compression/uncompressed." + fileType, base64body, {
                encoding: "base64",
                flag: "w",
            }, (err) => {
                if(err) {
                    console.log(err)
                    return
                }
                tinify.fromFile("compression/uncompressed." + fileType).toFile("compression/compressed." + getFileTypeFromBase64(base64body), function() {                    
                    fs.readFile("compression/compressed." + fileType, {
                        encoding: "base64",
                        flag: "r",
                    }, (err, data) => {
                        if(err) {
                            console.log(err)
                            return
                        }
                        // Updating profile picture
                        users.updateOne({
                            username: sessionObject.username,
                        }, {
                            $set: {
                                profilePicture: data,
                            },
                        }, (err) => {
                            if(err) {
                                console.log(err)
                                return
                            }
                        })
                    })
                    res.send(true)
                })
            })
        }
    })()
})

async function getUserById(id) {
    const result = await users.findOne( { id: id } )
    if(result == null) {
        return null
    }
    delete result.password
    return result
}

async function getUserBySession(session, res = false) {
    if(session == undefined) {
        if(res != false) res.redirect(405, "/login")
        return false
    }
    if(sessions[session] == undefined) {
        if(res != false) res.redirect(405, "/login")
        return false
    }
    const result = await users.findOne({ id: sessions[session].id })
    if(result == null) {
        if(res != false) res.redirect(405, "/login")
        return false
    }
    return tryDelete(result, "_id")
}

app.post("/api/create-post", async (req, res) => {
    let ipBanned = await ipInXssShame(getIpFromReq(req))
    if(ipBanned) {
        res.send(false)
        return
    }
    let user = await getUserBySession(req.cookies.session, res)
    if(user != false) {
        let title = req.body.title
        if(title == "") {
            title = "Untitled"
        }
        const safeTitle = xss(title)
        const content = req.body.content
        const safeContent = xss(content)
        const options = req.body.options
        const heartsCount = 0
        const heartsFrom = []
        const commentsCount = 0
        const commentsData = {}
        const creationDate = Date.now()
        const postId = getPostId()
        // It's important to add images into the database before the post
        let imagesIds = []
        for(let i = 0; i < req.body.images.length; i++) {
            const image = req.body.images[i]
            let imageId = await storeImageAsset(image.dataUrl)
            imagesIds.push(imageId)
        }
        const post = {
            title: safeTitle || "Untitled",
            content: safeContent,
            options: options,
            heartsCount: heartsCount,
            heartsFrom: heartsFrom,
            commentsCount: commentsCount,
            commentsData: commentsData,
            creationDate: creationDate,
            id: postId,
            user: user.id,
            images: imagesIds,
        }
        await posts.insertOne(post)
        await users.updateOne({
            id: user.id,
        }, {
            $push: {
                posts: postId,
            },
        })
        res.send(currentDomain + "/" + postId)
        
        // Sending update to subscribed sockets
        for(let i = 0; i != feedSubscriptions.length; i++) {
            const subscription = feedSubscriptions[i]
            subscription.emit("new-post", post)
            console.log("New post sent to " + subscription.id)
        }
    }
})

async function getPostData(postId, res) {
    const result = await posts.findOne({ id: postId })
    return result
}
app.get("/api/post/:id", (req, res) => {
    (async() => {
        let result = await getPostData(req.params.id, res)
        if(result == null) {
            res.send("Post not found")
            return
        }
        res.send(result)
    })()
})
app.get("/api/assets/images/:id", (req, res) => {
    (async() => {
        let data = await retrieveImageAsset(req.params.id)
        res.send(data)
    })()
})

function getFileTypeFromBase64(base64) {
    switch(base64.charAt(0)) {
        case "i":
            return "png"
        case "/":
            return "jpg"
        case "R":
            return "gif"
        case "U":
            return "webp"
        default:
            return "png"
    }
}
function getBase64Prefix(base64) {
    switch(base64.charAt(0)) {
        case "i":
            return "data:image/png;base64,"
        case "/":
            return "data:image/jpg;base64,"
        case "R":
            return "data:image/gif;base64,"
        case "U":
            return "data:image/webp;base64,"
        default:
            return ""
    }
}

function getId() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
const postCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
function getPostId() {
    let id = ""
    for(let i = 0; i < 6; i++) {
        id += postCharacters[Math.floor(Math.random() * postCharacters.length)]
    }
    return id
}
app.get("/api/feed/recent", async (req, res) => {
    let skip = validInt(req.query.skip, 0)
    let recentPosts = posts.find({}).limit(14).skip(skip).sort({ creationDate: -1 })
    recentPosts.toArray((err, data) => {
        let authorsArray = []
        for(let i = 0; i != data.length; i++) {
            data[i] = tryDelete(data[i], "_id", "content", "options", "commentsData", "images")
            authorsArray.push(data[i].user)
        }

        let authorsSearch = users.find({
            id: {
                $in: authorsArray
            }
        })
       

        authorsSearch.toArray(async (err, dataAuthors) => {
            for(let i = 0; i != dataAuthors.length; i++) {
                dataAuthors[i] = tryDelete(dataAuthors[i], "_id", "password")
            }


            let profilePictureAssetIds = []
            for(let i = 0; i != dataAuthors.length; i++) {
                if(dataAuthors[i].profilePicture != "default") {
                    profilePictureAssetIds.push(dataAuthors[i].profilePicture)
                }
            }
            let profilePictureAssets = await retrieveImageAssets(profilePictureAssetIds)

            res.send({
                postData: data,
                userData: dataAuthors,
                profilePictures: profilePictureAssets
            })
        })
    })
})
app.get("/api/feed/following", async(req, res) => {
    let user = await getUserBySession(req.cookies.session)
    if(user == false) {
        res.redirect("/404")
        return
    }
    let following = user.following

    let skip = validInt(req.query.skip, 0)
    let recentPosts = posts.find({
        user: {
            $in: following
        }
    }).limit(14).skip(skip).sort({ creationDate: -1 })
    recentPosts.toArray((err, data) => {
        let authorsArray = []
        for(let i = 0; i != data.length; i++) {
            data[i] = tryDelete(data[i], "_id", "content", "options", "commentsData", "images")
            authorsArray.push(data[i].user)
        }

        let authorsSearch = users.find({
            id: {
                $in: authorsArray
            }
        })
        authorsSearch.toArray((err, dataAuthors) => {
            for(let i = 0; i != dataAuthors.length; i++) {
                dataAuthors[i] = tryDelete(dataAuthors[i], "_id", "password")
            }
            res.send({
                postData: data,
                userData: dataAuthors
            })
        })
    })
})
app.get("/api/get-basic-user-data/:id", async (req, res) => {
    let user = await getUserById(req.params.id)
    if(user == false) {
        res.send(false)
    }
    user = tryDelete(user, "_id", "level", "posts", "comments", "heartedPosts", "heartedComments", "followers", "following", "bio", "location", "createdAt")
    res.send(user)
})
app.get("/api/basic-user-data-array/:usersArray", async (req, res) => {
    let usersArray = req.params.usersArray.split(",")
    let result = users.find({
        id: {
            $in: usersArray
        }
    })
    result.toArray((err, data) => {
        if(err) console.log(err)
        for(let i = 0; i != data.length; i++) {
            data[i] = tryDelete(data[i], "_id", "password", "level", "posts", "comments", "heartedPosts", "heartedComments", "followers", "following", "location", "createdAt")
        }
        res.send(data)
    })
})
function validInt(int, fallback) {
    let parsedInt = parseInt(int)
    if(parsedInt == NaN) {
        return fallback
    }
    return parsedInt
}
app.get("/api/post-is-liked/:id", async(req, res) => {
    if(!userIsLoggedIn(req.cookies.session)) {
        res.send("error");
        return;
    }
    
    let user = await users.findOne({ id: sessions[req.cookies.session].id })
    let post = await posts.findOne({ id: req.params.id })
    if(user == null || post == null) {
        res.send("error")
        return
    }
    if(post.heartsFrom.includes(user.id)) {
        res.send(true)
    } else {
        res.send(false)
    }
})
app.get("/api/user/:id", async (req, res) => {
    console.log("request sent")
    let user = await users.findOne({ id: req.params.id })
    if(user == null) {
        res.send("User not found")
        return
    }
    delete user.password
    res.send(user)
})
app.get("/api/posts/:id", async (req, res) => {
    let post = await posts.findOne({ id: req.params.id })
    if(post == null) {
        res.send("Post not found")
        return
    }
    res.send(post)
})
app.post("/api/follow/:id", async(req, res) => {
    if(!userIsLoggedIn(req.cookies.session)) {
        res.send(false)
        return
    }

    let ipBanned = await ipInXssShame(getIpFromReq(req))
    if(ipBanned) {
        res.send(false)
        return
    }
    let follower = await getUserBySession(req.cookies.session)
    let target = await getUserById(req.params.id)
    if(target == null) {
        res.send(false)
        return
    }
    if(follower.id == target.id) {
        res.send("Can't follow yourself")
        return
    }
    if(target.followers.indexOf(follower.id) == -1) {
        users.updateOne({
            id: target.id
        }, {
            $push: {
                followers: follower.id
            }
        })
        users.updateOne({
            id: follower.id
        }, {
            $push: {
                following: target.id
            }
        })
        res.send(true)
    } else {
        res.send(false)
        console.log("already following")
        return
    }
        
    

    target.followers.push(follower.id)
    follower.following.push(target.id)
    io.to("update:" + target.id).emit("user-update", {
        id: target.id,
        value: target
    })
    io.to("update:" + follower.id).emit("user-update", {
        id: follower.id,
        value: follower
    })
})
app.post("/api/unfollow/:id", async(req, res) => {
    let ipBanned = await ipInXssShame(getIpFromReq(req))
    if(ipBanned) {
        res.send(false)
        return
    }
    let unfollower = await getUserBySession(req.cookies.session)
    let target = await getUserById(req.params.id)
    if(target == null) {
        res.send(false)
        return
    }
    if(unfollower.id == target.id) {
        res.send("Can't unfollow yourself")
        return
    }
    if(target.followers.indexOf(unfollower.id) != -1) {
        users.updateOne({
            id: target.id
        }, {
            $pull: {
                followers: unfollower.id
            }
        })
        users.updateOne({
            id: unfollower.id
        }, {
            $pull: {
                following: target.id
            }
        })
        res.send(true)
    } else {
        res.send(false)
    }
    

    target.followers.remove(unfollower.id)
    unfollower.following.remove(target.id)

    io.to("update:" + target.id).emit("user-update", {
        id: target.id,
        value: target
    })
    io.to("update:" + unfollower.id).emit("user-update", {
        id: unfollower.id,
        value: unfollower
    })
})
app.get("/api/get-followers-basic-data/:id", async (req, res) => {
    let user = await getUserById(req.params.id)
    if(user == null) {
        res.send("User not found")
        return
    }
    let followers = users.find({ id: { $in: user.followers } }).skip(validInt(req.query.skip, 0)).limit(validInt(req.query.limit, 0))
    followers.toArray((err, data) => {
        for(let i = 0; i != data.length; i++) {
            data[i] = tryDelete(data[i], "_id", "password", "level", "posts", "comments", "heartedPosts", "heartedComments", "followers", "following", "location", "createdAt")
        }
        res.send(data)
    })
})
app.get("/api/get-following-basic-data/:id", async (req, res) => {
    let user = await getUserById(req.params.id)
    if(user == null) {
        res.send("User not found")
        return
    }
    let following = users.find({ id: { $in: user.following } }).skip(validInt(req.query.skip, 0)).limit(validInt(req.query.limit, 0))
    following.toArray((err, data) => {
        for(let i = 0; i != data.length; i++) {
            data[i] = tryDelete(data[i], "_id", "password", "level", "posts", "comments", "heartedPosts", "heartedComments", "followers", "following", "location", "createdAt")
        }
        res.send(data)
    })
})
app.post("/api/update-self-data", async (req, res) => {
    let user = await getUserBySession(req.cookies.session, res)
    user = tryDelete(user, "_id", "password")
    if(user == null) {
        return
    }
    let toSend = {}
    if(req.body.username != null && req.body.username != user.username) {
        toSend.username = req.body.username
    }
    if(req.body.bio != null && req.body.bio != user.bio) {
        toSend.bio = req.body.bio
    }
    if(req.body.profilePicture != null) {
        let storageId = await storeImageAsset(req.body.profilePicture)
        toSend.profilePicture = storageId
    }
    if(req.body.coverPicture != null) {
        let storageId = await storeImageAsset(req.body.coverPicture)
        toSend.coverPicture = storageId
    }

    if(Object.keys(toSend).length > 0) {
        users.updateOne({
            id: user.id,
        }, {
            $set: toSend
        })
        res.send({
            ...user,
            ...toSend
        })
        return
    }
    res.status(204).send()
})
app.post("/api/post-toggle-heart/:id", async (req, res) => {
    let ipBanned = await ipInXssShame(getIpFromReq(req))
    if(ipBanned) {
        res.send(false)
        return
    }
    if(!userIsLoggedIn(req.cookies.session)) {
        res.send("error");
        return;
    }
    let user = await getUserBySession(req.cookies.session, res)
    let post = await posts.findOne({ id: req.params.id })
    if(post == null) {
        res.send("Post not found")
        return
    }
    if(post.heartsFrom.includes(user.id)) {
        await posts.updateOne({
            id: req.params.id,
        }, {
            $pull: {
                heartsFrom: user.id,
            },
            $inc: {
                heartsCount: -1,
            }
        })
        await users.updateOne({
            id: user.id,
        }, {
            $pull: {
                hearts: req.params.id,
            }
        })
    } else {
        await posts.updateOne({
            id: req.params.id,
        }, {
            $push: {
                heartsFrom: user.id,
            },
            $inc: {
                heartsCount: 1,
            }
        })
        await users.updateOne({
            id: user.id,
        }, {
            $push: {
                hearts: req.params.id,
            }
        })
    }
    post = await posts.findOne({ id: req.params.id })
    res.send(post.heartsCount.toString())
})

function dataUriToBase64(dataURI) {
    return dataURI.substr(dataURI.indexOf('base64') + 7)
}

async function retrieveImageAsset(assetID, type = "dataURI") {
    let asset = await imageAssets.findOne({id: assetID})
    if(type == "dataURI") {
        return "data:image/" + asset.type + ";base64," + asset.data.toString("base64")
    } else if(type == "buffer") {
        return asset.data
    }
}
async function storeImageAsset(dataURI) {
    let base64 = dataUriToBase64(dataURI)
    let buffer = Buffer.from(base64, 'base64')
    let assetID = getId()
    let type = getFileTypeFromBase64(base64)
    await imageAssets.insertOne({
        data: buffer,
        id: assetID,
        type,
    })
    return assetID
}
async function retrieveImageAssets(assetIDs, type = "dataURI") {
    let assets = imageAssets.find({id: {$in: assetIDs}})
    return new Promise((resolve, reject) => {
        assets.toArray((err, data) => {
            for(let i = 0; i != data.length; i++) {
                if(type == "dataURI") {
                    data[i] = "data:image/" + data[i].type + ";base64," + data[i].data.toString("base64")
                } else if(type == "buffer") {
                    data[i] = data[i].data
                } else {
                    throw new Error("Invalid type: " + type)
                }
            }
            resolve(data)
        })
    })
}
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};


function deleteAllData() {
    posts.deleteMany({})
    users.deleteMany({})
    imageAssets.deleteMany({})
}


const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
function timeToHumanReadableString(time) {
	let date = new Date(time)
	return date.getDay() + " " + months[date.getMonth()] + ", " + date.getFullYear()
}
app.locals.timeToHumanReadableString = timeToHumanReadableString;

function userIsLoggedIn(sessionId) {
    return sessions[sessionId] != undefined
}

function tryDelete(object, ...keys) {
    for(let key of keys) {
        if(object[key] != undefined) {
            delete object[key]
        }
    }

    return object
}

