const uniqueKeyGenerator=require('../uniqueKeyGenerator')
const {Event_master,Event_slave1,Event_slave2}=require('../models/event');
const {Venues_master,Venues_slave1,Venues_slave2}=require('../models/venues')
const {Sponsors_master}=require('../models/sponsors')
const {Sponsors_events_master,Sponsors_events_slave1,Sponsors_events_slave2}=require('../models/sponsors_events')
const Event_temp=require('../models/temp_event');

const rowCheck=async()=>{
    try {
        const res= await Event_temp.destroy({
            where: {
                inUser1: true,
                inUser2: true
            }
        })
        // const checkRows=await Event_temp.findAll()
        // if(checkRows.length === 0){
        //     Event_temp.destroy({ truncate: true, restartIdentity: true })
        // }
    } catch (err) {
        console.log("error")
    }
}


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

const getFlags=async(id,master_entity,slave_entity)=>{
    let object=await generalQueryFunction(master_entity,'readOne',
                            {where:{id:id},attributes:['id','uniqueKey']})
            const flag=await generalQueryFunction(slave_entity,'verify',
                            {where:{uniqueKey:object.uniqueKey}})
    return flag
}

const operation_slave=async(slave_entity,operation,data)=>{
    
}

const getVenues=async(eventsData)=>{
    const dataList=[]
    for(let data of eventsData){
        let venue=null;
        if(data.VenueId){
        const venueData=await Venues_master.findOne({where:{id:data.VenueId}})
        venue=venueData.dataValues.title
        }
         dataList.push({id:data.id,title:data.title,venue:venue,
                date:data.date,uniqueKey:data.uniqueKey})
    }
    return dataList
}

const getSponsors=async(eventsData)=>{
    const dataList=[]
    for(let data of eventsData){
        const sponsorData=await Sponsors_master.findOne({where:{id:data.sponsorId}})
         dataList.push({id:data.sponsorId,name:sponsorData.name})
    }
    return dataList
}

