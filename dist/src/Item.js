class CosmosItems{
     /**
     * CosmosItems class Item methods to manipulate the ComosDB Items
     * and Performing Queries
     * 
     * @param {Object} options 
     */
      constructor(options){
        this.client=options.client
        this.database=options.database,
        this.containers=options.containers
        this.partionKeys=options.partionkeys
    }

    /**
     * Insert the Items into the Azure container and return True if insertion was successfull else false
     */
    async insertDataIntoContainer(indexOfContainer,DataToBeInserted){
        let {item}=await (await this.client.database(this.database).container(this.containers[indexOfContainer]).items.upsert(DataToBeInserted))
        this.handleChangesInIndex(indexOfContainer,item)
        console.log(`Successfully Inserted Item ${item.id}`)
        if (item.id) {
            return true
        }else{
            return false
        }
    }


    /**
     * this.handleChangesInIndex() method is used to update the Items in Indexing Item in the contianer 
     */
    async handleChangesInIndex(indexOfContainer,item){
        let {resource}=await this.client.database(this.database).container(this.containers[indexOfContainer]).item("ContainerIndexItem").read()
        let temp=(resource.ItemIndex)
        temp.push(item.id)
        resource.ItemIndex=temp
        resource.ItemIndex=this.removeDuplicates(resource.ItemIndex)
        let index=await this.client.database(this.database).container(this.containers[indexOfContainer]).item("ContainerIndexItem").replace(resource)
        console.log(`Successfully modified the ContainerIndexItems`)
    }


    /**
     * Remove the duplicate values from the array and return the same
     */
    removeDuplicates(arr){
        var unique = [];
        arr.forEach(element => {
            if (!unique.includes(element)) {
                unique.push(element);
            }
        });
        return unique;
    }


    /**Get all the Ids for all the items in the contianer */
    async getAllItemIdsOfContainer(ContaineIndex){
        let {resource}=await this.client.database(this.database).container(this.containers[ContaineIndex]).item("ContainerIndexItem").read()
        console.log("Method will return Value")
        return resource.ItemIndex
    }

    async queryItemFromContainer(IdOfTheItem,ObjectOfUser){
        ObjectOfUser=`data.${ObjectOfUser}` || "*"
        // console.log(ObjectOfUser)
        const querySpec = {
            query: `SELECT ${ObjectOfUser} FROM data WHERE data.id = "${IdOfTheItem}"`,
          }
        var {resources:queryParams}=await this.client.database(this.database).container(this.containers[0]).items.query(querySpec).fetchAll()
        // queryParams.map((x)=>{
        //     console.log(x)
        // })
        return queryParams
    }

    /**
     * Replace the Old Item in the Cosmos DB container
     * @returns {Object} the Item that is Updated 
     */
    async replaceItemInContainer(ContainerIndex,IdOfTheItem,newItem){
        let {resource}=await this.client.database(this.database).container(this.containers[0]).item(IdOfTheItem).replace(newItem)
        this.handleChangesInIndexMid(ContainerIndex,await this.removeOldAddNewIds(IdOfTheItem,resource.id,await this.getAllItemIdsOfContainer(ContainerIndex)))
        console.log(`Status:[Success]: Updated Items of the contianer ${this.containers[ContainerIndex]}`)
        if (resource) {
            return true
        }else{
            return false
        }
    }

    /**
     * Replace the Old Item in the Indexing Item with the new Value
     * @param {Number} ContaineIndex 
     * @param {String} NewItemArrray 
     */
    async handleChangesInIndexMid(ContaineIndex,NewItemArrray){
        let {resource}=await this.client.database(this.database).container(this.containers[ContaineIndex]).item("ContainerIndexItem").read()
        resource.ItemIndex=NewItemArrray
        let index=await this.client.database(this.database).container(this.containers[ContaineIndex]).item("ContainerIndexItem").replace(resource)
        console.log(`Status ContainerIndexItems modified`)
    }

    /**
     * Accepts OldValue and NewValue replace the old Value with the new value and return the Array
     * @param {Number} oldVal Old value
     * @param {Number} NewVal New Value or the Value going to be replaced
     * @param {Array} iterable Iterable Object
     * @returns {Array}
     */
    removeOldAddNewIds(oldVal,NewVal,iterable){
        let temp=[]
        iterable.map((iterator)=>{
            if (iterator == oldVal){
                temp.push(NewVal)
            }else{
                temp.push(iterator)
            }
        })
        return temp
    }



    /**
     * Used to delete the Item from the Container and returns the deleted Item
     */
    async deleteItemFromContainer(ContainerIndex,IdOfTheItem){
        let {item}= await this.client.database(this.database).container(this.containers[ContainerIndex]).item(IdOfTheItem).delete()
        
        this.handleChangesInIndexMid(0,await this.deleteIdIfExists(item.id,await this.getAllItemIdsOfContainer(ContainerIndex)))
        console.log(`Status:[deleted] item of id ${item.id}`)
        return item
    }

    /**
     * Remove an Elecmet from the Array and Return the Same
     */
    async deleteIdIfExists(old,iterable){
        let temp=[]
        iterable.map((iterator)=>{
            if(iterator != old){
                temp.push(iterator)
            }
        })
        return true?temp:false
    }

}


module.exports=CosmosItems;