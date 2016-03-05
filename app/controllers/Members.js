var mongoose = require('mongoose'),
	_ = require('underscore'),
    Members = mongoose.model('Member'),
    MemberCards = mongoose.model('MemberCard'),
    DepositRecords = mongoose.model('DepositRecord'),
    ExpenseRecords = mongoose.model('ExpenseRecord'),
    async = require('async');

//rest api functions
exports.apiNewMember=function(req,res) {
	var newMemberCard = new MemberCards(req.body.memberCard);
	var newMember = new Members(req.body.member);
	var depositRecord = new DepositRecords(req.body.depositRecord);

	var store = req.store._id;
	var depositCoupon=req.body.depositCoupon;
	

	newMember.card=newMemberCard._id;
	newMemberCard.member=newMember._id;
	newMemberCard.newDeposit=depositRecord.amount;
	newMemberCard.newGrant=depositRecord.grant;
	newMemberCard.balance=parseInt(depositRecord.amount)+parseInt(depositRecord.grant);
	newMemberCard.totalDeposit=depositRecord.amount;
	newMemberCard.totalGrant=depositRecord.grant;

	if(depositCoupon){
		newMemberCard.level=depositCoupon.remark;
		newMemberCard.expired=new Date(new Date().setFullYear(new Date().getFullYear() + 1));
	} else{
		newMemberCard.level="regular";
		newMemberCard.expired=new Date(new Date().setFullYear(new Date().getFullYear() + 5));
	}


	newMemberCard.depositRecords.push(depositRecord._id);
	depositRecord.memberCard=newMemberCard._id;
	depositRecord.store=store;
	depositRecord.depositCoupon=depositCoupon;
	async.parallel([
      function(callback) {
        newMember.save(function(err) {
        	callback();
        });
      },
      function(callback) {
        newMemberCard.save(function(err) {
        	callback();
        });
      },
      function(callback) {
        depositRecord.save(function(err) {
        	callback();
        });
      }
    ],function(err){
        if(err) throw err;
    	if(!err){
    		res.json({sucess:true,message:"New Member has been created successfully!"});
    	}
    });
};

exports.apiNewDeposit=function(req,res) {
	var memberCard = req.body.memberCard;
	var depositRecord = new DepositRecords(req.body.depositRecord);
	var store = req.store._id;
	var depositCoupon=req.body.depositCoupon;

	depositRecord.store=store;
	depositRecord.depositCoupon=depositCoupon;
	console.log(depositCoupon);
	var cardlevel=['regular','copper','silver','gold','diamond'];

	MemberCards.
		findOne({
			physicalId:memberCard.physicalId,
			cardId:memberCard.cardId,
			status:"inuse"
		}).
		exec(function(err,card) {
			depositRecord.memberCard=card._id;
			card.newDeposit=depositRecord.amount;
			card.newGrant=depositRecord.grant;
			card.balance+=parseInt(depositRecord.amount)+parseInt(depositRecord.grant);
			card.totalDeposit+=parseInt(depositRecord.amount);
			card.totalGrant+=parseInt(depositRecord.grant);
			card.depositRecords.push(depositRecord._id);

			if(depositCoupon){
				var remark=depositCoupon.remark;
				var existLevel=card.level;
				if(_.indexOf(cardlevel,remark>_.indexOf(cardlevel,existLevel))){
					card.level=remark;
					card.expired=new Date(new Date().setFullYear(new Date().getFullYear() + 1));
				}
			}
			async.parallel([
		      function(callback) {
		        card.save(function(err) {
		        	if(err) throw err;
		        	callback();
		        });
		      },
		      function(callback) {
		        depositRecord.save(function(err) {
		        	if(err) throw err;
		        	callback();
		        });
		      }
		    ],function(err){
		    	if(err){
		    		throw err;
		    	} else {
		    		res.json({sucess:true,message:"success deposit on card"});
		    	}
		    });
		});
};

exports.apiQueryCardInfo=function(req,res) {
	var memberCard = req.body.memberCard;
	MemberCards.
		findOne({
			physicalId:memberCard.physicalId,
			cardId:memberCard.cardId,
			status:"inuse"
		}).
		populate('member',"-_id name mobile").
		// populate({
		// 	path:'depositRecords',
		// 	model:'DepositRecord',
		// 	select:"-_id happendAt payway paylog amount grant depositCoupon store",
		// 	options:{limit:5,sort:'-happendAt'},
		// 	populate:{
		// 		path:'store',
		// 		model:"Store",
		// 		select:'storeCode storeName storeNameCN -_id'
		// 	}
		// }).
		populate({
			path:"expenseRecords",
			model:"ExpenseRecord",
			select:"-_id happendAt category amount balance",
			options:{limit:10,sort:'-happendAt'},
			populate:{
				path:'store',
				model:"Store",
				select:'storeCode storeName storeNameCN -_id'
			}
		}).
		select("-_id cardId balance newDeposit newGrant expired member expenseRecords level").
		// slice("expenseRecords",-10).
		exec(function(err,card) {
			if(err) throw err;
			res.json(card);
		});
};
