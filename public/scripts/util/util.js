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
    heading(text, level) {
        return `<h${level} class="marked-h${level}">${text}</h${level}>`
    },
    link(href, title, text) {
        return `<a class="marked-link" href="${href}" title="${title}">${text}</a>`
    },
    paragraph(text) {
        return `<p class="marked-paragraph">${text}</p>`
    },
    image(href, text, caption) {
        console.log('%cRENDERING IMAGE!!!', "color: blue; font-size: 30px")
        let realSrc = href
        const includeCaption = caption != ""
        if(href.startsWith("image-")) {
            console.log(uploadedImages)
            for(let i = 0; i != uploadedImages.length; i++) {
                console.log(href)
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
    }
}
async function getMainColorFromImageSrc(imageSrc) {
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");
    let image = new Image();
    image.src = imageSrc;
    return new Promise((resolve, reject) => {
        console.log("AAAAAAAAAAAAAAAAAAAA")
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