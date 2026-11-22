import { Routes,Route} from "react-router-dom";
import Listpages from "./pages/Listpages";
import Detailepage from"./pages/Detailepage";
export default function App(){
  return(
    <>
    <Routes>
  <Route path="/" element = {<Listpages/>}/>
  <Route path="/application/:id" element = {<Detailepage/>}/>
  </Routes>
  </>
  )
}
