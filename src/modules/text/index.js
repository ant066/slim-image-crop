import "./text.scss";
import TEXT_IC from "../../assets/icon/text.svg";
import SAVE_IC from "../../assets/icon/save.svg";
import '@simonwep/pickr/dist/themes/classic.min.css';   // 'classic' theme
import Pickr from '@simonwep/pickr';
import { removeEl } from "../../utils/dom";

const DEFAULT_CONFIG = {
    icon: TEXT_IC,
    title: "Text",
    menu: true
};


class Text {
    constructor(editor, options = {}) {
        this.editor = editor;
        this.options = { ...DEFAULT_CONFIG, options };
        this.texts = [];
        this.textsElements = [];
        this.lastFocus;

        this.init = this._init.bind(this);
        this.action = this._action.bind(this);
        this.initEvents = this.initEvents.bind(this);
        this.createMenu = this._createMenu.bind(this);
        this.createText = this._createText.bind(this);
        this._applyTexts = this._applyTexts.bind(this);
        this.setLastFocus = this.setLastFocus.bind(this);
        this.createTextEl = this._createTextEl.bind(this);
        this.createColorPicker = this._createColorPicker.bind(this);
        this.initMoveBtn = this.initMoveBtn.bind(this)
        this.handleMoveBtnPos = this.handleMoveBtnPos.bind(this)


        this.init();
    }

    _init() {
        if (this.menu) return;
        this.menu = this.createMenu();
        this.createColorPicker();
        this.initEvents();
        this.initMoveBtn()
    }

    _action() {
        this.editor.canvasEl.style.cursor = 'text';
        this.editor.canvasEl.addEventListener('click', this.createText)
    }

    _createMenu() {
        const menu = document.createElement("div");
        menu.classList.add("spe-crop-menu");
        const html = `<div class="spe-text-menu">
                        <div class="spe-text-font-color" class="spe-text-font-color"></div>
                        <select name="font-size" id="font-size" class="spe-text-font-size">
                            <option value="30">30</option>
                            <option value="40">40</option>
                            <option value="50">50</option>
                            <option value="60">60</option>
                            <option value="70">70</option>
                            <option value="80">80</option>
                        </select>
                        <select name="font-family" id="font-family" class="spe-text-font-family">
                            <option value="Times New Roman">Times New Roman</option>
                        </select>
                        <div class="spe-text-save">${SAVE_IC}</div>
                    </div>
                    <div class="spe-text-item-list"></div>
                    `;

        menu.innerHTML = html;
        this.sizeSelect = menu.querySelector('.spe-text-font-size')
        this.fontSelect = menu.querySelector('.spe-text-font-family')
        this.itemsList = menu.querySelector('.spe-text-item-list')
        this.saveBtn = menu.querySelector('.spe-text-save')
        return menu;
    }

    initEvents() {
        this.sizeSelect.addEventListener('change', () => {
            if (this.lastFocus) this.lastFocus.style.fontSize = this.sizeSelect.value;
        });
        this.fontSelect.addEventListener('change', () => {
            if (this.lastFocus) this.lastFocus.style.fontFamily = this.fontSelect.value;
        })
        this.pickr.on('change', (color, instance) => {
            if (this.lastFocus) this.lastFocus.style.color = color.toHEXA().toString();
        });
        this.saveBtn.addEventListener('click', this._applyTexts)
    }

    _createColorPicker() {
        if (this.pickr) return this.pickr;
        this.colorPickerEl = this.menu.querySelector(".spe-text-font-color");
        this.pickr = Pickr.create({
            el: this.colorPickerEl,
            theme: 'classic', // or 'monolith', or 'nano'
            default: '#F44336',
            swatches: [
                'rgba(244, 67, 54, 1)',
                'rgba(233, 30, 99, 0.95)',
                'rgba(156, 39, 176, 0.9)',
                'rgba(103, 58, 183, 0.85)',
                'rgba(63, 81, 181, 0.8)',
                'rgba(33, 150, 243, 0.75)',
                'rgba(3, 169, 244, 0.7)',
                'rgba(0, 188, 212, 0.7)',
                'rgba(0, 150, 136, 0.75)',
                'rgba(76, 175, 80, 0.8)',
                'rgba(139, 195, 74, 0.85)',
                'rgba(205, 220, 57, 0.9)',
                'rgba(255, 235, 59, 0.95)',
                'rgba(255, 193, 7, 1)'
            ],

            components: {
                preview: true,
                opacity: true,
                hue: true,
                interaction: {
                    hex: true,
                    rgba: true,
                    hsla: true,
                    hsva: true,
                    cmyk: true,
                    input: true,
                    clear: true,
                    save: true
                }
            }
        });
        return this.pickr;
    }

