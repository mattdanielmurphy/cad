import type { NextApiRequest, NextApiResponse } from 'next'

import { writeFileSync } from 'fs';

type ResponseData = {
  message: string
}
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
	const fileString = req.body
	writeFileSync('test-file.dxf', fileString, "utf8")
  res.status(200).json({ message: 'File written successfully.' })
}