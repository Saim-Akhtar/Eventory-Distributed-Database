const Sequelize=require('sequelize');

const sequelize_master=require('../db/master connection');

const Accounts=sequelize_master.define('accounts',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    userName:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    userType:{
        type:Sequelize.STRING,
        enum:['master','slave1','slave2'],
        required:true
    }
})

module.exports={Accounts}