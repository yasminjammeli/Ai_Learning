import React, { useState } from 'react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';

export default function QuizGenerator({ document }) {
  const [quiz] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();


  const handleGenerate = async () => {
  setIsGenerating(true);
  try {
    const res = await api.post('/ai/quiz', { docId: document._id, nbQuestions: 10 });
    navigate('/quiz', { state: { quiz: res.data.quiz, document } });
  } catch (err) {
    console.error(err);
    alert('Erreur génération quiz');
  } finally {
    setIsGenerating(false);
  }
};

  if (!document) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-12 shadow-xl border border-amber-200 text-center">
        <div className="bg-white p-6 rounded-xl inline-block mb-4">
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Aucun document sélectionné</h3>
        <p className="text-gray-600 text-lg">Sélectionnez un document pour générer un quiz</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 shadow-xl border border-amber-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-3 rounded-xl shadow-md">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Générer un Quiz</h2>
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-xl p-5 mb-6 shadow-md">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-gray-700 font-medium">Document actuel : <span className="text-amber-600 font-bold">{document.titre}</span></p>
            <p className="text-gray-500 text-sm mt-1">Un quiz de 10 questions sera généré automatiquement</p>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg flex items-center justify-center gap-3"
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Génération en cours...
          </>
        ) : (
          <>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Générer le Quiz
          </>
        )}
      </button>

      {/* Quiz Display */}
      {quiz && (
        <div className="mt-6 bg-white rounded-xl p-6 shadow-lg border-l-4 border-amber-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-amber-100 p-2 rounded-lg">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <strong className="text-xl font-bold text-gray-800">Quiz Généré :</strong>
          </div>
          <div className="bg-amber-50 rounded-lg p-5">
            <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed text-base">
              {quiz}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}