
var express = require('express');
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/runoob";
 
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  console.log("数据库已创建!");
  var dbase = db.db("runoob");

  // dbase.collection("formulas").insertMany(data, function(err, res) {
  //     if (err) throw err;
  //     console.log("文档插入成功");
  //     db.close();
  // });
  dbase.collection("site").find({}).toArray(function(err, res) {
    if (err) throw err;

    // console.log("文档成功", res);
    db.close();
  });
});

var app = express();
app.use(express.static('dist'))

app.get('/test', function(req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbase = db.db("runoob");
    dbase.collection("formulas_copy").find({}).toArray(function(err, data) {
      if (err) throw err;
  
      console.log("文档查询成功");
      data.map((formula) => {
        dbase.collection("formulas_copy").updateOne({
          "img": formula.img
        },{
          $set: {
            "img": formula.img.substr(33)
          }
        }, function(err, res) {
          if (err) throw err;
          console.log("文档更新成功");
          db.close();
      })
      })
      db.close();
    });
  })
})

app.post('/getList', function(req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  let getGroupList = new Promise((resolve, reject) => {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
      if (err) throw err;
      console.log("数据库已创建!");
      var dbase = db.db("runoob");
      dbase.collection("groups").find({}).toArray(function(err, data) {
        if (err) throw err;
    
        console.log("文档查询成功");
        resolve(data);
        db.close();
      });
    })
  });

  let getFormulaList = new Promise((resolve, reject) => {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
      if (err) throw err;
      console.log("数据库已创建!");
      var dbase = db.db("runoob");
      dbase.collection("formulas_copy").find({}).toArray(function(err, data) {
        if (err) throw err;
    
        console.log("文档查询成功");
        resolve(data);
        db.close();
      });
    })
  });

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

  Promise.all([getGroupList, getFormulaList]).then((response) => {
    console.log(response);
    let groupList = response[0];
    let formulaList = response[1];

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

// var a = fs.readdirSync('../cub-p/oll');
// console.log(a);

// a.map((oldname, index) => {
//   if (index < 9) {
//     fs.renameSync('../cub-p/oll/'+ oldname, '../cub-p/oll/' + 'OLL_0' + (index+1) + '.png');
//   } else {
//     fs.renameSync('../cub-p/oll/'+ oldname, '../cub-p/oll/' + 'OLL_' + (index+1) + '.png');
//   }
// })

  // let list = [
  //   '(R U’ R) U (R U R U’) (R’ U’ R2)',
  //   '(R2’ U) (R U R’ U’) (R’ U’) (R’ U R’)',
  //   'M2 U M2 U2 M2 U M2',
  //   '(M2 U M2 U) (M’ U2)(M2 U2) (M’ U2)',
  //   'x’ R2 D2 (R’ U’ R) D2 (R’ U R’) x',
  //   'x’ (R U’ R) D2 (R’ U R) D2 R2 x',
  //   '(R2 U R’ U’) y (R U R’ U’)2 (R U R’) y’ (R U’ R2)',
  //   '(R U R’ U’) (R’ F R2 U’ R’ U’) (R U R’ F’)',
  //   '(R U R’ F’) (R U R’ U’) (R’ F R2 U’ R’ U’)',
  //   'z (U’ R D’) (R2 U R’ U’)(R2 U) D R’',
  //   'F (R U’ R’ U’) (R U R’ F’)(R U R’ U’) (R’ F R F’)',
  //   'U’ (R’ U R U’) R2’ b’ x (R’ U R) y’ (R U R’ U’ R2)',
  //   '(R’ U R’ d’) (R’ F’) (R2 U’ R’ U) (R’ F R F)',
  //   '(R U’ U’) (R’ U2) (R B’ R’ U’) (R U R B) R2’ U',
  //   '(R’ U2) (R U’ U’) (R’ F R U R’ U’) (R’ F’ R2 U’)',
  //   'z (R’ U R’) z’ (R U2 L’ U R’) z (U R’) z’ (R U2 L’ U R’)',
  //   'z (U’ R D’) (R2 U R’ U’) z’ (R U R’) z (R2 U R’) D R’',
  //   '(R2’ u’) (R U’ R) U (R’ u R2’) y (R U’ R’)',
  //   '(R U R’) y’ (R2’ u’) (R U’ R’ U) (R’ u R2)',
  //   '(R2’ u R’) (U R’ U’) (R u’ R2’) y’ (R’ U R)',
  //   '(R’ d’ F) (R2’ u R’) U (R U’ R) u’ R2',
  // ];

  // let data = [];
  // list.map((formula, index) => {
  //   let group = 'a';
  //   switch(true) {
  //     case index >= 0 && index <7:
  //       group = 'a';
  //       break;
  //     case index >= 7 && index <16:
  //       group = 'b';
  //       break;
  //     case index >= 16 && index <21:
  //       group = 'c';
  //       break;
  //       break;
  //     default:
  //       break;
  //   }
  //   data.push({
  //     formula,
  //     type: 'pll',
  //     group,
  //     img: `http://q9c13a0x4.bkt.clouddn.com/PLL_${index < 9 ? '0' + (index + 1) : (index + 1)}.png`,
  //     selected: 0,
  //   })
  // })
  // let list = ["R' U2 R U R' U R", "R U' U' R' U' R U' R'", "(r U R' U') (r' F R F')", "F'(r U R' U') (r' F R)", "(R2 D') (R U'U')(R' D) (R U'U' R)", "(R U U R' U')(R U R' U') (R U' R')", "R U'U' (R2' U')(R2 U') R2' U2 R", "F (R U R' U') F'", "f (R U R' U') f'", "f' (L' U' L U) f", "(R U R' U')(R' F R F')", "F (R U R' U')2 F'", "F' (L' U' L U)2 F", "f(R U R' U')2 f'", "F (R U R' U') F'f (R U R' U') f'", "f(R U R' U')f' U'F(R U R' U')F'", "f(R U R' U')f' UF(R U R' U')F'", "(R U'U') (R2' F R F') U2 (R' F R F')", "(r' U2) (R U R'U) r", "(r U'U') (R' U' R U' r')", "r U R' U R U U r'", "r' U' R U' R' U2 r", "F (R U' R'U')(R U R' F')", "R U'U' (R2' F R F')(R U'U'R')", "(R B')(R2 F)(R2 B) (R2 F') R", "(R' F) (R2 B') (R2 F') (R2 B) R'", "r' U2 (R U R' U')(R U R' U) r", "r U (R' U R U')2 U' r'", "(R U R' U) (R' F R F') U2 (R' F R F')", "F (R U R' U) y'(R' U2) (R' F R F')", "(M U)(R U R' U') M' (R' F R F')", "(R U R' U') (R' F)(R2 U R' U') F'", "(R U R'U)(R'F R F') (R U'U'R')", "(r U R' U') (r' R)(U R U' R')", "(R U R' U') r R'(U R U' r')", "(R' U') (R' F R F')(U R)", "(R U R' U') x D'(R' U R) E'", "(R U R'U) (R U'R'U') (R'F R F')", "(R'U'R U') (R'U R U) (l U'R'U)", "F (R U R' U') F' UF (R U R' U') F'", "(r U R' U)(R' F R F') R U2 r'", "(R U)(B' U')(R' U R B R')", "(R' U' F) (U R U')(R' F' R)", "R' F (R U R'U') F'(U R)", "L F' (L' U' L U) F(U' L')", "(R U R' U R U2 R')F (R U R' U') F'", "(R' U' R U' R' U2 R)F (R U R' U') F'", "(r' U2 R U R' U r)(R U2 R' U' R U' R')", "(r U2 R' U' R U' r')(R' U2 R U R' U R)", "(r U r') (R U R' U')(r U' r')", "(l' U' l) (L' U' L U)(l' U l)", "R' F (R U R' F' R) y' (R U' R')", "F (U R U') (R2 F')(R U R U' R')", "(R' U' R U') (R' U) y' (R' U R B)", "(r U r') (U R U' R')2 (r U' r')", "R' F (U R U') (R2' F') (R2 U R' U' R)", "(r' R U) (R U R'U')(r2 R2') (U R U' r')"];
  // let data = [];
  // list.map((formula, index) => {
  //   let group = 'd';
  //   switch(true) {
  //     case index >= 0 && index <7:
  //       group = 'd';
  //       break;
  //     case index >= 7 && index <14:
  //       group = 'e';
  //       break;
  //     case index >= 14 && index <22:
  //       group = 'f';
  //       break;
  //     case index >= 22 && index <31:
  //       group = 'g';
  //       break;
  //     case index >= 31 && index < 41:
  //       group = 'h';
  //       break;
  //     case index >= 41 && index <49:
  //       group = 'i';
  //       break;
  //     case index >= 49 && index <57:
  //       group = 'j';
  //       break;
  //     default:
  //       break;
  //   }
  //   data.push({
  //     formula,
  //     type: 'oll',
  //     group,
  //     img: `http://q9c1ftxva.bkt.clouddn.com/OLL_${index < 9 ? '0' + (index + 1) : (index + 1)}.png`,
  //     selected: 0,
  //   })
  // })
// let text = `(R U' R') U (R U2' R') U (R U' R')
// (R U' R') U' (R U R') U2 (R U' R')
// (R U' R') U2 y' (R' U' R) U' (R' U R)
// (R U' R') U y' (R' U' R) U' (R' U' R)
// (R U'2 R') U (R U'2 R') U y' (R' U' R)
// U (R U' R') d' (L' U L)
// y U' (L' U' L) U y' (R U R')
// y' (R' U R) U' (R' U R)
// (R U R') U' (R U R')
// (R U' R') U (R U' R')
// y' (R' U' R) U (R' U' R)
// y' U' (R' U R)
// d (R' U' R) U2 (R' U R)
// d (R' U2 R) U2 (R' U R)
// (R U' R') U2 y' (R' U' R)
// U (F' U' F) U' (R U R')
// (R U' R') U (R U' R') U2 (R U' R')
// U' (R U R') U (R U R')
// (R U R')
// U' (R U' R') U (R U R')
// U' (R U2' R') U (R U R')
// (R U R') U2 (R U' R') U (R U' R')
// U' (R U2 R') U2 (R U' R')
// U' (R U R') U2 (R U' R')
// U (R U' R')
// U' (R U' R') U2 (R U' R')
// y' U (R' U R) U' (R' U' R)
// y' (R' U' R)
// U' (R U' R') U y' (R' U' R)
// U' (R U2 R') U y' (R' U' R)
// U' (R U R') U y' (R' U' R)
// (R U R') U2 (R U R') U' (R U R')
// (R U' R') U2 (R U R')
// U (R U2 R') U (R U' R')
// (R U2 R') U' (R U R')
// U (R U' R') U (R U' R') U (R U' R')
// (R' F R F') (R U' R') U (R U' R')
// y' U' (R' U2 R) U' (R' U R)
// y' (R' U R) U2 (R' U' R)
// U' (R U R')(R' F R F')(R U' R')
// U' (R' F R F')(R U' R')`;

// let list = text.split('\n');
// let data = [];
// let sortlist = [27, 28, 29, 30, 31, 32, 33, 38, 39, 40, 41, 1, 7, 9, 26, 17, 23, 5, 3, 24, 15, 25, 10, 8, 2, 16, 22, 4, 6, 21, 18, 35, 13, 12, 36, 19, 34, 11, 14, 37, 20];

// sortlist.map((num, index) => {
//   let group = 'k';
//   switch(true) {
//     case index >= 0 && index <5:
//       group = 'k';
//       break;
//     case index >= 5 && index <11:
//       group = 'l';
//       break;
//     case index >= 11 && index <21:
//       group = 'm';
//       break;
//     case index >= 21 && index <31:
//       group = 'n';
//       break;
//     case index >= 31 && index < 41:
//       group = 'o';
//       break;
//     default:
//       break;
//   }
//   data.push({
//     formula: list[index],
//     type: 'f2l',
//     group,
//     img: `http://q9c196j7s.bkt.clouddn.com/F2L_${num < 10 ? '0' + num : num}.gif`,
//     selected: 0,
//   })
// })

// console.log(data);

// let list = ['PLL基础公式', 'PLL核心公式', 'PLL较难公式', '第一组OLL 十字公式', '第二组OLL', '第三组OLL', '第四组OLL', '第五组OLL', '第六组OLL', '第七组OLL', 'F2L角块棱块都在槽内', 'F2L只有角块在槽内', 'F2L角块朝右', 'F2L角块朝前', 'F2L角块朝上']
  
// let data = [{
//   type: 'pll',
//   group: 'a',
//   name: 'PLL基础公式',
// }, {
//   type: 'pll',
//   group: 'b',
//   name: 'PLL核心公式',
// }, {
//   type: 'pll',
//   group: 'c',
//   name: 'PLL较难公式',
// }, {
//   type: 'oll',
//   group: 'd',
// }, {
//   type: 'oll',
//   group: 'e',
// }, {
//   type: 'oll',
//   group: 'f',
// }, {
//   type: 'oll',
//   group: 'g',
// }, {
//   type: 'oll',
//   group: 'h',
// }, {
//   type: 'oll',
//   group: 'i',
// }, {
//   type: 'oll',
//   group: 'j',
// }, {
//   type: 'f2l',
//   group: 'k',
// }, {
//   type: 'f2l',
//   group: 'l',
// }, {
//   type: 'f2l',
//   group: 'm',
// }, {
//   type: 'f2l',
//   group: 'n',
// }, {
//   type: 'f2l',
//   group: 'o',
// }]

// list.map((name, index) => {
//   data[index].name = name;
// })