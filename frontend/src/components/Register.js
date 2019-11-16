import React, { Component } from 'react'
import { register } from './UserFunctions'
import FormValidator from './FormValidator';

class Register extends Component {
  constructor() {
    super()

    this.validator = new FormValidator([
      { 
        field: 'email', 
        method: 'isEmpty', 
        validWhen: false, 
        message: 'Email is required.' 
      },
      { 
        field: 'email',
        method: 'isEmail', 
        validWhen: true, 
        message: 'That is not a valid email.'
      },
      { 
        field: 'name', 
        method: 'isEmpty', 
        validWhen: false, 
        message: 'Name is required.'
      },
      { 
        field: 'password', 
        method: 'isEmpty', 
        validWhen: false, 
        message: 'Password is required.'
      }
    ]);

    this.state = {
      name: '',
      email: '',
      password: '',
      errors: {},
      validation: this.validator.valid(),
    }

    this.onChange = this.onChange.bind(this)
    this.submitted = false;
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleFormSubmit = event => {
    event.preventDefault();
    
    const validation = this.validator.validate(this.state);
    this.setState({ validation });
    this.submitted = true;

    if (validation.isValid) {
      // handle actual form submission here
      const newUser = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password
      }
      register(newUser).then(res => {
        this.props.history.push(`/login`)
      })
    }
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 mt-5 mx-auto">
            <form>
              <h1 className="h3 mb-3 font-weight-normal">Register</h1>
              <div className="form-group">
                <label htmlFor="name">First name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder="Enter your first name"
                  required
                  value={this.state.name}
                  onChange={this.onChange}
                />
                <span className="help-block">{this.state.validation.name.message}</span>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Enter email"
                  required
                  value={this.state.email}
                  onChange={this.onChange}
                />
                <span className="help-block">{this.state.validation.email.message}</span>
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Password"
                  required
                  value={this.state.password}
                  onChange={this.onChange}
                />
                <span className="help-block">{this.state.validation.password.message}</span>
              </div>
              <button
                type="submit"
                onClick={this.handleFormSubmit}
                className="btn btn-lg btn-primary btn-block"
              >
                Register!
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Register
