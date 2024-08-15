import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './VideoGrid.css';
import videoLessons from './videoLessons'; // Массив с информацией о видеоуроках
import { findUserProgressRecord } from '../Login/airtableAPI'; // Функция из airtableAPI.js

const VideoGrid = ({ userId }) => {
  const [completedLessons, setCompletedLessons] = useState([]);
  const [userProgressRecord, setUserProgressRecord] = useState(null); // Состояние для хранения записи о прогрессе пользователя

  useEffect(() => {
    const fetchCompletedLessons = async () => {
      try {
        const progressRecord = await findUserProgressRecord(userId);
        setUserProgressRecord(progressRecord); // Устанавливаем запись о прогрессе пользователя
        if (progressRecord && progressRecord.fields) {
          const completedLessonsIds = Object.keys(progressRecord.fields)
            .filter(field => /^U\d+$/.test(field) && progressRecord.fields[field])
            .map(field => field.replace(/^U/, ''));
          setCompletedLessons(completedLessonsIds); // Устанавливаем список пройденных уроков
        }
      } catch (error) {
        console.error('Error fetching user progress:', error);
      }
    };

    fetchCompletedLessons();
  }, [userId]);

  console.log('Completed Lessons:', completedLessons); // Log completedLessons outside JSX

const getLessonCompletionStatus = (videoId) => {
  if (!userProgressRecord) return null; // Проверяем наличие записи о прогрессе пользователя

  const progressField = `U${videoId}R`; // Поле прогресса для конкретного урока
  const progressValue = userProgressRecord.fields[progressField];

  // Проверяем, присутствует ли текущий урок в списке завершенных и есть ли прогресс для этого урока
  if (completedLessons.includes(videoId.toString()) && progressValue !== undefined) {
    const percentage = progressValue * 100; // Процент прогресса

    console.log(`Відео ${videoId} percentage ${percentage}`);
    return percentage > 50 ? 'completed' : 'not-completed'; // Возвращаем статус в зависимости от процента пройденного
  }

  return null; // Если урок не пройден или нет прогресса, возвращаем null
};



  return (
    <div className="video-grid">
      {videoLessons.map(video => (
        <div key={video.id} className={`video-thumbnail ${completedLessons.includes(video.id.toString()) ? 'completed' : ''}`}>
          <Link to={`/videos/${video.id}`}>
            <img src={`https://img.youtube.com/vi/${video.src.split('/')[3].split('?')[0]}/0.jpg`} alt={video.title} />
            <p>{video.title.split(', ').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}</p>
            {getLessonCompletionStatus(video.id) && (
              <div className={`status-indicator ${getLessonCompletionStatus(video.id)}`}>
                {getLessonCompletionStatus(video.id) === 'completed' ? '✓' : 'X'}
              </div>
            )}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;
