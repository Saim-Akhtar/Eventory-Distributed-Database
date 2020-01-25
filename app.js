const express=require('express')
const app=express();
const path=require('path');
const dotenv=require('dotenv')

dotenv.config()

const bodyParser=require('body-parser');

// Importing database sequelize
const sequelize_master=require('./db/master connection')
const {sequelize_slave1,sequelize_slave2}=require('./db/slave connection')

// Importing Models
const {Event_master,Event_slave1,Event_slave2}=require('./models/event');
const Event_temp=require('./models/temp_event');
const {Sponsors_master,Sponsors_slave1,Sponsors_slave2}=require('./models/sponsors')
const {Sponsors_events_master,Sponsors_events_slave1,Sponsors_events_slave2}=require('./models/sponsors_events')
const {logs}=require('./models/logs')
const {Accounts}=require('./models/accounts')
const {City_master,City_slave1,City_slave2}=require('./models/cities')
const {Venues_master,Venues_slave1,Venues_slave2}=require('./models/venues')

// Importing routes
const mainRoute=require('./routes/main');
const eventsRoute=require('./routes/events')
const cityRoute=require('./routes/cities')
const venueRoute=require('./routes/venues')
const sponsorRoute=require('./routes/sponsors')

// configure ejs template
app.set('view engine','ejs')
app.set('views','views')

app.use(bodyParser.urlencoded({extended:true}))


// settings routes
app.use('/',mainRoute)
app.use('/events',eventsRoute)
app.use('/cities',cityRoute)
app.use('/venues',venueRoute)
app.use('/sponsors',sponsorRoute)

// creating relations 
// master
Event_master.belongsToMany(Sponsors_master, { through: Sponsors_events_master,onDelete:'cascade',hooks:true });
Sponsors_master.belongsToMany(Event_master, { through: Sponsors_events_master,onDelete:'cascade',hooks:true });
City_master.hasMany(Venues_master,{onDelete:'cascade',hooks:true});
Event_master.belongsTo(Venues_master);


// slave 1
Event_slave1.belongsToMany(Sponsors_slave1, { through: Sponsors_events_slave1,onDelete:'cascade',hooks:true });
Sponsors_slave1.belongsToMany(Event_slave1, { through: Sponsors_events_slave1,onDelete:'cascade',hooks:true });
City_slave1.hasMany(Venues_slave1,{onDelete:'cascade',hooks:true});
Event_slave1.belongsTo(Venues_slave1);

// slave 2
Event_slave2.belongsToMany(Sponsors_slave2, { through: Sponsors_events_slave2,onDelete:'cascade',hooks:true });
Sponsors_slave2.belongsToMany(Event_slave2, { through: Sponsors_events_slave2,onDelete:'cascade',hooks:true });
City_slave2.hasMany(Venues_slave2,{onDelete:'cascade',hooks:true});
Event_slave2.belongsTo(Venues_slave2);


sequelize_master
// .sync({force:true})
.sync()
.then(res=>{
    // console.log(res)
    console.log("tables created")
})
.catch(err=>{
    console.log("error found")
    console.log(err)
})

sequelize_slave1
// .sync({force:true})
.sync()
.then(res=>{
    // console.log(res)
    console.log("tables created")
})
.catch(err=>{
    console.log(err)
    console.log("error found in slave 1")
})

sequelize_slave2
// .sync({force:true})
.sync()
.then(res=>{
    // console.log(res)
    console.log("tables created")
})
.catch(err=>{
    console.log(err)
    console.log("error found in slave 2")
})

app.listen(5000,()=>{
    console.log("server has started")
})