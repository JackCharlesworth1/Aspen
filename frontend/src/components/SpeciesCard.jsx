import styles from '../css/SpeciesCard.module.css'

const SpeciesCard=({species_name,scientific_name=null,tabled=false,active=true})=>{

    const imageStyleOverrides={
        width: "100%",
        height: "100%",
    }

    return (
        <div className={active?styles.ActiveCard:styles.InactiveCard}>
            <div className={tabled?styles.TabledCard:styles.Card}>
                <div className={styles.SkeletonStyle}>
                    <img loading="lazy" src={"https://api.theaspenproject.cloud/api/static/images/"+species_name.replace(" ","_").toLowerCase()+".jpg"} style={imageStyleOverrides} />
                </div>
                <br />
                <p className={styles.SpeciesNameTitle}>
                    {species_name}
                </p>
                {scientific_name&&<p className={styles.ScientificName}>
                    {scientific_name}
                </p>}
            </div>
        </div>
    )
}
export default SpeciesCard
