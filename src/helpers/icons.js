import React from 'react'
import { Home, Lock, Category, Fastfood, Person, LocalShipping } from '@material-ui/icons';

export const FHLockIcon = 'lockIcon';
export const FHHomeIcon = 'homeIcon';
export const FHCategoryIcon = 'categoryIcon';
export const FHProductIcon = 'productIcon'
export const FHPerson = 'person'
export const FHLocalShipping = 'localShipping'

export const getIcon = (iconName) => {
    switch (iconName) {
        case FHLockIcon:
            return <Lock/>;
        case FHHomeIcon:
            return <Home/>;
        case FHCategoryIcon:
            return <Category/>;
        case FHProductIcon:
            return <Fastfood/>;
        case FHPerson:
            return <Person/>;
        case FHLocalShipping:
            return <LocalShipping/>;
        default:
            throw Error('Icon not found');
    }
};