import { store } from "Store";

export function signin(
  login = store.get().login,
  haslo = store.get().haslo,
  callback = () => {}
) {
  fetch(
    "http://pascal.fis.agh.edu.pl:4012/signin?login=" +
      login +
      "&haslo=" +
      haslo
  )
    .then(res => {
      if (!res.ok) {
        throw Error(res.statusText);
      }
      return res.json();
    })
    .then(json => {
      if (json.status !== "failure") {
        if (navigator.cookieEnabled && json.imie) {
          document.cookie = `login=${login}`;
          document.cookie = `haslo=${haslo}`;
        }
        store.set(["login", "haslo", "user"], [login, haslo, json]);
        if (json.admin) store.alert("Zalogowano jako administrator!", "green");
        else store.alert("Zalogowano pomyślnie!", "green");
      } else {
        const date = new Date();
        date.setTime(date.getMonth() - 1);
        document.cookie = `login=; expires=${date.toGMTString()}`;
        document.cookie = `haslo=; expires=${date.toGMTString()}`;
        store.alert("Nieprawidłowe dane logowania", "red");
      }
      callback();
    })
    .catch(error => {
      callback();
      if (error.name === "TypeError") {
        store.alert("Błąd połączenia!", "red");
      } else {
        store.alert(error.toString(), "red");
      }
    });
}
