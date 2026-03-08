import NavBar from './Components/NavBar';
import HeroH from './Components/HeroH';
import Cards from './Components/Cards';
import Cta from './Components/Cta';
import Footer from './Components/Footer';
function App() {
  return (
    <div>
      <NavBar />
      <HeroH />
      <Cards />
      <em><h4 style={{margin:"40px" ,color:"white",display:"flex",justifyContent:'center',marginBottom:'-10px'}}>Start Fair Evaluation Today</h4></em>
      <Cta />
      <Footer />
    </div>
  );
}

export default App;