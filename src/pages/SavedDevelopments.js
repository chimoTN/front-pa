import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import '../style/SavedDevelopments.scss'; // Assurez-vous de créer ce fichier CSS

const SavedDevelopments = () => {
  const [scripts, setScripts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    Axios.get('https://projet-annuel-1.onrender.com/api/scripts')
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
      <DataTable value={scripts} responsiveLayout="scroll" className="p-datatable-custom">
        <Column field="name" header="Nom" sortable />
        <Column field="language" header="Langage" sortable />
        <Column field="createdAt" header="Date de Création" sortable />
        <Column
          body={(rowData) => (
            <Button
              label="Ouvrir"
              icon="pi pi-external-link"
              className="p-button-rounded p-button-success"
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
