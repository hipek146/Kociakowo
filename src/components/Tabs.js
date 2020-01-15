import React from "react";
import "styles/Tabs.css";

export class Tabs extends React.PureComponent {
  constructor() {
    super();
    this.state = { content: undefined, active: 0 };
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({
        content: Object.values(this.props.info)[this.state.active]
      });
    }
  }

  render() {
    const { info } = this.props;
    return (
      <>
        <div className="tabs">
          {Object.keys(info).map((key, index) => (
            <div
              key={"tab_" + index}
              className={
                "tabsButton" +
                (index === this.state.active ? " tabsButtonActive" : "")
              }
              onClick={() =>
                this.setState(
                  { content: info[key], active: index },
                  this.props.callback
                )
              }
            >
              {key}
            </div>
          ))}
        </div>
        {this.state.content}
      </>
    );
  }
}
