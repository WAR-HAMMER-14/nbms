const express = require('express');
const asyncHandler = require('express-async-handler');

const db = require('../../config/dbConnection');




const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users';
        db.query(sql, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};


const doLogin = (email) => {
    return new Promise((resolve, reject) => {
        const sql = " SELECT * FROM `admin` WHERE `email`= ? AND `delflag`='N'  ";
        db.query(sql,[email], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    })
}


const getUserCount = () => {
    return new Promise((resolve, reject) => {
        const sql = " SELECT COUNT(`id`) AS `USER_COUNT` FROM `users` WHERE `delflag` = 'N' ";
        db.query(sql, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

const getBuildingCount = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT COUNT(`id`) AS `BUILDING_COUNT` FROM `buildings` WHERE `delflag` = 'N' ";
        db.query(sql, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

const deleteBuildingById = (id) => {
    return new Promise((resolve, reject) => {
        const params = [];
        const sql = `UPDATE \`buildings\` SET \`delflag\` = 'Y', \`modified\` = NOW() WHERE \`id\` = ? `;
        params.push(id);

        db.query(sql,params,(err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

const checkStrataExistByBuildingId = (strata_number,building_id) => {
    return new Promise((resolve, reject) => {
        const params = [];
        let sql = ` SELECT * FROM \`buildings\` WHERE \`strata_number\` = ? AND \`id\` <> ? AND \`delflag\` = 'N' `;
        params.push(strata_number,building_id);

        // returns 0 if no data
        db.query(sql,params,(err, result) => {
            if (err) {
                reject(err);
            } 
            else {
                if(result.length > 0)
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


const checkStrataExist = (strata_number) => {
    return new Promise((resolve, reject) => {
        const params = [];
        let sql = ` SELECT * FROM \`buildings\` WHERE \`strata_number\` = ? AND \`delflag\` = 'N' `;
        params.push(strata_number);

        // returns 0 if no data
        db.query(sql,params,(err, result) => {
            if (err) {
                reject(err);
            } 
            else {
                if(result.length > 0)
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

const addBuilding = (buildingName,strataNumber,buildingAddress,suburb,postcode,additionalInfo,moveInOut,buildingPdf,buildingManager,buildingImage,publishStatus) => {
    return new Promise((resolve, reject) => {
        const params = [];
        let sql = `INSERT IGNORE INTO \`buildings\` SET
                    \`building_name\` = ? ,
                    \`strata_number\` = ? ,
                    \`building_address\` = ? ,
                    \`suburb\` = ? ,
                    \`postcode\` = ? ,
                    \`additional_info\` = ? ,
                    \`move_in_out\` = ? ,
                    \`building_pdf\` = ? ,
                    \`building_manager\` = ? ,
                    \`building_image\` = ? ,
                    \`publish_status\` = ? ,
                    \`created\` = NOW(),
                    \`modified\` = NOW(),
                    \`delflag\` = 'N' `;
        params.push(buildingName,strataNumber,buildingAddress,suburb,postcode,additionalInfo,moveInOut,buildingPdf,buildingManager,buildingImage,publishStatus);

        // returns 0 if no data
        db.query(sql,params,(err, result) => {
            if (err) {
                reject(err);
            } 
            else {
                // console.log(params);
                resolve(result);
                
            }
        });
    })
}


const editBuilding = (buildingName,strataNumber,buildingAddress,suburb,postcode,additionalInfo,moveInOut,buildingPdf,buildingManager,buildingImage,publishStatus,buildingId) => {
    return new Promise((resolve, reject) => {
        const params = [];
        let sql = `UPDATE IGNORE \`buildings\` SET
                    \`building_name\` = ? ,
                    \`strata_number\` = ? ,
                    \`building_address\` = ? ,
                    \`suburb\` = ? ,
                    \`postcode\` = ? ,
                    \`additional_info\` = ? ,
                    \`move_in_out\` = ? ,
                    \`building_pdf\` = ? ,
                    \`building_manager\` = ? ,
                    \`building_image\` = ? ,
                    \`publish_status\` = ? ,
                    \`modified\` = NOW()
                    WHERE \`id\` = ? 
                    `;
        params.push(buildingName,strataNumber,buildingAddress,suburb,postcode,additionalInfo,moveInOut,buildingPdf,buildingManager,buildingImage,publishStatus,buildingId);

        db.query(sql,params,(err, result) => {
            if (err) {
                reject(err);
            } 
            else {
                // console.log(params);
                resolve(result);
                
            }
        });
    })
}


const AddNewBuildingService = (title,name,contactNo,buildingId) => {
    return new Promise((resolve, reject) => {
        const params = [];
        let sql = `INSERT IGNORE INTO \`building_service\` SET 
        \`building_id\` = ? ,
        \`title\` = ? ,
        \`name\` = ? ,
        \`contact_no\` = ? ,
        \`created\` = NOW(),
        \`modified\` = NOW(),
        \`delflag\` = 'N' `;
        params.push(buildingId,title,name,contactNo);

        db.query(sql,params,(err, result) => {
            if (err) {
                reject(err);
            } 
            else {
                // console.log(params);
                resolve(result);
                
            }
        });
    })
}


const deleteBuildingService = (buildingId) => {
    return new Promise((resolve, reject) => {
        const params = [];
        let sql = `UPDATE IGNORE \`building_service\` SET \`delflag\` = 'Y', \`modified\` = NOW() WHERE \`building_id\` = ? `;
        params.push(buildingId);

        db.query(sql,params,(err, result) => {
            if (err) {
                reject(err);
            } 
            else {
                // console.log(params);
                resolve(result);
                
            }
        });
    })
}


const updateBuildingMoveinMoveoutQR = (buildingId, moveInQr, moveOutQr) => {
    return new Promise((resolve, reject) => {
        const params = [];
        let sql = `UPDATE IGNORE \`buildings\` SET 
                    \`sign_in_qr_code\` = ? ,
                    \`sign_out_qr_code\` = ?
                    WHERE \`id\` = ? `;
        params.push(moveInQr,moveOutQr,buildingId);

        db.query(sql,params,(err, result) => {
            if (err) {
                reject(err);
            } 
            else {
                // console.log(params);
                resolve(result);
                
            }
        });
    })
}



const chkUserBuildingEditAccess = (id,user_id) => {
    return new Promise((resolve, reject) => {
        const params = [];
        let sql = `SELECT * FROM \`user_access_control\` WHERE \`user_id\` = ? AND \`building_id\` = ? AND \`access_control_id\` = '4' `;
        params.push(user_id,id);

        // returns 0 if no data
        db.query(sql,params,(err, result) => {
            if (err) {
                reject(err);
            } 
            else {
                if(result.length > 0)
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


const updateBuildingUpdateStatus = (buildingId,status) => {
    return new Promise((resolve, reject) => {
        const params = [];
        let sql = ` UPDATE IGNORE \`buildings\` SET \`publish_status\` = ? WHERE \`id\` = ? `;
        params.push(status,buildingId);

        db.query(sql,params,(err, result) => {
            if (err) {
                reject(err);
            } 
            else {
                // console.log(params);
                resolve(result);
            }
        });
    })
}


const chkUserBuildingViewAccess = (id,user_id) => {
    return new Promise((resolve, reject) => {
        const params = [];
        let sql = `SELECT * FROM \`user_access_control\` WHERE \`user_id\` = ? AND \`building_id\` = ? `;
        params.push(user_id,id);

        db.query(sql,params,(err, result) => {
            if (err) {
                reject(err);
            } 
            else {
                if(result.length > 0)
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


const getBuildingServiceListById = (buildingId) => {
    return new Promise((resolve, reject) => {
        const params = [];
        let sql = `SELECT * FROM \`building_service\` WHERE \`delflag\` = 'N' AND \`building_id\` = ? `;
        params.push(buildingId);

        db.query(sql,params,(err, result) => {
            if (err) {
                reject(err);
            } 
            else {
                if(result.length > 0)
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



const getBuildingDetById = (buildingId) => {
    return new Promise((resolve, reject) => {
        const params = [];
        let sql = ` SELECT * FROM
                    (
                        SELECT * FROM \`buildings\` WHERE \`id\` = ? AND \`delflag\` = 'N'
                    )B
                    LEFT JOIN
                    (
                        SELECT \`id\` AS UID,  CONCAT(\`first_name\`, ' ', \`last_name\`) AS manager_name  FROM \`users\` WHERE \`delflag\` = 'N'
                    )U
                    ON B.building_manager = U.UID `;
        params.push(buildingId);

        db.query(sql,params,(err, result) => {
            if (err) {
                reject(err);
            } 
            else {
                if(result.length > 0)
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


const getUserBuildingsList = (user_id) => {
    return new Promise((resolve, reject) => {
        const params = [];
        let sql = `SELECT * FROM
                    (
                        SELECT * FROM \`buildings\` WHERE \`delflag\` = 'N' ORDER BY \`building_name\` 
                    ) WHOLE
                    INNER JOIN
                    (
                        SELECT \`user_id\`,\`building_id\` AS \`BIL_ID\` FROM \`user_access_control\` WHERE \`user_id\` = ? AND \`access_control_id\` = '1' GROUP BY \`building_id\`
                    )SUB
                        ON WHOLE.\`id\` = SUB.\`BIL_ID\` `;
        params.push(user_id);

        db.query(sql,params,(err, result) => {
            if (err) {
                reject(err);
            } 
            else {
                if(result.length > 0)
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



const getAllBuildingsList = () => {
    return new Promise((resolve, reject) => {
        const params = [];
        let sql = ` SELECT * FROM \`buildings\` WHERE \`delflag\` = 'N' ORDER BY \`building_name\`  `;

        db.query(sql,params,(err, result) => {
            if (err) {
                reject(err);
            } 
            else {
                if(result.length > 0)
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



const getAllAccessList = () => {
    return new Promise((resolve, reject) => {
        const params = [];
        let sql = ` SELECT * FROM \`access_control\` WHERE \`delflag\` = 'N'   `;

        db.query(sql,params,(err, result) => {
            if (err) {
                reject(err);
            } 
            else {
                if(result.length > 0)
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



const getUserBuildingAccessRecords = (user_id) => {
    return new Promise((resolve, reject) => {
        const params = [];
        let sql = ` SELECT * FROM
                    (
                        SELECT * FROM \`users\` WHERE \`id\` = ? AND \`delflag\` = 'N'
                    ) USERDET
                    INNER JOIN
                    (
                        SELECT \`id\` AS \`AC_TABLE_ID\`, \`user_id\`,\`building_id\`,GROUP_CONCAT(\`access_control_id\`) AS AC_ID FROM \`user_access_control\` GROUP BY \`building_id\`,\`user_id\`
                    ) USERACDET
                    ON
                        \`USERDET\`.\`id\` = \`USERACDET\`.\`user_id\`
                    ORDER BY \`AC_TABLE_ID\` DESC  `;

        params.push(user_id);

        db.query(sql,params,(err, result) => {
            if (err) {
                reject(err);
            } 
            else {
                if(result.length > 0)
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



const getBuildingList = (buildingName = "", postcode = "", strataNumber ="", address="", paginate = "", currPage = "1") => {
    return new Promise((resolve, reject) => {

        const params = [];
        let sql = `SELECT * FROM
                    (
                        SELECT * FROM \`buildings\` WHERE \`delflag\` = 'N' `;
                        if(buildingName)
                        {
                            sql += ` AND \`building_name\` LIKE ? `;
                            params.push(`%${buildingName}%`);
                        }
                        if(postcode)
                        {
                            sql += ` AND \`postcode\` = ? `;
                            params.push(postcode);
                        }
                        if(strataNumber)
                        {
                            sql += ` AND \`strata_number\` LIKE ? `;
                            params.push(`%${strataNumber}%`);
                        }
                        
                        if(address)
                        {
                            sql += ` AND ( \`building_address\` LIKE ? || \`suburb\` LIKE ? || \`postcode\` LIKE ? )`;
                            params.push(`%${address}%`,`%${address}%`,`%${address}%`);
                        }
                        
            sql += `)BUILDING
                    LEFT JOIN
                    (
                        SELECT \`id\` AS UID,  CONCAT(\`first_name\`, ' ', \`last_name\`) AS manager_name  FROM \`users\` WHERE \`delflag\` = 'N'
                    )USER
                    
                    ON BUILDING.building_manager = USER.UID
                    ORDER BY \`id\` DESC 
                    `;





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







module.exports = { getAllUsers, doLogin, getUserCount, getBuildingCount, getBuildingList, deleteBuildingById, chkUserBuildingEditAccess, chkUserBuildingViewAccess, getBuildingDetById, getBuildingServiceListById, checkStrataExistByBuildingId, checkStrataExist, addBuilding, AddNewBuildingService, editBuilding, deleteBuildingService, updateBuildingMoveinMoveoutQR, updateBuildingUpdateStatus, getUserBuildingsList, getAllBuildingsList, getAllAccessList, getUserBuildingAccessRecords }