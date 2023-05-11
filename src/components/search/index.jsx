import React from 'react'
import './style.css'
import { useState, useEffect, useContext } from 'react'
import { ThemeContext } from '../../App';

function Search(props) {

    const {theme} = useContext(ThemeContext);

    const {getDataFromSearchComponent, apiCalledSuccess, setApiCalledSuccess} = props;

    const [inputValue, setInputValue] = useState(''); // initial value

    const handleInputValue = (event) => {
        const {value} = event.target;
        // Sets the updated value
        setInputValue(value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        getDataFromSearchComponent(inputValue);
    }

    useEffect(() => {
        if (apiCalledSuccess) {
            setInputValue('');
            setApiCalledSuccess(false);
        }
    }, [apiCalledSuccess, setApiCalledSuccess])

    return (
        
        <form onSubmit={handleSubmit} className='Search'>
            <input name='search' onChange={handleInputValue} value={inputValue}placeholder='Search Recipes' id='search' type="text" />
            <button 
            style={theme ? {backgroundColor : "#12343b"} : {}}
            type="submit"
            >
                Search Recipes
            </button>
        </form>
    )
}

export default Search