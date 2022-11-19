README is divided into Four Main Sections:
1. Introduction and prerequistes
2. Database Operations
3. Container Operations
4. Item Operations

### Introduction 
ClientControll is a NPM package which is used to manipulate the Azure Cosmos DB

Cosmos DB is very high speed NoSQL database which which will provide response within 10ms. which you can scale from 1000 to hundreds of million of requests instantly.

You can use this client controll class to use the Azure Cosmos db in your javascript application


Azure Cosmos DB hierarchy
```
Azure Subscription  ->      Azure CosmosDB Account    -> Azure NoSQL,MongoDB,Gremlin and Postgress      ->    Azure Container 
                                                                                                                 /       \
                                                                                                             Items     Scale and more
```
## Note
This Works only with Cosmos DB NoSQL database 
For MongoDB,Gremlin and Postgress refer to Azure Website


### Prerequistes:
1. Azure Subscription
2. Cosmos DB Account


## Installation
For NPM 
```sh
npm install client-controll-cosmos
```

for yarn 
```sh
yarn add client-controll-cosmos
```

# Make New Connection To cosmos DB

You Need to create a config Object with appropriate Credentials

```js

const ClientControll=require('./dist/index')

var config={
    endpoint:"Your_url_endpoint",
    key:"your_write_key",
    partionkeys:{
        ids:[{kind:'Hash',paths:["/partions"]}]
    },
    database:{
        id:'database_name'
    },
    containers:{
        ids:['container_name']
    },
}


const Client=new ClientControll(config)   //MAKING A CONNECTION
async function init(){
var db_name=await client.createDatabase() 
    console.log(db_name)
}

```


# DATABASE OPERATIONS

### Create Database

To create a COSMOS DB use the below code

```js
async function init(){
    var db_name=await Client.createDatabase();
     console.log(db_name)
}
```

### read Database

read_database is used to read the Database and return the database id
```js

async function init(){
var s=await Client.readDatabase();
}
```

### List All Database

read_database is used to read the Database and return the database id
```js

async function init(){
var db=await client.readDatabase()
    console.log(db)
}
```


### delete a database

DELETE Database is used to  delete db in cosmos DB

```js
var db=await client.deleteDatabase()
    console.log(db_d)
```

# CONTAINER OPERATION

All the Datab in the Azure Database is stored in containers

### Creating Container

Container will contains items which holds the data in azure cosmos DB
```js
async function init(){
    var x=await client.createContainers()
    console.log(x)
}
```

### Listing Container
list all the Available container for a database
```js
async function init(){
    var x=await client.listAllContainers()
    console.log(x)
}
```



### Scaling Container
Scaling is the process of increasing or decreasing the capacity to suits the needs
```js
async function init(){
    var x=await client.scaleContainer(0,600)
    console.log(x)
}
```

### Container Information Container
Contains an object that will show the container options available
```js
async function init(){
     var b=client.getContainerInfo(
    console.log(b)
}
```

### Deleting a container

Used to delete the container from Az sql
```js
async function init(){

    var c=await client.deleteContainer()
}
init()

```


# Items Operation 
Items are the JSON objects that contains the Values.
Items are Stored in Key value pair.
You are charged based on throughput and Read/Write
1 RU = read 1 KB of File[ View Azure CosmosDB pricinig](https://azure.microsoft.com/en-in/pricing/details/cosmos-db/autoscale-provisioned/?&ef_id=CjwKCAiAmuKbBhA2EiwAxQnt749meJE0kE--1Wx4b1sS3tvK5CmfKCbOsO41b_0J0bRUBz87eRpTDhoC3asQAvD_BwE:G:s&OCID=AIDcmmf1elj9v5_SEM_CjwKCAiAmuKbBhA2EiwAxQnt749meJE0kE--1Wx4b1sS3tvK5CmfKCbOsO41b_0J0bRUBz87eRpTDhoC3asQAvD_BwE:G:s&gclid=CjwKCAiAmuKbBhA2EiwAxQnt749meJE0kE--1Wx4b1sS3tvK5CmfKCbOsO41b_0J0bRUBz87eRpTDhoC3asQAvD_BwE)


### Insert An Item into Container
You can insert a JSON object into Cosmos DB container
```js
async function init(){
    console.log(await college.insertDataIntoContainer(0,{ObjectYouWantToStore}))
}
```


### Query Item From Container

Querying from the database is an essential part of all the application. you can query The item using the ID of the Item

Not sure about All the List of Available Ids.Don't worry You can use getAllItemIdsFromContainer(IndexOftheContainer).
```js
//to get All the Item Ids
async function init(){
 console.log(await college.queryItemFromContainer("ComputerScience-III","Dean")) //ComputerScience the Id Of the Item and We want to query the Dean Object from it
}
```


### replace an Item

CRUD stands for Create Update and Delete Here Replace is used to Update the exisiting object with the New Object
```js
async function init(){
    console.log(await college.replaceItemInContainer(0,"DepartmentOfComputerScience-II",NewObj))
    // 0  is the Index of the container
    // DepartmentOfComputerScience-II is the Id for the Item and
    // NewObje is the object that will replace the existing item 
}
```

### delete An Item from Container

Delete an unused Item saves a lot of memory but you need to be carefull when deleteing an Item
because you cannot delete a object in the item Instead this will delete the Entire Item

Syntax:
```js
async function init(){
    console.log(await college.deleteItemFromContainer(0,"DepartMentOfComputerScience-III"))
    // 0  is the Index of the container
    // DepartmentOfComputerScience-II is the Id for the Item that is going to be deleted
}

```


## Thank You For reading this documentation

