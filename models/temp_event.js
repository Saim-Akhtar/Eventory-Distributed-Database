const Sequelize=require('sequelize');

const sequelize_master=require('../db/master connection');

const Event_temp=sequelize_master.define('events_temp',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey:true
    },
    uniqueKey:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    table_name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    operation:{
        type: Sequelize.STRING,
        allowNull: false
    },
    to_User1:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    to_User2:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
})


module.exports=Event_temp;