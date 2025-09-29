import styles from '../css/SpeciesCard.module.css'

const SpeciesCard=({species_name})=>{

    const skeletonStyleOverrides={
        width:"100px",
        height: "75px",
        background: "linear-gradient(90deg,#eee 25%,#ddd 50%,#eee 75%)",
    }
    const imageStyleOverrides={
        width: "100%",
        height: "100%",
    }

    return (
        <div className={styles.Card}>
            <div style={skeletonStyleOverrides}>
                <img loading="lazy" src={"/api/static/images/"+species_name.toLowerCase()+".jpg"} style={imageStyleOverrides} />
            </div>
            <br />
            {species_name}
        </div>
    )
}
export default SpeciesCard
