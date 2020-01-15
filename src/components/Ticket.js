import React from "react";
import "styles/Ticket.css";
import { store } from "Store";
import { signin } from "actions";

export class Ticket extends React.Component {
  constructor() {
    super();
    this.state = { value: 1 };
  }

  onChange = event => {
    this.setState({ value: event.target.value });
  };

  buy = async () => {
    await fetch(this.props.api + "&ilosc=" + this.state.value)
      .then(res => res.json())
      .then(json => {
        if (json.status === "successful") {
          store.alert("Zakupiono bilet", "green", 2);
          signin();
          store.update();
        }
      });
  };

  delete = async () => {
    await fetch(this.props.deleteApi)
      .then(res => res.json())
      .then(json => {
        if (json.status === "successful") {
          store.alert("Usunięto bilet", "green");
          store.update();
        }
      });
  };

  render() {
    const { Nazwa, Cena, Opis, Posiadane } = this.props;
    return (
      <div className="ticket">
        <div className="ticketLeft">
          <div className="ticketHeader">
            {Nazwa}
            {store.get().user && store.get().user.admin && (
              <div className="ticketButton" onClick={this.delete}>
                Usuń
              </div>
            )}
          </div>
          <div className="ticketPrice">
            Cena: {Cena} PLN
            <div className="ticketDescription">{Opis}</div>
          </div>
        </div>
        {store.get().user ? (
          <div className="ticketRight">
            <div className="ticketUp">
              <div className="ticketBuy">Kup</div>
              <input
                className="ticketInput"
                type="number"
                min="1"
                max="100"
                step="1"
                value={this.state.value}
                onChange={this.onChange}
              />
              <div className="ticketButton" onClick={this.buy}>
                Potwierdź
              </div>
            </div>
            <div className="ticketOwn">
              Posiadasz: <b>{Posiadane}</b>
            </div>
          </div>
        ) : (
          <div className="ticketRight">
            <i>Zaloguj się by kupic bilet</i>
          </div>
        )}
      </div>
    );
  }
}
