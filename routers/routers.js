const {Router} = require('express');
const controlles = require('../controllers/conrolles');
const {body,validationResult} = require('express-validator');
const authetificateJwts = require('../auths/auth');
const Notes = require('../models/notes')
const {rateLimit} = require('express-rate-limit');
const authLimiter = rateLimit({
    windowMs:5 * 60 * 1000,
    limit:5,
    standardHeaders:true,
    legacyHeaders:false,
    // message:{error:'too many time to arrive to this webs'}
    handler:(req,res)=>{
        res.redirect(303,'/303');
    }
})
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
router.post('/signup',authLimiter,controlles.post_signup);
router.post('/login',authLimiter,controlles.post_login);
router.post('/create',authetificateJwts.authetificateJwt,controlles.post_create);
router.get('/afficherAllnote',authetificateJwts.authetificateJwt,controlles.get_afficher);

router.delete('/notes/:id',authetificateJwts.authetificateJwt,controlles.delete_note);
router.get('/note/:id',authetificateJwts.authetificateJwt,controlles.detaille_note);
router.get('/logout',authetificateJwts.authetificateJwt,(req,res)=>{
    res.cookie('jwt','',{maxAge: 3 * 24 * 60 * 60 * 1000,httpOnly:true});
    res.status(200).render('login');
})

router.get('/update/:id',authetificateJwts.authetificateJwt,async (req,res)=>{
    const id = req.params.id;
    try{const note = await Notes.findById(id);
    res.render('update',{note})}
    catch(err){
        res.status(404).json({errors:err.massage});
    }
})
router.put('/updates/:id',authetificateJwts.authetificateJwt,controlles.update_note)
module.exports = router;