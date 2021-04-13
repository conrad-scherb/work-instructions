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
      count: 0
    };

  }

  pullFirebase() { 
    if (this.props.instrTarget.length > 3) {
      const selectionRef = firebase.database().ref(this.props.instrTarget)
      console.log(this.props.instrTarget)
      selectionRef.on('value', (snapshot) => {
        let unsortedHeadings = Object.keys(snapshot.val())
        console.log(unsortedHeadings)
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

        console.log(this.state.headers)
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

  handleAddHeadingClick() {
    let newHeading = prompt('Enter the new heading name');
    var headingCopy = this.state.headers
    headingCopy.push(newHeading)
    this.setState({headers: headingCopy})
  }

  handleManageClick() {
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
      <>
        <div className="center pt-0.5">
          {this.props.loggedIn && 
            <div className="flex space-x-2 justify-center">
              <input className="bg-pink-300 hover:bg-pink-400 px-2 rounded-full text-base" type="submit" value="Manage headings" onClick={() => this.handleManageClick()}/>
              <input className="bg-pink-300 hover:bg-pink-400 px-2 rounded-full text-base" type="submit" value="Add heading" onClick={() => this.handleAddHeadingClick()}/>
              <input className="bg-pink-300 hover:bg-pink-400 px-2 rounded-full text-base" type="submit" value="Save changes" onClick={() => this.handleManageClick()}/>
            </div>
          }
        <HeaderList
          headers={this.state.headers}
        />
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