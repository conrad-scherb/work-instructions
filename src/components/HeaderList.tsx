import React, { Component } from "react";
import { ReactSortable } from "react-sortablejs";

interface BasicClassState {
  list: { id: string; name: string }[];
  prevList: { id: string; name: string }[];
}

export class HeaderList extends Component<any, BasicClassState> {
  ignore = true;

  constructor(props: any) {
    super(props);
  }

  state: BasicClassState = {
    list: [],
    prevList: []
  };

  render() {
    return (
      <ReactSortable
        list={this.state.list}
        setList={(newState) => this.setState({list: newState})}
        style={{width:"280px", margin:"0px auto"}}
      >
          {this.state.list.map((item) => (
            <tr key={item.id} className="align-middle">
              <td className="pr-2">{item.name}</td>
              <td>
                <input className="bg-red-300 hover:bg-red-400 px-2 rounded-full text-base float-right" type="submit" value="X" onClick={
                  () => {
                    let copy = this.state.list
                    copy.splice(this.state.list.indexOf(item), 1)
                    console.log(copy)
                    this.setState({list: copy})
                  }
                }/>
              </td>
            </tr>
          ))}
      </ReactSortable>
    );
  }

  componentDidUpdate(prevProps: any) {
    if (this.props.visible == false && prevProps.visible == true) {
      this.setState({list: []})
      return
    }

    if (this.props.visible == true && prevProps.visible == false) {
      var count = 0;
      let newList: any[] = [];
      for (let header of this.props.headers) {
        let temp = {id: count, name: header.substring(header.indexOf(" ") + 1)}
        newList[count] = temp
        count++
      }
      this.setState({list: newList})
      this.ignore = false
    }

    if (this.ignore == true) {
      return
    }

    if (prevProps.headers != this.props.headers || (this.props.visible == true && prevProps.visible == false)) {
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