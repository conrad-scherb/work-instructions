import React from 'react';
import "./styles/tailwind.output.css"

class LoginContainer extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      value: '',
      hidden: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleChange(event: any) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event: any) {
    if (this.state.value == "escapefromlevel11") {
      this.setState({hidden: true})
    } else {
      alert("That password is incorrect!")
    }
    event.preventDefault();
  }

  render() {
    if (!this.state.hidden) {
      return (
        <form onSubmit={this.handleSubmit}>
            <label >Password: </label>
            <input type="text" value={this.state.value} onChange={this.handleChange} />
            <input className="bg-blue-300 px-2 rounded-full" type="submit" value="Submit" />
        </form>
      );
    } else {
      return ( <></> )
    }
  }
}

export default LoginContainer