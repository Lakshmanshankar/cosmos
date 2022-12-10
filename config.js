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

module.exports=config;