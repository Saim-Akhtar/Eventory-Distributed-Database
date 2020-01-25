const Sequelize=require('sequelize');

const sequelize_master=require('../db/master connection');
const {sequelize_slave1,sequelize_slave2}=require('../db/slave connection')

const Venues_master=sequelize_master.define('Venues',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    uniqueKey:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    title:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    address:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    rating:{
        type: Sequelize.STRING,
        allowNull: false,
    }
})

const Venues_slave1=sequelize_slave1.define('Venues',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    uniqueKey:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    title:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    address:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    rating:{
        type: Sequelize.STRING,
        allowNull: false,
    }
})

const Venues_slave2=sequelize_slave2.define('Venues',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    uniqueKey:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    title:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    address:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    rating:{
        type: Sequelize.STRING,
        allowNull: false,
    }
})

module.exports={Venues_master,Venues_slave1,Venues_slave2};