import React from "react";
import "styles/Form.css";
import { store } from "Store";

export class Form extends React.PureComponent {
  constructor() {
    super();
    this.elements = {};
  }
  comboboxCallback = (info, event) => {
    if (!info.callback) return;
    fetch(info.callback.api + event.target.value)
      .then(res => res.json())
      .then(json => {
        this.elements[info.callback.name].options.length = 0;
        this.elements[info.callback.name].options[0] = new Option("Brak", null);
        json.forEach(
          (element, index) =>
            (this.elements[info.callback.name].options[index + 1] = new Option(
              element["Imię"],
              element.id
            ))
        );
      });
  };

  setDate(value) {
    value = new Date(value);
    return (
      value.getFullYear() +
      "-" +
      (value.getMonth() < 9 ? "0" : "") +
      (value.getMonth() + 1) +
      "-" +
      (value.getDate() < 10 ? "0" : "") +
      value.getDate()
    );
  }

  setTime(value) {
    value = new Date(value);
    return (
      value.getHours() +
      ":" +
      (value.getMinutes() < 10 ? "0" : "") +
      value.getMinutes()
    );
  }
  componentDidMount() {
    this.componentUpdate();
  }
  componentDidUpdate() {
    this.componentUpdate();
  }
  componentUpdate() {
    const { info, editSpecialInfo } = this.props;
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("change", false, true);
    if (!info) return;
    Object.keys(info).forEach(key => {
      if (info[key].type === "combobox" && info[key].combobox[0])
        this.comboboxCallback(info[key], {
          target: { value: info[key].combobox[0].value }
        });
      if (this.props.edit) {
        this.elements[key].value =
          info[key].type === "date"
            ? this.setDate(this.props.edit[key])
            : this.props.edit[key];
        if (info[key].type === "datetime") {
          this.elements[key].date.value = this.setDate(this.props.edit[key]);
          this.elements[key].time.value = this.setTime(this.props.edit[key]);
        }
      }
    });
    if (editSpecialInfo) {
      Object.keys(editSpecialInfo).forEach(key => {
        let fun = async () => {
          this.elements[key].value = await editSpecialInfo[key](
            this.props.edit.id
          );
        };
        fun();
      });
    }
  }

  render() {
    const { info, button, api, keyName, callback, auth, edit } = this.props;
    if (info)
      var forms = Object.keys(info).map(key => (
        <span key={keyName + "_" + key}>
          <div className="formLabel">{key} : </div>
          {info[key].type === "textarea" ? (
            <textarea ref={el => (this.elements[key] = el)} />
          ) : info[key].type === "combobox" ? (
            <select
              ref={el => (this.elements[key] = el)}
              onChange={this.comboboxCallback.bind(this, info[key])}
            >
              {info[key].combobox.map(element => (
                <option
                  key={"form_option_" + element.value}
                  value={element.value}
                >
                  {element.name}
                </option>
              ))}
            </select>
          ) : info[key].type === "datetime" ? (
            <span className="formDatatime">
              <input
                type="date"
                ref={el => {
                  this.elements[key] = {};
                  this.elements[key].date = el;
                }}
              />
              <input
                type="time"
                ref={el => {
                  this.elements[key].time = el;
                }}
              />
            </span>
          ) : info[key].type === "number" ? (
            <input
              type="number"
              min="0"
              step="any"
              ref={el => (this.elements[key] = el)}
            />
          ) : (
            <input
              type={info[key].type ? info[key].type : "text"}
              ref={el => (this.elements[key] = el)}
            />
          )}
        </span>
      ));
    return (
      <div className="form">
        {forms}
        <span
          className="formButton"
          onClick={() => {
            fetch(
              api +
                "?" +
                (info
                  ? Object.keys(info)
                      .map(
                        key =>
                          info[key].name +
                          "=" +
                          (this.elements[key].date
                            ? this.elements[key].date.value +
                              " " +
                              this.elements[key].time.value +
                              ":00"
                            : this.elements[key].value)
                      )
                      .join("&") + "&"
                  : "") +
                (auth ? auth : "")
            )
              .then(res => {
                if (!res.ok) {
                  throw Error(res.statusText);
                }
                return res.json();
              })
              .then(json => {
                if (json.status === "successful") {
                  store.alert(json.text, "green", 2);
                  if (!edit && info) {
                    Object.keys(info).forEach(
                      key => (this.elements[key].value = "")
                    );
                  }
                } else if (json.status === "error") {
                  store.alert(json.text, "red");
                }
                callback && callback(json);
                store.update();
              })
              .catch(error => {
                callback && callback();
                if (error.name === "TypeError") {
                  store.alert("Błąd połączenia!", "red");
                } else {
                  store.alert(error.toString(), "red");
                }
              });
          }}
        >
          {button}
        </span>
      </div>
    );
  }
}
