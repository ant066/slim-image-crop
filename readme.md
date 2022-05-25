#### Install

```
npm i slim-image-crop
yarn add slim-image-crop
```

#### Apply:

```
const editor = new Editor("#editor");

const url = "https://www.elle.vn/wp-content/uploads/2019/03/20/elle-viet-nam-phong-cach-thoi-trang-jisoo-Blackpink-2.png";
editor.draw(url2);
editor.setCropRatio(3/4);
editor.getCrop() // it will return base64 image

```
