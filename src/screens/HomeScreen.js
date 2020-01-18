import React from "react";

export class HomeScreen extends React.Component {
  render() {
    return (
      <div className="flexCenter">
        Projekt Bazy Danych - strona obsługująca wystawy kotów
        <br />
        <span>
          <b>Piotr Litwin</b> 2020
        </span>
        <span>
          <a href={process.env.PUBLIC_URL + "/dokumentacja.pdf"}>
            Dokumentacja
          </a>{" "}
          Załączniki:{" "}
          <a href={process.env.PUBLIC_URL + "/struktura.sql"}>struktura.sql</a>{" "}
          <a href={process.env.PUBLIC_URL + "/funkcje.sql"}>funkcje.sql</a>
        </span>
        <object
          style={style}
          data={process.env.PUBLIC_URL + "/Dokumentacja.pdf"}
          type="application/pdf"
          width="900px"
          height="900px"
        >
          <p>
            Nie można wczytać PDF{" "}
            <a href={process.env.PUBLIC_URL + "/dokumentacja.pdf"}>
              link do PDF!
            </a>
          </p>
        </object>
      </div>
    );
  }
}

const style = {
  margin: "10px",
  border: "2px solid #333"
};
