import { useState, useEffect } from 'react';
import { api } from './api';
import UploadDocument from './components/UploadDocument';
import DocumentList from './components/DocumentList';
import AskQuestion from './components/AskQuestion';
import QuizGenerator from './components/QuizGenerator';

function App() {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const fetchDocuments = async () => {
    try {
      const response = await api.get("/documents");
      setDocuments(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des documents:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header avec effet glassmorphism */}
      <header className="bg-white bg-opacity-80 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br ">
              <img
                src='/assets/logo.png'
                alt="Logo AI Learning Assistant"
                className="h-25 w-25 mgr-0"
              />
              
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-950">
                AI Learning Assistant
              </h1>
              <p className="text-gray-600 text-sm mt-1">Votre assistant intelligent pour l'apprentissage</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{documents.length}</p>
                <p className="text-sm text-gray-600">Documents</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{selectedDoc ? '1' : '0'}</p>
                <p className="text-sm text-gray-600">Sélectionné</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">AI</p>
                <p className="text-sm text-gray-600">Actif</p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Layout for Components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <UploadDocument onUpload={() => fetchDocuments()} />
            <DocumentList documents={documents} onSelect={setSelectedDoc} />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <AskQuestion document={selectedDoc} />
            <QuizGenerator document={selectedDoc} />
          </div>
        </div>

        {/* Selected Document Info */}
        {selectedDoc && (
          <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 shadow-xl text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm opacity-90">Document actuel</p>
                  <p className="text-xl font-bold">{selectedDoc.titre}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-all backdrop-blur-sm"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white bg-opacity-80 backdrop-blur-lg border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 text-sm">
              © 2025 AI Learning Assistant. Powered by AI.
            </p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-sm text-gray-600">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                Système actif
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;