import { ResponseStructureType } from './types';

export const responseStructure = ({
  data,
  res,
  statusCode = 200,
}: ResponseStructureType) => res.status(statusCode).json({ data });
