import React from "react";
import "styles/Form.css";
import { store } from "Store";

export class Form extends React.PureComponent {
  constructor() {
    super();
    this.elements = {};
  }

  render() {
    const { info, button, api, keyName, callback, auth } = this.props;
    var forms = Object.keys(info).map(key => (
      <span key={keyName + "_" + key}>
        <div className="formLabel">{key} : </div>
        {info[key].type === "textarea" ? (
          <textarea ref={el => (this.elements[key] = el)} />
        ) : info[key].type === "combobox" ? (
          <select ref={el => (this.elements[key] = el)}>
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
                Object.keys(info)
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
                  .join("&") +
                "&" +
                (auth ? auth : "")
            )
              .then(res => {
                if (!res.ok) {
                  throw Error(res.statusText);
                }
                return res.json();
              })
              .then(json => {
                console.log(json);
                if (json.status === "successful") {
                  store.alert(json.text, "green");
                  Object.keys(info).forEach(
                    key => (this.elements[key].value = "")
                  );
                } else if (json.status === "error") {
                  store.alert(json.text, "red");
                }
                callback && callback(json);
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
