import ProductHd from './ProductHd.jsx';
import ProductList from './ProductList.jsx';
const Pro = React.createClass({
    render() {
        let lists = this.props.data.map(function(cat, i){
            let link = '/wap/hyd/list?catIdLevel1=' + cat.catId;
            return (
                <div className="sale-bar" key={i}>
                    <ProductHd catName={cat.catName} key={i} catId={link} />
                    <ProductList dataList={cat.items} />
                </div>
            );
        });
        return (
            <div>{lists}</div>
        );
    }
});

export default Pro;