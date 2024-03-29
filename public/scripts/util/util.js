// let input = document.getElementById("file")
// input.addEventListener("change", async function(event) {
//     let file = event.target.files[0]
//     let reader = new FileReader()
//     reader.onload = function(e) {
//         let data = e.target.result
//         console.log(data)
//         post("set-profile-image", {
//             image: data
//         })
//     }
//     reader.readAsDataURL(file)
// })

function smartMarkedParse(text, images) {
    let lexer = new marked.Lexer()
    lexer.options.xhtml = true
    lexer.tokenizer.rules.block.html = { exec: function() {return null} }
    let lexed = lexer.lex(text)
    if(lexed.links != undefined) {
        delete lexed.links
    }
    let tokens = Object.values(lexed)
    let toReturn = document.createElement("div")
    for(let i = 0; i != tokens.length; i++) {
        let tokenToElement = parseMarkedToken(tokens[i], images)
        toReturn.appendChild(tokenToElement)
    }
    return toReturn
}
function parseMarkedToken(tokenObject, images) {
    let element = tokenToElement(tokenObject, images)
    if(tokenObject.tokens != undefined && tokenObject.type != "text") {
        for(let i = 0; i != tokenObject.tokens.length; i++) {
            element.appendChild(parseMarkedToken(tokenObject.tokens[i], images))
        }
    }
    return element
}

function tokenToElement(token, images) {
    let element
    switch(token.type) {
        case "text":
            element = document.createTextNode(he.decode(token.text))
            return element
        case "em":
            element = document.createElement("em")
            element.classList.add("marked-em")
            return element
        case "codespan":
            element = document.createElement("code")
            element.textContent = he.decode(token.text)
            element.classList.add("marked-code")
            return element
        case "br":
            element = document.createElement("br")
            element.classList.add("marked-br")
            return element
        case "del":
            element = document.createElement("del")
            element.classList.add("marked-del")
            return element
        case "link":
            element = document.createElement("a")
            element.href = token.href
            element.textContent = token.text
            element.classList.add("marked-link")
            return element
        case "image":
            const captionText = token.text
            const includeCaption = captionText != ""
            let href = token.href
            let realSrc = href
            if(href.startsWith("image-")) {
                console.log(images, "76")
                for(let i = 0; i != images.length; i++) {
                    if(images[i].id == href) {
                        realSrc = images[i].dataURI
                        break
                    }
                }
            }
            let container = document.createElement("div")
            container.classList.add("marked-image-container")
            if(includeCaption) {
                let caption = document.createElement("p")
                caption.classList.add("marked-image-caption")
                caption.textContent = captionText
                container.appendChild(caption)
            }
            let image = document.createElement("img")
            image.src = realSrc
            image.classList.add("marked-image")
            image.style = "max-width: 100%; width: 100%;"
            container.appendChild(image)

            return container
        case "paragraph":
            element = document.createElement("p")
            element.classList.add("marked-paragraph")
            return element
        case "strong":
            element = document.createElement("strong")
            element.classList.add("marked-strong")
            return element
        case "list":
            if(token.ordered) {
                element = document.createElement("ol")
                element.classList.add("marked-list")
            } else {
                element = document.createElement("ul")
                element.classList.add("marked-list")
            }
            token.tokens = token.items
            return element
        case "list_item":
            element = document.createElement("li")
            element.classList.add("marked-list-item")
            console.log(token.tokens)
            if(token.tokens.length > 0) {
                token.tokens = token.tokens[0].tokens
            } else {
                token.tokens = []
            }
            return element  
        case "html":
            element = document.createElement("div")
            element.innerText = he.decode(token.text)
            element.classList.add("marked-paragraph")
            return element
        case "escape":
            element = document.createTextNode(he.decode(token.text))
            return element
        case "hr":
            element = document.createElement("hr")
            element.classList.add("marked-hr")
            return element
        case "heading":
            element = document.createElement("h" + token.depth)
            element.classList.add("marked-h" + token.depth)
            return element
        case "space":
            element = document.createElement("span")
            element.classList.add("marked-space")
            element.innerHTML = "<br>".repeat(token.raw.match(/\n/g).length - 1)
            return element
        case "blockquote":
            element = document.createElement("blockquote")
            element.classList.add("marked-blockquote")
            return element
        default: 
            throw new Error(token.type)
    }
}

