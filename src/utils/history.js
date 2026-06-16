import { db, isMock, auth } from '../config/firebase';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

const HISTORY_KEY = 'codelens_analysis_history';
const MAX_HISTORY = 10;

export const saveAnalysis = async (code, language, results) => {
  try {
    const newItem = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      language,
      codePreview: code.split('\n')[0].substring(0, 40) + '...',
      fullCode: code,
      results
    };

    if (!isMock && auth?.currentUser && db) {
      const userRef = collection(db, 'users', auth.currentUser.uid, 'history');
      await addDoc(userRef, newItem);
      return await getHistory(); // Refresh from DB
    } else {
      const history = await getHistory();
      const updatedHistory = [newItem, ...history].slice(0, MAX_HISTORY);
      sessionStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
      return updatedHistory;
    }
  } catch (error) {
    console.error('Failed to save analysis to history:', error);
    return [];
  }
};

export const getHistory = async () => {
  try {
    if (!isMock && auth?.currentUser && db) {
      const userRef = collection(db, 'users', auth.currentUser.uid, 'history');
      const q = query(userRef, orderBy('timestamp', 'desc'), limit(MAX_HISTORY));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data());
    } else {
      const data = sessionStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    }
  } catch (error) {
    console.error('Failed to retrieve history:', error);
    return [];
  }
};

export const clearHistory = () => {
  sessionStorage.removeItem(HISTORY_KEY);
};
