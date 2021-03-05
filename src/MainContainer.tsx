import React from 'react';
import LoginContainer from './LoginContainer';
import "./styles/tailwind.output.css"

class MainContainer extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loggedIn: false,
      password: ''
    };

    this.handlePwChange = this.handlePwChange.bind(this);
  }

  handleSubmit(event: any) {
    console.log(this.state.password.value)
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

  render() {
    if (this.state.loggedIn) {
      return (
        <p>yep</p>
      )
    } else {
      return (
        <LoginContainer 
          handleSubmit={this.handleSubmit.bind(this)}
          onPwChange={this.handlePwChange}
        />
      )
    }
  }
}

export default MainContainer