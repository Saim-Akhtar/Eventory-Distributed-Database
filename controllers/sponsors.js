const uniqueKeyGenerator=require('../uniqueKeyGenerator')
const {Sponsors_master,Sponsors_slave1,Sponsors_slave2}=require('../models/sponsors');
const Event_temp=require('../models/temp_event');

const generalQueryFunction=async(entity,operation,data)=>{
    if(operation === 'write'){
            await entity.create(data)   
    }
    else if(operation === 'delete'){
            await entity.destroy({where:{uniqueKey:data.key}})
    }
    else if(operation === 'read'){
        return await entity.findAll(data)
    }
}

module.exports={
    getSponsors:async(req,res,next)=>{
        try{
            let sponsorsData=await generalQueryFunction(Sponsors_master,'read',{attributes: ['id','name','uniqueKey']})
            sponsorsData=[...sponsorsData].map(data=> {
                return {id:data.id,name:data.name,uniqueKey:data.uniqueKey}
            })
            
            res.render('sponsors',{
                pageTitle: "Sponsors",
                path: "/sponsors",
                sponsorsList: sponsorsData
            })
        }
        catch(err){
            console.log("Error occured: ",err)
            // venuesData=[]
        }
    },
    addSponsor:async(req,res,next)=>{
        try{
            const data={
                name:req.body.name,
                uniqueKey:uniqueKeyGenerator()
            }
            await generalQueryFunction(Sponsors_master,'write',data)
            await generalQueryFunction(Sponsors_slave1,'write',data)
            await generalQueryFunction(Sponsors_slave2,'write',data)
        }
        catch(err){
            console.log(err)
            console.log("Error")
        }
        res.redirect('/sponsors')
    },
    deleteSponsor:async(req,res,next)=>{
        try{
            const key=req.body.uniqueKey
            await generalQueryFunction(Sponsors_master,'delete',{key:key})
            await generalQueryFunction(Sponsors_slave1,'delete',{key:key})
            await generalQueryFunction(Sponsors_slave2,'delete',{key:key})
        }
        catch(err){
            console.log(err)
            console.log("Error")
        }
        res.redirect('/sponsors')
    }
}