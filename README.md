### About ClientControll
This is a NPM package which is used to manipulate the Azure Cosmos DB

Cosmos DB is very high speed NoSQL database which which will provide response with 10ms

You can use this client controll class to use the Azure Cosmos db in your javascript application


Azure Cosmos DB hierarchy
Azure Subscription  ->      Azure CosmosDB Account    -> Azure NoSQL,MongoDB,Gremlin and Postgress      ->    Azure Container 
                                                                                                               /         \
                                                                                                            Items       Scale and more


### prerequistes:
1. Azure Subscription
2. COSMOS DB ACCOUNT


## Make New Connection To cosmos DB

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


## DATABASE OPERATIONS

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

## CONTAINER OPERATION

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


## Items Operation 







