import React, { Component } from 'react';
import styles from './index.scss';
import { Button, Badge } from 'antd';
import { getEnv } from '../../common/utils'
import ChooseFormula from '../ChooseFormula';

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
      img: 'F2L_01.gif',
      formula: "y' U' (R' U R)",
      show: true,
    }
  }
  

  componentDidMount() {
    fetch(`${getEnv()}/getList`, {
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
      this.setState({
        f2l,
        oll,
        pll,
        chooseList: [ ...f2l.chooseList, ...oll.chooseList, ...pll.chooseList]
      })
    })
    document.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  onKeyDown = () => {
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
    this.setState({
      visible: false,
      chooseList: [...f2l.chooseList, ...oll.chooseList, ...pll.chooseList],
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

  randomNum(len) {
    const { lastNum } = this.state;
    const randomNum = Math.floor(Math.random() * len);
    if(len !== 1 && lastNum === randomNum) {
      return this.randomNum(len);
    }
    return randomNum;
  }

  render() {

    const { visible, type, chooseList, f2l, oll, pll } = this.state;

    return (
      <div className={styles['container']}>
        <div className={styles['left']}>
          <img onClick={() => {this.randomFormula()}} src={`./images/${this.state.img}`} width="350px" height="350px" />
          <div
            className={styles['show-formula']}
            onClick={() => {
              this.setState({
                show: !this.state.show
              })
            }}
          >{this.state.show ? this.state.formula : '点击此处(或空格键)显示公式'}</div>
        </div>
        <div className={styles['right']}>
          <div className={styles['open-container']}>
            <div className={styles['f2l-open']}>
              <div>
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
                  >选取f2l公式</Button>
                </Badge>
              </div>
            </div>
            <div className={styles['f2l-open']}>
              <div>
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
                  >选取oll公式</Button>
                </Badge>
              </div>
            </div>
            <div className={styles['f2l-open']}>
              <div>
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
                  >选取pll公式</Button>
                </Badge>
              </div>
            </div>
          </div>
          <div className={styles['begin-practice']}>
            共选取<span>{chooseList.length}</span>个公式：
            <Button
              onClick={this.randomFormula.bind(this)}
              type="primary"
            >回车开始练习</Button>
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
