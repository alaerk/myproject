const {connectDB,app,express} = require('./config/db');
connectDB();
app.use(express.static('public'));
app.use(express.json());