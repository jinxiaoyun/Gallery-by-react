/**
 * Created by ziyu on 16/4/6.
 */


import ProDialog from './ProDialog.jsx';
import ListItem from './ListItem.jsx';
import popup from '../../components/popup.js';
import UpdateCart from '../../index/UpdateCart';

const ProductList = React.createClass({
  getDefaultProps() {
    return {
      phpCdnDomain: window.phpCdnDomain
    };
  },
  getInitialState() {
    return {
      dataList: this.props.dataList
    };
  },
  updateItem(obj){
    for (let i = 0, len = this.state.dataList.length; i < len; i++) {
      if (this.state.dataList[i].skuId == obj.skuId) {
        $.extend(true, this.state.dataList[i], obj)
      }
    }
    this.setState({
      dataList: this.state.dataList
    });
  },
  createDialog(obj){
    var ele = document.getElementById('J_cartBar');
    if(ele) {
      ele.parentNode.removeChild(ele);
    }
    let bg = document.createElement('div');
    bg.className = 'pro-cart-box';
    bg.id = 'J_cartBar';


    document.body.appendChild(bg);

    // bg.addEventListener('touchstart', function(e){
    //     e.preventDefault();
    // }, false);

    let dialog = <ProDialog closeBox={this.closeBox.bind(this)} phpCdnDomain={this.props.phpCdnDomain}  item={obj} scrollTop={this.state.scrollTop} upDateCartNum={this.upDateCartNum.bind(this)} ajaxAddCart={this.ajaxAddCart.bind(this)}/>;
    ReactDOM.render(dialog,
      document.getElementById('J_cartBar')
    );
  },
  //关闭层
  closeBox:function() {
    let obj = document.getElementById('J_cartBar');
    document.body.removeChild(obj);

    $("html").removeClass("overflow-hide");
    $(".main").css("top",0);
    $("body")[0].scrollTop = $("html").attr("scrollTop");
  },
  clickItem(item){
    this.createDialog(item);
		let st = $("body")[0].scrollTop;
		$("html").addClass("overflow-hide").attr("scrollTop",st);
		$(".main").css("top",-(st));
  },

  // 商品数目更新
  upDateCartNum(itemId, quantity) {
    
    var upDateArray = this.state.dataList.map((val) => {
      if(itemId === val.itemId) {
        val.inCartNum = quantity;
      }
      return val;
    });

    this.setState({
      dataList : upDateArray
    });
  },
  // 加至购物车
  // `from` == 'fromBtn' || undefined 说明是否从弹层添加, 若是从弹层添加，则需要取消弹层
  ajaxAddCart(itemId, quantity, from) {

    var that = this;
    
    $.ajax({
      url: window.hydWebDomain +  'wap/hyd/cart/add.json',
      type: 'post',
      data: {
        itemId: itemId,
        quantity: quantity
      },
      dataType: 'json',
      success: function(json) {
        if(json.status === 300) {
          window.location = json.data.redirect;
        } else if(json.status !== 200) {
          popup.confirm({title:"提示",msg:json.msg,cls:"dialog-alert"});
          that.setState({
            dataList : that.state.dataList
          });
        } else if(json.status === 200) {
          // 更新native数量
          // UpdateCart.updateNativeCart(json.data.cartItemNum);
          if(json.data.cartCount > 999) {
            // 更新顶部购物单
            $('.header-box').find('.order-num').css('line-height', '5px').html('999+');
            // 如果不是react头部也要更新数量, 侧边购物单
            $('.to-cart .num p').text('999+');
            // 更新顶部购物单
            $('.J_headerWrap').find('.order-num').html('999+');
            //更新H5的采购单的数量，
            $('.index-footer-bar').find('.cart-num').html('999+');
          } else {
            $('.header-box').find('.order-num').css('line-height', 'auto').html(json.data.cartCount);
            // 如果不是react头部也要更新数量 , 侧边购物单
            $('.to-cart .num p').text(json.data.cartCount);
            // 更新顶部购物单
            $('.J_headerWrap').find('.order-num').html(json.data.cartCount);
            //更新H5的采购单的数量
            $('.index-footer-bar').find('.cart-num').html(json.data.cartCount);
          }
          
          that.upDateCartNum(itemId, quantity);

          if(from === 'fromBtn') {
            that.closeBox();
          }
        }
      },
      error: function(e) {
        that.setState({
          dataList : that.state.dataList
        });
      }
    });
    
  },

  render() {
    let listItems = this.state.dataList.map((item, idx)=> {
      return ( <ListItem phpCdnDomain={this.props.phpCdnDomain} key={idx} clickItem={this.clickItem.bind(this, item)} item={item} upDateCartNum={this.upDateCartNum.bind(this)} />);
    });

    return (
      <section className="bd">
        <ul className="clearfix">
          {listItems}
        </ul>
      </section>
    );
  }
});

export default ProductList;
