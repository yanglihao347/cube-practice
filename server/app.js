
var express = require('express');
const { exec } = require('./mysql');
var app = express();

app.post('/api/getList', function(req, res) {
  let group_sql = `SELECT * FROM cube_groups`;
  let formula_sql = `SELECT * FROM cube_formulas`;
  var data = {
    f2l: {
      groupList:[],
      formulaList: [],
      chooseList: [],
    },
    oll: {
      groupList:[],
      formulaList: [],
      chooseList: [],
    },
    pll: {
      groupList:[],
      formulaList: [],
      chooseList: [],
    },
  }
  Promise.all([exec(group_sql),exec(formula_sql)]).then(([groupList,formulaList]) => {
    groupList.map((group) => {
      data[group.type].groupList.push(group);
    });
    formulaList.map((formula) => {
      data[formula.type].formulaList.push(formula);
    });
    res.json(data);
  })
})

app.listen(3002, function() {
  console.log('服务启动成功，端口3002')
})
