<img align="right" src="https://github.com/marciovcampos/movieAPI/blob/master/public/images/logo.png"/>

MovieAPI
=====================

MovieAPI is a simple REST API build with Node JS.

This  was develop for discipline ARQUITETURA E DESENVOLVIMENTO DE APIs PARA BACKEND for the post-graduation Desenvolvimento de Aplicações para Dispositivos Móveis at PUC Minas (Brazil).

[![License](https://img.shields.io/github/license/marciovcampos/movieAPI.svg)](LICENSE)

## Give a Star! :star:
If you liked the project or if MovieAPI helped you, please give a star ;)

## Technologies implemented:

- Node JS
- MySQL

## Entities

- Movie
- Actor
- Director
- User

## Routes

Some exemples of api routes:

URL  | HTTP Verb | POST Body | Result 
------------- | ------------- | ------------- | -------------
/movies  | GET  | empty  | Return all movies
/movie  | POST   | JSON string  | Create a new movie
/movie/:id  | GET   | empty  | Return single movie
/movie/:id  | PUT   | JSON string  | Updates an existing movie
/movie/:id  | DELETE   | empty  | Deletes an existing movie
/actors  | GET  | empty  | Return all actors
/directors  | GET  | empty  | Return all directors
/user/:id  | GET  | empty  | Return single user
/auth/singin  | POST  | JSON string  | Return facebook token

## Postman

A Postman Collection with all endpoints is available [here](https://www.getpostman.com/collections/7fbcd85d51004e1af11d).

## About:
MovieAPI was developed by [Márcio Vinícius](https://github.com/marciovcampos) under the [MIT license](LICENSE).