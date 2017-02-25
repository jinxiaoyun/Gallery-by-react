var UpdateCart = {
  updateNativeCart: function(num){
    if(typeof cartNum == 'undefined'){
      return false;
    }
    setTimeout(function() {

         var urlJson = {
           "action": "hydItemsNum"
           };
          urlJson["params"] = {"num": num};

          urlJson["callback"] = '';
          var url = "hgj://operation?" + encodeURIComponent(JSON.stringify(urlJson));
           var gapBridge = document.createElement("iframe");
           gapBridge.setAttribute("style", "display:none;");
           gapBridge.setAttribute("height", "0px");
           gapBridge.setAttribute("width", "0px");
           gapBridge.setAttribute("frameborder", "0");
           gapBridge.setAttribute("id", "f");
           document.documentElement.appendChild(gapBridge);
           gapBridge.src = url;

     }, 20);
  }
};

module.exports = UpdateCart;
