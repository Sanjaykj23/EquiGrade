import { BrowserRouter,Routes,Route} from "react-router-dom";
import Home from "./pages/Home";
import NormaliseQP from "./pages/NormaliseQP";
function App(){
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/normalise" element ={<NormaliseQP />}/>
    </Routes>
    </BrowserRouter>
  );
}
export default App;