const admin = require('../firebase/firebase');
const db = admin.firestore();

exports.getAllEmployees = async (req, res) => {
    try {
        const snapshot = await db.collection('employees').get();
        const employees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addEmployee = async (req, res) => {
    try {
        const { name, email, phone, position, id } = req.body;
        await db.collection('employees').doc(id).set({
        name, email, phone, position, id
        });
        res.status(201).json({ message: 'Employee added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, position } = req.body;
        await db.collection('employees').doc(id).update({
            name, email, phone, position
        });
        res.json({ message: 'Employee updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


exports.deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employeeDoc = await db.collection('employees').doc(id).get();
        if (!employeeDoc.exists) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        const employeeData = employeeDoc.data();

        // Add to former employees collection
        await db.collection('formerEmployees').doc(id).set(employeeData);

        // Delete from current employees collection
        await db.collection('employees').doc(id).delete();

        res.json({ message: 'Employee moved to former employees successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


exports.getAllFormerEmployees = async (req, res) => {
    try {
        const snapshot = await db.collection('formerEmployees').get();
        const formerEmployees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(formerEmployees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}