function changeUrlWithoutReload(url) {
    window.history.pushState({}, null, url);
}

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

function copyText(text) {
    var textField = document.createElement('textarea');
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
}

let timeConversionData = [
	["second", "seconds", 1000], 
	["minute", "minutes", 60], 
	["hour", "hours", 60], 
	["day", "days", 24], 
	["week", "weeks", 7],
	["month", "months", 4.34524],
	["year", "years", 12],
	["decade", "decades", 10],
	["century", "centuries", 10]
]
function convertTimeFromMS(time) {
	time = Math.max(time, 1000)
	let timeConversionDataIndex = 0
	while(time / timeConversionData[timeConversionDataIndex][2] >= 1) {
		time = time / timeConversionData[timeConversionDataIndex][2]
		timeConversionDataIndex++
		if(timeConversionDataIndex >= timeConversionData.length) {
			break
		}
	}
	let t = timeConversionData[timeConversionDataIndex - 1][1]
	let timeNumber = Math.floor(time)
    if(timeNumber == 1) {
        t = timeConversionData[timeConversionDataIndex - 1][0]
    }
	return timeNumber + " " + t
}

const markedRenderer = {
    code(code, infostring) {
        let pre = document.createElement("pre")
        pre.innerText = code
        return pre.outerHTML
    },
    blockquote(quote) {
        let blockquote = document.createElement("blockquote")
        blockquote.innerText = quote
        return blockquote.outerHTML
    },
    html(html) {
        let div = document.createElement("div")
        div.innerText = html
        return div.outerHTML
    },
    heading(text, level) {
        let heading = document.createElement(`h${level}`)
        heading.innerText = text
        heading.classList.add("heading-h" + level)
        return heading.outerHTML
    },
    link(href, title, text) {
        return `<a class="marked-link" href="${href}" title="${title}">${text}</a>`
    },
    paragraph(text) {
        return `<p class="marked-paragraph">${text}</p>`
    },
    image(href, text, caption) {
        let realSrc = href
        const includeCaption = caption != ""
        if(href.startsWith("image-")) {
            for(let i = 0; i != uploadedImages.length; i++) {
                if(uploadedImages[i].id == href) {
                    
                    realSrc = uploadedImages[i].dataUrl
                    break
                }
            }
        }
        
        return `
            <div class="marked-image-container">
                ${includeCaption ? "<p class=\"marked-image-caption\">" + caption + "</p>" : ""}
                <img class="marked-image" src=${realSrc} style="max-width: 100%; width: 100%">
            </div>
        `
    },
    list(body, ordered) {
        return `<${ordered ? 'ol' : 'ul'} class="marked-list marked-${ordered ? "ol" : "ul"}">${body}</${ordered ? 'ol' : 'ul'}>`
    },
    code(code, lang) {
        return `<pre class="marked-code"><code class="marked-code">${code}</code></pre>`
    },
}
async function getMainColorFromImageSrc(imageSrc) {
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");
    let image = new Image();
    image.src = imageSrc;
    return new Promise((resolve, reject) => {
        image.onload = () => {
            context.drawImage(image, 0, 0, 1, 1);
            let imageData = context.getImageData(0, 0, 1, 1).data;
            resolve(`rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`)
        };
    });
}
function getMainColorFromImage(image) {
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, 1, 1);
    let imageData = context.getImageData(0, 0, 1, 1).data;
    return `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;
}
function repeatString(string, times) {
    let result = ""
    for(let i = 0; i != times; i++) {
        result += string
    }
    return result
}