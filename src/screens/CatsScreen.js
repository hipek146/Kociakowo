import React from "react";
import "styles/CatsScreen.css";
import { Form } from "components/Form";
import { List } from "components/List";
import { store } from "Store";
import { auth } from "auth";

export class CatsScreen extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      hideForm: true,
      catsList: [],
      yourCatsList: [],
      logged: store.get().user ? true : false
    };
  }
  componentDidMount() {
    store.subscribe(this);
    this.updateCats();
  }

  componentWillUnmount() {
    store.unsubscribe(this);
  }

  componentDidUpdate() {
    var loggedStatus = store.get().user ? true : false;
    if (loggedStatus !== this.state.logged) {
      this.setState({ logged: loggedStatus }, () => this.updateCats());
    }
  }

  updateCats = () => {
    fetch("http://pascal.fis.agh.edu.pl:4012/cats")
      .then(res => res.json())
      .then(json => {
        this.setState({ catsList: json });
      });

    this.state.logged &&
      fetch("http://pascal.fis.agh.edu.pl:4012/cats?id=" + store.get().user.id)
        .then(res => res.json())
        .then(json => {
          this.setState({ yourCatsList: json });
        });
  };

  closeForm = () => {
    this.setState({ hideForm: true });
  };
  async rasa(id) {
    var result;
    await fetch("http://pascal.fis.agh.edu.pl:4012/breed?id=" + id)
      .then(res => res.json())
      .then(json => {
        result = json;
      });
    result = (
      <div className="catsRasy">
        <div className="catsRasyHeader">{result[0].Nazwa}</div>
        <div className="catsRasyContent">
          {result[0].Opis ? result[0].Opis : "Brak opisu"}
        </div>
      </div>
    );
    this.setState({ content: result });

    return result;
  }
  render() {
    const forms = {
      Imię: { name: "imie" },
      Rasa: { name: "rasa" },
      "Data urodzenia": { name: "data_urodzenia", type: "date" }
    };
    return (
      <div className="flexCenter">
        {this.state.hideForm ? (
          store.get().user && (
            <div
              className="formButton"
              onClick={() => this.setState({ hideForm: false })}
            >
              Zarejestruj kota
            </div>
          )
        ) : (
          <Form
            info={forms}
            button="Zarejestruj kota"
            callback={this.closeForm}
            api="http://pascal.fis.agh.edu.pl:4012/add/cat"
            auth={auth()}
          />
        )}
        {this.state.logged ? (
          <List
            title="Twoje koty"
            info={this.state.yourCatsList}
            dateType="date"
            content={this.rasa}
          />
        ) : (
          <div className="catsLogout">Zaloguj się by zarejestrować koty</div>
        )}
        <List
          title="Wszystkie koty"
          info={this.state.catsList}
          dateType="date"
        />
      </div>
    );
  }
}
