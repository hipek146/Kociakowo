import React from "react";
import "styles/ExhibitionsScreen.css";
import { Form } from "components/Form";
import { List } from "components/List";
import { Ticket } from "components/Ticket";
import { store } from "Store";
import { auth } from "auth";

export class ExhibitionsScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      exhibitionsList: [],
      logged: store.get().user ? true : false
    };
  }
  componentDidMount() {
    store.subscribe(this);
    this.updateExhibitions();
  }

  componentWillUnmount() {
    store.unsubscribe(this);
  }

  componentDidUpdate() {
    if (!this.stopUpdate) {
      this.updateExhibitions();
      this.stopUpdate = true;
    } else {
      this.stopUpdate = false;
    }
  }

  updateExhibitions = () => {
    fetch(
      "http://pascal.fis.agh.edu.pl:4012/exhibitions" +
        (store.get().user && store.get().user.admin ? "?" + auth() : "")
    )
      .then(res => res.json())
      .then(json => {
        this.setState({ exhibitionsList: json });
      });
  };

  async editSpecialInfo(id) {
    var result;
    var res = await fetch(
      "http://pascal.fis.agh.edu.pl:4012/exhibitionDetails?id=" + id
    );
    var json = await res.json();
    result = json[0].Opis;

    return result;
  }

  async exhibitionDetails(id) {
    store.alert("Wczytywanie", "black", 0);

    const addReward = async function(id) {
      var toReturn = {};
      var result = {};

      await fetch("http://pascal.fis.agh.edu.pl:4012/rewards?id=" + id)
        .then(res => res.json())
        .then(json => {
          result.rewards = json;
        });

      await fetch("http://pascal.fis.agh.edu.pl:4012/users?" + auth())
        .then(res => res.json())
        .then(json => {
          result.users = json;
        });

      const formsReward = {
        Miejsce: { name: "miejsce", type: "number" },
        Opis: { name: "opis", type: "textarea" }
      };

      var comboRewards = result.rewards.filter((element, index, array) => {
        let res = true;
        array.forEach((el, i) => {
          if (el.Miejsce === element.Miejsce && i < index) res = false;
        });
        return res;
      });

      comboRewards = comboRewards.map(el => {
        return {
          name: el.Miejsce + ". " + el.Opis,
          value: comboRewards.filter(
            element => element.Miejsce === el.Miejsce
          )[0].id
        };
      });

      const formsWinner = {
        Właściciel: {
          name: "wlasciciel",
          type: "combobox",
          combobox: result.users.map(el => {
            return {
              name: el.wlasciciel_id + ": " + el.imie + " " + el.nazwisko,
              value: el.wlasciciel_id
            };
          }),
          callback: {
            api: "http://pascal.fis.agh.edu.pl:4012/cats?id=",
            name: "Kot",
            value: "kot"
          }
        },
        Kot: { name: "kot", type: "combobox", combobox: [] },
        Miejsce: {
          name: "id",
          type: "combobox",
          combobox: comboRewards
        }
      };

      toReturn = (
        <div className="flexCenter">
          {store.get().user && store.get().user.admin && (
            <>
              <Form
                info={formsReward}
                api="http://pascal.fis.agh.edu.pl:4012/add/reward"
                auth={"id=" + id + "&" + auth()}
                button="Dodaj nagrodę"
              />
              <Form
                info={{
                  Miejsce: {
                    name: "id",
                    type: "combobox",
                    combobox: comboRewards
                  }
                }}
                api="http://pascal.fis.agh.edu.pl:4012/delete/reward"
                auth={auth()}
                button="Usuń nagrodę"
              />
            </>
          )}
          <List
            title="Nagrody"
            info={result.rewards}
            exception={["id", "zwyciezca_id", "Konkurs"]}
            deleteApi={
              store.get().user &&
              store.get().user.admin &&
              "http://pascal.fis.agh.edu.pl:4012/delete/winner?" + auth()
            }
            deleteBy={"zwyciezca_id"}
          />
          {store.get().user && store.get().user.admin && (
            <Form
              info={formsWinner}
              api="http://pascal.fis.agh.edu.pl:4012/add/winner"
              auth={auth()}
              button="Dodaj Zwycięzcę"
            />
          )}
        </div>
      );

      this.setState({ content: toReturn });
    };

    var toReturn = {};
    var result = {};
    await fetch("http://pascal.fis.agh.edu.pl:4012/exhibitionDetails?id=" + id)
      .then(res => res.json())
      .then(json => {
        result.Opis = json[0].Opis;
      });
    await fetch("http://pascal.fis.agh.edu.pl:4012/events?id=" + id)
      .then(res => res.json())
      .then(json => {
        result.events = json;
      });
    await fetch("http://pascal.fis.agh.edu.pl:4012/competitions?id=" + id)
      .then(res => res.json())
      .then(json => {
        result.competitions = json;
      });
    await fetch("http://pascal.fis.agh.edu.pl:4012/ticketCompetition?id=" + id)
      .then(res => res.json())
      .then(json => {
        result.tickets = json;
      });
    if (store.get().user)
      await fetch(
        "http://pascal.fis.agh.edu.pl:4012/myTickets?id=" + id + "&" + auth()
      )
        .then(res => res.json())
        .then(json => {
          result.myTickets = json;
        });
    if (store.get().user && store.get().user.admin)
      await fetch("http://pascal.fis.agh.edu.pl:4012/tickets")
        .then(res => res.json())
        .then(json => {
          result.ticketTypes = json;
        });

    const formsEvent = {
      Nazwa: { name: "nazwa" },
      Miejsce: { name: "miejsce" },
      "Data rozpoczęcia": { name: "data_rozpoczecia", type: "datetime" },
      "Data zakończenia": { name: "data_zakonczenia", type: "datetime" },
      Opis: { name: "opis", type: "textarea" }
    };
    const formsCompetition = {
      Nazwa: { name: "nazwa" },
      Opis: { name: "opis", type: "textarea" },
      Wydarzenie: {
        name: "wydarzenie_id",
        type: "combobox",
        combobox: result.events.map(el => {
          return { name: el.Nazwa, value: el.id };
        })
      }
    };
    const formsTickets = store.get().user &&
      store.get().user.admin && {
        Cena: { name: "cena" },
        Typ: {
          name: "typ_biletu_id",
          type: "combobox",
          combobox: result.ticketTypes.map(el => {
            return { name: el.Nazwa, value: el.id };
          })
        }
      };

    toReturn = (
      <div className="exhibitionDetails">
        <div className="exhibitionHeader">Opis</div>
        <div className="exhibitionDetailsDescription">
          {result.Opis ? result.Opis : "Brak opisu"}
        </div>
        {store.get().user && store.get().user.admin && (
          <div className="flexCenter">
            <Form
              info={formsEvent}
              button="Dodaj wydarzenie"
              api="http://pascal.fis.agh.edu.pl:4012/add/event"
              auth={"id=" + id + "&" + auth()}
            />
          </div>
        )}
        <List
          title="Wydarzenia"
          info={result.events}
          exception={["id", "Opis"]}
          content={function(id) {
            var content;
            for (let element of result.events) {
              if (element.id === id) {
                content = element.Opis;
                break;
              }
            }
            this.setState({ content: content });
          }}
          edit={formsEvent}
          editApi={"http://pascal.fis.agh.edu.pl:4012/update/event"}
          editAuth={auth()}
          deleteApi={"http://pascal.fis.agh.edu.pl:4012/delete/event?" + auth()}
        />
        {store.get().user && store.get().user.admin && (
          <div className="flexCenter">
            <Form
              info={formsCompetition}
              button="Dodaj konkurs"
              api="http://pascal.fis.agh.edu.pl:4012/add/competition"
              auth={auth()}
            />
          </div>
        )}
        <List
          title="Konkursy"
          info={result.competitions}
          content={addReward}
          edit={formsCompetition}
          editApi={"http://pascal.fis.agh.edu.pl:4012/update/competition"}
          editAuth={auth()}
          deleteApi={
            "http://pascal.fis.agh.edu.pl:4012/delete/competition?" + auth()
          }
        />
        {store.get().user && store.get().user.admin && (
          <div className="flexCenter">
            <Form
              info={formsTickets}
              button="Dodaj bilet"
              api="http://pascal.fis.agh.edu.pl:4012/add/ticketCompetition"
              auth={"id=" + id + "&" + auth()}
            />
          </div>
        )}
        <br />
        <div className="exhibitionHeader">Bilety</div>
        {result.tickets.map((element, index) => (
          <Ticket
            key={"ticket_" + index}
            Nazwa={element.Nazwa}
            Cena={element.Cena}
            Opis={element.Opis}
            api={
              "http://pascal.fis.agh.edu.pl:4012/buy/ticket?id=" +
              element.id +
              "&" +
              auth()
            }
            deleteApi={
              "http://pascal.fis.agh.edu.pl:4012/delete/ticketCompetition?id=" +
              element.id +
              "&" +
              auth()
            }
            Posiadane={
              result.myTickets &&
              result.myTickets.filter(el => el.bilet_id === element.id).length
            }
          />
        ))}
      </div>
    );
    this.setState({ content: toReturn });

    return toReturn;
  }

  render() {
    const forms = {
      Nazwa: { name: "nazwa" },
      Miasto: { name: "miasto" },
      Adres: { name: "adres" },
      "Data Rozpoczęcia": { name: "data_rozpoczecia", type: "datetime" },
      "Data Zakończenia": { name: "data_zakonczenia", type: "datetime" },
      Koszt: { name: "koszt" },
      Opis: { name: "opis", type: "textarea" }
    };
    const user = store.get().user;
    var editForms;
    if (user && user.admin) {
      editForms = {
        Nazwa: { name: "nazwa" },
        Miasto: { name: "miasto" },
        Adres: { name: "adres" },
        Rozpoczęcie: { name: "data_rozpoczecia", type: "datetime" },
        Zakończenie: { name: "data_zakonczenia", type: "datetime" },
        Koszt: { name: "koszt" },
        Opis: { name: "opis", type: "textarea" }
      };
    }
    return (
      <div className="flexCenter">
        {user && user.admin && (
          <span>
            <Form
              info={forms}
              button="Utwórz wystawę"
              api="http://pascal.fis.agh.edu.pl:4012/add/exhibition"
              auth={auth()}
            />
          </span>
        )}
        <List
          title="Wystawy"
          info={this.state.exhibitionsList}
          content={this.exhibitionDetails}
          edit={editForms}
          editApi={"http://pascal.fis.agh.edu.pl:4012/update/exhibition"}
          editAuth={auth()}
          editSpecialInfo={{ Opis: this.editSpecialInfo }}
          deleteApi={
            user &&
            user.admin &&
            "http://pascal.fis.agh.edu.pl:4012/delete/exhibition?" + auth()
          }
        />
      </div>
    );
  }
}
