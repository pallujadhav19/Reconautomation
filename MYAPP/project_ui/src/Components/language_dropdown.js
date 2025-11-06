import React from 'react';
import "../Components/language_dropdown.css"


const Languageoption= (props)=>{
    return(
        
        <select className="custom-dropdown" onChange={props.onChange}>
            <option>Select Language</option>
            <option value={'en'}>English</option>
            <option value={'mr'}>Marathi</option>
            <option value={'te'}>Telugu</option>
            <option value={'kn'}>Kannada</option>
        </select>
    )
}

export default Languageoption;