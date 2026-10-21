const {Router} = require('express');
const controlles = require('../controllers/conrolles');
const {body,validationResult} = require('express-validator');
const authetificateJwts = require('../auths/auth');
const Notes = require('../models/notes')

const router = Router();
const auth = [
    body('name').trim().notEmpty().isLength({min:5}).withMessage('name invalide'),
    body('email').isEmpty().withMessage('email required').isEmail().withMessage('this is not email'),
    body('password').notEmpty().withMessage('password required').isLength({min:8}).withMessage('password was been it length greater then 8')
]
const authss = [
     body('email').isEmpty().withMessage('email required').isEmail().withMessage('this is not email'),
    body('password').notEmpty().withMessage('password required').isLength({min:8}).withMessage('password was been it length greater then 8')
]
router.post('/signup',controlles.post_signup);
router.post('/login',controlles.post_login);
router.post('/create',authetificateJwts.authetificateJwt,controlles.post_create);
router.get('/afficherAllnote',authetificateJwts.authetificateJwt,controlles.get_afficher);

router.delete('/notes/:id',authetificateJwts.authetificateJwt,controlles.delete_note);
router.get('/note/:id',authetificateJwts.authetificateJwt,controlles.detaille_note);
router.get('/logout',authetificateJwts.authetificateJwt,(req,res)=>{
    res.cookie('jwt','',{maxAge: 3 * 24 * 60 * 60 * 1000,httpOnly:true});
    res.status(200).redirect('/login');
})

router.get('/update/:id',authetificateJwts.authetificateJwt,async (req,res)=>{
    const id = req.params.id;
    try{const note = await Notes.findById(id);
    res.render('update',{note})}
    catch(err){
        res.status(404).json({errors:err.massage});
    }
})
router.get('/changePass',(req,res)=>{
    res.render('changePass');
})
router.put('/updates/:id',authetificateJwts.authetificateJwt,controlles.update_note);
router.post('/recoverPassword',controlles.update_get);
router.post('/changePassword',authetificateJwts.authetificateJwt,controlles.change_pass);
router.get('/login/changePass',authetificateJwts.authetificateJwt,(req,res)=>{
    res.redirect('/chnagePass');
})
router.get('/chnagePass',(req,res)=>{
    res.status(201).render('changePass');
})
module.exports = router;