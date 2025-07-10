// components/CitationCard.jsx
import React from "react";

const CitationCard = ({ citation, onClick }) => {
  return (
    <>
      <p className="text-gray-300">Citation:</p>
      <button
        onClick={onClick}
        className="text-blue-400 underline hover:text-blue-300"
      >
        {citation.text}
      </button>
    </>
  );
};

export default CitationCard;
