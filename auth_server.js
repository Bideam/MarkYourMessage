var express=require('express');
var bodyParser=require('body-parser');
var cookieParser=require('cookie-parser');
var expressSession=require('express-session');
var mongoStore=require('connect-mongo')({session:expressSession});
var mongoose=require('mongoose');
//var multer=require('multer');
require('./models/users_model.js');
var settings=require('./settings');
var conn=mongoose.connect('mongodb://localhost/myapp');
var app=express();
app.engine('.html',require('ejs').__express);
app.set('views',__dirname+'/views');
app.set('view engine','html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
/*var Storage=multer.diskStorage({
	destination:function(req,file,callback){
		callback(null,'./static/images');
	},
	filename:function(req,file,callback){
		callback(null,file.fieldname+"_"+Date.now()+"_"+file.originalname);
	}
});
var upload = multer({ storage: Storage }).array("imgUploader", 3); //Field name and max count
*/
/*
app.use(multer({
	dest:'./static/images',
	rename:function(fieldname,filename){
		return filename;
	}
}));*/
app.use(cookieParser());
 
app.use(expressSession({
	secret:settings.cookieSecret,
	key:settings.db,
	cookie:{maxAge:60*60*1000*24*30},
	store:new mongoStore({
		db:settings.db,
		host:settings.host,
		port:settings.port
	})

}));
/*
app.use(expressSession({
	secret:'SECRET',
	cookie:{maxAge:60*60*1000},
	resave:true,
	saveUninitialized:true,
	store: new mongoStore({
		db:mongoose.connection.db,
		collection:'sessions',
	})
}));*/
require('./routes')(app);
app.listen(80,function(){
	console.log('正在监听：80');
});