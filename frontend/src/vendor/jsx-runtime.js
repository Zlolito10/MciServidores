// Exact element-construction behavior from the React 19.2 production runtime in the published entry.
// Kept separate from bootstrap so JSX modules do not initialize the application as a side effect.
export const Fragment=Symbol.for('react.fragment');
const elementType=Symbol.for('react.transitional.element');
export function jsx(type,configuration,maybeKey){
 let key=null,props;
 if(maybeKey!==undefined)key=''+maybeKey;
 if(configuration.key!==undefined)key=''+configuration.key;
 if('key' in configuration){props={};for(const name in configuration)if(name!=='key')props[name]=configuration[name];}
 else props=configuration;
 const ref=props.ref;
 return {$$typeof:elementType,type,key,ref:ref!==undefined?ref:null,props};
}
export const jsxs=jsx;
export const jsxRuntime={Fragment,jsx,jsxs};
