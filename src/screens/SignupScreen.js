import React from "react";
import { Form } from "components/Form";
import "styles/SignupScreen.css";
import { store } from "Store";

export class SignupScreen extends React.PureComponent {
  componentDidMount() {
    store.subscribe(this);
    if (store.get().user) store.navigate("/", true);
  }
  componentDidUpdate() {
    //if (getstore().user) navigate("/", false);
  }

  componentWillUnmount() {
    store.unsubscribe(this);
  }

  render() {
    const forms = {
      Imię: { name: "imie" },
      Nazwisko: { name: "nazwisko" },
      Login: { name: "login" },
      Hasło: { name: "haslo", type: "password" }
    };
    return (
      <div className="signup">
        <span className="signupHeader">Formularz rejestracyjny</span>
        <Form
          keyName="signup"
          info={forms}
          button="Zarejestruj"
          api="http://pascal.fis.agh.edu.pl:4012/signup"
        />
      </div>
    );
  }
}
