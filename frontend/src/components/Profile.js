import React, { Component } from 'react'
import { getProfile, updatePassword } from './UserFunctions'
import FormValidator from './FormValidator'

class Profile extends Component {
  constructor() {
    super()

    this.validator = new FormValidator([
      { 
        field: 'password', 
        method: 'isEmpty', 
        validWhen: false, 
        message: 'Password is required.' 
      },
      { 
        field: 'new_password', 
        method: 'isEmpty', 
        validWhen: false, 
        message: 'New password is required.'
      },
      { 
        field: 'confirm_password', 
        method: 'isEmpty', 
        validWhen: false, 
        message: 'Password confirmation is required.'
      },
      { 
        field: 'confirm_password', 
        method: this.passwordMatch,   // notice that we are passing a custom function here
        validWhen: true, 
        message: 'Password and password confirmation do not match.'
      }
    ]);

    this.state = {
      name: '',
      email: '',
      password:'',
      new_password:'',
      confirm_password:'',
      errors: {},
      message:'',
      validation: this.validator.valid(),
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  passwordMatch = (confirmation, state) => (state.new_password === confirmation)


  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
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
            // localStorage.removeItem('usertoken')
            this.props.history.push(`/login`)
          }
        }
      });

    }else{
      localStorage.removeItem('usertoken')
      this.props.history.push(`/login`)
    }
  }

  
  onSubmit = e => {
    e.preventDefault()
    const validation = this.validator.validate(this.state);
    this.setState({ validation });
    if (validation.isValid) {
        // Reset Message
        this.setState({
          message: ''
        })
        const token = localStorage.usertoken;
        const updatePasswordRequest = {
            token: token,
            email:this.state.email,
            password: this.state.password,
            new_password: this.state.new_password
        }
    
        updatePassword(updatePasswordRequest).then((res) => {
            this.setState({
              message: res.message
            })
        }).catch(err=>{
            this.setState({message:err.message })
        })
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
              { this.state.message !== '' ?
              <tr>
                <td> <strong>Message: </strong></td>
                <td>
                <div className="col-md-12">
                    <div className="alert alert-info alert-dismissible fade show" role="alert">
                        {this.state.message}
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                  </div>
                </td>
              </tr>
              :
              <tr></tr>
              }
              <tr>
                <td>Update Password</td>
                <td>
                <form onSubmit={this.onSubmit}>
                    <table>
                      <tbody>
                        <tr>
                            <td>
                            <div className="form-group">
                              <label htmlFor="password">Password</label>
                              <div className="row">
                                <div className="col-md-12">
                                  <input
                                    type="hidden"
                                    className="form-control"
                                    value={this.state.email}
                                    name="email"
                                  />
                                  <input
                                    type="password"
                                    className="form-control"
                                    value={this.state.password}
                                    name="password"
                                    onChange={this.onChange}
                                  />
                                  <span className="help-block">{this.state.validation.password.message}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                          <div className="form-group">
                              <label htmlFor="new_password">New Password</label>
                              <div className="row">
                                <div className="col-md-12">
                                  <input
                                    type="password"
                                    className="form-control"
                                    value={this.state.new_password}
                                    name="new_password"
                                    onChange={this.onChange}
                                  />
                                  <span className="help-block">{this.state.validation.new_password.message}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                          <div className="form-group">
                              <label htmlFor="confirm_password">Confirm Password</label>
                              <div className="row">
                                <div className="col-md-12">
                                  <input
                                    type="password"
                                    className="form-control"
                                    value={this.state.confirm_password}
                                    name="confirm_password"
                                    onChange={this.onChange}
                                  />
                                  <span className="help-block">{this.state.validation.confirm_password.message}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                          <button className="btn btn-primary btn-block">
                              Update
                          </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </form>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default Profile
