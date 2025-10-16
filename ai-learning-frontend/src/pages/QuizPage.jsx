import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function QuizPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { quiz = [], document } = location.state || {};
  
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showScore, setShowScore] = useState(false);
  const [shuffledQuiz, setShuffledQuiz] = useState([]);

  // Fonction pour mélanger un tableau (Fisher-Yates shuffle)
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Mélanger les options pour chaque question au chargement
  useEffect(() => {
    if (quiz.length > 0) {
      const quizWithShuffledOptions = quiz.map(q => ({
        ...q,
        options: shuffleArray(q.options)
      }));
      setShuffledQuiz(quizWithShuffledOptions);
    }
  }, [quiz]);

  const handleAnswer = (option) => {
    setSelected(option);
    if (option === shuffledQuiz[current].correctAnswer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (current + 1 < shuffledQuiz.length) {
        setCurrent(current + 1);
        setSelected(null);
      } else {
        setShowScore(true);
      }
    }, 1000);
  };

  if (!quiz.length || shuffledQuiz.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Aucun quiz disponible</h2>
          <p className="text-gray-500 mb-6">Veuillez générer un quiz d'abord</p>
          <button 
            onClick={() => navigate('/')} 
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg font-semibold">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  if (showScore) {
    const percentage = Math.round((score / shuffledQuiz.length) * 100);
    const getMessage = () => {
      if (percentage === 100) return "Parfait ! 🏆";
      if (percentage >= 80) return "Excellent ! 🌟";
      if (percentage >= 60) return "Bien joué ! 👍";
      if (percentage >= 40) return "Pas mal ! 💪";
      return "Continue à t'améliorer ! 📚";
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">
              {percentage === 100 ? "🏆" : percentage >= 80 ? "🌟" : percentage >= 60 ? "👍" : percentage >= 40 ? "💪" : "📚"}
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Résultat du Quiz</h1>
            <p className="text-lg text-gray-600">{getMessage()}</p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              {score} / {shuffledQuiz.length}
            </div>
            <p className="text-gray-600 font-medium">Score final : {percentage}%</p>
          </div>

          {/* Barre de progression du score */}
          <div className="mb-6">
            <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-bold text-lg"
          >
            Revenir à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const q = shuffledQuiz[current];
  const progress = ((current + 1) / shuffledQuiz.length) * 100;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full border border-gray-100">
        {/* En-tête avec progression */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-600">
              Question {current + 1} / {shuffledQuiz.length}
            </span>
            <span className="text-sm font-semibold text-purple-600">
              Score: {score}
            </span>
          </div>
          
          {/* Barre de progression animée */}
          <div className="relative bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            >
              {/* Effet de brillance */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 leading-relaxed">{q.question}</h2>
        </div>

        {/* Options de réponse */}
        <div className="space-y-3">
          {q.options.map((option, i) => {
            const isCorrect = option === q.correctAnswer;
            const isSelected = option === selected;
            
            let buttonClass = "w-full text-left px-6 py-4 rounded-xl border-2 transition-all duration-300 font-medium ";
            
            if (selected) {
              if (isCorrect) {
                buttonClass += "bg-green-100 border-green-400 text-green-800 shadow-lg";
              } else if (isSelected) {
                buttonClass += "bg-red-100 border-red-400 text-red-800 shadow-lg";
              } else {
                buttonClass += "bg-gray-50 border-gray-200 text-gray-400";
              }
            } else {
              buttonClass += "bg-white border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-purple-300 hover:shadow-md transform hover:scale-105";
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(option)}
                className={buttonClass}
                disabled={selected !== null}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    selected 
                      ? isCorrect 
                        ? 'bg-green-500 text-white' 
                        : isSelected 
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-300 text-gray-500'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span className="flex-1">{option}</span>
                  {selected && isCorrect && (
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {selected && isSelected && !isCorrect && (
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Info document */}
        {document && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Quiz basé sur : <span className="font-semibold text-gray-700">{document.titre}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}