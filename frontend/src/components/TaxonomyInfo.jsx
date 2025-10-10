import styles from "../css/TaxonomyInfo.module.css"

const TaxonomyInfo=({taxonomy_info})=>{
    return (
            <div id="taxonomy_info" className={styles.TaxonomyContainer}>
            <h3 className={styles.TaxonomyTitle}>Taxonomy</h3>
                <ul className={styles.TaxonomyTable}>
                    {taxonomy_info.Kingdom&&<li className={styles.Kingdom}>Kingdom: <p style={{'--highlight-color':'#F00'}} className={styles.InlineHighlight}>{taxonomy_info.Kingdom}</p></li>}
                    {taxonomy_info.Phylum&&<li className={styles.Phylum}>Phylum: <p style={{'--highlight-color':'#F80'}} className={styles.InlineHighlight}>{taxonomy_info.Phylum}</p></li>}
                    {taxonomy_info.Order&&<li className={styles.Order}>Order: <p style={{'--highlight-color':'#FF0'}} className={styles.InlineHighlight}>{taxonomy_info.Order}</p></li>}
                    {taxonomy_info.Family&&<li className={styles.Family}>Family: <p style={{'--highlight-color':'#0F0'}} className={styles.InlineHighlight}>{taxonomy_info.Family}</p></li>}
                    {taxonomy_info.Genus&&<li className={styles.Genus}>Genus: <p style={{'--highlight-color':'#0FF'}} className={styles.InlineHighlight}>{taxonomy_info.Genus}</p></li>}
                </ul>
            </div>
    )
}

export default TaxonomyInfo
