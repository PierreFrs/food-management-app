import React from 'react';
import { useState, useEffect, useReducer, useContext, useCallback, useMemo } from 'react';
import './style.css';
import Search from '../../components/search';
import RecipeItem from '../../components/recipe-item';
import FavoriteItem from '../../components/favorite-item';
import { ThemeContext } from '../../App';

const reducer = (state, action) => {
  switch (action.type) {
    case 'filterFavorites':
      return {
        ...state,
        filteredValue : action.value
      };
    default:
      return state;
  }
}

const initialState = {
  filteredValue : ''
}

function Homepage() {
  // loading state
  const [loadingState, setLoadingState] = useState(false);

  // save results received from api
  const [recipes, setRecipes] = useState([]);

  // favorite data state
  const [favorites, setFavorites] = useState([]);

  // state for api is successfull or not
  const [apiCalledSuccess, setApiCalledSuccess] = useState(false);

  // use reducer functionality
  const [filteredState, dispatch] = useReducer(reducer, initialState)

  const {theme} = useContext(ThemeContext);
    
  const getDataFromSearchComponent = (getData) => {
    // keep the loading state as true before we are calling the api
    setLoadingState(true);

    // calling the API
    async function getRecipes() {
      const apiResponse = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.REACT_APP_API_KEY}&query=${getData}`);
      const result = await apiResponse.json();
      const {results} = result;
      if (results && results.length > 0) {
        // set the loading state as false again
        setLoadingState(false);        
        // set the recipes state
        setRecipes(results);
        // set the api success to true
        setApiCalledSuccess(true);
      }
    }
    getRecipes();
  };

  const addToFavorites = useCallback((getCurrentRecipeItem) => {
    let copyFavorites = [...favorites];
    const index = copyFavorites.findIndex(item => item.id === getCurrentRecipeItem.id);
    if(index === -1) {
      copyFavorites.push(getCurrentRecipeItem);
      setFavorites(copyFavorites);
      // save favorites in local storage
      localStorage.setItem('favorites', JSON.stringify(copyFavorites));
      window.scrollTo({top: '0', behavior: 'smooth'});
    } else {
      alert('Item is already present in favorites')
    }
  }, [favorites])

  const removeFromFavorites = (getCurrentId) => {
    let copyFavorites = [...favorites];
    copyFavorites = copyFavorites.filter(item => item.id !== getCurrentId);
    setFavorites(copyFavorites);
    localStorage.setItem('favorites', JSON.stringify(copyFavorites))
  }

  useEffect(() => {
    const extractFavoritesFromLocalStorageOnPageLoad = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(extractFavoritesFromLocalStorageOnPageLoad);
  }, [])

  // filter the favorites
  const filteredFavoritesItems = favorites && favorites.length > 0 ? favorites.filter(item => item.title.toLowerCase().includes(filteredState.filteredValue)) : [];

  const renderRecipes = useCallback(() => {
    if (recipes && recipes.length > 0) {
      return (
        recipes.map((item) => (<RecipeItem 
          addToFavorites={() => addToFavorites(item)} 
          id={item.id} 
          image={item.image} 
          title={item.title}
        />))
      )
    }
  }, [recipes, addToFavorites]);

  return (
    <div>
        <Search 
        getDataFromSearchComponent={getDataFromSearchComponent}
        apiCalledSuccess={apiCalledSuccess}
        setApiCalledSuccess={setApiCalledSuccess}
        />
        {/* show favorites */}
          <div className="favorites-wrapper">
            <h1 style={theme ? {color : "#12343b"} : {}} className='favorites-title'>Favorites</h1>

              <div className="search-favorites">
                <input 
                onChange={(event) => dispatch({ type : 'filterFavorites', value : event.target.value })}
                value={filteredState.filteredValue}
                name="searchfavorites"
                placeholder='Search Favorites'
                type="text" />
              </div>

            <div className="favorites">
              {
                !filteredFavoritesItems.length && <div style={{display : 'flex', justifyContent: 'center', width: '100%'}} className='no-items'>No favorites are found</div>
              }
              {
                filteredFavoritesItems && filteredFavoritesItems.length > 0 ?
                filteredFavoritesItems.map(item => (
                  <FavoriteItem
                  removeFromFavorites = {() => removeFromFavorites(item.id)}
                  id={item.id} 
                  image={item.image} 
                  title={item.title} 
                  />
                )) : null
              }
            </div>
          </div>
        {/* show favorites */}
        {/* show loading state */}
        {
          loadingState && <div className='loading'>Loading...</div>
        }
        {/* show loading state */}

        {/* map through all the recipes*/}
        <div className="items">
          
            {/* renderRecipes() */}
            {
              useMemo(() =>
                !loadingState && recipes && recipes.length > 0 ?
                recipes.map((item) => (<RecipeItem 
                  addToFavorites={() => addToFavorites(item)} 
                  id={item.id} 
                  image={item.image} 
                  title={item.title}
                  />))
                : null
              , [loadingState, recipes, addToFavorites])
            }
          
          {/* {
            recipes && recipes.length > 0 ?
            recipes.map((item) => (<RecipeItem 
            addToFavorites={() => addToFavorites(item)} 
            id={item.id} 
            image={item.image} 
            title={item.title}
            />)) : null
          } */}
        </div>
        {/* map through all the recipes*/}
        {
          !loadingState && !recipes.length && <div className='no-items'>No Recipes are found</div>
        }
    </div>
  )
}

export default Homepage;