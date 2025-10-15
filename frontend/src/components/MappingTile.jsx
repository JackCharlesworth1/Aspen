import {useState,useEffect} from 'react'
import styles from '../css/MappingTile.module.css'
import leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css'

const MappingTile=({species_name})=>{
    useEffect(()=>{
        if(!document.getElementById('map')._leaflet_id){
            const viewport_width=document.documentElement.clientWidth;
            const image_bounds=[[-85.0511,-180],[85.0511,180]] //Longitude and lattiude bounds for projection
            const map_object=leaflet.map('map',{
                center: [0,0],
                zoom: (viewport_width>1000?1.8:0.2),
                zoomControl: false,
            })
            map_object.setMaxBounds(image_bounds)
            map_object.setMinZoom(1.8);
            map_object.setMaxZoom(1.8);
            //map_object.dragging.disable();
            map_object.scrollWheelZoom.disable()
            leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',subdomains:['a','b','c']}).addTo(map_object)
            leaflet.imageOverlay("/api/static/images/maps/" + species_name.toLowerCase().replace(" ","_") + ".png", image_bounds).addTo(map_object);

            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    if (entry.target.id === "map") {
                        map.invalidateSize();
                    }
                }
            });
            resizeObserver.observe(document.getElementById("map"));



            return () => {
                if (map_object) {
                    map_object.remove();
                }
            };

        }
    },[species_name])
    return(
        <>
            <div className={styles.map_container}>

                <div id="map" className={styles.map_widget} style={{height:(document.documentElement.clientWidth>1000?'700px':'500px'),width:'92%'}}></div>
                <div className={styles.map_tint_overlay}></div>
            </div>
        </>
    )
}
export default MappingTile
