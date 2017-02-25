var React = require('../../../node_modules/react/react.js');
var ReactDOM = require('../../../node_modules/react-dom/index.js');

class ImgFigure extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		var styleObj={};
		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}

		return(
			<figure className="img-figure" style={styleObj}>
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
			</figure>);
	}
}

export default ImgFigure;

