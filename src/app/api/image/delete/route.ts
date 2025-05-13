import cloudinary from '@/lib/cloudinary'
import { DeleteApiResponse } from 'cloudinary'

export async function POST(request: Request) {
  try {
    const { public_id } = await request.json()

    if (!public_id) {
      return Response.json({ error: 'No public_id provided' }, { status: 400 })
    }

    const result = await new Promise<DeleteApiResponse>((resolve, reject) => {
      cloudinary.uploader.destroy(
        public_id,
        (error: Error | undefined, result: DeleteApiResponse) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
    })

    return Response.json({ result })
  } catch (error) {
    console.error('Error deleting file:', error)
    return Response.json({ error: 'Error deleting file' }, { status: 500 })
  }
}
