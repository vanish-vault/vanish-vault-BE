import { successResponse } from "../handlers/response.handler";
import * as fileService from "../services/file.service";

export const createTempSignedUrl = async (req: any, res: any, next: any) => {
  try {
    const { filename, contentType, fileSize } = req.body;
    const result = await fileService.createTempSignedUrl(
      req.userId,
      filename,
      contentType,
      fileSize,
    );
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

