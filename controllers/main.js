const masterDB=require('../db/master connection')
const Event_temp=require('../models/temp_event')
const {Event_master,Event_slave1,Event_slave2}=require('../models/event')
const {Sponsors_events_master,Sponsors_event_slave1,Sponsors_events_slave2}=require('../models/sponsors_events')

const generalQueryFunction=async(entity,operation,data,condition= null)=>{
    if(operation === 'write'){
            return await entity.create(data)   
    }
    else if(operation === 'writeMany'){
        return await entity.bulkCreate(data)   
    }
    else if(operation === 'delete'){
            await entity.destroy(data)
    }
    else if(operation === 'read'){
        return await entity.findAll(data)
    }
    else if(operation === 'readOne'){
        return await entity.findOne(data)
    }
    else if(operation === 'verify'){
        const result=await entity.findOne(data)
        return result === null ? false:true
    }
    else if(operation === 'update'){
        await entity.update(data,condition)
    }
}


module.exports={
    displayMain: (req,res,next)=>{
        res.render('home',{
            pageTitle: "Node Organizers",
            path: '/'
        })
     
    },
    
    GET_queuedData:async(req,res,next)=>{
        try {
            // const user1Data=await Event_temp.findAll({where:{ inUser1: false}})
            // const user2Data=await Event_temp.findAll({where:{ inUser2: false}})
            const tempData=await Event_temp.findAll({attributes: ['id','uniqueKey','table_name','operation','to_User1','to_User2']})
            res.render('queued',{
                pageTitle: "Queued Data",
                path: '/queued',
                List:tempData,
                // user1Flag:user1Data.length,
                // user2Flag:user2Data.length
            })
        } 
        catch (err) {
            console.log(err)
        }       
    },
    trigger:async(req,res,next)=>{
        const {id,uniqueKey,operation,table}=req.body
        // console.log(req.body)
        const condition={where:{uniqueKey:uniqueKey}}
        try {
            if(operation === 'delete'){
                await generalQueryFunction(Event_slave1,operation,{where:{uniqueKey:uniqueKey}})
                await generalQueryFunction(Event_slave2,operation,{where:{uniqueKey:uniqueKey}})
            }
            else if(operation === 'update' || operation === 'write'){
                let obj=await generalQueryFunction(Event_master,'readOne',condition)
                const {title,uniqueKey,date,VenueId}=obj.dataValues
                const data={title,uniqueKey,date,VenueId}
                if(operation === 'update'){
                    await generalQueryFunction(Event_slave1,operation,data,condition)
                    await generalQueryFunction(Event_slave2,operation,data,condition)
                }
                
                if(operation === 'write'){
                    await generalQueryFunction(Event_slave1,operation,data)
                    await generalQueryFunction(Event_slave2,operation,data)

                    // let writeObj=await generalQueryFunction(Event_master,'readOne',condition)
                    // let eventId=writeObj.id
                    // let obj_list=await generalQueryFunction(Sponsors_events_master,'read',
                    //             {where:{eventId:eventId}})
                    // obj_list=[...obj_list].map(obj=>{
                    //     return {eventId:eventId,sponsorId:obj.sponsorId}
                    // })
                    // await generalQueryFunction(Sponsors_event_slave1,'write',obj_list)
                    // await generalQueryFunction(Sponsors_event_slave2,'write',obj_list)

                }

            }
            await generalQueryFunction(Event_temp,'delete',{where:{id:id}})    
        } catch (error) {
            console.log(error)
        }
        

        res.redirect('/queued')
    }
}