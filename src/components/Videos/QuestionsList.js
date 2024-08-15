import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { updateUserProgressRecord, findUserProgressRecord } from '../Login/airtableAPI';
import { useNavigate } from 'react-router-dom'; // Імпортуємо useNavigate

const correctAnswers = {
  1: {
    1: 'Ціна протягом дня коливалася без чіткої тенденції.',
    2: 'Вона має маленьке тіло вгорі і довгий ґнот внизу, що свідчить про можливе розвороту після зниження.',
    3: 'Торгівля проти тренду передбачає купівлю акції, яка, як очікується, скоро змінить напрямок. Торгівля за трендом передбачає слідування за поточним трендом.',
    4: 'Все вищезазначене.'
  },
  2: {
    1: 'Ринок був нестабільним і не було багато динаміки.',
    2: 'Трейдер торгує цілий день.',
    3: 'Розпочати додатковий заробіток.',
    4: 'ENVO'
  },
  3: {
    1: 'Люди частіше розміщують ордери на продаж на круглі суми в доларах, тому що їх легко запам\'ятати.',
    2: 'Ця філософія зосереджена на купівлі акцій, які ось-ось вийдуть з фази консолідації.',
    3: 'Це гарна можливість купити акцію, тому що ціна, ймовірно, зросте після короткого відкоту.',
    4: 'Усі вищезазначені згадані у відео.'
  },
  4: {
    1: 'Ціна відкриття, ціна закриття, максимум і мінімум',
    2: 'Стандартний доджі, висячий чоловік доджі та надгробний камінь доджі',
    3: 'Бути послідовним, дотримуючись стратегії та заробляючи трохи грошей щоразу',
    4: 'YouTube-канал спікера та посилання на його PDF-стратегію невеликого рахунку'
  }
};

const QuestionsList = ({ videoId, questions, userId }) => {
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [isTestActive, setIsTestActive] = useState(true);
  const [finish, setFinish] = useState(null);
  const navigate = useNavigate(); // Отримуємо функцію navigate з react-router-dom

  useEffect(() => {
    const checkUserProgress = async () => {
      try {
        const userProgressRecord = await findUserProgressRecord(userId);
        const isLessonCompleted = userProgressRecord && userProgressRecord.fields[`U${videoId}`];

        if (isLessonCompleted) {
          setIsTestActive(false);
          setFinish(userProgressRecord.fields[`U${videoId}R`]);
        }
      } catch (error) {
        console.error('Error checking user progress:', error);
      }
    };

    checkUserProgress();
  }, [userId, videoId]);

  const handleChange = (questionId, answer) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!isTestActive) {
        console.log('You have already completed this test for this video.');
        return;
      }

      const newResults = questions.map(question => {
        const correctAnswer = correctAnswers[videoId] ? correctAnswers[videoId][question.id] : null;
        return {
          id: question.id,
          isCorrect: answers[question.id] === correctAnswer
        };
      });

      setResults(newResults);
      setAttempts(attempts + 1);

     // внутрішній код компоненту handleSubmit
        if (attempts + 1 === 2) {
          const correctCount = newResults.filter(result => result.isCorrect).length;
          const percentage = ((correctCount / questions.length) * 100).toFixed(1);
          setFinish(percentage);

          await updateUserProgressRecord(userId, videoId, percentage);
          window.location.reload(); // примусове перезавантаження сторінки
        }

    } catch (error) {
      console.error('Error handling user submission:', error);
    }
  };

  return (
    <Box>
      {!isTestActive && finish * 100 > 50 && (
        <Typography variant="h6">Ви успішно пройшли цей урок! Ваш результат: {finish * 100}%</Typography>
      )}
      {!isTestActive && finish * 100 <= 50 && (
        <Box>
          <Typography variant="h6">Ви не пройшли цей урок! Ваш результат: {finish * 100}%</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setAnswers({});
              setResults(null);
              setAttempts(0);
              setIsTestActive(true);
            }}
          >
            Пересдати
          </Button>
        </Box>
      )}

      {isTestActive && questions.map(question => (
        <Box key={question.id} mb={4}>
          <Typography variant="h6">{question.text}</Typography>
          <FormControl component="fieldset">
            <RadioGroup
              value={answers[question.id] || ''}
              onChange={(e) => handleChange(question.id, e.target.value)}
            >
              {question.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>
          {results && (
            <Typography color={results.find(r => r.id === question.id).isCorrect ? 'green' : 'red'}>
              {results.find(r => r.id === question.id).isCorrect ? 'Правильно' : 'Неправильно'}
            </Typography>
          )}
        </Box>
      ))}

      {isTestActive && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={attempts >= 2}
        >
          Перевірити відповіді
        </Button>
      )}

      {results && attempts === 2 && (
        <Typography variant="h6">
          Ваш результат: {results.filter(result => result.isCorrect).length} з {questions.length}
        </Typography>
      )}
    </Box>
  );
};

export default QuestionsList;
