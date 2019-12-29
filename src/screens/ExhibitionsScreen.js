import React from "react";
import "styles/ExhibitionsScreen.css";
import { Form } from "components/Form";
import { List } from "components/List";
import { store } from "Store";
import { auth } from "auth";

export class ExhibitionsScreen extends React.PureComponent {
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

  updateExhibitions = () => {
    fetch("http://pascal.fis.agh.edu.pl:4012/exhibitions")
      .then(res => res.json())
      .then(json => {
        this.setState({ exhibitionsList: json });
      });
  };

  async exhibitionDetails(id) {
    store.alert("Wczytywanie", "black");
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
        name: "id",
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
            return { name: el.nazwa, value: el.typ_biletu_id };
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
        <List title="Konkursy" info={result.competitions} />
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
          <div key={"exhibitionTicket_" + index} className="exhibitionTicket">
            <div className="exhibitionTicketLeft">
              <div className="exhibitionTicketHeader">{element.Nazwa}</div>
              <div className="exhibitionTicketPrice">
                Cena: {element.Cena} PLN
                <div className="exhibitionTicketDescription">
                  {element.Opis}
                </div>
              </div>
            </div>
            <div>
              Kup bilet{" "}
              <input type="number" min="1" max="100" step="1" placeholder="1" />
            </div>
          </div>
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
        />
      </div>
    );
  }
}
