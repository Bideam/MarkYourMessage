var crypto=require('crypto');
var mongoose=require('mongoose'),
	User=mongoose.model('User');
var Post=require('../models/post');
var multer=require('multer');
var f_name;
var Storage=multer.diskStorage({
	destination:function(req,file,callback){
		callback(null,'./static/images');
	},
	filename:function(req,file,callback){
		f_name=file.originalname;
		callback(null,file.originalname);
		
	}
});
var upload = multer({ storage: Storage }).array("picture", 3); //Field name and max count

function hashPW(pwd){
	return crypto.createHash('sha256').update(pwd).digest('base64').toString();
}

exports.signup=function(req,res){
	User.findOne({username:req.body.username})
	.exec(function(err,user){
		if (!user) {
			var user=new User({username:req.body.username});
			user.set('hashed_password',hashPW(req.body.password));
			user.set('email',req.body.email);
			user.save(function(err){
				if (err) {
					res.session.error=err;
					res.redirect('/signup');
				}else{
					req.session.user=user.id;
					req.session.username=user.username;
					req.session.msg='Authenticated as '+user.username;
					res.redirect('/');
				}
			});
		}else{
			err='用户已经存在';

		}
		if(err){req.session.msg=err;}
	})
	
};
exports.login=function(req,res){
	User.findOne({username:req.body.username})
	.exec(function(err,user){
		if (!user) {
			err='未发现用户'
		}else if(user.hashed_password=== hashPW(req.body.password.toString())){
			req.session.regenerate(function(){
				req.session.user=user.id;
				req.session.username=user.username;
				req.session.msg='Authenticated as ' + user.username;
				res.redirect('/');
			});
		}else{
			err='密码错误';
		}
		if (err) {
			req.session.regenerate(function(){
				req.session.msg=err;
				res.redirect('/login');
			});
		}
	});
};
exports.getUserProfile=function(req,res){
	User.findOne({_id:req.session.user})
	.exec(function(err,user){
		if (!user) {
			res.json(404,{err:'User Not Found'});
		}else{
			res.json(user);
		}
	});
};
exports.updateUser=function(req,res){
	User.findOne({_id:req.session.user})
	.exec(function(err,user){
		user.set('email',req.body.email);
		user.set('color',req.body.color);
		user.save(function(err){
			if (err) {
				req.session.error=err;
			}else{
				req.session.msg='User Updata';
			}
			res.redirect('/user');
		});
	});
};

exports.deleteUser=function(req,res){
	User.findOne({_id:req.session.user})
	.exec(function(err,user){
		if (user) {
			user.remove(function(err){
				if (err) {
					req.session.msg=err;
				}
				req.session.destory(function(){
					res.redirect('/login');
				});
			});
		}else{
			req.session.msg='User Not Found';
			req.session.destory(function(){
				res.redirect('/login');
			});
		}
	});
};

exports.updatePost=function(req,res){
	var post=new Post(req.session.username,req.body.title,req.body.post,req.body.lat,req.body.lon);
	post.save(function(err){
		if (err) {
			req.session.msg=err;
			res.redirect('/');
		}else{
			
			req.session.msg='保存数据成功';
			res.redirect('/');
		}
	});
};

exports.getuserPost=function(req,res){
	Post.get(req.session.username,function(err,posts){
		if (err) {
			posts={};
			res.json(404,{err:'内容获取失败'});
		}else{
			res.json(posts);
		}
	}); 
};

exports.getallPost=function(req,res){
	Post.get(null,function(err,posts){
		if (err) {
			posts={};
			res.json(404,{err:'内容获取失败'});
		}else{
			res.json(posts);
		}
	});

};
exports.upimg=function(req,res){
	upload(req,res,function(err){
		if (err) {
			res.send("上传图片失败");
		}
		req.session.msg='仅上传图片成功'
	});
		/*
		var patharray=req.files.file.path.split("\\");
		res.send(patharray[patharray.length-1]);
		res.send("上传图片成功");
		console.log(req.body.img);
		res.send('chenggong ');*/
		User.findOne({_id:req.session.user})
		.exec(function(err,user){
			user.set('img',f_name);
			user.save(function(err){
				if (err) {
					res.sessor.error=err;
				}else{
					req.session.msg='保存图片成功';
					res.redirect('/');
				}
			});
		});
	
	}

exports.timedata=function(req,res){
	Post.gettime(req.query.t,function(err,posts){
	
		if (err) {
			posts={};
			res.json(404,{err:'内容获取失败'});
		}else{
			
			res.json(posts);
		}
	})
}