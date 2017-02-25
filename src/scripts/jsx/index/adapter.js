
var indexDataAdapter = {
	saleAdapter : function(discountModelList, item) {
		var result = [[/*会员*/], [/*特卖*/], [/*买赠*/], [/*满减*/]];

		if(typeof discountModelList === 'undefined' || discountModelList === '') {
			discountModelList = [];
		}

		discountModelList.forEach((value) => {
			// discountType === 'ITEM' 为商品优惠、discountType === 'SHOP' 为店铺优惠
			if(value.discountType === 'ITEM') {
				if(value.isTip === '特' && value.isVipOnly === 'true') {
					result[0].push({
						msgs : [value.saleTitle],
						tag : 'HY',
						repeat : false,
						calcPrice : true
					});
				} else if(value.isTip === '特') {
					result[1].push({
						msgs : [value.saleTitle],
						tag : 'T',
						repeat : false,
						calcPrice : !!(item.isAct && item.isAct !== "" && item.isAct === "特卖")
					});
				} else if(value.isTip === '赠') {
					result[2].push({
						msgs : [value.saleTitle],
						tag : 'Z',
						repeat : false,
						calcPrice : true
					});
				} else if(value.isTip === '减') {
					result[3].push({
						msgs : [value.saleTitle],
						tag : 'J',
						repeat : false,
						calcPrice : true
					});
				}
			}
		});

		return result.filter((value) => (value.length > 0));
	}
}

export default indexDataAdapter;