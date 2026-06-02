// Firestore Database Schema and Operations
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { getDb } from "../config/firebase.js";

// ===== PEMILIHAN (Election) Collection =====
export const pemilihanCollection = "pemilihan";

export const getPemilihanConfig = async (electionId) => {
  try {
    const db = await getDb();
    const docRef = doc(db, pemilihanCollection, electionId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("[Firestore] Error getting pemilihan config:", error);
    throw error;
  }
};

export const setPemilihanConfig = async (electionId, data) => {
  try {
    const db = await getDb();
    const docRef = doc(db, pemilihanCollection, electionId);
    await setDoc(
      docRef,
      {
        ...data,
        updatedAt: Timestamp.now(),
        createdAt: Timestamp.now(),
      },
      { merge: true }
    );
    return electionId;
  } catch (error) {
    console.error("[Firestore] Error setting pemilihan config:", error);
    throw error;
  }
};

// ===== CALON (Candidates) Subcollection =====
export const getCalonByElection = async (electionId) => {
  try {
    const db = await getDb();
    const q = query(collection(db, pemilihanCollection, electionId, "calon"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting calon:", error);
    throw error;
  }
};

export const addCalon = async (electionId, calonData) => {
  try {
    const db = await getDb();
    const calonRef = doc(
      collection(db, pemilihanCollection, electionId, "calon")
    );
    await setDoc(calonRef, {
      ...calonData,
      createdAt: Timestamp.now(),
    });
    return calonRef.id;
  } catch (error) {
    console.error("Error adding calon:", error);
    throw error;
  }
};

export const updateCalon = async (electionId, calonId, updates) => {
  try {
    const db = await getDb();
    const calonRef = doc(db, pemilihanCollection, electionId, "calon", calonId);
    await updateDoc(calonRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating calon:", error);
    throw error;
  }
};

export const deleteCalon = async (electionId, calonId) => {
  try {
    const db = await getDb();
    const calonRef = doc(db, pemilihanCollection, electionId, "calon", calonId);
    await deleteDoc(calonRef);
  } catch (error) {
    console.error("Error deleting calon:", error);
    throw error;
  }
};

// ===== WILAYAH (Region) Subcollection =====
export const getWilayahByElection = async (electionId) => {
  try {
    const db = await getDb();
    const q = query(collection(db, pemilihanCollection, electionId, "wilayah"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting wilayah:", error);
    throw error;
  }
};

export const addWilayah = async (electionId, wilayahData) => {
  try {
    const db = await getDb();
    const wilayahRef = doc(
      collection(db, pemilihanCollection, electionId, "wilayah")
    );
    await setDoc(wilayahRef, {
      ...wilayahData,
      createdAt: Timestamp.now(),
    });
    return wilayahRef.id;
  } catch (error) {
    console.error("Error adding wilayah:", error);
    throw error;
  }
};

export const updateWilayah = async (electionId, wilayahId, updates) => {
  try {
    const db = await getDb();
    const wilayahRef = doc(
      db,
      pemilihanCollection,
      electionId,
      "wilayah",
      wilayahId
    );
    await updateDoc(wilayahRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating wilayah:", error);
    throw error;
  }
};

export const deleteWilayah = async (electionId, wilayahId) => {
  try {
    const db = await getDb();
    const wilayahRef = doc(
      db,
      pemilihanCollection,
      electionId,
      "wilayah",
      wilayahId
    );
    await deleteDoc(wilayahRef);
  } catch (error) {
    console.error("Error deleting wilayah:", error);
    throw error;
  }
};

// ===== PEMILIH (Voters) Subcollection =====
export const getPemilihByElection = async (electionId) => {
  try {
    const db = await getDb();
    const q = query(collection(db, pemilihanCollection, electionId, "pemilih"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting pemilih:", error);
    throw error;
  }
};

export const getPemilihByPhone = async (electionId, phoneNumber) => {
  try {
    const db = await getDb();
    const q = query(
      collection(db, pemilihanCollection, electionId, "pemilih"),
      where("noTelepon", "==", phoneNumber)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.length > 0 ? querySnapshot.docs[0].data() : null;
  } catch (error) {
    console.error("Error getting pemilih by phone:", error);
    throw error;
  }
};

export const addPemilih = async (electionId, pemilihData) => {
  try {
    const db = await getDb();
    const pemilihRef = doc(
      collection(db, pemilihanCollection, electionId, "pemilih")
    );
    await setDoc(pemilihRef, {
      ...pemilihData,
      verified: false,
      voted: false,
      createdAt: Timestamp.now(),
    });
    return pemilihRef.id;
  } catch (error) {
    console.error("Error adding pemilih:", error);
    throw error;
  }
};

export const updatePemilih = async (electionId, pemilihId, updates) => {
  try {
    const db = await getDb();
    const pemilihRef = doc(
      db,
      pemilihanCollection,
      electionId,
      "pemilih",
      pemilihId
    );
    await updateDoc(pemilihRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating pemilih:", error);
    throw error;
  }
};

export const deletePemilih = async (electionId, pemilihId) => {
  try {
    const db = await getDb();
    const pemilihRef = doc(
      db,
      pemilihanCollection,
      electionId,
      "pemilih",
      pemilihId
    );
    await deleteDoc(pemilihRef);
  } catch (error) {
    console.error("Error deleting pemilih:", error);
    throw error;
  }
};

// ===== HASIL (Results) Subcollection =====
export const getHasilByElection = async (electionId) => {
  try {
    const db = await getDb();
    const q = query(collection(db, pemilihanCollection, electionId, "hasil"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting hasil:", error);
    throw error;
  }
};

export const addHasil = async (electionId, hasilData) => {
  try {
    const db = await getDb();
    const hasilRef = doc(
      collection(db, pemilihanCollection, electionId, "hasil")
    );
    await setDoc(hasilRef, {
      ...hasilData,
      createdAt: Timestamp.now(),
    });
    return hasilRef.id;
  } catch (error) {
    console.error("Error adding hasil:", error);
    throw error;
  }
};

export const updateHasil = async (electionId, hasilId, updates) => {
  try {
    const db = await getDb();
    const hasilRef = doc(db, pemilihanCollection, electionId, "hasil", hasilId);
    await updateDoc(hasilRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating hasil:", error);
    throw error;
  }
};

// ===== SUARA OFFLINE (Offline Votes) Subcollection =====
export const getSuaraOfflineByElection = async (electionId) => {
  try {
    const db = await getDb();
    const q = query(
      collection(db, pemilihanCollection, electionId, "suaraOffline")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting suara offline:", error);
    throw error;
  }
};

export const addSuaraOffline = async (electionId, suaraData) => {
  try {
    const db = await getDb();
    const suaraRef = doc(
      collection(db, pemilihanCollection, electionId, "suaraOffline")
    );
    await setDoc(suaraRef, {
      ...suaraData,
      createdAt: Timestamp.now(),
    });
    return suaraRef.id;
  } catch (error) {
    console.error("Error adding suara offline:", error);
    throw error;
  }
};

export const updateSuaraOffline = async (electionId, suaraId, updates) => {
  try {
    const db = await getDb();
    const suaraRef = doc(
      db,
      pemilihanCollection,
      electionId,
      "suaraOffline",
      suaraId
    );
    await updateDoc(suaraRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating suara offline:", error);
    throw error;
  }
};

export const deleteSuaraOffline = async (electionId, suaraId) => {
  try {
    const db = await getDb();
    const suaraRef = doc(
      db,
      pemilihanCollection,
      electionId,
      "suaraOffline",
      suaraId
    );
    await deleteDoc(suaraRef);
  } catch (error) {
    console.error("Error deleting suara offline:", error);
    throw error;
  }
};

// ===== LOG JURNAL (Audit Log) Subcollection =====
export const getLogJurnalByElection = async (electionId) => {
  try {
    const db = await getDb();
    const q = query(
      collection(db, pemilihanCollection, electionId, "logJurnal"),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting log jurnal:", error);
    throw error;
  }
};

export const addLogJurnal = async (electionId, logData) => {
  try {
    const db = await getDb();
    const logRef = doc(
      collection(db, pemilihanCollection, electionId, "logJurnal")
    );
    await setDoc(logRef, {
      ...logData,
      timestamp: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error adding log jurnal:", error);
    throw error;
  }
};

// ===== PENGGUNA (Users) Collection =====
export const usersCollection = "pengguna";

export const getUserByUsername = async (username) => {
  try {
    const db = await getDb();
    const q = query(
      collection(db, usersCollection),
      where("username", "==", username)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.length > 0
      ? { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() }
      : null;
  } catch (error) {
    console.error("Error getting user by username:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const db = await getDb();
    const q = query(collection(db, usersCollection));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting all users:", error);
    throw error;
  }
};

export const getUserByUID = async (uid) => {
  try {
    const db = await getDb();
    const docRef = doc(db, usersCollection, uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

export const setUser = async (uid, userData) => {
  try {
    const db = await getDb();
    const userRef = doc(db, usersCollection, uid);
    await setDoc(
      userRef,
      {
        ...userData,
        createdAt: Timestamp.now(),
      },
      { merge: true }
    );
    return uid;
  } catch (error) {
    console.error("Error setting user:", error);
    throw error;
  }
};

export const updateUser = async (uid, updates) => {
  try {
    const db = await getDb();
    const userRef = doc(db, usersCollection, uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (uid) => {
  try {
    const db = await getDb();
    const userRef = doc(db, usersCollection, uid);
    await deleteDoc(userRef);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// ===== SEED INITIAL USERS =====
export const seedInitialUsers = async () => {
  try {
    const db = await getDb();
    if (!db) {
      throw new Error(
        "Firestore database not initialized. Please ensure Firebase is properly configured."
      );
    }

    console.log("[Firestore] Seeding initial users...");
    const initialUsers = [
      {
        username: "admin",
        password: "admin123",
        role: "admin",
        nama: "Administrator",
      },
      {
        username: "ketua",
        password: "ketua123",
        role: "ketua",
        nama: "Ketua Panitia",
      },
      {
        username: "verifikator",
        password: "verifikator123",
        role: "verifikator",
        nama: "Verifikator",
      },
      {
        username: "coordinator",
        password: "coordinator123",
        role: "coordinator",
        nama: "Koordinator",
      },
    ];

    let successCount = 0;
    let existingCount = 0;
    const errors = [];

    for (const user of initialUsers) {
      try {
        const userRef = doc(db, "pengguna", user.username);
        const existingUser = await getDoc(userRef);

        if (existingUser.exists()) {
          console.log(`[Firestore] User sudah ada: ${user.username}`);
          existingCount++;
        } else {
          await setDoc(userRef, user, { merge: true });
          console.log(`[Firestore] Created user: ${user.username}`);
          successCount++;
        }
      } catch (err) {
        const msg = `User ${user.username}: ${err.message}`;
        console.error(`[Firestore] ${msg}`);
        errors.push(msg);
      }
    }

    const message = `Berhasil membuat ${successCount}/${initialUsers.length} user default. ${existingCount} user sudah ada.`;
    console.log(`[Firestore] ✓ ${message}`);

    return {
      success: true,
      count: successCount,
      total: initialUsers.length,
      message,
      errors,
    };
  } catch (error) {
    console.error("[Firestore] Error seeding initial users:", error);
    throw error;
  }
};

// ===== PEMILIHAN (Election) Collection =====
export const getActiveElection = async () => {
  try {
    const db = await getDb();
    const q = query(
      collection(db, pemilihanCollection),
      where("isActive", "==", true)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.length > 0
      ? { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() }
      : null;
  } catch (error) {
    console.error("Error getting active election:", error);
    throw error;
  }
};

export const getAllElections = async () => {
  try {
    const db = await getDb();
    const q = query(
      collection(db, pemilihanCollection),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting all elections:", error);
    throw error;
  }
};
