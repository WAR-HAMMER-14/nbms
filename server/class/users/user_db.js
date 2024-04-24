const express = require('express');
const asyncHandler = require('express-async-handler');

const db = require('../../config/dbConnection');


const getUsersList = (name = "", email = "", building ="", paginate = "", currPage = "1") => {
    return new Promise((resolve, reject) => {

        const params = [];
        let sql = `SELECT * ,GROUP_CONCAT(\`building_id\`)AS \`BUILD_ID\`,GROUP_CONCAT(\`building_name\`)AS \`BUILD_NAME\` FROM
        (
            SELECT * FROM \`users\` WHERE \`delflag\` = 'N' 
        )\`USERS\`
        `+(building == '' ? `LEFT JOIN` : `INNER JOIN`)+`
        (
            SELECT * FROM
            (
                SELECT \`user_id\`, \`building_id\`,\`access_control_id\` FROM \`user_access_control\` GROUP BY \`building_id\`,\`user_id\`
            )\`ACCESS\`
            INNER JOIN
            (
                SELECT \`id\` AS \`BI_ID\`, \`building_name\` FROM \`buildings\` WHERE \`delflag\` = 'N'
            )\`BUILDDATA\`
            ON
                \`ACCESS\`.\`building_id\` = \`BUILDDATA\`.\`BI_ID\`
        )\`PERMISSION\`
        ON
            \`USERS\`.\`id\` = \`PERMISSION\`.\`user_id\`
            
            
        WHERE 1=1 `;
            
                
         
     
       
        if(name)
        {
            sql += ` AND (\`first_name\` LIKE ? OR \`last_name\` LIKE ? OR CONCAT(\`first_name\`,\`last_name\`) LIKE ? ) `;
            params.push(`%${name}%`,`%${name}%`,`%${name.replace(/\s+/g, '')}%`);
        }
        if(email)
        {
            sql += ` AND \`email\` LIKE ? `;
            params.push(`%${email}%`);
        }
        
        if(building)
        {
            sql += ` AND \`building_id\` = ? `;
            params.push(building);
        }
        

        sql+= ` GROUP BY \`id\`  ORDER BY \`id\` DESC `;





        db.query(sql,params, (err, result) => {
            if(err){
                reject(err);
            }
            else
            {
                if(paginate === "N")
                {
                    resolve(result);
                }
                else
                {
                    // console.log(sql);
                    
                    const list = parseInt(process.env.ROW_PER_PAGE,10)
                    const num_rows = result.length;
                    const num_pages = Math.ceil(num_rows / list);
                    const start = list * (parseInt(currPage,10) - 1) ;

                    const dataSet = result.slice(start, start + list);

                    // console.log(typeof(list));
                    // console.log(typeof(num_rows));
                    // console.log(typeof(num_pages));
                    // console.log(typeof(start));
                    // console.log(typeof(currPage));
                    // console.log(typeof(start + list));
                    // console.log((start + list));


                    resolve({dataSet, num_pages, currPage});

                }
            }
        });
    })
}


const deleteUser = (user_id) => {
    return new Promise((resolve, reject) => {
        const params = [];
        let sql = ` UPDATE \`users\` SET \`delflag\` = 'Y', \`modified\` = NOW() WHERE \`id\` = ?  `;
        params.push(user_id);

        db.query(sql,params,(err, result) => {
            if (err) {
                reject(err);
            } 
            else {
                // console.log(result);
                if(result.affectedRows > 0)
                {
                    resolve(result);
                }
                else
                {
                    resolve(0);
                }
            }
        });
    
    })
}









module.exports = { getUsersList, deleteUser }