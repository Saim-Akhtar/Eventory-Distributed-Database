const Sequelize=require('sequelize');

const sequelize_master=require('../db/master connection');
const {sequelize_slave1,sequelize_slave2}=require('../db/slave connection')

const Sponsors_events_master=sequelize_master.define('sponsors_events',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    uniqueKey:{
        type: Sequelize.STRING,
        allowNull: false,
    }
})
const Sponsors_events_slave1=sequelize_slave1.define('sponsors_events',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    uniqueKey:{
        type: Sequelize.STRING,
        allowNull: false,
    }
})

const Sponsors_events_slave2=sequelize_slave2.define('sponsors_events',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    uniqueKey:{
        type: Sequelize.STRING,
        allowNull: false,
    }
})
module.exports={Sponsors_events_master,Sponsors_events_slave1,Sponsors_events_slave2}