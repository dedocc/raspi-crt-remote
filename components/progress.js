class Progressbar extends HTMLElement {
  static get observedAttributes() {
    return ["value"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        .progress-bar {
          width: 100%;
          height: 20px;
          box-shadow: 2px 2px 0 #fff, 2px 2px 0 #808080 inset;
          margin: 10px 0;
          position: relative;
          cursor: pointer;
          user-select: none;
          overflow: hidden;
        }
        .progress-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          margin: 0;
          color: var(--secondary-color);
          font-weight: bold;
          pointer-events: none;
        }
        progress {
          all: unset;
          position: absolute;
          top: 2px;
          left: 2px;
          width: 100%;
          height: 18px;
        }
        progress::-moz-progress-bar { background: var(--accent-color); }
        progress::-webkit-progress-bar { background: #c0c0c0; }
        progress::-webkit-progress-value { background: var(--accent-color); }
      </style>
      <div class="progress-bar">
        <progress id="progress" max="1"></progress>
        <p class="progress-text"></p>
      </div>
    `;
    this.bar = this.shadowRoot.querySelector('.progress-bar');
    this.progress = this.shadowRoot.querySelector('#progress');
    this.text = this.shadowRoot.querySelector('.progress-text');
    this.drag = false;
  }

  async connectedCallback() {
    await window.mpvPropsReady;
    this.bar.addEventListener('mousedown', e => this.start(e));
    this.bar.addEventListener('touchstart', e => this.start(e.touches[0]), { passive: false });
    document.addEventListener('mousemove', e => this.move(e));
    document.addEventListener('touchmove', e => this.move(e.touches[0]), { passive: false });
    document.addEventListener('mouseup', () => this.end());
    document.addEventListener('touchend', () => this.end());
    this.update();
    document.addEventListener("mpv-update", e => {
        const { name, data } = e.detail;
        if (name === "time-pos") {
            this.text.textContent = this.convert_seconds(data*1000);
        }
    });
  }

  attributeChangedCallback() {
    this.update();
  }

  start(e) {
    this.wasPaused = window.mpvProps.pause;
    mpvPause();
    this.drag = true;
    this.set(e);
  }

  move(e) {
    if (!this.drag) return;
    this.set(e);
  }

  end() {
    if (!this.drag) return;
    if (!this.wasPaused) {
        mpvPlay();
    }
    this.drag = false;
  }

  set(e) {
    const r = this.bar.getBoundingClientRect();
    const v = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    mpvSeek(v*100);
    this.setAttribute('value', v);
  }

    convert_seconds(value) {
        return new Date(value).toISOString().slice(11, 19);
    }

  update() {
    const v = parseFloat(this.getAttribute('value')) || 0;
    this.progress.value = v;
  }
}

customElements.define("my-progressbar", Progressbar);
