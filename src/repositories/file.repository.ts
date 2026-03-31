import { AppDataSource } from "../config/data-source";
import { File } from "../entities/File";
import { In } from "typeorm";

export const insertFile = async (file: Partial<File>) => {
  return AppDataSource.getRepository(File).save(file);
};

export const findFileByIds = async (ids: string[]) => {
  return AppDataSource.getRepository(File).find({ where: { id: In(ids) } });
};

export const updateFile = async (id: string, data: Partial<File>) => {
  return AppDataSource.getRepository(File).update(id, data);
};

export const deleteFilesByIds = async (ids: string[]) => {
  if (!ids.length) return;
  return AppDataSource.getRepository(File).delete({ id: In(ids) });
};
