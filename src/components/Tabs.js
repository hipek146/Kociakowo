import React from "react";
import "styles/Tabs.css";

export class Tabs extends React.PureComponent {
  constructor() {
    super();
    this.state = { content: undefined };
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props)
      this.setState({
        content: Object.values(this.props.info)[0],
        active: Object.keys(this.props.info)[0]
      });
  }

  render() {
    const { info } = this.props;
    return (
      <>
        <div className="tabs">
          {Object.keys(info).map(key => (
            <div
              className={
                "tabsButton" +
                (key === this.state.active ? " tabsButtonActive" : "")
              }
              onClick={() => this.setState({ content: info[key], active: key })}
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
