import type { Response } from "express";

interface IResponse<T> {
  res: Response;
  statusCode?: number;
  success?: boolean;
  message?: string;
  data?: T;
}

export const sendResponse = <T>({
  res,
  statusCode = 200,
  success = true,
  message = "Success",
  data,
}: IResponse<T>) => {
  res.status(statusCode).json({
    success,
    message,
    data,
  });
};
