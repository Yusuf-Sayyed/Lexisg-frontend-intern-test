import React, { useState } from "react";
import Modal from "react-modal";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "./index.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

Modal.setAppElement("#root");

function App() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
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
    setIsLoading(true);
    setResponse(null);

    setTimeout(() => {
      const lowerQuery = query.toLowerCase();

      const match = simulatedDatabase.find((entry) =>
        entry.keywords.some((keyword) => lowerQuery.includes(keyword)),
      );

      if (match) {
        setResponse({
          answer: match.answer,
          citations: [match.citation],
        });
      } else {
        setResponse({
          answer:
            "I'm sorry, I couldn't find relevant legal information for your question.",
          citations: [],
        });
      }

      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="flex flex-col max-w-2xl w-full mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold">Lexi Legal Assistant</h1>

        {response && (
          <div className="bg-gray-700 p-4 rounded shadow">
            <p>{response.answer}</p>

            {response.citations.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-300">Citation:</p>
                <button
                  onClick={() => setModalOpen(true)}
                  className="text-blue-400 underline text-sm mt-1"
                >
                  {response.citations[0].text}
                </button>
                <p className="text-xs text-green-400 italic mt-1">
                  📌 Highlighted Para 7 (real)
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ChatGPT-style bottom input */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-800 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="flex items-center bg-gray-700 rounded-lg px-4 py-2"
          >
            <input
              type="text"
              placeholder="Ask a legal question..."
              className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="ml-2 text-white bg-blue-600 px-4 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading || !query.trim()}
            >
              {isLoading ? "Thinking..." : "Send"}
            </button>
          </form>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="PDF Viewer"
        className="relative max-w-5xl w-full mx-auto mt-20 bg-white p-4 rounded shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50"
      >
        {/* Floating Badge */}
        <div className="absolute top-2 right-2 bg-yellow-200 text-yellow-800 px-3 py-1 text-xs rounded-full shadow font-medium z-10">
          📌 Highlighted Para 7
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Judgment PDF</h2>
          <button
            onClick={() => setModalOpen(false)}
            className="text-red-500 hover:underline text-sm"
          >
            Close
          </button>
        </div>

        {/* Real PDF Viewer with Highlight */}
        <div
          className="border rounded overflow-auto bg-gray-100"
          style={{ height: "600px" }}
        >
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
