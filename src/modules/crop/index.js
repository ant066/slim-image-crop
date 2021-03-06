import "./crop.scss";
import CROP_IC from "../../assets/icon/crop.svg";
import CROP_FRAME_IC from "../../assets/icon/crop-frame.svg";
import SAVE_IC from "../../assets/icon/save.svg";

const DEFAULT_CONFIG = {
  icon: CROP_IC,
  title: "Crop",
  menu: true,
};

class Crop {
  constructor(editor, options = {}) {
    this.editor = editor;
    this.options = { ...DEFAULT_CONFIG, options };

    this.action = this._action.bind(this);
    this.initCropFrame = this._initCropFrame.bind(this);
    this.cropFrameMouseDownHandler = this._cropFrameMouseDownHandler.bind(this);
    this.cropFrameMouseMoveHandler = this._cropFrameMouseMoveHandler.bind(this);
    this.cropFrameMouseUpHandler = this._cropFrameMouseUpHandler.bind(this);
    this.setCropFramePosition = this.setCropFramePosition.bind(this);
    this.setCropFrameSize = this.setCropFrameSize.bind(this);
    this.resizeMouseDownHandler = this.resizeMouseDownHandler.bind(this);
    this.resizeMouseMoveHandler = this.resizeMouseMoveHandler.bind(this);
    this.resizeMouseUpHandler = this.resizeMouseUpHandler.bind(this);
    this.cropAction = this.cropAction.bind(this);
    this.getCrop = this.getCrop.bind(this);
  }

  _action() {
    this.initCropFrame();
  }

  _initCropFrame(ratio = null) {
    this.ratio = ratio;
    const rect = this.editor.canvasEl.getBoundingClientRect();

    const { left, top, bottom, right, height, width } = rect;

    if (!this.cropFrame) {
      this.cropFrame = document.createElement("div");
      this.cropFrame.classList.add("spe-crop-frame");
      this.cropFrame.addEventListener(
        "mousedown",
        this.cropFrameMouseDownHandler
      );
      this.cropFrame.addEventListener(
        "mousemove",
        this.cropFrameMouseMoveHandler
      );
      this.cropFrame.addEventListener("mouseup", this.cropFrameMouseUpHandler);
      this.cropFrame.addEventListener("mouseout", this.cropFrameMouseUpHandler);

      this.cropFrame.innerHTML = `<div class="spe-frame-resize spe-frame-tl" data-value="TL"></div>
                                            <div class="spe-frame-resize spe-frame-tr" data-value="TR"></div>
                                            <div class="spe-frame-resize spe-frame-bl" data-value="BL"></div>
                                            <div class="spe-frame-resize spe-frame-br" data-value="BR"></div>`;

      const resizeItems =
        this.cropFrame.getElementsByClassName("spe-frame-resize");
      [...resizeItems].forEach((item) => {
        item.addEventListener("mousedown", this.resizeMouseDownHandler);
      });
      console.log(editor);
      editor.appendChild(this.cropFrame);
    }

    let cropWidth = width / 2;
    let cropHeight = ratio ? cropWidth * ratio : height / 2;

    if (cropHeight > height) {
      cropHeight = height;
      if (ratio) cropWidth = cropHeight / ratio;
    } else {
      if (cropWidth > width) {
        cropWidth = width;
        if (ratio) cropHeight = cropWidth * ratio;
      }
    }

    this.setCropFrameSize(cropWidth, cropHeight);
    this.setCropFramePosition(
      (left + right - cropWidth) / 2,
      (top + bottom - cropHeight) / 2
    );
  }

  _cropFrameMouseDownHandler(e) {
    this.isMoving = true;
    const { clientX, clientY } = e;
    this.clientX = clientX;
    this.clientY = clientY;
    this.oldX = parseInt(this.cropFrame.style.left, 10);
    this.oldY = parseInt(this.cropFrame.style.top, 10);
  }

  _cropFrameMouseMoveHandler(e) {
    if (this.isMoving) {
      e.preventDefault();
      const { clientX, clientY } = e;

      const distantX = clientX - this.clientX;
      const distantY = clientY - this.clientY;

      const newX = this.oldX + distantX;
      const newY = this.oldY + distantY;
      this.setCropFramePosition(newX, newY);
    }
  }
  _cropFrameMouseUpHandler() {
    this.isMoving = false;
  }

  setCropFramePosition(x, y) {
    const rect = this.editor.canvasEl.getBoundingClientRect();
    const { left, top, bottom, right } = rect;

    const cropFrameWidth = parseInt(this.cropFrame.style.width, 10);
    const cropFrameHeight = parseInt(this.cropFrame.style.height, 10);

    if (x < left) x = left;
    if (y < top) y = top;
    if (x + cropFrameWidth > right) x = right - cropFrameWidth;
    if (y + cropFrameHeight > bottom) y = bottom - cropFrameHeight;

    this.cropFrame.style.top = y;
    this.cropFrame.style.left = x;
  }

  setCropFrameSize(w, h) {
    this.cropFrame.style.width = w;
    this.cropFrame.style.height = h;
  }

