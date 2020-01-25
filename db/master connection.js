const Sequelize=require('sequelize')

const sequelize=new Sequelize(process.env.DATABASE,process.env.MASTER_USER,process.env.MASTER_PWD,{
    dialect: 'mysql',
    host: process.env.MASTER_IP,
    define: {
        timestamps: false
    },
    logging:false
})
// console.log(Sequelize.TIME)
module.exports=sequelize;

// const mysql=require('mysql2');

// const pool=mysql.createPool({
//     host:process.env.MASTER_IP,
//     user:process.env.MASTER_USER,
//     password:process.env.MASTER_PWD,
//     database:process.env.DATABASE
// })

// module.exports=pool.promise()