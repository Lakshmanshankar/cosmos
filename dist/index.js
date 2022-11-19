const {CosmosClient}=require('@azure/cosmos')
const CosmosContainer=require("./src/Container")
const CosmosItems=require("./src/Item")
const config=require('../config')

class ClientControl{

    /**
     * ClientControll is used to manipulate the azur cosmos DB using node js 
     * 
     * ClientControll can be used along with express and node js
     * 
     * You need to provide the 
     * @param {Object} options Refer to the below object
     * ```js
     * 
     *var options = {
        endpoint:"Your endpoint here",
        key:"your write key",
        partionkeys:{
            ids:[{kind:'Hash',paths:["/path_here"]}]
        },
        database:{
            id:'db-name'
        },
        containers:{
            ids:['Contianers']
        },
       }
     * ```
     */
     #client
     #configs
     #container
     #items
     constructor(options){
        this.#client=new CosmosClient({
            endpoint:options.endpoint,
            key:options.key
        })
        this.#configs={
            client:this.#client=new CosmosClient({
                endpoint:options.endpoint,
                key:options.key
            }),
            database:options.database.id,
            containers:options.containers.ids,
            partionkeys:options.partionkeys.ids
        }

        this.#container=new CosmosContainer(this.#configs)
        this.#items=new CosmosItems(this.#configs)
    }

    /**
     * createDatabase is used to create Azure Cosmos DB database
     * @returns {String} Containing the id of the Created Database
     */
    async createDatabase(){
        let {database} = await this.#client.databases.createIfNotExists({
            id:this.#configs.database
        })
        console.log(`Successfully created database ${database.id}`)
        return database.id
    }

    /**
     * Read the Database id from the azure cosmos DB account
     * @returns {String} readDatabase returns the ID of the database
     */
    async readDatabase(){
        let {resource:database}=(await this.#client.database(this.#configs.database).read())
        console.log(`status:[Success] read databse ${database.id}`)
        return database.id
    }


    /**
     *  listAllDatabase() function in ClientControl class is used to fetch the list of available databases
     *  and simply log the output in the console
     */
     async listAllDatabase(){
        let list=[]
        let resource=await (await this.#client.databases.readAll().fetchAll()).resources
        console.log("List of available Databases")
        resource.map((x)=>{
            console.log(x.id)
            list.push(x.id)
        })
        return list
    }

     /**
     * deleteDatabase function is used to delete the database in Azure Cosmos DB
     * @returns {String} Return the id of the database Deleted
     */
      async deleteDatabase(){
        let {database} =await this.#client.database(this.#configs.database).delete()
        console.log(`Status:[deleted] Database ${database.id}`)
        return database.id
    }


    /**
     * Used to create containers in Micorsoft Azure Cosmos DB 
     * @returns {Boolean} true if Operation is successfull else return false
     */
    async createContainers(){
        return this.#container.createContainers()
    }

    /**
     * ! Warning:
     * 
     * Used to Increase or decrease the RU/s of the container upto the limit of the Cosmos DB account
     * 
     * To increase it further then use the Azure portal or CLI
     * 
     * @param {Number} containerIndex The index of the container you want to Scale
     * @param {Number} throughputForContianer No of RU/S You want to set to the container Starting from 400 - unlimited incremented by 100 only (650 ~ not allowed)
     * @returns {Boolean} if successfull returns true else false
     */
    async scaleContainer(containerIndex,throughputForContianer){
        return this.#container.scaleContainer(containerIndex,throughputForContianer)
    }

    /**
     * List all the available Containers in A Azure cosmosDB database
     * @returns {Array} Returns a array of the Objects Containing list of Available Containers and The corresponding Object
     */
    async listAllContainers(){
        return this.#container.listAllContainers()
    }

    /**
     * Get the Basic Information about the container
     * @param {Number} indexOfContainer The indexOfTheContainer Not sure about indices uses listAllContainers()
     * @returns {Object} Object containing all the basic information about the Container
     */
    async getContainerInfo(indexOfContainer){
        return this.#container.getContainerInfo(indexOfContainer)
    }


    /**
     * Used to delete the container from
     * @param {Number} ContainerIndex 
     * @returns {Boolean} true if successfull else false
     */
    async deleteContainer(ContainerIndex){
        return this.#container.deleteContainer(ContainerIndex)
    }

    /**
     * Used to insert Item into the Container
     * @param {Number} indexOfContainer IndecOf the Container You want to Insert the Item
     * @param {Object} DataToBeInserted Object is the Set of Values that are Going to be inserted into the item
     * @returns {Boolean} True if Insertion Was successfull else False
     */
    async insertDataIntoContainer(indexOfContainer,DataToBeInserted){
        return this.#items.insertDataIntoContainer(indexOfContainer,DataToBeInserted)
    }

    /**
     * this is a special Method which is used to return A list containing all the ID's for the Available Items In a Container
     * @param {Number} ContainerIndex Index of the Contianer you want to get all the items
     * @returns {Array} containing all the Item Ids available in the container
     */
    async getAllItemIdsFromContainer(ContainerIndex){
        return this.#items.getAllItemIdsOfContainer(ContainerIndex)
    }

    /**
     * queryItemFromContainer is used to fetch the Item from the container
     * @param {String} IdOfTheItem Id of the Item You want to query from the container
     * @param {String} ObjectOfTheUSer Item you wants to search from the given Id default is 
     * @returns {Object} Newitem that is returned to use in the further process
     */
    async queryItemFromContainer(IdOfTheItem,ObjectOfTheUSer){
        return this.#items.queryItemFromContainer(IdOfTheItem,ObjectOfTheUSer)
    }

    /**
     * Used to Replace the Old item with the new Item In container in cosmos DB
     * @param {Number} ContainerIndex Index of the container you want to replace the new Item
     * @param {String} IdOfTheItem Id of the Old Item to Relplace it with new Ones
     * @param {Object} newItem New Item that is Replaced
     * @returns {Boolean} True if replaced else false
     */
    async replaceItemInContainer(ContainerIndex,IdOfTheItem,newItem){
        return this.#items.replaceItemInContainer(ContainerIndex,IdOfTheItem,newItem);
    }


    /**
     * Used to delete the Item from the CosmosDB container
     * @param {Number} ContainerIndex Index of the contianer you want to delete If you don't know the index then used listAllContainers
     * @param {String} IdOfTheItem Every item in the Cosmos DB has unique ID associated to get the Id Use GetAllItemIdsFromContainer(ContainerIndex)
     * @returns {Object} Return the Object that is deleted from the container
     */
    async deleteItemFromContainer(ContainerIndex,IdOfTheItem){
        return this.#items.deleteItemFromContainer(ContainerIndex,IdOfTheItem)
    }

}
module.exports=ClientControl;

// const college=new ClientControl(config)
// async function init(){
//     console.log(await college.createDatabase())
    // await college.readDatabase()
    // await college.listAllDatabase()
    // await college.deleteDatabase()
    // console.log(await college.createContainers())
    // console.log(await college.scaleContainer(0,500))
    // console.log(await college.listAllContainers())
    // console.log(await college.getContainerInfo(0))
    // console.log(await college.deleteContainer(0))
    // console.log(await college.insertDataIntoContainer(0,dumm))
    // console.log(await college.queryItemFromContainer("CStandsFor-III","Dean"))
    // console.log(await college.getAllItemIdsFromContainer(0))
    // console.log(await college.replaceItemInContainer(0,"DepartmentOfComputerScience-II",dumm))
    // console.log(await college.getAllItemIdsFromContainer(0))
    //console.log(await college.deleteItemFromContainer(0,"DepartMentOfComputerScience-III"))
// }
// init()