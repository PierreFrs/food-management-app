import React from 'react'
import { useContext } from 'react';
import { ThemeContext } from '../../App';
import './style.css'

function FavoriteItem(props) {

    const {id, image, title, removeFromFavorites} = props;
    const {theme} = useContext(ThemeContext);

  return (
    <div key={id} className='favorite-item'>
        <div>
            <img src={image} alt="image of recipe" />
        </div>
        <h2 style={theme ? {color : "#12343b"} : {}}>{title}</h2>
        <button 
        type="button" 
        style={theme ? {backgroundColor : "#12343b"} : {}}
        onClick={removeFromFavorites}
        >
          Remove From Favorites
        </button>
        <p></p>
    </div>
  )
}

export default FavoriteItem;