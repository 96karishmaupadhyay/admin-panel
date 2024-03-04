import logo from './logo.svg';
import './App.css';
import {useEffect,useState} from "react"
import axios from "axios"
import Table from './Components/Table';
function App() {
  const [data,setData]=useState([])
  const fetching=async()=>{
    let url="https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    let res=await axios.get(url)
    setData(res.data)
    //console.log(res.data)
  }
  useEffect(()=>{
    fetching()
  },[])
  return (
    <div className="App">
    <h1>Admin Ui Page</h1>
     <Table data={data} setData={setData}/>
    </div>
  );
}

export default App;
