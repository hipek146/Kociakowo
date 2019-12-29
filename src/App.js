import React from "react";
import "styles/App.css";
import { Alert } from "components/Alert";
import { Header } from "components/Header";
import { HomeScreen } from "screens/HomeScreen";
import { SignupScreen } from "screens/SignupScreen";
import { CatsScreen } from "screens/CatsScreen";
import { ExhibitionsScreen } from "screens/ExhibitionsScreen";
import { TicketsScreen } from "screens/TicketsScreen";
import { signin } from "actions";
import { store } from "Store";

const relativePath = "/";

class App extends React.PureComponent {
  constructor() {
    super();
    this.state = { loading: true };
  }

  componentDidMount() {
    store.subscribe(this);
    if (window.location.pathname === "/") {
      store.navigate("/", false);
    } else if (window.location.pathname) {
      store.navigate(
        window.location.pathname.substring(1).replace(/\/$/g, ""),
        false
      );
    }
    window.onpopstate = () => {
      if (window.location.pathname === "/") {
        store.navigate("/", false);
      } else if (window.location.pathname) {
        store.navigate(
          window.location.pathname.substring(1).replace(/\/$/g, ""),
          false
        );
      }
    };
    const cookies = document.cookie.split(/; */);

    cookies.forEach(el => {
      const values = el.split("=");
      store.set(values[0], values[1]);
    });
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

    switch (store.get().target.replace(relativePath, "/")) {
      case "/":
        Navigation = HomeScreen;
        if (store.get().push) {
          window.history.pushState("Strona główna", "Bazy Danych", "/");
        }
        document.title = "Strona główna";
        break;
      case "rejestracja":
        Navigation = SignupScreen;
        if (store.get().push) {
          window.history.pushState(
            "Rejestracja",
            "Bazy Danych",
            "/rejestracja"
          );
        }
        document.title = "Rejestracja";
        break;
      case "koty":
        Navigation = CatsScreen;
        if (store.get().push) {
          window.history.pushState("Koty", "Bazy Danych", "/koty");
        }
        document.title = "Koty";
        break;
      case "wystawy":
        Navigation = ExhibitionsScreen;
        if (store.get().push) {
          window.history.pushState("Wystawy", "Bazy Danych", "/wystawy");
        }
        document.title = "Wystawy";
        break;
      case "bilety":
        Navigation = TicketsScreen;
        if (store.get().push) {
          window.history.pushState("Bilety", "Bazy Danych", "/bilety");
        }
        document.title = "Bilety";
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
        console.log(store.get().target.replace(relativePath, "/"));
        throw new Error(404);
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
