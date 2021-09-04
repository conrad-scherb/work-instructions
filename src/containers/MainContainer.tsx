import React from 'react';
import HeaderContainer from './HeaderContainer';
import LoginContainer from './LoginContainer';
import RoleSelector from '../forms/RoleSelector';
import "../styles/tailwind.output.css"

class MainContainer extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loggedIn: false,
      password: '',
      branch: '',
      role: '',
      instrTarget: ''
    };

    this.handlePwChange = this.handlePwChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInstrGet = this.handleInstrGet.bind(this);
    this.handleRoleChange = this.handleRoleChange.bind(this);
    this.handleBranchChange = this.handleBranchChange.bind(this);
  }

  handleSubmit(event: any) {
    if (this.state.password.value === "escapefromlevel11") {
      this.setState({loggedIn: true})
    } else {
      alert("That password is incorrect!")
    }

    event.preventDefault();
  }

  handlePwChange(pw: any) {
    this.setState({password: pw})
  }

  handleBranchChange(branch: any) {
    this.setState({branch: branch})
  }

  handleRoleChange(role: any) {
    this.setState({role: role})
  }

  handleInstrGet(event: any) {
    this.setState({instrTarget: this.state.branch.value+this.state.role.value})
    event.preventDefault()
  }

  render() {
      return (
        <div className="w-screen">
          <LoginContainer 
            handleSubmit={this.handleSubmit}
            onPwChange={this.handlePwChange}
          />
          {this.state.loggedIn == true && <RoleSelector
            handleInstrGet={this.handleInstrGet}
            onBranchChange={this.handleBranchChange}
            onRoleChange={this.handleRoleChange}
          />
          }
          <HeaderContainer
            instrTarget={this.state.instrTarget}
            loggedIn={this.state.loggedIn}
          />
        </div>
      )
    //}
  }
}

export default MainContainer