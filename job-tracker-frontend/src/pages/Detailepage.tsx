import { Link, useParams } from "react-router-dom";
import { useState , useEffect } from "react";
type Application={
    company : string;
    role : string;
    status : string;
    id : number;

}
 
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


export default  function Detailepage(){
       const {id} = useParams();
    const [error,setError] = useState("");
const [application,setApplication] = useState<Application|null>(null);
    
    useEffect(()=>{
        async function loadApplication(){
            
    
    try{
        setError("");
        setApplication(null);

    const response = await fetch(`${API_URL}/api/application/${id}`);
    if(!response.ok){
        const data = await response.json();
        setError(data.error);
        return;
        
        
    }
    const data = await response.json();
    setApplication(data);



    }catch(err){
        console.error("Something went wrong while fetching:", err);
        setError("Network failure");
        

    }
} 
loadApplication();
},[id])

    return(
        <>
        <Link to = "/" >back</Link>
        <h1>Application detail :{id}</h1>
        {!error && !application &&
            <p>loading</p>
        } 
        {error && <h1>{error}</h1>}
        {application && !error && <h1>{application.company} - {application.status} -{application.role}</h1>}



          


        </>
    )

}
