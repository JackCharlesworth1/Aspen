const TaxonomyInfo=({taxonomy_info})=>{
    return (
            <div id="taxonomy_info">
                {taxonomy_info.Kingdom&&<p>Kingdom: {taxonomy_info.Kingdom}</p>}
                {taxonomy_info.Phylum&&<p>Phylum: {taxonomy_info.Phylum}</p>}
                {taxonomy_info.Order&&<p>Order: {taxonomy_info.Order}</p>}
                {taxonomy_info.Family&&<p>Family: {taxonomy_info.Family}</p>}
                {taxonomy_info.Genus&&<p>Genus: {taxonomy_info.Genus}</p>}
            </div>
    )
}

export default TaxonomyInfo
