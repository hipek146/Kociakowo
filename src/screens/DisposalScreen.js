import React from "react";
import { Tabs } from "components/Tabs";
import { Form } from "components/Form";
import { List } from "components/List";
import { store } from "Store";
import { auth } from "auth";
import { signin } from "actions";

export class DisposalScreen extends React.Component {
  constructor() {
    super();
    this.state = { offers: <></>, licenses: <></>, history: <></> };
  }

  componentDidUpdate() {
    if (!this.stopUpdate) {
      this.update();
      this.stopUpdate = true;
    } else {
      this.stopUpdate = false;
    }
  }

  componentDidMount() {
    store.subscribe(this);
    this.update();
  }

  componentWillUnmount() {
    store.unsubscribe(this);
  }

  license(licenses) {
    return async function(id) {
      var events = [];
      if (id === 1) {
        await fetch("http://pascal.fis.agh.edu.pl:4012/exhibitions")
          .then(res => res.json())
          .then(json => {
            events = json;
          });
      }
      var form;
      const info = licenses[id - 1];
      var about;
      switch (id) {
        case 1:
          form = {
            Wystawa: {
              name: "wystawa_id",
              type: "combobox",
              combobox: events.map(el => {
                return { name: el.Nazwa, value: el.id };
              })
            }
          };
          about = (
            <span>
              Cena za wystawę: <b>{info.Cena}</b> PLN
            </span>
          );

          break;
        case 2:
          form = {
            "Data rozpoczęcia": { name: "data_rozpoczecia", type: "date" },
            "Data zakończenia": { name: "data_zakonczenia", type: "date" }
          };
          about = (
            <span>
              Cena za dzień: <b>{info.Cena}</b> PLN (minimum tydzień)
            </span>
          );

          break;
        case 3:
          form = {
            Ilość: { name: "ilosc", type: "number" }
          };
          about = (
            <span>
              Cena za sztukę: <b>{info.Cena}</b> PLN
            </span>
          );

          break;
        default:
          about = <></>;
      }

      const content = (
        <div className="flexCenter">
          {about}
          {store.get().user ? (
            <Form
              info={form}
              api="http://pascal.fis.agh.edu.pl:4012/buy/license"
              auth={"id=" + id + "&" + auth()}
              button="Kup"
              callback={() => {
                store.alert("Zakupiono licencje", "green", 2);
                signin();
              }}
            />
          ) : (
            <i>Zaloguj się, aby zakupić</i>
          )}
        </div>
      );
      this.setState({ content: content });
    };
  }

  offerContent(offers, flagBuy = true) {
    return function(id) {
      const info = offers.filter(el => el.id === id);
      const content = (
        <div className="flexCenter">
          <b>Opis:</b>
          <br />
          {info[0] && info[0].Opis}
          {flagBuy && (
            <Form
              button="Kup"
              api="http://pascal.fis.agh.edu.pl:4012/buy/cat"
              auth={"id=" + id + "&" + auth()}
              callback={() => {
                signin();
              }}
            />
          )}
        </div>
      );
      this.setState({ content: content });
    };
  }

  update = async () => {
    var licenses, offers, history;
    var result = {};
    var events = [];
    var cats = [];
    if (store.get().user) {
      await fetch("http://pascal.fis.agh.edu.pl:4012/exhibitions")
        .then(res => res.json())
        .then(json => {
          events = json;
        });
      await fetch(
        "http://pascal.fis.agh.edu.pl:4012/cats?" + store.get().user.id
      )
        .then(res => res.json())
        .then(json => {
          cats = json;
        });
    }
    await fetch("http://pascal.fis.agh.edu.pl:4012/licenseTypes")
      .then(res => res.json())
      .then(json => {
        result.licenses = json;
      });
    if (store.get().user) {
      await fetch("http://pascal.fis.agh.edu.pl:4012/licenses?" + auth())
        .then(res => res.json())
        .then(json => {
          result.myLicenses = json;
        });
    }
    await fetch("http://pascal.fis.agh.edu.pl:4012/transactions")
      .then(res => res.json())
      .then(json => {
        result.history = json;
      });

    await fetch("http://pascal.fis.agh.edu.pl:4012/offers")
      .then(res => res.json())
      .then(json => {
        result.offers = json;
      });
    const formsLicenses = {
      Nazwa: { name: "nazwa" },
      Opis: { name: "opis", type: "textarea" },
      Cena: { name: "cena", type: "number" }
    };
    const formsOffer = store.get().user && {
      Kot: {
        name: "kot_id",
        type: "combobox",
        combobox: cats.map(el => {
          return { name: el["Imię"], value: el.id };
        })
      },
      Opis: { name: "opis", type: "textarea" },
      Cena: { name: "cena", type: "number" },
      Wystawa: {
        name: "wystawa_id",
        type: "combobox",
        combobox: events.map(el => {
          return { name: el.Nazwa, value: el.id };
        })
      },
      Licencja: {
        name: "licencja_id",
        type: "combobox",
        combobox: result.myLicenses.map(el => {
          return { name: el.id, value: el.id };
        })
      }
    };

    licenses = (
      <>
        <List
          info={result.licenses}
          edit={store.get().user && store.get().user.admin && formsLicenses}
          exception={["id", "Cena"]}
          editApi={"http://pascal.fis.agh.edu.pl:4012/update/licenseTypes"}
          editAuth={auth()}
          editSpecialInfo={{
            Cena: id => result.licenses[id - 1].Cena
          }}
          content={this.license(result.licenses)}
        />
        {store.get().user && (
          <List
            title="Twoje licencje"
            info={result.myLicenses}
            exception={["wlasciciel_id", "typ"]}
            dateType="date"
          />
        )}
      </>
    );

    offers = (
      <>
        {store.get().user && (
          <>
            <Form
              info={formsOffer}
              api="http://pascal.fis.agh.edu.pl:4012/add/offer"
              auth={auth()}
              button="Dodaj ofertę"
            />
            <List
              title="Moje oferty"
              info={result.offers}
              exception={["id", "wlasciciel_id", "typ", "Opis"]}
              content={this.offerContent(result.offers, false)}
              deleteApi={
                "http://pascal.fis.agh.edu.pl:4012/delete/offer?" + auth()
              }
            />
          </>
        )}
        <List
          title="Wszystkie oferty"
          info={result.offers}
          exception={["id", "wlasciciel_id", "typ", "Opis"]}
          content={this.offerContent(result.offers)}
          deleteApi={
            store.get().user &&
            store.get().user.admin &&
            "http://pascal.fis.agh.edu.pl:4012/delete/offer?" + auth()
          }
        />
      </>
    );

    history = (
      <>
        <List info={result.history} exception={[]} />
      </>
    );

    this.setState({ offers: offers, licenses: licenses, history: history });
  };

  render() {
    const tabs = {
      Oferty: this.state.offers,
      Licencje: this.state.licenses,
      Historia: this.state.history
    };
    return (
      <div className="flexCenter">
        <Tabs info={tabs} callback={this.update} />
      </div>
    );
  }
}
