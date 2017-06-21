var mongodb=require('./db');
function Post(name,title,post,lat,lon){
	this.name=name;
	this.title=title;
	this.post=post;
	this.lat=lat;
	this.lon=lon;
}
module.exports=Post;

Post.prototype.save=function(callback){
	var date=new Date();
	var month=date.getMonth()+1;
	if (month<10) {
		month='0'+month;
	}
	var time={
		data:date,
		year:date.getFullYear(),
		month:date.getFullYear()+"-"+month,
		day:date.getFullYear()+"-"+month+"-"+date.getDate(),
		minute:date.getFullYear()+"-"+month+"-"+date.getDate()+":"+date.getHours()+":"+(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes())
	}

	var post={
		name:this.name,
		time:time,
		title:this.title,
		post:this.post,
		lat:this.lat,
		lon:this.lon
	};

	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}

		db.collection('posts',function(err,collection){
			if (err) {
				mongodb.close();
				return callback(err);
			}

			collection.insert(post,{
				safe:true
			},function(err){
				mongodb.close();
				if (err) {
					return callback(err);
				}
				callback(null);
			});
		});
	});
};

Post.get=function(name,callback){
	mongodb.open(function(err,db){
		if (err) {
			return callback(err);
		}
		db.collection('posts',function(err,collection){
			if (err) {
				mongodb.close();
				return callback(err);
			}
			var query={};
			if (name) {
				query.name=name;
			}
			collection.find(query).sort({
				time:-1
			}).toArray(function(err,docs){
				mongodb.close();
				if (err) {
					return callback(err);
				}
				callback(null,docs);
			});
		});
	});
};
Post.gettime=function(day,callback){
	mongodb.open(function(err,db){
		if (err) {
			return callback(err);
		}
		db.collection('posts',function(err,collection){
			if (err) {
				mongodb.close();
				return callback(err);
			}
			
			if (day) {
				collection.find({"time.day":day}).sort({
					time:-1
				}).toArray(function(err,docs){
					mongodb.close();
					if (err) {
						return callback(err);
					}
					callback(null,docs);
				});
			}else{
				callback("没有输入日期");
			}
		});
	});	
}
