var mongoose=require('mongoose');
var Token=mongoose.model('Token');
var Stores=mongoose.model('Store');
var ScanCard=mongoose.model('ScanCard');

module.exports =  function(router) {
  router.route('/getToken').get(function(req,res) {
    Token.findOne(function(err,token) {
      if(err) throw err;
      res.set({ 'content-type': 'application/json; charset=utf-8' });
      res.json({success:true,message:"get latest token",data:{token:token.mytoken,timestamp:token.timestamp}}); 
    });
  });
  router.route('/getStoreInfo').get(function(req,res) {
    Stores.findOne(function(err,store) {
      if(err) throw err;
      res.set({ 'content-type': 'application/json; charset=utf-8' });
      res.json({success:true,message:"get store and coupon info",data:{store:store}}); 
    });
  });
  router.route('/getEvents').get(function(req,res) {
    // Events.findOne(function(err,token) {
    //   if(err) throw err;
      // var events=[{
      //   title:"换季积分活动",
      //   description:"here is the events details",
      //   rules:[
      //     "会员到店洗衣并大桶烘干30分钟1次即积1分。",
      //     "每积5分，即可兑换一张14kg洗衣加14kg烘干30分钟免费券。",
      //     "获赠洗烘有效期：2016年6月15日"
      //   ],
      //   timeperoid:"2016年3月1日至4月30日",
      //   qrcode:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3851013351,2699800874&fm=58",
      //   picture:"http://db.kimacloud.com/images/store.jpg"
      // },
      // {
      //   title:"‘推荐亲友，畅洗我衣’奖赏活动",
      //   description:"2016年春季来临，速比坤自助洗衣店酬宾活动现推出：会员推荐亲友，奖励丰富！",
      //   rules:["活动期间，现有会员只要推荐亲友成为新会员，并充值300元，即可与亲友一起获得免费洗烘券各一张，推荐越多，奖励越多！同时，充值300元即可送50元。"],
      //   timeperoid:"2016年3月1日至4月30日",
      //   qrcode:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3851013351,2699800874&fm=58",
      //   picture:"http://db.kimacloud.com/images/store.jpg"
      // }]
      var events=[
        "http://mpsonline.sqstore.net/images/events/newstore.png",
        "http://mpsonline.sqstore.net/images/events/softwash.png",
        "http://mpsonline.sqstore.net/images/events/family.png"
      ]
      res.json({success:true,message:"get latest events",data:{events:events}}); 
    // });
  });


  router.route('/scancard').post(function(req,res) {
    console.log(req.body.cardid,"-----",req.body.ipaddress);
    var tcard=new ScanCard({
      cardid: req.body.cardid,
      ipaddress:req.body.ipaddress
    });
    tcard.save(function(err) {
      if(err) throw err;
      res.send("ok");
    });
  });

  router.route('/getTargetCard').get(function(req,res) {
    ScanCard.findOne({},function(err,doc) {
      if(err) throw err;
      console.log('in the get');
      console.log(doc);
      if(doc){
        res.json({
          cardid:doc.cardid,
          ipaddress:doc.ipaddress,
          scanat:doc.scanat.getTime()
        });
      }    
    });
  });

  router.route('/getServiceCategories').get(function(req,res) {
    var serviceCategories=["洗涤","烘干","熨烫","精洗","去渍","代洗","上门收送"];
    res.json({success:true,message:"get service categories",data:serviceCategories});
  });


};

