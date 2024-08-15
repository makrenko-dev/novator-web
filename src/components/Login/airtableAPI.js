import axios from 'axios';

const API_KEY = 'patJ1nrvWcrwSTtxH.ade66065fa96cdc72f20842a92c32c0154ee675d968965d9f7a06ebef2688667';
const BASE_ID = 'appsCCEeBBRMnVYX0';

const axiosInstance = axios.create({
  baseURL: `https://api.airtable.com/v0/${BASE_ID}`,
  headers: {
    Authorization: `Bearer ${API_KEY}`
  },
  timeout: 10000 // Увеличиваем таймаут до 10 секунд
});

// Функция для получения данных из Airtable
export const fetchDataFromAirtable = async (tableName) => {
  try {
    const response = await axiosInstance.get(`/${tableName}`);
    return response.data.records;
  } catch (error) {
    console.error('Error fetching data from Airtable:', error);
    throw error;
  }
};
export const deleteDataFromAirtable = async (tableName, recordId) => {
  try {
    const response = await axiosInstance.delete(`/${tableName}/${recordId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting data from Airtable:', error);
    throw error;
  }
};

// Функция для добавления данных в Airtable
export const addDataToAirtable = async (tableName, data) => {
  try {
    const response = await axiosInstance.post(`/${tableName}`, {
      fields: data
    });
    return response.data;
  } catch (error) {
    console.error('Error adding data to Airtable:', error);
    throw error;
  }
};

// Функция для обновления данных в Airtable
export const updateDataInAirtable = async (tableName, recordId, data) => {
  try {
    const response = await axiosInstance.patch(`/${tableName}/${recordId}`, {
      fields: data
    });
    return response.data;
  } catch (error) {
    console.error('Error updating data in Airtable:', error);
    throw error;
  }
};

// Функция для создания пользователя в таблице Users
export const createUserInUsersTable = async (userData) => {
  try {
    const response = await addDataToAirtable('Users', userData);
    return response;
  } catch (error) {
    console.error('Error creating user in Users table:', error);
    throw error;
  }
};

// Функция для создания записи прогресса пользователя в таблице UserProgress
export const createUserProgressRecord = async (userID) => {
  try {
    const response = await addDataToAirtable('UserProgress', { UserID: [userID] });
    return response;
  } catch (error) {
    console.error('Error creating user progress record:', error);
    throw error;
  }
};

// Функция для обновления прогресса пользователя
export const updateUserProgressRecord = async (userId, videoId, percentage) => {
  // Преобразовуємо відсоткове значення в десяткове число
  const cleanPercentage = parseFloat(percentage) / 100;

  const videoField = `U${videoId}`;
  const resultField = `U${videoId}R`;
  const data = {
    [videoField]: true,
    [resultField]: cleanPercentage
  };

  try {
    // Знаходимо запис користувача за userId
    const userProgressRecord = await findUserProgressRecord(userId);
   
    // Якщо запис знайдено і має recordId, оновлюємо його дані з data
    if (userProgressRecord && userProgressRecord.recordId) {
      await updateDataInAirtable('UserProgress', userProgressRecord.recordId, data);
      console.log('User progress record updated successfully.');
    } else {
      console.error('User progress record not found for userId:', userId);
    }

    return userProgressRecord; // Повертаємо знайдений запис користувача
  } catch (error) {
    console.error('Error updating user progress record:', error);
    throw error;
  }
};

export const findUserProgressRecord = async (userId) => {
  try {
    const numericUserId = parseInt(userId, 10); // Перетворення userId у числовий тип

  

    // Виконуємо запит до бази даних для отримання всіх записів
    const response = await fetchDataFromAirtable('UserProgress');

    // Перевіряємо, чи є відповідь і чи містить вона записи
    if (response && response.length > 0) {
      
      // Шукаємо запис, де UIDN містить numericUserId
      const foundRecord = response.find(record => {
        const UIDN = record.fields.UIDN; // Отримуємо значення UIDN
        

        // Перевіряємо, чи масив UIDN містить numericUserId
        return UIDN.includes(numericUserId);
      });

      // Якщо знайдено відповідний запис, повертаємо його
      if (foundRecord) {
       
        return {
          recordId: foundRecord.id,
          fields: foundRecord.fields
        };
      } else {
        console.log('Record not found for userId:', numericUserId);
        return null; // Повертаємо null, якщо запис не знайдено
      }
    } else {
      console.log('No records found in Airtable');
      return null; // Повертаємо null, якщо відсутні записи
    }
  } catch (error) {
    console.error('Error finding user progress record:', error);
    throw error;
  }
};
export const findUserById = async (userId) => {
  try {
    // Виконуємо запит до бази даних для отримання всіх записів користувачів
    const response = await fetchDataFromAirtable('Users');
    console.log(userId)
    const numericUserId = parseInt(userId.userID, 10); // Перетворення userId у числовий тип
    // Перевіряємо, чи є відповідь і чи містить вона записи
    if (response && response.length > 0) {
      // Шукаємо запис, де userID має значення userId (змінна, яка передається в функцію)
      const foundUser = response.find(user => {
        const userID = user.fields['UID']; // Отримуємо значення userID (поле в Airtable)
        console.log('chfdytybt',userID)
        console.log(numericUserId)
        // Порівнюємо значення з userId (змінна, яка передається в функцію)
        return userID === numericUserId; // перетворення userId у текстовий тип, оскільки Airtable має поле для збереження як текстовий тип
      });

      // Якщо знайдено відповідного користувача, повертаємо його запис
      if (foundUser) {
        return {
          recordId: foundUser.id,
          fields: foundUser.fields
        };
      } else {
        console.log('User not found for userID:', userId);
        return null; // Повертаємо null, якщо запис не знайдено
      }
    } else {
      console.log('No users found in Airtable');
      return null; // Повертаємо null, якщо відсутні записи
    }
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw error;
  }
};
