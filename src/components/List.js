import React from "react";
import "styles/List.css";
import { date } from "functions/date";

export class List extends React.PureComponent {
  constructor() {
    super();
    this.state = { clicked: undefined, content: undefined };
  }
  render() {
    const {
      info,
      exception = ["id"],
      title,
      content,
      dateType = "full"
    } = this.props;
    if (!Array.isArray(info) || !info[0]) return <></>;
    const header = Object.keys(info[0]).map(
      key =>
        !exception.includes(key) && (
          <div key={"list_header_" + key} className="listValue">
            {key}
          </div>
        )
    );
    const list = info.map((element, index) => {
      return (
        <React.Fragment key={"list_row_" + index}>
          <div
            onClick={() => {
              this.setState(
                {
                  clicked:
                    this.state.clicked === element.id ? undefined : element.id,
                  content:
                    this.state.clicked !== element.id
                      ? undefined
                      : this.state.content
                },
                () => {
                  content &&
                    !this.state.content &&
                    content.call(this, element.id);
                }
              );
            }}
            className={
              "listRow" +
              (content ? " listRowClick" : "") +
              (content && this.state.clicked === element.id
                ? " listRowActive"
                : "")
            }
          >
            {Object.keys(element).map(
              key =>
                !exception.includes(key) && (
                  <div
                    key={"list_" + key + "_" + element[key]}
                    className="listValue"
                  >
                    {date(element[key], dateType)}
                  </div>
                )
            )}
          </div>
          {this.state.clicked === element.id && this.state.content && (
            <div className="listContent">{this.state.content}</div>
          )}
        </React.Fragment>
      );
    });
    return (
      <div className="listMargin">
        <div className="listWrapper">
          {title && <div className="listHeader">{title}</div>}
          <div className="list">
            <div className="listRow">{header}</div>
            {list}
          </div>
        </div>
      </div>
    );
  }
}
