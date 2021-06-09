import React, { Component } from "react";
import { ReactSortable } from "react-sortablejs";

interface BasicClassState {
  list: { id: string; name: string }[];
  prevList: { id: string; name: string }[];
}

export class HeaderList extends Component<any, BasicClassState> {
  constructor(props: any) {
    super(props);
  }

  state: BasicClassState = {
    list: [],
    prevList: [],
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

    if (this.state.prevList != this.state.list) {
      this.props.passUpListOrder(this.state.list)
      this.setState({prevList: this.state.list})
    }
  }
}

export default HeaderList