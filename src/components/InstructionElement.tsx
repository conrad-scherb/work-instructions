import firebase from 'firebase';
import React from 'react';
import "../styles/tailwind.output.css";
import RichTextbox from './RichTextbox';

class InstructionElement extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      subheaders: [],
      contents: [],
      editedContents: [],
      editing: []
    };

    this.handleTextEdit = this.handleTextEdit.bind(this)
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
        this.setState({editedContents: contents})
        this.setState({editing: Array(Object.keys(snapshot.val()).length).fill(false)})
      })
    }
  }

  handleEditClick(idx: any) {
    let editingCopy = this.state.editing
    editingCopy[idx] = !editingCopy[idx]
    this.setState({editing: editingCopy})
  }

  handleTextEdit(contents: any, idx: any) {
    let editingCopy = this.state.editedContents
    editingCopy[idx] = contents
    this.setState({editedContents: editingCopy})
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
              <div className="flex justify-between">
                <div className="text-1xl font-bold">
                  {((this.props.header[1] == '.') 
                                        ? this.props.header[0] 
                                        : this.props.header.slice(2)) 
                    + '.' + (idx+1) + ". " + el
                  }
                </div>
                <div className="flex space-x-2">
                  {this.state.editing[idx] && 
                    <input className="bg-purple-300 hover:bg-purple-400 px-2 rounded-full" type="submit" value="Save" />
                  }
                  <input className="bg-blue-300 hover:bg-blue-400 px-2 rounded-full" 
                         type="submit" value="Edit" onClick={() => this.handleEditClick(idx)
                  }/>
                  <input className="bg-red-300 hover:bg-red-400 px-2 rounded-full" type="submit" value="Remove" />
                </div>
              </div>

              {!this.state.editing[idx] && 
                <div className="text-sm">
                  {((this.state.contents[idx]))}
                </div>
              }

              {this.state.editing[idx] &&
                <div className="pt-2">
                  <RichTextbox
                    contents={this.state.contents[idx]}
                    index={idx}
                    handleTextEdit={this.handleTextEdit}
                  />
                </div>
              }
            </div>
        ))}
      </div>
    )
  }
}

export default InstructionElement