# Project Title

- This project provides a method to migrate a mysql databases into a mongodb structure through denormalization.
- The project targets two tables (parent and child) that are joined in MySQL and should be migrated as one collection. a 1 parent collection with the child elements appended to an array as an extra field.
- in the current project, two tables `product` and `productpic` from MySQL are migrated into one collection `product` in mongodb
- `product` table carries all data about the products in a db
- `productpic` table carries image data for each product from the `product` table
- the two tables form a 1-to-many relationship

## Table of Contents

- [Project Title](#project-title)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)

## Installation

```bash
# Clone the repository
git clone https://github.com/popsware/mongo-mysql-migrate.git

# Navigate to the project directory
cd mongo-mysql-migrate

# Install dependencies
npm install

```


## Configuration
### Enviromental Variables
create a `.env` file at the project root and add these lines with your connection values
```
MYSQL_USER=[MySQL User Here]
MYSQL_PASS=[MySQL Password Here]
MYSQL_DBNAME=[MySQL DB Name Here]

MONGODB_URI=[MongoDB Connection URI Here]
MONGODB_DBNAME=[MongoDB DB Name Here]
```
### MongodDB config
- files `product.js` and `product-migrate.js`
    - edit the collectionName
### MySQL config
- file `product-migrate.js`
    - edit the dbTable
    - edit the dbJoinedTable
    - edit the following line to set the forien key used to join the tables. `productid` in table 1 and `id` in table 1
        ```
        const productPictures = await productpics.filter(pic => pic.productid === product.id);
        ```
    - edit the following line to set the fields (`id`,`image`,`pictype`) from the joined table and the new mongodb field to carry the joined data `pictures`
        ``` 
        pictures: await Promise.all(productPictures.map(async pic => ({
            id: pic.id,
            image: pic.image,
            pictype: pic.pictype
        })))
        ```

## Usage
- fetch mongodb products using 
    `http://localhost:3000/api/product?page=1&pageSize=2`
- clear mongodb products using 
    `http://localhost:3000/api/product/empty`
- read mysql products using 
    `http://localhost:3000/api/product/migrate/test`
- migrate the products from mysql to mongodb using 
    `http://localhost:3000/api/product/migrate/run`

## Fixed Issues

- Problem while reading MySQL data
    - your current mysql client is not supporting the authentication
    - your database is not allowing the current client to read using a native password
    - use the following command on your user to allow using native passwords `ALTER USER '[username]'@'localhost' IDENTIFIED WITH mysql_native_password BY '[YOUR PASSWORD]';`