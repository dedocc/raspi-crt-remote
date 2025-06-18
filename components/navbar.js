class Navbar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
            <style>
                .bar {
                    background-color: #C0C0C0;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 25px;
                    padding: 2px 5px;
                    box-shadow: 0px -1px 0px 0px #FFFFFF, 0px -3px 0px 0px #DFDFDF;
                }
                .tray {
                    float: right;
                    width: auto;
                    height: auto;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    padding: 5px 8px 2px 8px;
                    box-shadow: 2px 2px 0px 0px #555 inset, 2px 2px 0px 0px #fff;
                    gap: 5px;
                }
                p#clock {
                    margin: 0;
                    padding: 0;
                    line-height: 1;
                }

                .startbutton {
                    height: 100%;
                }

                button {
                    font: inherit;
                    border-color: white black black white;
                    height: 100%;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    gap: 5px;
                    background-color: #C0C0C0;
                }
                .startbutton img {
                    pointer-events: none;
                    height: 18px;
                    width: auto;
                }

                .tray img {
                    pointer-events: none;
                    height: 18px;
                    width: auto;            
                }
            </style>
            
            <nav class="bar">
                <div class="startbutton">
                    <button>
                        <img src="img/start.png" alt="startbutton">
                        Start
                    </button>
                </div>
                <div class="tray">
                    <div id="volumebutton" onclick="window.toggleVolume()">
                        <img src="img/volume.png" alt="volumeicon">
                    </div>
                    <p id="clock">--:--</p>
                </div>
            </nav>
        `;
        this.clockElement = this.shadowRoot.getElementById('clock');
        window.volumeButton = this.shadowRoot.getElementById('volumebutton');
    }
    connectedCallback() {
        this.updateClock();
        this.clockInterval = setInterval(() => this.updateClock(), 1000);
    }

    disconnectedCallback() {
        clearInterval(this.clockInterval);
    }

    updateClock() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12;

        const minutesStr = minutes < 10 ? '0' + minutes : minutes;

        this.clockElement.textContent = `${hours}:${minutesStr} ${ampm}`;
    }
}

customElements.define("my-navbar", Navbar);
