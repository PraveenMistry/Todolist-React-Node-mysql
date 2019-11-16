const express = require('express')
const users = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const User = require('../models/User')
users.use(cors())

process.env.SECRET_KEY = 'secret'

users.post('/register', (req, res) => {
    const today = new Date()
    const userData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      createdAt: today
    }
  
    User.findOne({
      where: {
        email: req.body.email
      }
    })
    .then(user => {
        if (!user) {
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                userData.password = hash
                User.create(userData)
                .then(user => {
                    let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                        expiresIn: 1440
                    })
                    res.json({ token: token })
                })
                .catch(err => {
                    res.send('error: ' + err)
                })
            })
            
        } else {
          res.json({ error: 'User already exists' })
        }
      })
      .catch(err => {
        res.send('error: ' + err)
      })
})


users.post('/login', (req, res) => {
    User.findOne({
      where: {
        email: req.body.email
      }
    })
      .then(user => {
        if (user) {
            if(bcrypt.compareSync(req.body.password,user.password)){
                let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                    expiresIn: 1440
                })
                res.json({ token: token })
            }else{
                res.send('Wrong Password!');
            }
        } else {
          res.status(400).json({error:'User does not exist'});
        }
      })
      .catch(err => {
        res.status(400).json({error:err})
      })
})

users.get('/profile', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  User.findOne({
    where: {
      id: decoded.id
    }
  })
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        res.send('User does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})



users.put('/password', function(req, res, next) {
  if(req.headers['authorization']){
    if (!req.body.email && !req.body.password && !req.body.new_password && !req.body.confirm_password) {
      res.status(400)
      res.json({
        error: 'Bad Data'
      })
    } else {

        User.findOne({
          where: {
            email: req.body.email
          }
        })
        .then(user => {
          if (user) {
              if(bcrypt.compareSync(req.body.password,user.password)){
                bcrypt.hash(req.body.new_password,10,(err,hash)=>{
                    User.update(
                        { password: hash },
                        { where: { email: req.body.email } }
                      )
                      .then(() => {
                        res.json({ status: 'success', message:'Password Updated !' })
                      })
                      .error(err => handleError(err))
                })
              }else{
                res.json({
                  status:'failed',
                  message:'Old password not matched'
                });
              }
            }
        })
    }
  }
  else{
    res.json({status:'failed',message:'Token not passed !'})
  }
})

module.exports = users;