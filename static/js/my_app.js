var global;
var map=new AMap.Map("map", {
	resizeEnable:true
});

var geolocation;
map.plugin('AMap.Geolocation',function(){
	geolocation=new AMap.Geolocation({
		enableHighAccuracy:true,
		timeout:10000,
		buttonOffset:new AMap.Pixel(19,10),
		zoomToAccuracy:true,
		buttonPosition:'RB'
	});
	map.addControl(geolocation);
	geolocation.getCurrentPosition();
	AMap.event.addListener(geolocation,'complete',onComplete);
	AMap.event.addListener(geolocation,'error',onError);
});

var markers=[];
function onComplete(data){
	//alert("纬度："+data.position.getLat()+" 经度："+data.position.getLng());
}
function onError(data){
	alert(data.message);
}
angular.module("myApp",[])
	.controller("getController",function($scope,$http){
		$scope.da=false;
		$scope.SH=false;
		$scope.im=false;
		$scope.calendar="选择日期";
		map.on('click',function(e){
			$scope.user.lng=e.lnglat.getLng();
			$scope.user.lat=e.lnglat.getLat();
			$scope.$apply();
			})
		$scope.getdate=function(){

			if (global==undefined) {
				alert("请选择日期");
				return;
			}else {
				$http.get('/user/time?t='+global).then(function getsuccess(data){
					markers.forEach(function(marker){
						marker.listen.setMap(null);
					});
					markers=[];
					$scope.t_data=data.data;
					if (!($scope.t_data=='')) {
						for (var i = 0; i < $scope.t_data.length; i++) {
							var obj={};
							obj.icon="/static/images/mark_b.png";
							obj.position=[];
							obj.user=$scope.t_data[i].name;
							obj.position.push($scope.t_data[i].lon);
							obj.position.push($scope.t_data[i].lat);
							obj.listen=null;
							obj.time=$scope.t_data[i].time.minute;
							
							obj.title=$scope.t_data[i].title;
							obj.post=$scope.t_data[i].post;
							markers.push(obj);
						}
					
						markers.forEach(function(marker){
							marker.listen=new AMap.Marker({
								map:map,
								icon:marker.icon,
								position:[marker.position[0],marker.position[1]],
								offset:new AMap.Pixel(-12,-36)
							});
						});
					AMapUI.loadUI(['overlay/SimpleInfoWindow'],function(SimpleInfoWindow){
						markers.forEach(function(marker){
							var infoWindow=new SimpleInfoWindow({
									infoTitle:'<strong>'+marker.title+'</strong>',
									infoBody:'<p class="my-desc">'+marker.post+'</p></br><span>源自用于：'+marker.user+'</span></br><span>发布时间为：'+marker.time+'</span>',
									offset:new AMap.Pixel(0,-31)
							});
							marker.listen.on('click',function(){
								infoWindow.open(map,marker.listen.getPosition());
							});
						});
					});

			}
			else{
					alert('没有数据');
				}
		},function geterror(error){
					$scope.error=error;
					alert(error);
				})
			}
			
		}
		$scope.selectdatedata=function(){
			if ($scope.calendar=="选择日期") {
				$scope.calendar="关闭日历";
				
			}else{
				$scope.calendar="选择日期";
				
			}
			if ($scope.da) {
				$scope.da=false;
			}else{
				$scope.da=true;
			}
		}
		$scope.filechange=function(ele){
			$scope.im=true;
			$scope.files=ele.files;
			$scope.$apply();
			
		}
		$scope.upimg=function(){
			console.log($scope.files);
		
		}
		$scope.personshow=function(){
			if ($scope.SH==true) {
				$scope.SH=false;
			}else{
				$scope.SH=true;
			}
		}
		
		$scope.getpersondata=function(){
			markers.forEach(function(marker){
				marker.listen.setMap(null);
			});
			$http.get('/user/post').then(function getsuccess(data){
				
				markers=[];
				
				$scope.data=data.data;
				if(!($scope.data=='')){
					for (var i = 0; i < $scope.data.length; i++) {
						var obj={};
						obj.icon="/static/images/mark_b.png";
						obj.position=[];
						obj.position.push($scope.data[i].lon);
						obj.position.push($scope.data[i].lat);
						obj.user=$scope.data[i].name;
						obj.listen=null;
						obj.time=$scope.data[i].time.minute;
						
						obj.title=$scope.data[i].title;
						obj.post=$scope.data[i].post;
						markers.push(obj);
					}
					markers.forEach(function(marker){
						marker.listen=new AMap.Marker({
							map:map,
							icon:marker.icon,
							position:[marker.position[0],marker.position[1]],
							offset:new AMap.Pixel(-12,-36)
						});
					});
				AMapUI.loadUI(['overlay/SimpleInfoWindow'],function(SimpleInfoWindow){
					markers.forEach(function(marker){
						var infoWindow=new SimpleInfoWindow({
								infoTitle:'<strong>'+marker.title+'</strong>',
								infoBody:'<p class="my-desc">'+marker.post+'</p></br><span>源自用户：'+marker.user+'</span></br><span>发布时间为：'+marker.time+'</span>',
								offset:new AMap.Pixel(0,-31)
						});
						marker.listen.on('click',function(){
							infoWindow.open(map,marker.listen.getPosition());
						});
					});

				});
			}else{
					alert('没有数据');
			}	 
		},function geterror(err){
				$scope.error=error;
				$scope.data={};
				console.log(error);
			});
		};
		$http.get('/user/profile').then(function getsuccess(data,ststus,headers,config){
			$scope.user=data.data;
			if ($scope.user.img==null) {
				$scope.user.img="x.jpg";
			}
			$scope.error="";
		},function geterror(error,status,headers,config){
			$scope.user={};
			$scope.error=error;

		}); 
		$http.get('/user/posts').then(function getsuccess(data){
			markers.forEach(function(marker){
				marker.listen.setMap(null);
			});
				markers=[];
				$scope.datas=data.data;
				//console.log(data);
			if(!($scope.datas=='')){
				for (var i = 0; i < $scope.datas.length; i++) {
					var obj={};
					obj.icon="/static/images/mark_b.png";
					obj.position=[];
					obj.position.push($scope.datas[i].lon);
					obj.position.push($scope.datas[i].lat);
					obj.user=$scope.datas[i].name;
					obj.listen=null;
					obj.time=$scope.datas[i].time.minute;
					
					obj.title=$scope.datas[i].title;
					obj.post=$scope.datas[i].post;
					markers.push(obj);
				}
			
			markers.forEach(function(marker){
				marker.listen=new AMap.Marker({
							map:map,
							icon:marker.icon,
							position:[marker.position[0],marker.position[1]],
							offset:new AMap.Pixel(-12,-36)
						});
			});
			AMapUI.loadUI(['overlay/SimpleInfoWindow'],function(SimpleInfoWindow){
					markers.forEach(function(marker){
						var infoWindow=new SimpleInfoWindow({
								infoTitle:'<strong>'+marker.title+'</strong>',
								infoBody:'<p class="my-desc">'+marker.post+'</p></br><span>源自用户：'+marker.user+'</span></br><span>发布时间为：'+marker.time+'</span>',
								offset:new AMap.Pixel(0,-31)
						});
						marker.listen.on('click',function(){
							infoWindow.open(map,marker.listen.getPosition());
						});
					});

			});
			
		}else{
			alert('没有数据');
		}
			
				$scope.error="";
			
			},function geterror(error){
				$scope.error=error;
				$scope.datas={};
				console.log(error);
			});
		

	})

extra={
	view:{alwaysVisible:true}
}

$(document).ready(function(){
	selectdate.on("select",function(data){

		global=data.string;
	})
})