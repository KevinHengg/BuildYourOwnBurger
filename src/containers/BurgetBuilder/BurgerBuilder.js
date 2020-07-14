import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import Aux from '../../hoc/Auxilary/Auxilary'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import axios from '../../axious-order';
import * as actions from '../../store/actions/index'

/* Transferred to reducer.js file for redux
const INGREDIENT_PRICES =  {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}
*/

const burgerBuilder = props => {
    const [purchasing, setPurchasing] = useState(false);
    
    const dispatch = useDispatch();
    const ings = useSelector(state => {
        return state.burgerBuilder.ingredients
    }) 
    const price = useSelector(state => state.burgerBuilder.totalPrice)
    const error = useSelector(state => state.burgerBuilder.error)
    const isAuthenticated = useSelector(state => state.auth.token !== null)

    const onIngredientAdded = (ingName) => dispatch(actions.addIngredient(ingName));
    const onIngredientRemoved = (ingName) => dispatch(actions.removeIngredient(ingName));
    const onInitIngredients = useCallback(() => dispatch(actions.initIngredients()),[dispatch]);
    const onInitPurchase = () => dispatch(actions.purchaseInit());
    const onSetAuthRedirectPath = (path) => dispatch(actions.setAuthRedirectPath(path));

    useEffect(() => {
        onInitIngredients()
    }, [onInitIngredients] )

    const updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients).map(igKey => {
            return ingredients[igKey];
        }).reduce((sum, el) => {
            return sum + el;
        }, 0);
        return sum > 0;
    }

    const purchaseHandler = () => {
        if (isAuthenticated) {
            setPurchasing(true)
        } else {
            onSetAuthRedirectPath('/checkout')
            props.history.push('/auth')
        }      
    }

    const purchaseCancelHandler = () => {
        setPurchasing(false)
    }

    const purchaseContinueHandler = () => {
        onInitPurchase();
        props.history.push('/checkout');
    }
    const disabledInfo = {
        ...ings
    }
    for (let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;
    let burger = error ? <p>Ingredients can't be loaded</p> : <Spinner/>
    
    /* removed with redux update
    if (this.state.loading) {
        orderSummary = <Spinner/>
    }
    */

    if (ings) {
        burger = (
            <Aux>
                <Burger ingredients={ings} />
                <BuildControls
                        ingredientAdded={onIngredientAdded}
                        ingredientRemoved={onIngredientRemoved} 
                        disabled={disabledInfo}
                        ordered={purchaseHandler}
                        purchasable={updatePurchaseState(props.ings)}
                        isAuth={isAuthenticated}
                        price={price}/>
            </Aux>
        );
        orderSummary = <OrderSummary 
                ingredients={ings}
                purchaseCancelled={purchaseCancelHandler}
                purchaseContinued={purchaseContinueHandler} 
                price={price}/>
    };
    
    return (
        <Aux>
            <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                {orderSummary}
            </Modal>
            {burger}
        </Aux>  
    );
    
};

/* changed to useSelector and useDispatch
const mapStateToProps = state => {
    return {
         
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path)),
    }
}
*/

export default withErrorHandler(burgerBuilder, axios);