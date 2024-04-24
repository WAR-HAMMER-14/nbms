const express = require('express');
const router = express.Router();
const multer = require('multer');


const upload = multer();

const {getUsers, login, getDashboardStats, buildingLists, deleteBuilding, getBuildingDetAndAccess, getManagers, addEditBuilding, updateBuildingPublishStatus, getBuildingAssignDet, deleteUsers } = require('../controllers/adminController');

const validateToken = require('../middleware/validateTokenHandler');


router.route('/login').post(upload.none(),login);
router.route('/getAdminDashboardStats').post(validateToken,upload.none(),getDashboardStats);
router.route('/buildingLists').post(validateToken,upload.none(),buildingLists);
router.route('/updateBuilding').post(validateToken,upload.none(),deleteBuilding);
router.route('/buildingDet').post(validateToken,upload.none(),getBuildingDetAndAccess);
router.route('/getManagers').post(validateToken,getManagers);
router.route('/addEditBuilding').post(validateToken,upload.fields([
    { name: 'building_image', maxCount: 1 },
    { name: 'building_pdf', maxCount: 1 },
  ]), addEditBuilding);
router.route('/updateBuildingPublishStatus').post(validateToken,upload.none(), updateBuildingPublishStatus);
router.route('/getUsersList').post(validateToken,upload.none(),getUsers);
router.route('/buildingAssignDet').post(validateToken,upload.none(),getBuildingAssignDet);
router.route('/updateUser').post(validateToken,upload.none(),deleteUsers);


module.exports = router;