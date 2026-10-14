import React from 'react';
import { Check, X } from 'lucide-react';

const SkillBadge = ({ skill, type = 'default' }) => {
  if (type === 'matched') {
    return (
      <span className="badge badge-green">
        <Check size={12} strokeWidth={3} />
        {skill}
      </span>
    );
  }

  if (type === 'missing') {
    return (
      <span className="badge badge-amber">
        <X size={12} strokeWidth={3} />
        {skill}
      </span>
    );
  }

  return (
    <span className="badge badge-blue">
      {skill}
    </span>
  );
};

export default SkillBadge;
