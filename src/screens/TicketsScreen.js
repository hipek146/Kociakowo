import React from "react";
import { Tabs } from "components/Tabs";
import { Form } from "components/Form";
import { List } from "components/List";
import { store } from "Store";
import { auth } from "auth";

export class TicketsScreen extends React.Component {
  constructor() {
    super();
    this.state = { tickets: <></>, transactions: <></> };
    if (!store.get().user) store.navigate("/");
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
    this.update();
  }

  update = async () => {
    if (!store.get().user) {
      store.navigate("/");
      return;
    }
    var tickets, transations;
    var result = {};
    await fetch("http://pascal.fis.agh.edu.pl:4012/tickets")
      .then(res => res.json())
      .then(json => {
        result.tickets = json;
      });

    await fetch(
      "http://pascal.fis.agh.edu.pl:4012/ticketsTransactions?" + auth()
    )
      .then(res => res.json())
      .then(json => {
        result.transations = json;
      });

    const formsTickets = {
      Nazwa: { name: "nazwa" },
      Opis: { name: "opis", type: "textarea" }
    };
    tickets = (
      <>
        <Form
          info={formsTickets}
          button="Dodaj bilet"
          api="http://pascal.fis.agh.edu.pl:4012/add/ticket"
          auth={auth()}
        />
        {
          <List
            info={result.tickets}
            edit={formsTickets}
            exception={[]}
            editApi={"http://pascal.fis.agh.edu.pl:4012/update/ticket"}
            editAuth={auth()}
            deleteApi={
              "http://pascal.fis.agh.edu.pl:4012/delete/ticket?" + auth()
            }
          />
        }
      </>
    );
    transations = <List info={result.transations} />;
    this.setState({ tickets: tickets, transations: transations });
  };

  render() {
    const tabs = {
      Bilety: this.state.tickets,
      Transakcje: this.state.transations
    };
    return (
      <div className="flexCenter">
        <Tabs info={tabs} callback={this.update} />
      </div>
    );
  }
}
