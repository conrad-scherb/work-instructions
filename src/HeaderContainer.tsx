import React from 'react';
import "./styles/tailwind.output.css"
import firebase from "./Firebase"

class HeaderContainer extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      headers: []
    };
  }

  componentDidMount() {
    const selectionRef = firebase.database().ref('AkOM')
    selectionRef.on('value', (snapshot) => {
      let unsortedHeadings = Object.keys(snapshot.val())
      let sortedHeadings = []

      console.log(unsortedHeadings)

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

  render() {
    return(
      <div className="text-left pl-20 pt-4">
        {this.state.headers.map((el: any) => (
          <div className="text-3xl font-bold">{el}</div>
        ))}
      </div>
    )
  }
}

export default HeaderContainer