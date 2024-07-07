const userRoutes = require('./user');
const restaurantRoutes = require('./restaurant');
const authRoutes = require( './auth');
const setEntryRoutes = require('./set_entries');
const favoriteRoutes = require('./favorite');
const setRoutes = require('./set');

const APIRouter = require('express').Router();

APIRouter.use(userRoutes);
APIRouter.use(restaurantRoutes);
APIRouter.use(authRoutes);
APIRouter.use(setEntryRoutes);
APIRouter.use(favoriteRoutes);
APIRouter.use(setRoutes);


module.exports = APIRouter;

