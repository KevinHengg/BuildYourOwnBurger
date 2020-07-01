import React, { Component } from 'react';
import { connect } from 'react-redux'

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

class BurgerBuilder extends Component {
    state = {
       purchasing: false,
    };

    componentDidMount() {
        this.props.onInitIngredients();
        /*axios.get('https://byob-48b08.firebaseio.com/Ingredients.json')
            .then(response => {
                this.setState({ingredients: response.data});
            })
            .catch(error => {
                this.setState({error: true});
            });
    */
   }

    updatePurchaseState (ingredients) {
        const sum = Object.keys(ingredients).map(igKey => {
            return ingredients[igKey];
        }).reduce((sum, el) => {
            return sum + el;
        }, 0);
        return sum > 0;
    }
/* Removed and replaced with redux
    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) {
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    };
*/
    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false})
    }

    purchaseContinueHandler = () => {
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }
    render () {
        const disabledInfo = {
            ...this.props.ings
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;
        let burger = this.props.error ? <p>Ingredients can't be loaded</p> : <Spinner/>
        
        /* removed with redux update
        if (this.state.loading) {
            orderSummary = <Spinner/>
        }
        */

       if (this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                            ingredientAdded={this.props.onIngredientAdded}
                            ingredientRemoved={this.props.onIngredientRemoved} 
                            disabled={disabledInfo}
                            ordered={this.purchaseHandler}
                            purchasable={this.updatePurchaseState(this.props.ings)}
                            price={this.props.price}/>
                </Aux>
            );
            orderSummary = <OrderSummary 
                    ingredients={this.props.ings}
                    purchaseCancelled={this.purchaseCancelHandler}
                    purchaseContinued={this.purchaseContinueHandler} 
                    price={this.props.price}/>
        };
        
        return (
          <Aux>
              <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
              </Modal>
              {burger}
          </Aux>  
        );
    }
};

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit())
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));