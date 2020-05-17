import { ActionTypes } from 'const';

const initialState = {
    twitchName: "",
    clips: [],
    currentClipIndex: 0
}

export default function (state = initialState, action) {
    switch (action.type) {
        case ActionTypes.SET_USER: {
            return Object.assign({}, state, {
                twitchName: typeof action.twitchName === "undefined" ?
                    state.name : action.twitchName
            });
        }
        default:
            return state;
    }
}