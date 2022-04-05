import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import session from './session';
import sevenDayAvailability from './sevenDayAvailability';
import selectedDateAvailability from './selectedDateAvailability';
import selectedDateWaitlist from './selectedDateWaitlist';
import reservations from './reservations';
import errors from './errors';

const rootReducer = combineReducers({
  session,
  sevenDayAvailability,
  selectedDateAvailability,
  selectedDateWaitlist,
  reservations,
  errors
});


let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk));
}
// TODO: add logger to applyMiddleware params to log redux iin development again
const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
