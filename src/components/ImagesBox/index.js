import React, {
  Component
} from 'react';
import styles from './index.scss';

export default class ImagesBox extends Component {

  constructor(props) {
    super(props);
    this.state = {
      position: 220
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.lastNum !== nextProps.lastNum) {
      this.setState({
        position: 220 - nextProps.lastNum * 70
      })
    }
  }


  render() {
    const { formulas, lastNum, updateFormula } = this.props;
    const { position } = this.state;
    return (<div
        className={styles['box-container']}
      >
        <div
          className={styles['left-arrow']}
          onClick={() => {
            this.setState({
              position: position + 180 > 220 ? 220 : position + 180
            })
          }}
        >&lt;</div>
        <div
          className={styles['box-content']}
          id="box-content"
          style={{
            left: `${position}px`
          }}
        >
          {
            formulas && formulas.map((item, index) => {
              return (<div
                className={`${styles['img-item']} ${index === lastNum ? styles['selected'] : ''}`}
                onClick={() => {
                  updateFormula(index);
                }}
              >
                <img src={item.img} width="54px" height="54px" />
              </div>)
            })
          }
        </div>
        <div
          className={styles['right-arrow']}
          onClick={() => {
            const boxContent = document.getElementById('box-content');
            const limitRight = 290 - boxContent.offsetWidth;
            
            this.setState({
              position: position - 180 < limitRight ? limitRight : position - 180
            })
          }}
        >&gt;</div>
    </div>)
  }
}