import React from 'react';
import "../styles/tailwind.output.css"
import firebase from "../firebase/Firebase"
import InstructionElement from '../components/InstructionElement';

export interface updates {
  [details: string]: string
}

class HeaderContainer extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      headers: [],
      count: 0
    };

  }

  pullFirebase() {
    if (this.props.instrTarget.length > 3) {
      const selectionRef = firebase.database().ref(this.props.instrTarget)
      selectionRef.on('value', (snapshot) => {
        let unsortedHeadings = Object.keys(snapshot.val())
        let sortedHeadings = []

        // Heading sorter
        for (const heading of unsortedHeadings) {
          if (heading[2] !== "@") {
            sortedHeadings.push(heading.replace("@", "."))
          }
        }

        for (const heading of unsortedHeadings) {
          if (!sortedHeadings.includes(heading.replace("@", "."))) {
            sortedHeadings.push(heading.replace("@", "."))
          }
        }

        this.setState({headers: sortedHeadings})
      })
    }
  }

  handleAddClick(idx: any) {
    var updates: updates = {}
    updates[this.props.instrTarget 
            + '/' + this.state.headers[idx].replace('.','@')
            + '/' + "New Instruction " + (this.state.count+1)] = "Edit this instruction..."
    firebase.database().ref().update(updates)
    this.setState({count: this.state.count + 1})
  }

  // Mounting the container for headers triggers firebase pull
  componentDidMount() {
    this.pullFirebase()
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.instrTarget !== this.props.instrTarget && this.props.instrTarget !== '') {
      this.pullFirebase()
    }
  }

  render() {
    return(
      <div key={this.props.instrTarget} className="text-left px-20 pt-4">
        {this.state.headers.map((el: any, idx: any) => (
          <>
            <div className="flex justify-between">
              <div className="text-3xl font-bold">{el}</div>
              <div className="text-1xl pt-1.5">
                {this.props.loggedIn &&
                  <input className="bg-green-300 hover:bg-green-400 px-2 rounded-full text-base" type="submit" value="Add" onClick={() => this.handleAddClick(idx)}/>
                }
              </div>
            </div>
            <InstructionElement
              instrTarget={this.props.instrTarget}
              loggedIn={this.props.loggedIn}
              header={el}
            />
          </>
        ))}
      </div>
    )
  }
}

export default HeaderContainer