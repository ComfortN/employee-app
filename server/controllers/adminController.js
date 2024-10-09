const admin = require('../firebase/firebase');

exports.addAdmin = async (req, res) => {
  const { email, password, name, surname, age, idNumber, role } = req.body;
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${name} ${surname}`,
    });
    
    await admin.firestore().collection('admins').doc(userRecord.uid).set({
      name,
      surname,
      age,
      idNumber,
      role: role || 'admin',
      email
    });

    res.status(201).send({ uid: userRecord.uid });
  } catch (error) {
    console.error('Error creating new admin:', error);
    res.status(500).send('Failed to add admin');
  }
};

exports.removeAdmin = async (req, res) => {
  const { uid } = req.params;
  try {
    await admin.auth().deleteUser(uid);
    await admin.firestore().collection('admins').doc(uid).delete();
    res.send('Admin removed successfully');
  } catch (error) {
    console.error('Error removing admin:', error);
    res.status(500).send('Failed to remove admin');
  }
};


exports.getAllAdmins = async (req, res) => {
  try {
    const adminsCollection = await admin.firestore().collection('admins').get();
    
    if (adminsCollection.empty) {
      return res.status(404).send('No admins found');
    }

    const admins = [];
    adminsCollection.forEach(doc => {
      admins.push({ uid: doc.id, ...doc.data() });
    });

    res.json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).send('Failed to fetch admins');
  }
};


exports.getAdminProfile = async (req, res) => {
  try {
    const uid = req.user.uid; // Assuming the auth middleware adds the user to the request
    const adminDoc = await admin.firestore().collection('admins').doc(uid).get();
    
    if (!adminDoc.exists) {
      return res.status(404).send('Admin profile not found');
    }

    const adminData = adminDoc.data();
    res.json(adminData);
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    res.status(500).send('Failed to fetch admin profile');
  }
};