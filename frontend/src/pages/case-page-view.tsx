import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BaseCaseView from './base-case-view';
import { type Case } from "../types";

const CaseDetailView = () => {
  const { id } = useParams();
  const [caseItem, setCaseItem] = useState<Case>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCaseById = async (caseId: string) => {
    const baseURL = import.meta.env.VITE_API_URL;
    try {
      const response = await fetch(`${baseURL}/cases/${caseId}`);
      if (!response.ok) {
        throw new Error('Case not found');
      }
      const data = await response.json() as Case;
      setCaseItem(data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load case');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      void fetchCaseById(id);
    }
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
  <>
  {caseItem ?
    <>
    <p style={{ color: 'black' }}>{caseItem.client.name}</p>
    <BaseCaseView item={caseItem} />
    </> : null}
  </>
  );
};

export default CaseDetailView;
