import React from "react";
import "styles/Header.css";
import { store } from "Store";
import { signin } from "actions";

export class Header extends React.PureComponent {
  send = () => {
    signin(this.login.value, this.haslo.value);
  };

  componentDidMount() {
    store.subscribe(this);
  }

  componentWillUnmount() {
    store.unsubscribe(this);
  }

  render() {
    const user = store.get().user;
    const links = {
      "/": "Strona głowna",
      wystawy: "Wystawy",
      koty: "Koty",
      sprzedaz: "Sprzedaż"
    };
    if (user && user.admin) {
      Object.assign(links, { wlasciciele: "Właściciele", bilety: "Bilety" });
    }

    var hrefs = Object.keys(links).map(key => (
      <span
        className={
          "headerButton" +
          (store.get().target === key ? " headerButtonPressed" : "")
        }
        key={"header_link_" + key}
        onClick={() => store.navigate(key)}
      >
        {links[key]}
      </span>
    ));

    var accountInfo = user ? (
      <>
        <span className="headerAccount" onClick={() => store.navigate("konto")}>
          {user.imie} {user.nazwisko}
          <span className="headerWallet">
            {String(user.portfel).replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, " ")}{" "}
            PLN
          </span>
        </span>
        <span
          className="headerAccount"
          onClick={() => {
            const date = new Date();
            date.setTime(date.getMonth() - 1);
            document.cookie = `login=; expires=${date.toGMTString()}`;
            document.cookie = `haslo=; expires=${date.toGMTString()}`;
            store.set("user", undefined);
            store.set("login", undefined);
            store.set("haslo", undefined);
            store.alert("Wylogowano", "black");
          }}
        >
          Wyloguj
        </span>
      </>
    ) : (
      <>
        <input type="text" placeholder="login" ref={el => (this.login = el)} />
        <input
          type="password"
          placeholder="hasło"
          ref={el => (this.haslo = el)}
          onKeyDown={event => {
            if (event.keyCode === 13) this.send();
          }}
        />
        <span onClick={this.send}>Zaloguj</span>
        <span onClick={() => store.navigate("rejestracja")}>Rejestracja</span>
      </>
    );

    return (
      <div className="header">
        <div className="headerBar">
          <div>Kociakowo</div>
          <div className="headerMenu">{hrefs}</div>
          <div className="headerLogin">{accountInfo}</div>
        </div>
      </div>
    );
  }
}
