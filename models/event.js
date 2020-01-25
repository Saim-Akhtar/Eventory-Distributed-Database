const Sequelize=require('sequelize');

const sequelize_master=require('../db/master connection');
const {sequelize_slave1,sequelize_slave2}=require('../db/slave connection');

const Event_master=sequelize_master.define('events',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    title:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    uniqueKey:{
        type: Sequelize.STRING,
        allowNull: false
    },
    date:{
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    // startTime:{
    //     type: Sequelize.TIME,
    // },
    // endTime:{
    //     type: Sequelize.TIME,
    // }

})

const Event_slave1=sequelize_slave1.define('events',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    title:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    uniqueKey:{
        type: Sequelize.STRING,
        allowNull: false
    },
    date:{
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    // startTime:{
    //     type: Sequelize.TIME,
    // },
    // endTime:{
    //     type: Sequelize.TIME,
    // }

})

const Event_slave2=sequelize_slave2.define('events',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    title:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    uniqueKey:{
        type: Sequelize.STRING,
        allowNull: false
    },
    date:{
        type: Sequelize.DATEONLY,
        allowNull: false
    }
})

module.exports={Event_master,Event_slave1,Event_slave2};