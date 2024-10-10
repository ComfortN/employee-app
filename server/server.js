const express = require('express');
const cors = require('cors');
const employeeController = require('./controllers/employeeController');
const authMiddleware = require('./middleware/auth');
const adminController = require('./controllers/adminController')

const app = express();

app.use(cors());
app.use(express.json());

// Employee routes
const router = express.Router();

router.get('/', employeeController.getAllEmployees);
router.post('/', employeeController.addEmployee);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);
router.get('/former', employeeController.getAllFormerEmployees);

// Admin routes
const adminRouter = express.Router();

adminRouter.post('/login', adminController.login);
adminRouter.post('/add', adminController.addAdmin);
adminRouter.get('/all', adminController.getAllAdmins);
adminRouter.delete('/remove/:uid', adminController.removeAdmin);
adminRouter.get('/profile', authMiddleware, adminController.getAdminProfile);
adminRouter.put('/profile', authMiddleware, adminController.updateAdminProfile);
adminRouter.post('/toggle-block/:uid', adminController.toggleAdminBlock);

app.use('/api/employees', router);
app.use('/api/admin', adminRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;