var express=require('express');
var multer=require('multer');
var bodyParser=require('body-parser');
var app=express();
app.use(bodyParser.json());
var Storage=multer.diskStorage({
	destination:function(req,file,callback){
		callback(null,"./static/images");
	},
	filename:function(req,file,callback){
		callback(null,file.fieldname+"_"+Date.now()+"_"+file.originalname)
	}
});

var upload=multer({storage:Storage}).array("picture",3); //field name and max count

app.get("/",function(req,res){
	res.sendFile(__dirname+"/try.html");
});
app.post("/api/imp",function(req,res){
	upload(req,res,function(err){
		if (err) {
			return res.end("something went wrong");
		}
		return res.end("file upload");
	});
});

app.listen(2000,function(a){
	console.log("listening to port 2000");
})