// components/AnswerCard.jsx
import React from "react";
import CitationCard from "./CitationCard";

const AnswerCard = ({ content, citation, onCitationClick }) => {
  return (
    <div>
      <p className="text-sm">{content}</p>
      {citation && (
        <div className="mt-3 text-xs border-t border-gray-600 pt-2">
          <CitationCard citation={citation} onClick={onCitationClick} />
        </div>
      )}
    </div>
  );
};

export default AnswerCard;

