import { Component } from "react";
import { ReactSortable } from "react-sortablejs";
import firebase from "../firebase/Firebase"
import "../styles/tailwind.output.css";

interface BasicClassState {
    list: { id: string; name: string }[];
}

export interface updates {
    [details: string]: any
  }

export class SubheadingRearranger extends Component<any, BasicClassState> {
    constructor(props: any) {
        super(props);
    }

    state: BasicClassState = {
        list: [],
    };

    handleSubmit() {
        let newKeys: string[] = []
        let count = 1
        for (let el of this.state.list) {
            let key = el.name
            let newKey = count + "@ " + key
            newKeys.push(newKey)
            count++
        }

        // Remove all the old ones
        const selectionRef = firebase.database().ref(this.props.instrTarget + "/" + this.props.header)
        selectionRef.once('value').then(function(snap) {
            var keys = Object.keys(snap.val())

            for (let oldKey of keys) {
                selectionRef.child(oldKey).once('value').then(function(snap) {
                    let data = snap.val()
                    
                    // Match the new key to the old key
                    for (let newKey of newKeys) {
                        if (oldKey.substring(3) === newKey.substring(3)) {
                            var update: updates = {}
                            update[oldKey] = null
                            update[newKey] = data
                            return selectionRef.update(update)
                        }
                    }
                })
            }
        })
        
    }

    render() {
        return (
            <div className="flex space-x-2 py-2 pb-4">
                <div className="my-auto font-bold">Choose the new subheading order:</div>
                <ReactSortable 
                        list={this.state.list} 
                        setList={(newState) => {
                            this.setState({list: newState})
                        }}>
                        {this.state.list.map((item: any) => (
                            <div key={item.id}>{item.name}</div>
                        ))}
                </ReactSortable>
                <div className="flex-grow"></div>
                <div className="my-auto">
                    <input className="bg-purple-300 hover:bg-purple-400 px-2 rounded-full text-base" type="submit" value="Confirm rearrange" onClick={() => {this.handleSubmit()}}/>
                </div>
            </div>
        )
    }

    componentDidMount() {
        // Get the subheaders from Firebase
        let selectionPath = this.props.instrTarget + "/" + this.props.header
        const selectionRef = firebase.database().ref(selectionPath)

        selectionRef.on('value', (snapshot) => {
            let keys = Object.keys(snapshot.val())
            let editedKeys = keys.map(x => x.substring(3))
            
            let newList: any[] = [];
            let count = 0
            for (let key of editedKeys) {
              let temp = {id: count, name: key}
              newList[count] = temp
              count++
            }

            this.setState({list: newList})
        })
    }
}
