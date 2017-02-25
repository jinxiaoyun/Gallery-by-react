const ProductHd = React.createClass({
    render: function(){
        return (
            <header className="hd clearfix ">
                <h1>{this.props.catName}</h1>
                <a href={this.props.catId} className="more clearfix">更多</a>
            </header>
        );
    }
});

export default ProductHd;