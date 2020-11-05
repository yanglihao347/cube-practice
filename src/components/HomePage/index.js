import React, { Component } from 'react';
import styles from './index.scss';
import { Button, Badge } from 'antd';
import { getEnv } from '../../common/utils'
import ChooseFormula from '../ChooseFormula';
import ImagesBox from '../ImagesBox';

class HomePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      chooseList: [],
      f2l: {},
      oll: {},
      pll: {},
      type: 'f2l',
      img: 'http://cube.yanglihao.cn/F2L_01.gif',
      formula: "y' U' (R' U R)",
      lastNum: 0,
      show: false,
    }
  }

  componentDidMount() {
    fetch(`/api/getList`, {
      method: 'POST',
    }).then(res => res.json()).then(data => {
      let { f2l, oll, pll } = data;
      const f2lLocal = localStorage.getItem("f2l") && JSON.parse(localStorage.getItem("f2l"));
      const ollLocal = localStorage.getItem("oll") && JSON.parse(localStorage.getItem("oll"));
      const pllLocal = localStorage.getItem("pll") && JSON.parse(localStorage.getItem("pll"));

      if(f2lLocal) {
        f2l = { ...f2lLocal };
      }
      if(ollLocal) {
        oll = { ...ollLocal };
      }
      if(pllLocal) {
        pll = { ...pllLocal };
      }
      const chooseList = [ ...f2l.chooseList, ...oll.chooseList, ...pll.chooseList];

      this.setState({
        f2l,
        oll,
        pll,
        chooseList,
        img: chooseList.length ? chooseList[0].img : 'http://cube.yanglihao.cn/F2L_01.gif',
        formula: chooseList.length ? chooseList[0].formula : "y' U' (R' U R)",
        lastNum: 0,
      })
    })
    document.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  onKeyDown = (e) => {
    switch(e.keyCode) {
      case 13:
        this.randomFormula();
        break;
      case 32:
        this.setState({
          show: !this.state.show
        });
        break;
    }
  }

  onClose = () => {
    const { f2l, oll, pll } = this.state;
    const chooseList = [...f2l.chooseList, ...oll.chooseList, ...pll.chooseList];
    this.setState({
      visible: false,
      chooseList,
      img: chooseList.length ? chooseList[0].img : 'http://cube.yanglihao.cn/F2L_01.gif',
      formula: chooseList.length ? chooseList[0].formula : "y' U' (R' U R)",
      lastNum: 0,
    })
  }

  updateList = (data, type) => {
    switch(type) {
      case 'f2l':
        this.setState({
          f2l: data,
        });
        localStorage.setItem("f2l", JSON.stringify(data));
        break;
      case 'oll':
        this.setState({
          oll: data,
        });
        localStorage.setItem("oll", JSON.stringify(data));
        break;
      case 'pll':
        this.setState({
          pll: data,
        })
        localStorage.setItem("pll", JSON.stringify(data));
        break;
      default:
        return;
    }
  }

  randomFormula() {
    const { chooseList } = this.state;
    const len = chooseList.length;

    if (len === 0) {
      return;
    }

    const randomNum = this.randomNum(len);

    this.setState({
      img: chooseList[randomNum].img,
      formula: chooseList[randomNum].formula,
      lastNum: randomNum,
    })
  }

  updateFormula = (num) => {
    const { chooseList } = this.state;
    const len = chooseList.length;

    if (len === 0) {
      return;
    }
    this.setState({
      img: chooseList[num].img,
      formula: chooseList[num].formula,
      lastNum: num,
    })
  }

  randomNum(len) {
    const { lastNum } = this.state;
    const randomNum = Math.floor(Math.random() * len);
    if(len !== 1 && lastNum === randomNum) {
      return this.randomNum(len);
    }
    return randomNum;
  }

  render() {

    const { visible, type, chooseList, f2l, oll, pll, lastNum } = this.state;

    return (
      <div className={styles['container']}>
        <div className={styles['left']}>
          <img className={styles['main-img']} onClick={() => {this.randomFormula()}} src={this.state.img} width="350px" height="350px" />
          <div
            className={styles['show-formula']}
            onClick={() => {
              this.setState({
                show: !this.state.show
              })
            }}
          >{this.state.show ? this.state.formula : '点击此处（或按空格键）显示公式'}</div>
          {chooseList.length ? <ImagesBox
            formulas={chooseList}
            lastNum={lastNum}
            updateFormula={this.updateFormula}
          /> : null}
        </div>
        <div className={styles['right']}>
          <div className={styles['open-container']}>
            <div className={styles['f2l-open']}>
              <Badge showZero count={f2l.chooseList && f2l.chooseList.length}>
                <Button
                  onClick={() => {
                    this.setState({
                      visible: true,
                      type: 'f2l'
                    })
                  }}
                  className={styles['formula-open-btn']}
                  type="primary"
                >选取 F2L 公式</Button>
              </Badge>
            </div>
            <div className={styles['f2l-open']}>
              <Badge showZero count={oll.chooseList && oll.chooseList.length}>
                <Button
                  onClick={() => {
                    this.setState({
                      visible: true,
                      type: 'oll'
                    })
                  }}
                  className={styles['formula-open-btn']}
                  type="primary"
                >选取 OLL 公式</Button>
              </Badge>
            </div>
            <div className={styles['f2l-open']}>
              <Badge showZero count={pll.chooseList && pll.chooseList.length}>
                <Button
                  onClick={() => {
                    this.setState({
                      visible: true,
                      type: 'pll'
                    })
                  }}
                  className={styles['formula-open-btn']}
                  type="primary"
                >选取 PLL 公式</Button>
              </Badge>
            </div>
          </div>
          <div className={styles['begin-practice']}>
            共选取<span>{chooseList.length}</span>个公式
            <div className={styles['use-description']}>使用说明：点击大图（或按回车键）随机切换公式</div>
          </div>
        </div>
        {visible && <ChooseFormula
          visible={visible}
          type={type}
          onClose={this.onClose}
          data={this.state[type]}
          updateList={this.updateList}
        />}
      </div>
    )
  }
}
export default HomePage;
