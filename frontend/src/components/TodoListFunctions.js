import axios from 'axios'

export const getList = token => {
    return axios
        .get('/api/tasks', {
        headers: { 
            'Content-Type': 'application/json',
            'Authorization':token
        }
        })
        .then(res => {
            res.data.status = 'success'
            return res.data
        }).catch(err => {
            return {
                error:'Please login again!',
                status:'failed',
                message:err.message
            }
        })
}

export const addToList = task => {
  return axios
    .post(
      '/api/task',
      {
        name: task.name,
        status: task.status
      },
      {
        headers: { 
            'Content-Type': 'application/json',
            'Authorization':task.token 
        }
      }
    )
    .then(function(response) {
        return response.data;
    }).catch(err => {
        return {
            error:'Error to add',
            status:'failed',
            message:err.message
        }
    })
}

export const deleteItem = (task, token) => {
  return axios
    .delete(`/api/task/${task}`, {
      headers: { 
            'Content-Type': 'application/json',
            'Authorization': token 
        }
    })
    .then(function(response) {
        console.log(response)
        return response;
    })
    .catch(function(error) {
      console.log(error)
      return error;
    })
}

export const updateItem = taskUpdateRequest => {
  return axios
    .put(
      `/api/task/${taskUpdateRequest.id}`,
      {
        name: taskUpdateRequest.name,
        status: taskUpdateRequest.status
      },
      {
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': taskUpdateRequest.token 
        }
      }
    )
    .then(function(response) {
        return response.data;
    })
}
