# 你画我猜DEMO
背景：针对智能电视H5和手机H5实现跨屏活动，此dome不涉及画画命题及提交和校验猜题
```
1.npm install socket.io
2.node index
3.浏览器打开draw.html guess.html，（io('http://10.235.142.232:8081')此处ip需替换为本地ip或者localhost）
4.draw.html可指定特定guess.html进行猜题，也可广播所有guess.html猜题，（guess.html中默认广播，选中（蓝色）进行特定guess.html猜题）
```
