const deviceLimit = () => Object.assign(new Error('Ya tienes 10 dispositivos registrados. Desactiva las notificaciones en uno antes de añadir otro.'), {code:'DEVICE_LIMIT_REACHED'});
const tokens = value => [...new Set((Array.isArray(value)?value:[]).filter(token=>typeof token==='string'&&token.length>0&&token.length<=4096))];

/** Rules remain the atomic authority. The preflight only supplies useful feedback
 * and avoids rewriting an already registered device, including legacy lists. */
export async function registerBoundedDevice({token,readTokens,writeToken}) {
  const before=tokens(await readTokens());
  if(before.includes(token))return;
  if(before.length>=10)throw deviceLimit();
  try {await writeToken();}
  catch(error){
    if(String(error?.code||'').includes('permission-denied')){
      let current=[];try{current=tokens(await readTokens());}catch{}
      if(!current.includes(token)&&current.length>=10)throw deviceLimit();
    }
    throw error;
  }
}
