
var doo = {
	textArea: function() {

		function inputTextCheck(obj) {
			var myVal = $(obj).val();
			if (myVal == "昵称") {
				$(obj).val("");
			}
		}
		function textAreaCheck(obj) {
			var myText = $(obj).text();
			var myVal = $(obj).val();
			if (myVal == "分享身边的搞笑事儿（嫑少于6个字）          即有机会被采纳并推荐到微信！" || myText == "分享身边的搞笑事儿（嫑少于6个字）          即有机会被采纳并推荐到微信！") {
				$(obj).text("");
				$(obj).val("");
			}
		}
		$(".message_textArea").focus("click",function() {
			textAreaCheck(this);
		});
		$(".message_textArea").live("click",function() {
			textAreaCheck(this);
		});
		$(".message_textArea").blur(function() {
			var myText = $(".message_textArea").text();
			var myVal = $(".message_textArea").val();
			if (myText == "" && myVal == "") {
				myVal = $(".message_textArea").val();

				$(".message_textArea").val("分享身边的搞笑事儿（嫑少于6个字）          即有机会被采纳并推荐到微信！");
				if (myVal) {
					$(".message_textArea").val("分享身边的搞笑事儿（嫑少于6个字）          即有机会被采纳并推荐到微信！");
				}
			}
		});
		$(".nameInputText").focus(function() {
			inputTextCheck(this);
		});
		$(".nameInputText").live("click",function() {
			inputTextCheck(this);
		});
		$(".nameInputText").blur(function() {
			var myVal = $(this).val();
			if (myVal == "") {
				$(this).val("昵称");
			}
		});
	},
	inputVal: function() {
		var $tex = $(".message_textArea");
		var $num = $(".textArea_wordNum");
		// var $name = $(".nameInputText");
		var str = 0;
		//var ie = jQuery.support.htmlSerialize;
		var abcnum = 0;
		var maxNum = 250;
		var texts = 0;
		var num = 0;
		var sets = null;

		//if (ie) {
			$tex[0].oninput = changeNum;
			// $name[0].oninput = nameNum;
		//} else {
			//$tex[0].onpropertychange = changeNum;
			// $name[0].onpropertychange = nameNum;
		//}

		function changeNum() {
			//汉字的个数
			// str = ($tex.val().replace(/\w/g, "")).length;
			//非汉字的个数
			// abcnum = $tex.val().length - str;

			// total = str*2+abcnum;
			total = $tex.val().length;

			if (total < maxNum || total == maxNum) {
				texts = Math.ceil(maxNum - total);
				$num.text(texts);
			} else if (total > maxNum) {
				// console.log(texts);
			}
		}
		function nameNum() {
			//汉字的个数
			str = ($name.val().replace(/\w/g, "")).length;
			//非汉字的个数
			abcnum = $name.val().length - str;

			total = str * 2 + abcnum;

			if (str * 2 + abcnum < maxNum || str * 2 + abcnum == maxNum) {
				texts = Math.ceil((maxNum - (str * 2 + abcnum)) / 2);
				$num.text(texts);
			} else if(str * 2 + abcnum > maxNum) {
				// console.log(texts);
			}
		}
	},
	imgForm: function() {

		$("#result_image").live("click",function() {

			if ($("#fileElem").length > 0) {

				$("#fileElem").remove();
			}
			var inputfile = '<input type="file" name="upload_pic" id="fileElem" accept="image/*">';
			$(inputfile).appendTo(".hideFilePlan");
			$("#fileElem").click();
		});
		
		$(".faceIco").click(function() {
			if ($("#fileElem").length > 0) {

				$("#fileElem").remove();
			}
			var inputfile = '<input type="file" name="upload_pic" id="fileElem" accept="image/*">';
			$(inputfile).appendTo(".hideFilePlan");
			$("#fileElem").click();
		});
		
		$("#fileElem").live("change",function() {
			onChooseFile(this);
		});
		
		var output_format = "jpg";

		//获取>执行压缩过程
		var onChooseFile = function(fileInputDOM) {

			var files = fileInputDOM.files,
			img = new Image(),
			filesName = $(fileInputDOM).val();

			var byteSize = fileInputDOM.files[0].size,
			btyeType = fileInputDOM.files[0].type,
			re_bytysize = Math.ceil(byteSize / 1024);

			if (re_bytysize > 2048) {
				var tpl = "";
				tpl += '<span class="notice_icoSuc"></span>上传的图片不可大于2M!';

				$(".noticeBox2").html(tpl);
				// 通知弹窗居中
				doo.noticeWidth();

				$(".noticeBox2").removeClass('noticeBox2_out').css('opacity', 1);
				setTimeout('$(".noticeBox2").css("opacity", 0).addClass("noticeBox2_out")',2000);
				return;
			}
			//显示删除按钮
			$(".delImg").show();

			var reader = new FileReader();
			reader.readAsDataURL(files[0]);

			if (btyeType == "image/gif") {
				output_format ="gif";
			}
			if (btyeType == "image/png") {
				output_format ="png";
			}
			if (btyeType == "image/bmp") {
				output_format ="bmp";
			}

			reader.onload = function(e) {

				//图片地址(原图Base64) 
				img.src = this.result;

				$(".imgUpload").addClass("loading");

				//创建图片对象,并赋予原图地址

				$("#source_image").attr("src", this.result);

				$("#source_image").load(function() {

					var source_image = document.getElementById('source_image');
					//压缩比例
					var quality = 30;
					//执行压缩，并设置图片

					finialimg = jic.compress(source_image, quality, output_format).src;

					if($(".ulPic").length) {
						$(".ulPic").attr('src', finialimg);
					}
					else {
						$('<img src=' + finialimg + ' class="ulPic" id="result_image" style="display:none" />').appendTo(".imgUpload");
					}

					//执行上传
					upload(finialimg);
				})
			}
		};

		function upload(imgsrc) {
			var callback = function() {
				console.log("image uploaded successfully! :)");
			}
			jic.upload(imgsrc,'/app/clientDraft/upload', 'upload_pic','new.' + output_format, callback);
		}

	},
	dataForm: function() {
		$(".messageSubmit").on('click',function() {
			// console.log(33)
			var content =$(".message_textArea").val(),
			contentText =$(".message_textArea").text(),
			nick =$(".nameInputText").val(),
			upload_file =$(".faceIco").attr('data-url') ? $(".faceIco").attr('data-url') : '';
			img_id =$(".faceIco").attr('data-id') ? $(".faceIco").attr('data-id') : '';
			contentLen =content.length;
			nickLen =nick.length;
			//汉字的个数
			// cont_str = (content.replace(/\w/g, "")).length,
			//非汉字的个数
			// cont_abcnum = content.length - cont_str,
			// contentLen = cont_str * 2 + cont_abcnum;
			//汉字的个数
			// nick_str = (nick.replace(/\w/g, "")).length,
			//非汉字的个数
			// nick_abcnum = nick.length - nick_str,
			// nickLen = nick_str * 2 + nick_abcnum;
			var errMsg = function(mClass, mMsg) {

				$("." + mClass).addClass('inputChange');
				var tpl = "";
				tpl += '<span class="notice_icoErr"></span>' + mMsg;

				$(".noticeBox2").html(tpl)
				// 通知弹窗居中
				doo.noticeWidth();

				$(".noticeBox2").removeClass('noticeBox2_out').css('opacity', 1);
				setTimeout('$(".noticeBox2").css("opacity", 0).addClass("noticeBox2_out")',2000);
			};
			if (contentLen > 250) {
				errMsg('message_textArea', '内容已超过250个字');
				setTimeout('$(".message_textArea").removeClass("inputChange");', 1000);
				return false;
			} else if (contentLen < 6 || content == "分享身边的搞笑事儿（嫑少于6个字）          即有机会被采纳并推荐到微信！" || contentText == "分享身边的搞笑事儿（嫑少于6个字）          即有机会被采纳并推荐到微信！") {
				errMsg('message_textArea', '内容少于6个字');
				setTimeout('$(".message_textArea").removeClass("inputChange");', 1000);
				return false;
			} else if (nickLen > 15) {
				errMsg('nameInputText', '昵称已超过15个字');
				setTimeout('$(".nameInputText").removeClass("inputChange");', 1000);
				return false;
			} else if (!nick || nick == "昵称") {
				errMsg('nameInputText', '昵称未填写');
				setTimeout('$(".nameInputText").removeClass("inputChange");', 1000);
				return false;
			};
			// 处理cookie数据
			var draf_click = lxhAdmin.cookie('draftSuc1');
			if (draf_click) {
				var draf_suc =lxhAdmin.cookie('draftSuc2');
				if (draf_suc && draf_suc == content) {
					// alert("已成功");
					var tpl = "";
					tpl += '<span class="notice_icoSuc"></span>已经投稿成功咯！(*^__^*)';
					$(".noticeBox2").html(tpl);
					
					// 通知弹窗居中
					doo.noticeWidth();
					
					$(".noticeBox2").removeClass('noticeBox2_out').css('opacity', 1);
					setTimeout('$(".noticeBox2").css("opacity", 0).addClass("noticeBox2_out")', 2000);
							
					$(".message_textArea").val("");
					//$(".message_textArea").attr('placeholder', "再来条笑话逗乐冷哥吧！ (嫑少于10个字)")
					$(".nameInputText").val("");
					if(navigator.userAgent.match(/(android)/i)){
					
					}else{
						$(".faceIco").attr('data-url', "");
						$(".faceIco").attr('data-id', "");
						$(".ulPic").remove();
					};
					return false;
					
				} else {
						var tpl = "";
							tpl += '<span class="notice_icoSuc"></span>冷哥正在处理ING，请等待……';
							$(".noticeBox2").html(tpl);
							// 通知弹窗居中
							doo.noticeWidth();
							$(".noticeBox2").removeClass('noticeBox2_out').css('opacity', 1);
							setTimeout('$(".noticeBox2").css("opacity", 0).addClass("noticeBox2_out")', 2000);
							return false;
				}
			}
					var data = {
						dosubmit : 1,
						nick : nick,
						content : content,
						upload_pic : upload_file,
						img_id : img_id
					};
					
					lxhAdmin.cookie('draftSuc1', 'click', {expires: (3/(24*60*60))});
					
					var options = {
						url: '/app/ClientDraft/addWeixin',
						type: 'POST',
						data: data,
						dataType: 'json',
						success : function(d){
							if(d.flag){
								
								//$(".delImg").css("display","none");
								// 存cookie数据
									lxhAdmin.cookie('draftSuc2', content, {expires: (10/(24*60*60))});
									var tpl = "";
									tpl += '<span class="notice_icoSuc"></span>哦也，稿件提交成功！';
									$(".noticeBox2").html(tpl);
									// 通知弹窗居中
									doo.noticeWidth();
								$(".noticeBox2").removeClass('noticeBox2_out').css('opacity', 1);
								setTimeout('$(".noticeBox2").css("opacity", 0).addClass("noticeBox2_out")', 2000);
								setTimeout("location.reload()",2000);
								
								return;
							}else{
								var tpl = "";
								tpl += '<span class="notice_icoErr"></span>'+d.msg;
								$(".noticeBox2").html(tpl)
								// 通知弹窗居中
								doo.noticeWidth();
								$(".noticeBox2").removeClass('noticeBox2_out').css('opacity', 1);
								setTimeout('$(".noticeBox2").css("opacity", 0).addClass("noticeBox2_out")', 2000);
								// 跳转失败页面
								// window.location.href = " / app / ClientDraft / error ? err = "+d.msg;
							}
							
						}
					};
					$.ajax(options);
					return false;
				})
			},
			noticeWidth : function(){
				
				var w1 = $(window).width();
				var h1 = $(window).height();
				var w2 = $(".noticeBox2").width();
				var h2 = $(".noticeBox2").height();
				
				var left_w;
				var top_h;
				w2 += 22;
				h2 += 20;
				if(w1 < w2){
					left_w = 0;
				} else {
					left_w = (w1-w2)/2;
				};
				if(h1 < h2){
					top_h = 0;
				} else {
					top_h = (h1-h2)/2;
				}
				$(".noticeBox2").css({
					'left': left_w,
					'top': top_h
				});
			}
		}

		Zepto(function($){

			if(navigator.userAgent.match(/(android)/i)){
				$(".imgUpload").hide();
				$(".textAreaContainer").addClass("inAndroid");
			}

			doo.textArea();
			doo.inputVal();
			doo.dataForm();

			// 通知弹窗居中
			$(window).on('resize', function(){
				doo.noticeWidth();
			})
			if(navigator.userAgent.match(/(android)/i)){
				$(".nameInput").addClass('picOff');
			} else {
				$(".nameInput").removeClass('picOff');
				doo.imgForm();
			}
		})