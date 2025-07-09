
import React, { useState } from "react";
import Modal from "react-modal";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

Modal.setAppElement("#root");

function App() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [numPages, setNumPages] = useState(null);

  const simulatedDatabase = [
    {
      keywords: ["motor accident", "self-employed", "section 166"],
      answer:
        "Yes, under Section 166 of the Motor Vehicles Act, 1988, the claimants are entitled to an addition for future prospects...",
      citation: {
        text: "Para 7: 10% of annual income should have been awarded on account of future prospects.",
        link: "/Dani_Devi_v_Pritam_Singh.pdf",
      },
    },
  ];

  const handleSubmit = () => {
    if (!query.trim()) return;

    const userMessage = { type: "user", content: query };
    setMessages(prev => [...prev, userMessage]);
    setQuery("");
    setIsLoading(true);

    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      const match = simulatedDatabase.find((entry) =>
        entry.keywords.some((keyword) => lowerQuery.includes(keyword)),
      );

      const assistantMessage = {
        type: "assistant",
        content: match ? match.answer : "I'm sorry, I couldn't find relevant legal information for your question.",
        citations: match ? [match.citation] : []
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-center px-4 py-3 border-b border-gray-200 relative">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-xs">L</span>
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Lexi Legal Assistant</h1>
        </div>
        <button className="absolute right-4 p-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto" style={{ height: 'calc(100vh - 140px)' }}>
        {messages.length === 0 ? (
          // Welcome Screen
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m-6 4h4" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">How can I help you today?</h2>
              <p className="text-gray-600">Ask me any legal question and I'll provide relevant information with citations.</p>
            </div>
          </div>
        ) : (
          // Chat Messages
          <div className="max-w-3xl mx-auto px-4 py-6 pb-24 space-y-6">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} space-x-3`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-blue-600 ml-3' 
                      : 'bg-green-600 mr-3'
                  }`}>
                    <span className="text-white font-semibold text-sm">
                      {message.type === 'user' ? 'U' : 'L'}
                    </span>
                  </div>
                  
                  {/* Message Content */}
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    
                    {/* Citations */}
                    {message.citations && message.citations.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-600 mb-2">Citation:</p>
                        <button
                          onClick={() => setModalOpen(true)}
                          className="text-blue-600 hover:text-blue-800 underline text-xs"
                        >
                          {message.citations[0].text}
                        </button>
                        <p className="text-xs text-green-600 mt-1">📌 Highlighted Para 7</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">L</span>
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 px-4 py-4 fixed bottom-0 left-0 right-0 bg-white">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="relative">
            <div className="flex items-center justify-center">
              <div className="w-full max-w-xl relative">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask a legal question..."
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows="1"
                  style={{ minHeight: '44px', maxHeight: '80px' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  className="absolute right-2 bottom-2 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* PDF Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="PDF Viewer"
        className="relative max-w-5xl w-full mx-auto mt-20 bg-white p-6 rounded-xl shadow-2xl outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 p-4"
      >
        {/* Floating Badge */}
        <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 px-3 py-1 text-xs rounded-full shadow font-medium z-10">
          📌 Highlighted Para 7
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Judgment PDF</h2>
          <button
            onClick={() => setModalOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* PDF Viewer */}
        <div className="border rounded-lg overflow-auto bg-gray-50" style={{ height: "600px" }}>
          <Document
            file="/Dani_Devi_v_Pritam_Singh.pdf"
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                className="my-4"
                customTextRenderer={({ str }) => {
                  const highlight =
                    str.includes("54-55 years") ||
                    str.includes("future prospects") ||
                    str.includes("age of the deceased");

                  return highlight ? (
                    <mark className="bg-yellow-300 px-1">{str}</mark>
                  ) : (
                    str
                  );
                }}
              />
            ))}
          </Document>
        </div>
      </Modal>
    </div>
  );
}

export default App;
