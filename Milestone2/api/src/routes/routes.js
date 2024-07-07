const userRoutes = require('./user');
const restaurantRoutes = require('./restarant');
const authRoutes = require( './auth');

const APIRouter = require('express').Router();

APIRouter.use('/', userRoutes);
APIRouter.use('/', restaurantRoutes);
APIRouter.use('/', authRoutes);


module.exports = APIRouter;

