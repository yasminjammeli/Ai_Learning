import React, { useState } from 'react';
import { api } from '../api';

export default function AskQuestion({ document }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async () => {
    if (!question) return;
    setIsLoading(true);
    try {
      const res = await api.post('/ai/ask', {
        question,
        docId: document._id,
      });
      setAnswer(res.data.answer);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la question');
    } finally {
      setIsLoading(false);
    }
  };

  if (!document) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-12 shadow-xl border border-green-200 text-center">
        <div className="bg-white p-6 rounded-xl inline-block mb-4">
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Aucun document sélectionné</h3>
        <p className="text-gray-600 text-lg">Sélectionnez un document pour poser une question</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 shadow-xl border border-green-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl shadow-md">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Poser une Question</h2>
      </div>

      {/* Question Input */}
      <div className="bg-white rounded-xl shadow-md mb-4 overflow-hidden">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Posez votre question sur le document..."
          className="w-full p-5 text-gray-800 outline-none resize-none text-lg"
          rows="5"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleAsk}
        disabled={!question || isLoading}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg flex items-center justify-center gap-3"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Traitement en cours...
          </>
        ) : (
          <>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Poser la question
          </>
        )}
      </button>

      {/* Answer Popup Modal */}
      {answer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          {/* Backdrop with blur */}
          <div 
            className="absolute inset-0  bg-opacity-50 backdrop-blur-sm"
            onClick={() => setAnswer('')}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
            {/* Decorative header gradient */}
            <div className="h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
            
            {/* Header */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 border-b border-green-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      Réponse Générée
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">Basée sur l'analyse du document</p>
                  </div>
                </div>
                <button 
                  onClick={() => setAnswer('')}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Answer Content - Scrollable */}
            <div className="p-8 max-h-[60vh] overflow-y-auto">
              <div className="relative bg-gradient-to-br from-gray-50 to-green-50 rounded-xl p-6 border border-green-100">
                <div className="absolute top-3 left-3 text-6xl text-green-200 font-serif opacity-50">"</div>
                <p className="text-gray-800 leading-relaxed text-lg relative z-10 pl-8 pr-8 whitespace-pre-wrap">
                  {answer}
                </p>
                <div className="absolute bottom-3 right-3 text-6xl text-green-200 font-serif rotate-180 opacity-50">"</div>
              </div>
            </div>

            {/* Footer with actions */}
            <div className="bg-gray-50 p-6 border-t border-gray-200 flex gap-3">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(answer);
                  alert('Réponse copiée !');
                }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copier la réponse
              </button>
              <button 
                onClick={() => setAnswer('')}
                className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-700 rounded-xl transition-all shadow-md hover:shadow-lg font-semibold border border-gray-300"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}