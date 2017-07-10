var app = require('express')()
var bP = require('body-parser').json()
var mongoose = require('mongoose')
mongoose.Promise = require('bluebird');
var url = 'mongodb://127.0.0.1/courses'
mongoose.connect(url, {useMongoClient: true});
var models = require('../database/models/models')

module.exports = function(app) {
  app.delete('/deleteCourse/:coursename', function(request, response) {
    models.Course
    .findOneAndRemove({'name': request.params.coursename})
    .then(function(result) {
      response.send(request.params.coursename + " course has been deleted")
    })
    .catch(function(err) {
      response.send({error: err})
    })
  })

  app.delete('/deleteCategory/:categoryname', function(request, response) {
    models.Course
      .find({"categories.name": request.params.categoryname})
      .then(function(result) {
        if(result.length == 0) {
          models.Category
          .remove({"name": request.params.categoryname})
          .exec()
          .then(function(r) {
            if(r.length == 0) {
              response.send('category not found')
            }
            else {
              response.send('category has been deleted')
            }
          })
          .catch(function(err) {
            response.send({error: err})
          })
        }

        else {
          response.send('Category could not be deleted.')
        }
      })
      .catch(function(error) {
        response.send({error:error})
      })
  })

  app.delete('/deleteSubCategory/:subcategoryname', function(request, response) {
    models.Course
      .find({"categories.subCategories.name": request.params.subcategoryname})
      .select({"name": 1})
      .then(function(result) {
        if(result.length == 0) {
          models.Category
          .remove({"subCategories.name": request.params.subcategoryname})
          .then(function(r) {
            if(r.length == 0) {
              response.send("subCategory not found.")
            }

            else {
              response.send("subCategory has been deleted.")
            }

          })
          .catch(function(err) {
            response.send({error: err})
          })
        }

        else {
            response.send('subCategory could not be deleted.')
        }
      })
      .catch(function(error) {
        response.send({error:error})
      })
  })
}