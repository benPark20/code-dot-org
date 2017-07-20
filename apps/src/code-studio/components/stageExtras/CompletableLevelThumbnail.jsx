import React from 'react';

const styles = {
  wrapper: {
    display: 'inline-block',
    position: 'relative',
    transformOrigin: '0 0',
  },
  overlay: {
    width: 400,
    height: 400,
    backgroundColor: 'rgba(0, 255, 0, 0.3)',
    position: 'absolute',
    top: 0,
    left: 0,
    textAlign: 'center',
  },
  check: {
    fontSize: 350,
    lineHeight: `400px`,
    color: '#fff',
    opacity: '0.8',
  },
};

export default class CompletableLevelThumbnail extends React.Component {
  static propTypes = {
    children: React.PropTypes.element.isRequired,
    width: React.PropTypes.number,
    completed: React.PropTypes.boolean,
  }

  render() {
    const scale = (this.props.width || 400) / 400;
    return (
      <div
        style={{
          transform: `scale(${scale})`,
          ...styles.wrapper
        }}
      >
        {this.props.children}
        {this.props.completed &&
          <div style={styles.overlay}>
            <i
              className="fa fa-check"
              style={styles.check}
            />
          </div>
        }
      </div>
    );
  }
}
