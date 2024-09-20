# E-Commerce

## Table of Contents
* Description
* Installation
* Usage
* License

## Overview

This is the back end for an E-commerce application, built using Object-Relational Mapping (ORM) techniques with Sequelize and MySQL. The application provides a RESTful API for managing an e-commerce platform's products, categories, tags, and their relationships.

By interacting with the database it allows users to view products, categories, and tags. Add, update, and delete products, categories, and tags. View product details including its related category and tags.
## Installation

To run this project locally, follow these steps:
npm install
npm run seed
npm start

## Usage/Examples

You can test the API using Insomnia
1. Get All Products: GET /api/products
2. Create a New Category: POST /api/categories
3. Update a Product: PUT /api/products/:id
4. Delete a Tag: DELETE /api/tags/:id


## License

This project is licensed under the MIT License.