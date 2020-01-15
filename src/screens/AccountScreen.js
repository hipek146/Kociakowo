import React from "react";
import { Form } from "components/Form";
import { store } from "Store";
import { auth } from "auth";
import { signin } from "actions";

export class AccountScreen extends React.Component {
  constructor() {
    super();
    this.state = { content: <></> };
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
    store.subscribe(this);
    this.update();
  }

  componentWillUnmount() {
    store.unsubscribe(this);
  }
  update = () => {
    if (!store.get().user) {
      store.navigate("/");
      return;
    }
    var forms = {
      Imię: { name: "imie" },
      Nazwisko: { name: "nazwisko" }
    };
    const content = (
      <>
        <Form
          info={forms}
          button="Edytuj"
          api="http://pascal.fis.agh.edu.pl:4012/update/account"
          auth={auth()}
          edit={{
            Imię: store.get().user.imie,
            Nazwisko: store.get().user.nazwisko
          }}
          callback={() => {
            store.alert("Zaktualizowano dane", "green", 2);
            signin();
          }}
        />
        <span>
          Środki na koncie:{" "}
          <b>
            {String(store.get().user.portfel).replace(
              /(?!^)(?=(?:\d{3})+(?:\.|$))/gm,
              " "
            )}
          </b>{" "}
          PLN
        </span>
        <span style={{ paddingTop: 20 }}>
          <i>Kody promocyjne nieaktywne</i>
        </span>
      </>
    );
    this.setState({ content: content });
  };
  render() {
    return <div className="flexCenter">{this.state.content}</div>;
  }
}
