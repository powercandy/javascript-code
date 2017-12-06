<template>
    <div class="login-page">
        <div class="uploadWrapper" :title="msg">
            <input class="imgInput" v-if="unFinished" type="file" :id="name" @change="choosePhoto($event)"
                   accept="image/*"/>
            <div class="uploadInner" v-if="unFinished">
                <span></span>
                <em class="tc db">上传图片</em>
            </div>
            <img :src="imgHref" :class="{'imgOpacity':!unFinished}" v-show="!compress"/>
            <canvas id="myCanvas" v-show="compress"></canvas>
        </div>
    </div>
</template>
<script type="text/javascript">
    import api from '../../libs/api.js';
    export default{
        data() {
            return {
                msg: 'dsafas',
                name: 'dssad',
                imgHref: '',
                unFinished: true,
                maxSize: '60000', // 图片的最大字节,
                maxHeight: '200',
                compress: false // 图片是否压缩
            };
        },
        methods: {
            choosePhoto(event) {
                const self = this;
                if (event.target.files[0]) { // chrome 和 ff
                    const img = event.target.files[0];
                    if (!/\/(?:jpeg|png)/i.test(img.type)) return;

                    if (img.type.indexOf('image') === 0) {
                        // 调用上传图片函数
                        var reader = new FileReader();
                        reader.readAsDataURL(img);
                        reader.onload = function (e) {
                            const result = e.target.result;
                            if (result.length <= self.maxSize) {
                                const imgUrl = self.getObjectURL(img);
                                self.imgHref = imgUrl;
                                self.unFinished = false;
                                self.compress = false;
                                // 调用上传图片接口
                                self.uploadRequire(img);
                            } else { // 如果图片大于指定尺寸，进行压缩
                                self.compressImg(result, self.maxHeight, function (res) {
                                    self.compress = true;
                                    self.imgHref = res;
                                    self.unFinished = false;
                                    self.uploadRequire(img);
                                });
                            }
                        };
                    }
                }
            },
            // 获取图片在本地的路径，显示在页面上。
            getObjectURL(file) {
                var url = null;
                if (window.createObjectURL !== undefined) { // basic
                    url = window.createObjectURL(file);
                } else if (window.URL !== undefined) { // mozilla(firefox)
                    url = window.URL.createObjectURL(file);
                } else if (window.webkitURL !== undefined) { // webkit or chrome
                    url = window.webkitURL.createObjectURL(file);
                }
                return url;
            },
            // 上传图片函数，接口在这里面写
            uploadRequire(file) {
                var formData = new FormData();
                // 将图片formData格式化，files，是和后端约定的key.
                formData.append('files', file);
                api.upload(formData).then((res) => {
                    if (res.body.code === 200) {
                    }
                    // 上传图片后返回 图片对应的key，用于保存信息时提交此照片的凭证
                    // console.log(JSON.parse(res.body.data).body[0].key);
                });
            },
            // 如果图片大，则需要进行压缩;
            compressImg(imgData, maxHeight, onCompress) {
                if (!imgData) return false;
                onCompress = onCompress || function () {};
                maxHeight = maxHeight || 800;// 默认最大高度800px
                var img = new Image();
                img.src = imgData;
                img.onload = function () {
                    if (img.height > maxHeight) { // 按最大高度等比缩放
                        img.width *= maxHeight / img.height;
                        img.height = maxHeight;
                    }
                    var canvas = document.getElementById('myCanvas');
                    var ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0, img.width, img.height);
                    onCompress(canvas.toDataURL('image/jpeg'));
                };
            }
        }
    };
</script>

<style type="text/css" scoped>
    .db {
        display: block;
    }

    .uploadWrapper {
        position: relative;
        width: 100px;
        height: 100px;
        border-radius: 3px;
        border: 1px solid #cccccc;
    }

    .uploadWrapper img {
        display: block;
        width: 100%;
        opacity: 0;
    }

    .uploadWrapper img.imgOpacity {
        opacity: 1;
    }

    .imgInput {
        opacity: 0;
        width: 100px;
        height: 100px;
        border: 1px solid #333333;
        z-index: 200;
        position: absolute;
        top: 0;
        left: 0;
    }

    .uploadInner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
        -webkit-transform: translate3d(-50%, -50%, 0);
        height: 60px;
        width: 40px;
        z-index: 3;
    }

    .uploadInner span {
        width: 40px;
        height: 40px;
        position: relative;
        border: 1px solid #cccccc;
        border-radius: 50%;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        display: block;
        margin-bottom: 5px;
    }

    .uploadInner span:before, .uploadInner span:after {
        content: "";
        height: 2px;
        width: 28px;
        display: block;
        background: #ccc;
        position: absolute;
        top: 19px;
        left: 6px;
    }

    .uploadInner span:after {
        height: 28px;
        width: 2px;
        top: 6px;
        left: 19px;
    }

</style>
