import React, { Component } from "react";
import { ReactSortable } from "react-sortablejs";

interface BasicClassState {
  list: { id: string; name: string }[];
}

export class HeaderList extends Component<any, BasicClassState> {
  constructor(props: any) {
    super(props);
  }

  state: BasicClassState = {
    list: [{ id: "1", name: "Answering the intercom and doorbell" }, 
          {id: "2", name: "Meeting and greeting players"},
          {id: "3", name: "Checking or creating a booking"}],
  };

  render() {
    return (
      <ReactSortable
        list={this.state.list}
        setList={(newState) => this.setState({ list: newState })}
      >
        {this.state.list.map((item) => (
          <div key={item.id}>{item.name}</div>
        ))}
      </ReactSortable>
    );
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.headers != this.props.headers) {
      var count = 0;
      let newList: any[] = [];
      for (let header of this.props.headers) {
        let temp = {id: count, name: header.substring(header.indexOf(" ") + 1)}
        newList[count] = temp
        count++
      }
      this.setState({list: newList})
    }
    console.log(this.state.list)
  }
}

export default HeaderList