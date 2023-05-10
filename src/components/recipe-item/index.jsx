import React from 'react'
import { useContext } from 'react';
import { ThemeContext } from '../../App';
import './style.css'

function RecipeItem(props) {

    const {id, image, title, addToFavorites} = props;
    const {theme} = useContext(ThemeContext);

  return (
    <div key={id} className='recipe-item'>
        <div>
            <img src={image} alt="image of recipe" />
        </div>
        <h2 style={theme ? {color : "#12343b"} : {}}>{title}</h2>
        <button 
        type="button" 
        style={theme ? {backgroundColor : "#12343b"} : {}} 
        onClick={addToFavorites}
        >
          Add to Favorites
        </button>
    </div>
  )
}

export default RecipeItem;