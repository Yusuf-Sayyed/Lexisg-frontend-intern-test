
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
    <div className="flex flex-col h-screen bg-[#343541] text-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 max-w-2xl w-full mx-auto">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Lexi Legal Assistant</h2>
              <p className="text-gray-300">Ask me a legal question and I’ll cite real judgments.</p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-xl ${
                  msg.type === "user"
                    ? "bg-[#10a37f] text-white"
                    : "bg-[#444654] text-white"
                }`}
              >
                <p className="text-sm">{msg.content}</p>

                {/* Citation */}
                {msg.citations?.length > 0 && (
                  <div className="mt-3 text-xs border-t border-gray-600 pt-2">
                    <p className="text-gray-300">Citation:</p>
                    <button
                      onClick={() => setModalOpen(true)}
                      className="text-blue-400 underline hover:text-blue-300"
                    >
                      {msg.citations[0].text}
                    </button>
                    <p className="text-green-400 mt-1">📌 Highlighted Para 7</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#444654] px-4 py-3 rounded-xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-[#40414f] p-4 fixed bottom-0 left-0 right-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex max-w-2xl mx-auto gap-2"
        >
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Message Lexi..."
            className="w-full resize-none bg-[#40414f] border border-gray-600 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 text-white"
            rows="1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="text-white p-2 rounded-md bg-[#10a37f] hover:bg-[#0f9772] disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="PDF Viewer"
        className="relative max-w-5xl w-full mx-auto mt-20 bg-white p-6 rounded-xl shadow-2xl outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 p-4"
      >
        <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 px-3 py-1 text-xs rounded-full shadow font-medium z-10">
          📌 Highlighted Para 7
        </div>

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
