import React from "react";
import { Tabs } from "components/Tabs";
import { Form } from "components/Form";
import { List } from "components/List";
import { auth } from "auth";

export class TicketsScreen extends React.PureComponent {
  constructor() {
    super();
    this.state = { tickets: <></>, transactions: <></> };
  }

  componentDidMount() {
    this.update();
  }

  update = async () => {
    var tickets;
    var result;
    await fetch("http://pascal.fis.agh.edu.pl:4012/tickets")
      .then(res => res.json())
      .then(json => {
        result = json;
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
        {<List info={result} />}
      </>
    );
    this.setState({ tickets: tickets });
  };

  render() {
    const tabs = {
      Bilety: this.state.tickets,
      Transakcje: this.state.transactions
    };
    return (
      <div className="flexCenter">
        <Tabs info={tabs} />
      </div>
    );
  }
}
