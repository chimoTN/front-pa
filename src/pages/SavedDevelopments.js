import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const SavedDevelopments = () => {
  const [scripts, setScripts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    Axios.get('http://localhost:8080/api/scripts')
      .then(response => {
        setScripts(response.data);
      })
      .catch(err => {
        console.error('Error fetching scripts:', err);
      });
  }, []);

  const handleRunScript = (script) => {
    navigate('/code', { state: { code: script.content } });
  };

  return (
    <div className="saved-developments">
      <h2>Mes Développements Sauvegardés</h2>
      <DataTable value={scripts} responsiveLayout="scroll">
        <Column field="name" header="Nom" />
        <Column field="language" header="Langage" />
        <Column field="createdAt" header="Date de Création" />
        <Column
          body={(rowData) => (
            <Button
              label="Ouvrir"
              className="p-button-success"
              onClick={() => handleRunScript(rowData)}
            />
          )}
          header="Actions"
        />
      </DataTable>
    </div>
  );
};

export default SavedDevelopments;
