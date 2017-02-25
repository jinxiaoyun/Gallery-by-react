/**
 * Created by ziyu on 16/4/7.
 */
import fly from '../../components/fly.js';
import LazyLoad from 'react-lazy-load';
import filter from './../../components/filter';
import utils from './../../components/utils';
import UpdateCart from './../../index/UpdateCart';
import popup from './../../components/popup';

const ListItem = React.createClass({
  getInitialState() {
    return {
      item: null
    };
  },
  componentWillMount() {
    this.setState({
      item: this.props.item
    });
  },
  componentDidMount() {
    this.setState({
      item: this.state.item
    });
  },

  defaultImg(e){
    e.target.setAttribute('src', 'http://img001.meitianhui.com/public/images/e1/9a/0c/700f8aefd34d5d9e37a01dbbd0c0d174ab476a41.png');
  },
  clickName(e){
    e.stopPropagation();
    var shopUrl = "http://hyd.meitianhui.com/wap/hyd/list?shopId=" + this.state.item.shopId;
    self.location = shopUrl;
  },
  // 退换标签显示
  switchType() {
    var { canReturn } = this.state.item;
    var dom = '';
    switch(canReturn) {
      case 1:
        // 可退换
        dom = <img src="http://img001.meitianhui.com/public/images/c6/cf/c1/449358e5ded80c2f2e58aea2c67e886bb2451b7d.png" />
        break;
      case 2:
        // 可退
        dom = <img src="http://img001.meitianhui.com/public/images/21/d5/32/a246f59e94e47b5e6e33a768d05638b23ef46fb6.png" />
        break;
      case 3:
        // 可换
        dom = <img src="http://img001.meitianhui.com/public/images/27/b7/b6/3f8d40bfa95eb7d802063376f314371f0c84642e.png" />
        break;
      case 4:
        // 不退换
        dom = <img src="http://img001.meitianhui.com/public/images/a4/67/f1/e64dc6328548751ed2e32af03486feae5aa4cd69.png" />
        break;
      default:
        dom = ''
        break;
    }
    return dom;
  },
  // 禁用 `ajaxStart` 、`ajaxStop` 事件
  forbiddenAjaxEvent() {
    $(document).off('ajaxStart');
    $(document).off('ajaxStop');
  },
  // 启用 `ajaxStart` 、`ajaxStop` 事件
  startAjaxEvent() {
    $(document).on("ajaxStart",function(){
      popup.loading.show();
    });
    $(document).on("ajaxStop",function(){
      popup.loading.hide();
    });
  },
  // 加入购物车动画
  _flyAnimate(startPosi, endPosi, callback) {
    var $source = $('<div class="handle-item-add"></div>');
    $source.fly({
      start : startPosi,
      end : endPosi,
      onEnd : function() {
        this.destroy();
        if(typeof callback !== 'undefined') {
          callback();
        }
      }
    });
  },
  // 加入购物车 tip 由于这里有加购动画，所以在子组件中重写该方法
  _ajaxAddCart(params, position) {
    var targetInfo = $('.cart').offset();
    var that = this;

    that.forbiddenAjaxEvent();

    $.ajax({
      url: window.hydWebDomain +  'wap/hyd/cart/add.json',
      type: 'post',
      data: params,
      dataType: 'json',
      complete: function() {
        that.startAjaxEvent();
      },
      success: function (json) {
        if(filter.status(json)){

          // 添加动画
          that._flyAnimate({
            left : position.clientX,
            top : position.clientY
          }, {
            top : $(window).height() - targetInfo.height / 2,
            left : targetInfo.left + targetInfo.width / 2
          }, function() {
            if(json.data.cartCount > 999) {
              // 样式改版添加, 顶部通栏采购单
              $('.header-box').find('.order-num').css('line-height', '5px').html('999+');
              // 侧边采购单
              $('.to-cart .num p').text('999+');
              // 样式改版添加, 顶部通栏采购单
              $('.J_headerWrap').find('.order-num').html('999+');
              //更新H5的采购单的数量，
              $('.index-footer-bar').find('.cart-num').html('999+');
            } else {
              // 样式改版添加, 顶部通栏采购单
              $('.header-box').find('.order-num').css('line-height', 'auto').html(json.data.cartCount);
              // 侧边采购单
              $('.to-cart .num p').text(json.data.cartCount);
              // 样式改版添加, 顶部通栏采购单
              $('.J_headerWrap').find('.order-num').html(json.data.cartCount);
              //更新H5的采购单的数量，
              $('.index-footer-bar').find('.cart-num').html(json.data.cartCount);
            }
          });

          // 向上传递购物车中该商品额数目，便于在弹层中取到，这里只是进行加一的操作
          that.props.upDateCartNum(params.itemId, params.quantity);

        }
      }.bind(this)
    });
  },
  // 加入购物车动画
  handleAddCart(e) {
    e.stopPropagation();
    var position = {
      clientX : e.clientX,
      clientY : e.clientY
    };

    var { baseNum, itemId, inCartNum, displayStore } = this.state.item;

    if(displayStore === '0') {
      popup.confirm({title:"提示",msg:`该商品库存不足`,cls:"dialog-alert"});
      return;
    }

    if(inCartNum !== 0) {
      this._ajaxAddCart({itemId : itemId, quantity : inCartNum + 1}, position);
    } else {
      this._ajaxAddCart({itemId : itemId, quantity : baseNum}, position);
    }

    
  },
  // 显示优惠列表 
  showLabels() {
    var { discountModelList } = this.props.item;
    var result = [];
    if(discountModelList && discountModelList !== '') {
      discountModelList.forEach((val) => {
        // discountType === 'ITEM' 为商品优惠、discountType === 'SHOP' 为店铺优惠 这里不添加
        if(val.discountType === 'ITEM') {
          if(val.isTip === '特' && val.isVipOnly === 'true') {
            result.push('HY');
          } else if(val.isTip === '赠') {
            result.push('Z');
          } else if(val.isTip === '减') {
            result.push('J');
          } else if(val.isTip === '特') {
            result.push('T');
          }
        }
      });
    }

    // 优惠标签显示去重
    result = utils.unique(result);

    return result.map((val) => (<li className={`tag ${val}`}></li>));
  },
  render() {
    var item = this.state.item;
    var typeFlag = this.switchType();
    var saleLabels = this.showLabels();

    return (
      <li>
        <div className="items" onClick={this.props.clickItem.bind(null,item)}>
          <div className="img-box">
            <LazyLoad height={110} offsetVertical={100}>
              <img onError={this.defaultImg} onUnload={this.defaultImg} src={ window.phpCdnDomain + item.mUrl} />
            </LazyLoad>
          </div>
          <div className="item-desc">
            <div className="item-title">
              {typeFlag}
              <span>{item.title}</span>
            </div>
            <ol className="item-labels clearfix">
              {saleLabels}
            </ol>
            <div className="item-spec">
              规格:<span>{item.spec}</span>
            </div>
            <div className="item-price total-price">
              <i>￥</i>
              <span>{Number(item.price).toFixed(2)}</span>
            </div>
            <div className="item-add-wrap" onClick={this.handleAddCart.bind(this)}>
              <div className="item-add J_addNum add-btn"></div>
            </div>  
          </div>

        </div>
      </li>
    );
  }
});

export default ListItem;
