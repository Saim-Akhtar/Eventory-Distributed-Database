const uniqueKeyGenerator=require('../uniqueKeyGenerator')
const {Venues_master,Venues_slave1,Venues_slave2}=require('../models/venues');
const {City_master}=require('../models/cities')
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
    getVenues:async(req,res,next)=>{
        try{
            let venuesData=await generalQueryFunction(Venues_master,'read',
                                {attributes: ['id','title','uniqueKey','address','rating','cityId']})
            let citiesData=await generalQueryFunction(City_master,'read',
                                {attributes: ['id','name']})
            citiesData=[...citiesData].map(data=> {
                return {id:data.id,name:data.name}
            })
            
            venuesData=[...venuesData].map(data=> {
                const city=citiesData.find(c=> c.id === data.cityId)
                return {id:data.id,title:data.title,uniqueKey:data.uniqueKey,
                    address:data.address,rating:data.rating,city:city.name}
            })

            res.render('venues',{
                pageTitle: "Venues",
                path: "/venues",
                venuesList: venuesData,
                citiesList:citiesData
            })
        }
        catch(err){
            console.log("Error occured: ",err)
            // venuesData=[]
        }
    },
    addVenue:async(req,res,next)=>{
        try{
            const data={
                title:req.body.title,
                address:req.body.address,
                uniqueKey:uniqueKeyGenerator(),
                rating:req.body.rating,
                cityId:req.body.city
            }
            await generalQueryFunction(Venues_master,'write',data)
            await generalQueryFunction(Venues_slave1,'write',data)
            await generalQueryFunction(Venues_slave2,'write',data) 
        }
        catch(err){
            console.log(err)
            console.log("Error")
        }
        res.redirect('/venues')       
    },
    deleteVenue:async(req,res,next)=>{
        try{
            const key=req.body.uniqueKey
            await generalQueryFunction(Venues_master,'delete',{key:key})
            await generalQueryFunction(Venues_slave1,'delete',{key:key})
            await generalQueryFunction(Venues_slave2,'delete',{key:key})
        }
        catch(err){
            console.log(err)
            console.log("Error")
        }
        res.redirect('/venues')
    }
}
