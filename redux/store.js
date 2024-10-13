import { applyMiddleware, combineReducers, createStore } from "redux";
import appReducer from "./reducers/appReducer";
import {thunk} from "redux-thunk";
import eventReducer from "./reducers/eventReducer";



const rootReducer = combineReducers({
    events: eventReducer,
    users: appReducer
});
const store = createStore(rootReducer,applyMiddleware(thunk));

export default store