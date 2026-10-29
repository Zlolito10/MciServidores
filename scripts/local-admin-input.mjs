/** Pure setup helpers. Only the stdin reader retains the password; profile writes never receive it. */
export function parseLocalAdminInput(input) {
 if(typeof input!=='string'||Buffer.byteLength(input,'utf8')>16384)throw new Error('Local admin setup input exceeds its limit.');
 let data;try{data=JSON.parse(input);}catch{throw new Error('Provide one JSON object on stdin.');}
 if(!data||typeof data!=='object'||Array.isArray(data))throw new Error('Provide one JSON object on stdin.');
 const username=typeof data.username==='string'?data.username.trim():'';
 if(!/^[A-Za-z0-9_.-]{3,60}$/.test(username)||typeof data.password!=='string'||data.password.length<6||data.password.length>1024)throw new Error('Invalid username or local password (6–1024 characters).');
 const name=typeof data.name==='string'&&data.name.trim()?data.name.trim().slice(0,120):'Administrador local';
 return {username,password:data.password,name};
}
export function localAdminProfile(uid,data,createdAt) {
 return {uid,email:data.username.toLowerCase()+'@church.app',username:data.username,name:data.name,role:'master_admin',assignedMinistries:[],areas:[],preferences:{notifications:false},createdAt};
}
