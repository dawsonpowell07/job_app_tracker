
import React from 'react';
import Dnd from '../components/dnd';

const Resumes = () => {
  const resumes = [
    { id: 1, name: 'Resume 1.pdf' },
    { id: 2, name: 'Resume 2.pdf' },
    { id: 3, name: 'Resume 3.pdf' },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Resumes</h1>
      <div className="mb-8">
        <Dnd />
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">Your Resumes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {resumes.map(resume => (
            <div key={resume.id} className="border rounded-lg p-4 flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{resume.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resumes;