module.exports={
    getEvent:async(req,res,next)=>{
        const id=req.params.id
        try {
            const event_data=await generalQueryFunction(Event_master,'readOne',{where:{id:id}})
            const venueData=await generalQueryFunction(Venues_master,'readOne',{where:{id:event_data.VenueId}})
            const title=venueData === null ? null: venueData.title
            let event_sponsors_data=await generalQueryFunction(Sponsors_events_master,'read',
                                    {where:{eventId: id},attributes:['eventId','sponsorId']})
            event_sponsors_data=await getSponsors(event_sponsors_data)
            const sponsorsData=await generalQueryFunction(Sponsors_master,'read',{attributes:['id','name']})
            res.render('event_detail',{
                pageTitle:event_data.title,
                path: "/events",
                event_id:event_data.id,
                sponsorsList:sponsorsData,
                event_date:event_data.date,
                event_venue:title,
                event_sponsors:event_sponsors_data,
                event_key:event_data.uniqueKey
            })
        } catch (error) {
            console.log(error)
        }
    },
    getEvents:async(req,res,next)=>{
        let eventsData
        try{
            eventsData= await generalQueryFunction(Event_master,'read',
                            {attributes: ['id','title','VenueId','date','uniqueKey']})  
            eventsData= await getVenues(eventsData)
            res.render('events',{
                pageTitle: "Events",
                path: "/events",
                eventsList: eventsData
            })
        }
        catch(err){
            console.log("Error occured: ",err)
            // eventsData=[]
        }
    },
    GET_addEvent_sync:async(req,res,next)=>{
        let sponsorsData,venuesData
        try {
            
            sponsorsData=await generalQueryFunction(Sponsors_master,'read',{attributes:['id','name']})
            venuesData=await generalQueryFunction(Venues_master,'read',{attributes:['id','title']})
            sponsorsData=[...sponsorsData].map(data=> {
                return {id:data.id,name:data.name}
            })
            venuesData=[...venuesData].map(data=> {
                return {id:data.id,title:data.title}
            })

        } catch (error) {
            console.log("Error occured: ",err)
        }

        res.render('addEvent_sync',{
            pageTitle:"Add Event",
            path: "/events/add/sync",
            sponsorsList:sponsorsData,
            venuesList:venuesData
        })
    },
    POST_addEvent_sync: async(req,res,next)=>{
        const {title,venue,sponsor,date}=req.body
        const uniqueKey=uniqueKeyGenerator()
        try{
            const data={
                title:title,
                uniqueKey:uniqueKey,
                date:date,
                VenueId:venue
            }
            
            const result0=await generalQueryFunction(Event_master,'write',data)
            const result1=await generalQueryFunction(Event_slave1,'write',data)
            const result2=await generalQueryFunction(Event_slave2,'write',data)
            if(sponsor){
                let dataList=[...sponsor].map(dataId=>{
                    return {sponsorId:dataId,eventId:result0.dataValues.id}
                })
                await generalQueryFunction(Sponsors_events_master,'writeMany',dataList)
                dataList=[...sponsor].map(dataId=>{
                    return {sponsorId:dataId,eventId:result1.dataValues.id}
                })
                await generalQueryFunction(Sponsors_events_slave1,'writeMany',dataList)

                
                
                // let writeObj=await generalQueryFunction(Event_master,'readOne',{where:{uniqueKey:uniqueKey}})
                //     let eventId=writeObj.id
                //     let obj_list=await generalQueryFunction(Sponsors_events_master,'read',
                //                 {where:{eventId:eventId}})
                //     obj_list=[...obj_list].map(obj=>{
                //         return {eventId:eventId,sponsorId:obj.sponsorId}
                //     })
                //     await generalQueryFunction(Sponsors_events_slave1,'write',obj_list)

                dataList=[...sponsor].map(dataId=>{
                    return {sponsorId:dataId,eventId:result2.dataValues.id}
                })
                await generalQueryFunction(Sponsors_events_slave2,'writeMany',dataList)

                // await generalQueryFunction(Sponsors_events_slave2,'write',obj_list)
            }
        }
        catch(err){
            console.log(err)
            console.log("Error")
        }
        res.redirect('/events')
    },
    GET_addEvent_async:async(req,res,next)=>{
        let sponsorsData,venuesData
        try {
            
            sponsorsData=await generalQueryFunction(Sponsors_master,'read',{attributes:['id','name']})
            venuesData=await generalQueryFunction(Venues_master,'read',{attributes:['id','title']})
            sponsorsData=[...sponsorsData].map(data=> {
                return {id:data.id,name:data.name}
            })
            venuesData=[...venuesData].map(data=> {
                return {id:data.id,title:data.title}
            })

        } catch (error) {
            console.log("Error occured: ",err)
        }

        res.render('addEvent_async',{
            pageTitle:"Add Event",
            path: "/events/add/async",
            sponsorsList:sponsorsData,
            venuesList:venuesData
        })
    },
    POST_addEvent_async: async(req,res,next)=>{
        const {title,venue,sponsor,date}=req.body
        const uniqueKey=uniqueKeyGenerator()
        try{
            const data={
                title:title,
                uniqueKey:uniqueKey,
                date:date,
                VenueId:venue
            }
            const result=await generalQueryFunction(Event_master,'write',data)
            if(sponsor){
                let dataList=[...sponsor].map(dataId=>{
                    return {sponsorId:dataId,eventId:result.dataValues.id}
                })
                await generalQueryFunction(Sponsors_events_master,'writeMany',dataList)
            }
            // const slave1_flag=await getFlags(venue,Venues_master,Venues_slave1)
            // const slave2_flag=await getFlags(venue,Venues_master,Venues_slave2)
            const temp_data={
                uniqueKey:uniqueKey,
                table_name:'events',
                operation: 'write',
                // inUser1:slave1_flag,
                // inUser2:slave2_flag
            }
            await generalQueryFunction(Event_temp,'write',temp_data)
        }
        catch(err){
            console.log(err)
            console.log("Error")
        }
        res.redirect('/events')
    },
    addData_user1:async(req,res,next)=>{
        try {
            
            let user1Data=await Event_temp.findAll(
                {attributes: ['title','uniqueKey','date','venueId'],
                    where:{ inUser1: false}
                })
            user1Data=[...user1Data].map(data=> {
                return {title:data.title,uniqueKey:data.uniqueKey,date:data.date,venueId:data.venueId}
            })
            
            const myRes=await Event_slave1.bulkCreate(user1Data)
            if(myRes){
                console.log("transfer successfull")
            }
            await Event_temp.update({
                inUser1: true,
              },
              { where: { inUser1: false } });
              await rowCheck()
              res.redirect('/events/queued')
        } 
        catch (err) {
            console.log(err)
        }
        
    },
    addData_user2:async(req,res,next)=>{
        try {
            console.log("in function 2")
            let user2Data=await Event_temp.findAll(
                {attributes: ['title','uniqueKey','date','venueId'],
                    where:{ inUser2: false}
                })
            user2Data=[...user2Data].map(data=> {
                return {title:data.title,uniqueKey:data.uniqueKey,date:data.date,venueId:data.venueId}
            })
            console.log("user2 transfer successfull")
            const myRes=await Event_slave2.bulkCreate(user2Data)
            if(myRes){
                console.log("transfer successfull")
            }
            await Event_temp.update({
                inUser2: true,
              },
              { where: { inUser2: false } });
              await rowCheck()
              res.redirect('/events/queued')
        } 
        catch (err) {
            console.log(err)
        }
        
    },
    deleteEvent:async(req,res,next)=>{
        try{
            const id=req.params.id
            const key=req.body.uniqueKey
            const async_mode=req.body.async_mode
            const data={
                where:{uniqueKey:key}
            }
            if(async_mode){
            await generalQueryFunction(Event_master,'delete',data)
            const temp_data={
                uniqueKey:key,
                table_name:'events',
                operation: 'delete',
                // inUser1:slave1_flag,
                // inUser2:slave2_flag
            }
            await generalQueryFunction(Event_temp,'delete',data)
            await generalQueryFunction(Event_temp,'write',temp_data)
            }
            else{
                await generalQueryFunction(Event_master,'delete',data)
                await generalQueryFunction(Event_temp,'delete',data)
                await generalQueryFunction(Event_slave1,'delete',data)
                await generalQueryFunction(Event_slave2,'delete',data)
            }
        }
        catch(err){
            console.log(err)
            console.log("Error")
        }
        res.redirect('/events')
    },
    updateEvent:async(req,res,next)=>{
        try{
            const id=req.params.id
            const key=req.body.uniqueKey
            const async_mode=req.body.async_mode
            // console.log(req.body)
            const data={title:req.body.title,date:req.body.date}
            const condition= {where:{uniqueKey:key}}
            
            if(async_mode){
                await generalQueryFunction(Event_master,'update',data,condition)
                const temp_data={
                    uniqueKey:key,
                    table_name:'events',
                    operation: 'update',
                    to_User1:true,
                    to_User2:true
                }
                const response=await generalQueryFunction(Event_temp,'verify',condition)
                    if(response){
                        await generalQueryFunction(Event_temp,'update',temp_data,condition)
                    }
                    else{
                        await generalQueryFunction(Event_temp,'write',temp_data)   
                    }
                }
                else{
                    await generalQueryFunction(Event_master,'update',data,condition)
                    await generalQueryFunction(Event_slave1,'update',data,condition)
                    await generalQueryFunction(Event_slave2,'update',data,condition)
                    const temp_data={
                        uniqueKey:key,
                        table_name:'events',
                        operation: 'update',
                        to_User1:true,
                        to_User2:true
                    }
                    const response=await generalQueryFunction(Event_temp,'verify',condition)
                        if(response){
                            await generalQueryFunction(Event_temp,'update',temp_data,condition)
                        }
                }
        }
        catch(err){
            console.log(err)
            console.log("Error")
        }
        res.redirect('/events/'+req.params.id)
    }
}