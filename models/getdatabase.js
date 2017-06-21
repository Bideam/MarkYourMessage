var Db=require('mongodb').Db,
	Connection=require('mongodb').Connection,
	Server=require('mongodb').Server,
	settings={
	cookieSecret:'SECRET',
	db:'myapp',
	host:'localhost',
	port:'27017'
};

var geted;
geted=new Db(settings.db,new Server(settings.host,settings.port),{safe:true});
geted.open(function(err,db){
	if (err) {
		console.log(err);
		retrun;
	}
	console.log("连接成功");
	db.collection("posts",function(err,collection){
		var query="2017-05-24";

		//query.time.day="2017-5-20";
		collection.find({"time.day":query}).sort({
			time:-1
		}).toArray(function(err,docs){
			geted.close();
			if (err) {
				console.log("查询失败原因:"+err);
				return ;

			}
			console.log(docs[0].post);

		})
	})
})