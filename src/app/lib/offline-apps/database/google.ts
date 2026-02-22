import { gapi } from 'gapi-script'
import { OfflineBackup, OfflineDB } from './schema';

const CLIENT_ID = process.env.NEXT_PUBLIC_INDEXDB_OFFLINE_GGDRIVE_BACKUP_API_KEY ?? 'YOUR_CLIENT_ID';
const API_KEY = process.env.NEXT_PUBLIC_INDEXDB_OFFLINE_GGDRIVE_BACKUP_CLIENT_ID ?? 'YOUR_API_KEY';

export function initGoogle() {
  return new Promise((resolve) => {
    gapi.load('client:auth2', async () => {
      try {
        await gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: [
            'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
          ],
          scope: 'https://www.googleapis.com/auth/drive.file'
        })
        resolve(true);
      } catch {
        resolve(false);
      }
    })
  })
}

export async function uploadToDrive(accountId: string, version: number, data: OfflineBackup) {
  console.log("Backup", accountId, version, data);

  const fileContent = JSON.stringify(data)
  const file = new Blob([fileContent], { type: 'application/json' })

  const metadata = {
    name: `${accountId}.json`,
    mimeType: 'application/json'
  }

  const accessToken = gapi.auth.getToken().access_token;

  const form = new FormData()
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  )
  form.append('file', file)

  await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
    {
      method: 'POST',
      headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
      body: form
    }
  )
}
