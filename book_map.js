// 百度地图API功能

$(function(){
    var map = new BMap.Map("allmap");              // 创建地图实例  
	var point = new BMap.Point(104.0330340000,30.6364030000);  // 创建点坐标  
	map.centerAndZoom(point, 5);                      // 初始化地图，设置中心点坐标和地图级别
	map.addControl(new BMap.NavigationControl()); 	  // 地图平移缩放控件
	map.addControl(new BMap.OverviewMapControl());    //添加缩略地图控件
	map.enableScrollWheelZoom();                      //启用滚轮放大缩小
	var points = [];
	var markers = [];
	var infoWindows = [];
	/* // 创建标注对象并添加到地图   
	 var marker = new BMap.Marker(point, {icon: myIcon});    
	 map.addOverlay(marker); */
	var more;
	if(window.location.search.split("=")[1]=="T"){more="T"};
	$.ajax({	
		url: "/listBookOrderJSON.htm",
		data:{"sortByPrice":more},
		type: "post",
		dataType: "json",    
		success: function(data)     
	    { 
	        if(data != ''){
	         var baseRateCodeList= new Array(); 
	         var baseRateCodeList=$("#baseRateCodes").val().split(",");
	         var myIcon=[];
	         for(var i = 0 ; i < data.length ; i ++){
	        	 if(typeof(data[i].coordinates) != 'undefined' && data[i].coordinates) {
	        		 var temp=data[i].coordinates.split(",");    	
		        	 points[i] =new BMap.Point(temp[0],temp[1]);
		       
		        	 myIcon[i]= new BMap.Icon("/images/baidumap_coin"+(i+1)+".png", new BMap.Size(32,31));
		        	 markers[i]=new BMap.Marker(points[i],{icon:myIcon[i]});
		        	 map.addOverlay(markers[i]);  
	        	 }
	        	 var tempInfoWindow="<div class='baidu_info1'><div class='baidu_title'>"+data[i].descript+"</div>"                  //酒店信息
        		 +"<div class='ovh'>"
        		 +"<div><img class='db l mr10' style='border-radius:3px;' src='"+data[i].mainImg+"' width='136' height='88' /></div>"
        		 +"<div class='mapr_img clearfix'><p class='f-12 lh20 h20 ovh'>"+data[i].htCommentDto.hotelCommentAvgScore+"分&nbsp;"+data[i].htCommentDto.hotelCommentCount+"用户好评</p>"
        		 +"<p class='f-12 lh20 h20 ovh'>地址："+data[i].address+"</p>"
        		 +"<p class='f-12 lh20 h20 ovh'>电话：<a href='tel:"+data[i].phone+"' class='f-14 b' style='color: #00BE9C;text-decoration:underline;'>"+data[i].phone+"</a></p>"
        		 +"</div></div><div class='clearfix'></div>";
	        	 var datetime=new Date();
	 	    	 var year=datetime.getFullYear();
	 	    	 var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
	 	    	 var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
	 	    	 var date2=datetime.getDate() < 10 ? "0" + (datetime.getDate()+1) : datetime.getDate()+1;
	 	    	 var checkInDatatop= year+"-"+month+"-"+date;
	 	    	 var checkOutDatatop=year+"-"+month+"-"+date2;
	        	 var rmtype="<table class='baidutable'><tr><td>房型</td>";
	        	 for(var j=0;j<data[i].rateCodes.length;j++){
	        		 for(var q=0;q<baseRateCodeList.length;q++){
	        			 if(data[i].rateCodes[j].code==baseRateCodeList[q]){
	        				 rmtype+="<td>"+data[i].rateCodes[j].descript+"</td>"
	        			 }
	        		 }
	        	 }
	        	 rmtype+="</tr>";
	        	 for(var j=0;j<data[i].rmtypes.length;j++){
	        		 rmtype+="<tr><td>"+data[i].rmtypes[j].descript+"</td>";
	        		 for(var p=0;p<data[i].rateCodes.length;p++){
		        		 for(var k=0;k<data[i].roomList.length;k++){
		        			 if(data[i].roomList[k].rmtype==data[i].rmtypes[j].code){
		        				 for(var q=0;q<baseRateCodeList.length;q++){
		        					 if(data[i].rateCodes[p].code==data[i].roomList[k].ratecode){
		        						 if(data[i].roomList[k].ratecode==baseRateCodeList[q]){
				        					 rmtype+="<td>"+data[i].roomList[k].rate1+"</td>";
					        			 }
		        					 }
		        				 }
		        			 }
		        		 }
	        		 }
	        		 rmtype+="</tr>";
	        	 }
	        	 rmtype=rmtype+"</table></div><a class='baidu_click' href='/hotel.htm?checkInDate="+checkInDatatop+"&checkOutDate="+checkOutDatatop+"&hotelId="+data[i].id+"'>查看更多信息</a>"
	        	 infoWindows.push(tempInfoWindow+rmtype);
	         }
	         for (i =0; i < points.length; i ++) {
	        	 if(typeof(data[i].coordinates) != 'undefined' && data[i].coordinates) {
	        		(function(){
	        			var index = i; 
	        			markers[i].addEventListener('click', 
	        				function(){
	        		
	        					this.openInfoWindow(new BMap.InfoWindow(infoWindows[index], {enableMessage:false}));
	        			}); 
	        			var dd="r_result"+index;
	        			var map_show=document.getElementById(dd);
	        			if(map_show){
	        				if(map_show.addEventListener){
			        			map_show.addEventListener('click', function(){
			        				markers[index].openInfoWindow(new BMap.InfoWindow(infoWindows[index], {enableMessage:false}))
			        			})
		        			}
		        			else{
		        				map_show.onclick=function(){
		        					markers[index].openInfoWindow(new BMap.InfoWindow(infoWindows[index], {enableMessage:false}))
		        				}
		        			}
	        			}	
	        				
	        		})();
	        	 }
	        }
	         map.setViewport(points);
			
	         //alert (markers[0] );
	         //var markerClusterer = new BMapLib.MarkerClusterer(map, {markers:markers}); //最简单的用法，生成一个markers数组，然后调用markerClusterer类即可。
	       }
		},
		error:function(){
			alert("error");
		}
	}) 
	
	//移动到某个经纬度

	//map.panTo(new BMap.Point(113.262232,23.154345));  
	/*
	$("#search__").click(function() {
			var hotelId = $.trim($('#show_hotel2').attr("hotelId"));
			if(hotelId == "") {alert("请选择你要查询的酒店！"); return false;}
			var data = new Object();
			data.hotelId = hotelId;
			$.ajax({	
				url: "/getHotelCoordinates.htm",
				data:data,
				type: "post",
				dataType: "json",    
				success: function(data)     
			    { 
					if(data != ''){
			            
				         for(var i = 0 ; i < data.length ; i ++){
				        	 if(typeof(data[i].coordinates) != 'undefined' && data[i].coordinates) {
				        		 var temp=data[i].coordinates.split(",");    
				        		 var pointer____ = new BMap.Point(temp[0],temp[1]);
				        		 map.panTo(pointer____); 
				        		 map.centerAndZoom(pointer____, 25);   
				        	 }
				         }
				  }
			   }
			})
		})
	*/
})
