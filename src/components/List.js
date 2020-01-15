import React from "react";
import "styles/List.css";
import { date } from "functions/date";
import { Form } from "components/Form";
import { store } from "Store";

export class List extends React.Component {
  constructor() {
    super();
    this.state = { clicked: undefined, content: undefined };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !this.stopUpdate &&
      prevState.content === this.state.content &&
      this.state.clicked &&
      this.props.content &&
      !this.state.edit
    ) {
      this.props.content.call(this, this.state.clicked);
      this.stopUpdate = true;
    } else {
      this.stopUpdate = false;
    }
  }

  onClick = (element, content, edit, event) => {
    this.setState(
      {
        clicked:
          this.state.clicked === element.id &&
          ((this.state.edit && edit) || (this.state.content && content))
            ? undefined
            : element.id,
        content:
          this.state.clicked !== element.id || edit
            ? undefined
            : this.state.content,
        edit: edit
      },
      () => {
        !edit &&
          content &&
          !this.state.content &&
          content.call(this, element.id);
      }
    );
    event.stopPropagation();
  };

  render() {
    const {
      info,
      exception = ["id"],
      title,
      content,
      dateType = "full",
      edit,
      editApi,
      editAuth,
      editCallback,
      editSpecialInfo,
      deleteApi,
      deleteBy
    } = this.props;
    if (!Array.isArray(info) || !info[0]) return <></>;
    var header = Object.keys(info[0]).map(
      key =>
        !exception.includes(key) && (
          <div key={"list_header_" + key} className="listValue">
            {key}
          </div>
        )
    );
    if (edit) {
      header.push(
        <div key={"list_header_edite"} className="listHeaderOption">
          Edytuj
        </div>
      );
    }
    if (deleteApi) {
      header.push(
        <div key={"list_header_delete"} className="listHeaderOption">
          Usuń
        </div>
      );
    }
    const list = info.map((element, index) => {
      return (
        <React.Fragment key={"list_row_" + index}>
          <div
            onClick={this.onClick.bind(this, element, content, undefined)}
            className={
              "listRow" +
              (content ? " listRowClick" : "") +
              (content && this.state.clicked === element.id
                ? " listRowActive"
                : "")
            }
          >
            {Object.keys(element).map(
              (key, index) =>
                !exception.includes(key) && (
                  <div key={"list_" + index} className="listValue">
                    {date(element[key], dateType)}
                  </div>
                )
            )}
            {edit && (
              <div
                className="listOption listEdit"
                onClick={this.onClick.bind(this, element, undefined, edit)}
              >
                <b>#</b>
              </div>
            )}
            {deleteApi && (
              <div
                className="listOption"
                onClick={event => {
                  event.stopPropagation();
                  if (deleteBy && !element[deleteBy]) return;
                  fetch(
                    deleteApi +
                      "&id=" +
                      (deleteBy ? element[deleteBy] : element.id)
                  )
                    .then(res => res.json())
                    .then(json => {
                      store.alert(
                        json.text,
                        json.status === "successful" ? "green" : "red"
                      );
                      if (editCallback) {
                        editCallback();
                      } else {
                        store.update();
                      }
                    });
                }}
              >
                <b>X</b>
              </div>
            )}
          </div>
          {this.state.clicked === element.id &&
            (this.state.content || this.state.edit) && (
              <div className="listContent">
                {this.state.edit ? (
                  <div className="flexCenter">
                    <h2>Tryb edycji</h2>
                    <Form
                      info={edit}
                      button="Edytuj"
                      callback={editCallback}
                      editSpecialInfo={editSpecialInfo}
                      api={editApi}
                      auth={"id=" + element.id + "&" + editAuth}
                      edit={element}
                    />
                  </div>
                ) : (
                  this.state.content
                )}
              </div>
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
