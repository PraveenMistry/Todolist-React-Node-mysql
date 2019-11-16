import React, { Component } from 'react'
import { getProfile } from './UserFunctions'

class Profile extends Component {
  constructor() {
    super()
    this.state = {
      name: '',
      email: '',
      errors: {}
    }
  }

  componentDidMount() {
    const token = localStorage.usertoken
    if(token){
      getProfile(token).then(res => {
        if (res) {
          if(res.status === 'success'){
            this.setState({
              name: res.name,
              email: res.email
            })
          }else{
            localStorage.removeItem('usertoken')
            this.props.history.push(`/login`)
          }
        }
      });

    }else{
      localStorage.removeItem('usertoken')
      this.props.history.push(`/login`)
    }
  }

  render() {
    return (
      <div className="container">
        <div className="jumbotron mt-5">
          <div className="col-sm-8 mx-auto">
            <h1 className="text-center">PROFILE</h1>
          </div>
          <table className="table col-md-6 mx-auto">
            <tbody>
              <tr>
                <td>Name</td>
                <td>{this.state.name}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{this.state.email}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default Profile
