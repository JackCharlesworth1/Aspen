import {useState,useEffect,useRef} from 'react'
import {useNavigate} from 'react-router-dom'
import styles from '../css/AdminDashboardTable.module.css'

const AdminDashboardPage=()=>{
    const navigate=useNavigate();
    const [tableData,setTableData]=useState(null);
    const isMounted=useRef(true)

    const updateTable=async ()=>{
        console.log("Fetching data")
        const token=localStorage.getItem("accessToken")
        const results=await fetch("https://api.theaspenproject.cloud/api/species/",{headers:{"Authorization":token}});
        if(!results.ok){
            console.log("Error making species fetch request",results.status,results.body)
            if(isMounted.current){
                return navigate("/admin/request-error")
            }
        }
        try{
            const data=await results.json()
            console.log("Collected data successfully",data)
            setTableData(data);
        }catch(error){
            console.log("Error converting fetched species data to json: ",error) 
            if(isMounted.current){
                return navigate("/admin/request-error")
            }
        }
    }

    useEffect(()=>updateTable();isMounted.current=false,[]);
    return (
        <>
            {tableData ? (<table className={styles.DashboardTable}>
                    <thead>
                        <tr>
                            <td><div className={styles.DashboardTableItem}>Species Name</div></td>
                            <td><div className={styles.DashboardTableItem}>Species Description</div></td>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((species,index)=>(
                            <tr className={styles.DashboardTableRow} key={index}>
                                <td><div className={styles.DashboardTableItem}>{species.SpeciesName}</div></td>
                                <td><div className={styles.DashboardTableItem}>{species.SpeciesDescription}</div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>):(<p>loading</p>)}
        </>
    )
}
export default AdminDashboardPage;
