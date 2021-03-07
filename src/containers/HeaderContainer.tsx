import React from 'react';
import "../styles/tailwind.output.css"
import firebase from "../firebase/Firebase"
import RichTextbox from '../components/RichTextbox';
import InstructionElement from '../components/InstructionElement';

class HeaderContainer extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      headers: []
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

  // Mounting the container for headers triggers firebase pull
  componentDidMount() {
    this.pullFirebase()
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.instrTarget != this.props.instrTarget && this.props.instrTarget !== '') {
      this.pullFirebase()
    }
  }

  render() {
    return(
      <div key={this.props.instrTarget} className="text-left px-20 pt-4">
        {this.state.headers.map((el: any) => (
          <>
            <div className="text-3xl font-bold">{el}</div>
            <InstructionElement
              instrTarget={this.props.instrTarget}
              header={el}
            />
          </>
        ))}
      </div>
    )
  }
}

export default HeaderContainer