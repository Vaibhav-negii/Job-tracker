import React, { useState , useEffect } from "react"
import { Link } from "react-router-dom";

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
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";



export default function Listpages(){
  const [applications,setApplications] = useState<Application[]>([]);
  const [company,setCompany] = useState<string>("");
  const [jobLink,setJobLink] = useState<string>("");
  const [location,setLocation] = useState<string>("");
  const [role,setRole] = useState<string>("");
  const [source,setSource] = useState<string>("");
  const [filterStatus,setFilterStatus] = useState<string>("all");
  


  async function loadApplications(){
    
    const response = await fetch(`${API_URL}/api/application`);
    if(!response.ok){
      return;
    }
    const data = await response.json();
    setApplications(data);
  }

    useEffect(()=>{
  loadApplications();
},[])


  

async function submitForm(e: React.FormEvent<HTMLFormElement>){
  e.preventDefault();
  try{
  const response = await fetch(`${API_URL}/api/application`,{
  method :"POST",
  headers: {"Content-Type" : "application/json" },
  body : JSON.stringify({company,jobLink,location,role,source}),
  

  
 
  

})
if(!response.ok){
  const data = await response.json();
  alert(data.error);
  return;
}
setCompany("");
setJobLink("");
setLocation("");
setRole("");
setSource("");
loadApplications();
  }catch{
    alert("network failure");
  }
  

}
const NewApplication = filterStatus === "all" ? applications : applications.filter((a) => a.status === filterStatus);
const WishlistCount = applications.filter((app) =>app.status ==="wishlist").length;
const AppliedCount = applications.filter((app) =>app.status ==="applied").length;
const oaCount = applications.filter((app) =>app.status ==="oa").length;
const interviewCount = applications.filter((app) =>app.status ==="interview").length;
const offerCount = applications.filter((app) =>app.status ==="offer").length;
const rejectedCount = applications.filter((app) =>app.status ==="rejected").length;
const ghostedCount = applications.filter((app) =>app.status ==="ghosted").length;
const AllCount = applications.length;



return(
  <div>
    
    <h1>Job tracker</h1>
    <div>
      
        <strong>Total:</strong>{AllCount}|
        <strong>Applied:</strong>{AppliedCount}|
        <strong>wishlist:</strong>{WishlistCount}
        <strong>Oa:</strong>{oaCount}
        <strong>Interview:</strong>{interviewCount}
        <strong>Offer:</strong>{offerCount}
        <strong>Rejected:</strong>{rejectedCount}
        <strong>Ghosted:</strong>{ghostedCount}
      
    </div>
    <form onSubmit={submitForm}>
      <input placeholder="Enter Company name" value={company} onChange={(e)=>setCompany(e.target.value)}/>
      <input placeholder="Enter job"value={jobLink} onChange={(e)=>setJobLink(e.target.value)}/>
      <input placeholder= "Enter location"value={location} onChange={(e)=>setLocation(e.target.value)}/>
      <input placeholder= "Enter role" value={role} onChange={(e)=>setRole(e.target.value)}/>
      <input placeholder="source" value={source} onChange={(e)=>setSource(e.target.value)}/>
      <button type="submit">Add Application</button>
    
      </form>
         <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
      <option value="all">All</option>
      <option value = "wishlist">Wishlist</option>
      <option value="applied">Applied</option>
      <option value="oa">OA</option>
      <option value="interview">Interview</option>
      <option value="offer">Offer</option>
      <option value="rejected">Rejected</option>
      <option value="ghosted">Ghosted</option>
      
     
      </select>
   
      <ul>
        
      {NewApplication.map((application) =>(
        <li key={application.id}><Link to = {`/application/${application.id}`}>{application.company}</Link>
        {"-"}
        {application.status}
        {"-"}
        {application.role}
        </li>

      ))}
      
        
    
    </ul>
    

  </div>
)

  


}


