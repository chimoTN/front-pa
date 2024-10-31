import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import CompilateurService from '../services/compilateurService';

const SavedDevelopments = () => {
  const [scripts, setScripts] = useState([]);
  const navigate = useNavigate();

  const compilateurService = CompilateurService();

  useEffect(() => {
    Axios.get('https://projet-annuel-1.onrender.com/api/scripts')
      .then(response => {
        setScripts(response.data);
      })
      .catch(err => {
        console.error('Error fetching scripts:', err);
      });
  }, []);


  const handleRunScript = async (script) => {
    try {
      const response = await compilateurService.recupContent(script.id);
      const scriptContent = response.data;
  
      navigate('/newEditor', { state: { code: scriptContent } }); 
    } catch (error) {
      console.error("Erreur lors de la récupération du script:", error);
    }
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