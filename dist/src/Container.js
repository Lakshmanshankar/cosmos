class CosmosContainer{
    /**
     * CosmosContainer class container methods to manipulate the ComosDB containers
     * @param {Object} options 
     */
    constructor(options){
        this.client=options.client
        this.database=options.database,
        this.containers=options.containers
        this.partionKeys=options.partionkeys
    }

    async createContainers(){ 
        let status=false
        this.containers.map(async (containerId,i)=>{
        let data=await this.createContainer(containerId,this.partionKeys[i])
        var {item}=await this.client.database(this.database).container(this.containers[i]).items.upsert({
            id:"ContainerIndexItem",
            ItemIndex:[]
        })
        console.log(`Successfully Created Container ${data} with Item${item.id}`)
        })
        return true?(!status):false
        
    }

    async createContainer(containerId,PartionKey){
        let {container}=await this.client.database(this.database).containers.createIfNotExists({id:containerId,partitionKey:PartionKey})
        console.log(`status :[Success] Created container ${container.id}`)
        return container
    }


    async scaleContainer(containerIndex,throughputForContianer){
        var {resource:containerThroughput}=await this.client.database(this.database).container(this.containers[containerIndex]).read()
        try {
             var {resources}=await this.client.offers.readAll().fetchAll()
             for (const resource of resources){
                 if (resource.offerResourceId !== containerThroughput._rid) {
                     continue
                 }
                 resource.content.offerThroughput=throughputForContianer;
                 const offerToReplace=this.client.offer(resource.id)
                 await offerToReplace.replace(resource)
                 console.log(`Updated offer to ${throughputForContianer} RU/s for Container ${this.containers[containerIndex]}\n`);
                 return true;
                 break;
                 
             }
        } catch (err) {
             if (err.code == 400)
             {
                 console.log(`Cannot read container throuthput.\n`);
                 console.log(err.body.message);
             }
             else 
             {
                 throw new Error("Cannot Scale the Container Throughput,Please check in Azure Portal");
             }
             return false
        }
     }


    async listAllContainers(){
        var store=[]
        var {resources:containers}= await (await this.client.database(this.database).containers.readAll().fetchAll())
        console.log("List of Available containers")
        containers.map((container,id)=>{
            let temp=container.id
            store.push({temp:id})
            console.table(`Name:${container.id} \t\t Index:${id}`)
        })
        return store
    }


    async getContainerInfo(containerIndex){
        const {resource:response}=await this.client.database(this.database).container(this.containers[containerIndex]).read()
        var {resources}=await this.client.offers.readAll().fetchAll()
        let maxThroughputEverProvisioned=0
        let offereredThroughput=0
        resources.map((x)=>{
            offereredThroughput=x.content.offerThroughput,
            maxThroughputEverProvisioned=x.content.offerMinimumThroughputParameters
        })
        var details={
            nameOfContainer:response.id,
            PartionKey:response.partitionKey,
            database:this.database,
            maxThroughput:maxThroughputEverProvisioned,
            currentThroughput:offereredThroughput,
            conflictResolutionPolicy:response.conflictResolutionPolicy,
            _rid:response._rid,
            _etag:response._etag,
            _self:response._self,
            _ts:response._ts
        }
        return details
    }

    async deleteContainer(containerIndex){
        const deleted=(this.containers)
        var s=await this.client.database(this.database).container(this.containers[containerIndex]).delete()
        console.log(`Successfully Deleted Container ${deleted}${s}`)
        return true?(s):false
    }
}

module.exports=CosmosContainer;