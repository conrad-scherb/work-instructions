import React from 'react';
import "../styles/tailwind.output.css"
import firebase from "../firebase/Firebase"
import InstructionElement from '../components/InstructionElement';
import HeaderList from '../components/HeaderList';
//@ts-nocheck
import { scroller } from "react-scroll"
import { SubheadingRearranger } from '../components/SubheadingRearranger';


export interface updates {
  [details: string]: any
}

async function getHighestSubheadingNum(selectionPath: any) {
  return new Promise(function(resolve, reject) {
    const selectionRef = firebase.database().ref(selectionPath)

    selectionRef.on('value', (snapshot) => {
      let keys = Object.keys(snapshot.val())
      if (keys.length == 0) {
        return resolve(1)
      }
      
      let highest = 0
      for (let key of keys) {
        let number = parseInt(key.split("@")[0])
        highest = Math.max(number, highest)
      }
      
      return resolve(highest+1)
    })
    return reject();
  })
}

async function removeHeading(path: any, heading: any) {
  return new Promise<void>(function(resolve, reject) {
    const ref = firebase.database().ref(path)

    ref.child(heading).once('value').then(function() {
      var update: any = {};
      update[heading] = null;
      ref.update(update);

      return resolve()
    })
  })
}


class HeaderContainer extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      headers: [],
      list: [],
      rearranges: [],
      addToOthers: [],
      checkboxes: [],
      renameContents: [],
      reloaders: [],
      renames: [],
      count: 0,
      showHeaders: false,
      showHeadingEdit: false
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

        this.setState({rearranges: Array(unsortedHeadings.length).fill(false)})
        this.setState({addToOthers: Array(unsortedHeadings.length).fill(false)})
        this.setState({reloaders: Array(unsortedHeadings.length).fill(false)})
        this.setState({renames: Array(unsortedHeadings.length).fill(false)})
        this.setState({checkboxes: Array(unsortedHeadings.length).fill([])})
        this.setState({headers: sortedHeadings})
        this.setState({renameContents: JSON.parse(JSON.stringify(sortedHeadings))})
      })
    }
  }

  handleRenameClick(idx: any) {
    let renamesCopy = this.state.renames
    renamesCopy[idx] = !this.state.renames[idx]
    if (renamesCopy[idx] == false) {
      this.updateFirebaseHeader(idx)
    }
    this.setState({renames: renamesCopy})
  }

  updateFirebaseHeader(idx: any){
    const selectionRef = firebase.database().ref(this.props.instrTarget)
    selectionRef.child(this.state.headers[idx].replace('.','@')).once('value').then((snap) => {
      let data = snap.val()
      let updates: updates = {}
      console.log(this.state.headers[idx].replace('.',"@"))
      console.log(this.state.renameContents[idx].replace(".","@"))
      updates[this.state.headers[idx].replace('.',"@")] = null
      updates[this.state.renameContents[idx].replace('.',"@")] = data;
      console.log(updates)
      selectionRef.update(updates);
    })
  }

  handleRenameTextChange(event: any, idx: any) {
    let renamesCopy = this.state.renameContents
    renamesCopy[idx] = renamesCopy[idx].split(".")[0] + ". " + event.target.value;
    console.log(this.state.renameContents)
    this.setState({renameContents: renamesCopy});
  }

  handleAddClick(idx: any) {
    var updates: updates = {}
    let selectionPath = this.props.instrTarget + "/" + this.state.headers[idx].replace(".","@")

    getHighestSubheadingNum(selectionPath).then((lastNum) => {
      let path = this.props.instrTarget 
               + '/' + this.state.headers[idx].replace('.','@')
               + '/' + lastNum + "@ New Instruction"

      updates[path] = "Edit this instruction..."
      firebase.database().ref().update(updates)
    })
  }

  handleAddHeadingClick() {
    let newHeading: string = prompt('Enter the new heading name')!;
    var updates: updates = {}

    getHighestSubheadingNum(this.props.instrTarget).then((lastNum) => {
      updates[this.props.instrTarget 
              + '/' + lastNum + "@ " + newHeading 
              + '/' + "1@ New instruction"] = "Edit this instruction..."
      firebase.database().ref().update(updates)
      this.setState({count: this.state.count + 1})
      })
  }

  handleShowEditModeChange() {
    this.setState({showHeadingEdit: !this.state.showHeadingEdit})
  }

  handleRearrangeClick(idx: any) {
    let oldRearranges = this.state.rearranges
    oldRearranges[idx] = !oldRearranges[idx]
    this.setState({rearranges: oldRearranges})
  }

  handleCheckboxTick(idx: any, role: any) {
    let checkboxes = this.state.checkboxes
    if (!checkboxes[idx].includes(role)) {
      let row = checkboxes[idx]
      console.log(row)
      row.push(role)
      checkboxes[idx] = row
    } else {
      checkboxes[idx].splice(checkboxes[idx].indexOf(role), 1)
    }
    this.setState({checkboxes: checkboxes})
  }

  handleSubmitAddToOthers(idx: any) {
    const selectionRef = firebase.database().ref(this.props.instrTarget)
    let heading = this.state.headers[idx].replace(".","@")
    selectionRef.child(heading).once('value').then((snap) => {
      var data = snap.val()
      let headingNum = heading.split("@")[0]

      for (let position of this.state.checkboxes[idx]) {
        let ref = firebase.database().ref(position)
        ref.once('value').then((snap) => {
          let old = ""

          for (let key of Object.keys(snap.val())) {
            if (key.split("@")[0] == headingNum) {
              old = key
            }
          }

          var update: updates = {}
          if (old != "") {
            update[old] = null
          }
          update[heading] = data
          ref.update(update)
        })
      }

      let check = this.state.checkboxes
      check[idx] = []
      let add = this.state.addToOthers
      add[idx] = false
      this.setState({
        checkboxes: check,
        addToOthers: add
      })
      alert("Instruction has been copied over to the other roles")
    })
  }

  handleAddToOthersClick(idx: any) {
    let oldAdds = this.state.addToOthers
    oldAdds[idx] = !oldAdds[idx]
    this.setState({addToOthers: oldAdds})
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

    console.log(newHeaderOrder)

    let modified = []
    
    for (let i of newHeaderOrder) {
      for (let j in this.state.headers) {
        if (this.state.headers[j].substring(this.state.headers[j].indexOf(" ") + 1) == i) {
          modified.push(this.state.headers[j])
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

    for (let i of this.state.headers) {
      if (!modified.includes(i)) {
        removeHeading(this.props.instrTarget, i.replace(".","@")).then(() => {
          this.pullFirebase()
          return
        })
      }
    }

    this.pullFirebase()
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
              {/*<div className="pb-0.5">
                <input className="bg-pink-300 hover:bg-pink-400 px-2 rounded-full text-base" type="submit" value="Edit mode on/off" onClick={() => this.handleShowEditModeChange()}/>
              </div>*/}

              {this.props.admin && 
                <>
                  <div className="flex space-x-2 justify-center">
                    <input className="bg-pink-300 hover:bg-pink-400 px-2 rounded-full text-base" type="submit" value="Add heading" onClick={() => this.handleAddHeadingClick()}/>
                    <input className="bg-pink-300 hover:bg-pink-400 px-2 rounded-full text-base" type="submit" value="Save changes" onClick={() => this.handleSaveChangesClick()}/>
                  </div>
                </>
              }

              <HeaderList
                headers={this.state.headers}
                passUpListOrder={this.passUpListOrder}
                visible={this.props.admin}
              />    
            </>
          }
        </div>

        <div key={this.props.instrTarget} className="text-left px-20 pt-4">
          {/* Contents */}
          <div>
            {this.state.headers.length != 0 && <div className="text-3xl pb-2 font-bold">Contents</div>}
            {this.state.headers.map((el: any, idx: any) => (
              <div className="flex py-0.5" onClick={() => scroller.scrollTo(el.split(".")[0], {
                duration: 800,
                delay: 0,
                smooth: "easeInOutQuart",
              })}>
                <div className="hover:underline">{el}</div>
              </div>
            ))}
          </div>

          {this.state.headers.map((el: any, idx: any) => (
            <>  
              {/* Heading menu bar */}
              <div className={el.split(".")[0] + " flex justify-between pt-2"}>
                {!this.state.renames[idx] &&
                  <div className="text-3xl font-bold">{el}</div>
                }

                {this.state.renames[idx] && 
                  <label className="text-3xl font-bold">
                    {el.split(".")[0]+"."}
                    <input type="text" value={this.state.value} style={{width: "500px"}} placeholder={el.split(".")[1]} onChange={(e) => this.handleRenameTextChange(e, idx)}/>
                  </label>
                }

                <div className="text-1xl pt-1.5">
                  {this.props.admin &&
                    <div className="flex space-x-2 justify-center">
                      <input className="bg-yellow-300 hover:bg-yellow-400 px-2 rounded-full" type="submit" value={this.state.renames[idx] ? "Save rename" : "Rename"} onClick={() => this.handleRenameClick(idx)}/>
                      <input className="bg-purple-300 hover:bg-purple-400 px-2 rounded-full text-base" type="submit" value="Rearrange" onClick={() => this.handleRearrangeClick(idx)}/>
                      <input className="bg-green-300 hover:bg-green-400 px-2 rounded-full text-base" type="submit" value="Add" onClick={() => this.handleAddClick(idx)}/>
                      {/*
                        input className="bg-indigo-300 hover:bg-indigo-400 px-2 rounded-full text-base" type="submit" value="Add to other roles" onClick={() => this.handleAddToOthersClick(idx)}/>
                      */}
                    </div>
                  }
                </div>
              </div>
            
              {/* Rearrange menu */}
              {this.state.rearranges[idx] && <div>
                  <SubheadingRearranger
                    instrTarget={this.props.instrTarget}
                    header={this.state.headers[idx].replace(".","@")}
                  />
              </div>}

              {/* Add to other roles menu*/}
              {this.state.addToOthers[idx] && <div>
                <div className="flex space-x-2 py-2 pb-4">
                  <div className="my-auto pr-8">
                    <div className="font-bold">Choose other roles to add this instruction to:</div>
                    <div className="text-xs">WARNING: This will overwrite any already existing instructions
                    <br/>with this number in the other roles. Use with caution!</div>
                  </div>

                  <tr className="grid">
                    <td className="text-center"><input type="checkbox" onClick={() => this.handleCheckboxTick(idx, "AkOM")}/><br/>Auckland OM</td>
                    <td className="text-center"><input type="checkbox" onClick={() => this.handleCheckboxTick(idx, "AkPM")}/><br/>Auckland PM</td>
                    <td className="text-center"><input type="checkbox" onClick={() => this.handleCheckboxTick(idx, "AkPA")}/><br/>Auckland PA</td>
                  </tr>
                  <tr className="grid">
                    <td className="text-center"><input type="checkbox" onClick={() => this.handleCheckboxTick(idx, "WlOM")}/><br/>Wellington OM</td>
                    <td className="text-center"><input type="checkbox" onClick={() => this.handleCheckboxTick(idx, "WlPM")}/><br/>Wellington PM</td>
                    <td className="text-center"><input type="checkbox" onClick={() => this.handleCheckboxTick(idx, "WlPA")}/><br/>Wellington PA</td>
                  </tr>
                  <tr className="grid">
                    <td className="text-center"><input type="checkbox" onClick={() => this.handleCheckboxTick(idx, "RoOM")}/><br/>Rotorua OM</td>
                    <td className="text-center"><input type="checkbox" onClick={() => this.handleCheckboxTick(idx, "RoPM")}/><br/>Rotorua PM</td>
                    <td className="text-center"><input type="checkbox" onClick={() => this.handleCheckboxTick(idx, "RoPA")}/><br/>Rotorua PA</td>
                  </tr>

                  <div className="my-auto pl-8">
                    <input className="bg-indigo-300 hover:bg-indigo-400 px-2 rounded-full text-base" type="submit" value="Confirm" onClick={() => this.handleSubmitAddToOthers(idx)}/>
                  </div>
                </div>
              </div>}

              {/* Subheadings */}
              <InstructionElement
                instrTarget={this.props.instrTarget}
                loggedIn={this.props.loggedIn}
                showHeadingEdit={this.props.admin}
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