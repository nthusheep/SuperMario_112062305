// FirebaseManager.ts (或其他您的 Firebase 初始化腳本)

// 匯入您需要的函式
import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore, collection, addDoc, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore"; // 匯入 Firestore 相關函式

import { _decorator, Component, game } from 'cc'; // 根據您的 Cocos Creator 版本調整

// 您的 Firebase 設定 (您已提供)
const firebaseConfig = {
  apiKey: "AIzaSyCujNIhXKP5yYW4gk7_oCdoHVwta5FGqDk", // 請注意：在公開的場合分享 API Key 需要謹慎，雖然它本身通常不足以造成安全問題，但最好還是妥善保管。
  authDomain: "mario-fe777.firebaseapp.com",
  projectId: "mario-fe777",
  storageBucket: "mario-fe777.appspot.com", // 注意：您上面寫的是 mario-fe777.firebasestorage.app，但通常 Firebase 控制台提供的是 .appspot.com 格式給 SDK。請再次確認 Firebase 控制台中的設定。如果確認是 .firebasestorage.app 且能正常運作就沒問題。
  messagingSenderId: "364449247510",
  appId: "1:364449247510:web:29a869e86229fcfc7fe037"
};

@ccclass('FirebaseManager')
export class FirebaseManager extends Component {
    public static instance: FirebaseManager = null;

    public app: FirebaseApp;
    public db: Firestore;

    onLoad() {
        if (FirebaseManager.instance === null) {
            FirebaseManager.instance = this;
            game.addPersistRootNode(this.node); // 使此節點在切換場景時不被銷毀
        } else {
            this.destroy();
            return;
        }

        try {
            // 初始化 Firebase App
            this.app = initializeApp(firebaseConfig);

            // 初始化 Firestore
            this.db = getFirestore(this.app);

            console.log("Firebase App and Firestore Initialized successfully!");
            console.log("Firestore instance:", this.db);

        } catch (error) {
            console.error("Firebase initialization failed: ", error);
        }
    }

    // --- Firestore 操作範例 ---

    // 新增資料到集合 (collection)
    async addData(collectionName: string, data: object) {
        if (!this.db) {
            console.error("Firestore not initialized!");
            return null;
        }
        try {
            const docRef = await addDoc(collection(this.db, collectionName), data);
            console.log("Document written with ID: ", docRef.id);
            return docRef.id;
        } catch (e) {
            console.error("Error adding document: ", e);
            return null;
        }
    }

    // 讀取集合中的所有文件
    async getAllDocuments(collectionName: string) {
        if (!this.db) {
            console.error("Firestore not initialized!");
            return [];
        }
        try {
            const querySnapshot = await getDocs(collection(this.db, collectionName));
            const documents = [];
            querySnapshot.forEach((doc) => {
                documents.push({ id: doc.id, ...doc.data() });
            });
            console.log(`Documents from ${collectionName}:`, documents);
            return documents;
        } catch (e) {
            console.error("Error getting documents: ", e);
            return [];
        }
    }

    // 讀取特定文件
    async getDocument(collectionName: string, documentId: string) {
        if (!this.db) {
            console.error("Firestore not initialized!");
            return null;
        }
        try {
            const docRef = doc(this.db, collectionName, documentId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                console.log("No such document!");
                return null;
            }
        } catch (e) {
            console.error("Error getting document: ", e);
            return null;
        }
    }

    // 設定/覆寫特定文件 (如果文件不存在則創建，如果存在則覆寫)
    async setData(collectionName: string, documentId: string, data: object) {
        if (!this.db) {
            console.error("Firestore not initialized!");
            return false;
        }
        try {
            await setDoc(doc(this.db, collectionName, documentId), data);
            console.log("Document successfully written/overwritten!");
            return true;
        } catch (e) {
            console.error("Error writing document: ", e);
            return false;
        }
    }

    // 更新特定文件 (如果文件不存在則操作失敗)
    async updateData(collectionName: string, documentId: string, dataToUpdate: object) {
        if (!this.db) {
            console.error("Firestore not initialized!");
            return false;
        }
        const docRef = doc(this.db, collectionName, documentId);
        try {
            await updateDoc(docRef, dataToUpdate);
            console.log("Document successfully updated!");
            return true;
        } catch (e) {
            console.error("Error updating document: ", e);
            return false;
        }
    }

    // 刪除特定文件
    async deleteData(collectionName: string, documentId: string) {
        if (!this.db) {
            console.error("Firestore not initialized!");
            return false;
        }
        try {
            await deleteDoc(doc(this.db, collectionName, documentId));
            console.log("Document successfully deleted!");
            return true;
        } catch (e) {
            console.error("Error deleting document: ", e);
            return false;
        }
    }
}

function ccclass(arg0: string): (target: typeof FirebaseManager) => void | typeof FirebaseManager {
    throw new Error("Function not implemented.");
}
