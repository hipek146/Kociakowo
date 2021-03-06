import React from "react";
import { store } from "Store";

export class Alert extends React.PureComponent {
  constructor() {
    super();
    this.state = { text: "", color: "black", alpha: 0 };
  }
  update = (text, color, index = 1) => {
    if ((this.interval || this.timeout) && this.state.index > index) return;
    clearTimeout(this.timeout);
    clearInterval(this.interval);
    this.setState({ text: text, color: color, alpha: 1, index: index }, () => {
      this.timeout = setTimeout(() => {
        clearInterval(this.interval);
        this.interval = setInterval(
          () =>
            this.setState({ alpha: this.state.alpha - 0.05 }, () => {
              if (this.state.alpha <= 0) {
                clearInterval(this.interval);
                this.interval = null;
              }
            }),
          30
        );
        this.timeout = null;
      }, 2000);
    });
  };
  componentDidMount() {
    store.subscribeAlert(this);
  }

  render() {
    const style = {
      position: "fixed",
      top: "10px",
      left: "50%",
      transform: "translate(-50%)",
      zIndex: "100",
      margin: "auto",
      padding: "10px",
      paddingLeft: "60px",
      paddingRight: "60px",
      border: "1px solid",
      boxShadow: "0px 0px 6px 0px",
      fontSize: "17px",
      fontWeight: "bold",
      backgroundColor: "#ede4d1",
      color: this.state.color,
      opacity: this.state.alpha
    };
    return <div style={style}>{this.state.text}</div>;
  }
}
