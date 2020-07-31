import React, { Component } from 'react';
import styles from './index.scss';
import { Drawer, Button, Checkbox } from 'antd';

class ChooseFormula extends Component {

  constructor(props) {
    super(props);
    this.state = {
      allChecked: false,
    }
  }
  

  componentDidMount() {
    const { data } = this.props;
    const { formulaList, chooseList } = data;
    
    let allChecked = false;

    if (chooseList.length === formulaList.length) {
      allChecked = true;
    } else {
      allChecked = false;
    }

    this.setState({
      allChecked
    })
  }

  onAllClick(e) {
    const { updateList, data, type } = this.props;
    const { formulaList, groupList } = data;
    const allChecked =  e.target.checked;
    let chooseList = [];

    if (allChecked) {
      formulaList.map((item, index) => {
        item.selected = 1;
        chooseList.push(item);
      });

      groupList.map((item) => {
        item.checked = 1;
      });

    } else {
      formulaList.map((item, index) => {
        item.selected = 0;
      })
      groupList.map((item) => {
        item.checked = 0;
      });
    }
    this.setState({
      allChecked
    })

    updateList({ formulaList, chooseList, groupList }, type);
  }

  onGroupClick(e, groupItem) {
    const { updateList, data, type } = this.props;
    const { formulaList, groupList, chooseList } = data;
    const groupChecked =  e.target.checked;
    let allChecked = false;

    if (groupChecked) {
      formulaList.map((item) => {
        if (item.group === groupItem.group) {
          item.selected = 1;
          if (chooseList.every((value, index) => {
            return value._id !== item._id; 
          })) {
            chooseList.push(item);
          }
        }
      })
      
      groupList.map((item) => {
        if (item.group === groupItem.group) {
          item.checked = 1;
        }
      })
    } else {
      formulaList.map((item) => {
        if (item.group === groupItem.group) {
          item.selected = 0;
          chooseList.map((value, index) => {
            if (value._id === item._id) {
              chooseList.splice(index, 1)
            }
          })
        }
      })
      
      groupList.map((item) => {
        if (item.group === groupItem.group) {
          item.checked = 0;
        }
      })

    }
    if (chooseList.length === formulaList.length) {
      allChecked = true;
    } else {
      allChecked = false;
    }

    this.setState({
      allChecked
    })

    updateList({ formulaList, chooseList, groupList }, type);
  }

  onItemClick(e, formulaItem) {
    const { updateList, data, type } = this.props;
    const { formulaList, groupList, chooseList } = data;
    let allChecked = false;

    if (!formulaItem.selected) {
      let groupchoose = true;
      formulaList.map((item) => {
        if (item._id === formulaItem._id) {
          item.selected = 1;
          chooseList.push(item);
        } else if(item.group === formulaItem.group) {
          if(!item.selected){
            groupchoose = false;
          }
        }
      })
      if (groupchoose) {
        groupList.map((item) => {
          if (item.group === formulaItem.group) {
            item.checked = 1;
          }
        })
      }
    } else {
      let groupchoose = true;
      formulaList.map((item) => {
        if (item._id === formulaItem._id) {
          item.selected = 0;
          chooseList.map((value, index) => {
            if (value._id === item._id) {
              chooseList.splice(index, 1);
            }
          })
        } else if (item.group === formulaItem.group) {
          if(!item.selected){
            groupchoose = false;
          }
        }
      })
      if (groupchoose) {
        groupList.map((item) => {
          if (item.group === formulaItem.group) {
            item.checked = 0;
          }
        })
      }
    }

    if (chooseList.length === formulaList.length) {
      allChecked = true;
    } else {
      allChecked = false;
    }

    this.setState({
      allChecked
    })

    updateList({ formulaList, chooseList, groupList }, type);
  }

  render() {

    const { allChecked } = this.state;
    const { visible, data, onClose } = this.props;
    const { groupList, formulaList } = data;
    return (
      <Drawer
        title="选择"
        placement="right"
        closable
        onClose={onClose}
        visible={visible}
        width="640px"
        className={styles['choose-container']}
      >
        <div>
          <Checkbox
            onChange={this.onAllClick.bind(this)}
            checked={allChecked}
            className={styles['all-choose']}
          >
            全选
          </Checkbox>
          {
            groupList.map((groupItem) => {
              return (<div className={styles['group-container']}>
                <Checkbox
                  onChange={(e) => this.onGroupClick(e, groupItem)}
                  checked={groupItem.checked}
                >
                  {groupItem.name}
                </Checkbox>
                <div className={styles['formula-list']}>
                  {
                    formulaList.map((formulaItem) => {
                      if (formulaItem.group === groupItem.group) {
                        return (<div
                          className={`${styles['formula-item']} ${formulaItem.selected ? styles['selected'] : ''}`}
                          onClick={(e) => this.onItemClick(e, formulaItem)}
                        >
                          <img src={`./images/${formulaItem.img}`} width="48" height="48" />
                        </div>)
                      }
                    })
                  }
                </div>
              </div>)
            })
          }
        </div>
      </Drawer>
    )
  }
}
export default ChooseFormula;
