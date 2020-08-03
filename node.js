const request = require('request');
var express = require('express');

var app = express();
app.use(express.static('dist'))


app.post('/getList', function (req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  request({
    url: 'http://abc.yanglihao.cn:3002/getList',
    method: 'POST',
  }, function (err, response, body) {
    if (err) {
      console.log(err, '=====err');
      return;
    }
    res.end(body);
  })
})

app.listen(3002, function () {
  console.log('服务启动成功，端口3002')
})