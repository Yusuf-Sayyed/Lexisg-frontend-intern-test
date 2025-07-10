import React, { useState } from "react";
import Modal from "react-modal";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useEffect, useRef } from "react";

// ✅ Use only this
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

Modal.setAppElement("#root");

function App() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const simulatedDatabase = [
    {
      keywords: [
        "motor accident",
        "self-employed",
        "section 166",
        "54–55 years",
        "future prospects",
      ],
      answer:
        "Yes, under Section 166 of the Motor Vehicles Act, 1988, the claimants are entitled to an addition for future prospects even when the deceased was self-employed and aged 54–55 years at the time of the accident. In Dani Devi v. Pritam Singh, the Court held that 10% of the deceased’s annual income should be added as future prospects.",
      citation: {
        text: "“as the age of the deceased at the time of accident was held to be about 54-55 years by the learned Tribunal, being self-employed, as such, 10% of annual income should have been awarded on account of future prospects.” (Para 7 of the document)",
        link: "/Dani_Devi_v_Pritam_Singh.pdf",
      },
    },
  ];

  const handleSubmit = () => {
    if (!query.trim()) return;

    const userMessage = { type: "user", content: query };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setIsLoading(true);

    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      const match = simulatedDatabase.find((entry) =>
        entry.keywords.some((keyword) => lowerQuery.includes(keyword)),
      );

      const assistantMessage = {
        type: "assistant",
        content: match
          ? match.answer
          : "I'm sorry, I couldn't find relevant legal information for your question.",
        citations: match ? [match.citation] : [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-[#343541] text-white">
      {/* Messages Area */}
      <div
        className="flex-1 px-4 py-6 space-y-6 max-w-2xl w-full mx-auto overflow-y-auto custom-scrollbar"
        style={{ maxHeight: "calc(100vh - 180px)" }}
      >
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <h2 className="text-2xl font-semibold mb-2">
                Lexi Legal Assistant
              </h2>
              <p className="text-gray-300">
                Ask me a legal question and I’ll cite real judgments.
              </p>
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
                {msg.citations?.length > 0 && (
                  <div className="mt-3 text-xs border-t border-gray-600 pt-2">
                    <p className="text-gray-300">Citation:</p>
                    <button
                      onClick={() => setModalOpen(true)}
                      className="text-blue-400 underline hover:text-blue-300"
                    >
                      {msg.citations[0].text}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#444654] px-4 py-3 rounded-xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
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
            className="w-full resize-none bg-[#40414f] border border-gray-600 rounded-md px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-green-500"
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
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </form>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="relative max-w-5xl w-full mx-auto mt-20 bg-white p-4 rounded shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50"
      >
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-200 text-yellow-800 px-4 py-2 text-sm rounded-full shadow font-medium z-10">
          📌 Check Para 7 for more details
        </div>

        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">PDF Viewer</h2>
          <button
            onClick={() => setModalOpen(false)}
            className="text-red-500 hover:underline"
          >
            Close
          </button>
        </div>

        <div
          className="border rounded overflow-hidden"
          style={{ height: "600px" }}
        >
          <iframe
            src="/Dani_Devi_v_Pritam_Singh.pdf"
            width="100%"
            height="100%"
            className="border-0"
            title="PDF View"
          />
        </div>
      </Modal>
    </div>
  );
}

export default App;
