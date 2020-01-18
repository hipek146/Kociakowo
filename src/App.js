import React from "react";
import "styles/App.css";
import { Alert } from "components/Alert";
import { Header } from "components/Header";
import { HomeScreen } from "screens/HomeScreen";
import { SignupScreen } from "screens/SignupScreen";
import { CatsScreen } from "screens/CatsScreen";
import { ExhibitionsScreen } from "screens/ExhibitionsScreen";
import { DisposalScreen } from "screens/DisposalScreen";
import { OwnersScreen } from "screens/OwnersScreen";
import { TicketsScreen } from "screens/TicketsScreen";
import { AccountScreen } from "screens/AccountScreen";
import { ErrorScreen } from "screens/ErrorScreen";
import { signin } from "actions";
import { store } from "Store";

const relativePath = "/~7litwin/BD/frontend";

class App extends React.PureComponent {
  constructor() {
    super();
    this.state = { loading: true };
  }

  componentDidMount() {
    store.subscribe(this);

    if (
      window.location.pathname === relativePath ||
      window.location.pathname === relativePath + "/"
    ) {
      store.navigate("/", false);
    } else if (window.location.pathname) {
      store.navigate(
        window.location.pathname.substring(1).replace(/\/$/g, ""),
        false
      );
    }
    window.onpopstate = () => {
      if (
        window.location.pathname === relativePath ||
        window.location.pathname === relativePath + "/"
      ) {
        store.navigate("/", false);
      } else if (window.location.pathname) {
        store.navigate(
          window.location.pathname.substring(1).replace(/\/$/g, ""),
          false
        );
      }
    };
    const cookies = document.cookie.split(/; */);

    var storeNames = [];
    var storeValues = [];
    cookies.forEach(el => {
      const values = el.split("=");
      storeNames.push(values[0]);
      storeValues.push(values[1]);
    });
    store.set(storeNames, storeValues);
    if (store.get().login && store.get().haslo) {
      signin(store.get().login, store.get().haslo, () =>
        this.setState({ loading: false })
      );
    } else {
      this.setState({ loading: false });
    }
  }
  componentWillUnmount() {
    store.unsubscribe(this);
  }
  render() {
    if (this.state.loading) {
      return <div className="appLoading">Logowanie...</div>;
    }
    var Navigation;

    switch (
      store
        .get()
        .target.replace(relativePath.slice(1), "")
        .replace("/", "")
    ) {
      case "":
        Navigation = HomeScreen;
        if (store.get().push) {
          window.history.pushState(
            "Strona główna",
            "Bazy Danych",
            relativePath + "/"
          );
        }
        document.title = "Strona główna";
        break;
      case "rejestracja":
        Navigation = SignupScreen;
        if (store.get().push) {
          window.history.pushState("Rejestracja", "Bazy Danych", "rejestracja");
        }
        document.title = "Rejestracja";
        break;
      case "koty":
        Navigation = CatsScreen;
        if (store.get().push) {
          window.history.pushState("Koty", "Bazy Danych", "koty");
        }
        document.title = "Koty";
        break;
      case "wystawy":
        Navigation = ExhibitionsScreen;
        if (store.get().push) {
          window.history.pushState(
            "Wystawy",
            "Bazy Danych",
            relativePath + "/wystawy"
          );
        }
        document.title = "Wystawy";
        break;
      case "sprzedaz":
        Navigation = DisposalScreen;
        if (store.get().push) {
          window.history.pushState("Sprzedaż", "Bazy Danych", "sprzedaz");
        }
        document.title = "Sprzedaż";
        break;
      case "wlasciciele":
        Navigation = OwnersScreen;
        if (store.get().push) {
          window.history.pushState("Właściciele", "Bazy Danych", "wlasciciele");
        }
        document.title = "Właściciele";
        break;
      case "bilety":
        Navigation = TicketsScreen;
        if (store.get().push) {
          window.history.pushState("Bilety", "Bazy Danych", "bilety");
        }
        document.title = "Bilety";
        break;
      case "konto":
        Navigation = AccountScreen;
        if (store.get().push) {
          window.history.pushState("Konto", "Bazy Danych", "konto");
        }
        document.title = "Konto";
        break;
      default:
        if (store.get().push) {
          window.history.pushState(
            "Home",
            "Bazy Danych",
            "/" + store.get().target
          );
        }
        document.title = "Error 404";
        Navigation = ErrorScreen;
    }
    return (
      <div className="App">
        <Alert />
        <Header />
        <Navigation />
      </div>
    );
  }
}

export default App;
