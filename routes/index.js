var express = require('express');
var router = express.Router();
const indexController = require('../controllers/indexController')
const snippet = require('../models/snippet')

// GET home page
router.get('/', indexController.getHome)

// POST search/:tag page
router.post('/', indexController.postSearch)

// GET search/:tag page
router.get('/search/:tag', indexController.getSearch)

// GET add-snippet page
router.get('/add-snippet', indexController.getAdd)

// POST add-snippet
router.post('/add-snippet', indexController.postAdd)

// GET delete-snippet/:id page
router.get('/delete-snippet/:id', indexController.getDel)

// GET edit-snippet page
router.get('/edit-snippet/:id', indexController.getEdit)

// POST edit-snippet/:id page
router.post('/edit-snippet/:id', indexController.postEdit)

module.exports = router;
