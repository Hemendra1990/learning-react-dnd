import HDButton from "./HDButton";
import HDContainer from "./HDContainer";
import HDInput from "./HDInput";
function getRandomUUID() {
    return window.crypto.randomUUID();
}

export const elements = [
    {id: getRandomUUID(), name: "Input", component: HDInput},
    {id: getRandomUUID(), name: "Button", component: HDButton},
    {id: getRandomUUID(), name: "Container", component: HDContainer},
]


export default elements;
export {getRandomUUID}