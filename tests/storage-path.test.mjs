import test from 'node:test';
import assert from 'node:assert/strict';
import {extractEmulatorStoragePath} from '../frontend/src/utils/storage-path.js';

test('demo Storage URLs use the authenticated same-origin material download path',()=>{
 const value='http://127.0.0.1:9199/v0/b/demo-mci-servidores.appspot.com/o/events%2Fevent%2Fmaterials%2Farchivo%20de%20prueba.txt?alt=media&token=synthetic';
 assert.equal(extractEmulatorStoragePath(value),'events/event/materials/archivo de prueba.txt');
 assert.equal(extractEmulatorStoragePath(value.replace('127.0.0.1','localhost')),'events/event/materials/archivo de prueba.txt');
 assert.equal(extractEmulatorStoragePath(value.replace('127.0.0.1','[::1]')),'events/event/materials/archivo de prueba.txt');
});

test('the demo parser does not redirect external, production or malformed URLs to local downloads',()=>{
 for (const value of [undefined,'not a URL','http://localhost:9199/v0/b/demo-project/o/%ZZ','http://localhost:9199/v0/b/mcimachala-servidor/o/events%2Fx','http://example.com:9199/v0/b/demo-project/o/events%2Fx','http://localhost:5001/v0/b/demo-project/o/events%2Fx','https://localhost:9199/v0/b/demo-project/o/events%2Fx','http://user@localhost:9199/v0/b/demo-project/o/events%2Fx','http://localhost:9199/other/events%2Fx']) assert.equal(extractEmulatorStoragePath(value),null);
});
