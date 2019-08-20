# Software Engineer Challenge Lalamove

This is the code developed by Sofia Calderon for the lalamove software challenge (backend).

The description is: "In Lalamove, we are receiving order of delivery day and night. As a software engineer in Lalamove, you have to provide a reliable backend system to clients. Your task here is to implement three endpoints to list/place/take orders."

For more detailed information, see https://github.com/lalamove/challenge/blob/master/backend.md

## Installation

Before starting, change the Google API key to your own key. The Google API key can be found in the distanceCalculator.js
- const API_KEY = 'your-own-key';

In docker, simply run

`cd <your-path>/order-api`

`docker-compose up`

## Aditional information

No start.sh was included, as it was not needed to complete the assignment. The mysql db installation and initialization is done in the docker-compose.yml as well as the mysql-orders/initdb.sql

## Tech/Framework used

- node js
- mysql

## API Reference

RESTful API listening on port 8080

### Place order
- Method: `POST`
- URL path: `/orders`

### Take order
- Method: `PATCH`
- URL path: `/orders/:id`

### Order list
- Method: `GET`
- URL path: `/orders?page=:page&limit=:limit`

## Tests

No tests were written