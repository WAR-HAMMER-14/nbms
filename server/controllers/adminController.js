const asyncHandler = require('express-async-handler');
const building_db = require('../class/buildings/building_db');
const user_db = require('../class/users/user_db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const fs = require('fs');
const sharp = require('sharp'); // sharp library for making thumb
const axios = require('axios');
const nodemailer = require('nodemailer');






const getUsers = asyncHandler(async(req, res) => {
    
    const { name,email,building,flag,paginate,currPage } = req.body; 
    
    if(flag === 'users_list')
    {
        const usersList = await user_db.getUsersList(name,email,building,paginate,currPage);
        const jsonData = JSON.stringify(usersList.dataSet);
        
        res.send(jsonData+'<@_@>'+usersList.num_pages+'<@_@>'+usersList.currPage);
    }
        
        // console.log(req.body);
})

const getDashboardStats = asyncHandler(async(req, res) => {
    const { flag } = req.body; 

    if(flag === 'GET_USER_AND_BUILDING_COUNT')
    {
        const userCount = await building_db.getUserCount();

        const buildingCount = await building_db.getBuildingCount();

        res.send(userCount[0].USER_COUNT+"<@_@>"+buildingCount[0].BUILDING_COUNT);
    
    }

    // console.log(flag);
});


const deleteUsers = asyncHandler(async(req,res) => {
    const { flag, id } = req.body;

    if(flag === 'delete')
    {
        const response = await user_db.deleteUser(id);

        if(response)
            res.send("User Deleted Successfully");
        else
            res.send("Error occured");
    }
    else if(flag === 'multiDelete')
    {
        const idArray = id.split(",");

        for(let i=0;i<idArray.length;i++)
        {
            const response = await user_db.deleteUser(idArray[i]);

            // if(response)
            //     res.send("User Deleted Successfully");
            // else
            //     res.send("Error occured");
        }

        res.send("User Deleted Successfully");

    }


});


const getManagers = asyncHandler(async(req, res) => {
    const usersList = await user_db.getUsersList('','','','N','1');
    // console.log(usersList);
    res.send(usersList);
});


const getBuildingAssignDet = asyncHandler(async(req, res) => {
    const { flag, user_id } = req.body;
     
    console.log(user_id);

    if(flag === 'buildings')
    {
        let buildingList = '';
        if(user_id !== '' && user_id !== undefined && user_id !== null)
        {
            buildingList = await building_db.getUserBuildingsList(user_id);
        }
        else
        {
            buildingList = await building_db.getAllBuildingsList();
        }

        res.send(JSON.stringify(buildingList));
    }
    else if(flag === 'AC_list')
    {
        const access_list = await building_db.getAllAccessList();

        res.send(JSON.stringify(access_list));
    }
    else if(flag === 'user_building_access_records')
    {
        const user_building_access_records = await building_db.getUserBuildingAccessRecords(user_id);

        res.send(JSON.stringify(user_building_access_records));
    }




});



const updateBuildingPublishStatus = asyncHandler(async(req, res) => {

    const { id, publishStatus } = req.body;

    if( id !== '' && id !== undefined && id !== null && publishStatus !== '' && publishStatus !== undefined && publishStatus !== null )
    {
        const publishRes = await building_db.updateBuildingUpdateStatus(id, publishStatus);
    }
   
    res.send('helo 🙋🏽‍♂️😎🤣');

});

const addEditBuilding = asyncHandler(async(req, res) => {

    //form data
    let { building_name , strata_number, building_address, suburb, postcode, additional_info, move_in_out, flag, building_id, manager_id, publish_status, buildingServices } = req.body;


    // files
    const building_image = req.files.building_image;
    const building_pdf = req.files.building_pdf;

    // new building image and pdf name
    let building_image_name = '';
    let building_pdf_name = ''; 


    if(strata_number !== null && strata_number !== '' && strata_number !== undefined)
    {
        let strata_exist = [];
        if(flag === 'edit')
        {
            strata_exist = await building_db.checkStrataExistByBuildingId(strata_number,building_id);
        }
        else
        {
            strata_exist = await building_db.checkStrataExist(strata_number);
        }

        if(strata_exist.length)
        {
            res.send('STRATA_NUMBER_EXIST');
            return false;
        }

    }


    console.log(req.files.building_image);
    console.log(req.files.building_pdf);


    // for image upload
    if(req.files.building_image !== undefined)
    {
        // Define the destination folder for your files
        const destinationFolder = './'+process.env.BUILDING_UPLOADING_PATH; // Replace with your desired destination folder
        const destinationFolderThumb = './'+process.env.BUILDING_UPLOADING_PATH+'/thumbs'; // Replace with your desired destination folder

        // supported file types array
        const ext1Arr = ['jpg', 'JPG', 'JPEG', 'jpeg', 'png', 'PNG', 'gif', 'GIF'];

        // store the extension
        let fileNameArr1 = building_image[0].originalname.split('.');

        // store the extension
        let ext1 = fileNameArr1[fileNameArr1.length - 1];

        //image file name
        let imageFileName = '';
             
        // check if the file type is supported
        if (!ext1Arr.includes(ext1)) {
            res.send('FILE_TYPE_NOT_SUPPORTED');
            return false;
        }

        try{
                
            // Check if the destination folder exists, and create it if not
            if (!fs.existsSync(destinationFolder)) {
                fs.mkdirSync(destinationFolder, { recursive: true });
            }

            if(!fs.existsSync(destinationFolderThumb)) {
                fs.mkdirSync(destinationFolderThumb, { recursive: true });
            }


            // Save the image file
            imageFileName = `${Date.now()}-_-${building_image[0].originalname}`; // Rename the file if needed
            const imageFilePath = `${destinationFolder}/${imageFileName}`;
            const imageStream = fs.createWriteStream(imageFilePath);
            imageStream.write(building_image[0].buffer);
            imageStream.end();

            // Save the image thumb file
            const thumbnailFileName = `${Date.now()}-_-${building_image[0].originalname}`; // Rename the file if needed`
            const thumbnailFilePath = `${destinationFolderThumb}/${thumbnailFileName}`;
            sharp(building_image[0].buffer)
                .resize(134,134)
                .toFile(thumbnailFilePath, (err) => {
                    if (err) {
                        console.error('Error creating thumbnail:', err);
                    }
            });

            
        }
        catch(err){
            console.error('Error uploading image files:', err);
            // Handle the error, send a response, or take appropriate action
            res.status(500).send('Error uploading files');
        }

        building_image_name = imageFileName;



    }
    else
    {
        if(flag === 'edit')
        {
            // getting building details
            buildingDetails = await building_db.getBuildingDetById(building_id);
            building_image_name = buildingDetails[0].building_image;
        }
        else
        {
            building_image_name = '';
        }
    }


    // for pdf upload
    if(req.files.building_pdf !== undefined)
    {
        // Define the destination folder for your files
        const destinationFolder2 = './'+process.env.BUILDING_PDF_PATH; // Replace with your desired destination folder
        
        // supported file types array
        const ext2Arr = ['pdf', 'PDF'];

        // store the extension
        let fileNameArr2 = building_pdf[0].originalname.split('.');

        // store the extension
        let ext2 = fileNameArr2[fileNameArr2.length - 1];

        // pdf name
        let pdfFileName = '';
             
        // check if the file type is supported
        if (!ext2Arr.includes(ext2)) {
            res.send('FILE_TYPE_NOT_SUPPORTED');
            return false;
        }

        try{
            // Check if the destination folder exists, and create it if not
            if (!fs.existsSync(destinationFolder2)) {
                fs.mkdirSync(destinationFolder2, { recursive: true });
            }


            // Save the PDF file
            pdfFileName = `${Date.now()}-_-${building_pdf[0].originalname}`; // Rename the file if needed
            const pdfFilePath = `${destinationFolder2}/${pdfFileName}`;
            const pdfStream = fs.createWriteStream(pdfFilePath);
            pdfStream.write(building_pdf[0].buffer);
            pdfStream.end();


        }
        catch(err){
            console.error('Error uploading files:', err);
            // Handle the error, send a response, or take appropriate action
            res.status(500).send('Error uploading pdf files');
        }

        building_pdf_name = pdfFileName;

    }
    else
    {
        if(flag === 'edit')
        {
            // getting building details
            buildingDetails = await building_db.getBuildingDetById(building_id);
            building_pdf_name = buildingDetails[0].building_pdf;
        }
        else
        {
            building_pdf_name = '';
        }
    }



    if(flag === 'add')
    {
        const addBuildingRes = await building_db.addBuilding(building_name,strata_number,building_address,suburb,postcode,additional_info,move_in_out,building_pdf_name,manager_id,building_image_name,publish_status);

        building_id = addBuildingRes.insertId;

        console.log(addBuildingRes);

        // adding building service
        if(buildingServices !== '' && buildingServices !== null && buildingServices !== undefined)
        {
            buildingServices.forEach(async (service) => {
                const serviceArr = service.split(',');
                const title = serviceArr[0];
                const name = serviceArr[1];
                const contactNo = serviceArr[2];

                if(name !== '' && name !== null && name !== undefined)
                {
                    const res = await building_db.AddNewBuildingService(title,name,contactNo,building_id);
                }
            })
        }

        if(addBuildingRes.affectedRows > 0)
        {
            res.send('success_'+building_id);
        }
        else
        {
            res.send('Error occurd');
        }


    }
    else if(flag === 'edit')
    {
        const editBuildingRes = await building_db.editBuilding(building_name,strata_number,building_address,suburb,postcode,additional_info,move_in_out,building_pdf_name,manager_id,building_image_name,publish_status,building_id);

        //delete previous services
        await building_db.deleteBuildingService(building_id);

        // adding building service
        if(buildingServices !== '' && buildingServices !== null && buildingServices !== undefined)
        {
            buildingServices.forEach(async (service) => {
                const serviceArr = service.split(',');
                const title = serviceArr[0];
                const name = serviceArr[1];
                const contactNo = serviceArr[2];

                if(name !== '' && name !== null && name !== undefined)
                {
                    const res = await building_db.AddNewBuildingService(title,name,contactNo,building_id);
                }
            })
        }

        if(editBuildingRes.affectedRows > 0)
        {
            res.send('success_'+building_id);
        }
        else
        {
            res.send('Error occurd');
        }

    }


    if(building_id !== '' && building_id !== null && building_id !== undefined)
    {
        //Move In url string
        const moveInStr = process.env.SITE_URL+'entryForm.php?id='+building_id;

        //Move out url string
        const moveOutStr = process.env.SITE_URL+'exitForm.php?id='+building_id;

        // URL of the QR code API for move in
        const moveInApiUrl = process.env.QR_CODE_API+moveInStr;

        // URL of the QR code API for move out
        const moveOutApiUrl = process.env.QR_CODE_API+moveOutStr;

        //move in and out qr image path
        const moveInUploadsFolder = './'+process.env.MOVE_IN_QR_CODE;
        const moveOutUploadsFolder = './'+process.env.MOVE_OUT_QR_CODE;

        //QR file names
        let moveInFileName = '';
        let moveOutFileName = '';


        try{
            // Get move in image data from the URL
            const { data: moveInImageData } = await axios.get(moveInApiUrl, { responseType: 'arraybuffer' });

            // Get move out image data from the URL
            const { data: moveOutImageData } = await axios.get(moveOutApiUrl, { responseType: 'arraybuffer' });

            // Check if the destination folder exists, and create it if not
            if (!fs.existsSync(moveInUploadsFolder)) {
                fs.mkdirSync(moveInUploadsFolder, { recursive: true });
            }

            if (!fs.existsSync(moveOutUploadsFolder)) {
                fs.mkdirSync(moveOutUploadsFolder, { recursive: true });
            }


            // Write the image data to the destination folder
            moveInFileName = 'movein_'+building_id+'.png'; // rename the file if needed
            const moveInFilePath = `${moveInUploadsFolder}/${moveInFileName}`;
            const moveInQRStream = fs.createWriteStream(moveInFilePath);
            moveInQRStream.write(moveInImageData);
            moveInQRStream.end();

            // Write the image data to the destination folder
            moveOutFileName = 'moveout_'+building_id+'.png'; // rename the file if needed'
            const moveOutFilePath = `${moveOutUploadsFolder}/${moveOutFileName}`;
            const moveOutQRStream = fs.createWriteStream(moveOutFilePath);
            moveOutQRStream.write(moveOutImageData);
            moveOutQRStream.end();

            
        }
        catch(err){
            console.error('Error generating and saving QR codes:', err);
        }

        const updateRes = await building_db.updateBuildingMoveinMoveoutQR(building_id,moveInFileName,moveOutFileName);

        console.log(updateRes);

        
    }



});




const getBuildingDetAndAccess = asyncHandler(async(req, res) => {
    const { flag, flag2 } = req.body;

    let jsonData = '';
    let jsonData2 = '';

    if(flag === 'checkUserAccess')
    {
        const { id, user_id } = req.body;
        const res = await building_db.chkUserBuildingEditAccess(id, user_id);

        if(res)
        {
            // console.log('I have data 😎');
            jsonData = JSON.stringify("ACCESS_GRANTED");
        } 
        else
        {
            // console.log('I am empty 😫');
            jsonData = JSON.stringify("ACCESS_DENIED");
        }
    }

    if(flag === 'checkUserViewAccess')
    {
        const { id, user_id } = req.body;
        const res = await building_db.chkUserBuildingViewAccess(id, user_id);

        if(res)
        {
            // console.log('I have data 😎');
            jsonData = JSON.stringify("ACCESS_GRANTED");
        } 
        else
        {
            // console.log('I am empty 😫');
            jsonData = JSON.stringify("ACCESS_DENIED");
        }
    }

    if(flag === 'building_det')
    {
        const { id } = req.body;
        const buildingDet = await building_db.getBuildingDetById(id);
        // console.log(buildingDet);
        jsonData = JSON.stringify(buildingDet[0]);
    }

    if(flag2 === 'service_det')
    {
        const { id } = req.body;
        const buildingServiceLists = await building_db.getBuildingServiceListById(id);
        const buildingServiceListsArr = [];

        if (buildingServiceLists.length > 0) 
        {
            for (const building of buildingServiceLists) 
            {
              buildingServiceListsArr.push({
                title: building.title,
                serviceName: building.name,
                contactNumber: building.contact_no,
              });
            }
        }

        jsonData2 = JSON.stringify(buildingServiceListsArr);
        // console.log(buildingServiceListsArr);
    }



    res.send(jsonData+"<@^@>"+jsonData2);

});

const deleteBuilding = asyncHandler(async(req, res) => {
    const { id, flag } = req.body;

    // console.log(req.body);
    // return false;

    if(flag === 'delete')
    {
        const result = await building_db.deleteBuildingById(id);
        
        if(result.affectedRows)
        {
            res.send("Building Deleted Successfully");
        }
        else
        {
            res.send("Error occurd");
        }
        // console.log(result);
    }
    else if(flag === 'multiDelete')
    {
        const trimmedId = id.replace(/^,+/g, '');
        const idArray = trimmedId.split(',');
        
        // console.log(idArray);
        idArray.map(async(id) => {
            const result = await building_db.deleteBuildingById(id);

            if(result.affectedRows)
            {
                res.send("Building Deleted Successfully");
            }
            else
            {
                res.send("Error occurd");
            }

        });
    }

});


const buildingLists = asyncHandler(async(req, res) => {
    const { flag, buildingName, buildingStrataNumber, buildingAddress, paginate, currPage, user_id  } = req.body;

    // console.log(req.body);

    if(flag === 'user')
    {

    }
    else
    {
        let buildingListData = await building_db.getBuildingList(buildingName, '',buildingStrataNumber,buildingAddress,paginate,currPage);
        
        // buildingListData is object

        const jsonData = JSON.stringify(buildingListData.dataSet);

        const responseString = `${jsonData}<@_@>${buildingListData.num_pages}<@_@>${buildingListData.currPage}`

        res.send(responseString);

        // console.log(responseString);

        // console.log(typeof(buildingListData));
    }


});


const login = asyncHandler(async (req, res) => {

    const {email, password} = req.body;

    if(email !== '' || password != '')
    {
        const adminDet = await building_db.doLogin(email);

        // console.log(adminDet);

        if(adminDet.length > 0)
        {
            const checkAdmin = await bcrypt.compare(password, adminDet[0].password);
            
            // console.log(await bcrypt.compare(password, adminDet[0].password))

            if(checkAdmin)
            {
                // generate access token string
                const accessToken = jwt.sign(
                    {
                        admin: {
                            username: adminDet.user_name,
                            email: adminDet.email,
                            id: adminDet.id
                        }
                    },
                    process.env.ACCESS_TOKEN,
                    {expiresIn: '60m'}
                )

                // LOGIN SUCCESS code goes here
                res.send("LOGIN_SUCCESS<@_@>"+adminDet[0].id+"<@_@>"+accessToken+"<@_@>admin");
            }
            else
            {
                // LOGIN FAILED code goes here
                res.send("LOGIN_FAILED:WRONG_PASSWORD");
            }
        }
        else
        {
            res.send("LOGIN_FAILED:WRONG_PASSWORD");
        }

        // console.log(adminDet[0].password);
    }
    else
    {
        res.send("LOGIN_FAILED:EMPTY_FIELDS");
    }


});






module.exports = { getUsers, login, getDashboardStats, buildingLists, deleteBuilding, getBuildingDetAndAccess, getManagers, addEditBuilding, updateBuildingPublishStatus, getBuildingAssignDet, deleteUsers }