const admin = require('../firebase/firebase');


exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // First, get the user from Firebase Auth
    const userRecord = await admin.auth().getUserByEmail(email);

    // Then, check if the user is an admin and if they're blocked
    const adminDoc = await admin.firestore().collection('admins').doc(userRecord.uid).get();
    
    if (!adminDoc.exists) {
      return res.status(403).send('Access denied: Not an admin');
    }

    if (adminDoc.data().blocked) {
      return res.status(403).send('Access denied: Admin account is blocked');
    }

    // If not blocked, proceed with the login
    const token = await admin.auth().createCustomToken(userRecord.uid);
    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(401).send('Invalid email or password');
  }
};

exports.addAdmin = async (req, res) => {
  const { email, password, name, surname, age, idNumber, role, image } = req.body;
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
      email,
      image
    });

    res.status(201).send({ uid: userRecord.uid });
  } catch (error) {
    console.error('Error creating new admin:', error);
    res.status(500).send('Failed to add admin');
  }
};


exports.toggleAdminBlock = async (req, res) => {
  const { uid } = req.params;
  try {
    const adminRef = admin.firestore().collection('admins').doc(uid);
    const adminDoc = await adminRef.get();

    if (!adminDoc.exists) {
      return res.status(404).send('Admin not found');
    }

    const currentStatus = adminDoc.data().blocked || false;
    await adminRef.update({ blocked: !currentStatus });

    // If blocking the admin, revoke their Firebase Auth tokens
    if (!currentStatus) {
      await admin.auth().revokeRefreshTokens(uid);
    }

    res.send(`Admin ${!currentStatus ? 'blocked' : 'unblocked'} successfully`);
  } catch (error) {
    console.error('Error toggling admin block status:', error);
    res.status(500).send('Failed to toggle admin block status');
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

    if (!req.user || !req.user.uid) {
      return res.status(401).send('Unauthorized: No user found');
    }
    const uid = req.user.uid;
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


exports.updateAdminProfile = async (req, res) => {
  const uid = req.user.uid; // Get the UID from the authenticated user
  const { name, surname, age, image } = req.body;
  try {
    const adminRef = admin.firestore().collection('admins').doc(uid);
    const adminDoc = await adminRef.get();

    if (!adminDoc.exists) {
      return res.status(404).send('Admin profile not found');
    }

    const currentData = adminDoc.data();
    const updateData = {
      name: name || currentData.name,
      surname: surname || currentData.surname,
      age: age || currentData.age,
    };

    // Add the image field if it's provided or not already present
    if (image || !currentData.hasOwnProperty('image')) {
      updateData.image = image || null;
    }

    await adminRef.update(updateData);
    res.send('Admin profile updated successfully');
  } catch (error) {
    console.error('Error updating admin profile:', error);
    res.status(500).send('Failed to update admin profile');
  }
};