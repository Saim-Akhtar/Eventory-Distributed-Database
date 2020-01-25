const uniqueKeyGenerator=require('../uniqueKeyGenerator')
const {City_master,City_slave1,City_slave2}=require('../models/cities');
const Event_temp=require('../models/temp_event');

const generalQueryFunction=async(entity,operation,data)=>{
    if(operation === 'write'){
            return await entity.create(data)   
    }
    else if(operation === 'delete'){
            await entity.destroy({where:{uniqueKey:data.key}})
    }
    else if(operation === 'read'){
        return await entity.findAll(data)
    }
}


module.exports={
    getCities:async(req,res,next)=>{
        try{
            let citiesData=await generalQueryFunction(City_master,'read',{attributes: ['id','name','uniqueKey']})
            citiesData=[...citiesData].map(data=> {
                return {id:data.id,name:data.name,uniqueKey:data.uniqueKey}
            })
            
            res.render('cities',{
                pageTitle: "Cities",
                path: "/cities",
                citiesList: citiesData
            })
        }
        catch(err){
            console.log("Error occured: ",err)
            // citiesData=[]
        }
    },
    addCity:async(req,res,next)=>{
        try{
            const data={
                name:req.body.name,
                uniqueKey:uniqueKeyGenerator()
            }
            await generalQueryFunction(City_master,'write',data)
            await generalQueryFunction(City_slave1,'write',data)
            await generalQueryFunction(City_slave2,'write',data)
        }
        catch(err){
            console.log(err)
            console.log("Error")
        }
        res.redirect('/cities')
    },
    deleteCity:async(req,res,next)=>{
        try{
            const key=req.body.uniqueKey
            await generalQueryFunction(City_master,'delete',{key:key})
            await generalQueryFunction(City_slave1,'delete',{key:key})
            await generalQueryFunction(City_slave2,'delete',{key:key})
        }
        catch(err){
            console.log(err)
            console.log("Error")
        }
        res.redirect('/cities')
    }
}