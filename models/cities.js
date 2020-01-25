const Sequelize=require('sequelize');

const sequelize_master=require('../db/master connection');
const {sequelize_slave1,sequelize_slave2}=require('../db/slave connection')

const City_master=sequelize_master.define('city',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    uniqueKey:{
        type: Sequelize.STRING,
        allowNull: false,
    }
})

const City_slave1=sequelize_slave1.define('city',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    uniqueKey:{
        type: Sequelize.STRING,
        allowNull: false,
    }
})

const City_slave2=sequelize_slave2.define('city',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    uniqueKey:{
        type: Sequelize.STRING,
        allowNull: false,
    }
})

module.exports={City_master,City_slave1,City_slave2};