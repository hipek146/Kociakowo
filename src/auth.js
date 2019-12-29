import { store } from "Store";

export function auth() {
  return "login=" + store.get().login + "&haslo=" + store.get().haslo + "";
}
