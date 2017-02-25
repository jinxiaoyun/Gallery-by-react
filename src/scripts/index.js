
var React = require('../../node_modules/react/react.js');
var ReactDOM = require('../../node_modules/react-dom/index.js');


//获取图片相关的数据，
var imageDatas = require('../data/imageData.json');


//将图片名称转变成图片路径
imageDatas = (function getImageURL(imageDatas){
	for(var i=0 ;i < imageDatas.length; i++){
		var singleImage = imageDatas[i];
		singleImage.imagelURL = '../images/' + singleImage.fileName;
		imageDatas[i] = singleImage;
	}
	return imageDatas;
})(imageDatas);

class Gallery extends React.Component{
	constructor(props){
		super(props);
	}
	render(){

		return(
			<section className="stage">
				<section className="img-sec"></section>
				<nav className="control-nav"></nav>
			</section>);
	}
}

ReactDOM.render(<Gallery imageDatas={imageDatas} />,document.getElementById('main'));
