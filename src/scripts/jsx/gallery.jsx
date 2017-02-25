var React = require('../../../node_modules/react/react.js');
var ReactDOM = require('../../../node_modules/react-dom/index.js');

import ImgFigure from './imgFigure.jsx';

class Gallery extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			imgsArrangeArr:[]
		}


		this.constant = {
			centerPos:{
				left:0,
				right:0
			},
			hPosRange:{//水平方向取值
				leftSecX:[0,0],
				rightSecX:[0,0],
				y:[0,0]
			},
			vPosRange:{//垂直方向取值
				x:[0,0],
				topY:[0,0]
			}
		}
	}
	/*
	*获取区间的随机值
	*
	*/
	getRandomRange(low,height){
		return Math.ceil(Math.random()*(height-low)+low);
	}


	componentDidMount(){
		//获取到整个舞台的大小
		var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
				stageW = stageDOM.scrollWidth,
				stageH = stageDOM.scrollHeight,
				halfStageW = Math.ceil(stageW/2),
				halfStageH = Math.ceil(stageH/2);

		//获取到一个图片的大小
		var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFig0),
				imgW = imgFigureDOM.scrollWidth,
				imgH = imgFigureDOM.scrollHeight,
				halfImgW = Math.ceil(imgW/2),
				halfImgH = Math.ceil(imgH/2);


		this.constant.centerPos.left = halfStageW - halfImgW;
		this.constant.centerPos.top = halfStageH - halfImgH;

		this.constant.hPosRange.leftSecX[0] = -halfImgW;
		this.constant.hPosRange.leftSecX[1] = halfStageW-halfImgW*3;
		this.constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.constant.hPosRange.rightSecX[1] = stageW-halfImgW;
		this.constant.hPosRange.y[0] = -halfImgH;
		this.constant.hPosRange.y[1] = stageH-halfImgH;

		this.constant.vPosRange.x[0] = halfStageW-imgW;
		this.constant.vPosRange.x[1] = halfStageW;
		this.constant.vPosRange.topY[0] = -halfImgH;
		this.constant.vPosRange.topY[1] = halfStageH-halfImgH*3;

		this.rearrange(0);
	}

	//重新排布函数
	rearrange(centerIndex){
		var imgsArrangeArr = this.state.imgsArrangeArr,
				constant = this.constant,
				centerPos = constant.centerPos,
				hPosRange = constant.hPosRange,
				vPosRange = constant.vPosRange,
				hPosRangeLeftSecX = hPosRange.leftSecX,
				hPosRangeRightSecX = hPosRange.rightSecX,
				hPosRangeY = hPosRange.y,
				vPosRangeTopY = vPosRange.topY,
				vPosRangeX = vPosRange.x,

				imgsArrangeTopArr = [],
				topImgNum = Math.ceil(Math.random()*2),//取一个或者不取
				topImgSpliceIndex = 0,

				imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);//中间取一个图片

				//首先居中centerIndex的图片
				imgsArrangeCenterArr[0].pos = centerPos;

				//取出要布局上侧的状态信息
				topImgSpliceIndex = Math.ceil(Math.random()*(imgsArrangeArr.length - topImgNum));
				imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);


				//布局位于上侧的图片
				imgsArrangeTopArr.forEach(function(value,index){
					imgsArrangeTopArr[index].pos ={
						top:this.getRandomRange(vPosRangeTopY[0],vPosRangeTopY[1]),
						left:this.getRandomRange(vPosRangeX[0],vPosRangeX[1])
					}
				}.bind(this))

				//布局左右两侧的图片

				for(var i = 0 , j = imgsArrangeArr.length,k = j/2; i < j; i++){
						var hPosRangeLORX = null;
						//前半部分布局在左边，右半部分布局在右边
						if (i<k) {
							hPosRangeLORX = hPosRangeLeftSecX;
						}else{
							hPosRangeLORX = hPosRangeRightSecX;
						}

						imgsArrangeArr[i].pos = {
							top:this.getRandomRange(hPosRangeY[0],hPosRangeY[1]),
							left:this.getRandomRange(hPosRangeLORX[0],hPosRangeLORX[1])
						}
				}

				if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
					imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0])
				}
				imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

				this.setState({
					imgsArrangeArr:imgsArrangeArr
				});
	}


	render(){
		var controllerUnits = [],
				imgFigures = [];

		this.props.imageDatas.forEach(function(value,index){
			if (!this.state.imgsArrangeArr[index]) {
				this.state.imgsArrangeArr[index] = {
					pos:{
						left:0,
						top:0
					}
				}
			}
			imgFigures.push(<ImgFigure data={value} key={index} ref={'imgFig' + index}
			arrange = {this.state.imgsArrangeArr[index]}/>)

		}.bind(this))

		return(
			<section className="stage" ref="stage">
				<section className="img-sec">
					{imgFigures}
				</section>
				<nav className="control-nav">
					{controllerUnits}
				</nav>
			</section>);
	}
}

export default Gallery;