const Sequelize=require('sequelize')

const sequelize_slave1=new Sequelize(process.env.DATABASE,process.env.SLAVE1_USER,process.env.SLAVE1_PWD,{
    dialect: 'mysql',
    host: process.env.SLAVE1_IP,
    define: {
        timestamps: false
    },
    logging:false
})

const sequelize_slave2=new Sequelize(process.env.DATABASE,process.env.SLAVE2_USER,process.env.SLAVE2_PWD,{
    dialect: 'mysql',
    host: process.env.SLAVE2_IP,
    define: {
        timestamps: false
    },
    logging:false
})

module.exports={sequelize_slave1,sequelize_slave2};