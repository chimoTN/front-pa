import { useEffect, useState } from "react";
import Sidebar from "../components/Header";
import { Button } from "primereact/button";
import CodeEditor from "./codeEditor";
const Accueil = (props) => {

    const [name, setName] = useState("coucou");
    
    const maFonction = () => {
        setName("OUAI")
    }

    useEffect(() => {
        console.log(name)
    }, [name])

    return (
        <>
            Ces ma page home
        </>
    );
};

export default Accueil;
