import React from 'react';
import "../styles/tailwind.output.css"

class LoginContainer extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      value: '',
      hidden: false
    };

    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(event: any) {
    this.setState({value: event.target.value});
    this.props.onPwChange({value: event.target.value});
  }

  render() {
    const loggedIn = this.props.loggedIn

    if (!loggedIn) {
      return (
        <form onSubmit={this.props.handleSubmit}>
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