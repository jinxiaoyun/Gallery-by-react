class ItemSales extends React.Component{
	render(){
		let discountModel = this.props.discountModel,	
			type = discountModel.isTip,
			msg = discountModel.saleTitle,
			vip = discountModel.isVipOnly,
			iClass = 'sale-icon';
			if (vip == "true") {
				iClass='sale-icon vip';
				type = "vip";
			} //判断是否而为会员商品

          return (
			<div className="item-sale">
						 <span className="title">促销:</span>
	           <p className="sale-info">
	           <i className ={iClass} style = {{backgroundSize:'contain'}}>{type}</i>
	           <span>{msg}</span></p> 
            </div>
		)

	}
}
export default ItemSales