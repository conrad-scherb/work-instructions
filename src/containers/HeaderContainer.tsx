import React from 'react';
import "../styles/tailwind.output.css"
import firebase from "../firebase/Firebase"
import InstructionElement from '../components/InstructionElement';
import HeaderList from '../components/HeaderList';

export interface updates {
  [details: string]: string
}

class HeaderContainer extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      headers: [],
      list: [],
      count: 0,
      showHeaders: false
    };

    this.passUpListOrder = this.passUpListOrder.bind(this)
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
            + '/' + "New Instruction " + (this.state.count+1)] = "X@ Edit this instruction..."
    firebase.database().ref().update(updates)
    this.setState({count: this.state.count + 1})
  }

  handleAddHeadingClick() {
    let newHeading: string = prompt('Enter the new heading name')!;
    var updates: updates = {}
    updates[this.props.instrTarget 
            + '/' + newHeading 
            + '/' + "New instruction"] = "Edit this instruction..."
    firebase.database().ref().update(updates)
    this.setState({count: this.state.count + 1})
  }

  handleManageClick() {
    this.setState({showHeaders: true})
  }

  handleSaveChangesClick() {
    let newHeaderOrder = []
    let count = 1
    
    this.setState({showHeaders: false})

    for (let i of this.state.list) {
      newHeaderOrder.push(i.name)
    }
    
    for (let i of newHeaderOrder) {
      for (let j in this.state.headers) {
        if (this.state.headers[j].substring(this.state.headers[j].indexOf(" ") + 1) == i) {
          var ref = firebase.database().ref(this.props.instrTarget);
          let old = this.state.headers[j].replace('.','@')
          let newPath = count + "@ " + i
          ref.child(old).once('value').then(function(snap) {
            var data = snap.val();
            var update: any = {};
            update[old] = null;
            update[newPath] = data;
            return ref.update(update);
          })
          count++
        }
      }
    }
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

  passUpListOrder(newOrder: any) {
    this.setState({list: newOrder})
  }

  render() {
    return(
      <>
        <div className="center pt-0.5">
          {this.props.loggedIn && 
            <>
              <div className="flex space-x-2 justify-center">
                <input className="bg-pink-300 hover:bg-pink-400 px-2 rounded-full text-base" type="submit" value="Manage headings" onClick={() => this.handleManageClick()}/>
                <input className="bg-pink-300 hover:bg-pink-400 px-2 rounded-full text-base" type="submit" value="Add heading" onClick={() => this.handleAddHeadingClick()}/>
                <input className="bg-pink-300 hover:bg-pink-400 px-2 rounded-full text-base" type="submit" value="Save changes" onClick={() => this.handleSaveChangesClick()}/>
              </div>
              <HeaderList
              headers={this.state.headers}
              passUpListOrder={this.passUpListOrder}
              />
            </>
          }
        </div>
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
      </>
    )
  }
}

export default HeaderContainer