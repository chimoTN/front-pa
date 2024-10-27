import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

import 'primereact/resources/themes/saga-blue/theme.css';  // PrimeReact theme
import 'primereact/resources/primereact.min.css';          // core css
import 'primeicons/primeicons.css';                        // icons

const RegistrationForm = () => {

  let navigate = useNavigate();

  const URL = `http://localhost:8080/api/users/signUp`;

  const [formData, setFormData] = useState({
    firstName:'',
    lastName:'',
    email: '',
    password: '',
    confirm: '',
    agreement: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    setFormData(prevState => ({ ...prevState, agreement: e.checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);

    if (formData.password !== formData.confirm) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    register();
  };

  const register = () => {
    Axios.post(URL, {
      mail: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      password: formData.password,
      passwordCheck: formData.confirm
    })
        .then(response => {
          console.log("register", response);
          navigate("/");
        })
        .catch(err => {
          console.log('error => ', err);
        });
  };

  return (
      <div style={{ height: '100vh', marginLeft: "40%", marginTop: 100 }}>
        <Card title="Inscription" style={{ width: '25rem' }}>
          <form onSubmit={handleSubmit}>

            <div className="p-field">
              <label htmlFor="lastName">Nom</label>
              <br/>
              <InputText id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange}
                         required/>
            </div>

            <div className="p-field">
              <label htmlFor="firstName">Prenom</label>
              <br/>
              <InputText id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange}
                         required/>
            </div>


            <div className="p-field">
              <label htmlFor="email">E-mail</label>
              <br/>
              <InputText id="email" name="email" type="email" value={formData.email} onChange={handleInputChange}
                         required/>
            </div>
            <div className="p-field">
              <label htmlFor="password">Mot de passe</label>
              <br/>
              <Password id="password" name="password" value={formData.password} onChange={handleInputChange} required
                        feedback={false}/>
            </div>
            <div className="p-field">
              <label htmlFor="confirm">Confirmer le mot de passe</label>
              <br/>
              <Password id="confirm" name="confirm" value={formData.confirm} onChange={handleInputChange} required
                        feedback={false}/>
            </div>
            <br/>
            <div className="p-field-checkbox">
              <Checkbox inputId="agreement" name="agreement" onChange={handleCheckboxChange}
                        checked={formData.agreement}/>
              <label htmlFor="agreement"> J'ai lu et j'accepte les <a href="/">termes et conditions</a>.</label>
            </div>
            <br/>
            <Button type="submit" label="S'inscrire" className="p-mt-2"/>
          </form>
        </Card>
      </div>
  );
};

export default RegistrationForm;