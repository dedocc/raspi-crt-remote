class Shutdown extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
            <style>
                .screen {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: repeating-conic-gradient(#000 0 25%, transparent 0 50%) 50% / 2px 2px;
                    z-index: 999;
                }
                .wrapper {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background-color: #c0c0c0;
                    width: 200px;
                    height: fit-content; 
                    border: 3px solid #e2e2e2;
                }

                .content {
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    gap: 10px;
                    padding: 20px;
                }

                .actions {
                    display: flex;
                    gap: 10px;
                }

                button {
                    font: inherit;
                    border-color: white black black white;
                    background-color: #c0c0c0;
                    height: fit-content;
                    width: 50px;
                    padding: 5px;
                }

            </style>

            <div class="screen">
                <div class="wrapper">
                    <my-titlebar id="titlebar" title="Shutdown" icon="img/turnoff.ico"></my-titlebar>
                    <div class="content">
                        <label>Power off the system?</label>
                        <div class="actions">
                            <button id="yesbtn">Yes</button>
                            <button id="nobtn" onclick="this.closeWindow()">No</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        this.shadowRoot.getElementById("nobtn").onclick = () => {
            this.hidden = true;
        };
        this.shadowRoot.getElementById("yesbtn").onclick = () => {
            poweroff();
        };
        this.shadowRoot.getElementById("titlebar").addEventListener("close", (event) => {
            event.stopPropagation();
            this.hidden = true;
        });
    }
}

customElements.define("my-shutdown", Shutdown);
