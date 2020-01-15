import React from "react";
import "styles/CatsScreen.css";
import { Form } from "components/Form";
import { List } from "components/List";
import { store } from "Store";
import { auth } from "auth";
import { Tabs } from "components/Tabs";

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
    this.update();
  }

  componentWillUnmount() {
    store.unsubscribe(this);
  }

  componentDidUpdate() {
    if (!this.stopUpdate) {
      this.update();
      this.stopUpdate = true;
    } else {
      this.stopUpdate = false;
    }
    var loggedStatus = store.get().user ? true : false;
    if (loggedStatus !== this.state.logged) {
      this.setState({ logged: loggedStatus }, () => this.updateCats());
    }
  }

  updateCats = () => {
    fetch(
      "http://pascal.fis.agh.edu.pl:4012/cats?breed=" +
        (this.select ? this.select.value : "") +
        "&name=" +
        (this.input ? this.input.value : "")
    )
      .then(res => res.json())
      .then(json => {
        this.setState({ catsList: json });
      });

    fetch("http://pascal.fis.agh.edu.pl:4012/breeds")
      .then(res => res.json())
      .then(json => {
        this.setState({ breedList: json });
      });

    this.state.logged &&
      fetch(
        "http://pascal.fis.agh.edu.pl:4012/cats?id=" +
          store.get().user.id +
          "&breed=" +
          (this.select ? this.select.value : "") +
          "&name=" +
          (this.input ? this.input.value : "")
      )
        .then(res => res.json())
        .then(json => {
          this.setState({ yourCatsList: json });
        });
  };

  closeForm = () => {
    this.setState({ hideForm: true }, this.updateCats);
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

  update = () => {
    const forms = {
      Imię: { name: "imie" },
      Rasa: { name: "rasa" },
      "Data urodzenia": { name: "data_urodzenia", type: "date" }
    };
    const cats = (
      <>
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
        <div className="catsSearch">
          Imię:
          <input ref={el => (this.input = el)} />
          Rasa:
          <select ref={el => (this.select = el)}>
            <option key={"form_option_"} value={""}>
              Wszystkie
            </option>
            {this.state.breedList &&
              this.state.breedList.map(element => (
                <option key={"form_option_" + element.id}>
                  {element.Nazwa}
                </option>
              ))}
          </select>
          <div className="catsButton" onClick={this.updateCats}>
            Wyszukaj
          </div>
        </div>
        {this.state.logged ? (
          <List
            title="Twoje koty"
            info={this.state.yourCatsList}
            dateType="date"
            content={this.rasa}
            edit={forms}
            editApi={"http://pascal.fis.agh.edu.pl:4012/update/cat"}
            editAuth={auth()}
            editCallback={this.updateCats}
            deleteApi={"http://pascal.fis.agh.edu.pl:4012/delete/cat?" + auth()}
          />
        ) : (
          <div className="catsLogout">Zaloguj się by zarejestrować koty</div>
        )}
        {store.get().user && store.get().user.admin ? (
          <List
            key="allCats_1"
            title="Wszystkie koty"
            info={this.state.catsList}
            dateType="date"
            content={this.rasa}
            edit={forms}
            editApi={"http://pascal.fis.agh.edu.pl:4012/update/cat"}
            editAuth={auth()}
            editCallback={this.updateCats}
            deleteApi={"http://pascal.fis.agh.edu.pl:4012/delete/cat?" + auth()}
          />
        ) : (
          <List
            key="allCats_2"
            info={this.state.catsList}
            dateType="date"
            content={this.rasa}
          />
        )}
      </>
    );

    const breedList = this.state.breedList;
    const formsBreed = {
      Nazwa: { name: "nazwa" },
      Opis: { name: "opis", type: "textarea" }
    };
    const breed = (
      <List
        info={breedList}
        exception={["id", "Opis"]}
        content={function(id) {
          const about = breedList.filter(el => el.id === id)[0].Opis;
          this.setState({
            content: about ? about : "Brak opisu"
          });
        }}
        edit={store.get().user && store.get().user.admin && formsBreed}
        editSpecialInfo={{
          Opis: id => breedList.filter(el => el.id === id)[0].Opis
        }}
        editApi={"http://pascal.fis.agh.edu.pl:4012/update/breed"}
        editAuth={auth()}
        deleteApi={
          store.get().user &&
          store.get().user.admin &&
          "http://pascal.fis.agh.edu.pl:4012/delete/breed?" + auth()
        }
        editCallback={this.updateCats}
      />
    );
    this.setState({ cats: cats, breed: breed });
  };
  render() {
    const tabs = {
      Koty: this.state.cats,
      Rasy: this.state.breed
    };
    return (
      <div className="flexCenter">
        <Tabs info={tabs} callback={this.update} />
      </div>
    );
  }
}
