import React, { Component } from 'react'
import { getList, addToList, deleteItem, updateItem } from './TodoListFunctions'
import FormValidator from './FormValidator'

class TodoList extends Component {
  constructor() {
    super()


    this.validator = new FormValidator([
        { 
          field: 'task', 
          method: 'isEmpty', 
          validWhen: false, 
          message: 'Task name is required' 
        },
        { 
          field: 'status',
          method: 'isEmpty', 
          validWhen: false, 
          message: 'Status is required'
        }
      ]);

    this.state = {
      id: '',
      task: '',
      status: 0,
      createdAt:'',
      isUpdate : false,
      errorMessage:'',
      items: [],
      validation: this.validator.valid(),
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onCreate = this.onCreate.bind(this)
  }

  componentDidMount() {
    const token = localStorage.usertoken;
    this.getAll(token)
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  onCreate(e) {
    e.preventDefault()
    const token = localStorage.usertoken;
    this.setState({
      id: '',
      task: '',
      status: 0,
      createdAt:'',
      isUpdate : false,
      errorMessage:'',
      items: [],
      validation: this.validator.valid(),
    });
    this.getAll(token)
  }

  getStatus(statusCode) {
    const status = ['Start','In Progress','End'];
    return status[statusCode];
  }


  formatDate(date) {
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
    return date.getDate() + ' ' + monthNames[date.getMonth()] + ', ' + date.getFullYear();
  }
  

  getAll = token => {
    getList(token).then(data => {
        if(data.status !== 'success'){
            localStorage.removeItem('usertoken')
            this.props.history.push(`/login`)
        }else{
            this.setState(
                {
                    task: '',
                    items: [...data]
                },
                () => {
                    console.log(this.state.items)
                }
            )
        }
    })
  }

  onSubmit = e => {
    e.preventDefault()
    const validation = this.validator.validate(this.state);
    this.setState({ validation });
    if (validation.isValid) {
        const token = localStorage.usertoken;

        const taskRequest = {
            token: token,
            name: this.state.task,
            status: this.state.status
        }

        addToList(taskRequest).then(() => {
            this.getAll(token)
        }).catch(err=>{
            this.setState({ editDisabled: false, errorMessage:err.message })
        })
        this.setState({ editDisabled: false })
    }
  }

  onUpdate = e => {
    e.preventDefault()
    const validation = this.validator.validate(this.state);
    this.setState({ validation });
    if (validation.isValid) {
        const token = localStorage.usertoken;
        const taskUpdateRequest = {
            id: this.state.id,
            token: token,
            name: this.state.task,
            status: this.state.status
        }
        updateItem(taskUpdateRequest).then(() => {
        this.getAll(token)
        }).catch(err=>{
            this.setState({ editDisabled: false, isUpdate:false, errorMessage:err.message })
        })
    }
    this.setState({ editDisabled: false, isUpdate:false,status: 0 })
  }

  onEdit = (item_id, item, status, e) => {
    e.preventDefault()
    this.setState({
      id: item_id,
      task: item,
      status:status,
      errorMessage:'',
      isUpdate:true,
      validation: this.validator.valid(),
    })
  }

  onDelete = (val, e) => {
    e.preventDefault()
    const token = localStorage.usertoken;
    deleteItem(val, token).then((res) => {
        if(res.data.status === 'failed'){
            this.setState({ errorMessage:res.data.message })
        }
        this.getAll(token);
    }).catch(err=>{
        this.setState({ errorMessage:err.data.message })
    })
  }

  render() {
    return (
    <div className="row"> 
        <div className="col-md-12 mt-5">
        <div className="col-md-12">
        { this.state.errorMessage !== '' ?
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error Message: </strong> {this.state.errorMessage}
            </div>
            :
            <div></div>
        }
        </div>
        <form onSubmit={this.onSubmit}>
        <div className="form-group">
            <label htmlFor="task">Task Title</label>
            <div className="row">
              <div className="col-md-12">
                <input
                  type="text"
                  className="form-control"
                  value={this.state.task}
                  name="task"
                  onChange={this.onChange}
                />
                <span className="help-block">{this.state.validation.task.message}</span>
              </div>
            </div>
        </div>
        <div className="form-group">
            <label htmlFor="status">Task Status</label>
            <div className="row">
              <div className="col-md-12">
                <select className="form-control" name="status" value={this.state.status} onChange={this.onChange}>
                    <option  value="0">Start</option>
                    <option value="1">In Progress</option>
                    <option value="2">End</option>
                </select>
                <span className="help-block">{this.state.validation.status.message}</span>
              </div>
            </div>
        </div>
        <button className="btn btn-primary btn-block" onClick={this.onUpdate.bind(this)} 
             style={this.state.isUpdate ? {} : { display: 'none' }} 
        >
            Update
        </button>
        <button type="submit" onClick={this.onSubmit.bind(this)} className="btn btn-success btn-block"
            style={this.state.isUpdate ? {display: 'none' } : {  }}
        >
            Submit
        </button>
        <button onClick={this.onCreate.bind(this)} className="btn btn-info btn-block"
            style={this.state.isUpdate ? {} : { display: 'none' }} 
        >
            Create New
        </button>
        </form>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Created Date</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {this.state.items.map((item, index) => (
              <tr key={index}>
              <td className="text-left">{item.name}</td>
                <td className="text-left">{this.getStatus(item.status)}</td>
                <td className="text-left">{this.formatDate(new Date(item.createdAt))}</td>
                <td className="text-right">
                  <button
                    className="btn btn-info mr-1"
                    disabled={this.state.editDisabled}
                    onClick={this.onEdit.bind(this, item.id, item.name, item.status)}
                  >
                    Edit
                  </button>
                  <button
                    href=""
                    className="btn btn-danger"
                    onClick={this.onDelete.bind(this, item.id)}
                    style={this.state.isUpdate ? {display: 'none' } : {  }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    )
  }
}

export default TodoList