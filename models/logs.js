const Sequelize=require('sequelize');

const sequelize_master=require('../db/master connection');

const logs=sequelize_master.define('logs',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    entry:{
        type: Sequelize.INTEGER,
        allowNull: false,
    }
})

module.exports={logs}