class Player extends HTMLElement {
    static get observedAttributes() {
        return ["title"];
    }

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
            <style>
                .wrapper {
                    border: 3px solid #e2e2e2;
                    background-color: #C0C0C0;
                    overflow: hidden;
                    height: fit-content;
                }
                .content {
                    padding: 10px 30px;
                    display: flex;
                    flex-direction: column;
                }
                .controls {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    height: 50px;
                    gap: 10px;
                }
                .scrolling-title {
                    overflow: hidden;
                    white-space: nowrap;
                    width: 100%;
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .scroll-text {
                    display: inline-block;
                    white-space: nowrap;
                    will-change: transform;
                    padding-right: 2rem; /* gap between repeats */
                }
                @keyframes scroll-text {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(calc(-1 * var(--scroll-width)));
                    }
                }
                button {
                    font: inherit;
                    font-size: 20px;
                    border-color: white black black white;
                    background-color: #c0c0c0;
                    height: 100%;
                    width: 60px;
                }
                p {
                    margin: 0;
                }
            </style>
            
            <div class="wrapper">
                <my-titlebar icon="img/volume.png" title="Now playing"></my-titlebar>
                <div class="content">
                    <p id="title" class="scrolling-title">
                        <span class="scroll-text"></span>
                        <span class="scroll-text"></span>
                    </p>
                    <my-progressbar value="0"></my-progressbar>
                    <div class="controls">
                        <button id="prev">⏮</button>
                        <button id="play">⏯</button>
                        <button id="next">⏭</button>
                    </div>
                </div>
            </div>
        `;

        this.titleElement = this.shadowRoot.getElementById("title");
        this.spans = this.shadowRoot.querySelectorAll('.scroll-text');

        this._resizeHandler = this.updateTitleScrolling.bind(this);
    }

    async connectedCallback() {
        this.videoProps = await (await fetch(`http://${location.hostname}:8081/get-video-props`)).json();

        this.setAttribute('title', this.videoProps.filename);
        this.isPlaying = !this.videoProps.isPlaying;
        
        this.shadowRoot.getElementById('play').onclick = () => this.mpvPlay();

        this.updateTitle();
        this.updateTitleScrolling();
        window.addEventListener('resize', this._resizeHandler);
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this._resizeHandler);
    }

    async mpvPlay() {
        await fetch(`http://${location.hostname}:8081/play`);
        // cycle "isplaying" variable
        this.isPlaying = !this.isPlaying;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'title') {
            this.updateTitle();
        }
    }

    updateTitle() {
        const title = this.getAttribute('title') || '';
        this.spans.forEach(span => span.textContent = title);
        this.updateTitleScrolling();
    }
    updateTitleScrolling() {
        if (this.spans.length < 2) return;

        const containerWidth = this.titleElement.clientWidth;
        const textWidth = this.spans[0].scrollWidth;

        if (textWidth > containerWidth) {
            // Show both spans for scrolling
            this.spans.forEach(span => {
                span.style.display = 'inline-block';
                span.style.setProperty('--scroll-width', `${textWidth}px`);
                span.style.animation = `scroll-text ${textWidth / 15}s linear infinite`; // px/s
            });
        } else {
            // Show only first span, hide second and reset animation
            this.spans[0].style.display = 'inline-block';
            this.spans[0].style.animation = 'none';
            this.spans[0].style.transform = 'translateX(0)';

            this.spans[1].style.display = 'none';
            this.spans[1].style.animation = 'none';
            this.spans[1].style.transform = 'translateX(0)';
        }
    }
}

customElements.define("my-player", Player);

