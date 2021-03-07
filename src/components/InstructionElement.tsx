import firebase from 'firebase';
import React from 'react';
import "../styles/tailwind.output.css"

class InstructionElement extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      subheaders: [],
      contents: []
    };
  }

  pullFirebaseSubheaders() {
    if (this.props.header !== '') {
      console.log(this.props.instrTarget + '/' + this.props.header.replace('.',"@"))
      const selectionRef = firebase.database().ref(this.props.instrTarget + '/' + this.props.header.replace('.',"@"))
      selectionRef.on('value', (snapshot) => {
        this.setState({subheaders: Object.keys(snapshot.val())})
        let contents = []
        for (var key of Object.keys(snapshot.val())) {
          contents.push(snapshot.val()[key])
        }
        this.setState({contents: contents})
      })
    }
  }

  // Mounting the container for headers triggers firebase pull
  componentDidMount() {
    this.pullFirebaseSubheaders()
  }

  render() {
    return(
      <div key={this.props.instrTarget} className="pb-4">
        {this.state.subheaders.map((el: any, idx: any) => (
            <div className="pb-2">
              <div className="text-1xl font-bold">
                {((this.props.header[1] == '.') 
                                      ? this.props.header[0] 
                                      : this.props.header.slice(2)) 
                  + '.' + (idx+1) + ". " + el
                }</div>
              <div className="text-sm">
                {((this.state.contents[idx]))}
              </div>
            </div>
        ))}
      </div>
    )
  }
}

export default InstructionElement