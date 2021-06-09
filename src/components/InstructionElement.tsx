import firebase from 'firebase';
import React from 'react';
import "../styles/tailwind.output.css";
import RichTextbox from './RichTextbox';
import parse from 'html-react-parser'
import SunEditor from 'suneditor-react';

export interface updates {
  [details: string]: any
}

export interface deletes {
  [details: string]: null
}

class InstructionElement extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      subheaders: [],
      contents: [],
      editedContents: [],
      editing: [],
      renames: [],
      renameContents: []
    };

    this.handleTextEdit = this.handleTextEdit.bind(this)
    this.handleSaveClick = this.handleSaveClick.bind(this)
    this.handleRenameTextChange = this.handleRenameTextChange.bind(this);
  }

  pullFirebaseSubheaders() {
    if (this.props.header !== '') {
      const selectionRef = firebase.database().ref(this.props.instrTarget + '/' + this.props.header.replace('.',"@"))
      selectionRef.on('value', (snapshot) => {
        this.setState({subheaders: Object.keys(snapshot.val())})
        this.setState({renameContents: Object.keys(snapshot.val())})
        let contents = []
        for (var key of Object.keys(snapshot.val())) {
          contents.push(snapshot.val()[key])
        }
        this.setState({contents: contents})
        this.setState({editedContents: contents})
        this.setState({editing: Array(Object.keys(snapshot.val()).length).fill(false)})
        this.setState({renames: Array(Object.keys(snapshot.val()).length).fill(false)})
      })
    }
  }
  
  updateFirebaseSubheaderContents(newContents: any, idx: any) {
    var updates: updates = {}
    // eslint-disable-next-line
    updates[this.props.instrTarget 
            + '/' + this.props.header.replace('.','@')
            + '/' + this.state.subheaders[idx]] = newContents
    firebase.database().ref().update(updates)
  }

  updateFirebaseSubheader(idx: any){
    var updates: updates = {}
    updates[this.props.instrTarget 
      + '/' + this.props.header.replace('.','@')
      + '/' + this.state.subheaders[idx]] = null
    updates[this.props.instrTarget
      + '/' + this.props.header.replace('.','@')
      + '/' + this.state.renameContents[idx]] = this.state.contents[idx]
    firebase.database().ref().update(updates)
  }

  handleEditClick(idx: any) {
    let editingCopy = this.state.editing
    editingCopy[idx] = !editingCopy[idx]
    this.setState({editing: editingCopy})
  }

  handleRemoveClick(idx: any) {
    var updates: deletes = {}
    updates[this.props.instrTarget 
            + '/' + this.props.header.replace('.','@')
            + '/' + this.state.subheaders[idx]] = null
    firebase.database().ref().update(updates)
  }

  handleSaveClick(idx: any) {
    let contentsCopy = this.state.contents
    contentsCopy[idx] = this.state.editedContents[idx]
    this.setState({contents: contentsCopy})
    this.updateFirebaseSubheaderContents(contentsCopy[idx], idx)
    this.handleEditClick(idx)
  }

  handleTextEdit(contents: any, idx: any) {
    let editingCopy = this.state.editedContents
    editingCopy[idx] = contents
    this.setState({editedContents: editingCopy})
  }

  handleRenameClick(idx: any) {
    let renamesCopy = this.state.renames
    renamesCopy[idx] = !this.state.renames[idx]
    if (renamesCopy[idx] == false) {
      this.updateFirebaseSubheader(idx)
    }
    this.setState({renames: renamesCopy})
  }

  handleRenameTextChange(event: any, idx: any) {
    let renamesCopy = this.state.renameContents
    renamesCopy[idx] = event.target.value
    this.setState({renameContents: renamesCopy});
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
                {!this.state.renames[idx] &&
                  <div className="text-1xl font-bold">
                    {((this.props.header[1] === '.') 
                                          ? this.props.header[0] 
                                          : this.props.header.slice(0,2)) 
                      + '.' + (idx+1) + ". " + el
                    }
                  </div>
                }
                {this.state.renames[idx] && 
                  <b>
                    <label>
                      {((this.props.header[1] === '.') 
                                            ? this.props.header[0] 
                                            : this.props.header.slice(0,2)) 
                        + '.' + (idx+1) + ". "
                      }
                      <input type="text" value={this.state.value} placeholder={this.state.renameContents[idx]} onChange={(e) => this.handleRenameTextChange(e, idx)} />
                    </label>
                  </b>
                }
                <div className="flex space-x-2">
                  {this.state.editing[idx] &&
                    <input onClick={() => this.handleSaveClick(idx)} className="bg-purple-300 hover:bg-purple-400 px-2 rounded-full" type="submit" value="Save" />
                  }
                  {this.props.loggedIn &&
                    <>
                      <input className="bg-yellow-300 hover:bg-yellow-400 px-2 rounded-full" 
                            type="submit" value={this.state.renames[idx] ? "Save rename" : "Rename"} onClick={() => this.handleRenameClick(idx)}/>
                      <input className="bg-blue-300 hover:bg-blue-400 px-2 rounded-full" 
                            type="submit" value="Edit" onClick={() => this.handleEditClick(idx)}/>
                      <input className="bg-red-300 hover:bg-red-400 px-2 rounded-full" 
                            type="submit" value="Remove" onClick={() => this.handleRemoveClick(idx)}/>
                    </>
                  }
                </div>
              </div>

              {!this.state.editing[idx] && 
                <div className="text-sm">
                  {parse(this.state.contents[idx])}
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