import ItemSales from './ItemSalesIndex.jsx';
/*
** @组件：促销列表
** @描述：Item子组件。
*/ 

class ItemSalesList extends React.Component {
	render() {
		let discountModelList = this.props.discountModelList,
			sales = [];
		$.each(discountModelList,function(index,discountModel){
			// if(discountModel){
				let salesProps = {
					key:index,
					index:index,
					discountModel: discountModel
				}
				sales.push(<ItemSales {...salesProps} />)
			// }
		})
		return (
			<div className="sales-list-main">
				{sales}
			</div>
		);
	}
}

export default ItemSalesList;