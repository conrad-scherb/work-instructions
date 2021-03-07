import React from 'react';
import "../styles/tailwind.output.css"

class RoleSelector extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      role: "",
      branch: ""
    };

    this.handleBranchChange = this.handleBranchChange.bind(this);
    this.handleRoleChange = this.handleRoleChange.bind(this)
  }

  handleBranchChange(event: any) {
    this.setState({branch: event.target.value});
    this.props.onBranchChange({value: event.target.value});
  }

  handleRoleChange(event: any) {
    this.setState({role: event.target.value})
    this.props.onRoleChange({value: event.target.value});
  }

  render() {
    return(
    <div className="m-auto" style={{width:"345px"}}>
      <form onSubmit={this.props.handleInstrGet}>
        <table className="table-fixed">
          <tr>
            <td className="w-1/2 text-left">
              <input onChange={this.handleBranchChange} type="radio" id ="ak" name="branch" value="Ak"/>
              <label htmlFor="ak"> Auckland</label>
            </td>

            <td className="text-left">
              <input onChange={this.handleRoleChange} type="radio" id ="om" name="role" value="OM"/>
              <label htmlFor="om"> Operations Manager</label>
            </td>
          </tr>

          <tr>
            <td className="text-left">
              <input onChange={this.handleBranchChange} type="radio" id ="wlg" name="branch" value="Wl"/>
              <label htmlFor="wlg"> Wellington</label>
            </td>

            <td className="text-left">
              <input onChange={this.handleRoleChange} type="radio" id ="pm" name="role" value="PM"/>
              <label htmlFor="pm"> Production Manager</label>
            </td>
          </tr>
        
          <tr>
            <td className="text-left">
              <input onChange={this.handleBranchChange} type="radio" id ="rot" name="branch" value="Ro"/>
              <label htmlFor="rot"> Rotorua</label>
            </td>

            <td className="text-left">
              <input onChange={this.handleRoleChange} type="radio" id ="pa" name="role" value="PA"/>
              <label htmlFor="pa"> Production Assistant</label>
            </td>
          </tr>
        </table>

        <div className="pt-4">
          <input className="bg-blue-300 hover:bg-blue-400 px-2 rounded-full" type="submit" value="Get instructions" />
        </div>
      </form>
    </div>
    )
  }
}

export default RoleSelector