    _createText(e) {
        const { clientX, clientY } = e;
        const data = {
            x: clientX,
            y: clientY,
            text: 'Type something',
            size: this.sizeSelect.value,
            font: this.fontSelect.value,
            color: this.pickr.getColor().toHEXA().toString()
        }

        const el = this.createTextEl(data)
        el.addEventListener('keyup', (e) => data.text = e.target.value);
        el.addEventListener('focus', () => this.setLastFocus(el));
        this.texts.push(data);
        this.itemsList.appendChild(el);
        el.select();
        el.focus();
    }

    setLastFocus(el) {
        if (this.lastFocus) this.lastFocus.style.borderWidth = '0px';
        this.lastFocus = el;
        this.lastFocus.style.borderWidth = '1px';
        this.handleMoveBtnPos();
    }

    initMoveBtn() {
        this.moveBtn = document.createElement('div');
        this.moveBtn.classList.add('pse-text-move-icon')
        this.moveBtn.style.display = 'none'
        this.moveBtn.addEventListener('mousedown', () => this.handleMouseMoveStart = true)
        document.addEventListener('mousemove', (e) => {
            if (this.handleMouseMoveStart) {
                const rect = this.lastFocus.getBoundingClientRect();
                const { clientX, clientY } = e;
                this.moveBtn.style.top = clientY + 'px';
                this.moveBtn.style.left = clientX + 'px';
                this.lastFocus.style.top = clientY + 15 + 'px';
                this.lastFocus.style.left = clientX - rect.width / 2 + 10 + 'px';
                document.addEventListener('mouseup', () => this.handleMouseMoveStart = false)
            }
        })
        this.menu.appendChild(this.moveBtn)
    }

    handleMoveBtnPos() {
        const rect = this.lastFocus.getBoundingClientRect();
        this.moveBtn.style.display = 'block';
        this.moveBtn.style.top = rect.top - 15 + 'px';
        this.moveBtn.style.left = rect.left + (rect.width / 2) - 5 + 'px';
        this.moveBtn.style.position = 'fixed';
    }

    _createTextEl(text) {
        const el = document.createElement('input');
        el.classList.add('spe-text-input');
        el.style.top = text.y;
        el.style.left = text.x;
        el.style.color = text.color;
        el.style.color = text.color;
        el.style.fontSize = text.size;
        el.style.fontFamily = text.font;

        el.value = text.text;
        return el;
    }

    _applyTexts() {
        const canvasRect = this.editor.canvasEl.getBoundingClientRect();
        const ratio = this.editor.canvasEl.height / canvasRect.height;
        [...this.itemsList.querySelectorAll('.spe-text-input')].forEach(text => {
            const rect = text.getBoundingClientRect();
            const style = window.getComputedStyle(text, null);
            const size = parseInt(style.getPropertyValue('font-size'), 10)

            const exacX = (rect.left - canvasRect.left) * ratio;
            const exacY = (rect.top - canvasRect.top - 2) * ratio;
            text.exacX = exacX;
            text.exacY = exacY + (size * ratio);
            this.editor.ctx.font = `${size * ratio}px ` + style.getPropertyValue('font-family')
            this.editor.ctx.fillStyle = style.getPropertyValue('color');
            this.editor.ctx.fillText(text.value, text.exacX, text.exacY);
            removeEl(text)
        });
        this.moveBtn.style.display = 'none'
    }
}
export default Text;