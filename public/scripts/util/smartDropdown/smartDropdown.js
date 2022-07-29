
class SmartDropdown extends HTMLElement {
    constructor() {
        super()
        this.events = {
            change: []
        }
    }
    connectedCallback() {
        this.dropdownLabel
        let options = this.options
        let special = this.getAttribute("special")

        let shadow = this.attachShadow({ mode: "open" })
        let style = document.createElement("link")
        style.setAttribute("rel", "stylesheet")
        style.setAttribute("href", "scripts/util/smartDropdown/smartDropdown.css")
        shadow.appendChild(style)

        let dropdown = document.createElement("div")
        dropdown.setAttribute("class", "dropdown")
        dropdown.style.width = this.getAttribute("width") || "100%"
        dropdown.style.fontSize = this.getAttribute("font-size") || "25px"
        dropdown.addEventListener("click", () => {
            if(dropdownOptions.style.height == dropdownOptionsHeight + "px") {
                dropdownOptions.style.height = "0px"
                dropdownOptions.style.opacity = "0"
                dropdownIcon.style.transform = "rotate(0deg)"
            } else {
                dropdownOptions.style.height = dropdownOptionsHeight + "px"
                dropdownOptions.style.opacity = "1"
                dropdownIcon.style.transform = "rotate(180deg)"
            }
        })
        window.addEventListener("mousedown", (event) => {
            if(dropdown.matches(":hover") || dropdownOptions.matches(":hover")) {
                return
            }
            dropdownOptions.style.height = "0px"
            dropdownOptions.style.opacity = "0"
            dropdownIcon.style.transform = "rotate(0deg)"
        })

        let dropdownLabel = document.createElement("div")
        dropdownLabel.setAttribute("class", "dropdownLabel")
        dropdownLabel.innerText = options[0]
        this.dropdownLabel = dropdownLabel

        let dropdownIconContainer = document.createElement("div")
        dropdownIconContainer.setAttribute("class", "dropdownIconContainer")

        let dropdownIcon = document.createElement("img")
        dropdownIcon.setAttribute("class", "dropdownIcon")
        dropdownIcon.src = "images/icons/dropdownIcon.svg"

        let dropdownOptionsHeight = 0
        let dropdownOptions = document.createElement("div")
        dropdownOptions.style.width = this.getAttribute("width") || "100%"
        dropdownOptions.style.fontSize = this.getAttribute("font-size") || "25px"
        for (let i = 0; i < options.length; i++) {
            let option = document.createElement("div")
            option.setAttribute("class", "dropdownOption")
            option.innerText = options[i]
            if(special == "font") {
                option.style.fontFamily = options[i]
            }
            option.addEventListener("click", () => {
                dropdownLabel.innerText = options[i]
                dropdownOptions.style.height = "0"
                dropdownOptions.style.opacity = "0"
                dropdownIcon.style.transform = "rotate(0deg)"
                this.events.change.forEach(callback => callback(options[i]))
            })
            dropdownOptions.appendChild(option)
        }
        let borderRadius = this.getAttribute("border-radius")
        if(borderRadius == "left") {
            dropdown.style.borderTopLeftRadius = "5px"
            dropdown.style.borderBottomLeftRadius = "5px"
        }
        dropdownOptions.setAttribute("class", "dropdownOptions")
        dropdownOptionsHeight = options.length * 34 + 8

        dropdownIconContainer.appendChild(dropdownIcon)
        dropdown.appendChild(dropdownLabel)
        dropdown.appendChild(dropdownIconContainer)
        shadow.appendChild(style)
        shadow.appendChild(dropdown)
        shadow.appendChild(dropdownOptions)
    }
    get options() {
        return this.getAttribute("options").split(",")
    }
    appendEvent(event, callback) {
        this.events[event].push(callback)
    }
    set font(fontName) {
        this.dropdownLabel.style.fontFamily = fontName
    }
}

customElements.define('smart-dropdown', SmartDropdown)