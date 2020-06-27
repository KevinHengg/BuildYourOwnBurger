import React from 'react';
import { withRouter } from 'react-router-dom'

import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient'

const burger = (props) => {
    let transformedIngredients = Object.keys( props.ingredients ).map(igKey => {
        //console.log(igKey)
        return [...Array(props.ingredients[igKey])].map((_,i) => {
            //console.log([...Array(props.ingredients[igKey])])
            return <BurgerIngredient key={igKey + i} type={igKey} />
            }); 
        
    }).reduce((arr,el) => {
        return arr.concat(el)
    }, []);
    //console.log(transformedIngredients)
    if (transformedIngredients.length === 0) {
        transformedIngredients = <p>Please start adding ingredients</p>
    }
    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"/>
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom"/>
        </div>
    );
};

//withRouter gives access to match history etc in the higher level component (burgerbuilder)
export default withRouter(burger);