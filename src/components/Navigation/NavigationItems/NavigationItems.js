import React from 'react';

import classes from './NavigationItems.css'
import NavigationItem from './NavigationItem/NavigationItem'
import Aux from '../../../hoc/Auxilary/Auxilary'

const navigationItems = ( props ) => (
    <ul className={classes.NavigationItems}>
        <NavigationItem link="/">Burger Builder</NavigationItem>
        {!props.isAuthenticated 
            ? <NavigationItem link="/auth">Signup/Login</NavigationItem>
            : <Aux>
                <NavigationItem link="/orders">Orders</NavigationItem>
                <NavigationItem link="/Logout">Logout</NavigationItem>
            </Aux>}
    </ul>
);

export default navigationItems;