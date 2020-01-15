import React from "react";
import { List } from "components/List";
import { store } from "Store";
import { auth } from "auth";

export class OwnersScreen extends React.Component {
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
  update = async () => {
    if (!store.get().user) {
      store.navigate("/");
      return;
    }
    var result = [];
    await fetch("http://pascal.fis.agh.edu.pl:4012/usersView?" + auth())
      .then(res => res.json())
      .then(json => {
        result = json;
      });
    const content = (
      <List
        title="Właściciele"
        info={result}
        exception={[]}
        edit={{ Portfel: { name: "portfel", type: "number" } }}
        editApi={"http://pascal.fis.agh.edu.pl:4012/update/user"}
        editAuth={auth()}
        deleteApi={"http://pascal.fis.agh.edu.pl:4012/delete/user?" + auth()}
      />
    );
    this.setState({ content: content });
  };
  render() {
    return <div className="flexCenter">{this.state.content}</div>;
  }
}
