/**
 * Created by ziyu on 16/4/6.
 */

import popup from './../../components/popup';
import filter from './../../components/filter';
import UpdateCart from './../../index/UpdateCart';
import ItemSalesList from './ItemSalesListIndex.jsx';

// =============================================================
import Commodity from '../common/commodityModel.jsx';
import indexDataAdapter from './adapter.js';
import DoItemFooter from '../common/commodifyModel/commodifyButton.jsx';

const Mb = React.createClass({

    clickBoxT:function(){
      this.props.closeBox();//这里去掉参数 this.props.item,false
    },
    render:function() {
      return (
        <div className="pro-mb" onClick={this.clickBoxT}></div>
      );
    }
});

const ProDialog = React.createClass({
  getInitialState() {
    return {
      quantity: this.props.item.baseNum
    }
  },
  ajaxAddCart(itemId, quantity, from) {
    this.props.ajaxAddCart(itemId, quantity, from);
  },
  render() {
    var item = this.props.item;

    var commodityInfo = {
      displayStore : parseInt(item.displayStore, 10),
      valid : true,
      mUrl : item.mUrl,
      title : item.title,
      spec : item.spec,
      quantity : item.inCartNum || 0, // 商品数量
      price : item.price,
      minOrder : item.baseNum,
      delPrice : item.oldPrice,
      shopName : item.shopName,
      shopId : item.shopId,
      itemId : item.itemId,
      canReturn : item.canReturn,
      detailInfo : {
        displayStore : parseInt(item.displayStore, 10),
        soldQuantity : 1,
        valid : true,
        suggestPrice : item.suggestPrice,
        productDate : item.productDate,
        origin : item.origin,
        maker : item.maker,
        minOrder : item.baseNum,
        //des : (typeof item.des !== 'undefined' && item.des !== ''),
        des:item.des,
        guaranteePeriod : item.guarantee_period,
        basePrice : item.basePrice // 商品起送金额
      },
      discountModelList : indexDataAdapter.saleAdapter(item.discountModelList, item)
    };

    return (
      <div className="pro-mb do-item">
        <Mb closeBox={this.props.closeBox}></Mb>
        <Commodity commodityInfo={commodityInfo} isShow={true} doShowDoItem={function() {}} phpCdnDomain={this.props.phpCdnDomain} ajaxAddCart={this.ajaxAddCart.bind(this)}/>
      </div>
    );
  }

});

export default ProDialog;
