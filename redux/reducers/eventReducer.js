import { FETCH_EVENTS_FAILURE, FETCH_EVENTS_REQUEST, FETCH_EVENTS_SUCCESS } from "../actions/actionEvent";

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const eventReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_EVENTS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_EVENTS_SUCCESS:
      return { ...state, loading: false, list: action.payload };
    case FETCH_EVENTS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default eventReducer;