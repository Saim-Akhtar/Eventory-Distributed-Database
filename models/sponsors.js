const Sequelize=require('sequelize');

const sequelize_master=require('../db/master connection');
const {sequelize_slave1,sequelize_slave2}=require('../db/slave connection')

const Sponsors_master=sequelize_master.define('sponsors',{
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

const Sponsors_slave1=sequelize_slave1.define('sponsors',{
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

const Sponsors_slave2=sequelize_slave2.define('sponsors',{
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
module.exports={Sponsors_master,Sponsors_slave1,Sponsors_slave2};