  resizeMouseDownHandler(e) {
    e.stopPropagation();
    e.preventDefault();
    const target = e.target;
    this.resizeDirection = target.getAttribute("data-value");

    const rect = this.cropFrame.getBoundingClientRect();
    const { left, top, bottom, right, width, height } = rect;

    this.oldWidth = width;
    this.oldHeight = height;
    this.oldLeft = left;
    this.oldTop = top;
    this.oldBottom = bottom;
    this.oldRight = right;
    document.addEventListener("mousemove", this.resizeMouseMoveHandler);
    document.addEventListener("mouseup", this.resizeMouseUpHandler);
  }
  resizeMouseMoveHandler(e) {
    if (!this.resizeDirection) return;
    const { clientX, clientY } = e;
    let newWidth, newHeight, newTop, newLeft;
    switch (this.resizeDirection) {
      case "TL": {
        newWidth = this.oldWidth - (clientX - this.oldLeft);
        newHeight = this.oldHeight - (clientY - this.oldTop);
        newTop = clientY;
        newLeft = clientX;
        // if (this.ratio) {
        //     newHeight = newWidth * this.ratio;
        //     this.setCropFrameSize(newWidth, newHeight)
        //     this.cropFrame.style.right = this.oldLeft;
        //     this.cropFrame.style.bottom = this.oldTop;
        //     this.cropFrame.style.top = 'initial';
        //     this.cropFrame.style.left = 'initial';
        //     return;
        // }
        break;
      }
      case "TR": {
        newWidth = this.oldWidth + (clientX - this.oldRight);
        newHeight = this.oldHeight - (clientY - this.oldTop);
        newTop = clientY;
        newLeft = this.oldLeft;
        // if (this.ratio) {
        //     newHeight = newWidth * this.ratio;
        //     this.setCropFrameSize(newWidth, newHeight)
        //     this.cropFrame.style.left = this.oldLeft;
        //     this.cropFrame.style.bottom = this.oldTop;
        //     // this.cropFrame.style.right = 'initial';
        //     // this.cropFrame.style.top = 'initial';

        //     return;
        // }
        break;
      }
      case "BR": {
        newWidth = this.oldWidth + (clientX - this.oldRight);
        newHeight = this.oldHeight + (clientY - this.oldBottom);
        newTop = this.oldTop;
        newLeft = this.oldLeft;
        // if (this.ratio) {
        //     newHeight = newWidth * this.ratio;
        //     this.setCropFrameSize(newWidth, newHeight)
        //     this.cropFrame.style.top = this.oldTop;
        //     this.cropFrame.style.left = this.oldLeft
        //     // this.cropFrame.style.right = 'initial'
        //     // this.cropFrame.style.bottom = 'initial'
        //     return;
        // }
        break;
      }
      case "BL": {
        newWidth = this.oldWidth - (clientX - this.oldLeft);
        newHeight = this.oldHeight + (clientY - this.oldBottom);
        newTop = this.oldTop;
        newLeft = clientX;
        // if (this.ratio) {
        //     newHeight = newWidth * this.ratio;
        //     this.setCropFrameSize(newWidth, newHeight)
        //     this.cropFrame.style.top = this.oldTop;
        //     this.cropFrame.style.right = this.oldLeft;
        //     // this.cropFrame.style.left = 'initial';
        //     // this.cropFrame.style.bottom = 'initial';
        //     return;
        // }
        break;
      }
    }
    if (newHeight < 0 || newWidth < 0) return;
    this.setCropFrameSize(newWidth, newHeight);
    this.setCropFramePosition(newLeft, newTop);
  }
  resizeMouseUpHandler(e) {
    this.resizeDirection = null;
    document.removeEventListener("mousemove", this.resizeMouseMoveHandler);
    document.removeEventListener("mouseup", this.resizeMouseUpHandler);
  }

  cropAction() {
    const rect = this.cropFrame.getBoundingClientRect();
    const { left, top, bottom, right, width, height } = rect;
    const { left: canvasLeft, top: canvasTop } =
      this.editor.canvasEl.getBoundingClientRect();

    const x = left - canvasLeft;
    const y = top - canvasTop;

    const base64 = cropCanvas(this.editor.canvasEl, x, y, width, height);
    return this.editor.draw(base64);
  }

  getCrop() {
    const rect = this.cropFrame.getBoundingClientRect();
    const { left, top, bottom, right, width, height } = rect;
    const { left: canvasLeft, top: canvasTop } =
      this.editor.canvasEl.getBoundingClientRect();

    const x = left - canvasLeft;
    const y = top - canvasTop;

    const base64 = cropCanvas(this.editor.canvasEl, x, y, width, height);
    return base64;
  }
}
export default Crop;

const cropCanvas = (sourceCanvas, left, top, width, height) => {
  let destCanvas = document.createElement("canvas");
  destCanvas.setAttribute("crossOrigin", "Anonymous");

  destCanvas.width = width;
  destCanvas.height = height;
  destCanvas
    .getContext("2d")
    .drawImage(sourceCanvas, left, top, width, height, 0, 0, width, height);
  return destCanvas.toDataURL("image/png");
};
