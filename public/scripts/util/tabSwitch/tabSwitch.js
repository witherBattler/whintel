class TabSwitch extends HTMLElement {
    constructor() {
        super()
        this.events = {
            tabSwitch: [],
        }
    }
    connectedCallback() {
        let shadow = this.attachShadow( { mode: "open" } )
        
        let style = document.createElement("link")
        style.setAttribute("rel", "stylesheet")
        style.setAttribute("href", "/scripts/util/tabSwitch/tabSwitch.css")

        let container = document.createElement("div")
        container.classList.add("tab-switch-container")

        let tabs = this.getAttribute("tabs").split(",")
        let currentlySelectedTab = null
        let currentlySelectedTabElement = null
        for(let i = 0; i != tabs.length; i++) {
            let tab = document.createElement("div")
            tab.classList.add("tab")
            tab.innerHTML = tabs[i]
            if(i == 0) {
                tab.classList.add("selected")
                currentlySelectedTab = tabs[i]
                currentlySelectedTabElement = tab
            }
            tab.addEventListener("click", (event) => {
                if(currentlySelectedTabElement) {
                    currentlySelectedTabElement.classList.remove("selected")
                }
                currentlySelectedTabElement = tab
                currentlySelectedTabElement.classList.add("selected")
                currentlySelectedTab = tabs[i]
                this.events.tabSwitch.forEach(callback => callback(currentlySelectedTab))
            })
            container.appendChild(tab)
        }

        shadow.appendChild(style)
        shadow.appendChild(container)
    }
    appendEvent(eventName, callback) {
        this.events[eventName].push(callback)
    }
}

customElements.define("tab-switch", TabSwitch)