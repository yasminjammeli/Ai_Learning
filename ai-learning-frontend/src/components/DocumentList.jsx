import React, { useState } from 'react';
import { api } from '../api';

export default function DocumentList({ documents, onSelect, onDocumentDeleted }) {
  const [selectedId, setSelectedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  const handleSelect = (doc) => {
    setSelectedId(doc._id);
    onSelect(doc);
  };

  const confirmDelete = (doc, e) => {
    e.stopPropagation();
    setDocumentToDelete(doc);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!documentToDelete) return;
    
    setDeletingId(documentToDelete._id);
    try {
      await api.delete(`/documents/${documentToDelete._id}`);
      
      // Si le document supprimé était sélectionné, désélectionner
      if (selectedId === documentToDelete._id) {
        setSelectedId(null);
        onSelect(null);
      }
      
      // Notifier le parent pour rafraîchir la liste
      if (onDocumentDeleted) {
        onDocumentDeleted();
      }
      
       setTimeout(() => {
        window.location.reload();
      }, 500);
      
      
      setShowDeleteConfirm(false);
      setDocumentToDelete(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du document');
    } finally {
      setDeletingId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDocumentToDelete(null);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-xl border border-purple-200">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Mes Documents</h2>
        </div>

        {/* Documents List */}
        <div className="space-y-3">
          {documents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 text-lg font-medium">Aucun document disponible</p>
              <p className="text-gray-400 text-sm mt-2">Uploadez votre premier document pour commencer</p>
            </div>
          ) : (
            documents.map((doc) => (
              <div
                key={doc._id}
                onClick={() => handleSelect(doc)}
                className={`p-5 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedId === doc._id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white hover:bg-purple-100 text-gray-800 shadow-md hover:shadow-lg'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    selectedId === doc._id ? 'bg-white bg-opacity-20' : 'bg-purple-100'
                  }`}>
                    <svg className={`w-6 h-6 ${
                      selectedId === doc._id ? 'text-white' : 'text-purple-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-lg">{doc.titre}</span>
                    {selectedId === doc._id && (
                      <p className="text-sm opacity-90 mt-1">Document sélectionné</p>
                    )}
                  </div>
                  
                  {/* Delete Button */}
                  <button
                    onClick={(e) => confirmDelete(doc, e)}
                    disabled={deletingId === doc._id}
                    className={`p-2 rounded-lg transition-all ${
                      selectedId === doc._id
                        ? 'hover:bg-white hover:bg-opacity-20 text-white'
                        : 'hover:bg-red-100 text-red-600'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    title="Supprimer le document"
                  >
                    {deletingId === doc._id ? (
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>

                  {selectedId === doc._id && (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={cancelDelete}
          ></div>
          
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slideUp">
            <div className="h-2 bg-gradient-to-r from-red-500 to-pink-500"></div>
            
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-red-100 p-3 rounded-xl">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Confirmer la suppression</h3>
              </div>

              <p className="text-gray-600 mb-2">Êtes-vous sûr de vouloir supprimer ce document ?</p>
              <p className="text-gray-800 font-semibold mb-6 bg-gray-50 p-3 rounded-lg">
                📄 {documentToDelete?.titre}
              </p>
              <p className="text-sm text-red-600 mb-6">Cette action est irréversible.</p>

              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deletingId}
                  className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingId ? 'Suppression...' : 'Oui, supprimer'}
                </button>
                <button
                  onClick={cancelDelete}
                  disabled={deletingId}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all shadow-md hover:shadow-lg font-semibold disabled:opacity-50"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}