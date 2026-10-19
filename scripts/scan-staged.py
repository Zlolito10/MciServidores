"""Check staged files without printing matching credential contents."""
import pathlib,re,subprocess,sys
root=pathlib.Path(__file__).resolve().parents[1]
names=subprocess.check_output(['git','diff','--cached','--name-only','-z','--diff-filter=ACM'],cwd=root).decode().split('\0')
patterns={
 'private_key':rb'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----\s*(?:\\n)?[A-Za-z0-9+/=]{40,}',
 'github_token':rb'(?:ghp_|github_pat_)[A-Za-z0-9_]{30,}',
 'google_oauth_access':rb'ya29\.[A-Za-z0-9_-]{50,}',
 'google_oauth_refresh':rb'1//[A-Za-z0-9_-]{50,}',
 'signed_url':rb'X-Goog-Signature=[A-Fa-f0-9]{30,}',
}
findings=[]
for name in names:
 if not name:continue
 path=pathlib.PurePosixPath(name)
 if ('private' in path.parts or path.name=='.env' or path.suffix in ['.zip','.tar','.gz','.har','.bundle']):findings.append({'path':name,'kind':'private_file'})
 data=subprocess.check_output(['git','show',':'+name],cwd=root)
 if name=='scripts/scan-staged.py':continue
 for kind,pattern in patterns.items():
  if re.search(pattern,data):findings.append({'path':name,'kind':kind})
print('Staged credential scan:', 'passed' if not findings else 'FAILED')
for finding in findings:print(finding)
sys.exit(bool(findings))
