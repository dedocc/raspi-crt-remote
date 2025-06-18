class Volume extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
            <style>
                .wrapper {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    position: fixed;
                    bottom: 32px;
                    right: 32px;
                    width: 50px;
                    padding:  10px 20px;
                    background-color: #c0c0c0;
                    border: 2px outset #e2e2e2;
                    gap: 5px;
                }
                
                p {
                    margin:0px;
                }

                input[type=range] {
                    -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
                    width: 100%; /* Specific width is required for Firefox. */
                    background: transparent; /* Otherwise white in Chrome */
                    writing-mode: vertical-lr;
                    direction: rtl;
                    height: 100%;
                    z-index: 1;
                }

                input[type=range]::-webkit-slider-thumb{
                    -webkit-appearance: none;
                    margin: 0px;
                    width: 28px;
                    height: 15px;
                    border: 2px outset #e2e2e2;
                    margin-left: -12px;
                    background-color: #c0c0c0;
                    cursor: pointer;
                }

                input[type=range]::-moz-range-thumb {
                    all: unset;
                    margin: 0px;
                    width: 28px;
                    height: 15px;
                    border: 2px outset #e2e2e2;
                    background-color: #c0c0c0;
                    cursor: pointer;
                }

                input[type=range]::-webkit-slider-runnable-track {
                    width: 5px;
                    cursor: pointer;
                    background: #000;
                    border: 2px inset #fff;
                }


                input[type=range]::-moz-range-track {
                    width: 2px;
                    cursor: pointer;
                    background: #000;
                    border: 2px inset #fff;
                }

                .slider-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 150px;
                    width: 25px;
                }

                .ticks {
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                  height: 90%;
                  z-index: 0;
                }

                .ticks div {
                  width: 6px;
                  height: 1px;
                  background: #000;
                }

            </style>

            <div class="wrapper">
                <label>Volume</label>
                <div class="slider-wrapper">
                    <div class="ticks">
                        <div></div><div></div><div></div><div></div><div></div><div></div><div></div>
                    </div>
                    <input class="volumebar" type="range"/>
                    <div class="ticks">
                        <div></div><div></div><div></div><div></div><div></div><div></div><div></div>
                    </div>
                </div>
            </div>
        `;
        this.bar = this.shadowRoot.querySelector('.volumebar');
        this.drag = false;
    }
    
    connectedCallback() {
        this.bar.addEventListener('mousedown', e => this.start(e));
        this.bar.addEventListener('touchstart', e => this.start(e.touches[0]), { passive: false });
        document.addEventListener('mousemove', e => this.move(e));
        document.addEventListener('touchmove', e => this.move(e.touches[0]), { passive: false });
        document.addEventListener('mouseup', () => this.end());
        document.addEventListener('touchend', () => this.end());
        //this.update();
    }
    
    start(e) {
        this.drag = true;
        this.set(e);
    }

    move(e) {
        if (this.drag) {
            this.set(e);
        }
    }

    end() {
        this.drag = false;
    }

    set(e) {
        let v = this.bar.getAttribute("value");
        this.mpv_volume(v);
    }

    async mpv_volume(percentage) {
      await fetch(`http://${location.hostname}:8081/set-volume`, {
          method: "POST",
          headers: {
              "Content-type": "application/json"
          },
          body: JSON.stringify({
              "command": ["set_property", "volume", percentage]
          })
      });
  }

}
customElements.define("my-volume", Volume);
