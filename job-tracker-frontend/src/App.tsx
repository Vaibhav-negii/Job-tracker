import React, { useState , useEffect } from "react"
type Application = {
  id : number;
  company : string;
  role : string;
  location :string;
  jobLink : string;
  source : string;
  status : string;
  notes : string | null;
  createdAt : string;

}
const API_URL = "http://localhost:5000";



function App(){
  const [applications,setApplications] = useState<Application[]>([]);
  const [company,setCompany] = useState<string>("");
  const [jobLink,setJobLink] = useState<string>("");
  const [location,setLocation] = useState<string>("");
  const [role,setRole] = useState<string>("");
  const [source,setSource] = useState<string>("");


  async function loadApplications(){
    const response = await fetch(`${API_URL}/api/application`);
    const data = await response.json();
    setApplications(data);
  }
    useEffect(()=>{
  loadApplications();
},[])

  

async function submitForm(e: React.FormEvent<HTMLFormElement>){
  e.preventDefault();
  await fetch(`${API_URL}/api/application`,{
  method :"POST",
  headers: {"Content-Type" : "application/json" },
  body : JSON.stringify({company,jobLink,location,role,source}),
  

  
 
  

})
setCompany("");
setJobLink("");
setLocation("");
setRole("");
setSource("");
loadApplications();
  

}

return(
  <div>
    <h1>Job tracker</h1>
    <form onSubmit={submitForm}>
      <input placeholder="Enter Company name" value={company} onChange={(e)=>setCompany(e.target.value)}/>
      <input placeholder="Enter job"value={jobLink} onChange={(e)=>setJobLink(e.target.value)}/>
      <input placeholder= "Enter location"value={location} onChange={(e)=>setLocation(e.target.value)}/>
      <input placeholder= "Enter role" value={role} onChange={(e)=>setRole(e.target.value)}/>
      <input placeholder="source" value={source} onChange={(e)=>setSource(e.target.value)}/>
      <button type="submit">Add Application</button>
    
      </form>
    <ul>
      
      {applications.map((application)=>(
        <li key={application.id}>{application.company} ,{application.createdAt},{application.id},{application.jobLink},{application.location},{application.notes},{application.role},{application.source},{application.status}</li>

     )) }
    
    </ul>
  </div>
)

  


}
export default App;

