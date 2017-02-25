
var React = require('../../node_modules/react/react.js');
var ReactDOM = require('../../node_modules/react-dom/index.js');

import Gallery from './jsx/gallery.jsx';

//获取图片相关的数据，
var imageDatas = require('../data/imageData.json');


//将图片名称转变成图片路径
imageDatas = (function getImageURL(imageDatas){
	for(var i=0 ;i < imageDatas.length; i++){
		var singleImage = imageDatas[i];
		singleImage.imageURL = './images/' + singleImage.fileName;
		imageDatas[i] = singleImage;
	}
	return imageDatas;
})(imageDatas);

ReactDOM.render(<Gallery imageDatas={imageDatas} />,document.getElementById('main'));
