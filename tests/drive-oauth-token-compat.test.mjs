import test from 'node:test';
import assert from 'node:assert/strict';
import {verifyOwnerTokens,DRIVE_FILE_SCOPE} from '../scripts/lib/drive-oauth-flow.mjs';

test('signed Google owner claims accept only boolean true or literal string true as verified email',async()=>{
 const tokens={access_token:'synthetic-access',refresh_token:'synthetic-refresh',id_token:'synthetic-id'};
 const config={clientId:'synthetic-client',clientSecret:'synthetic-secret',expectedOwnerEmail:'owner@example.test',folderId:'synthetic-folder'};
 const client=verified=>({getTokenInfo:async()=>({aud:config.clientId,expiry_date:Date.now()+600000,scopes:[DRIVE_FILE_SCOPE]}),verifyIdToken:async request=>{assert.deepEqual(request,{idToken:tokens.id_token,audience:config.clientId});return {getPayload:()=>({sub:'synthetic-subject',email:config.expectedOwnerEmail,email_verified:verified})};}});
 for(const value of [true,'true'])assert.equal((await verifyOwnerTokens(client(value),tokens,config)).MCI_DRIVE_OAUTH_EXPECTED_EMAIL,config.expectedOwnerEmail);
 for(const value of [false,'false','TRUE',1,'1',null,undefined,{},[]])await assert.rejects(verifyOwnerTokens(client(value),tokens,config),/OAUTH_OWNER_MISMATCH/);
});
